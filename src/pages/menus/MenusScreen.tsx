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

const MenusScreen: React.FC = () => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const { isWideScreen, currentUser, currentAccount } = useCurrentUser();
  const [segmentType, setSegmentType] = useState("preset");
  const [presetMenus, setPresetMenus] = useState<Menu[]>([]);
  const [userMenus, setUserMenus] = useState<Menu[]>([]);

  const refresh = (e: CustomEvent) => {
    console.log("Refresh triggered");
    setTimeout(() => {
      console.log("Refresh completed");
      e.detail.complete();
    }, 3000);
  };

  const fetchMenus = async () => {
    console.log("Fetching menus"); // Log before fetching
    try {
      const allMenus = await getMenus();
      console.log("All Menus", allMenus);
      if (!allMenus || !allMenus.user || !allMenus.predefined) {
        console.error("Error fetching menus: Invalid data structure", allMenus);
        return;
      }

      setUserMenus(Array.isArray(allMenus.user) ? allMenus.user : []);
      setPresetMenus(
        Array.isArray(allMenus.predefined) ? allMenus.predefined : []
      );
      setMenus(Array.isArray(allMenus.predefined) ? allMenus.predefined : []);
    } catch (error) {
      console.error("Error fetching menus", error);
    }
  };

  const handleSegmentChange = (e: CustomEvent) => {
    const segmentValue = e.detail.value as string;
    console.log("Segment changed", segmentValue);
    setSegmentType(segmentValue);
    toggleMenus(segmentValue);
  };

  // useEffect(() => {
  //   console.log("Component mounted or segmentType changed");
  //   toggleMenus(segmentType);
  // }, [segmentType]);

  const toggleMenus = (segmentType: string) => {
    console.log("Toggling menus", segmentType);
    if (segmentType === "preset" && Array.isArray(presetMenus)) {
      setMenus(presetMenus);
    } else if (segmentType === "user" && Array.isArray(userMenus)) {
      setMenus(userMenus);
    } else {
      console.error("Invalid segmentType or menus are not arrays");
    }
  };

  useEffect(() => {
    console.log("Fetching menus on component mount");
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
          {menus && Array.isArray(menus) && <MenuGrid menus={menus} />}
        </IonContent>
        <Tabs />
      </IonPage>
    </>
  );
};

export default MenusScreen;
