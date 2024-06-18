import React, { useState } from "react";
import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  IonItem,
  IonAlert,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import { User, signIn } from "../../data/users";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import MainMenu from "../../components/main_menu/MainMenu";
import MainHeader from "../MainHeader";
import { getImageUrl } from "../../data/utils";

const ForgotPasswordScreen: React.FC = () => {
  const history = useHistory();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { setCurrentUser, isWideScreen } = useCurrentUser();


  const handleSignIn = async () => {
    const user: User = { email, password };
    try {
      const response = await signIn(user);
      console.log("Sign In response", response);
      if (response.token) {
        localStorage.setItem("token", response.token);
        setCurrentUser(response.user);
        history.push("/home");
        window.location.reload();
      } else if (response.error) {
        setErrorMessage(response.error);
        setShowAlert(true);
      }
    } catch (error) {
      setErrorMessage("Error signing in: " + error);
      setShowAlert(true);
    }
  };

  const handleForgotPassword = () => {
    history.push("/forgot-password");
  }

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
                <h1 className="text-2xl font-bold text-center mb-3">Forgot Password</h1>
                <form onSubmit={(e) => e.preventDefault()}>
                  <IonItem lines="full" className="mb-4">
                    <IonInput
                      label="Email"
                      labelPlacement="stacked"
                      value={email}
                      placeholder="Enter your email"
                      onIonChange={(e) => setEmail(e.detail.value!)}
                      clearInput
                    />
                  </IonItem>
                  <IonButton expand="block" className="mt-6" onClick={handleSignIn}>
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
      <IonContent className="ion-padding">
        
      </IonContent>
    </IonPage>
  </>
  );
};

export default ForgotPasswordScreen;
