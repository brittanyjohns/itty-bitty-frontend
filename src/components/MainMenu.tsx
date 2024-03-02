import { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonList, IonMenu, IonTitle, IonToolbar, useIonViewWillEnter, useIonViewWillLeave } from '@ionic/react';
import { MenuLink, getMenu } from '../data/menu';
import MenuListItem from './MenuListItem';
import { isUserSignedIn } from '../data/users';

export const hideMenu = () => {
  const menu = document.querySelector('ion-menu');
  if (menu) {
    menu.close();
  }
}
function MainMenu() {
  const [menuLinks, setMenuLinks] = useState<MenuLink[]>([]);

  useIonViewWillLeave(() => {
    console.log('Main Menu - ionViewWillLeave event fired');
    hideMenu();
  } );

  const filterList = () => {
    const filteredList: MenuLink[] = [];
    const signedInLinks = ['sign-out', 'dashboard', 'boards', 'images', 'new-image', 'new-board', 'new-menu'];
    const signedOutLinks = ['sign-in', 'sign-up'];
    menuLinks.forEach((link) => {
      if (isUserSignedIn()) {
        if (signedInLinks.includes(link.slug ?? '')) {
          filteredList.push(link)
        }
      } else {
        if (signedOutLinks.includes(link.slug ?? '')) {
          filteredList.push(link)
        }
      }

    })
    return filteredList
  }

  const [filteredLinks, setFilteredLinks] = useState<MenuLink[]>([]);

  useIonViewWillEnter(() => {
    const links = getMenu();
    setMenuLinks(links);
    const filteredList = filterList();
    setFilteredLinks(filteredList);
  }, []);

  useEffect(() => {
    const filteredList = filterList();
    setFilteredLinks(filteredList);
  }, [menuLinks]);

  return (
    <>
      <IonMenu contentId="main-content" type="overlay">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Main Menu</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonList>

            {filteredLinks.map(m => (

              <MenuListItem key={m.id} menuLink={m} />
            ))}
          </IonList>
        </IonContent>
      </IonMenu>
    </>
  );
}
export default MainMenu;