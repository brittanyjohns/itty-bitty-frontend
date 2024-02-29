import React from "react";
import { Image } from "../data/images";
import { IonImg, IonPage } from "@ionic/react";
interface ImageProps {
  label: string;
  category: string;
  private: boolean;
  ai_generated: boolean;
  url: string;
  user_id: string;
}
const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

function ImageItem(props: ImageProps) {
  return (
    <IonPage style={styles.container}>
      <IonImg
        style={styles.image}
        src="https://picsum.photos/seed/696/3000/2000"
      />
    </IonPage>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    flex: 1,
    width: "100%",
    backgroundColor: "#0553",
  },
};

export default ImageItem;
