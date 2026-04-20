import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TrekMember {
  userId: string;
  displayName: string;
  avatarColor: string;
  nodeId: string;
  publicKey: string;
  status: 'active' | 'left';
}

interface TrekState {
  activeTrekId: string | null;
  trekName: string | null;
  joinCode: string | null;
  leaderId: string | null;
  startTime: number | null;
  status: 'active' | 'ended';
  members: TrekMember[];
  serviceUuid: string | null;
}

const initialState: TrekState = {
  activeTrekId: null,
  trekName: null,
  joinCode: null,
  leaderId: null,
  startTime: null,
  status: 'ended',
  members: [],
  serviceUuid: null,
};

const trekSlice = createSlice({
  name: 'trek',
  initialState,
  reducers: {
    setTrek: (
      state,
      action: PayloadAction<{
        trekId: string;
        trekName: string;
        joinCode: string;
        leaderId: string;
        startTime: number;
        serviceUuid: string;
      }>
    ) => {
      state.activeTrekId = action.payload.trekId;
      state.trekName = action.payload.trekName;
      state.joinCode = action.payload.joinCode;
      state.leaderId = action.payload.leaderId;
      state.startTime = action.payload.startTime;
      state.status = 'active';
      state.serviceUuid = action.payload.serviceUuid;
    },
    addMember: (state, action: PayloadAction<TrekMember>) => {
      state.members.push(action.payload);
    },
    setMembers: (state, action: PayloadAction<TrekMember[]>) => {
      state.members = action.payload;
    },
    updateMemberStatus: (
      state,
      action: PayloadAction<{ userId: string; status: 'active' | 'left' }>
    ) => {
      const member = state.members.find(m => m.userId === action.payload.userId);
      if (member) {
        member.status = action.payload.status;
      }
    },
    endTrek: state => {
      state.status = 'ended';
    },
    clearTrek: state => {
      state.activeTrekId = null;
      state.trekName = null;
      state.joinCode = null;
      state.leaderId = null;
      state.startTime = null;
      state.status = 'ended';
      state.members = [];
      state.serviceUuid = null;
    },
  },
});

export const { setTrek, addMember, setMembers, updateMemberStatus, endTrek, clearTrek } =
  trekSlice.actions;
export default trekSlice.reducer;
