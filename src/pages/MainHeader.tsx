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
  isWideScreen?: boolean;
  endLink?: string;
  endIcon?: string; // Ensure this is string type
  startLink?: string;
  startIcon?: string; // Ensure this is string type
  showMenuButton?: boolean;
  largeScreen?: boolean;
}

const MainHeader: React.FC<MainHeaderProps> = (props) => {
  const [showMenuBtn, setShowMenuBtn] = useState(false);

  const { isWideScreen, smallScreen, mediumScreen, largeScreen } =
    useCurrentUser();

  const handleResize = () => {
    const width = window.innerWidth;

    // if (width < 1100) {
    //   setShowMenuBtn(true);
    // } else {
    //   setShowMenuBtn(false);
    // }
    setShowMenuBtn(true);
    // setShowMenuBtn(isWideScreen);
  };
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <IonHeader className="bg-inherit shadow-none">
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
          <IonMenuButton
            className="text-white"
            slot="start"
            menu="main-menu"
          ></IonMenuButton>
        )}
        <IonTitle className="ml-6">{props.pageTitle}</IonTitle>
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
