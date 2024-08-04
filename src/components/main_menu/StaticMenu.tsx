import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonItem,
  IonIcon,
  IonLabel,
  IonList,
} from "@ionic/react";
import { personCircleOutline } from "ionicons/icons";
import { MenuLink } from "../../data/menu";
import MenuListItem from "./MainMenuListItem";
import { getFilterList, getImageUrl } from "../../data/utils";
import { useHistory } from "react-router";
import { useEffect, useState, useCallback } from "react";
import { User } from "../../data/users";
import { ChildAccount } from "../../data/child_accounts";

interface StaticMenuProps {
  pageTitle?: string;
  isWideScreen?: boolean;
  currentUser?: User | null;
  currentAccount?: ChildAccount | null;
}

const StaticMenu: React.FC<StaticMenuProps> = (props) => {
  const [filteredLinks, setFilteredLinks] = useState<MenuLink[]>([]);
  const { currentUser, currentAccount } = props;

  const filterList = useCallback(() => {
    return getFilterList(currentUser, currentAccount);
  }, [currentUser, currentAccount]);

  useEffect(() => {
    const filtered = filterList();
    setFilteredLinks(filtered);
  }, [filterList]);

  const feature1Image = getImageUrl("round_itty_bitty_logo_1", "png");

  return (
    <IonContent className="w-96">
      <IonToolbar>
        <img slot="start" src={feature1Image} className="ml-4 h-10 w-10" />
        <div
          className="font-bold ml-2 hover:cursor-pointer"
          onClick={() => {
            window.location.href = "/";
          }}
        >
          SpeakAnyWay
        </div>
      </IonToolbar>
      <IonList>
        {currentUser && (
          <>
            <IonItem
              slot="header"
              routerLink="/dashboard"
              detail={true}
              className=""
              lines="none"
            >
              <IonIcon icon={personCircleOutline} className="mr-3"></IonIcon>
              <IonLabel className="text-xs">{currentUser?.email}</IonLabel>
            </IonItem>
          </>
        )}
        {filteredLinks.map((link) => (
          <IonItem key={link.id}>
            <MenuListItem menuLink={link} />
          </IonItem>
        ))}
      </IonList>
    </IonContent>
  );
};

export default StaticMenu;
