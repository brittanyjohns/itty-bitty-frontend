import React, { useEffect, useState } from "react";
import { IonInput, IonButton, IonCard } from "@ionic/react";
import { NewUser, signUp } from "../../data/users";
import { useHistory, useLocation } from "react-router-dom";
import UserHome from "../../components/utils/UserHome";
import { useCurrentUser } from "../../hooks/useCurrentUser";

interface InlineSignUpProps {
  plan: string;
}

const InlineSignUp = ({ plan }: InlineSignUpProps) => {
  const history = useHistory();
  const location = useLocation();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");
  const { currentUser } = useCurrentUser();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailParam = params.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [location.search]);

  const handleSignUp = async () => {
    const user: NewUser = {
      email,
      password,
      password_confirmation: passwordConfirmation,
      plan,
    };

    try {
      const response = await signUp(user);
      if (response.error) {
        alert("Error signing up:\n " + response.error);
      } else {
        localStorage.setItem("token", response.token);
        window.location.href = "/welcome";
      }
    } catch (error) {
      alert("Error signing up:\n " + error);
    }
  };

  return (
    <>
      {currentUser ? (
        <>
          <h1 className="text-2xl font-bold text-center mt-4">
            You're already signed up.
          </h1>
          <UserHome userName={currentUser?.name || currentUser.email} />
        </>
      ) : (
        <div className="w-full max-w-4xl mx-auto">
          <form
            className="flex flex-col lg:flex-row justify-between items-center lg:space-x-4 p-4"
            style={{ gap: "20px" }}
          >
            <IonInput
              value={email}
              fill="outline"
              className="w-full lg:w-1/3 border-b border-gray-300"
              placeholder="Email"
              onIonInput={(e) => setEmail(e.detail.value!)}
            />
            <IonInput
              type="password"
              fill="outline"
              className="w-full lg:w-1/3 border-b border-gray-300"
              placeholder="Password"
              onIonInput={(e) => setPassword(e.detail.value!)}
            />
            <IonInput
              type="password"
              fill="outline"
              className="w-full lg:w-1/3 border-b border-gray-300"
              placeholder="Confirm Password"
              onIonInput={(e) => setPasswordConfirmation(e.detail.value!)}
            />
            <IonButton
              color="primary"
              size="default"
              className=" lg:mt-0 lg:ml-4 w-full lg:w-auto"
              onClick={handleSignUp}
            >
              Sign Up
            </IonButton>
          </form>

          <div className="text-center mt-4">
            <p className="font-medium">Already have an account?</p>
            <IonButton
              fill="outline"
              color="medium"
              className="mt-2"
              onClick={() => history.push("/sign-in")}
            >
              Sign In
            </IonButton>
          </div>
        </div>
      )}
    </>
  );
};

export default InlineSignUp;
