import React, { useState, useEffect, useRef } from "react";
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
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
  IonToolbar,
} from "@ionic/react";
import { useHistory, useParams } from "react-router";
import {
  getImage,
  Image,
  generateImage,
  deleteImage,
  removeDoc,
  setNextWords,
  create_symbol,
  getPredictiveImages,
} from "../../data/images"; // Adjust imports based on actual functions
import { markAsCurrent } from "../../data/docs"; // Adjust imports based on actual functions
import BoardDropdown from "../../components/BoardDropdown";
import FileUploadForm from "../../components/FileUploadForm";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import {
  cloudUploadOutline,
  gridOutline,
  refreshCircleOutline,
  remove,
  trashBinOutline,
} from "ionicons/icons";
import { set } from "react-hook-form";
import MainMenu from "../../components/MainMenu";
import MainHeader from "../MainHeader";
import PredictiveImagesScreen from "../PredictiveIndex";

const ViewImageScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [image, setImage] = useState<Image | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>("");
  const imageGrid = useRef<HTMLDivElement>(null);
  const [showLoading, setShowLoading] = useState(false);
  const [segmentType, setSegmentType] = useState("gallery");
  const uploadForm = useRef<HTMLDivElement>(null);
  const generateForm = useRef<HTMLDivElement>(null);
  const imageGridWrapper = useRef<HTMLDivElement>(null);
  const deleteImageWrapper = useRef<HTMLDivElement>(null);
  const [pageTitle, setPageTitle] = useState("");
  const { currentUser, isWideScreen } = useCurrentUser();
  const [boardId, setBoardId] = useState<string | null>(null);
  const [nextImageWords, setNextImageWords] = useState<string[]>([]);

  const checkCurrentUserTokens = (numberOfTokens: number = 1) => {
    if (
      currentUser &&
      currentUser.tokens &&
      currentUser.tokens >= numberOfTokens
    ) {
      return true;
    }
    return false;
  };
  const [showHardDelete, setShowHardDelete] = useState(false);

  const fetchImage = async () => {
    const img = await getImage(id);
    setImage(img);
    setNextImageWords(img.next_words);
    return img;
  };

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const boardId = urlParams.get("boardId");
    setShowHardDelete(currentUser?.role === "admin");
    setBoardId(boardId);
    getData();
  }, []);

  const getData = async () => {
    const imgToSet = await fetchImage();
    setImage(imgToSet);
    toggleForms(segmentType, imgToSet);
    if (imgToSet.display_doc && imgToSet.display_doc.src) {
      setCurrentImage(imgToSet.display_doc.src);
    } else {
      setCurrentImage(imgToSet.src);
    }
  };

  const handleDeleteImage = async () => {
    if (!image) return;
    const result = await deleteImage(image.id);
    if (result["status"] === "success") {
      alert("Image deleted successfully.");
      window.location.href = "/images";
    } else {
      alert("Error deleting image..\n" + result["message"]);
    }
  };

  const handleRemoveCurrentDoc = async () => {
    if (!image) return;
    const result = await removeDoc(image.id, image.display_doc?.id);
    if (result["status"] === "success") {
      alert("Display image removed successfully.");
      window.location.reload();
    } else {
      alert("Error removing display image.\n" + result["message"]);
    }
  };

  const toggleForms = (segmentType: string, imgToSet?: Image) => {
    if (!imgToSet) {
      imgToSet = image ?? undefined;
    }
    const label = imgToSet?.label ?? "";
    if (segmentType === "generate") {
      setPageTitle(`Generate an Image`);
      uploadForm.current?.classList.add("hidden");
      generateForm.current?.classList.remove("hidden");
      imageGridWrapper.current?.classList.add("hidden");
      deleteImageWrapper.current?.classList.add("hidden");
    }
    if (segmentType === "upload") {
      setPageTitle(`Upload an Image`);
      uploadForm.current?.classList.remove("hidden");
      generateForm.current?.classList.add("hidden");
      imageGridWrapper.current?.classList.add("hidden");
      deleteImageWrapper.current?.classList.add("hidden");
    }
    if (segmentType === "gallery") {
      setPageTitle(`Current Images`);
      uploadForm.current?.classList.add("hidden");
      generateForm.current?.classList.add("hidden");
      imageGridWrapper.current?.classList.remove("hidden");
      deleteImageWrapper.current?.classList.add("hidden");
    }
    if (segmentType === "delete") {
      setPageTitle(`Delete Image for ${label}`);
      uploadForm.current?.classList.add("hidden");
      generateForm.current?.classList.add("hidden");
      imageGridWrapper.current?.classList.add("hidden");
      deleteImageWrapper.current?.classList.remove("hidden");
    }
  };

  const handleDocClick = async (e: React.MouseEvent<HTMLIonImgElement>) => {
    const target = e.target as HTMLImageElement;
    await markAsCurrent(target.id); // Ensure markAsCurrent returns a Promise
    const imgToSet = await fetchImage();
    setImage(imgToSet);
    setCurrentImage(imgToSet?.display_doc?.src ?? imgToSet.src);
  };

  const handleGenerate = async () => {
    if (!image) return;
    const hasTokens = checkCurrentUserTokens(1);
    if (!hasTokens) {
      alert(
        "Sorry, you do not have enough tokens to generate an image. Please purchase more tokens to continue."
      );
      console.error("User does not have enough tokens");
      return;
    }
    const formData = new FormData();
    formData.append("id", image.id);
    formData.append("image[image_prompt]", image.image_prompt ?? "");
    setShowLoading(true);
    const updatedImage = await generateImage(formData); // Ensure generateImage returns a Promise<Image>
    // setImage(updatedImage);
    // fetchImage(); // Re-fetch image data to update state
    // setShowLoading(false);
    console.log("Updated Image: ", updatedImage);
    if (updatedImage) {
      setTimeout(() => {
        setShowLoading(false);
        window.location.reload();
      }, 10000);
    }
  };

  const onGenerateClick = () => {
    handleGenerate();
  };

  const handleSegmentChange = (e: CustomEvent) => {
    const newSegment = e.detail.value;
    setSegmentType(newSegment);
    toggleForms(newSegment);
  };

  const handleNextWords = async () => {
    if (!image) return;
    const result = await setNextWords(image.id);
    if (result["next_words"]) {
      history.push(`/predictive/${image.id}`);
      // alert("Next words set successfully.");
      // const predictiveImgs = await getPredictiveImages(image.id);
      // setPredictiveImages(predictiveImgs);
      // window.location.reload();
    } else {
      alert("Error setting next words.\n" + result["message"]);
    }
  };

  const createSymbol = async () => {
    if (!image) return;
    const result = await create_symbol(image.id);
    console.log("Symbol result: ", result);
  };

  return (
    <>
      <MainMenu />
      <IonPage id="main-content">
        {!isWideScreen && <MainHeader />}
        <IonHeader translucent>
          <IonToolbar>
            <IonButtons slot="start">
              {boardId && <IonBackButton defaultHref={`/boards/${boardId}`} />}
              {!boardId && (
                <IonBackButton defaultHref="/images" /> // Adjust route based on actual route}
              )}
            </IonButtons>
            {image && <BoardDropdown imageId={image.id} />}
          </IonToolbar>
          <IonToolbar>
            <IonTitle>{image?.label}</IonTitle>
          </IonToolbar>
          <IonToolbar>
            <IonSegment value={segmentType} onIonChange={handleSegmentChange}>
              <IonSegmentButton value="gallery">
                <IonLabel className="text-xl">
                  <IonIcon icon={gridOutline} />
                </IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="upload">
                <IonLabel className="text-xl">
                  <IonIcon icon={cloudUploadOutline} />
                </IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="generate">
                <IonLabel className="text-xl">
                  <IonIcon icon={refreshCircleOutline} />
                </IonLabel>
              </IonSegmentButton>
              {image && image.display_doc?.id && showHardDelete && (
                <IonSegmentButton value="delete">
                  <IonLabel className="text-xl">
                    <IonIcon icon={trashBinOutline} />
                  </IonLabel>
                </IonSegmentButton>
              )}
            </IonSegment>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding" scrollY={true}>
          <div className="ion-justify-content-center ion-align-items-center ion-text-center pt-1">
            <IonText className="font-bold text-2xl">{pageTitle}</IonText>
            <div className="mt-4">
              {currentImage && image && (
                <IonImg
                  id={image.id}
                  src={currentImage}
                  alt={image.label}
                  className={`w-1/4 mx-auto ${
                    image.bg_color || "bg-white"
                  } p-1 rounded-lg shadow-md`}
                />
              )}
            </div>
          </div>
          <div className="mt-6 py-3 px-1 hidden text-center" ref={uploadForm}>
            <IonText className="text-lg">Upload your own image</IonText>
            {image && (
              <FileUploadForm
                board={undefined}
                onCloseModal={undefined}
                showLabel={false}
                existingLabel={image.label}
              />
            )}
          </div>
          <div className="mt-6 hidden" ref={generateForm}>
            <IonList className="ion-padding" lines="none">
              <IonItem className="mt-2 border-2">
                <IonLoading
                  className="loading-icon"
                  cssClass="loading-icon"
                  isOpen={showLoading}
                  message={
                    "Generating image... Please wait a moment & check back."
                  }
                />
                {image && (
                  <IonTextarea
                    className=""
                    placeholder="Enter prompt"
                    onIonInput={(e) =>
                      setImage({ ...image, image_prompt: e.detail.value! })
                    }
                  ></IonTextarea>
                )}
              </IonItem>
              <IonItem className="mt-2">
                <IonButton className="w-full text-lg" onClick={onGenerateClick}>
                  Generate Image
                </IonButton>
              </IonItem>
              <IonItem className="mt-2 font-mono text-center">
                <IonText className="text-sm">
                  This will generate an image based on the prompt you enter.
                </IonText>
              </IonItem>
              <IonItem className="mt-2 font-mono text-center text-red-400">
                <IonText className="ml-6"> It will cost 1 credit.</IonText>
              </IonItem>
            </IonList>
          </div>

          <div className="mt-6 hidden text-center" ref={imageGridWrapper}>
            {image && image.docs && image.docs.length > 0 && (
              <div className="ion-padding">
                <IonLabel className="font-sans text-md">
                  Click an image to display it for the word: "{image.label}"
                </IonLabel>
                <div className="grid grid-cols-3 gap-4 mt-3" ref={imageGrid}>
                  {image?.docs &&
                    image.docs.map((doc, index) => (
                      <div
                        key={doc.id}
                        className={`h-20 w-20 ${
                          image.bg_color || "bg-white"
                        } p-1 rounded-lg shadow-md`}
                      >
                        <IonImg
                          id={doc.id}
                          src={doc.src}
                          alt={doc.label}
                          onClick={handleDocClick}
                          className="object-contain bg-white"
                        />
                      </div>
                    ))}
                </div>
              </div>
            )}
            {image && image.docs && image.docs.length < 1 && (
              <div className="text-center"></div>
            )}
            {currentUser?.role === "admin" && (
              <div className="mt-10">
                <IonButtons className="flex justify-between">
                  <IonButton
                    onClick={handleNextWords}
                    className="text-sm font-mono"
                    slot="start"
                  >
                    Set Next Words
                  </IonButton>
                  <IonButton
                    routerLink={`/predictive/${image?.id}`}
                    className="text-sm font-mono"
                  >
                    View Predictive
                  </IonButton>
                  <IonButton
                    onClick={createSymbol}
                    className="text-sm font-mono"
                    slot="end"
                  >
                    Create Symbol
                  </IonButton>
                </IonButtons>
                <div className="text-sm font-mono w-full">
                  {image?.next_words && image.next_words.length > 0 && (
                    <div className="mt-2">
                      <IonText className="text-md">Next Words:</IonText>
                      <div className="flex flex-wrap">
                        {image.next_words.map((word, index) => (
                          <div
                            key={index}
                            className="bg-gray-200 m-1 p-1 rounded-md text-black"
                          >
                            <IonText className="text-sm">{word}</IonText>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {image?.next_words?.length == 0 && (
                    <p className="text-md">No next words set.</p>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="hidden text-center p-4" ref={deleteImageWrapper}>
            {image && image.display_doc?.id && (
              <div className="mb-4">
                <IonText className="text-xl">
                  Do you want to delete ONLY the above image?
                </IonText>
                <IonButton
                  className="mt-2 w-full"
                  onClick={handleRemoveCurrentDoc}
                >
                  Delete Current Image
                </IonButton>
              </div>
            )}
            {showHardDelete && (
              <div className="m-4 pt-4">
                <IonText className="text-md">
                  Do you want to delete this image AND all variations of it?
                </IonText>
                <IonButton className="mt-2 w-full" onClick={handleDeleteImage}>
                  Delete Everything
                </IonButton>
              </div>
            )}
          </div>
        </IonContent>
      </IonPage>
    </>
  );
};

export default ViewImageScreen;
