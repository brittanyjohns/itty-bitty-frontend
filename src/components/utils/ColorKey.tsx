import { IonButton, IonButtons, IonIcon } from "@ionic/react";
import { eyeOffOutline, eyeOutline } from "ionicons/icons";
import React, { useState } from "react";

const colorKeyItems = [
  { colorClass: "bg-blue-400 bg-opacity-50", label: "Nouns" },
  { colorClass: "bg-green-400 bg-opacity-50", label: "Verbs" },
  { colorClass: "bg-yellow-400 bg-opacity-50", label: "Adjectives" },
  { colorClass: "bg-red-400 bg-opacity-50", label: "Adverbs" },
  { colorClass: "bg-purple-400 bg-opacity-50", label: "Prepositions" },
  { colorClass: "bg-indigo-400 bg-opacity-50", label: "Conjunctions" },
  { colorClass: "bg-pink-400 bg-opacity-50", label: "Pronouns" },
  { colorClass: "bg-teal-400 bg-opacity-50", label: "Interjections" },
  { colorClass: "bg-gray-400 bg-opacity-50", label: "Other" },
];

const ColorKey: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  const toggleColorKey = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className="w-full mx-auto m-3">
      <IonButtons className="flex justify-between ml-4">
        <IonButton
          onClick={toggleColorKey}
          className="text-xs"
          //   style={{
          //     fontSize: "12px",
          //     padding: "4px 8px",
          //     height: "fit-content",
          //     minWidth: "auto",
          //   }}
        >
          {isVisible && (
            <IonIcon icon={eyeOffOutline} className="mr-2"></IonIcon>
          )}{" "}
          {isVisible && "Hide"}
          {!isVisible && (
            <IonIcon icon={eyeOutline} className="mr-2"></IonIcon>
          )}{" "}
          {!isVisible && "Show"}
          {" Color Key"}
        </IonButton>
      </IonButtons>
      {isVisible && (
        <div className="px-2 pb-2 rounded-lg shadow-md bg-white">
          <h3 className="text-sm md:text-md font-semibold">Color Key</h3>
          <div className="flex flex-col gap-2 text-sm">
            {colorKeyItems.map((item, index) => (
              <div
                key={index}
                className={`font-bold p-2 rounded-md ${item.colorClass}`}
              >
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
