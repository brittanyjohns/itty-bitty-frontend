import React, { useState, useEffect, useRef } from 'react';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonText,
  IonTextarea,
  IonTitle,
  IonToolbar
} from '@ionic/react';
import { useHistory, useParams } from 'react-router';
import { getMenu, Menu } from '../data/menus'; // Adjust imports based on actual functions
import { markAsCurrent } from '../data/docs'; // Adjust imports based on actual functions
import BoardDropdown from '../components/BoardDropdown';
import FileUploadForm from '../components/FileUploadForm';
import { set } from 'react-hook-form';
import { Image } from '../data/images';
import ImageGalleryItem from '../components/ImageGalleryItem';
interface ViewMenuScreenProps {
  id: string;
}
const ViewMenuScreen: React.FC<ViewMenuScreenProps> = () => {
  const { id } = useParams<{ id: string }>();
  const [menu, setMenu] = useState<Menu | null>(null)
  const [currentMenu, setCurrentMenu] = useState<string | null>('');
  const boardTab = useRef<HTMLDivElement>(null);
  const [showLoading, setShowLoading] = useState(false);
  const [segmentType, setSegmentType] = useState('menuTab');
  const menuTab = useRef<HTMLDivElement>(null);
  const boardGrid = useRef<HTMLDivElement>(null);
  const [images, setImages] = useState<Image[]>([]);
  const history = useHistory();

  const fetchMenu = async () => {
    const menuToSet = await getMenu(Number(id));
    setMenu(menuToSet);
    setImages(menuToSet.images);
    return menuToSet;
  };

  useEffect(() => {
    async function getData() {
      const menuToSet = await fetchMenu();
      setMenu(menuToSet);
      toggleForms(segmentType);
      if (menuToSet.display_doc && menuToSet.display_doc.src) {
        setCurrentMenu(menuToSet.display_doc.src);
      } else {
        setCurrentMenu(menuToSet.src);
      }
    }
    getData();
  }, []);

  const toggleForms = (segmentType: string) => {
    if (segmentType === 'boardTab') {
      menuTab.current?.classList.add('hidden');
      boardTab.current?.classList.remove('hidden');
    }
    if (segmentType === 'menuTab') {
      menuTab.current?.classList.remove('hidden');
      boardTab.current?.classList.add('hidden');
    }
  }

  const handleDocClick = async (e: React.MouseEvent) => {
    const target = e.target as HTMLMenuElement;
    const id = target.id;
    history.push(`/images/${id}`);
  };

  const handleSegmentChange = (e: CustomEvent) => {
    const newSegment = e.detail.value;
    setSegmentType(newSegment);
    toggleForms(newSegment);
  }

  return (
    <IonPage id="view-menu-page">
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/menus" />
          </IonButtons>
          <IonTitle>{menu?.name}</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSegment value={segmentType} onIonChange={handleSegmentChange}>
            <IonSegmentButton value="menuTab">
              <IonLabel>Menu</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="boardTab">
              <IonLabel>Board</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>
      <IonContent className='ion-padding' scrollY={true}>
        <div className="hidden" ref={menuTab}>
          {menu && menu.displayImage &&
            <div className=''>
              <IonImg src={menu.displayImage} alt={menu.name} />
            </div>
          }
        </div>
        <div className="hidden" ref={boardTab}>
          <IonList>
            <IonItem>
              <IonLabel position="stacked">Name</IonLabel>
              <IonText>{menu?.name}</IonText>
            </IonItem>
            <IonItem>
              <IonButton routerLink={`/boards/${menu?.boardId}`}>View Board</IonButton>
            </IonItem>
          </IonList>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ViewMenuScreen;
