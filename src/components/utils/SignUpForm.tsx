import React, { useEffect, useState } from "react";
import { IonInput, IonButton, IonCard } from "@ionic/react";
import { NewUser, signUp } from "../../data/users";
import { useHistory, useLocation } from "react-router-dom";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import UserHome from "../../components/utils/UserHome";

interface SignUpFormProps {
  plan: string;
}

const SignUpForm = ({ plan }: SignUpFormProps) => {
  const history = useHistory();
  const location = useLocation();
  const [email, setEmail] = useState<string>("");
  const [emailParam, setEmailParam] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");
  const { isWideScreen, currentAccount, currentUser } = useCurrentUser();

  useEffect(() => {
    if (currentUser) {
      history.push("/welcome");
    }
  }, [currentUser]);

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
      {currentUser && (
        <>
          <h1 className="text-2xl font-bold text-center mt-4">
            You're already signed up.
          </h1>
          <UserHome userName={currentUser?.name || currentUser.email} />
        </>
      )}

      <IonCard className="w-full max-w-xs mx-auto">
        <form className="shadow-md rounded px-8 pt-6 pb-8">
          <h1 className="text-2xl font-bold text-center mb-3">Sign Up</h1>
          <div className="mb-4">
            <IonInput
              value={email}
              fill="outline"
              className="mt-4"
              label="Email"
              labelPlacement="stacked"
              onIonInput={(e: any) => handleEmail(e.detail.value!)}
            ></IonInput>
          </div>
          <div className="mb-6">
            <IonInput
              label="Password"
              type="password"
              fill="outline"
              className="mt-4"
              labelPlacement="stacked"
              value={password}
              onIonInput={(e: any) => handlePassword(e.detail.value!)}
            ></IonInput>
          </div>
          <div className="mb-6">
            <IonInput
              label="Password Confirmation"
              type="password"
              fill="outline"
              value={passwordConfirmation}
              labelPlacement="stacked"
              onIonInput={(e: any) =>
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
            <p className="text-center mt-8 font-md">Already have an account?</p>
            <IonButton
              fill="outline"
              color="medium"
              className="mt-4 w-full"
              style={{ minWidth: "200px" }}
              onClick={() => history.push("/sign-in")}
            >
              Sign In
            </IonButton>
          </div>
        </form>
      </IonCard>
    </>
  );
};

export default SignUpForm;
