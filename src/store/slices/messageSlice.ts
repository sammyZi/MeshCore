import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Message {
  messageId: string;
  senderId: string;
  senderName: string;
  payload: string;
  timestamp: number;
  status: 'pending' | 'sent' | 'failed';
}

interface MessageState {
  messages: Message[];
}

const initialState: MessageState = {
  messages: [],
};

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    updateMessageStatus: (
      state,
      action: PayloadAction<{ messageId: string; status: 'pending' | 'sent' | 'failed' }>
    ) => {
      const message = state.messages.find(m => m.messageId === action.payload.messageId);
      if (message) {
        message.status = action.payload.status;
      }
    },
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    clearMessages: state => {
      state.messages = [];
    },
  },
});

export const { addMessage, updateMessageStatus, setMessages, clearMessages } =
  messageSlice.actions;
export default messageSlice.reducer;
