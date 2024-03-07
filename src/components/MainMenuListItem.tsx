import {
  IonItem,
  IonLabel,
  IonNote,
  useIonViewWillEnter
  } from '@ionic/react';
import { MenuLink } from '../data/menu';
import './MenuListItem.css';
import { useHistory } from 'react-router';
import { h } from 'ionicons/dist/types/stencil-public-runtime';

interface MainMenuListItemProps {
  menuLink: MenuLink;
  closeMenu: () => void;
}

const MenuListItem: React.FC<MainMenuListItemProps> = ({ menuLink, closeMenu }) => {
  const history = useHistory();

  const handleClick = (endpoint: string | undefined) => () => {
    console.log('MenuListItem - handleClick', endpoint);
    closeMenu();

    history.push(endpoint ?? '');
    
  }
  return (
    <IonItem  onClick={handleClick(menuLink.endpoint)}>
      <div slot="start" className="dot dot-unread"></div>
      <IonLabel className="ion-text-wrap">
        <h2>
          {menuLink.name}
        </h2>
      </IonLabel>
    </IonItem>
  );
};

export default MenuListItem;
