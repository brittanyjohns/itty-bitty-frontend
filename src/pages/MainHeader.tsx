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

const MainHeader: React.FC = () => {
  const { isWideScreen } = useCurrentUser();
  const history = useHistory();
  return (
    <IonHeader className="bg-inherit shadow-none">
      <IonToolbar>
        {!isWideScreen && (
          <>
            <IonButtons slot="start">
              <IonMenuButton></IonMenuButton>
            </IonButtons>

            <IonTitle className="text-center" onClick={() => history.push("/")}>
              <img
                // src="/src/assets/images/round_itty_bitty_logo_1.png"
                src={getImageUrl("round_itty_bitty_logo_1", "png")}
                className="h-10 w-10 inline"
              />
              SpeakAnyWay
            </IonTitle>
          </>
        )}
      </IonToolbar>
    </IonHeader>
  );
};

export default MainHeader;
