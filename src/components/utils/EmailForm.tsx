import React, { useEffect, useRef, useState } from "react";
import { IonModal, IonButton, IonText, IonInput, IonToast } from "@ionic/react";
import { save } from "ionicons/icons";
import { BetaRequest, createBetaRequest } from "../../data/beta_requests";
import { rgb } from "d3";
import { h } from "ionicons/dist/types/stencil-public-runtime";

const EmailForm: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const emailRef = useRef<HTMLIonInputElement>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [showToast, setShowToast] = useState(false);

  const handleAccept = (e: any) => {
    console.log("handleAccept", e);

    // Create a date for the desired expiration
    const expirationDate = new Date();
    expirationDate.setTime(
      expirationDate.getTime() + 365 * 24 * 60 * 60 * 1000
    ); // 1 year from now

    // Convert to UTC string
    const expires = "expires=" + expirationDate.toUTCString();

    document.cookie = "email_signup=true; path=/; " + expires;

    setShowModal(false);
  };

  useEffect(() => {
    if (document.cookie.includes("email_signup=true")) {
      console.log("email_signup cookie found");
      setShowModal(false);
      return;
    } else {
      console.log("email_signup cookie not found");
      setShowModal(true);
      // if (email !== "") {
      //   handleAccept(email);
      // }
    }
    if (emailRef.current) {
      emailRef.current.setFocus();
    }
  }, [showModal]);

  const [toastMessage, setToastMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const handleSubmitEmail = (email: string) => {
    console.log("Email submitted: ", email);
    const betaRequest: BetaRequest = { email }; // Create a betaRequest object
    createBetaRequest(betaRequest) // Pass the betaRequest object as an argument
      .then((response: any) => {
        console.log("Beta request submitted successfully: ", response);
        // Handle success
      })
      .catch((error: any) => {
        console.error("Error submitting beta request: ", error);
        // Handle error
      });

    setEmail(""); // Clear the email input field
    setToastMessage("Thank you for joining the beta! We'll be in touch soon.");
    setIsOpen(true);
    setTimeout(() => {
      setIsOpen(false);
    }, 2500);
    window.location.href = "/sign-up?email=" + email;
  };

  const handleEmailInput = async (e: any) => {
    if (e.target.value.includes("@") && e.target.value.includes(".")) {
      console.log("valid email", e.target.value);
      setEmail(e.target.value);
      const emailResult = await handleSubmitEmail(e.target.value);
      console.log("emailResult", emailResult);
      handleAccept(emailResult);
    } else {
      console.log("invalid email", e.target.value);
      setEmail("");
      setShowModal(true);
      setErrorMsg("Please enter a valid email address.");
      return;
    }
  };

  return (
    <IonModal
      isOpen={showModal}
      style={{
        // background: rgb(255, 255, 255),
        // height: "30%",
        margin: "auto",
        border: "1px solid #333",
      }}
    >
      <div className="ion-padding ion-text-center">
        <IonText className="text-center">
          <h2 className="text-xl">Join our mailing list</h2>
          <p className="text-center my-2">
            Sign up to receive our email updates.
          </p>
          <div className="text-left">
            <p className="font-bold"></p>
          </div>
        </IonText>
        <div className="ion-padding-top mt-5">
          <IonInput
            type="email"
            ref={emailRef}
            placeholder="Enter your email"
            className="mb-2"
            title="email"
            value={email}
            onIonChange={handleEmailInput}
            fill="outline"
          />
          <IonButton
            className="mb-2 w-3/4 mx-auto"
            expand="block"
            fill="solid"
            size="large"
            color="secondary"
            onClick={handleAccept}
          >
            Sign Me Up
          </IonButton>
          <IonButton
            className="mb-2 w-3/4 mx-auto"
            expand="block"
            fill="outline"
            size="large"
            color="secondary"
            onClick={handleAccept}
          >
            No Thanks
          </IonButton>
        </div>
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setIsOpen(false)}
          message={toastMessage}
          duration={2000}
        />
      </div>
    </IonModal>
  );
};

export default EmailForm;
