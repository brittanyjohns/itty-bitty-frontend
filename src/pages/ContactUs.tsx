import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonMenuButton,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import MainMenu from "../components/main_menu/MainMenu";
import Tabs from "../components/utils/Tabs";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { getImageUrl } from "../data/utils";
import MainHeader from "./MainHeader";
import StaticMenu from "../components/main_menu/StaticMenu";
const ContactUs: React.FC = () => {
  const { isWideScreen, currentAccount, currentUser } = useCurrentUser();

  const feature1Image = getImageUrl("feature_1", "webp");

  const style = {
    backgroundImage: `url(${feature1Image})`,
  };

  const refresh = (e: CustomEvent) => {
    setTimeout(() => {
      e.detail.complete();
    }, 3000);
  };

  return (
    <>
      <MainMenu
        pageTitle="Contact Us"
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />
      <StaticMenu
        pageTitle="Contact Us"
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />

      <IonPage id="main-content">
        <MainHeader pageTitle="Contact Us" isWideScreen={isWideScreen} />

        <IonContent className="flex flex-col items-center p-6 space-y-6 bg-gray-50">
          <div
            className="hero_main1 bg-cover bg-center  h-full w-full"
            style={style}
          >
            <div className="text-center py-8 shadow-overlay">
              <h1 className="text-2xl font-bold text-center">
                Get in touch with SpeakAnyWay
              </h1>
              <p className="my-4 text-sm md:text-xl">
                We're here to help! Whether you have questions about our plans,
                features, or anything else, our team is ready to answer all your
                questions.
              </p>
            </div>
            <div className="mt-3 bv w-3/4 max-w-lg space-y-4 mx-auto p-6 bg-white shadow-lg rounded-lg bg-opacity-70">
              <IonItem className="w-full">
                <IonLabel position="floating">Name</IonLabel>
                <IonInput type="text" required></IonInput>
              </IonItem>

              <IonItem className="w-full">
                <IonLabel position="floating">Email</IonLabel>
                <IonInput type="email" required></IonInput>
              </IonItem>

              <IonItem className="w-full">
                <IonLabel position="floating">Subject</IonLabel>
                <IonInput type="text" required></IonInput>
              </IonItem>

              <IonItem className="w-full">
                <IonLabel position="floating">Message</IonLabel>
                <IonTextarea rows={6} required></IonTextarea>
              </IonItem>

              <IonButton expand="full" color="primary" className="mt-4">
                Send Message
              </IonButton>
            </div>
          </div>
        </IonContent>
      </IonPage>
      {currentUser && <Tabs />}
    </>
  );
};

export default ContactUs;
