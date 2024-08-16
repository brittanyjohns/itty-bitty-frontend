import React, { useState, useEffect, useRef } from "react";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonMenuButton,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonSegment,
  IonSegmentButton,
  IonText,
  IonTextarea,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from "@ionic/react";
import { useHistory, useParams } from "react-router";
import { AUTO_REFRESH_RATE } from "../../data/constants";
import {
  getImage,
  Image,
  generateImage,
  deleteImage,
  removeDoc,
  setNextWords,
  create_symbol,
  cloneImage,
  findByLabel,
} from "../../data/images"; // Adjust imports based on actual functions
import { markAsCurrent } from "../../data/docs"; // Adjust imports based on actual functions
import BoardDropdown from "../../components/boards/BoardDropdown";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import {
  addCircleOutline,
  cloudUploadOutline,
  gridOutline,
  refreshCircleOutline,
  trashBinOutline,
} from "ionicons/icons";
import MainMenu from "../../components/main_menu/MainMenu";
import MainHeader from "../MainHeader";
import ImageCropper from "../../components/images/ImageCropper";
import { Board, getBoards } from "../../data/boards";
import { generatePlaceholderImage } from "../../data/utils";
import StaticMenu from "../../components/main_menu/StaticMenu";
import Tabs from "../../components/utils/Tabs";
import { set } from "d3";

const ViewImageScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [image, setImage] = useState<Image | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>("");
  const imageGrid = useRef<HTMLDivElement>(null);
  const newWordInput = useRef<HTMLIonInputElement>(null);
  const [showLoading, setShowLoading] = useState(false);
  const [segmentType, setSegmentType] = useState("gallery");
  const uploadForm = useRef<HTMLDivElement>(null);
  const generateForm = useRef<HTMLDivElement>(null);
  const imageGridWrapper = useRef<HTMLDivElement>(null);
  const deleteImageWrapper = useRef<HTMLDivElement>(null);
  const [pageTitle, setPageTitle] = useState("");
  const { currentUser, isWideScreen, currentAccount, smallScreen } =
    useCurrentUser();
  const [boardId, setBoardId] = useState<string | null>(null);
  const [nextImageWords, setNextImageWords] = useState<string[]>([]);
  const [boards, setBoards] = useState<Board[]>([]);
  const [filteredBoards, setFilteredBoards] = useState<Board[]>([]);
  const [newImageWord, setNewImageWord] = useState("");
  const [wordsToRemove, setWordsToRemove] = useState<string[]>([]);
  const [creatingSymbol, setCreatingSymbol] = useState(false);

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
    setNextImageWords(img?.next_words);
    return img;
  };

  const setupData = async () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const boardId = urlParams.get("boardId");
    setShowHardDelete(
      currentUser?.role === "admin" || currentUser?.id === image?.user_id
    );
    setBoardId(boardId);
    await getData();
    if (image && image.src) {
      setCurrentImage(image.src);
    }
  };

  useEffect(() => {
    setupData();
  }, []);

  useEffect(() => {
    setupData();

    if (creatingSymbol) {
      const intervalId = setInterval(() => {
        console.log("Checking for symbol...");
        getData();
        setShowLoading(false);
        setCreatingSymbol(false);
      }, 3000); // Check every 5 seconds
      return () => clearInterval(intervalId); // Cleanup interval on component unmount
    } else {
      console.log("Symbol created successfully.");
    }
  }, [creatingSymbol]);

  const getData = async () => {
    const imgToSet = await fetchImage();
    const allBoards = await getBoards();
    setBoards(allBoards["boards"]);
    const newFilteredBoards = allBoards["boards"].filter((board: Board) => {
      return image?.user_image_boards?.find(
        (userBoard: Board) => userBoard.id !== board.id
      );
    });
    if (newFilteredBoards) {
      setFilteredBoards(newFilteredBoards);
    } else {
      console.log("No boards found!");
      setBoards(allBoards["boards"]);
    }
    setImage(imgToSet);
    toggleForms(segmentType, imgToSet);
    if (
      imgToSet?.display_doc &&
      imgToSet.display_doc &&
      imgToSet.display_doc.src
    ) {
      setCurrentImage(imgToSet.display_doc.src);
    } else if (imgToSet?.src) {
      setCurrentImage(imgToSet.src);
    } else {
      const imgURl = generatePlaceholderImage(imgToSet?.label);
      setCurrentImage(imgURl);
    }
  };

  const handleDeleteImage = async () => {
    if (!image) return;
    const result = await deleteImage(image.id);
    if (result["status"] === "ok") {
      history.push("/images");
    } else {
      alert("Error deleting image..\n" + result["message"]);
    }
  };

  const handleRemoveCurrentDoc = async () => {
    if (!image) return;
    const result = await removeDoc(image.id, image.display_doc?.id);
    if (result["status"] === "ok") {
      getData();
    } else {
      alert("Error removing display image.\n" + result["message"]);
    }
  };

  const refresh = (e: CustomEvent) => {
    setTimeout(() => {
      e.detail.complete();
      setupData();
    }, 3000);
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
      setPageTitle(`Gallery for ${label}`);
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
    const currentImg = await markAsCurrent(target.id); // Ensure markAsCurrent returns a Promise
    const imgToSet = currentImg;
    setImage(imgToSet);
    setCurrentImage(imgToSet?.display_doc?.src ?? imgToSet.src);
    setupData();
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
    if (updatedImage) {
      setTimeout(() => {
        setShowLoading(false);
        window.location.reload();
      }, 15000);
    }
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
    } else {
      alert("Error setting next words.\n" + result["message"]);
    }
  };

  const clearInput = () => {
    if (newWordInput.current) {
      newWordInput.current.value = "";
    }
    setWordsToRemove([]);
  };

  const handleCloneImage = async () => {
    if (!image) return;
    const result = await cloneImage(image.id);
    if (result) {
      history.push(`/images/${result.id}`);
    } else {
      alert("Error cloning image.");
    }
  };

  const handleAddNextWords = async () => {
    if (!image) return;
    console.log("Adding next words: ", nextImageWords);
    const newImageWords = [...nextImageWords, newImageWord];
    const result = await setNextWords(image.id, newImageWords);
    if (result["next_words"]) {
      setNewImageWord("");
      clearInput();
      getData();
    } else {
      alert("Error setting next words.\n" + result["message"]);
    }
  };

  const createSymbol = async () => {
    if (!image) return;
    setShowLoading(true);
    const result = await create_symbol(image.id);
    // setShowLoading(false);
    if (result["status"] === "ok") {
      console.log("Symbol created successfully.", result);
      setCreatingSymbol(true);
    } else {
      setShowLoading(false);
      alert("Error creating symbol.\n" + result["message"]);
    }
  };

  const handleFindByLabel = async (word: string) => {
    const result = await findByLabel(word);
    if (result) {
      history.push(`/images/${result.id}`);
    } else {
      alert("Error finding image by label.");
    }
  };

  const toggleAddToRemoveList = (e: React.MouseEvent<HTMLIonTextElement>) => {
    const target = e.target as HTMLIonTextElement;
    const word = target.innerText;
    if (wordsToRemove.includes(word)) {
      const newWords = wordsToRemove.filter((w) => w !== word);
      setWordsToRemove(newWords);
    } else {
      console.log("Removing word: ", word);
      setWordsToRemove([...wordsToRemove, word]);
    }
  };

  const handleDeleteSelected = async () => {
    if (!image) return;
    const wordsToSet = nextImageWords.filter(
      (word) => !wordsToRemove.includes(word)
    );
    const result = await setNextWords(image.id, wordsToSet);
    if (result["next_words"]) {
      getData();
    } else {
      alert("Error setting next words.\n" + result["message"]);
    }
  };

  const renderImageUserInfo = (currentUser: any) => {
    if (currentUser?.admin) {
      return (
        <div className="w-full md:w-1/2 mx-auto">
          {(currentAccount?.id === image?.user_id || currentUser?.admin) && (
            <IonText className="text-md block">
              This image was created by:{" "}
              {image?.user?.name || image?.user?.email || image?.user?.id}
            </IonText>
          )}
          <IonText className="text-md block my-3">
            This image was created on: {image?.created_at}
          </IonText>

          {currentAccount?.id === image?.user_id ? (
            ""
          ) : (
            <IonText className="text-md block my-3">
              This image is owned by: <br></br>
              {image?.user?.name || image?.user?.email || image?.user?.id}{" "}
              {image?.user.role === "admin" ? "(admin)" : ""}
            </IonText>
          )}
        </div>
      );
    }
  };

  const wordBgColor = (word: string) => {
    if (wordsToRemove.includes(word)) {
      return "bg-red-300";
    }
    return "bg-gray-200";
  };

  return (
    <>
      <MainMenu
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
          startLink="/images"
          endLink="/images/add"
        />

        <IonContent className="ion-padding">
          <IonRefresher slot="fixed" onIonRefresh={refresh}>
            <IonRefresherContent>
              <IonLoading
                className="loading-icon"
                cssClass="loading-icon"
                isOpen={showLoading}
                message={"Refreshing... Please wait."}
              />
            </IonRefresherContent>
          </IonRefresher>
          <IonHeader className="bg-inherit shadow-none">
            <IonSegment
              value={segmentType}
              onIonChange={handleSegmentChange}
              className="w-full bg-inherit mb-2"
            >
              <IonSegmentButton value="gallery">
                {!smallScreen ? (
                  <IonLabel className="text-sm md:text-md lg:text-lg mb-2">
                    Gallery
                  </IonLabel>
                ) : (
                  <IonLabel className="text-sm md:text-md lg:text-lg mb-2"></IonLabel>
                )}
                <IonIcon className="mt-2" icon={gridOutline} />
              </IonSegmentButton>
              <IonSegmentButton value="upload">
                {!smallScreen ? (
                  <IonLabel className="text-sm md:text-md lg:text-lg mb-2">
                    Upload
                  </IonLabel>
                ) : (
                  <IonLabel className="text-sm md:text-md lg:text-lg mb-2"></IonLabel>
                )}

                <IonIcon className="mt-2" icon={cloudUploadOutline} />
              </IonSegmentButton>
              <IonSegmentButton value="generate">
                {!smallScreen ? (
                  <IonLabel className="text-sm md:text-md lg:text-lg mb-2">
                    Generate
                  </IonLabel>
                ) : (
                  <IonLabel className="text-sm md:text-md lg:text-lg mb-2"></IonLabel>
                )}
                <IonIcon className="mt-2" icon={refreshCircleOutline} />
              </IonSegmentButton>
              {showHardDelete && (
                <IonSegmentButton value="delete">
                  {!smallScreen ? (
                    <IonLabel className="text-sm md:text-md lg:text-lg mb-2">
                      Delete
                    </IonLabel>
                  ) : (
                    <IonLabel className="text-sm md:text-md lg:text-lg mb-2"></IonLabel>
                  )}
                  <IonIcon className="mt-2" icon={trashBinOutline} />
                </IonSegmentButton>
              )}
            </IonSegment>
          </IonHeader>
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
            <div className="mt-4">
              {currentUser?.admin && (
                <IonButton
                  onClick={handleCloneImage}
                  className="text-md font-md"
                  fill="outline"
                >
                  Clone Image
                </IonButton>
              )}
            </div>
          </div>
          <div className="mt-6 py-3 px-1 hidden" ref={uploadForm}>
            <div className="w-full md:w-3/4 mx-auto m-2">
              {image && (
                <ImageCropper
                  existingId={image.id}
                  boardId={boardId}
                  existingLabel={image.label}
                />
              )}
            </div>
          </div>
          <div className="mt-6 hidden" ref={generateForm}>
            <IonList className="w-full md:w-3/4 lg:w-1/2 mx-auto" lines="none">
              <IonItem className="mt-2 border-2">
                <IonLoading
                  className="loading-icon"
                  cssClass="loading-icon"
                  isOpen={showLoading}
                  message={"Generating image... Please wait."}
                />
                {image && (
                  <IonTextarea
                    className=""
                    placeholder="Enter prompt"
                    value={image.image_prompt}
                    onIonInput={(e) =>
                      setImage({ ...image, image_prompt: e.detail.value! })
                    }
                  ></IonTextarea>
                )}
              </IonItem>
              <IonItem className="mt-2">
                <IonButton className="w-full text-lg" onClick={handleGenerate}>
                  Generate Image
                </IonButton>
              </IonItem>
              <IonItem className="mt-2 font-mono">
                <p className="text-sm">
                  This will generate an image based on the prompt you enter.
                </p>
              </IonItem>
              <IonItem className="mt-2 font-mono">
                <p className="text-sm">This will cost you 1 token.</p>
              </IonItem>
            </IonList>
          </div>

          <div className="mt-6 hidden" ref={imageGridWrapper}>
            {renderImageUserInfo(currentUser)}

            {image && image.docs && image.docs.length > 0 && (
              <div className="w-full md:w-5/6 mx-auto text-center">
                <IonLabel className="font-bold text-sm md:text-md lg:text-lg">
                  Click an image to display it for the word: "{image.label}"
                </IonLabel>
                <div
                  className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 mt-3"
                  ref={imageGrid}
                >
                  {/* This needs pulled out into a separate component */}
                  {image?.docs &&
                    image.docs.map((doc, index) => (
                      <div
                        key={doc.id}
                        className={` ${
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

            {image && boards && (
              <div className="mt-6 flex justify-center gap-1  w-full mx-auto">
                <div className="mx-auto w-1/2">
                  {boards && boards.length > 0 && (
                    <BoardDropdown imageId={image.id} boards={boards} />
                  )}
                </div>
                {image?.user_image_boards &&
                  image?.user_image_boards?.length > 0 && (
                    <div className="mx-auto ">
                      <IonText className="text-md">
                        This image is on the following boards:
                      </IonText>
                      <IonList>
                        {image?.user_image_boards?.map((board) => (
                          <IonItem
                            key={board.id}
                            routerLink={`/boards/${board.id}`}
                            detail={true}
                            className="text-sm font-mono"
                          >
                            {board.name}
                          </IonItem>
                        ))}
                      </IonList>
                    </div>
                  )}
              </div>
            )}
            {currentUser?.id === image?.user_id && (
              <div className="">
                {image?.next_words && image?.next_words.length > 0 && (
                  <>
                    <IonText className="text-md block">
                      Next words for this image:
                    </IonText>
                    {image?.next_words.map((word, index) => (
                      <IonButton
                        key={index}
                        className="text-md hover:cursor-pointer"
                        color={"secondary"}
                        onClick={() => {
                          handleFindByLabel(word);
                        }}
                      >
                        {word}
                      </IonButton>
                    ))}
                  </>
                )}
              </div>
            )}
            {currentUser?.admin && (
              <div className="mt-10 w-full md:w-11/12 mx-auto">
                <div className="flex justify-between">
                  {!image?.no_next && (
                    <IonButton
                      onClick={handleNextWords}
                      className="text-sm font-mono"
                      slot="start"
                      fill="outline"
                    >
                      Set Next Words
                    </IonButton>
                  )}
                  <IonButton
                    routerLink={`/predictive/${image?.id}`}
                    className="text-sm font-mono"
                    fill="outline"
                  >
                    View Predictive
                  </IonButton>
                  <IonButton
                    onClick={createSymbol}
                    className="text-sm font-mono"
                    fill="outline"
                  >
                    Create Symbol
                  </IonButton>
                </div>
                <div className="text-sm font-mono w-full">
                  {image?.image_prompt && (
                    <div className="mt-2">
                      <IonText className="text-md">Prompt:</IonText>
                      <p className="text-md">{image.image_prompt}</p>
                    </div>
                  )}
                </div>
                <div className="text-sm font-mono w-full md:w-1/2 mx-auto">
                  {nextImageWords?.length > 0 && (
                    <div className="mt-2">
                      <IonText className="text-md">Next Words:</IonText>
                      <div className="flex flex-wrap">
                        {nextImageWords.map((word, index) => (
                          <div
                            key={index}
                            className={`m-1 p-2 ${wordBgColor(word)}`}
                          >
                            <IonText
                              className="text-sm hover:cursor-pointer"
                              onClick={toggleAddToRemoveList}
                            >
                              {word}
                            </IonText>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-2 w-full md:w-1/2 mx-auto">
                  <IonInput
                    className=""
                    ref={newWordInput}
                    placeholder="Enter word"
                    onIonInput={(e) => setNewImageWord(e.detail.value ?? "")}
                  ></IonInput>
                  <div className="mt-2">
                    <IonButton
                      className="mt-2 w-full"
                      onClick={handleAddNextWords}
                      fill="outline"
                    >
                      Add Word
                    </IonButton>
                    <IonButton
                      className="mt-2 w-full"
                      color={"danger"}
                      onClick={handleDeleteSelected}
                      fill="outline"
                    >
                      Delete Selected
                    </IonButton>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="hidden p-4" ref={deleteImageWrapper}>
            {image && image.display_doc?.id && (
              <div className="mb-4 w-full md:w-1/2 mx-auto">
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
              <div className="m-4 pt-4 w-full md:w-1/2 mx-auto">
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
        <Tabs />
      </IonPage>
    </>
  );
};

export default ViewImageScreen;
