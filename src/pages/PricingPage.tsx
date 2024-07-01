import React from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonBackButton,
  IonButtons,
} from "@ionic/react";
import MainMenu from "../components/main_menu/MainMenu";
import { getImageUrl } from "../data/utils";
import { useHistory } from "react-router";

const PricingPage: React.FC = () => {
  const history = useHistory();
  return (
    <>
      <MainMenu />
      <IonPage id="main-content">
        <IonHeader className="bg-inherit shadow-none">
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/" />
            </IonButtons>
            <IonTitle>Pricing</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="flex flex-col items-center p-6 space-y-6 bg-gray-50">
          <div
            className="hero_main1 bg-cover bg-center h-full w-full"
            style={{
              backgroundImage: `url(${getImageUrl("hero_main1", "webp")})`,
            }}
          >
            <div className="flex flex-col justify-center items-center text-center py-10 bg-black bg-opacity-80 mb-8">
              <h1 className="text-2xl md:text-5xl font-bold text-white">
                Find the plan that's right for you.
              </h1>
              <p className="mt-4 text-sm md:text-xl text-white">
                Join the growing community of users who enhance their
                communication with SpeakAnyWay.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <IonCard className="">
                <IonCardHeader className="text-center">
                  <div className="text-2xl font-bold">Freemium</div>
                </IonCardHeader>
                <IonCardContent className="text-center">
                  <p>
                    Create unlimited boards, use images from our library or
                    upload your own, and more.
                  </p>
                  <div className="text-3xl font-bold my-4">Free</div>
                  <p className="mt-2">Forever - All basic features</p>
                  <IonButton
                    className="mt-4"
                    expand="full"
                    color="primary"
                    onClick={() => history.push("/sign-up")}
                  >
                    Get Started
                  </IonButton>
                </IonCardContent>
              </IonCard>

              <IonCard className="">
                <IonCardHeader className="text-center">
                  <div className="text-2xl font-bold">Premium</div>
                </IonCardHeader>
                <IonCardContent className="text-center">
                  <p>
                    Enjoy an ad-free experience and unlock premium features like
                    the Menu Reader & AI-generated images.
                  </p>
                  <div className="text-3xl font-bold my-4">$4.99/mo</div>
                  <p className="mt-2">Or $49/year (Save 20%)</p>
                  <IonButton
                    className="mt-4"
                    expand="full"
                    color="secondary"
                    onClick={() => history.push("/upgrade")}
                  >
                    Upgrade Now
                  </IonButton>
                </IonCardContent>
              </IonCard>

              <IonCard className="">
                <IonCardHeader className="text-center">
                  <div className="text-2xl font-bold">Professional</div>
                </IonCardHeader>
                <IonCardContent className="text-center">
                  <p>
                    Ideal for therapists, educators, and organizations that need
                    to manage multiple users.
                  </p>
                  <p className="mt-4 font-bold"></p>
                  <div className="text-3xl font-bold my-4">Contact Us</div>
                  <p className="mt-2">
                    Custom solutions tailored to your needs.
                  </p>
                  <IonButton
                    className="mt-4"
                    expand="full"
                    color="dark"
                    onClick={() => history.push("/contact")}
                  >
                    Get in Touch
                  </IonButton>
                </IonCardContent>
              </IonCard>
            </div>
          </div>
        </IonContent>
      </IonPage>
    </>
  );
};

export default PricingPage;
