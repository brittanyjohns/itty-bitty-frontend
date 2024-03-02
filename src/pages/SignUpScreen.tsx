// src/components/SignInScreen.tsx
import React, { useState } from 'react';
import { IonPage, IonContent, IonInput, IonButton, useIonViewWillEnter } from '@ionic/react';
import { NewUser, signUp } from '../data/users';
import { useHistory } from 'react-router-dom';

const SignInScreen: React.FC = () => {
  const history = useHistory();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>('');

  useIonViewWillEnter(() => {
    console.log('Sign UP- ionViewWillEnter event fired');
    
  });
  const handleSignUp = async () => {
    const user: NewUser = {
      email,
      password,
      password_confirmation: passwordConfirmation,
    };

    if (password !== passwordConfirmation) {
      console.error('Password and password confirmation do not match');
      alert('Password and password confirmation do not match');
      return;
    }

    try {
      const response = await signUp(user); // Assuming signUp returns the token directly or within a response object
      localStorage.setItem('token', response.token); // Store the token
      history.push('/boards');
    } catch (error) {
      console.error('Error signing up: ', error);
      history.push('/sign-up');
    }
    window.location.reload();
  };

  return (
    <IonPage>
      <IonContent className="flex items-center justify-center h-full">
        <div className="w-full max-w-xs">
          <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="mb-4">
              <IonInput
                value={email}
                placeholder="Email"
                onIonChange={(e) => setEmail(e.detail.value!)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              ></IonInput>
            </div>
            <div className="mb-6">
              <IonInput
                type="password"
                value={password}
                placeholder="Password"
                onIonChange={(e) => setPassword(e.detail.value!)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              ></IonInput>
            </div>
            <div className="mb-6">
              <IonInput
                type="password"
                value={passwordConfirmation}
                placeholder="Confirm Password"
                onIonChange={(e) => setPasswordConfirmation(e.detail.value!)}
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
