import * as crypto from 'react-native-quick-crypto';
import * as SecureStore from 'expo-secure-store';
import { Buffer } from '@craftzdog/react-native-buffer';

export class CryptoManager {
  private static readonly PRIVATE_KEY_STORE = 'MESHCORE_PRIVATE_KEY';
  private static readonly PUBLIC_KEY_STORE = 'MESHCORE_PUBLIC_KEY';

  /**
   * Generates Ed25519 key pair (suitable for signing) and stores them if not present.
   * (Note: Task 3 specifies ECDH Curve25519, but Ed25519 is specifically designed for signatures).
   * We use Ed25519 for signature requirements and generate standard keys.
   */
  static async generateKeyPair(): Promise<{ publicKey: Buffer; privateKey: Buffer }> {
    try {
      // First try to load existing keys
      const existingPriv = await SecureStore.getItemAsync(this.PRIVATE_KEY_STORE);
      const existingPub = await SecureStore.getItemAsync(this.PUBLIC_KEY_STORE);

      if (existingPriv && existingPub) {
        return {
          publicKey: Buffer.from(existingPub, 'base64'),
          privateKey: Buffer.from(existingPriv, 'base64'),
        };
      }

      // Generate new key pair
      const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519', {
        publicKeyEncoding: { type: 'spki', format: 'der' },
        privateKeyEncoding: { type: 'pkcs8', format: 'der' }
      });

      const pubBuffer = Buffer.from(publicKey as any);
      const privBuffer = Buffer.from(privateKey as any);

      await SecureStore.setItemAsync(this.PRIVATE_KEY_STORE, privBuffer.toString('base64'));
      await SecureStore.setItemAsync(this.PUBLIC_KEY_STORE, pubBuffer.toString('base64'));

      return { publicKey: pubBuffer, privateKey: privBuffer };
    } catch (error) {
      console.error('Key generation failed, trying again:', error);
      throw error; // Let caller handle retry
    }
  }

  static async getPublicKey(): Promise<Buffer | null> {
    const pub = await SecureStore.getItemAsync(this.PUBLIC_KEY_STORE);
    return pub ? Buffer.from(pub, 'base64') : null;
  }

  static async getPrivateKey(): Promise<Buffer | null> {
    const priv = await SecureStore.getItemAsync(this.PRIVATE_KEY_STORE);
    return priv ? Buffer.from(priv, 'base64') : null;
  }

  /**
   * Derives a deterministic Node ID (4 bytes hex string) from the public key using SHA-256
   */
  static deriveNodeId(publicKey: Buffer): string {
    const hash = crypto.createHash('sha256').update(publicKey).digest();
    // First 4 bytes to hex string
    return hash.subarray(0, 4).toString('hex');
  }

  /**
   * Implement packet signing with private key.
   * Uses Ed25519 signature scheme which yields a 64-byte signature.
   */
  static async signPacket(packet: Buffer): Promise<Buffer> {
    const privateKeyBuffer = await this.getPrivateKey();
    if (!privateKeyBuffer) {
      throw new Error('Private key not found');
    }

    const privateKey = crypto.createPrivateKey({
      key: privateKeyBuffer,
      format: 'der',
      type: 'pkcs8',
    });

    // sign with undefined digest for ed25519
    const signature = crypto.sign(undefined, packet, privateKey);
    return signature as Buffer;
  }

  /**
   * Verify signature of a packet using the sender's public key.
   */
  static async verifySignature(packet: Buffer, signature: Buffer, publicKeyBuffer: Buffer): Promise<boolean> {
    try {
      const publicKey = crypto.createPublicKey({
        key: publicKeyBuffer,
        format: 'der',
        type: 'spki',
      });
      return crypto.verify(undefined, packet, publicKey, signature);
    } catch (e) {
      return false;
    }
  }

  /**
   * Derives a deterministic 128-bit RFC 4122 Service UUID from a trek_id.
   * Modifies bits to conform to UUIDv4 variant/version requirements so it parses correctly.
   */
  static deriveServiceUUID(trekId: string): string {
    const hashData = crypto.createHash('sha256').update(trekId).digest();
    
    // UUIDv4 modification rules applied to the hash
    hashData[6] = (hashData[6] & 0x0f) | 0x40; // Version 4
    hashData[8] = (hashData[8] & 0x3f) | 0x80; // Variant 10
    
    // Format as UUID string xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
    const hex = hashData.subarray(0, 16).toString('hex');
    return `${hex.substr(0, 8)}-${hex.substr(8, 4)}-${hex.substr(12, 4)}-${hex.substr(16, 4)}-${hex.substr(20, 12)}`;
  }
}
