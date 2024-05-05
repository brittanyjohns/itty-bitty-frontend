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
} from "@ionic/react";
import { NewUser, signUp } from "../../data/users";
import { useHistory } from "react-router-dom";

const SignInScreen: React.FC = () => {
  const history = useHistory();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");

  const handlePassword = (password: string) => {
    setPassword(password);
  };

  const handlePasswordConfirmation = (password: string) => {
    setPasswordConfirmation(password);
  };

  const handleEmail = (email: string) => {
    setEmail(email);
  };

  const handleSignUp = async () => {
    const user: NewUser = {
      email,
      password,
      password_confirmation: passwordConfirmation,
    };

    try {
      const response = await signUp(user); // Assuming signUp returns the token directly or within a response object
      if (response.error) {
        alert("Error signing up:\n " + response.error);
      } else {
        localStorage.setItem("token", response.token); // Store the token
        history.push("/home");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error signing up: ", error);
      alert("Error signing up:\n " + error);
    }
  };

  return (
    <>
      <IonPage>
        <IonHeader className="bg-inherit shadow-none">
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/home"></IonBackButton>
            </IonButtons>
            <IonTitle>Sign Up</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <div className="w-full max-w-xs">
            <form className="shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-md mx-auto bg-opacity-90 p-8 mt-20">
              <div className="mb-4">
                <IonInput
                  value={email}
                  placeholder="Email"
                  onIonInput={(e) => handleEmail(e.detail.value!)}
                  className=""
                ></IonInput>
              </div>
              <div className="mb-6">
                <IonInput
                  type="password"
                  value={password}
                  placeholder="Choose A Password"
                  onIonInput={(e) => handlePassword(e.detail.value!)}
                  className=""
                ></IonInput>
              </div>
              <div className="mb-6">
                <IonInput
                  type="password"
                  value={passwordConfirmation}
                  placeholder="Confirm Password"
                  onIonInput={(e) =>
                    handlePasswordConfirmation(e.detail.value!)
                  }
                  className=""
                ></IonInput>
              </div>
              <div className="flex items-center justify-between">
                <IonButton
                  color="primary"
                  className="w-full"
                  onClick={handleSignUp}
                >
                  Sign Up
                </IonButton>
              </div>
            </form>
          </div>
        </IonContent>
      </IonPage>
    </>
  );
};

export default SignInScreen;
