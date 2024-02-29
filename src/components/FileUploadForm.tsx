// Import necessary components and hooks
import React, { useState } from 'react';
import { IonPage, IonContent, IonInput, IonButton, IonItem, IonLabel } from '@ionic/react';
import { createImage } from '../data/images';
import { save } from 'ionicons/icons';
import { useHistory } from 'react-router';

const FileUploadForm: React.FC = () => {
  // State for the label
  const [label, setLabel] = useState<string>('');

  // State for the file
  const [file, setFile] = useState<File | null>(null);

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
    console.log('file', file);
    if (!file) return;
    // Create a form data object using the FormData API
    let formData = new FormData();
    formData.append('image', file, file.name);
    formData.append('label', label);
    // Send the form data to the server
    const result = saveImage(formData);
    console.log('result', result);
  };

  const saveImage = async (formData: FormData) => {
    const result = await createImage(formData);
    console.log('Save Result:', result);
    return result;
  };

  return (
    <IonPage>
      <IonContent className="flex items-center justify-center h-full">
        <form onSubmit={uploadPhoto} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
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
            <input
              type="file"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-violet-50 file:text-violet-700
              hover:file:bg-violet-100"
              required
            />
          </IonItem>

          <IonButton type="submit" expand="block" className="mt-4">
            Submit
          </IonButton>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default FileUploadForm;
