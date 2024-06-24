import { createMenu } from "../../data/menus";
import Tesseract from "tesseract.js";

import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLoading,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { arrowBackCircleOutline, cameraOutline } from "ionicons/icons";
import { useRef, useState } from "react";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import Tabs from "../../components/utils/Tabs";
import ImagePasteHandler from "../../components/utils/ImagePasteHandler";
import MainMenu from "../../components/main_menu/MainMenu";

type NewMenu = {
  name: string;
  file: File;
  description: string;
};
const NewMenu: React.FC = (props: any) => {
  const [menu, setMenus] = useState<NewMenu>({
    name: "",
    file: new File([""], "filename"),
    description: "",
  });
  const [showLoading, setShowLoading] = useState<boolean>(false);

  const { currentUser } = useCurrentUser();
  const imageElementRef = useRef<HTMLImageElement>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [name, setName] = useState<string>("");

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
    console.log(menu);
    const data = new FormData();
    data.append("menu[name]", name);
    data.append("menu[description]", menu.description);
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
    if (result?.error) {
      console.error("Error:", result.error);
      alert(`Error creating menu: ${result.error}`);
      return result;
    } else {
      const id = result.id;
      props.history.push("/menus/" + id);
      window.location.reload();
    }
  };

  const handleNameInput = (event: any) => {
    setName(event.target.value);
    console.log("name: ", event.target.value);
  };

  const onFileChange = (event: any) => {
    event.preventDefault();
    console.log("File: ", event.target.files[0]);
    let file = event.target.files[0];

    console.log("File: ", file);
    handleFile(file);
    console.log("Image source: ", imageSrc);
    return menu;
  };

  const handlePaste = (file: File) => {
    console.log("Pasted: ", file);

    handleFile(file);
    const fileField = document.querySelector("#file_field") as HTMLImageElement;
    console.log("fileField", fileField);
    if (fileField) {
      fileField.hidden = true;

      // fileField.src = URL.createObjectURL(file);
    }
  };

  const handleFile = (file: File) => {
    let reader = new FileReader();

    reader.onload = (event: ProgressEvent<FileReader>) => {
      const dataUrl = event.target?.result as string;

      setShowLoading(true);

      Tesseract.recognize(dataUrl, "eng", {
        // logger: (m) => console.log(m),
      }).then(({ data: { text } }) => {
        setMenus({ ...menu, file: file, description: text });
        if (imageElementRef.current) {
          imageElementRef.current.src = dataUrl;
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
      <MainMenu />
      <IonPage id="main-content">
        <IonHeader className="bg-inherit shadow-none">
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton routerLink="/menus">
                <IonIcon slot="icon-only" icon={arrowBackCircleOutline} />
              </IonButton>
            </IonButtons>
            <IonTitle>New Menu</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent fullscreen scrollY={true}>
          <IonLoading
            message="Please wait while we analyze your menu..."
            isOpen={showLoading}
          />
          <IonItem
            lines="none"
            className="ion-margin-bottom ion-margin-top mx-auto w-3/4 md:w-1/2 text-2xl"
          >
            <h1 className="text-center">Create a new menu board</h1>
          </IonItem>
          <div className="ion-padding w-full md:w-3/4 lg:w-1/2 mx-auto border shadow-lg">
            <IonItem lines="none" className="ion-margin-bottom mx-4">
              <h1 className="text-center">
                Browse for an image or paste an image to create a new menu
              </h1>
              <IonIcon icon={cameraOutline} size="large" className="mx-auto" />
            </IonItem>
            <form
              className="ion-padding"
              onSubmit={uploadPhoto}
              encType="multipart/form-data"
            >
              <IonItem lines="none" className="ion-margin-bottom">
                <IonInput
                  label="Name"
                  placeholder="Enter new menu name"
                  onIonInput={handleNameInput}
                  required
                ></IonInput>
              </IonItem>

              <IonItem lines="none" className="ion-margin-bottom">
                <input
                  className="bg-inherit w-full p-4 rounded-md"
                  type="file"
                  id="file_field"
                  onChange={(ev) => onFileChange(ev)}
                />
              </IonItem>
              <ImagePasteHandler setFile={handlePaste} />

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
