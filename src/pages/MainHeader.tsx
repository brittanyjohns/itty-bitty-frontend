import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonTitle,
} from "@ionic/react";
import { getImageUrl } from "../data/utils";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useHistory } from "react-router";
import { menuController } from "@ionic/core/components";
export const toggleMainMenu = async () => {
  await menuController.toggle("main-menu");
};

export const closeMainMenu = async () => {
  await menuController.close("main-menu");
};
interface MainHeaderProps {
  pageTitle?: string;
}
const MainHeader: React.FC<MainHeaderProps> = ({
  pageTitle = "SpeakAnyWay",
}) => {
  const { isWideScreen } = useCurrentUser();
  const history = useHistory();

  console.log("isWideScreen main header", isWideScreen);

  return (
    <IonHeader className="bg-inherit shadow-none">
      <IonToolbar>
        <IonButtons slot="start">
          <IonMenuButton menu="main-menu"></IonMenuButton>
        </IonButtons>

        <IonTitle className="text-center" onClick={() => history.push("/")}>
          <img
            src={getImageUrl("round_itty_bitty_logo_1", "png")}
            className={`h-10 w-10 inline ${
              pageTitle === "SpeakAnyWay" ? "mr-2" : "hidden"
            }`}
          />
          {pageTitle}
        </IonTitle>
      </IonToolbar>
    </IonHeader>
  );
};

export default MainHeader;
