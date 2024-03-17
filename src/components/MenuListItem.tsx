import {
  IonItem,
  IonLabel,
  IonNote,
} from '@ionic/react';
import { Menu } from '../data/menus';
import './MenuListItem.css';

interface MenuListItemProps {
  menu: Menu;
}



const MenuListItem: React.FC<MenuListItemProps> = ({ menu }) => {
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
