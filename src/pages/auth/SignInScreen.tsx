import React, { useState } from "react";
import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  IonAlert,
  IonButtons,
  IonLabel,
  IonLoading,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import { User, signIn } from "../../data/users";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import SideMenu from "../../components/main_menu/SideMenu";
import MainHeader from "../MainHeader";
import { getImageUrl } from "../../data/utils";
import StaticMenu from "../../components/main_menu/StaticMenu";
import { logInOutline } from "ionicons/icons";
import UserHome from "../../components/utils/UserHome";
import Footer from "../../components/utils/Footer";

const SignInScreen: React.FC = () => {
  const history = useHistory();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showLoading, setShowLoading] = useState(false);
  const { setCurrentUser, isWideScreen, currentUser, currentAccount } =
    useCurrentUser();

  const handleSignIn = async () => {
    console.log("Signing in...");
    const user: User = { email, password };
    try {
      setShowLoading(true);

      const response = await signIn(user);
      console.log("Sign in response: ", response);
      if (response && response.token) {
        localStorage.setItem("token", response.token);
        setCurrentUser(response.user);
        history.push("/welcome");
        window.location.reload();
      } else if (response && response.error) {
        setErrorMessage(response.error);
        setShowAlert(true);
      } else {
        setErrorMessage("Something went wrong. Please try again later.");
        setShowAlert(true);
      }
      setShowLoading(false);
    } catch (error) {
      setShowLoading(false);
      console.error("Error signing in: ", error);
      setErrorMessage("Error signing in: " + error);
      setShowAlert(true);
    }
  };

  const handleForgotPassword = () => {
    history.push("/forgot-password");
  };

  return (
    <>
      <SideMenu
        pageTitle="Sign In"
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />
      <StaticMenu
        pageTitle="Sign In"
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />

      <IonPage id="main-content">
        <IonLoading
          isOpen={showLoading}
          onDidDismiss={() => setShowLoading(false)}
          message={"Please wait..."}
        />
        <MainHeader
          pageTitle="Sign In"
          isWideScreen={isWideScreen}
          endLink="/sign-up"
          endIcon={logInOutline}
          showMenuButton={!isWideScreen}
        />
        <IonContent className="items-center">
          <div className="relative lower-fixed-bg">
            {currentUser && (
              <div className="flex flex-col items-center bg-white bg-opacity-95 p-8 shadow-xl">
                <h1 className="text-2xl font-bold text-center mt-4">
                  You're already signed in.
                </h1>
                <UserHome userName={currentUser?.name || currentUser.email} />
              </div>
            )}
            {!currentUser && (
              <div className="">
                <div className="flex flex-col justify-center items-center text-center py-10 bg-black bg-opacity-80 w-full">
                  <h1 className="text-2xl md:text-5xl font-bold text-white">
                    Empower Your Child's Communication
                  </h1>
                  <p className="mt-4 text-sm md:text-xl text-white">
                    Discover the simplicity of SpeakAnyWay.
                  </p>
                </div>
                <div className="max-w-md mx-auto bg-white bg-opacity-95 p-8 shadow-xl mt-20 rounded-md">
                  <h1 className="text-2xl font-bold text-center mb-3">
                    Sign In
                  </h1>
                  <form onSubmit={(e: any) => e.preventDefault()}>
                    <IonInput
                      label="Email"
                      labelPlacement="stacked"
                      value={email}
                      fill="solid"
                      className="mt-4"
                      placeholder="Enter your email"
                      onIonChange={(e: any) => setEmail(e.detail.value!)}
                      clearInput
                    />

                    <IonInput
                      label="Password"
                      labelPlacement="stacked"
                      type="password"
                      value={password}
                      fill="solid"
                      className="mt-4"
                      placeholder="Enter your password"
                      onIonChange={(e: any) => setPassword(e.detail.value!)}
                      clearInput
                    />
                    <IonButton
                      expand="block"
                      className="mt-6"
                      size="large"
                      color={"success"}
                      onClick={handleSignIn}
                    >
                      Sign In
                    </IonButton>
                  </form>
                  <IonAlert
                    isOpen={showAlert}
                    onDidDismiss={() => setShowAlert(false)}
                    header="Authentication Failed"
                    message={errorMessage}
                    buttons={["OK"]}
                  />
                  <div className="py-2 rounded-md mt-20">
                    <IonButtons className="flex justify-center">
                      <IonButton
                        expand="block"
                        fill="outline"
                        color="medium"
                        onClick={handleForgotPassword}
                      >
                        <IonLabel className="text-md font-semibold">
                          Forgot Password?
                        </IonLabel>
                      </IonButton>
                    </IonButtons>
                  </div>
                </div>
              </div>
            )}
          </div>
          <Footer />
        </IonContent>
      </IonPage>
    </>
  );
};

export default SignInScreen;
