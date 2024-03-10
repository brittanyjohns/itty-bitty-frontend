// Tabs.tsx
import React from 'react';
import { IonTabBar, IonTabButton, IonIcon, IonLabel, IonTab } from '@ionic/react';
import { home, settings } from 'ionicons/icons';

const Tabs: React.FC = () => (
  <IonTabBar slot="bottom" className=''>
    <IonTabButton tab="home" href="/home" className=''>
      <IonIcon icon={home} />
      <IonLabel>Home</IonLabel>
    </IonTabButton>
    <IonTabButton tab="settings" href="/settings">
      <IonIcon icon={settings} className=''/>
      <IonLabel>Settings</IonLabel>
    </IonTabButton>
    <IonTabButton tab="boards" href="/boards">
      <IonIcon icon={home} />
      <IonLabel>Boards</IonLabel>
    </IonTabButton>
    <IonTabButton tab="images" href="/images">
      <IonIcon icon={home} />
      <IonLabel>Images</IonLabel>
    </IonTabButton>
  </IonTabBar>
);

export default Tabs;
