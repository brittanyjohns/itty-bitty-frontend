// src/components/SignInScreen.tsx
import React, { useState } from 'react';
import { IonPage, IonContent, IonInput, IonButton, useIonViewWillEnter, IonText } from '@ionic/react';
import { NewUser, signUp } from '../data/users';
import { useHistory } from 'react-router-dom';

const SignInScreen: React.FC = () => {
  const history = useHistory();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>('');

  const handlePassword = (password: string) => {
    console.log('password', password);
    setPassword(password);
  };

  const handlePasswordConfirmation = (password: string) => {
    console.log('password confirmation  ', password);
    setPasswordConfirmation(password);
  }

  const handleEmail = (email: string) => {
    console.log('email', email);
    setEmail(email);
  }

  const handleSignUp = async () => {
    const user: NewUser = {
      email,
      password,
      password_confirmation: passwordConfirmation,
    };

    try {
      console.log('user', user);
      const response = await signUp(user); // Assuming signUp returns the token directly or within a response object
      console.log("Sign Up response", response);
      localStorage.setItem('token', response.token); // Store the token
      history.push('/boards');
    } catch (error) {
      console.error('Error signing up: ', error);
      alert('Error signing up: ' + error);
      history.push('/sign-up');
    }
    window.location.reload();
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <IonText className="text-3xl">Sign Up</IonText>
        <div className="w-full max-w-xs">
          <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="mb-4">
              <IonInput
                value={email}
                placeholder="Email"
                onIonInput={(e) => handleEmail(e.detail.value!)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              ></IonInput>
            </div>
            <div className="mb-6">
              <IonInput
                type="password"
                value={password}
                placeholder="Choose A Password"
                onIonInput={(e) => handlePassword(e.detail.value!)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              ></IonInput>
            </div>
            <div className="mb-6">
              <IonInput
                type="password"
                value={passwordConfirmation}
                placeholder="Confirm Password"
                onIonInput={(e) => handlePasswordConfirmation(e.detail.value!)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              ></IonInput>
            </div>
            <div className="flex items-center justify-between">
              <IonButton color="primary" onClick={handleSignUp}>
                Sign Up
              </IonButton>
            </div>
          </form>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SignInScreen;
