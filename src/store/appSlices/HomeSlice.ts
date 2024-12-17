import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { INIT_IS_BACKGROUND, INIT_LIGHT_MODE } from '../../utils/variables';

type HomeState = {
  openProfileModal: boolean;
  openPasswordModal: boolean;
  windowWidth: number;
  windowHeight: number;
  pagesWithBackground: boolean;
  lightMode: boolean;
  pageName: string;
  isAccessibilityModalOpen: boolean;
  isTextToSpeechActivce: boolean;
  speechVolume: number;
  speechPitch: number;
  speechSpeed: number;
  isPanel1ModalOpen: boolean;
  isPanel2ModalOpen: boolean;
  isPanel3ModalOpen: boolean;
};

const initialState: HomeState = {
  openProfileModal: false,
  openPasswordModal: false,
  windowWidth: window.innerWidth,
  windowHeight: window.innerHeight,
  pagesWithBackground: INIT_IS_BACKGROUND,
  lightMode: INIT_LIGHT_MODE,
  pageName: '',
  isAccessibilityModalOpen: false,
  isTextToSpeechActivce: false,
  speechVolume: 0.6,
  speechPitch: 1.1,
  speechSpeed: 1,
  isPanel1ModalOpen: false,
  isPanel2ModalOpen: false,
  isPanel3ModalOpen: false,
};

const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    setOpenProfileModal(state, action: PayloadAction<boolean>) {
      state.openProfileModal = action.payload;
    },
    setOpenPasswordModal(state, action: PayloadAction<boolean>) {
      state.openPasswordModal = action.payload;
    },
    setWindowWidth(state, action: PayloadAction<number>) {
      state.windowWidth = action.payload;
    },
    setWindowHeight(state, action: PayloadAction<number>) {
      state.windowHeight = action.payload;
    },
    setPagesWithBackground(state, action: PayloadAction<boolean>) {
      state.pagesWithBackground = action.payload;
    },
    setLightMode(state, action: PayloadAction<boolean>) {
      state.lightMode = action.payload;
    },
    setPageName(state, action: PayloadAction<string>) {
      state.pageName = action.payload;
    },
    setIsAccessibilityModalOpen(state, action: PayloadAction<boolean>) {
      state.isAccessibilityModalOpen = action.payload;
    },
    setIsTextToSpeechActive(state, action: PayloadAction<boolean>) {
      state.isTextToSpeechActivce = action.payload;
    },
    setSpeechVolume(state, action: PayloadAction<number>) {
      state.speechVolume = action.payload;
    },
    setSpeechPitch(state, action: PayloadAction<number>) {
      state.speechPitch = action.payload;
    },
    setSpeechSpeed(state, action: PayloadAction<number>) {
      state.speechSpeed = action.payload;
    },
    setIsPanel1ModalOpen(state, action: PayloadAction<boolean>) {
      state.isPanel1ModalOpen = action.payload;
    },
    setIsPanel2ModalOpen(state, action: PayloadAction<boolean>) {
      state.isPanel2ModalOpen = action.payload;
    },
    setIsPanel3ModalOpen(state, action: PayloadAction<boolean>) {
      state.isPanel3ModalOpen = action.payload;
    },
  },
});

export const homeActions = homeSlice.actions;
export default homeSlice.reducer;
