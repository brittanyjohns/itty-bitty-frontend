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
import MenuGrid from "../../components/menus/MenuGrid";
import { useEffect, useState } from "react";
import { Menu, getMenus } from "../../data/menus";
const MenusScreen: React.FC = () => {
  const [menus, setMenus] = useState<Menu[]>([]);

  const refresh = (e: CustomEvent) => {
    setTimeout(() => {
      e.detail.complete();
    }, 3000);
  };

  const fetchMenus = async () => {
    const allMenus = await getMenus();
    if (!allMenus) {
      console.error("Error fetching menus");
      return;
    }
    console.log("allMenus", allMenus);
    const menus = allMenus;
    setMenus(menus);
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  return (
    <>
      <MainMenu />
      <IonPage id="main-content">
        <IonHeader className="bg-inherit shadow-none">
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
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
          <MenuGrid menus={menus} />
        </IonContent>
        <Tabs />
      </IonPage>
    </>
  );
};

export default MenusScreen;
