import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonMenuButton,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from "@ionic/react";
import MenuList from "../../components/menus/MenuList";
import MainMenu, { hideMenu } from "../../components/main_menu/MainMenu";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import Tabs from "../../components/utils/Tabs";
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
      <IonPage id="main-content">
        <IonHeader className="bg-inherit shadow-none">
          <IonToolbar className="p-2">
            <IonTitle>Menus</IonTitle>
            <IonButtons className="mr-4" slot="end">
              <IonButton routerLink="/menus/new" className="text-wrap mx-auto">
                <IonLabel className="mr-2 text-md lg:text-lg">New</IonLabel>
                <IonIcon icon={addCircleOutline} className="block text-xl" />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonRefresher slot="fixed" onIonRefresh={refresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          <IonItem lines="none">
            <MenuList />
          </IonItem>
        </IonContent>
        <Tabs />
      </IonPage>
    </>
  );
};

export default MenusScreen;
