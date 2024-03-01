// Import necessary components and hooks
import React, { useEffect, useRef, useState } from 'react';
import { IonPage, IonContent, IonInput, IonButton, IonItem, IonLabel, useIonViewWillEnter, useIonViewDidEnter, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent } from '@ionic/react';
import { createImage } from '../data/images';
import { useHistory, useParams } from 'react-router';
import { Board } from '../types';
import { set } from 'react-hook-form';
interface IMyProps {board: Board | undefined,
  onCloseModal: any}
const FileUploadForm: React.FC<IMyProps> = (props: IMyProps) => {
  const [label, setLabel] = useState<string>('');
  const history = useHistory();
  const [shouldDisable, setShouldDisable] = useState<boolean>(false);

  // const [boardId, setBoardId] = useState<number>(parseInt(params.id, 10));

  // State for the file
  const [file, setFile] = useState<File | null>(null);

  const uploadPhoto = (fileSumbitEvent: React.FormEvent<Element>) => {
    console.log('uploadPhoto');
    fileSumbitEvent.preventDefault();

    if(!label) return;
    setShouldDisable(true);

    // if (!file) return;
    // Create a form data object using the FormData API
    let formData = new FormData();
    if (file) {
      formData.append('image[docs][image]', file);
    }
    formData.append('image[label]', label);
    console.log("About to save image", formData)
    // Send the form data to the server
    saveImage(formData);
  };

  const saveImage = async (formData: FormData) => {
    let result
    if(props.board) {
      formData.append('board[id]', props.board.id);
      result = await createImage(formData, props.board.id);
    } else {
      result = await createImage(formData);
    }

    if (result.error) {
      console.error('Error:', result.error);
      return result;
    } else {
      if(props.board) {
        history.push(`/boards/${props.board.id}`);
      } else {
        history.push('/images');
      }
      if(props.onCloseModal) props.onCloseModal();
      window.location.reload();
    }
  };

  const onFileChange = (ev: any) => {
    const newFile = ev.target.files[0];
    if (!newFile) return;
    setFile(newFile);
  }

  const handleLabelChange = (event: CustomEvent) => {
    setLabel(event.detail.value);
  };


  useEffect(() => {
    console.log('FileUploadForm useEffect', label);
  } , [label]);
  return (
    <IonCard>
    <IonCardHeader>
      <IonCardTitle>Upload a new image</IonCardTitle>
    </IonCardHeader>

    <IonCardContent>
        <form onSubmit={uploadPhoto} encType="multipart/form-data">
          <IonItem>
          <IonLabel position="stacked" id='label-label'>Label</IonLabel>
            <IonInput
              value={label}
              onIonInput={handleLabelChange}
              type="text"
              required
            />
          </IonItem>
          <IonLabel position="stacked" id="upload-label">File Upload</IonLabel>
          <IonItem>
          <input className='text-black' type="file" onChange={ev => onFileChange(ev)}></input>
            </IonItem>

          <IonButton type="submit" expand="block" className="mt-4" hidden={!label} disabled={shouldDisable}>
            Submit
          </IonButton>
        </form>
        </IonCardContent>
        </IonCard>

  );
};

export default FileUploadForm;

