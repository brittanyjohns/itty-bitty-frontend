import React, { useState } from "react";
import {
  IonModal,
  IonButton,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonText,
} from "@ionic/react";

const CookiesConsent: React.FC = () => {
  const [showModal, setShowModal] = useState(true);

  const handleAccept = () => {
    // Create a date for the desired expiration
    const expirationDate = new Date();
    expirationDate.setTime(
      expirationDate.getTime() + 365 * 24 * 60 * 60 * 1000
    ); // 1 year from now

    // Convert to UTC string
    const expires = "expires=" + expirationDate.toUTCString();

    // Set the cookie with the expires attribute
    document.cookie = "cookies_consent=true; path=/; " + expires;
    setShowModal(false);
  };

  const handleDecline = () => {
    document.cookie = "cookies_consent=false; path=/";
    setShowModal(false);
  };

  return (
    <IonModal isOpen={showModal}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Cookies Consent</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonText className="text-center">
          <h2 className="text-xl">Enhance Your Experience</h2>
          <p className="text-center my-2">
            We use cookies to provide you with a better experience on
            SpeakAnyWay.
          </p>
          <div className="text-left m-5">
            <p className="font-bold">Cookies help us to:</p>
            <ul className="list-disc list-inside mb-2">
              <li>Understand your preferences for future visits</li>
              <li>
                Analyze site traffic and interactions to improve our services
              </li>
              <li>Offer personalized content and advertisements</li>
            </ul>
          </div>
          <p className="mt-2">
            By clicking <span className="font-bold">"Accept"</span>, you consent
            to our use of cookies.
          </p>
          <p className="mt-2">
            You can manage your preferences in our{" "}
            <a href="/privacy-policy">Privacy Policy</a>.
          </p>
        </IonText>
        <div className="ion-padding-top mt-5">
          <IonButton
            color={"primary"}
            fill="solid"
            className="mb-2"
            shape="round"
            expand="block"
            onClick={handleAccept}
          >
            Accept
          </IonButton>
          <IonButton
            className="mb-2"
            shape="round"
            expand="block"
            color="danger"
            onClick={handleDecline}
          >
            Decline
          </IonButton>
        </div>
      </IonContent>
    </IonModal>
  );
};

export default CookiesConsent;
