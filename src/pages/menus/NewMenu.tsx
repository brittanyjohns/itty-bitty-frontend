import { createMenu } from "../../data/menus";
import Tesseract from "tesseract.js";

import {
  IonButton,
  IonButtons,
  IonCard,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonLoading,
  IonPage,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { arrowBackCircleOutline, cameraOutline } from "ionicons/icons";
import { useRef, useState } from "react";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import Tabs from "../../components/utils/Tabs";
import ImagePasteHandler from "../../components/utils/ImagePasteHandler";
import MainMenu from "../../components/main_menu/MainMenu";
import StaticMenu from "../../components/main_menu/StaticMenu";
import MainHeader from "../MainHeader";
import ImageCropper from "../../components/images/ImageCropper";
import { set } from "d3";

type NewMenu = {
  name: string;
  file: File;
  description: string;
  token_limit: number;
};
const NewMenu: React.FC = (props: any) => {
  const [menu, setMenus] = useState<NewMenu>({
    name: "",
    file: new File([""], "filename"),
    description: "",
    token_limit: 1,
  });
  const [showLoading, setShowLoading] = useState<boolean>(false);

  const { currentUser, currentAccount, isWideScreen } = useCurrentUser();
  const imageElementRef = useRef<HTMLImageElement>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const [tokenLimit, setTokenLimit] = useState<number>(10);

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

  const uploadPhoto = (fileSumbitEvent: React.FormEvent<Element>) => {
    fileSumbitEvent.preventDefault();

    if (!menu.file.size || menu.file.size === 0) {
      alert("Please select a file to upload");
      return;
    }
    if (!name) {
      alert("Please enter a name for the menu");
      return;
    }
    if (!menu.description) {
      alert("Something went wrong. Please try a different image.");
      return;
    }
    const data = new FormData();
    data.append("menu[name]", name);
    data.append("menu[description]", menu.description);
    data.append("menu[token_limit]", tokenLimit.toString());
    const file = menu.file;
    if (file) {
      data.append("menu[docs][image]", file);
    }
    saveMenu(data);
  };

  const saveMenu = async (formData: FormData) => {
    const hasTokens = checkCurrentUserTokens(1);
    if (!hasTokens) {
      console.error("User does not have enough tokens");
      alert(
        "Sorry, you do not have enough tokens to generate an image. Please purchase more tokens to continue."
      );
      return;
    }
    let result = await createMenu(formData);
    console.log("Result:", result);
    if (result?.errors) {
      console.error("Error:", result.errors);
      alert(`Error creating menu: ${JSON.stringify(result)}`);
      return result;
    } else {
      const id = result.id;
      props.history.push("/menus/" + id);
      window.location.reload();
    }
  };

  const handleNameInput = (event: any) => {
    setName(event.target.value);
  };

  const onFileChange = (event: any) => {
    event.preventDefault();
    let file = event.target.files[0];

    console.log("File: ", file);
    handleFile(file);
    return menu;
  };

  const handlePaste = (file: File) => {
    handleFile(file);
    const fileField = document.querySelector("#file_field") as HTMLImageElement;
    if (fileField) {
      fileField.hidden = true;
    }
  };

  const handleCancel = () => {
    window.location.reload();
    setShowLoading(false);
    setImageSrc(null);
  };

  const handleFile = (file: File) => {
    let reader = new FileReader();

    reader.onload = (event: ProgressEvent<FileReader>) => {
      const dataUrl = event.target!.result as string;
      setImageSrc(dataUrl);

      setShowLoading(true);

      Tesseract.recognize(dataUrl, "eng", {
        // logger: (m) => console.log(m),
      }).then(({ data: { text } }) => {
        setMenus({ ...menu, file: file, description: text });
        if (imageElementRef.current) {
          imageElementRef.current.src = dataUrl;
          console.log("Setting image source: ", dataUrl);
        }
        console.log("Data URL: ", dataUrl);
        // setImageSrc(dataUrl);
        setShowLoading(false);
      });
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <>
      <MainMenu
        pageTitle="New Menu"
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />
      <StaticMenu
        pageTitle="New Menu"
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />

      <IonPage id="main-content">
        <MainHeader
          pageTitle="New Menu"
          isWideScreen={isWideScreen}
          startLink="/menus"
        />

        <IonContent>
          <IonLoading
            message="Please wait while we analyze your menu..."
            isOpen={showLoading}
          />

          <div className="w-full md:w-3/4 lg:w-1/2 mx-auto">
            <IonItem
              lines="none"
              className="ion-margin-bottom ion-margin-top mx-auto"
            >
              <h1 className="text-center text-xl md:text-2xl font-bold">
                Create a new menu board
              </h1>
            </IonItem>
            <IonItem lines="none" className="ion-margin-bottom mx-2">
              <h1 className="text-center text-md">
                Upload or paste an image to create a new menu
              </h1>
            </IonItem>
            <form onSubmit={uploadPhoto} encType="multipart/form-data">
              <IonItem lines="none">
                <IonInput
                  label="Name"
                  placeholder="Enter new menu name"
                  onIonInput={handleNameInput}
                  required
                ></IonInput>
              </IonItem>

              <IonItem lines="none" className="ion-margin-bottom">
                <input
                  className="bg-inherit w-full p-2 rounded-md"
                  type="file"
                  id="file_field"
                  onChange={(ev) => onFileChange(ev)}
                />
              </IonItem>
              <IonItem lines="none" className="ion-margin-bottom">
                <p className="w-3/4 md:w-1/2 mx-auto text-center">
                  You have {currentUser?.tokens} tokens
                </p>
              </IonItem>
              <IonItem lines="none" className="ion-margin-bottom">
                <p className="text-center">
                  You can set the maximum number of tokens to use to generate
                  this menu.
                </p>
              </IonItem>

              <IonItem lines="none" className="ion-margin-bottom">
                <IonInput
                  label="Token Limit"
                  type="number"
                  placeholder="Enter token limit"
                  value={tokenLimit}
                  onIonInput={(e) => setTokenLimit(parseInt(e.detail.value!))}
                  required
                ></IonInput>
              </IonItem>
              <IonCard className="p-2 m-2 border text-center">
                <h2 className="text-xl font-bold">Paste an image</h2>
                <p className="text-sm">Right-click and paste an image here</p>
                <IonItem className="mt-4">
                  <IonTextarea rows={8}></IonTextarea>
                  <ImagePasteHandler setFile={handlePaste} />
                </IonItem>
                {imageSrc && (
                  <>
                    <img
                      ref={imageElementRef}
                      src={imageSrc}
                      alt="Source"
                      style={{ display: "none" }}
                    />
                  </>
                )}
                <IonButtons className="mt-4">
                  <IonButton
                    type="submit"
                    className="mt-4"
                    color="secondary"
                    fill="outline"
                    expand="block"
                  >
                    Submit
                  </IonButton>
                  <IonButton
                    onClick={handleCancel}
                    className="mt-4"
                    fill="outline"
                    color="danger"
                    expand="block"
                  >
                    Cancel
                  </IonButton>
                </IonButtons>
              </IonCard>
              <IonButtons className="ion-margin-top">
                <IonButton
                  className="ion-margin-top"
                  type="submit"
                  expand="block"
                  color={"secondary"}
                  fill="solid"
                  slot="start"
                  size="large"
                >
                  Create
                </IonButton>
                <IonButton
                  onClick={() => window.location.reload()}
                  expand="block"
                  color={"danger"}
                  fill="outline"
                  slot="end"
                  size="small"
                >
                  Cancel
                </IonButton>
              </IonButtons>
            </form>
          </div>
        </IonContent>
        <Tabs />
      </IonPage>
    </>
  );
};

export default NewMenu;
