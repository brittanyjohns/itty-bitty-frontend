// SignOut.tsx

import { IonButton, useIonViewWillEnter } from '@ionic/react';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { isUserSignedIn, signOut } from '../data/users';

const SignOutScreen: React.FC = () => {
  const history = useHistory();

  useIonViewWillEnter(() => {
    // Place the logic to remove the token here
    // For example, if you're using localStorage:
    console.log('useIonViewWillEnter');
    // localStorage.removeItem('token');

    // Redirect to home page
    // history.push('/');
  } );

  const handleSignOut = async () => {

    try {
      const response = await signOut(); // Assuming signUp returns the token directly or within a response object
      console.log(response);
      console.log('User signed out');
      history.push('/');
      // Handle success (e.g., redirect to dashboard)
    } catch (error) {
      console.error('Error signing up: ', error);
      history.push('/sign-up');
      // Handle error (e.g., show error message)
    }
  };

  useEffect(() => {
    // Place the logic to remove the token here
    // For example, if you're using localStorage:
    console.log('useEffect');
    // localStorage.removeItem('token');

    // Redirect to home page
    // history.push('/');
  }, [history]);

  // Optionally, return null or a loading spinner while the redirect is being processed
  return (
    <div>
      {isUserSignedIn() && <IonButton
        onClick={() => {
          console.log('Sign out');
          // Remove the token
          // Redirect to home page
          history.push('/');
        }} >Sign Out</IonButton>}
        {!isUserSignedIn() && <IonButton onClick={() => history.push('/sign-in')}>Sign In</IonButton>}
    </div>
  )
};

export default SignOutScreen;  
