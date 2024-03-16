// src/components/SignInScreen.tsx
import React, { useEffect, useState } from 'react';
import { IonPage, IonContent, IonInput, IonButton, IonButtons, IonHeader, IonMenuButton, IonTitle, IonToolbar, IonBackButton } from '@ionic/react';
import { User, signIn } from '../data/users';
import { useHistory } from 'react-router-dom';
import MainMenu from '../components/MainMenu';
import { useCurrentUser } from '../hooks/useCurrentUser';
const SignInScreen: React.FC = () => {
  const history = useHistory();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { currentUser, setCurrentUser } = useCurrentUser();

  const handleSetPassword = (e: CustomEvent) => {
    setPassword(e.detail.value);
  }

  const handleSignIn = async () => {
    const user: User = {
      email,
      password,
    };

    try {
      const response = await signIn(user); // Assuming signIn returns the token directly or within a response object
      console.log('Sign In response', response);
      if (response.token) {
        localStorage.setItem('token', response.token); // Store the token
        setCurrentUser(response.user);
        history.push('/home'); // Redirect to /home
        window.location.reload();
        return;
      } else {
        if (response.error) {
          alert('Error:\n' + response.error);
        }
      }
    } catch (error) {
      alert('Error signing in: ' + error);
    }
  };

  return (
    <>
      <MainMenu />

      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/home"></IonBackButton>
            </IonButtons>
            <IonTitle>Welcome to Itty Bitty Boards</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className='ion-padding'>

          <div>
            <form className="">
              <div className="mb-4">
                <IonInput
                  value={email}
                  placeholder="Email"
                  onIonInput={(e) => setEmail(e.detail.value!)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                ></IonInput>
              </div>
              <div className="mb-6">
                <IonInput
                  type="password"
                  value={password}
                  placeholder="Password"
                  onIonInput={handleSetPassword}
                  className="shadow appearance-none border rounded w-full py-2 px-3 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                ></IonInput>
              </div>
              <div className="flex items-center justify-between">
                <IonButton color="primary" onClick={handleSignIn}>
                  Sign In
                </IonButton>
              </div>
            </form>
          </div>
        </IonContent>
      </IonPage>
    </>
  );
};

export default SignInScreen;
