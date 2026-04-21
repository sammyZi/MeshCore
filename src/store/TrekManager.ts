import { supabase } from '../auth/supabase';
import { DatabaseManager } from '../database/DatabaseManager';
import { CryptoManager } from '../crypto/CryptoManager';
import { Buffer } from '@craftzdog/react-native-buffer';

export interface MapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export class TrekManager {

  /**
   * 5.3 Validate trek name
   */
  static validateTrekName(trekName: string): { isValid: boolean; error?: string } {
    if (!trekName || trekName.trim().length === 0) {
      return { isValid: false, error: 'Trek name cannot be empty or only whitespace' };
    }
    if (trekName.length > 64) {
      return { isValid: false, error: 'Trek name must be 64 characters or less' };
    }
    const regex = /^[a-zA-Z0-9 \-_]+$/;
    if (!regex.test(trekName)) {
      return { isValid: false, error: 'Trek name can only contain alphanumeric characters, spaces, hyphens, and underscores' };
    }
    return { isValid: true };
  }

  /**
   * 5.5 Validate join code
   */
  static validateJoinCode(joinCode: string): { isValid: boolean; code?: string; error?: string } {
    const code = joinCode.toUpperCase().trim();
    if (code.length !== 6) {
      return { isValid: false, error: 'Join code must be exactly 6 characters' };
    }
    const regex = /^[A-Z0-9]{6}$/;
    if (!regex.test(code)) {
      return { isValid: false, error: 'Join code can only contain alphanumeric characters' };
    }
    return { isValid: true, code };
  }

  /**
   * 5.1 Implement trek creation API integration
   */
  static async createTrek(
    trekName: string,
    mapRegion: MapRegion,
    emergencyContact: EmergencyContact
  ): Promise<{ trek_id: string; join_code: string }> {
    const defaultUserId = 'current-user-id'; // Normally derived from Auth or Session

    const { isValid, error } = this.validateTrekName(trekName);
    if (!isValid) throw new Error(error);

    // Call Supabase to create trek (RPC or Insert)
    const { data: trekData, error: trekError } = await supabase
      .from('treks')
      .insert({
        trek_name: trekName,
        map_region: JSON.stringify(mapRegion),
        emergency_contact: JSON.stringify(emergencyContact),
      })
      .select('trek_id, join_code')
      .single();

    let trekId: string;
    let joinCode: string;

    if (trekError || !trekData) {
      throw new Error(`Failed to create trek in Supabase: ${trekError?.message || 'Unknown error'}`);
    } else {
      trekId = trekData.trek_id;
      joinCode = trekData.join_code;
    }

    const serviceUuid = CryptoManager.deriveServiceUUID(trekId);

    // 5.9 Store trek metadata in Local_Database
    await DatabaseManager.getInstance().insertTrek({
      trek_id: trekId,
      trek_name: trekName,
      join_code: joinCode,
      leader_id: defaultUserId,
      start_time: new Date(),
      status: 'active',
      map_region: JSON.stringify(mapRegion),
      service_uuid: serviceUuid,
      emergency_contact: JSON.stringify(emergencyContact),
      geofence: null,
    });

    // Store current user as a member
    const userProfile = await DatabaseManager.getInstance().getUser(defaultUserId);
    if (userProfile) {
      await DatabaseManager.getInstance().insertTrekMember({
        trek_id: trekId,
        user_id: defaultUserId,
        display_name: userProfile.display_name,
        avatar_color: userProfile.avatar_color,
        public_key: userProfile.public_key,
        node_id: userProfile.node_id,
        joined_at: new Date(),
        status: 'active',
      });
    }

    return { trek_id: trekId, join_code: joinCode };
  }

  /**
   * 5.7 Implement trek joining API integration
   */
  static async joinTrek(joinCodeInput: string): Promise<void> {
    const { isValid, code, error } = this.validateJoinCode(joinCodeInput);
    if (!isValid || !code) throw new Error(error);

    // Call Supabase to validate join code and get metadata
    const { data: trekData, error: trekError } = await supabase
      .from('treks')
      .select('*')
      .eq('join_code', code)
      .single();

    if (trekError || !trekData) {
      throw new Error('Join code invalid or network error');
    }

    const trekId = trekData.trek_id;
    const serviceUuid = CryptoManager.deriveServiceUUID(trekId);

    // Ensure we don't duplicate
    const existingTrek = await DatabaseManager.getInstance().getTrek(trekId);
    if (!existingTrek) {
      await DatabaseManager.getInstance().insertTrek({
        trek_id: trekId,
        trek_name: trekData.trek_name,
        join_code: code,
        leader_id: trekData.leader_id || 'unknown',
        start_time: new Date(trekData.start_time || Date.now()),
        status: 'active',
        map_region: trekData.map_region,
        service_uuid: serviceUuid,
        emergency_contact: trekData.emergency_contact,
        geofence: trekData.geofence,
      });
    }

    // Call Supabase to get members
    const { data: membersData, error: membersError } = await supabase
      .from('trek_members')
      .select('*')
      .eq('trek_id', trekId);

    if (!membersError && membersData) {
      for (const member of membersData) {
        await DatabaseManager.getInstance().insertTrekMember({
          trek_id: trekId,
          user_id: member.user_id,
          display_name: member.display_name,
          avatar_color: member.avatar_color,
          public_key: Buffer.from(member.public_key, 'base64') as any, // Expecting base64 from server
          node_id: member.node_id,
          joined_at: new Date(member.joined_at || Date.now()),
          status: 'active',
        });
      }
    }
  }

  /**
   * 5.9 Implement trek metadata retrieval
   */
  static async getTrekMetadata(trekId: string) {
    return DatabaseManager.getInstance().getTrek(trekId);
  }

  /**
   * 5.10 Fetch trek members
   */
  static async getTrekMembers(trekId: string) {
    return DatabaseManager.getInstance().getTrekMembers(trekId);
  }

  /**
   * 5.11 Implement emergency contact info management
   */
  static async updateEmergencyContact(trekId: string, emergencyContact: EmergencyContact): Promise<void> {
    const contactStr = JSON.stringify(emergencyContact);
    
    // Local DB update
    await DatabaseManager.getInstance().updateTrek(trekId, {
      emergency_contact: contactStr
    });

    // Backend update (async)
    await supabase.from('treks')
      .update({ emergency_contact: contactStr })
      .eq('trek_id', trekId);
  }
}
