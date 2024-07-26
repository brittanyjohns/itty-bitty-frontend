import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonLabel,
  IonMenuButton,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import MainMenu, { hideMenu } from "../../components/main_menu/MainMenu";
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
            <IonButtons slot="secondary">
              <IonButton>
                <IonMenuButton></IonMenuButton>
              </IonButton>
            </IonButtons>
            <IonButtons slot="primary">
              <IonButton routerLink="/menus/new">
                <IonIcon
                  slot="icon-only"
                  ios={addCircleOutline}
                  md={addCircleOutline}
                ></IonIcon>
              </IonButton>
            </IonButtons>
            <IonTitle>Menus</IonTitle>
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
