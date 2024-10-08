import React, { useState } from "react";
import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  IonItem,
  IonAlert,
  IonToast,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import { forgotPassword } from "../../data/users";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import SideMenu from "../../components/main_menu/SideMenu";
import MainHeader from "../MainHeader";
import { getImageUrl } from "../../data/utils";
import StaticMenu from "../../components/main_menu/StaticMenu";
import { logInOutline } from "ionicons/icons";

const ForgotPasswordScreen: React.FC = () => {
  const history = useHistory();
  const [email, setEmail] = useState<string | undefined>(undefined);
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { isWideScreen } = useCurrentUser();
  const [isOpen, setIsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleForgotPassword = async () => {
    if (!email) {
      setErrorMessage("Please enter your email");
      setShowAlert(true);
      return;
    }
    try {
      const response = await forgotPassword(email);
      console.log("Forgot pasword response", response);
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
      <SideMenu pageTitle="Sign In" isWideScreen={isWideScreen} />
      <StaticMenu pageTitle="Sign In" isWideScreen={isWideScreen} />

      <IonPage id="main-content">
        <MainHeader
          pageTitle="Forgot Password"
          isWideScreen={isWideScreen}
          endLink="/users/sign-in"
          endIcon={logInOutline}
          showMenuButton={!isWideScreen}
        />
        <IonContent>
          <div className="container p-4 bg-white bg-opacity-50 mx-auto shadow-lg">
            <div
              className="hero_main1 bg-cover bg-center  min-h-screen"
              style={{
                backgroundImage: `url(${getImageUrl("hero_main1", "webp")})`,
              }}
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
                <h1 className="text-2xl font-bold text-center mb-3">
                  Forgot Password
                </h1>
                <form onSubmit={(e: any) => e.preventDefault()}>
                  <IonItem lines="full" className="mb-4">
                    <IonInput
                      label="Email"
                      labelPlacement="stacked"
                      value={email}
                      placeholder="Enter your email"
                      onIonChange={(e: any) => setEmail(e.detail.value!)}
                      clearInput
                      required
                    />
                  </IonItem>
                  <IonButton
                    expand="block"
                    className="mt-6"
                    onClick={handleForgotPassword}
                  >
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
        </IonContent>
      </IonPage>
    </>
  );
};

export default ForgotPasswordScreen;
