import { createMenu } from '../data/menus';
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
} from '@ionic/react';
import { SubmitHandler, set, useForm } from 'react-hook-form';
import { arrowBackCircleOutline } from 'ionicons/icons';
import Menu from '../components/Menu';
import MenuForm from '../components/MenuForm';
import { FormEventHandler, useState } from 'react';
type NewMenu = {
  name: string
  file: File
  description: string
}
const NewMenu: React.FC = (props: any) => {

  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm<Inputs>()

  const [menu, setMenus] = useState<NewMenu>({ name: '', file: new File([''], 'filename'), description: '' });
  const [shouldDisable, setShouldDisable] = useState<boolean>(true);

  const uploadPhoto = (fileSumbitEvent: React.FormEvent<Element>) => {
    fileSumbitEvent.preventDefault();
    console.log(menu);
    const data = new FormData();
    data.append('menu[name]', menu.name);
    data.append('menu[description]', menu.description);
    const file = menu.file;
    console.log("file", file);
    if (file) {
      data.append('menu[docs][image]', file);
    }

    saveMenu(data);
    // props.history.push('/home');
  }

  const saveMenu = async (formData: FormData) => {
    console.log("formData", formData);
    let result = await createMenu(formData);
    if (result?.error) {
      console.error('Error:', result.error);
      return result;
    } else {
      console.log("result", result);
      const boardId = result.boardId;
      console.log("boardId", boardId);
      setMenus({ name: '', file: new File([''], 'filename'), description: '' });
      props.history.push('/boards/' + boardId);
      // window.location.reload();
    }
  }

  const onFileChange = (event: any) => {
    console.log(event.target.files[0]);
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
}

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
          
            <form className="ion-padding" onSubmit={uploadPhoto} encType="multipart/form-data">
            <IonItem>
              <IonInput label="Name" placeholder="Enter new menu name" defaultValue="" onIonInput={e => setMenus({ ...menu, name: e.detail.value! })} required></IonInput>
            </IonItem>

            <IonItem>
              <input className='bg-inherit w-full p-4 border rounded-md' type="file" onChange={ev => onFileChange(ev)} />
            </IonItem>
            
            <IonButton className="ion-margin-top" type="submit" expand="block" disabled={shouldDisable}>
              Create
            </IonButton>
          </form>
          <IonButton onClick={() => console.log(menu)}>Log</IonButton>
          </>
      </IonContent>
    </IonPage>
  );
}

export default NewMenu;