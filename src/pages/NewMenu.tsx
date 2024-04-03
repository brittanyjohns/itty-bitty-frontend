import { createMenu } from "../data/menus";
import Tesseract from "tesseract.js";

import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { arrowBackCircleOutline } from "ionicons/icons";
import { useState } from "react";
import { useCurrentUser } from "../hooks/useCurrentUser";
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
  const [shouldDisable, setShouldDisable] = useState<boolean>(true);

  const { currentUser, setCurrentUser } = useCurrentUser();

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
    console.log(menu);
    const data = new FormData();
    data.append("menu[name]", menu.name);
    data.append("menu[description]", menu.description);
    const file = menu.file;
    if (file) {
      data.append("menu[docs][image]", file);
    }

    saveMenu(data);
    // props.history.push('/home');
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
      return result;
    } else {
      const boardId = result.boardId;
      props.history.push("/boards/" + boardId);
      window.location.reload();
    }
  };

  const handleNameInput = (event: any) => {
    setMenus({ ...menu, name: event.target.value });
  };

  const onFileChange = (event: any) => {
    let description = "";

    event.preventDefault();
    let file = event.target.files[0];
    // register("file", { value: file, required: true });
    let reader = new FileReader();

    reader.onload = (event: any) => {
      Tesseract.recognize(event.target.result, "eng", {
        logger: (m) => console.log(m),
      }).then(({ data: { text } }) => {
        console.log("Text: ", text);
        description = text;
        setMenus({ ...menu, file: file, description: description });
        setShouldDisable(false);
      });
    };
    reader.readAsArrayBuffer(file);
    return menu;
  };

  return (
    <IonPage id="new-menu-page">
      <IonHeader translucent>
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
        <>
          <form
            className="ion-padding"
            onSubmit={uploadPhoto}
            encType="multipart/form-data"
          >
            <IonItem>
              <IonInput
                label="Name"
                placeholder="Enter new menu name"
                onIonInput={handleNameInput}
                required
              ></IonInput>
            </IonItem>

            <IonItem>
              <input
                className="bg-inherit w-full p-4 border rounded-md"
                type="file"
                onChange={(ev) => onFileChange(ev)}
              />
            </IonItem>

            <IonButton
              className="ion-margin-top"
              type="submit"
              expand="block"
              disabled={shouldDisable}
            >
              Create
            </IonButton>
          </form>
          <IonButton onClick={() => console.log(menu)}>Log</IonButton>
        </>
      </IonContent>
    </IonPage>
  );
};

export default NewMenu;
