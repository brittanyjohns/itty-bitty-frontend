import { IonButton, IonContent, IonPage } from "@ionic/react";
import MainMenu from "../components/main_menu/MainMenu";
import MainHeader from "./MainHeader";
import { getImageUrl } from "../data/utils";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { logInOutline } from "ionicons/icons";
import StaticMenu from "../components/main_menu/StaticMenu";
import UserHome from "../components/utils/UserHome";

const SignInPage: React.FC = () => {
  const { isWideScreen, currentUser, currentAccount } = useCurrentUser();
  return (
    <>
      <MainMenu
        pageTitle="Sign Up"
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />
      <StaticMenu
        pageTitle="Sign In"
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />

      <IonPage id="main-content">
        <MainHeader
          pageTitle="Sign In"
          isWideScreen={isWideScreen}
          endLink="/sign-up"
          endIcon={logInOutline}
          showMenuButton={!isWideScreen}
        />
        <IonContent className="">
          {currentUser && (
            <>
              <h1 className="text-2xl font-bold text-center mt-4">
                You're already signed in.
              </h1>
              <UserHome userName={currentUser?.name || currentUser.email} />
            </>
          )}
          <div
            className="hero_main1 bg-cover bg-center  min-h-screen"
            style={{
              backgroundImage: `url(${getImageUrl("feature_2", "webp")})`,
            }}
          >
            <div className="flex flex-col justify-center items-center text-center py-10 bg-black bg-opacity-80">
              <h1 className="text-2xl md:text-5xl font-bold text-white">
                Empower Your Child's Communication
              </h1>
              <p className="mt-4 text-sm md:text-xl text-white">
                Discover the simplicity of SpeakAnyWay.
              </p>
            </div>
            <div className="max-w-md mx-auto bg-white bg-opacity-95 p-8 shadow-xl mt-8">
              <h1 className="text-2xl font-bold text-center mb-3">Sign In</h1>
              <IonButton
                expand="block"
                className="mt-6"
                routerLink="/users/sign-in"
              >
                Sign In
              </IonButton>
              <IonButton
                expand="block"
                className="mt-6"
                routerLink="/accounts/sign-in"
              >
                Child Sign In
              </IonButton>
            </div>
          </div>
        </IonContent>
      </IonPage>
    </>
  );
};

export default SignInPage;
