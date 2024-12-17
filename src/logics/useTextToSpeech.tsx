import React from 'react';
import { useTranslation } from 'react-i18next';
import { useReduxSelector } from '../store/Store';

const useTextToSpeech = () => {
  const { i18n } = useTranslation(['appbar']);
  const isTextToSpeechActive = useReduxSelector((state) => state.home.isTextToSpeechActivce);
  const speechVolume = useReduxSelector((state) => state.home.speechVolume);
  const speechPitch = useReduxSelector((state) => state.home.speechPitch);
  const speechSpeed = useReduxSelector((state) => state.home.speechSpeed);

  const handlePlay = async (speechText: string, lang?: string) => {
    if (isTextToSpeechActive) {
      const utterance = new SpeechSynthesisUtterance(speechText);
      const language = i18n.language === 'en' ? 'en-US' : i18n.language === 'es' ? 'es' : i18n.language === 'hu' ? 'hu' : 'en-US';
      utterance.lang = lang ? lang : language;
      utterance.pitch = speechPitch; // tone 2
      utterance.rate = speechSpeed; // speed
      utterance.volume = speechVolume; // volume
      speechSynthesis.speak(utterance);
    }
  };

  const handleTest = async (speechText: string, pitch: number, speed: number, volume: number) => {
    const utterance = new SpeechSynthesisUtterance(speechText);
    const language = i18n.language === 'en' ? 'en-US' : i18n.language === 'es' ? 'es' : i18n.language === 'hu' ? 'hu' : 'en-US';
    utterance.lang = language;
    utterance.pitch = pitch;
    utterance.rate = speed;
    utterance.volume = volume;
    speechSynthesis.speak(utterance);
  };

  const handlePause = () => {
    if (isTextToSpeechActive) {
      speechSynthesis.pause();
    }
  };

  const handleStop = () => {
    speechSynthesis.cancel();
  };

  return {
    handlePlay,
    handleTest,
    handlePause,
    handleStop,
  };
};

export default useTextToSpeech;
