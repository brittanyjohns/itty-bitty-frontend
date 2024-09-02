import { IonButton, IonButtons, IonIcon } from "@ionic/react";
import { eyeOffOutline, eyeOutline } from "ionicons/icons";
import React, { useState } from "react";
import RainbowText from "./RainbowText";

const colorKeyItems = [
  { colorClass: "bg-blue-400 bg-opacity-50", label: "Nouns" },
  { colorClass: "bg-green-400 bg-opacity-50", label: "Verbs" },
  { colorClass: "bg-yellow-400 bg-opacity-50", label: "Adjectives" },
  { colorClass: "bg-purple-400 bg-opacity-50", label: "Adverbs" },
  { colorClass: "bg-orange-400 bg-opacity-50", label: "Prepositions" },
  { colorClass: "bg-red-400 bg-opacity-50", label: "Conjunctions" },
  { colorClass: "bg-pink-400 bg-opacity-50", label: "Pronouns" },
  { colorClass: "bg-teal-400 bg-opacity-50", label: "Interjections" },
  { colorClass: "bg-gray-400 bg-opacity-50", label: "Other" },
];

const ColorKey: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleColorKey = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className="w-full mx-auto">
      <IonButtons className="flex justify-between ml-4">
        <IonButton
          onClick={toggleColorKey}
          className="text-xs font-bold"
          fill="clear"
        >
          {isVisible && (
            <IonIcon icon={eyeOffOutline} className="mr-2 font-bold"></IonIcon>
          )}{" "}
          {!isVisible && (
            <IonIcon icon={eyeOutline} className="mr-2 font-bold"></IonIcon>
          )}{" "}
          <RainbowText
            text={!isVisible ? "Show Color Key" : "Hide Color Key"}
          />
        </IonButton>
      </IonButtons>
      {isVisible && (
        <div className="px-1 pb-1 rounded-lg bg-white">
          <h3 className="text-sm md:text-md font-semibold">Color Key</h3>
          <div className="flex flex-col gap-1 text-sm p-1">
            {colorKeyItems.map((item, index) => (
              <div key={index} className={`p-1 font-bold ${item.colorClass}`}>
                {item.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorKey;
