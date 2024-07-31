import { createRef, useEffect, useState } from "react";
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonMenuButton,
  IonPage,
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
} from "../../data/images";
import MainMenu from "../../components/main_menu/MainMenu";
import SelectImageGallery from "../../components/images/SelectImageGallery";
import { useHistory } from "react-router";
import Tabs from "../../components/utils/Tabs";
import { addCircleOutline, imagesOutline, personOutline } from "ionicons/icons";
import { set } from "react-hook-form";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { closeMainMenu } from "../MainHeader";

const ImagesScreen: React.FC = () => {
  const { isWideScreen } = useCurrentUser();
  const [images, setImages] = useState<Image[]>([]);
  const history = useHistory();
  const [searchInput, setSearchInput] = useState("");
  const [onlyUserImages, setOnlyUserImages] = useState(false);
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
    setShowLoading(true);
    await fetchAllImages();
    await fetchUserImages();
    setShowLoading(false);
  };

  const fetchUserImages = async () => {
    const fetchedUserImages = await getUserImages();
    console.log("Fetched user images: ", fetchedUserImages);
    setUserImages(fetchedUserImages);
  };

  const fetchAllImages = async () => {
    const fetchedImages = await getImages();
    setImages(fetchedImages);
    setAllImages(fetchedImages);
  };

  useIonViewWillEnter(() => {
    console.log("fetching images");
    fetchImages();
  }, []);

  const handleGetMoreImages = async (
    page: number,
    query: string
  ): Promise<Image[]> => {
    setLoadingMessage("Loading more images");
    setShowLoading(true);
    const additionalImages = await getMoreImages(page, query, onlyUserImages);
    setImages(additionalImages);
    setShowCreateBtn(additionalImages.length < 5 && query.length > 0);
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
    console.log("Handle Segment type changed to: ", e.detail.value);

    if (e.detail.value === "all") {
      fetchAllImages();
      setPageTitle("Image Gallery");
    } else {
      fetchUserImages();
      setPageTitle("Your Images");
    }
  };

  const handleCreateImage = async (label: string) => {
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
    console.log("Segment type changed to: ", segmentType);
    if (segmentType === "all") {
      setOnlyUserImages(false);
      setImages(allImages);
      setPageTitle("Image Gallery");
    } else {
      setOnlyUserImages(true);
      setImages(userImages);
    }
    clearInput();
  }, [segmentType]);

  return (
    <>
      <MainMenu />
      <IonPage id="main-content">
        <IonHeader className="bg-inherit shadow-none">
          <IonToolbar>
            <IonButtons slot="start">
              {isWideScreen && <IonBackButton defaultHref="/dashboard" />}
              {!isWideScreen && <IonMenuButton slot="start" />}
            </IonButtons>
            <IonButtons slot="end">
              <IonButton routerLink="/images/add">
                <IonIcon
                  slot="icon-only"
                  ios={addCircleOutline}
                  md={addCircleOutline}
                ></IonIcon>
              </IonButton>
            </IonButtons>
            <IonTitle class="text-center">{pageTitle}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonSegment
            value={segmentType}
            onIonChange={handleSegmentChange}
            className="w-full bg-inherit"
          >
            <IonSegmentButton value="all">
              <IonLabel className="text-md lg:text-lg">Gallery</IonLabel>
              <IonIcon icon={imagesOutline} />
            </IonSegmentButton>
            <IonSegmentButton value="user">
              <IonLabel className="text-md lg:text-lg">Your Images</IonLabel>
              <IonIcon icon={personOutline} />
            </IonSegmentButton>
          </IonSegment>
          <div className="p-2 w-7/8 md:w-5/6 mx-auto">
            <IonSearchbar
              debounce={1000}
              onIonInput={handleSearchInput}
              onIonClear={() => clearInput()}
              animated={true}
              className="mt-4"
              value={searchInput}
              placeholder="Search existing images"
            ></IonSearchbar>
          </div>
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
            segmentType={segmentType}
            fetchUserBoards={fetchUserImages}
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
