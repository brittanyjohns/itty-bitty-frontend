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
              {!isWideScreen && <IonMenuButton />}
            </IonButtons>
            {/* <img
              slot="start"
              // src="/src/assets/images/round_itty_bitty_logo_1.png"
              src={getImageUrl("round_itty_bitty_logo_1", "png")}
              className="h-10 w-10"
            /> */}
            <IonTitle className="text-left" onClick={() => history.push("/")}>
              SpeakAnyWay MAIN
            </IonTitle>
          </>
        )}
      </IonToolbar>
    </IonHeader>
  );
};

export default MainHeader;
