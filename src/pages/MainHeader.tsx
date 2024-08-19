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
  const [showMenuBtn, setShowMenuBtn] = useState(
    props.showMenuButton || !props.startLink
  );
  const showHeader =
    !props.isWideScreen ||
    (props.isWideScreen && showMenuBtn) ||
    (props.isWideScreen && !props.largeScreen);

  useEffect(() => {
    setShowMenuBtn(props.showMenuButton || !props.startLink);
  }, [props.isWideScreen]);

  const renderComponent = () => {
    if (showHeader) {
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
            {!props.startLink && (
              <IonMenuButton
                className="text-white"
                slot="start"
                menu="main-menu"
              ></IonMenuButton>
            )}

            <IonTitle className="text-center">{props.pageTitle}</IonTitle>
            {props.endLink && (
              <IonButtons class="p-0" slot="end">
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
    } else {
      return <></>;
    }
  };

  return <div>{renderComponent()}</div>;
};

export default MainHeader;
