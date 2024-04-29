import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonMenuButton,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from "@ionic/react";
import MenuList from "../../components/MenuList";
import MainMenu, { hideMenu } from "../../components/MainMenu";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import Tabs from "../../components/Tabs";
import { addCircleOutline } from "ionicons/icons";
const MenusScreen: React.FC = () => {
  const { currentUser, setCurrentUser } = useCurrentUser();

  const refresh = (e: CustomEvent) => {
    setTimeout(() => {
      e.detail.complete();
    }, 3000);
  };

  useIonViewWillEnter(() => {
    hideMenu();
  });

  return (
    <>
      <MainMenu />
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle>Menus</IonTitle>
            <IonButtons slot="end">
              <IonButton routerLink="/menus/new">
                <IonIcon icon={addCircleOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonRefresher slot="fixed" onIonRefresh={refresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          <IonItem>
            <MenuList />
          </IonItem>
        </IonContent>
        <Tabs />
      </IonPage>
    </>
  );
};

export default MenusScreen;
