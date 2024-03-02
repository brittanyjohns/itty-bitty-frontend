import {
  IonItem,
  IonLabel,
  IonNote
  } from '@ionic/react';
import { MenuLink } from '../data/menu';
import './MenuListItem.css';

interface MenuListItemProps {
  menuLink: MenuLink;
}

const MenuListItem: React.FC<MenuListItemProps> = ({ menuLink }) => {
  return (
    <IonItem routerLink={`${menuLink.endpoint}`} detail={false}>
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
