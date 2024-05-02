// SignOut.tsx

import { IonButton } from "@ionic/react";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { isUserSignedIn, signOut } from "../../data/users";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import MainMenu from "../../components/main_menu/MainMenu";

const SignOutScreen: React.FC = () => {
  const history = useHistory();
  const { currentUser, setCurrentUser } = useCurrentUser();

  const handleSignOut = async () => {
    try {
      const response = await signOut(); // Assuming signUp returns the token directly or within a response object
      console.log(response);
      console.log("User signed out");
      localStorage.removeItem("token");
      setCurrentUser(null);
      history.push("/");
      window.location.reload();
      // Handle success (e.g., redirect to dashboard)
    } catch (error) {
      console.error("Error signing up: ", error);
      alert("Error signing out: " + error);
      history.push("/home");
      // Handle error (e.g., show error message)
    }
  };

  useEffect(() => {
    handleSignOut().then(() => {
      history.push("/home");
      window.location.reload();
    });
  }, [history]);

  // Optionally, return null or a loading spinner while the redirect is being processed
  return (
    <div>
      <MainMenu />
      {!isUserSignedIn() && (
        <IonButton onClick={() => history.push("/sign-in")}>Sign In</IonButton>
      )}
      {isUserSignedIn() && (
        <IonButton onClick={handleSignOut}>Sign Out</IonButton>
      )}
    </div>
  );
};

export default SignOutScreen;
