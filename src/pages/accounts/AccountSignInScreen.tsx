import React, { useEffect, useState } from "react";
import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  IonAlert,
  IonButtons,
  IonHeader,
  IonMenuButton,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import { ChildAccount, signIn } from "../../data/child_accounts";
import { getImageUrl } from "../../data/utils";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import MainMenu from "../../components/main_menu/MainMenu";
import MainHeader from "../MainHeader";

const AccountSignInScreen: React.FC = () => {
  const history = useHistory();
  const [username, setUsername] = useState<string>("");
  const [parentId, setParentId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { currentUser, isWideScreen } = useCurrentUser();

  const handleSignIn = async () => {
    const account: ChildAccount = {
      username,
      password,
      user_id: Number(parentId),
    };
    try {
      console.log("Signing in account: ", account);
      const response = await signIn(account);
      console.log("Account Sign In response", response);
      if (response.token) {
        localStorage.setItem("child_token", response.token);
        history.push("/account-dashboard");
        // alert("ChildAccount signed in");
        window.location.reload();
      } else if (response.error) {
        setErrorMessage(response.error);
        setShowAlert(true);
      }
    } catch (error) {
      setErrorMessage("Error signing in: " + error);
      setShowAlert(true);
      console.error("Error signing in: ", error);
    }
  };

  const handleSetPassword = (e: CustomEvent) => {
    const target = e.target as HTMLInputElement;
    console.log("Password: ", target.value);
    setPassword(target.value);
  };

  useEffect(() => {
    if (currentUser && currentUser.id) {
      history.push("/boards");
    } else {
      console.log("No current user");
    }
  }, [currentUser, history]);

  return (
    <>
      <MainMenu />
      <IonPage id="main-content">
        <MainHeader />

        <div className="h-full">
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
            <div className="max-w-md mx-auto bg-white bg-opacity-95 p-8 rounded-lg shadow-xl mt-20">
              <h1 className="text-2xl font-bold text-center mb-3">
                Child Sign In
              </h1>
              <form onSubmit={(e) => e.preventDefault()}>
                <IonInput
                  label="Username"
                  labelPlacement="stacked"
                  value={username}
                  fill="solid"
                  className="mt-4"
                  placeholder="Enter your username"
                  onIonInput={(e) => setUsername(e.detail.value!)}
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
                  onIonInput={handleSetPassword}
                  clearInput
                />
                <IonButton
                  expand="block"
                  className="mt-6"
                  onClick={handleSignIn}
                  type="submit"
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
          </div>
        </div>
        <IonContent className="ion-padding"></IonContent>
      </IonPage>
    </>
  );
};

export default AccountSignInScreen;
