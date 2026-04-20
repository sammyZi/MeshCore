import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Location {
  latitude: number;
  longitude: number;
  altitude: number;
  accuracy: number;
  timestamp: number;
}

interface LocationState {
  currentLocation: Location | null;
  isTracking: boolean;
  lastUpdateTime: number | null;
}

const initialState: LocationState = {
  currentLocation: null,
  isTracking: false,
  lastUpdateTime: null,
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setLocation: (state, action: PayloadAction<Location>) => {
      state.currentLocation = action.payload;
      state.lastUpdateTime = Date.now();
    },
    setTracking: (state, action: PayloadAction<boolean>) => {
      state.isTracking = action.payload;
    },
    clearLocation: state => {
      state.currentLocation = null;
      state.isTracking = false;
      state.lastUpdateTime = null;
    },
  },
});

export const { setLocation, setTracking, clearLocation } = locationSlice.actions;
export default locationSlice.reducer;
