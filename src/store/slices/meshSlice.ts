import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PeerConnection {
  deviceId: string;
  userId: string;
  connected: boolean;
  lastSeen: number;
}

interface MeshState {
  isActive: boolean;
  connectedPeers: PeerConnection[];
  packetsSent: number;
  packetsReceived: number;
  networkDensity: number;
}

const initialState: MeshState = {
  isActive: false,
  connectedPeers: [],
  packetsSent: 0,
  packetsReceived: 0,
  networkDensity: 0,
};

const meshSlice = createSlice({
  name: 'mesh',
  initialState,
  reducers: {
    setMeshActive: (state, action: PayloadAction<boolean>) => {
      state.isActive = action.payload;
    },
    addPeer: (state, action: PayloadAction<PeerConnection>) => {
      const existing = state.connectedPeers.find(p => p.deviceId === action.payload.deviceId);
      if (!existing) {
        state.connectedPeers.push(action.payload);
      }
    },
    removePeer: (state, action: PayloadAction<string>) => {
      state.connectedPeers = state.connectedPeers.filter(p => p.deviceId !== action.payload);
    },
    updatePeerLastSeen: (state, action: PayloadAction<{ deviceId: string; timestamp: number }>) => {
      const peer = state.connectedPeers.find(p => p.deviceId === action.payload.deviceId);
      if (peer) {
        peer.lastSeen = action.payload.timestamp;
      }
    },
    incrementPacketsSent: state => {
      state.packetsSent += 1;
    },
    incrementPacketsReceived: state => {
      state.packetsReceived += 1;
    },
    setNetworkDensity: (state, action: PayloadAction<number>) => {
      state.networkDensity = action.payload;
    },
    resetMesh: state => {
      state.isActive = false;
      state.connectedPeers = [];
      state.packetsSent = 0;
      state.packetsReceived = 0;
      state.networkDensity = 0;
    },
  },
});

export const {
  setMeshActive,
  addPeer,
  removePeer,
  updatePeerLastSeen,
  incrementPacketsSent,
  incrementPacketsReceived,
  setNetworkDensity,
  resetMesh,
} = meshSlice.actions;
export default meshSlice.reducer;
