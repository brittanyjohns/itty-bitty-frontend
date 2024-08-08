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
  IonSegment,
  IonSegmentButton,
} from "@ionic/react";
import MainMenu from "../../components/main_menu/MainMenu";
import Tabs from "../../components/utils/Tabs";
import MenuGrid from "../../components/menus/MenuGrid";
import { useEffect, useState } from "react";
import { Menu, getMenus } from "../../data/menus";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import MainHeader from "../MainHeader";
import StaticMenu from "../../components/main_menu/StaticMenu";
import {
  fastFoodOutline,
  imagesOutline,
  personOutline,
  pizzaOutline,
} from "ionicons/icons";
import { set } from "d3";
const MenusScreen: React.FC = () => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const { isWideScreen, currentUser, currentAccount } = useCurrentUser();
  const [segmentType, setSegmentType] = useState("all");
  const [presetMenus, setPresetMenus] = useState<Menu[]>([]);
  const [userMenus, setUserMenus] = useState<Menu[]>([]);

  const refresh = (e: CustomEvent) => {
    setTimeout(() => {
      e.detail.complete();
    }, 3000);
  };

  const fetchMenus = async () => {
    const allMenus = await getMenus();
    console.log("All Menus", allMenus);
    if (!allMenus) {
      console.error("Error fetching menus");
      return;
    }
    setUserMenus(allMenus["user"]);
    setPresetMenus(allMenus["predefined"]);
    setMenus(allMenus["predefined"]);
  };

  const handleSegmentChange = (e: CustomEvent) => {
    console.log(e.detail.value);
    setSegmentType(e.detail.value as string);
  };

  useEffect(() => {
    toggleMenus(segmentType);
  }, [segmentType]);

  const toggleMenus = (segmentType: string) => {
    console.log("Toggling menus", segmentType);
    if (segmentType === "preset") {
      setMenus(presetMenus);
    }
    if (segmentType === "user") {
      setMenus(userMenus);
    }
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
          showMenuButton={!isWideScreen}
        />
        <IonContent className="ion-padding">
          <IonSegment
            value={segmentType}
            onIonChange={handleSegmentChange}
            className="w-full bg-inherit"
          >
            <IonSegmentButton value="preset">
              <IonLabel className="text-md lg:text-lg">Preset</IonLabel>
              <IonIcon icon={pizzaOutline} />
            </IonSegmentButton>
            <IonSegmentButton value="user">
              <IonLabel className="text-md lg:text-lg">Your Menus</IonLabel>
              <IonIcon icon={fastFoodOutline} />
            </IonSegmentButton>
          </IonSegment>
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
