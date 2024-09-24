import { createRef, useEffect, useRef, useState } from "react";
import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonPage,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonText,
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
import SideMenu from "../../components/main_menu/SideMenu";
import SelectImageGallery from "../../components/images/SelectImageGallery";
import { useHistory } from "react-router";
import Tabs from "../../components/utils/Tabs";
import { addCircleOutline, imagesOutline, personOutline } from "ionicons/icons";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import MainHeader from "../MainHeader";
import StaticMenu from "../../components/main_menu/StaticMenu";

const ImagesScreen: React.FC = () => {
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
  const [showCreateBtn, setShowCreateBtn] = useState(false);
  const { currentUser, currentAccount, isWideScreen } = useCurrentUser();
  const fetchImages = async () => {
    setShowLoading(true);
    await fetchAllImages();
    await fetchUserImages();
    setShowLoading(false);
  };

  const fetchUserImages = async () => {
    const fetchedUserImages = await getUserImages();
    setUserImages(fetchedUserImages);
  };

  const fetchAllImages = async () => {
    const fetchedImages = await getImages();
    setImages(fetchedImages);
    setAllImages(fetchedImages);
  };

  useIonViewWillEnter(() => {
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
      <SideMenu
        pageTitle="Images"
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />
      <StaticMenu
        pageTitle="Images"
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />

      <IonPage id="main-content">
        <MainHeader
          pageTitle="Images"
          isWideScreen={isWideScreen}
          endLink="/images/add"
          showMenuButton={!isWideScreen}
        />
        <IonHeader className="ion-no-border">
          <IonToolbar>
            <IonSegment
              value={segmentType}
              onIonChange={handleSegmentChange}
              className="w-full bg-inherit"
            >
              <IonSegmentButton value="all">
                <IonLabel className="text-sm lg:text-md mb-2">Gallery</IonLabel>
                <IonIcon className="mt-2" icon={imagesOutline} />
              </IonSegmentButton>
              <IonSegmentButton value="user">
                <IonLabel className="text-sm lg:text-md mb-2">
                  Your Images
                </IonLabel>
                <IonIcon className="mt-2" icon={personOutline} />
              </IonSegmentButton>
            </IonSegment>
            <div className="p-2 w-7/8 md:w-5/6 mx-auto">
              <IonSearchbar
                debounce={1000}
                onIonInput={handleSearchInput}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleGetMoreImages(page, searchInput);
                  }
                }}
                onIonClear={() => clearInput()}
                animated={true}
                className="mt-4"
                value={searchInput}
                placeholder="Search existing images"
              ></IonSearchbar>
            </div>
          </IonToolbar>
        </IonHeader>

        <IonContent className="ion-padding">
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
        {currentUser && <Tabs />}
      </IonPage>
    </>
  );
};

export default ImagesScreen;
