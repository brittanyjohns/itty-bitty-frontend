import React, { useState, useEffect } from "react";
// import { Button, Image, View, Platform } from "react-native";
import { IonButton, IonIcon, IonImg, IonInput, IonPage, IonText } from "@ionic/react";
import { camera, save } from "ionicons/icons";
// import * as ImagePicker from "expo-image-picker";

export default function ImageFilePicker(props: {
  onSelection: (image: string) => void;
}) {
  const [image, setImage] = useState<string | null>(null);

  const openFileDialog = () => {
    (document as any).getElementById("file-upload").click();
 };
 
 const setImageFile = (_event: any) => {
   let f = _event.target.files![0];
    setImage(URL.createObjectURL(f) as string);
   console.log(f)
 }

  const saveImage = () => {
    props.onSelection(image!);
  }
  

  function setLabel(newLabel: React.FormEvent<HTMLIonInputElement>): void {
    throw new Error("Function not implemented.");
  }

  return (
    <IonPage style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      {/* <View>
          <View >
            <Text>Label</Text>
            <TextInput
              style={styles.input}
              onChangeText={(newLabel) => setLabel(newLabel)}
            />
            <Text>Category</Text>
            <TextInput
              style={styles.input}
              onChangeText={(newCategory) => setCategory(newCategory)}
            />
            <Button
              onPress={() => {
                handleSubmit({ preventDefault: () => {} });
              }}
              title="Submit"
              color="#841584"
              aria-label="Submit"
            />
          </View>
        </View> */}
          <IonPage >
            <IonInput placeholder="Label" />
            <input type="file" id="file-upload" onChange={setImageFile} style={{ display: "none" }} />
            <IonButton onClick={openFileDialog}>
              <IonIcon icon={camera} slot="start" />
              Select Image
            </IonButton>
            <IonButton onClick={saveImage}>
              <IonIcon icon={save} slot="start" />
              Save Image
            </IonButton>
            <IonText>{image}</IonText>
            <IonInput onChange={(newLabel) => setLabel(newLabel)} />
          </IonPage>

      {image && (
        <IonImg src={image} style={{ width: 200, height: 200 }} />
      )}
    </IonPage>
  );
}
