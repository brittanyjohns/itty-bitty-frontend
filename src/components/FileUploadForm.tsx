// Import necessary components and hooks
import React, { useEffect, useState } from 'react';
import { IonInput, IonButton, IonItem, IonLabel, useIonViewWillEnter, useIonViewDidEnter, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonText } from '@ionic/react';
import { createImage } from '../data/images';
import { useHistory } from 'react-router';
import { Board } from '../data/boards';
import { set } from 'react-hook-form';
interface IMyProps {
  board: Board | undefined,
  onCloseModal: any,
  showLabel: boolean,
  existingLabel?: string
}
const FileUploadForm: React.FC<IMyProps> = (props: IMyProps) => {
  const [label, setLabel] = useState<string>('');
  const history = useHistory();
  const [shouldDisable, setShouldDisable] = useState<boolean>(false);
  const [hideLabel, setHideLabel] = useState<boolean>(false);

  // State for the file
  const [file, setFile] = useState<File | null>(null);

  const uploadPhoto = (fileSumbitEvent: React.FormEvent<Element>) => {
    console.log('uploadPhoto');
    fileSumbitEvent.preventDefault();

    if (!label) return;
    setShouldDisable(true);

    // Create a form data object using the FormData API
    let formData = new FormData();
    if (file) {
      formData.append('image[docs][image]', file);
    }
    formData.append('image[label]', label);
    // Send the form data to the server
    saveImage(formData);
  };

  const saveImage = async (formData: FormData) => {
    let result
    if (props.board) {
      if (props.board && props.board.id) {
        formData.append('board[id]', props.board.id);
      }
      result = await createImage(formData, props.board.id);
    } else {
      result = await createImage(formData);
    }

    if (result.error) {
      console.error('Error:', result.error);
      return result;
    } else {
      if (props.board) {
        history.push(`/boards/${props.board.id}`);
      } else {
        history.push(`/images/${result.id}`);
      }
      if (props.onCloseModal) props.onCloseModal();
      // window.location.reload();
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

  useIonViewWillEnter(() => {
    setHideLabel(!props.showLabel);
    console.log('props0', props);
    if (props.existingLabel) {
      console.log('existingLabel', props.existingLabel);
      setLabel(props.existingLabel);
      setShouldDisable(false);
    }
  });
  useEffect(() => {
    if (props.existingLabel) {
      console.log('existingLabel', props.existingLabel);
      setLabel(props.existingLabel);
      setHideLabel(true);
      setShouldDisable(false);
    }
  } , []);

  return (
    <form onSubmit={uploadPhoto} encType="multipart/form-data" className='p-2 bg-gray-100 border'>
      <IonText className='text-lg'>Upload your own image</IonText>
        <IonInput
          value={label}
          placeholder='Label'
          onIonChange={handleLabelChange} // Changed from onIonInput to onIonChange
          type="text"
          aria-label="Label"
          className={`pl-4 ${hideLabel ? 'hidden' : ''}`} // Simplified conditional class application
          required={!hideLabel}
        />
        <div className="flex items-center"> {/* Add this wrapper */}
          <input type="file" onChange={ev => onFileChange(ev)} className="text-sm rounded-md flex-grow mr-2"/> {/* Adjusted classes for flex layout */}
          <IonButton type="submit" disabled={shouldDisable} className="flex-shrink-0">
            {props.showLabel ? 'Save' : 'Upload'}
          </IonButton>
        </div>
    </form>
);
};

export default FileUploadForm;

