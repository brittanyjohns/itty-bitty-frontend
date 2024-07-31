import { IonContent, IonPage } from "@ionic/react";
import ImageCropper from "../../components/images/ImageCropper";
import MainMenu from "../../components/main_menu/MainMenu";
import StaticMenu from "../../components/main_menu/StaticMenu";
import MainHeader from "../MainHeader";
import { useCurrentUser } from "../../hooks/useCurrentUser";

const NewImage: React.FC = () => {
  const { currentUser, isWideScreen, currentAccount } = useCurrentUser();

  return (
    <>
      <MainMenu
        pageTitle="Images"
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />
      <StaticMenu
        pageTitle="Images"
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />

      <IonPage id="main-content">
        <MainHeader
          pageTitle="Images"
          isWideScreen={isWideScreen}
          startLink="/images"
        />

        <IonContent className="ion-padding">
          <div className="w-full md:w-1/2 lg:w-1/2 mx-auto">
            <ImageCropper />
          </div>
        </IonContent>
      </IonPage>
    </>
  );
};

export default NewImage;
