import { TextToSpeech } from '@capacitor-community/text-to-speech';

export const speak = async () => {
  await TextToSpeech.speak({
    text: 'This is a sample text.',
    lang: 'en-US',
    rate: 1.0,
    pitch: 1.0,
    volume: 1.0,
    category: 'ambient',
  });
};

export const stop = async () => {
  await TextToSpeech.stop();
};

const getSupportedLanguages = async () => {
  const languages = await TextToSpeech.getSupportedLanguages();
};

const getSupportedVoices = async () => {
  const voices = await TextToSpeech.getSupportedVoices();
};

const isLanguageSupported = async (lang: string) => {
  const isSupported = await TextToSpeech.isLanguageSupported({ lang });
};