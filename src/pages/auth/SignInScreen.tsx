import React, { useState } from "react";
import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  IonButtons,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonBackButton,
  IonLabel,
  IonItem,
  IonAlert,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import { User, signIn } from "../../data/users";
import { useCurrentUser } from "../../hooks/useCurrentUser";

const SignInScreen: React.FC = () => {
  const history = useHistory();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { setCurrentUser } = useCurrentUser();

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

  return (
    <IonPage id="main-content">
      <IonHeader className="bg-inherit shadow-none">
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Welcome to Itty Bitty Boards</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="max-w-md mx-auto bg-white bg-opacity-90 p-8 rounded-lg shadow-xl mt-20">
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
            <IonItem lines="full">
              <IonInput
                label="Password"
                labelPlacement="stacked"
                type="password"
                value={password}
                placeholder="Enter your password"
                onIonChange={(e) => setPassword(e.detail.value!)}
                clearInput
              />
            </IonItem>
            <IonButton expand="block" className="mt-6" onClick={handleSignIn}>
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
      </IonContent>
    </IonPage>
  );
};

export default SignInScreen;
