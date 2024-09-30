import { IonContent, IonPage } from "@ionic/react";
import SideMenu from "../components/main_menu/SideMenu";
import { useCurrentUser } from "../hooks/useCurrentUser";
import MainHeader from "./MainHeader";
import StaticMenu from "../components/main_menu/StaticMenu";
import Footer from "../components/utils/Footer";
const About: React.FC = () => {
  const { isWideScreen, currentAccount, currentUser } = useCurrentUser();

  return (
    <>
      <SideMenu
        pageTitle="About"
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />
      <StaticMenu
        pageTitle="About"
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />

      <IonPage id="main-content">
        <MainHeader
          pageTitle="About"
          isWideScreen={isWideScreen}
          showMenuButton={!isWideScreen}
        />

        <IonContent className="flex flex-col items-center p-6">
          <div className="relative lower-fixed-bg">
            <div className="text-center bg-gray-900 text-white bg-opacity-90 py-8 w-full">
              <h1 className="text-4xl font-bold text-center ">
                What is SpeakAnyWay?
              </h1>
              <p className="my-4 text-sm md:text-xl ">
                SpeakAnyWay is a communication tool that helps you create visual
                boards to communicate with people who have difficulty speaking.
              </p>
            </div>
            <div className="mt-5 px-4 bg-white text-black bg-opacity-95 py-8 w-full md:w-4/5 mx-auto rounded-lg">
              <h1 className="text-4xl font-bold text-center ">Our Story</h1>

              <div className="mt-5 px-4 py-8 w-full md:w-4/5 mx-auto rounded-lg">
                <div className="my-4 text-sm md:text-xl">
                  <p className="mt-4">
                    Hi! I'm the mom behind SpeakAnyWay. My adventure into
                    creating an AAC app began out of necessity and love when I
                    realized how hard it was for my son, who is on the autism
                    spectrum, to just tell us what he needed or felt. The
                    available tools? Way too expensive and complex for something
                    that should be simple and accessible.
                  </p>
                  <p className="mt-4">
                    With a background in software engineering, I rolled up my
                    sleeves and decided to craft an app that families like mine
                    could easily use without breaking the bank. I wanted to
                    build a tool that felt more like a friend than a piece of
                    technology.
                  </p>
                  <p className="mt-4">
                    That's how SpeakAnyWay was born—out of a mom's desire to
                    help her child speak his way. Our app is straightforward and
                    user-friendly, and we keep it mostly free because no one
                    should have to pay a premium to communicate.
                  </p>
                  <p className="mt-4">
                    I'm so excited to bring SpeakAnyWay into your homes, helping
                    to give a voice to those who find words just out of reach.
                    Together, let's make sure everyone can express themselves
                    and connect with the world around them.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </IonContent>
      </IonPage>
    </>
  );
};

export default About;
