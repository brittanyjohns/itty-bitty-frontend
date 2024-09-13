import React, { useEffect, useState } from "react";
import {
  IonItem,
  IonList,
  IonSelect,
  IonSelectOption,
  IonToast,
} from "@ionic/react";
import { useHistory } from "react-router";
import { createAudio } from "../../data/images";

interface VoiceDropdownProps {
  imageId: string;
  onSuccess: (response: any, voice: string) => void;
}
import { voiceOptions } from "../../data/utils";
const VoiceDropdown: React.FC<VoiceDropdownProps> = ({
  imageId,
  onSuccess,
}) => {
  // const [voices, setVoices] = useState([]);
  const [voiceId, setVoiceId] = useState(null);
  const [showLoading, setShowLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const selectRef = React.useRef<HTMLIonSelectElement>(null);
  const history = useHistory();
  const voices = voiceOptions;

  const handleSelectChange = (e: CustomEvent) => {
    const voice = e.detail.value;
    setVoiceId(voice);
    setShowLoading(true);
    async function createNewAudio() {
      const response = await createAudio(imageId, voice);
      console.log("response", response);
      onSuccess(response, voice);
      if (!response) {
        console.error("Error adding image to voice");
        return;
      }
      if (response["error"]) {
        const message = `${response["error"]}`;
        setToastMessage(message);
        setShowLoading(false);
        setIsOpen(true);
        return;
      }
      if (voice) {
        const message = `Image added to voice: ${voice}`;
        setToastMessage(message);
        setShowLoading(false);
        setIsOpen(true);
        // window.location.reload();
        // history.push(`/images/${response["id"]}`);
      }
    }
    createNewAudio();
    selectRef.current!.value = null;
  };
  return (
    <IonList className="text-center w-full border border-gray-300">
      <IonItem lines="none">
        <IonSelect
          placeholder="Select Voice to create new audio file"
          className="text-sm text-wrap text-center"
          name="voiceId"
          onIonChange={(e: any) => handleSelectChange(e)}
          ref={selectRef}
        >
          {voices &&
            voices.map((voice: string, i: number) => (
              <IonSelectOption key={`${voice}-${i}`} value={voice}>
                {voice}
              </IonSelectOption>
            ))}
        </IonSelect>
      </IonItem>
      <IonToast
        isOpen={isOpen}
        message={toastMessage}
        onDidDismiss={() => setIsOpen(false)}
        duration={2000}
      ></IonToast>
    </IonList>
  );
};
export default VoiceDropdown;
