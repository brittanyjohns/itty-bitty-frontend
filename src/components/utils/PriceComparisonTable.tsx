import React from "react";
import { IonGrid, IonRow, IonCol, IonIcon } from "@ionic/react";
import { checkmark, close } from "ionicons/icons";

const PriceComparisonTable: React.FC = () => {
  return (
    <IonGrid className="w-full md:w-3/4 mx-auto">
      <IonRow className="ion-text-center ion-align-items-center">
        <IonCol size="12" size-sm="3">
          <strong>Feature</strong>
        </IonCol>
        <IonCol size="12" size-sm="3">
          <strong>Freemium</strong>
        </IonCol>
        <IonCol size="12" size-sm="3">
          <strong>Premium</strong>
        </IonCol>
        <IonCol size="12" size-sm="3">
          <strong>Professional</strong>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol size="12" size-sm="3">
          Unlimited Boards
        </IonCol>
        <IonCol size="12" size-sm="3">
          <IonIcon icon={checkmark} color="success" />
        </IonCol>
        <IonCol size="12" size-sm="3">
          <IonIcon icon={checkmark} color="success" />
        </IonCol>
        <IonCol size="12" size-sm="3">
          <IonIcon icon={checkmark} color="success" />
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol size="12" size-sm="3">
          Ad-Free Experience
        </IonCol>
        <IonCol size="12" size-sm="3">
          <IonIcon icon={close} color="danger" />
        </IonCol>
        <IonCol size="12" size-sm="3">
          <IonIcon icon={checkmark} color="success" />
        </IonCol>
        <IonCol size="12" size-sm="3">
          <IonIcon icon={checkmark} color="success" />
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol size="12" size-sm="3">
          AI-Generated Images
        </IonCol>
        <IonCol size="12" size-sm="3">
          <IonIcon icon={close} color="danger" />
        </IonCol>
        <IonCol size="12" size-sm="3">
          <IonIcon icon={checkmark} color="success" />
        </IonCol>
        <IonCol size="12" size-sm="3">
          <IonIcon icon={checkmark} color="success" />
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol size="12" size-sm="3">
          Multi-User Management
        </IonCol>
        <IonCol size="12" size-sm="3">
          <IonIcon icon={close} color="danger" />
        </IonCol>
        <IonCol size="12" size-sm="3">
          <IonIcon icon={close} color="danger" />
        </IonCol>
        <IonCol size="12" size-sm="3">
          <IonIcon icon={checkmark} color="success" />
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol size="12" size-sm="3">
          Price
        </IonCol>
        <IonCol size="12" size-sm="3">
          Free
        </IonCol>
        <IonCol size="12" size-sm="3">
          $4.99/mo or $49/year
        </IonCol>
        <IonCol size="12" size-sm="3">
          Contact Us
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default PriceComparisonTable;
