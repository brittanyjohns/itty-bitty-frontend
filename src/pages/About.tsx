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
const About: React.FC = () => {
  const { isWideScreen } = useCurrentUser();

  const refresh = (e: CustomEvent) => {
    setTimeout(() => {
      e.detail.complete();
    }, 3000);
  };

  return (
    <>
      <MainMenu />
      <IonPage id="main-content">
        <IonHeader className="bg-inherit shadow-none">
          <IonToolbar>
            <IonButtons slot="start">
              {!isWideScreen && <IonMenuButton></IonMenuButton>}
            </IonButtons>
            <IonTitle>About Us</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="flex flex-col items-center p-6 space-y-6 bg-gray-50">
          <div
            className="hero_main1 bg-cover bg-center h-full w-full pt-10 pb-20"
            style={{
              backgroundImage: `url(${getImageUrl("feature_2", "webp")})`,
            }}
          >
            <div className="mt-5 text-center bg-white bg-opacity-90 py-8 w-full">
              <h1 className="text-2xl font-bold text-center ">
                What is SpeakAnyWay?
              </h1>
              <p className="my-4 text-sm md:text-xl ">
                SpeakAnyWay is a communication tool that helps you create visual
                boards to communicate with people who have difficulty speaking.
              </p>
            </div>
            <div className="mt-5 px-8 text-center bg-white bg-opacity-80 py-8 w-full md:w-4/5 mx-auto rounded-lg">
              <h1 className="text-2xl font-bold text-center ">Our Story</h1>

              <div className="mt-5 px-8 text-center bg-white py-8 w-full md:w-4/5 mx-auto rounded-lg">
                <div className="my-4 text-sm md:text-xl ">
                  <p className="mt-4">
                    SpeakAnyWay began with a mother's love and determination. As
                    a mom of a child with autism, I knew the heartache of not
                    understanding my child’s daily needs and thoughts.
                    Traditional AAC (Augmentative and Alternative Communication)
                    tools were either too expensive or overly complicated,
                    creating barriers rather than breaking them.
                  </p>
                  <p className="mt-4">
                    Being a software engineer, I decided to put my skills to
                    good use. I wanted to create something simpler, more
                    affordable, and just as effective, not just for my kiddo but
                    for anyone facing similar challenges. This led to the
                    creation of SpeakAnyWay—a tool crafted from a blend of
                    personal passion and professional expertise.
                  </p>
                  <p className="mt-4">
                    Our mission at SpeakAnyWay is to make communication
                    accessible to everyone. We provide most of our features for
                    free, with premium options available for those who need
                    advanced capabilities. We’re dedicated to supporting
                    families, educators, and anyone who can benefit from
                    improved communication tools.
                  </p>
                  <p className="mt-4">
                    From my family to yours, I’m proud to share SpeakAnyWay with
                    you. Together, we can break down communication barriers and
                    create a world where everyone has a voice.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </IonContent>
      </IonPage>
      <Tabs />
    </>
  );
};

export default About;
