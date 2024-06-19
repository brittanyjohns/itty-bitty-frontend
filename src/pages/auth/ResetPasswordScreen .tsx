import React, { useEffect, useState } from "react";
import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  IonItem,
  IonAlert,
  IonToast,
} from "@ionic/react";
import { useHistory, useParams } from "react-router-dom";
import { resetPassword } from "../../data/users";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import MainMenu from "../../components/main_menu/MainMenu";
import MainHeader from "../MainHeader";
import { getImageUrl } from "../../data/utils";

const ResetPasswordScreen: React.FC = () => {
  const history = useHistory();
  const [password, setPassword] = useState<string>("");
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { setCurrentUser, isWideScreen } = useCurrentUser();
  const [isOpen, setIsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleResetPassword = async () => {
    if (!password) {
      setErrorMessage("Please enter your password");
      setShowAlert(true);
      return;
    }
    try {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      console.log("URL Params", urlParams);
      const resetPasswordToken = urlParams.get("reset_password_token");
      console.log("Reset password token", resetPasswordToken);
      if (!resetPasswordToken) {
        setErrorMessage("Invalid reset password token");
        setShowAlert(true);
        return;
      }
      const response = await resetPassword(resetPasswordToken, password, passwordConfirmation);
      console.log("Reset pasword response", response);
      if (response.message) {
        setToastMessage(response.message);
        setIsOpen(true);
        history.push("/sign-in");
      } else if (response.error) {
        setErrorMessage(response.error);
        setShowAlert(true);
      }
    } catch (error) {
      setErrorMessage("Error signing in: " + error);
      setShowAlert(true);
    }
  };

  return (
    <>
    <MainMenu />
    <IonPage id="main-content">
        {!isWideScreen && <MainHeader />}
        <div className="container p-4 bg-white bg-opacity-50 mx-auto shadow-lg">
            <div
              className="hero_main1 bg-cover bg-center  min-h-screen"
              style={{ backgroundImage: `url(${getImageUrl("hero_main1", "webp")})` }}
            >
              <div className="flex flex-col justify-center items-center text-center py-10 bg-black bg-opacity-50">
                <h1 className="text-2xl md:text-5xl font-bold text-white">
                  Empower Your Child's Communication
                </h1>
                <p className="mt-4 text-sm md:text-xl text-white">
                  Discover the simplicity of SpeakAnyWay.
                </p>
              </div>
              <div className="max-w-md mx-auto bg-white bg-opacity-90 p-8 rounded-lg shadow-xl mt-20">
                <h1 className="text-2xl font-bold text-center mb-3">Reset Password</h1>
                <form onSubmit={(e) => e.preventDefault()}>
                  <IonItem lines="full" className="mb-4">
                    <IonInput
                      label="Password"
                      labelPlacement="stacked"
                      value={password}
                      placeholder="Enter a new password"
                      onIonChange={(e) => setPassword(e.detail.value!)}
                      clearInput
                      required
                      type="password"
                    />
                  </IonItem>
                  <IonItem lines="full" className="mb-4">
                    <IonInput
                      label="Confirm Password"
                      labelPlacement="stacked"
                      value={passwordConfirmation}
                      placeholder="Confirm your new password"
                      onIonChange={(e) => setPasswordConfirmation(e.detail.value!)}
                      clearInput
                      required
                      type="password"
                    />
                  </IonItem>
                  <IonButton expand="block" className="mt-6" onClick={handleResetPassword}>
                    Reset Password
                  </IonButton>
                </form>
                <IonAlert
                  isOpen={showAlert}
                  onDidDismiss={() => setShowAlert(false)}
                  header="Authentication Failed"
                  message={errorMessage}
                  buttons={["OK"]}
                />
              </div>
          </div>
        </div>    
        <IonToast
          isOpen={isOpen}
          message={toastMessage}
          onDidDismiss={() => setIsOpen(false)}
          duration={2000}
        ></IonToast>
    </IonPage>
  </>
  );
};

export default ResetPasswordScreen;
