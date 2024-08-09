import React, { useEffect, useState } from "react";
import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  IonButtons,
  IonHeader,
  IonMenuButton,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { NewUser, signUp } from "../../data/users";
import { useHistory, useLocation } from "react-router-dom";
import MainMenu from "../../components/main_menu/MainMenu";
import { getImageUrl } from "../../data/utils";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import MainHeader from "../MainHeader";
import StaticMenu from "../../components/main_menu/StaticMenu";
import { logInOutline } from "ionicons/icons";

interface SignUpScreenProps {
  plan: string;
}

const SignUpScreen = ({ plan }: SignUpScreenProps) => {
  const history = useHistory();
  const location = useLocation();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");
  const { isWideScreen, currentAccount, currentUser } = useCurrentUser();

  const getQueryParams = (search: string) => {
    return new URLSearchParams(search);
  };

  useEffect(() => {
    const params = getQueryParams(location.search);
    const emailParam = params.get("email");
    if (emailParam) {
      setEmail(emailParam);
      console.log("params.email", emailParam);
    }
  }, [location.search]);

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
      plan: plan,
    };

    try {
      const response = await signUp(user); // Assuming signUp returns the token directly or within a response object
      if (response.error) {
        alert("Error signing up:\n " + response.error);
      } else {
        localStorage.setItem("token", response.token); // Store the token
        if (plan === "free") {
          // history.push("/predictive");
          window.location.href = "/welcome";
        } else if (plan === "pro") {
          // history.push("/upgrade");
          window.location.href = "/welcome";
        } else {
          // history.push("/dashboard");
          window.location.href = "/welcome";
        }
      }
    } catch (error) {
      console.error("Error signing up: ", error);
      alert("Error signing up:\n " + error);
    }
  };

  return (
    <>
      <MainMenu
        pageTitle="Sign Up"
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />
      <StaticMenu
        pageTitle="Sign Up"
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />

      <IonPage id="main-content">
        <MainHeader
          pageTitle="Sign Up"
          isWideScreen={isWideScreen}
          endLink="/sign-in"
          endIcon={logInOutline}
          showMenuButton={!isWideScreen}
        />
        <IonContent className="">
          <div
            className="hero_main1 bg-cover bg-center min-h-screen pb-5"
            style={{
              backgroundImage: `url(${getImageUrl("feature_1", "webp")})`,
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
            {email && (
              <div className="flex flex-col justify-center items-center text-center gap-4 py-4">
                <div className="bg-white bg-opacity-95 rounded-lg w-5/6 md:w- p-3/4 font-bold text-2xl sm:text-sm md:text-sm  text-center">
                  <p className="text-center p-4 text-md font-semibold">
                    While you're waiting on the hot, new features, why not check
                    out the existing ones?
                  </p>
                  <p className="text-center p-4 text-sm md:text-md">
                    Sign up for a free account and start using SpeakAnyWay now!
                  </p>
                </div>
              </div>
            )}
            <div className="w-full max-w-xs mx-auto">
              <form className="shadow-md rounded mt-8 bg-white bg-opacity-95 p-8">
                <h1 className="text-2xl font-bold text-center mb-3">Sign Up</h1>
                <div className="mb-4">
                  <IonInput
                    value={email}
                    fill="solid"
                    className="mt-4"
                    label="Email"
                    labelPlacement="stacked"
                    placeholder="Email"
                    onIonInput={(e) => handleEmail(e.detail.value!)}
                  ></IonInput>
                </div>
                <div className="mb-6">
                  <IonInput
                    label="Password"
                    type="password"
                    fill="solid"
                    className="mt-4"
                    labelPlacement="stacked"
                    value={password}
                    placeholder="Choose A Password"
                    onIonInput={(e) => handlePassword(e.detail.value!)}
                  ></IonInput>
                </div>
                <div className="mb-6">
                  <IonInput
                    label="Password Confirmation"
                    type="password"
                    fill="solid"
                    value={passwordConfirmation}
                    labelPlacement="stacked"
                    placeholder="Confirm Password"
                    onIonInput={(e) =>
                      handlePasswordConfirmation(e.detail.value!)
                    }
                    className="mt-4"
                  ></IonInput>
                </div>
                <div className="mt-8">
                  <IonButton
                    color="primary"
                    expand="full"
                    size="large"
                    onClick={handleSignUp}
                  >
                    Sign Up
                  </IonButton>
                  <p className="text-center mt-8 font-light">
                    Already have an account?
                  </p>
                  <IonButton
                    expand="full"
                    fill="clear"
                    color="medium"
                    className="ion-text-wrap mx-auto w-full mt-2 font-bold"
                    style={{ minWidth: "200px" }}
                    onClick={() => history.push("/sign-in")}
                  >
                    Sign In
                  </IonButton>
                </div>
              </form>
            </div>
          </div>
        </IonContent>
      </IonPage>
    </>
  );
};

export default SignUpScreen;
