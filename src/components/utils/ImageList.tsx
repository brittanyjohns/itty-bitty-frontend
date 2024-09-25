import React, { useEffect, useState } from "react";
import { Image } from "../../data/images";
import ImageGalleryItem from "../images/ImageGalleryItem";
import { list } from "ionicons/icons";

interface ImageListProps {
  images: Image[];
  columns: number;
}

const ImageList: React.FC<ImageListProps> = ({ images, columns }) => {
  const [imgRef, setImgRef] = useState<HTMLDivElement | null>(null);

  const listRef = React.createRef<HTMLDivElement>();
  const [numOfColumns, setNumOfColumns] = useState(columns);
  const [gridClasses, setGridClasses] = useState<string | null>(null);

  // Set numOfColumns and grid classes when columns prop changes
  useEffect(() => {
    console.log("ImageList", columns);
    if (columns > 8) {
      // grid-template-columns: repeat(11, minmax(0, 1fr));
      setNumOfColumns(8);

      // listRef.current?.classList.add("grid-cols-11");
    } else {
      setNumOfColumns(columns);
      // listRef.current?.classList.remove("grid-cols-11");
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
