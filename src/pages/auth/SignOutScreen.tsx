// SignOut.tsx

import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { isUserSignedIn, signOut } from "../../data/users";
import { useCurrentUser } from "../../hooks/useCurrentUser";

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
      history.push("/users/sign-in");
      window.location.reload();
      // Handle success (e.g., redirect to dashboard)
    } catch (error) {
      console.error("Error signing up: ", error);
      history.push("/users/sign-in");
      // Handle error (e.g., show error message)
    }
  };

  useEffect(() => {
    if (!isUserSignedIn()) {
      history.push("/users/sign-in");
    } else {
      handleSignOut();
    }
  }, []);

  // Optionally, return null or a loading spinner while the redirect is being processed
  return <div></div>;
};

export default SignOutScreen;
