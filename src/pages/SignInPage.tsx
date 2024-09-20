import { IonButton, IonContent, IonPage } from "@ionic/react";
import SideMenu from "../components/main_menu/SideMenu";
import MainHeader from "./MainHeader";
import { getImageUrl } from "../data/utils";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { logInOutline } from "ionicons/icons";
import StaticMenu from "../components/main_menu/StaticMenu";
import UserHome from "../components/utils/UserHome";
import Footer from "../components/utils/Footer";
import EmpowerBanner from "../components/utils/EmpowerBanner";

const SignInPage: React.FC = () => {
  const { isWideScreen, currentUser, currentAccount } = useCurrentUser();
  return (
    <>
      <SideMenu
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
          <div className="relative lower-fixed-bg">
            {currentUser && (
              <>
                <h1 className="text-2xl font-bold text-center mt-4">
                  You're already signed in.
                </h1>
                <UserHome userName={currentUser?.name || currentUser.email} />
              </>
            )}

            <EmpowerBanner />
            <div className="max-w-md mx-auto bg-white bg-opacity-95 p-8 shadow-xl mt-20 rounded-md">
              <h1 className="text-2xl font-bold text-center mb-3">Sign In</h1>
              <IonButton
                expand="block"
                className="my-6"
                size="large"
                color="secondary"
                routerLink="/users/sign-in"
              >
                Sign In
              </IonButton>
              <IonButton
                expand="block"
                className="mt-6"
                size="large"
                color="secondary"
                routerLink="/accounts/sign-in"
              >
                Child Sign In
              </IonButton>
            </div>
          </div>
          <Footer />
        </IonContent>
      </IonPage>
    </>
  );
};

export default SignInPage;
