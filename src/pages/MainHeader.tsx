import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonTitle,
  IonButton,
  IonIcon,
} from "@ionic/react";
import { useHistory } from "react-router";
import { menuController } from "@ionic/core/components";
import { addCircleOutline, arrowBackCircleOutline } from "ionicons/icons";

export const toggleMainMenu = async () => {
  await menuController.toggle("main-menu");
};

export const closeMainMenu = async () => {
  await menuController.close("main-menu");
};

interface MainHeaderProps {
  pageTitle?: string;
  isWideScreen?: boolean;
  endLink?: string;
  endIcon?: string; // Ensure this is string type
  startLink?: string;
  startIcon?: string; // Ensure this is string type
  showMenuButton?: boolean;
}

const MainHeader: React.FC<MainHeaderProps> = (props) => {
  const isWideScreen = props.isWideScreen;
  const showMenuBtn = props.showMenuButton || !props.startLink;
  const showHeader = !isWideScreen || (isWideScreen && showMenuBtn);

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
            {props.showMenuButton && (
              <IonMenuButton slot="start" menu="main-menu"></IonMenuButton>
            )}

            <IonTitle className="text-center">{props.pageTitle}</IonTitle>
            {props.endLink && (
              <IonButtons slot="end">
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
