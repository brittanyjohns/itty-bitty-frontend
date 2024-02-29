// Import necessary components and hooks
import React, { useState } from 'react';
import { IonPage, IonContent, IonInput, IonButton, IonItem, IonLabel } from '@ionic/react';
import { createImage } from '../data/images';
import { save } from 'ionicons/icons';
import { useHistory } from 'react-router';

const FileUploadForm: React.FC = () => {
  // State for the label
  const [label, setLabel] = useState<string>('');
    const history = useHistory();

  // State for the file
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<FormData | null>( new FormData());

  // Handle file change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (!fileList) return;
    setFile(fileList[0]); // Set the first file
  };

  // Handle form submission
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault(); // Prevent default form submission
    // createImage({ label, file });
    uploadPhoto(event);
    // Process your form data here. For example, you can send it to a server.
    console.log({ label, file });
  };
  const uploadPhoto = (fileSumbitEvent: React.FormEvent<Element>) => {
    fileSumbitEvent.preventDefault();
    console.log('uploadPhoto');
    // Get a reference to the file that has just been added to the input
    // const fileInput = fileSumbitEvent.target as HTMLInputElement;
    // const file = fileInput.files?.item(0);
    if (!file) return;
    if (!formData) return;
    // Create a form data object using the FormData API
    // let formData = new FormData();
    formData.append('image[docs][image]', file);
    formData.append('image[label]', label);
    console.log('formData', formData);
    // Send the form data to the server
    const result = saveImage(formData);
  };

  const saveImage = async (formData: FormData) => {
    const result = await createImage(formData);
    console.log('Save Result:', result);
    if (result.error) {
      console.error('Error:', result.error);
      return result;
    } else {
      history.push('/home');
      return result;
    }
  };

  const onFileChange = (ev: any) => {
    console.log('onFileChange', ev);
    const newFile = ev.target.files[0];
    console.log('newFile', newFile);
    console.log('formData', formData);
    if (!formData) return;
    // formData.append('doc[image]', newFile);
    // formData.append('image[image]', newFile);
    setFile(newFile);
    console.log('file', file);
    // formData.append('image[label]', label);
    for(var pair of formData.entries()) {
        console.log("Pair", pair[0]+', '+pair[1]);
    }
  }
  return (
    <IonPage>
      <IonContent className="flex items-center justify-center h-full">
        <form onSubmit={uploadPhoto} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" encType="multipart/form-data">

          <IonItem>
            <IonLabel position="floating">Label</IonLabel>
            <IonInput
              value={label}
              onIonChange={(e) => setLabel(e.detail.value!)}
              type="text"
              required
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">File Upload</IonLabel>
          <input type="file" onChange={ev => onFileChange(ev)}></input>
\          </IonItem>

          <IonButton type="submit" expand="block" className="mt-4">
            Submit
          </IonButton>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default FileUploadForm;
