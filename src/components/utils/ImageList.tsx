import React, { useEffect, useState } from "react";
import { Image } from "../../data/images";
import ImageGalleryItem from "../images/ImageGalleryItem";
import { set } from "d3";

interface ImageListProps {
  images: Image[];
  columns: number;
}

const ImageList: React.FC<ImageListProps> = ({ images, columns }) => {
  const [imgRef, setImgRef] = useState<HTMLDivElement | null>(null);

  const listRef = React.createRef<HTMLDivElement>();
  const [numOfColumns, setNumOfColumns] = useState(8);
  const [gridClasses, setGridClasses] = useState<string | null>(null);

  // Set numOfColumns and grid classes when columns prop changes
  useEffect(() => {
    console.log("ImageList", columns);
    switch (columns) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 6:
      case 7:
      case 8:
      case 11:
        setNumOfColumns(columns);
        break;
      case 5:
      case 9:
      case 10:
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

  return (
    <div className={`${gridClasses}`} ref={listRef}>
      {images?.length > 0 ? (
        images.map((img, index) => (
          <ImageGalleryItem
            key={index + img.id}
            image={img}
            setImgRef={(element: HTMLDivElement) => {
              setImgRef(element);
            }}
          />
        ))
      ) : (
        <div className="text-center text-gray-500 text-lg col-span-3"></div>
      )}
    </div>
  );
};

export default ImageList;
