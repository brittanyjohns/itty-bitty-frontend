import React, { useState } from "react";
import { IonAlert, IonButton } from "@ionic/react";

interface SearchAlertProps {
  onSearch: (query: string) => void;
  // isOpen: boolean;
  onDismiss: () => void;
}

const SearchAlert: React.FC<SearchAlertProps> = ({
  onSearch,
  // isOpen,
  onDismiss,
}) => {
  const [isOpen, setAlertOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <IonButton onClick={() => setAlertOpen(true)}>Search Images</IonButton>
      <IonAlert
        isOpen={isOpen}
        onDidDismiss={() => onDismiss()}
        header="Search for Images"
        buttons={[
          {
            text: "Cancel",
            role: "cancel",
            handler: () => {
              onDismiss();
            },
          },
          {
            text: "Search",
            handler: (values) => {
              onSearch(values.searchQuery);
            },
          },
        ]}
        inputs={[
          {
            name: "searchQuery",
            type: "text",
            placeholder: "Enter search query",
            value: searchQuery,
          },
        ]}
      ></IonAlert>
    </>
  );
};

export default SearchAlert;
