// src/pages/PricingPage.tsx
import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/react';

const PricingPage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle className="text-center">Pricing Plans</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="flex flex-col items-center p-6 space-y-6">
        <IonCard className="w-full max-w-md">
          <IonCardHeader className="text-center">
            <IonCardTitle>Freemium</IonCardTitle>
          </IonCardHeader>
          <IonCardContent className="text-center">
            <p>Access to basic features</p>
            <p>Limited support</p>
            <p>Free forever</p>
            <IonButton className="mt-4" expand="full">Get Started</IonButton>
          </IonCardContent>
        </IonCard>

        <IonCard className="w-full max-w-md">
          <IonCardHeader className="text-center">
            <IonCardTitle>Premium</IonCardTitle>
          </IonCardHeader>
          <IonCardContent className="text-center">
            <p>All Freemium features</p>
            <p>Access to premium features</p>
            <p>Priority support</p>
            <p>$9.99/month</p>
            <IonButton className="mt-4" expand="full">Upgrade Now</IonButton>
          </IonCardContent>
        </IonCard>

        <IonCard className="w-full max-w-md">
          <IonCardHeader className="text-center">
            <IonCardTitle>Contact Us</IonCardTitle>
          </IonCardHeader>
          <IonCardContent className="text-center">
            <p>Need more options?</p>
            <p>Contact us for a custom plan</p>
            <IonButton className="mt-4" expand="full">Contact Us</IonButton>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default PricingPage;
