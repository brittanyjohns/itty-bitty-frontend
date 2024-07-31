import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonItem,
  IonIcon,
  IonLabel,
} from "@ionic/react";
import { personCircleOutline } from "ionicons/icons";
import { MenuLink } from "../../data/menu";
import MenuListItem from "./MainMenuListItem";
import { getFilterList } from "../../data/utils";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { useHistory } from "react-router";
import { useEffect, useState } from "react";

interface StaticMenuProps {
  //   filteredLinks: MenuLink[];
  //   goToDashboard?: () => void;
}

const StaticMenu: React.FC<StaticMenuProps> = (
  {
    //   filteredLinks,
    //   goToDashboard,
  }
) => {
  const { currentUser, currentAccount } = useCurrentUser();
  const [filteredLinks, setFilteredLinks] = useState<MenuLink[]>([]);
  const history = useHistory();
  const filterList = getFilterList(currentUser, currentAccount);

  const setUpList = () => {
    setFilteredLinks(filterList);
  };
  const goToDashboard = () => {
    history.push("/dashboard");
    console.log("goToDashboard");
  };

  useEffect(() => {
    setUpList();
  }, []);
  return (
    <IonContent className="bg-inherit w-64">
      <IonHeader>
        <IonToolbar>
          <IonTitle>StaticMenu</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonItem
          button
          onClick={() => {
            if (goToDashboard) {
              goToDashboard();
            }
          }}
        >
          <IonIcon slot="start" icon={personCircleOutline} />
          <IonLabel>Dashboard</IonLabel>
        </IonItem>
        {filteredLinks.map((link) => (
          <MenuListItem key={link.slug} menuLink={link} />
        ))}
      </IonContent>
    </IonContent>
  );
};

export default StaticMenu;
