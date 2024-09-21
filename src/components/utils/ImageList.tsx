import React, { useEffect, useState } from "react";
import { Image } from "../../data/images";
import ImageGalleryItem from "../images/ImageGalleryItem";
interface ImageListProps {
  images: Image[];
}
const ImageList: React.FC<ImageListProps> = ({ images }) => {
  const [imgRef, setImgRef] = useState<HTMLDivElement | null>(null);
  return (
    <div className="grid grid-cols-6 md:grid-cols-12 lg:grid-cols-12 xl:grid-cols-16 gap-1 pb-1">
      {images.map((img, index) => (
        <ImageGalleryItem
          key={index}
          image={img}
          setImgRef={(element: HTMLDivElement) => {
            setImgRef(element);
          }}
        />
      ))}
    </div>
  );
};

export default ImageList;
