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
import "./main.css";
interface FloatingWordsBtnProps {
  inputRef: React.RefObject<HTMLIonInputElement>;
}
function FloatingWordsBtn({ inputRef }: FloatingWordsBtnProps) {
  const say = async (text: string) => {
    console.log("Saying:", text);
    if (inputRef.current) {
      inputRef.current.value += ` ${text}`;
    }
    await TextToSpeech.speak({
      text: text,
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
        <IonFabButton
          onClick={() => say("please")}
          className="custom-fab-button"
        >
          <IonLabel className="text-xs">Please</IonLabel>
        </IonFabButton>
        <IonFabButton
          onClick={() => say("thank you")}
          className="custom-fab-button"
        >
          <IonLabel className="text-xs">Thank you</IonLabel>
        </IonFabButton>
        <IonFabButton
          onClick={() => say("hello")}
          className="custom-fab-button"
        >
          <IonLabel className="text-xs">Hello</IonLabel>
        </IonFabButton>
        <IonFabButton
          onClick={() => say("goodbye")}
          className="custom-fab-button"
        >
          <IonLabel className="text-xs">Goodbye</IonLabel>
        </IonFabButton>
        <IonFabButton onClick={() => say("yes")} className="custom-fab-button">
          <IonLabel className="text-xs">Yes</IonLabel>
        </IonFabButton>
        <IonFabButton onClick={() => say("no")} className="custom-fab-button">
          <IonLabel className="text-xs">No</IonLabel>
        </IonFabButton>
      </IonFabList>
    </IonFab>
  );
}
export default FloatingWordsBtn;
