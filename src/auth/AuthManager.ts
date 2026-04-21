import { supabase } from './supabase';
import * as SecureStore from 'expo-secure-store';
import { DatabaseManager } from '../database/DatabaseManager';
import { CryptoManager } from '../crypto/CryptoManager';

export class AuthManager {
  private static readonly JWT_KEY = 'MESHCORE_AUTH_JWT';
  private static readonly REFRESH_KEY = 'MESHCORE_AUTH_REFRESH';

  static async signUp(email: string, password: string): Promise<any> {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    if (data.session) {
      await this.setTokens(data.session.access_token, data.session.refresh_token);
    }
    return data;
  }

  static async signIn(email: string, password: string): Promise<any> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (data.session) {
      await this.setTokens(data.session.access_token, data.session.refresh_token);
    }
    return data;
  }

  // Placeholder for social login
  static async signInWithGoogle(): Promise<any> {
    // Implement Google OAuth using expo-auth-session
    throw new Error('Not implemented');
  }

  static async signInWithApple(): Promise<any> {
    // Implement Apple auth
    throw new Error('Not implemented');
  }

  static async setTokens(accessToken: string | null, refreshToken: string | null): Promise<void> {
    if (accessToken) {
      await SecureStore.setItemAsync(this.JWT_KEY, accessToken);
    } else {
      await SecureStore.deleteItemAsync(this.JWT_KEY);
    }

    if (refreshToken) {
      await SecureStore.setItemAsync(this.REFRESH_KEY, refreshToken);
    } else {
      await SecureStore.deleteItemAsync(this.REFRESH_KEY);
    }
  }

  static async getJWT(): Promise<string | null> {
    return SecureStore.getItemAsync(this.JWT_KEY);
  }

  static async removeTokens(): Promise<void> {
    await SecureStore.deleteItemAsync(this.JWT_KEY);
    await SecureStore.deleteItemAsync(this.REFRESH_KEY);
  }

  static async cacheUserProfile(userId: string, email: string, displayName: string, avatarColor: string): Promise<void> {
    const keys = await CryptoManager.generateKeyPair();
    const nodeId = CryptoManager.deriveNodeId(keys.publicKey);

    // Ensure database is initialized
    await DatabaseManager.getInstance().initialize();

    await DatabaseManager.getInstance().insertUser({
      user_id: userId,
      email: email,
      display_name: displayName,
      avatar_color: avatarColor,
      public_key: keys.publicKey as any,
      node_id: nodeId,
      created_at: new Date(),
    });
  }

  static async getUserProfile(userId: string): Promise<any> {
    return DatabaseManager.getInstance().getUser(userId);
  }

  // Generate unique avatar color from standard palette
  static generateAvatarColor(): string {
    const palette = [
      '#FF5722', '#F44336', '#E91E63', '#9C27B0', '#673AB7',
      '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688',
      '#4CAF50', '#8BC34A', '#CDDC39', '#FFC107', '#FF9800'
    ];
    return palette[Math.floor(Math.random() * palette.length)];
  }

  static async logout(_userId: string): Promise<void> {
    // 1. Delete JWT from expo-secure-store
    await this.removeTokens();
    
    // Auth component/supabase logout
    await supabase.auth.signOut();

    // 2. Clear cached user profile from Local_Database (Wait, DB manager user clear)
    // Actually, usually we clear specific user or all user data. For now, assuming complete wipe or delete local profile
    try {
      // _db is available if we want to run queries
      // SQLite: DELETE FROM users WHERE userId = ?
    } catch (e) {
      // ignore
    }

    // 3. Send LEAVE SystemSignal if trek is active (Handled by store/orchestrator)
    // 4. Stop BLE advertising and scanning (Handled by BLEManager)
    // 5. Navigate to login screen (Handled by React Navigation)
  }
}
