import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MapState {
  centerLatitude: number;
  centerLongitude: number;
  zoomLevel: number;
  isMapReady: boolean;
  mbtilesPath: string | null;
}

const initialState: MapState = {
  centerLatitude: 0,
  centerLongitude: 0,
  zoomLevel: 12,
  isMapReady: false,
  mbtilesPath: null,
};

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setMapCenter: (
      state,
      action: PayloadAction<{ latitude: number; longitude: number; zoomLevel?: number }>
    ) => {
      state.centerLatitude = action.payload.latitude;
      state.centerLongitude = action.payload.longitude;
      if (action.payload.zoomLevel !== undefined) {
        state.zoomLevel = action.payload.zoomLevel;
      }
    },
    setZoomLevel: (state, action: PayloadAction<number>) => {
      state.zoomLevel = action.payload;
    },
    setMapReady: (state, action: PayloadAction<boolean>) => {
      state.isMapReady = action.payload;
    },
    setMbtilesPath: (state, action: PayloadAction<string>) => {
      state.mbtilesPath = action.payload;
    },
  },
});

export const { setMapCenter, setZoomLevel, setMapReady, setMbtilesPath } = mapSlice.actions;
export default mapSlice.reducer;
