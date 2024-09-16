import React, { useEffect, useState } from "react";
import { IonPage, IonContent } from "@ionic/react";
import { NewUser, signUp } from "../../data/users";
import { useHistory, useLocation } from "react-router-dom";
import MainMenu from "../../components/main_menu/MainMenu";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import MainHeader from "../MainHeader";
import StaticMenu from "../../components/main_menu/StaticMenu";
import { logInOutline } from "ionicons/icons";
import SignUpForm from "../../components/utils/SignUpForm";
import Footer from "../../components/utils/Footer";

interface SignUpScreenProps {
  plan: string;
}

const SignUpScreen = ({ plan }: SignUpScreenProps) => {
  const history = useHistory();
  const location = useLocation();
  const [email, setEmail] = useState<string>("");
  const [emailParam, setEmailParam] = useState<string>("");
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
      setEmailParam(emailParam);
      setEmail(emailParam);
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
        <IonContent className="flex flex-col items-center p-6">
          <div className="relative lower-fixed-bg">
            <div className="flex flex-col justify-center items-center text-center py-10 bg-black bg-opacity-80">
              <h1 className="text-2xl md:text-5xl font-bold text-white">
                Empower Your Child's Communication
              </h1>
              <p className="mt-4 text-sm md:text-xl text-white">
                Discover the simplicity of SpeakAnyWay.
              </p>
            </div>
            {emailParam && (
              <div className="flex flex-col justify-center items-center text-center gap-1 p-2 m-2 bg-green-400 bg-opacity-95 rounded-lg w-11/12 md:w-3/4 lg:w-1/2 mx-auto">
                <h1 className="text-3xl font-bold text-center mt-4">
                  Thanks for signing up! We'll be in touch soon.
                </h1>
                <div className="font-bold text-xl sm:text-sm md:text-sm  text-center">
                  <p className="text-center p-2 text-md font-semibold">
                    While you're waiting on the hot, new features, why not check
                    out the existing ones?
                  </p>
                  <p className="text-center p-4 text-sm md:text-md">
                    Sign up for a free account and start using SpeakAnyWay now!
                  </p>
                </div>
              </div>
            )}

            <div className="pb-10">
              <SignUpForm plan={plan} />
            </div>
          </div>
          <Footer />
        </IonContent>
      </IonPage>
    </>
  );
};

export default SignUpScreen;
