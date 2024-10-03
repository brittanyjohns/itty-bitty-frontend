import React, { useEffect, useState } from "react";
import { Image } from "../../data/images";
import ImageGalleryItem from "../images/ImageGalleryItem";

interface ImageListProps {
  images: Image[];
  columns: number;
  inputRef?: any;
  audioList: string[];
  setAudioList: any;
  setSelectedImages: any;
}

const ImageList: React.FC<ImageListProps> = ({
  images,
  columns,
  audioList,
  setAudioList,
  inputRef,
  setSelectedImages,
}) => {
  const listRef = React.createRef<HTMLDivElement>();
  const [numOfColumns, setNumOfColumns] = useState(8);
  const [gridClasses, setGridClasses] = useState<string | null>(null);
  const [currentImages, setCurrentImages] = useState<Image[]>(images);

  const afterRemoveFromList = (image: Image) => {
    const labelToRemove = image.label;
    const audioToRemove = image.audio;
    const newAudioList = audioList.filter((audio) => audio !== audioToRemove);
    setAudioList(newAudioList);
    if (!inputRef.current || !inputRef.current.value) {
      return;
    }
    if (typeof inputRef.current.value === "string") {
      const valWithSpace = inputRef.current?.value.replaceAll(
        `${labelToRemove} `,
        ""
      );
      const valWithout = inputRef.current?.value.replaceAll(labelToRemove, "");
      const newVal =
        valWithSpace?.length < valWithout?.length ? valWithSpace : valWithout;

      inputRef.current.value = newVal;
    }
  };

  const onImageClick = (image: Image) => {
    const newImages = currentImages.filter((img) => img.id !== image.id);
    setCurrentImages(newImages);
    setSelectedImages(newImages);
    afterRemoveFromList(image);
    return;
  };
  useEffect(() => {
    switch (columns) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 7:
      case 8:
        setNumOfColumns(columns);
        break;
      case 5:
      case 6:
      case 9:
      case 10:
      case 11:
      case 12:
        setNumOfColumns(8);
        break;
      default:
        setNumOfColumns(12);
        break;
    }
  }, [columns]);

  useEffect(() => {
    setGridClasses(`grid grid-cols-${numOfColumns} gap-1`);
  }, [numOfColumns]);

  useEffect(() => {
    setCurrentImages(images);
  }, [images]);

  return (
    <div className={`${gridClasses}`} ref={listRef}>
      {currentImages?.length > 0 ? (
        currentImages.map((img, index) => (
          <ImageGalleryItem
            key={index}
            image={img}
            inputRef={inputRef}
            mute={true}
            showRemoveBtn={false}
            removeFromList={true}
            onImageClick={onImageClick}
          />
        ))
      ) : (
        <div className="text-center text-gray-500 text-lg col-span-3"></div>
      )}
    </div>
  );
};

export default ImageList;
