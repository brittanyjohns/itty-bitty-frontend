import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonTitle,
  IonButton,
  IonIcon,
} from "@ionic/react";
import { menuController } from "@ionic/core/components";
import { addCircleOutline, arrowBackCircleOutline } from "ionicons/icons";
import { useEffect, useState } from "react";
import { useCurrentUser } from "../contexts/UserContext";

export const toggleMainMenu = async () => {
  await menuController.toggle("main-menu");
};

export const closeMainMenu = async () => {
  await menuController.close("main-menu");
};

export const openMainMenu = async () => {
  await menuController.open("main-menu");
};

interface MainHeaderProps {
  pageTitle?: string;
  endLink?: string;
  endIcon?: string; // Ensure this is string type
  startLink?: string;
  startIcon?: string; // Ensure this is string type
  showMenuButton?: boolean;
  largeScreen?: boolean;
  isWideScreen?: boolean;
}

const MainHeader: React.FC<MainHeaderProps> = (props) => {
  const [showMenuBtn, setShowMenuBtn] = useState(false);

  const { isWideScreen, smallScreen, mediumScreen, largeScreen } =
    useCurrentUser();

  useEffect(() => {
    console.log("isWideScreen", isWideScreen);
    console.log("smallScreen", smallScreen);
    console.log("mediumScreen", mediumScreen);
    console.log("largeScreen", largeScreen);

    setShowMenuBtn(!isWideScreen);
  }, []);

  const handleResize = () => {};
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <IonHeader className="bg-inherit shadow-none border-none">
      <IonToolbar>
        {props.startLink && (
          <IonButtons slot="start">
            <IonButton routerLink={props.startLink}>
              <IonIcon
                slot="icon-only"
                icon={props.startIcon || arrowBackCircleOutline}
              />
            </IonButton>
          </IonButtons>
        )}
        {showMenuBtn && (
          <IonMenuButton slot="start" menu="main-menu"></IonMenuButton>
        )}
        <IonTitle className="">{props.pageTitle}</IonTitle>
        {props.endLink && (
          <IonButtons className="p-0" slot="end">
            <IonButton routerLink={props.endLink}>
              <IonIcon
                icon={props.endIcon || addCircleOutline}
                slot="icon-only"
              />
            </IonButton>
          </IonButtons>
        )}
      </IonToolbar>
    </IonHeader>
  );
};

export default MainHeader;
