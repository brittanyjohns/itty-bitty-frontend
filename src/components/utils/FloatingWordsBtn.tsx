import React from "react";
import {
  IonContent,
  IonFab,
  IonFabButton,
  IonFabList,
  IonHeader,
  IonIcon,
  IonLabel,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import {
  chevronDownCircle,
  chevronForwardCircle,
  chevronUpCircle,
  colorPalette,
  document,
  globe,
} from "ionicons/icons";
import { TextToSpeech } from "@capacitor-community/text-to-speech";
import "./../main.css";
interface FloatingWordsBtnProps {
  inputRef: React.RefObject<HTMLIonInputElement>;
  words?: string[];
}
function FloatingWordsBtn({ inputRef, words }: FloatingWordsBtnProps) {
  const say = async (text: string) => {
    if (inputRef.current) {
      inputRef.current.value += ` ${text}`;
    }
    const textToSpeak = text.toLowerCase();
    await TextToSpeech.speak({
      text: textToSpeak,
      lang: "en-US",
      rate: 1.0,
      pitch: 1.0,
      volume: 1.5,
      category: "ambient",
      // voice: 4,
    });
  };

  return (
    <IonFab slot="fixed" vertical="bottom" horizontal="end">
      <IonFabButton size="small">
        <IonIcon icon={chevronUpCircle}></IonIcon>
      </IonFabButton>
      <IonFabList side="top">
        {words?.map((word, i) => (
          <IonFabButton
            key={`${word}-${i}`}
            onClick={() => say(word)}
            className="custom-fab-button"
          >
            <IonLabel className="mx-2 text-xs">{word}</IonLabel>
          </IonFabButton>
        ))}
      </IonFabList>
    </IonFab>
  );
}
export default FloatingWordsBtn;
