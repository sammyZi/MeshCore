import { Platform, PermissionsAndroid } from 'react-native';
import {
  initialize,
  connect,
  createGroup,
  removeGroup,
  receiveMessage,
  sendMessage,
  getConnectionInfo,
} from 'react-native-wifi-p2p';
import { Buffer } from '@craftzdog/react-native-buffer';

export class WiFiDirectManager {
  private isConnected = false;
  private messageListener: any = null;

  constructor() {
    this.init();
  }

  /**
   * Initialize Wi-Fi Direct and request permissions
   */
  async init(): Promise<void> {
    if (Platform.OS !== 'android') {
      console.warn('Wi-Fi Direct is only officially supported on Android via react-native-wifi-p2p.');
      return;
    }

    try {
      await initialize();
      
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'Required for Wi-Fi Direct discovery.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        throw new Error('Location permission denied');
      }
      
      // Android 13+ (API 33) requires NEARBY_WIFI_DEVICES
      if (Platform.Version >= 33) {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.NEARBY_WIFI_DEVICES,
          {
            title: 'Nearby Wi-Fi Devices Permission',
            message: 'Required for connecting to nearby peers over Wi-Fi Direct.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
      }

      // Android 16 (API 36) theoretically introduces localized network access boundaries
      if (Platform.Version >= 36) {
        console.log('Requesting Local Network Access permission on Android 16');
        // This is a placeholder for the future Android 16 specific local network permission:
        // await PermissionsAndroid.request('android.permission.LOCAL_MAC_ADDRESS' as any);
      }
    } catch (e) {
      console.error('WiFi Direct initialization error:', e);
    }
  }

  /**
   * 9.1 Create a P2P Group
   */
  async createGroup(): Promise<void> {
    if (Platform.OS !== 'android') return;
    try {
      await createGroup();
      this.isConnected = true;
    } catch (e) {
      console.error('Failed to create Wi-Fi Direct group:', e);
      throw e;
    }
  }

  /**
   * 9.1 Join a P2P Group
   */
  async joinGroup(deviceAddress: string): Promise<void> {
    if (Platform.OS !== 'android') return;
    try {
      await connect(deviceAddress);
      this.isConnected = true;
    } catch (e) {
      console.error(`Failed to connect to ${deviceAddress}:`, e);
      throw e;
    }
  }

  /**
   * 9.1 Send packet over Wi-Fi Direct
   */
  async sendPacket(packet: Buffer): Promise<void> {
    if (Platform.OS !== 'android' || !this.isConnected) {
      throw new Error('Wi-Fi Direct is not connected or available.');
    }
    try {
      const messageStr = packet.toString('base64');
      await sendMessage(messageStr);
    } catch (e) {
      console.error('Failed to send packet over Wi-Fi Direct:', e);
      throw e;
    }
  }

  /**
   * 9.1 Handle incoming packets
   */
  onPacketReceived(callback: (packet: Buffer) => void): void {
    if (Platform.OS !== 'android') return;
    
    // We assume `receiveMessage` might poll or we listen on an event.
    // react-native-wifi-p2p usually gives receiveMessage as a promise returning the incoming message
    // or we might need an event listener if the library provides one.
    // For the sake of standard implementation based on tasks.md:
    
    // react-native-wifi-p2p `receiveMessage` returns a Promise that resolves when a message is received.
    // This forms a continuous polling loop.
    this.startMessageListener(callback);
  }
  
  private async startMessageListener(callback: (packet: Buffer) => void) {
    this.messageListener = true;
    while (this.messageListener) {
      try {
        const msg = await receiveMessage({ meta: false });
        if (msg) {
          const packet = Buffer.from(msg, 'base64');
          callback(packet);
        }
      } catch (e) {
        console.error('Error receiving Wi-Fi Direct message:', e);
        // Delay before retrying to prevent hot loop on error
        await new Promise<void>(resolve => setTimeout(resolve, 1000));
      }
    }
  }

  /**
   * 9.1 Disconnect from Wi-Fi Direct
   */
  async disconnect(): Promise<void> {
    if (Platform.OS !== 'android') return;
    this.messageListener = false;
    try {
      await removeGroup();
      this.isConnected = false;
    } catch (e) {
      console.error('Failed to disconnect from Wi-Fi Direct:', e);
      throw e;
    }
  }

  /**
   * 9.2 Check Wi-Fi Direct availability
   */
  async isAvailable(): Promise<boolean> {
    if (Platform.OS !== 'android') return false;
    try {
      const info = await getConnectionInfo();
      return !!info;
    } catch (e) {
      return false;
    }
  }
}
