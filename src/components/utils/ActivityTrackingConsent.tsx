import React, { useEffect, useState } from "react";
import {
  IonModal,
  IonButton,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonText,
} from "@ionic/react";

const ActivityTrackingConsent: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  const handleAccept = () => {
    // Create a date for the desired expiration
    const expirationDate = new Date();
    expirationDate.setTime(
      expirationDate.getTime() + 365 * 24 * 60 * 60 * 1000
    ); // 1 year from now

    // Convert to UTC string
    const expires = "expires=" + expirationDate.toUTCString();

    // Set the cookie with the expires attribute
    document.cookie = "tracking_consent=true; path=/; " + expires;
    setShowModal(false);
  };

  const handleDecline = () => {
    document.cookie = "tracking_consent=false; path=/";
    setShowModal(false);
  };

  useEffect(() => {
    const trackingConsent = document.cookie.split("; ").find((row) => {
      return row.startsWith("tracking_consent=true");
    });

    if (!trackingConsent) {
      console.log("No tracking consent found");
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, []);

  return (
    <IonModal isOpen={showModal}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Activity Tracking Consent</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonText>
          <h2 className="text-xl">Help Us Improve Our Services</h2>
          <p className="text-left my-2">
            At SpeakAnyWay, we strive to enhance our AAC software based on user
            interactions.
          </p>
          <p className="font-bold">We track word clicks and patterns to:</p>

          <ul className="list-disc list-inside mb-2">
            <li>Understand how users interact with the application</li>
            <li>Identify popular features and areas for improvement</li>
            <li>Personalize your experience with relevant suggestions</li>
          </ul>
          <p>
            By clicking <span className="font-bold">"Accept"</span>, you consent
            to our tracking of your activity. Learn more about our data
            practices in our <a href="/privacy-policy">Privacy Policy</a>.
          </p>
        </IonText>
        <div className="ion-padding-top">
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

export default ActivityTrackingConsent;
