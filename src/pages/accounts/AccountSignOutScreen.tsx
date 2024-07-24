// SignOut.tsx

import { IonButton } from "@ionic/react";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { isAccountSignedIn, signOut } from "../../data/child_accounts";
import MainMenu from "../../components/main_menu/MainMenu";
import { useCurrentUser } from "../../hooks/useCurrentUser";

const AccountSignOutScreen: React.FC = () => {
  const history = useHistory();
  const { currentAccount, setCurrentAccount } = useCurrentUser();

  const handleSignOut = async () => {
    try {
      const response = await signOut(); // Assuming signUp returns the token directly or within a response object
      console.log(response);
      console.log("ChildAccount signed out");
      localStorage.removeItem("child_token");
      setCurrentAccount(null);
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
    if (!isAccountSignedIn()) {
      history.push("/home");
    }
  }, [history]);
  useEffect(() => {
    console.log("currentAccount", currentAccount);
    let response: any;
    async function fetchData() {
      if (currentAccount === null) response = await signOut();
      console.log(response);
      console.log("ChildAccount signed out");
      localStorage.removeItem("child_token");
      setCurrentAccount(null);
      history.push("/");
      window.location.reload();
    }
    fetchData();
  }, []);

  // useEffect(() => {
  //   handleSignOut().then(() => {
  //     history.push("/home");
  //     // window.location.reload();
  //   });
  // }, [history]);

  // Optionally, return null or a loading spinner while the redirect is being processed
  return (
    <div>
      <MainMenu />
      <IonButton onClick={handleSignOut}>Sign Out</IonButton>
      {/* {!isAccountSignedIn() && (
        <IonButton onClick={() => history.push("/accounts/sign-in")}>
          Sign In
        </IonButton>
      )}
      {isAccountSignedIn() && (
        <IonButton onClick={handleSignOut}>Sign Out</IonButton>
      )} */}
    </div>
  );
};

export default AccountSignOutScreen;
