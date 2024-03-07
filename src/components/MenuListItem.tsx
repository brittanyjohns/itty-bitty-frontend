import {
  IonItem,
  IonLabel,
  IonNote,
  useIonViewWillEnter
} from '@ionic/react';
import { Menu } from '../data/menus';
import './MenuListItem.css';

interface MenuListItemProps {
  menu: Menu;
}



const MenuListItem: React.FC<MenuListItemProps> = ({ menu }) => {
  useIonViewWillEnter(() => {
    console.log('ionViewWillEnter event fired menu list');
  } );
  return (
    <IonItem routerLink={`/boards/${menu.boardId}`} detail={true} className='p-4 w-full'>
      <IonLabel>
        {menu.name}
      </IonLabel>
      <IonNote slot="end">
        {menu.boardId}
      </IonNote>
    </IonItem>
  );
};

export default MenuListItem;
