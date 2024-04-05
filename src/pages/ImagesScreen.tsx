import { useEffect, useState } from "react";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonLabel,
  IonMenuButton,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { Image, getImages, getMoreImages, getUserImages } from "../data/images";
import MainMenu from "../components/MainMenu";
import SelectImageGallery from "../components/SelectImageGallery";
import { useHistory } from "react-router";
import Tabs from "../components/Tabs";
import {
  addCircleOutline,
  albumsOutline,
  imagesOutline,
  personOutline,
} from "ionicons/icons";

const ImagesScreen: React.FC = () => {
  const [images, setImages] = useState<Image[]>([]);
  const history = useHistory();
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [userImages, setUserImages] = useState<Image[]>([]);
  const [allImages, setAllImages] = useState<Image[]>([]);
  const [segmentType, setSegmentType] = useState("all");
  const [pageTitle, setPageTitle] = useState("Your Boards");

  const fetchImages = async () => {
    const fetchedImages = await getImages();
    setImages(fetchedImages);
    setAllImages(fetchedImages);
    const fetchedUserImages = await getUserImages();
    setUserImages(fetchedUserImages);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleGetMoreImages = async (
    page: number,
    query: string
  ): Promise<Image[]> => {
    const additionalImages = await getMoreImages(page, query);
    setImages(additionalImages);
    return additionalImages;
  };

  const handleSearchInput = async (event: CustomEvent) => {
    const query = event.detail.value.toLowerCase();
    setSearchInput(query);
    setPage(1); // Reset to first page on new search
  };

  const handleImageClick = (image: Image) => {
    history.push(`/images/${image.id}`);
  };

  const handleSegmentChange = (e: CustomEvent): void => {
    setSegmentType(e.detail.value);
  };

  useEffect(() => {
    if (segmentType === "user") {
      setImages(userImages);
      setPageTitle("Your Images");
    }
    if (segmentType === "all") {
      setImages(allImages);
      setPageTitle("Image Gallery");
    }
  }, [segmentType]);

  const refresh = (e: CustomEvent) => {
    setTimeout(() => {
      e.detail.complete();
    }, 3000);
  };

  return (
    <>
      <MainMenu />
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle>{pageTitle}</IonTitle>
            <IonButtons slot="end">
              <IonButton routerLink="/images/add">
                <IonIcon icon={addCircleOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
          <IonToolbar>
            <IonSegment
              value={segmentType}
              onIonChange={handleSegmentChange}
              className="w-full bg-inherit"
            >
              <IonSegmentButton value="all">
                <IonLabel className="text-xl">
                  <IonIcon icon={imagesOutline} />
                </IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="user">
                <IonLabel className="text-xl">
                  <IonIcon icon={personOutline} />
                </IonLabel>
              </IonSegmentButton>
            </IonSegment>
          </IonToolbar>
          <IonToolbar>
            <IonSearchbar
              debounce={1000}
              onIonInput={handleSearchInput}
              animated={true}
              placeholder="Search existing images"
            ></IonSearchbar>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonRefresher slot="fixed" onIonRefresh={refresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          {
            <SelectImageGallery
              images={images}
              onLoadMoreImages={handleGetMoreImages}
              onImageClick={handleImageClick}
              searchInput={searchInput}
            />
          }
        </IonContent>
        <Tabs />
      </IonPage>
    </>
  );
};

export default ImagesScreen;
