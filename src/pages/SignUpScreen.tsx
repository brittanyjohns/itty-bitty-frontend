// src/components/SignInScreen.tsx
import React, { useState } from 'react';
import { IonPage, IonContent, IonInput, IonButton, useIonViewWillEnter } from '@ionic/react';
import { NewUser, signUp } from '../data/users';
import { useHistory } from 'react-router-dom';

const SignInScreen: React.FC = () => {
  const history = useHistory();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  useIonViewWillEnter(() => {
    console.log('Sign UP- ionViewWillEnter event fired');
    if (localStorage.getItem('token')) {
      history.push('/boards');
    }
  });
  const handleSignIn = async () => {
    const user: NewUser = {
      email,
      password,
      password_confirmation: password,
    };

    try {
      const response = await signUp(user); // Assuming signUp returns the token directly or within a response object
      console.log(response);
        localStorage.setItem('token', response.token); // Store the token
        console.log('User signed up');
      // Handle success (e.g., redirect to dashboard)
    } catch (error) {
      console.error('Error signing up: ', error);
      // Handle error (e.g., show error message)
    }
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
                value={password}
                placeholder="Confirm Password"
                onIonChange={(e) => setPassword(e.detail.value!)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              ></IonInput>
            </div>
            <div className="flex items-center justify-between">
              <IonButton color="primary" onClick={handleSignIn}>
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
