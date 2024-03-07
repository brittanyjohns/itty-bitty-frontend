import { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonList, IonMenu, IonTitle, IonToolbar, useIonViewWillLeave, useIonViewWillEnter } from '@ionic/react';
import { MenuLink, getMenu } from '../data/menu';
import MenuListItem from './MainMenuListItem';
import { useCurrentUser } from '../hooks/useCurrentUser';

export const hideMenu = () => {
  const menu = document.querySelector('ion-menu');
  if (menu) {
    menu.close();
  }
}

function MainMenu() {
  const { currentUser } = useCurrentUser();
  const [menuLinks, setMenuLinks] = useState<MenuLink[]>([]);
  const [filteredLinks, setFilteredLinks] = useState<MenuLink[]>([]);

  // Function to filter links based on the current user's status
  const filterList = (links: MenuLink[]) => {
    const signedInLinks = ['sign-out', 'dashboard', 'boards', 'images', 'new-image', 'new-board', 'dashboard', 'menus', 'new-menu'];
    const signedOutLinks = ['sign-in', 'sign-up'];

    return links.filter(link => {
      if (currentUser) {
        return signedInLinks.includes(link.slug ?? '');
      } else {
        return signedOutLinks.includes(link.slug ?? '');
      }
    });
  }

  useIonViewWillEnter(() => {
    const links = getMenu();
    setMenuLinks(links);
  }, []);

  useEffect(() => {
    // Now we filter the list whenever menuLinks or currentUser changes
    const filteredList = filterList(menuLinks);
    setFilteredLinks(filteredList);
  }, [menuLinks, currentUser]); // Depend on menuLinks and currentUser

  useIonViewWillLeave(() => {
    console.log('Main Menu - ionViewWillLeave event fired');
    hideMenu();
  });

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
            {filteredLinks.map(menuLink => (
              <MenuListItem key={menuLink.id} menuLink={menuLink} closeMenu={hideMenu} />
            ))}
          </IonList>
        </IonContent>
      </IonMenu>
    </>
  );
}

export default MainMenu;
