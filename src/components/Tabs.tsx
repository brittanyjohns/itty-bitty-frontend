// Tabs.tsx
import React from 'react';
import { IonTabBar, IonTabButton, IonIcon, IonLabel, IonTab } from '@ionic/react';
import { home, fastFoodOutline, imagesOutline, albumsOutline } from 'ionicons/icons';

const Tabs: React.FC = () => (
  <IonTabBar slot="bottom" className=''>
    <IonTabButton tab="home" href="/home" className=''>
      <IonIcon icon={home} />
      <IonLabel>Home</IonLabel>
    </IonTabButton>
    <IonTabButton tab="boards" href="/boards">
      <IonIcon icon={albumsOutline} />
      <IonLabel>Boards</IonLabel>
    </IonTabButton>
    <IonTabButton tab="images" href="/images">
      <IonIcon icon={imagesOutline} />
      <IonLabel>Images</IonLabel>
    </IonTabButton>
    <IonTabButton tab="menus" href="/menus">
      <IonIcon icon={fastFoodOutline} />
      <IonLabel>Menus</IonLabel>
    </IonTabButton>
  </IonTabBar>
);

export default Tabs;
