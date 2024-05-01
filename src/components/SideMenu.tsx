import { useEffect, useRef, useState } from "react";
import {
  IonContent,
  IonHeader,
  IonList,
  IonMenu,
  IonTitle,
  IonToolbar,
  useIonViewWillLeave,
  useIonViewWillEnter,
  IonItem,
  IonIcon,
  IonLabel,
  IonAccordion,
  IonAccordionGroup,
} from "@ionic/react";
import { MenuLink, getMenu } from "../data/menu";
import MenuListItem from "./MainMenuListItem";
import { getImageUrl } from "../data/utils";
import {
  arrowDownCircleOutline,
  homeOutline,
  person,
  personCircleOutline,
} from "ionicons/icons";
import { useHistory } from "react-router";

interface SideMenuProps {
  filteredLinks: MenuLink[];
  currentUser?: any;
}
const SideMenu: React.FC<SideMenuProps> = ({ filteredLinks, currentUser }) => {
  const history = useHistory();
  const accordionGroup = useRef<null | HTMLIonAccordionGroupElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const toggleAccordion = () => {
    if (!accordionGroup.current) {
      return;
    }
    const nativeEl = accordionGroup.current;

    if (nativeEl.value === "second") {
      nativeEl.value = undefined;
    } else {
      nativeEl.value = "second";
    }
  };
  return (
    <>
      {" "}
      <IonToolbar>
        <IonItem
          routerLink="/"
          className="hover:cursor-pointer"
          lines="full"
          detail={false}
        >
          <img
            slot="start"
            src={getImageUrl("round_itty_bitty_logo_1", "png")}
            className="h-10 w-10"
          />
          <IonTitle>SpeakAnyWay</IonTitle>
        </IonItem>
      </IonToolbar>
      <IonList className="h-full">
        <IonItem
          slot="header"
          onClick={toggleAccordion}
          className="hover:cursor-pointer text-wrap"
          detail={true}
        >
          <IonIcon icon={arrowDownCircleOutline} className="mr-5"></IonIcon>
          <IonLabel>{currentUser?.email ?? "Guest"}</IonLabel>
        </IonItem>
        <IonAccordionGroup ref={accordionGroup}>
          <IonAccordion value="second">
            <div className="ion-padding" slot="content">
              <IonIcon
                icon={personCircleOutline}
                className=""
                onClick={() => {
                  history.push("/");
                  setIsOpen(false);
                }}
              />
              <IonLabel
                className="text-xl"
                onClick={() => {
                  history.push("/");
                  setIsOpen(false);
                }}
              ></IonLabel>
              <IonLabel
                className="ml-2 hover:cursor-pointer"
                onClick={() => {
                  history.push("/dashboard");
                  setIsOpen(false);
                }}
              >
                Dashboard
                <p className="mt-1 text-xs">
                  <span className="font-bold"> Plan type:</span>{" "}
                  {currentUser?.role ?? "free trial"}
                </p>
              </IonLabel>
            </div>
          </IonAccordion>
        </IonAccordionGroup>

        {filteredLinks.map((menuLink) => (
          <MenuListItem
            key={menuLink.id}
            menuLink={menuLink}
            icon={menuLink.icon}
          />
        ))}
      </IonList>
    </>
  );
};

export default SideMenu;
