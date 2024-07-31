import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonMenuButton,
  IonPage,
  IonRefresher,
  IonRefresherContent,
} from "@ionic/react";
import MainMenu from "../../components/main_menu/MainMenu";
import Tabs from "../../components/utils/Tabs";
import MenuGrid from "../../components/menus/MenuGrid";
import { useEffect, useState } from "react";
import { Menu, getMenus } from "../../data/menus";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import MainHeader from "../MainHeader";
import StaticMenu from "../../components/main_menu/StaticMenu";
const MenusScreen: React.FC = () => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const { isWideScreen, currentUser, currentAccount } = useCurrentUser();

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
      <MainMenu
        pageTitle="Menus"
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />
      <StaticMenu
        pageTitle="Menus"
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />

      <IonPage id="main-content">
        <MainHeader
          pageTitle="Menus"
          isWideScreen={isWideScreen}
          endLink="/menus/new"
        />
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
