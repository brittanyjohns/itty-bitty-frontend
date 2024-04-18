import { createRef, useEffect, useState } from "react";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonMenuButton,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonText,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from "@ionic/react";
import {
  Image,
  createImage,
  getImages,
  getMoreImages,
  getUserImages,
} from "../data/images";
import MainMenu from "../components/MainMenu";
import SelectImageGallery from "../components/SelectImageGallery";
import { useHistory } from "react-router";
import Tabs from "../components/Tabs";
import {
  addCircleOutline,
  albumsOutline,
  imagesOutline,
  personOutline,
  trashBinOutline,
} from "ionicons/icons";
import { set } from "react-hook-form";

const ImagesScreen: React.FC = () => {
  const [images, setImages] = useState<Image[]>([]);
  const history = useHistory();
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [userImages, setUserImages] = useState<Image[]>([]);
  const [allImages, setAllImages] = useState<Image[]>([]);
  const [segmentType, setSegmentType] = useState("all");
  const [pageTitle, setPageTitle] = useState("Image Gallery");
  const [showLoading, setShowLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Loading images");
  const inputRef = createRef<HTMLIonInputElement>();
  const [showCreateBtn, setShowCreateBtn] = useState(false);
  const fetchImages = async () => {
    const fetchedImages = await getImages();
    setImages(fetchedImages);
    setAllImages(fetchedImages);
    const fetchedUserImages = await getUserImages();
    setUserImages(fetchedUserImages);
    console.log("Fetched images", fetchedImages);
    console.log("Fetched user images", fetchedUserImages);
    console.log("fetch images page:", page);
    setShowLoading(false);
  };
  useIonViewWillEnter(() => {
    console.log("fetching images");
    fetchImages();
  }, []);

  // const showCreateBtn = (imgs: Image[]): boolean => {
  //   const result = imgs.length === 0 && searchInput.length > 0;
  //   return result;
  // };

  const handleGetMoreImages = async (
    page: number,
    query: string
  ): Promise<Image[]> => {
    setLoadingMessage("Loading more images");
    setShowLoading(true);
    const additionalImages = await getMoreImages(page, query);
    setImages(additionalImages);
    setShowCreateBtn(additionalImages.length === 0 && query.length > 0);
    setShowLoading(false);
    return additionalImages;
  };

  const handleSearchInput = async (event: CustomEvent) => {
    const query = event.detail.value.toLowerCase();
    setSearchInput(query);
    setPage(1); // Reset to first page on new search
  };

  const clearInput = () => {
    setSearchInput("");
    setPage(1); // Reset to first page on new search
  };

  const handleImageClick = (image: Image) => {
    history.push(`/images/${image.id}`);
  };

  const handleSegmentChange = (e: CustomEvent): void => {
    setSegmentType(e.detail.value);
  };

  const handleCreateImage = async (label: string) => {
    console.log("Creating image for label", label);
    setLoadingMessage("Creating image");
    setShowLoading(true);
    const formData = new FormData();
    formData.append("image[label]", label);
    const newImage = await createImage(formData);
    setShowLoading(false);
    if (newImage) {
      history.push(`/images/${newImage.id}`);
    }
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
              onIonClear={() => clearInput()}
              animated={true}
              placeholder="Search existing images"
            ></IonSearchbar>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          {/* <IonRefresher slot="fixed" onIonRefresh={refresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher> */}
          {showCreateBtn && (
            <IonList>
              <IonItem slot="start" className="w-full">
                <IonText>
                  {" "}
                  Create a new image for:
                  <strong> {searchInput}</strong>.
                </IonText>
                <IonButton
                  slot="end"
                  size="small"
                  onClick={() => handleCreateImage(searchInput)}
                >
                  <IonIcon slot="icon-only" icon={addCircleOutline} />
                </IonButton>
              </IonItem>
            </IonList>
          )}
          <SelectImageGallery
            images={images}
            onLoadMoreImages={handleGetMoreImages}
            onImageClick={handleImageClick}
            searchInput={searchInput}
          />

          <IonLoading
            className="loading-icon"
            cssClass="loading-icon"
            isOpen={showLoading}
            message={loadingMessage}
          />
        </IonContent>
        <Tabs />
      </IonPage>
    </>
  );
};

export default ImagesScreen;
