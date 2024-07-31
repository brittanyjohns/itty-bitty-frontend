import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonTitle,
  IonButton,
  IonIcon,
} from "@ionic/react";
import { getImageUrl } from "../data/utils";
import { useCurrentUser } from "../hooks/useCurrentUser";
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
}

const MainHeader: React.FC<MainHeaderProps> = (props) => {
  const isWideScreen = props.isWideScreen;
  const history = useHistory();

  console.log("isWideScreen main header", isWideScreen);

  const renderComponent = () => {
    if (!isWideScreen) {
      return (
        <IonHeader className="bg-inherit shadow-none">
          <IonToolbar>
            {props.startLink && (
              <IonButtons slot="start">
                <IonButton routerLink={props.startLink}>
                  <IonIcon icon={props.startIcon || arrowBackCircleOutline} />
                </IonButton>
              </IonButtons>
            )}
            {!props.startLink && (
              <IonButtons slot="start">
                <IonMenuButton menu="main-menu"></IonMenuButton>
              </IonButtons>
            )}

            <IonTitle className="text-center">
              <img
                src={getImageUrl("round_itty_bitty_logo_1", "png")}
                className={`h-10 w-10 inline ${
                  props.pageTitle === "SpeakAnyWay" ? "" : ""
                }`}
              />
              {props.pageTitle}
            </IonTitle>
            {props.endLink && (
              <IonButtons slot="end">
                <IonButton routerLink={props.endLink}>
                  <IonIcon icon={props.endIcon || addCircleOutline} />
                </IonButton>
              </IonButtons>
            )}
          </IonToolbar>
        </IonHeader>
      );
    } else {
      console.log("StaticMenu props", isWideScreen);
      return <></>;
    }
  };

  return <div>{renderComponent()}</div>;
};

export default MainHeader;
