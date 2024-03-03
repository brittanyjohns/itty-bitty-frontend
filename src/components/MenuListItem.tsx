import {
  IonItem,
  IonLabel,
  IonNote,
  useIonViewWillEnter
  } from '@ionic/react';
import { MenuLink } from '../data/menu';
import './MenuListItem.css';

interface MenuListItemProps {
  menuLink: MenuLink;
}

const MenuListItem: React.FC<MenuListItemProps> = ({ menuLink }) => {

  useIonViewWillEnter(() => {
    console.log('MenuListItem ionViewWillEnter event fired');
  } );
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
