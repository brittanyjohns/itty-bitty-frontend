// SignOut.tsx

import { IonButton, useIonViewWillEnter } from '@ionic/react';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const SignOutScreen: React.FC = () => {
  const history = useHistory();

  useIonViewWillEnter(() => {
    // Place the logic to remove the token here
    // For example, if you're using localStorage:
    console.log('useIonViewWillEnter');
    localStorage.removeItem('token');

    // Redirect to home page
    // history.push('/');
  } );

  useEffect(() => {
    // Place the logic to remove the token here
    // For example, if you're using localStorage:
    console.log('useEffect');
    localStorage.removeItem('token');

    // Redirect to home page
    // history.push('/');
  }, [history]);

  // Optionally, return null or a loading spinner while the redirect is being processed
  return (
    <div>Signing out...
        <IonButton onClick={() => history.push('/sign-in')}>Sign In</IonButton>
    </div>
  )
};

export default SignOutScreen;  
