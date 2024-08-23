import { IonIcon } from "@ionic/react";
import { arrowForward } from "ionicons/icons";
import React, { useState } from "react";

interface ListItem {
  title: string;
  content: string;
}

interface HelpListProps {
  items: ListItem[];
  additionalText?: string;
}

const HelpPopup: React.FC<HelpListProps> = ({ items, additionalText }) => {
  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button
        onClick={togglePopup}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none"
      >
        Need Help?
      </button>

      {isOpen && (
        <div className="absolute top-12 right-0 bg-white border border-gray-300 rounded-lg shadow-lg p-6 w-96 z-50">
          <button
            onClick={togglePopup}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 focus:outline-none"
          >
            &times;
          </button>
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            How to Write a Good Scenario Description
          </h3>
          <div className="text-sm text-gray-700 max-h-60 overflow-y-auto space-y-4 leading-relaxed">
            <div>
              <ul className="list-none list-inside pl-4">
                {items.map((item, index) => (
                  <li key={index} className="mb-2">
                    <IonIcon
                      icon={arrowForward}
                      className="mr-2 text-gray-500"
                    />
                    <span className="font-bold">{item.title}:</span>{" "}
                    {item.content}
                  </li>
                ))}
              </ul>
              {additionalText && (
                <p className="mt-4 text-sm text-gray-700">{additionalText}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpPopup;
