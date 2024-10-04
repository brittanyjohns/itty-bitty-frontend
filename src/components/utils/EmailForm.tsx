import React, { useState } from "react";
import {
  IonModal,
  IonButton,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonText,
  IonInput,
} from "@ionic/react";

const EmailForm: React.FC = () => {
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

  const handleSignMeUp = () => {
    document.cookie = "email_signup=true; path=/;";
    setShowModal(false);
  };
  const handleEmailInput = (e: any) => {
    if (!e || !e.target || !e.target.value) {
      return;
    }
    if (e.target.value.includes("@")) {
      console.log("valid email");
      return;
    } else {
      console.log("invalid email", e.target.value);
    }
    //
  };

  return (
    <IonModal isOpen={showModal}>
      <IonHeader>
        <IonToolbar>
          <IonTitle className="text-center">Sign Up for email updates</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonText className="text-center">
          <h2 className="text-xl">Join our mailing list</h2>
          <p className="text-center my-2">
            Sign up to receive our email updates.
          </p>
          <div className="text-left m-5">
            <p className="font-bold"></p>
          </div>
        </IonText>
        <div className="ion-padding-top mt-5">
          <IonInput
            type="email"
            placeholder="Enter your email"
            className="mb-2"
            title="email"
            onIonChange={handleEmailInput}
            fill="outline"
          />
          <IonButton
            className="mb-2 w-3/4 mx-auto"
            expand="block"
            fill="solid"
            size="large"
            color="secondary"
            onClick={handleSignMeUp}
          >
            Sign Me Up
          </IonButton>
        </div>
      </IonContent>
    </IonModal>
  );
};

export default EmailForm;
