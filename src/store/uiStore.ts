import { create } from 'zustand';

interface UIState {
  isLoading: boolean;
  loadingMessage: string | null;
  showModal: boolean;
  modalContent: string | null;
  notifications: Array<{ id: string; message: string; type: 'info' | 'success' | 'error' }>;
  setLoading: (isLoading: boolean, message?: string) => void;
  setModal: (show: boolean, content?: string) => void;
  addNotification: (message: string, type: 'info' | 'success' | 'error') => void;
  removeNotification: (id: string) => void;
}

export const useUIStore = create<UIState>(set => ({
  isLoading: false,
  loadingMessage: null,
  showModal: false,
  modalContent: null,
  notifications: [],
  setLoading: (isLoading, message) =>
    set({ isLoading, loadingMessage: message || null }),
  setModal: (show, content) =>
    set({ showModal: show, modalContent: content || null }),
  addNotification: (message, type) =>
    set(state => ({
      notifications: [
        ...state.notifications,
        { id: Date.now().toString(), message, type },
      ],
    })),
  removeNotification: id =>
    set(state => ({
      notifications: state.notifications.filter(n => n.id !== id),
    })),
}));
