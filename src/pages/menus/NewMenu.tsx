import { createMenu } from "../../data/menus";
import Tesseract from "tesseract.js";

import {
  IonButton,
  IonButtons,
  IonCard,
  IonContent,
  IonInput,
  IonItem,
  IonLoading,
  IonPage,
  IonTextarea,
} from "@ionic/react";
import { useRef, useState } from "react";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import Tabs from "../../components/utils/Tabs";
import ImagePasteHandler from "../../components/utils/ImagePasteHandler";
import SideMenu from "../../components/main_menu/SideMenu";
import StaticMenu from "../../components/main_menu/StaticMenu";
import MainHeader from "../MainHeader";

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
    setShowLoading(true);
    let result = await createMenu(formData);
    setShowLoading(false);
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
      <SideMenu
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
            <form onSubmit={uploadPhoto} encType="multipart/form-data">
              <IonCard className="text-center w-full w-7/8 mx-auto ion-padding">
                <IonItem lines="none" className="ion-margin-bottom mx-2">
                  <h1 className="text-center text-lg md:text-2xl font-bold">
                    Convert an image of any menu into a communication board
                    instantly!
                  </h1>
                </IonItem>
                <IonItem
                  lines="none"
                  className="ion-margin-bottom pb-3 border-b-2"
                >
                  <IonInput
                    label="Name"
                    fill="outline"
                    placeholder="Enter new menu name"
                    onIonInput={handleNameInput}
                    required
                  ></IonInput>
                </IonItem>

                <IonItem lines="none" className="ion-margin-bottom">
                  <p className="w-3/4 md:w-1/2 mx-auto text-center text-lg font-bold">
                    This is the number of tokens that will be used to generate
                    this menu.
                  </p>
                </IonItem>
                <IonItem lines="none" className="ion-margin-bottom p-2">
                  <IonInput
                    type="number"
                    label="Token Limit"
                    fill="outline"
                    placeholder="Enter token limit"
                    className="w-full md:w-1/2 mx-auto"
                    value={tokenLimit}
                    onIonInput={(e: any) =>
                      setTokenLimit(parseInt(e.detail.value!))
                    }
                    required
                  ></IonInput>
                </IonItem>
                <IonItem lines="none" className="ion-margin-bottom">
                  <p className="w-3/4 md:w-1/2 mx-auto text-center">
                    You have {currentUser?.tokens} tokens
                    <br></br>
                    This menu will use a maximum of{" "}
                    <span className="font-bold"> {tokenLimit}</span> tokens
                  </p>
                </IonItem>
                <IonItem
                  lines="none"
                  className="ion-margin-bottom border-b-2 py-3"
                >
                  {currentUser?.tokens && (
                    <p className="w-3/4 md:w-1/2 mx-auto text-center">
                      You will have a minimum of {""}
                      {currentUser?.tokens - tokenLimit} tokens remaining after
                      creating this menu
                    </p>
                  )}
                </IonItem>
                <IonItem lines="none" className="ion-margin-bottom mx-2">
                  <h1 className="text-center text-xl font-bold">
                    Upload or paste an image to create a new menu
                  </h1>
                </IonItem>
                <IonItem lines="none" className="ion-margin-bottom">
                  <input
                    className="bg-inherit w-full p-2 rounded-md border border-gray-300"
                    type="file"
                    id="file_field"
                    onChange={(ev) => onFileChange(ev)}
                  />
                </IonItem>
                <h2 className="text-xl font-bold">Paste an image below</h2>
                <div className="mt-4 w-full md:w-3/4 mx-auto">
                  <IonTextarea
                    // fill={"outline"}
                    // rows={8}
                    disabled
                    readonly
                  ></IonTextarea>
                  <ImagePasteHandler setFile={handlePaste} />
                </div>
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
