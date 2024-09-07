import React, { useState, useEffect, useRef } from "react";
import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonSegment,
  IonSegmentButton,
  IonText,
  IonTextarea,
  useIonViewWillEnter,
} from "@ionic/react";
import { useHistory, useParams } from "react-router";
import {
  Image,
  setNextWords,
  create_symbol,
  cloneImage,
} from "../../data/images"; // Adjust imports based on actual functions
import { markAsCurrent } from "../../data/docs"; // Adjust imports based on actual functions
import BoardDropdown from "../../components/boards/BoardDropdown";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import {
  cloudUploadOutline,
  gridOutline,
  imageOutline,
  pencilOutline,
  refreshCircleOutline,
  searchOutline,
  trashBinOutline,
} from "ionicons/icons";
import MainMenu from "../../components/main_menu/MainMenu";
import MainHeader from "../MainHeader";
import StaticMenu from "../../components/main_menu/StaticMenu";
import Tabs from "../../components/utils/Tabs";
import AudioList from "../../components/images/AudioList";
import VoiceDropdown from "../../components/utils/VoiceDropdown";
import ConfirmAlert from "../../components/utils/ConfirmAlert";
import ImageSearchComponent from "../../components/admin/ImageSearchComponent";
import {
  BoardImage,
  getBoardImage,
  getBoardImagebyBoard,
  makeDynamicBoard,
  makeStaticBoard,
  setNextBoardImageWords,
} from "../../data/board_images";
import { set } from "d3";
import BoardImageComponent from "../../components/board_images/BoardImageComponent";
import LockedDynamicBoard from "../../components/board_images/LockedDynamicBoard";

const ViewBoardImageScreen: React.FC = () => {
  const { id } = useParams<{
    id: string;
  }>();
  const history = useHistory();
  // const [boardImage, setImage] = useState<Image | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>("");
  const imageGrid = useRef<HTMLDivElement>(null);
  const newWordInput = useRef<HTMLIonInputElement>(null);
  const [showLoading, setShowLoading] = useState(false);
  const [segmentType, setSegmentType] = useState("dynamic");
  const editWrapper = useRef<HTMLDivElement>(null);
  const dynamicWrapper = useRef<HTMLDivElement>(null);
  const [pageTitle, setPageTitle] = useState("");
  const { currentUser, isWideScreen, currentAccount, smallScreen } =
    useCurrentUser();
  const [boardImage, setBoardImage] = useState<BoardImage | null>(null);
  const [nextImageWords, setNextImageWords] = useState<string[]>([]);
  const [newImageWord, setNewImageWord] = useState("");
  const [wordsToRemove, setWordsToRemove] = useState<string[]>([]);
  const [openAlert, setOpenAlert] = useState(false);

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
  const [openStaticAlert, setOpenStaticAlert] = useState(false);
  const fetchBoardImage = async () => {
    const img = await getBoardImage(id);
    setBoardImage(img);
    setNextImageWords(img?.next_words);
    return img;
  };

  const handleMakeDynamic = async () => {
    if (!boardImage) return;
    console.log("Making boardImage dynamic...");
    setShowLoading(true);
    const result = await makeDynamicBoard(id);
    if (result) {
      console.log("BoardImage made dynamic.", result);
      setShowLoading(false);
      setupData();
    } else {
      alert("Error making boardImage dynamic.");
    }
    setShowLoading(false);
  };

  const handleMakeStatic = async () => {
    if (!boardImage) return;
    const result = await makeStaticBoard(id);
    if (result) {
      setupData();
    } else {
      alert("Error making boardImage static.");
    }
  };

  const setupData = async () => {
    console.log("Setting up data...");
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    console.log("URL Params: ", urlParams);
    setShowHardDelete(currentUser?.role === "admin");
    const img = await fetchBoardImage();
    if (img) {
      setPageTitle(img.label);
      setCurrentImage(img.src);
    }
  };

  useEffect(() => {
    setupData();
  }, []);

  const refresh = (e: CustomEvent) => {
    setTimeout(() => {
      e.detail.complete();
      setupData();
    }, 3000);
  };

  const toggleForms = (segmentType: string) => {
    const label = boardImage?.label;

    if (segmentType === "edit") {
      setPageTitle(`Gallery for ${label}`);
      dynamicWrapper.current?.classList.add("hidden");
      editWrapper.current?.classList.remove("hidden");
    } else if (segmentType === "dynamic") {
      setPageTitle(`Dynamic Mode for ${label}`);

      dynamicWrapper.current?.classList.remove("hidden");
      editWrapper.current?.classList.add("hidden");
    } else if (segmentType === "image") {
      window.location.href = `/images/${boardImage?.image_id}`;
    }
  };

  const handleDocClick = async (e: React.MouseEvent<HTMLIonImgElement>) => {
    const target = e.target as HTMLImageElement;
    const currentImg = await markAsCurrent(target.id); // Ensure markAsCurrent returns a Promise
    const imgToSet = currentImg;
    setCurrentImage(imgToSet.src);
  };

  const handleSegmentChange = (e: CustomEvent) => {
    const newSegment = e.detail.value;
    setSegmentType(newSegment);
    toggleForms(newSegment);
  };

  const handleNextWords = async () => {
    if (!boardImage) return;
    const result = await setNextBoardImageWords(boardImage.id);
    if (result["next_words"]) {
      console.log("Next words set.", result["next_words"]);
      // history.push(`/predictive/${boardImage.id}`);
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

  const [newName, setNewName] = useState(boardImage?.label ?? "");
  // const [voiceToCreate, setVoiceToCreate] = useState("alloy");

  const handleInputChange = (str: string) => {
    setNewName(str);
    console.log("New name: ", str);
    handleCloneImage(str);
  };

  const handleCloneImage = async (name: string) => {
    if (!boardImage) return;
    const result = await cloneImage(boardImage.id, name);
    if (result) {
      history.push(`/images/${result.id}`);
    } else {
      alert("Error cloning boardImage.");
    }
  };
  const handleAddNextWords = async () => {
    if (!boardImage) return;
    const newImageWords = [...nextImageWords, newImageWord];
    const result = await setNextWords(boardImage.id, newImageWords);
    if (result["next_words"]) {
      setNewImageWord("");
      clearInput();
      setupData();
    } else {
      alert("Error setting next words.\n" + result["message"]);
    }
  };

  const handleAudioDelete = () => {
    console.log("Audio deleted");
  };

  const toggleAddToRemoveList = (e: React.MouseEvent<HTMLIonTextElement>) => {
    const target = e.target as HTMLIonTextElement;
    const word = target.innerText;
    if (wordsToRemove.includes(word)) {
      const newWords = wordsToRemove.filter((w) => w !== word);
      setWordsToRemove(newWords);
    } else {
      setWordsToRemove([...wordsToRemove, word]);
    }
  };

  const handleDeleteSelected = async () => {
    if (!boardImage) return;
    const wordsToSet = nextImageWords.filter(
      (word) => !wordsToRemove.includes(word)
    );
    const result = await setNextWords(boardImage.id, wordsToSet);
    if (result["next_words"]) {
      setupData();
    } else {
      alert("Error setting next words.\n" + result["message"]);
    }
  };

  const renderImageUserInfo = (currentUser: any) => {
    if (currentUser?.admin) {
      return (
        <div className="w-full md:w-1/2 mx-auto">
          {(currentAccount?.id === boardImage?.user_id ||
            currentUser?.admin) && (
            <IonText className="text-md block">
              This boardImage was created by:{" "}
              {boardImage?.user?.name ||
                boardImage?.user?.email ||
                boardImage?.user?.id}
            </IonText>
          )}
          <IonText className="text-md block my-3">
            This boardImage was created on: {boardImage?.created_at}
          </IonText>

          {currentAccount?.id === boardImage?.user_id ? (
            ""
          ) : (
            <IonText className="text-md block my-3">
              This boardImage is owned by: <br></br>
              {boardImage?.user?.name ||
                boardImage?.user?.email ||
                boardImage?.user?.id}{" "}
              {boardImage?.user?.role === "admin" ? "(admin)" : ""}
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

  const handleNewAudio = (response: any, voice: string) => {
    if (!response) {
      console.error("Error adding boardImage to voice");
      return;
    }
    if (response["error"]) {
      const message = `${response["error"]}`;
      alert(message);
      setShowLoading(false);
      return;
    }
    if (voice) {
      setShowLoading(false);
      setBoardImage(response);
    }
  };

  useIonViewWillEnter(() => {
    setupData();
  }, []);

  return (
    <>
      <MainMenu
        pageTitle={`${boardImage?.mode} Board Image`}
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />
      <StaticMenu
        pageTitle={`${boardImage?.mode} Board Image`}
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />

      <IonPage id="main-content">
        <MainHeader
          pageTitle={`${boardImage?.mode || "no mode"} Board Image`}
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
              <IonSegmentButton value="dynamic">
                {!smallScreen ? (
                  <IonLabel className="text-sm md:text-md lg:text-lg mb-2">
                    Dynamic
                  </IonLabel>
                ) : (
                  <IonLabel className="text-sm md:text-md lg:text-lg mb-2"></IonLabel>
                )}
                <IonIcon className="mt-2" icon={gridOutline} />
              </IonSegmentButton>

              <IonSegmentButton value="edit">
                {!smallScreen ? (
                  <IonLabel className="text-sm md:text-md lg:text-lg mb-2">
                    Edit
                  </IonLabel>
                ) : (
                  <IonLabel className="text-sm md:text-md lg:text-lg mb-2"></IonLabel>
                )}
                <IonIcon className="mt-2" icon={pencilOutline} />
              </IonSegmentButton>
              <IonSegmentButton value="image">
                {!smallScreen ? (
                  <IonLabel className="text-sm md:text-md lg:text-lg mb-2">
                    Image
                  </IonLabel>
                ) : (
                  <IonLabel className="text-sm md:text-md lg:text-lg mb-2"></IonLabel>
                )}
                <IonIcon className="mt-2" icon={imageOutline} />
              </IonSegmentButton>
            </IonSegment>
          </IonHeader>
          <div className="ion-justify-content-center ion-align-items-center ion-text-center pt-1">
            <IonText className="font-bold text-2xl">{pageTitle}</IonText>
            <div className="mt-4">
              {currentImage && boardImage && (
                <IonImg
                  id={boardImage.id}
                  src={currentImage}
                  alt={boardImage.label}
                  className={`w-1/4 mx-auto ${
                    boardImage.bg_color || "bg-white"
                  } p-1 rounded-lg shadow-md`}
                />
              )}
            </div>
            <div className="mt-4">
              <h1 className="text-center text-2xl font-bold">
                TEMP - ViewBoardImage
              </h1>
              {boardImage?.mode}
              {boardImage?.mode !== "dynamic" && (
                <IonButton
                  onClick={() => setOpenAlert(true)}
                  className="text-sm"
                  fill="outline"
                  size="small"
                >
                  Make Dynamic
                </IonButton>
              )}
              {boardImage?.mode === "dynamic" && (
                <IonButton
                  onClick={() => setOpenStaticAlert(true)}
                  className="text-sm"
                  fill="outline"
                  size="small"
                >
                  Make Static
                </IonButton>
              )}
            </div>
            <div className="mt-4">
              <h2 className="text-center">Next Words</h2>
              <div className="flex flex-wrap">
                {nextImageWords.map((word, index) => (
                  <div key={index} className={`m-1 p-2 ${wordBgColor(word)}`}>
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
            <ConfirmAlert
              onConfirm={() => handleMakeStatic()}
              onCanceled={() => {}}
              openAlert={openStaticAlert}
              message="Are you sure you want to make this image static?"
              onDidDismiss={() => setOpenStaticAlert(false)}
            />
            <ConfirmAlert
              onConfirm={() => handleMakeDynamic()}
              onCanceled={() => {}}
              openAlert={openAlert}
              message="Are you sure you want to make this image dynamic?"
              onDidDismiss={() => setOpenAlert(false)}
            />
          </div>

          <div className="mt-2 hidden" ref={dynamicWrapper}>
            <div className="w-full md:w-3/4 mx-auto p-2">
              <h2 className="text-center">Dynamic Board</h2>
              {boardImage && boardImage?.dynamic_board && (
                <LockedDynamicBoard
                  boardId={boardImage?.dynamic_board?.id}
                  boardType="dynamic"
                />
              )}
            </div>
          </div>

          <div className="mt-2 hidden" ref={editWrapper}>
            {renderImageUserInfo(currentUser)}

            {currentUser && (
              <div className="mt-10 w-full md:w-3/4 mx-auto">
                <IonText className="text-md">Edit Board Image</IonText>
                <div className="flex justify-between">
                  <IonButton
                    onClick={handleNextWords}
                    className="text-sm font-mono"
                    slot="start"
                    fill="outline"
                  >
                    Set Next Words
                  </IonButton>
                  <IonButton
                    routerLink={`/predictive/${boardImage?.id}`}
                    className="text-sm font-mono"
                    fill="outline"
                  >
                    View Predictive
                  </IonButton>
                </div>

                <div className="text-sm font-mono w-full md:w-1/2 mx-auto">
                  {/* {nextImageWords?.length > 0 && (
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
                  )} */}
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
                <div className="mt-2 w-full md:w-1/2 mx-auto">
                  {boardImage && boardImage.src && (
                    <>
                      <IonText className="text-md">
                        This boardImage is currently displayed as the main
                        boardImage.
                      </IonText>
                    </>
                  )}
                </div>
                <div className="p-3">
                  {boardImage && (
                    <VoiceDropdown
                      imageId={boardImage?.id}
                      onSuccess={handleNewAudio}
                    />
                  )}
                </div>
                <div className="mt-2 w-full md:w-1/2 mx-auto">
                  {boardImage && (
                    <AudioList
                      image={boardImage.image}
                      afterDeleteAudioFile={handleAudioDelete}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </IonContent>
        <Tabs />
      </IonPage>
    </>
  );
};

export default ViewBoardImageScreen;
