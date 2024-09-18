import React, { useEffect, useState } from "react";
import { IonContent, IonImg, IonPage, IonButton } from "@ionic/react";
interface ImageListProps {
  imageSrcList: string[];
}
const ImageList: React.FC<ImageListProps> = ({ imageSrcList }) => {
  return (
    <div className="grid grid-cols-6 md:grid-cols-12 lg:grid-cols-12 xl:grid-cols-16 gap-1 pb-2">
      {imageSrcList.map((imageSrc, index) => (
        <IonImg key={index} src={imageSrc} />
      ))}
    </div>
  );
};

export default ImageList;
