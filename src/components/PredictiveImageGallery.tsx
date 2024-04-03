import React, { useEffect, useRef, useState } from "react";
import ImageComponent from "./ImageComponent";
import { PredictiveImage, getPredictiveImages } from "../data/images";
import { get } from "react-hook-form";
import { TextToSpeech } from "@capacitor-community/text-to-speech";

interface PredictiveImageGalleryProps {
  initialImages: PredictiveImage[];
}

const PredictiveImageGallery: React.FC<PredictiveImageGalleryProps> = ({
  initialImages,
}) => {
  const [currentImages, setCurrentImages] =
    useState<PredictiveImage[]>(initialImages);
  const inputRef = useRef<HTMLIonInputElement>(null);
  const [showIcon, setShowIcon] = useState(false);

  const handleImageClick = async (image: PredictiveImage) => {
    const newImages = await getPredictiveImages(image.id);
    console.log("newImages", newImages);
    setCurrentImages(newImages);
  };
  const handleImageSpeak = (image: PredictiveImage) => {
    const audioSrc = image.audio;
    const label = image.label;
    if (inputRef.current) {
      inputRef.current.value += ` ${label}`;
    }
    if (inputRef.current?.value) {
      setShowIcon(true);
    } else {
      setShowIcon(false);
    }

    if (!audioSrc) {
      speak(label);
      return;
    }
    // setAudioList([...audioList, audioSrc as string]);
    const audio = new Audio(audioSrc);
    audio.play();
  };

  const speak = async (text: string) => {
    await TextToSpeech.speak({
      text: text,
      lang: "en-US",
      rate: 1.0,
      pitch: 1.0,
      volume: 1.0,
      category: "ambient",
    });
  };

  useEffect(() => {
    setCurrentImages(initialImages);
  }, [initialImages]);

  return (
    <div className="grid grid-cols-4 gap-4">
      {currentImages.map((image, index) => (
        <div
          key={image.id}
          onClick={() => handleImageClick(image)}
          className="cursor-pointer"
        >
          <ImageComponent label={image.label} src={image.src} />
        </div>
      ))}
    </div>
  );
};

export default PredictiveImageGallery;
