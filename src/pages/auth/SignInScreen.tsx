import React, { useState } from "react";
import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  IonAlert,
  IonButtons,
  IonLabel,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import { User, signIn } from "../../data/users";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import MainMenu from "../../components/main_menu/MainMenu";
import MainHeader from "../MainHeader";
import { getImageUrl } from "../../data/utils";
import StaticMenu from "../../components/main_menu/StaticMenu";
import { logInOutline } from "ionicons/icons";
import UserHome from "../../components/utils/UserHome";

const SignInScreen: React.FC = () => {
  const history = useHistory();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { setCurrentUser, isWideScreen, currentUser, currentAccount } =
    useCurrentUser();

  const handleSignIn = async () => {
    const user: User = { email, password };
    try {
      const response = await signIn(user);
      if (response && response.token) {
        localStorage.setItem("token", response.token);
        setCurrentUser(response.user);
        history.push("/welcome");
        window.location.reload();
      } else if (response && response.error) {
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
  };

  return (
    <>
      <MainMenu
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
        <MainHeader
          pageTitle="Sign In"
          isWideScreen={isWideScreen}
          endLink="/sign-up"
          endIcon={logInOutline}
          showMenuButton={!isWideScreen}
        />
        <IonContent className="">
          {currentUser && (
            <>
              <h1 className="text-2xl font-bold text-center mt-4">
                You're already signed in.
              </h1>
              <UserHome userName={currentUser?.name || currentUser.email} />
            </>
          )}
          {!currentUser && (
            <div
              className="hero_main1 bg-cover bg-center  min-h-screen"
              style={{
                backgroundImage: `url(${getImageUrl("feature_2", "webp")})`,
              }}
            >
              <div className="flex flex-col justify-center items-center text-center py-10 bg-black bg-opacity-80">
                <h1 className="text-2xl md:text-5xl font-bold text-white">
                  Empower Your Child's Communication
                </h1>
                <p className="mt-4 text-sm md:text-xl text-white">
                  Discover the simplicity of SpeakAnyWay.
                </p>
              </div>
              <div className="max-w-md mx-auto bg-white bg-opacity-95 p-8 shadow-xl mt-20 rounded-md">
                <h1 className="text-2xl font-bold text-center mb-3">Sign In</h1>
                <form onSubmit={(e) => e.preventDefault()}>
                  <IonInput
                    label="Email"
                    labelPlacement="stacked"
                    value={email}
                    fill="solid"
                    className="mt-4"
                    placeholder="Enter your email"
                    onIonChange={(e) => setEmail(e.detail.value!)}
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
                    onIonChange={(e) => setPassword(e.detail.value!)}
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
              </div>
              <div className=" bg-blue-400 p-4 w-11/12 md:w-3/4 lg:w-1/2 mx-auto mt-40 rounded-md">
                <IonButtons className="flex justify-center">
                  <IonButton
                    expand="block"
                    fill="clear"
                    color="medium"
                    onClick={handleForgotPassword}
                  >
                    <IonLabel className="text-lg text-white">
                      Forgot Password?
                    </IonLabel>
                  </IonButton>
                </IonButtons>
              </div>
            </div>
          )}
        </IonContent>
      </IonPage>
    </>
  );
};

export default SignInScreen;
