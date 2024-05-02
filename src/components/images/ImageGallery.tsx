// ImageGallery.tsx
import React, { useEffect, useRef } from "react";
import { useHistory } from "react-router";
import { Image, ImageGalleryProps } from "../../data/images";
import ImageGalleryItem from "./ImageGalleryItem"; // Adjusted to handle its own ActionList visibility
import { useCurrentUser } from "../../hooks/useCurrentUser";

const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  board,
  setShowIcon,
  inputRef,
  gridSize,
  disableActionList,
}) => {
  const gridRef = useRef<HTMLDivElement>(null);

  const resizeGrid = () => {
    const imagesCount = images.length;

    // Calculate the number of columns based on the viewport width and the square root of the number of images.
    // This aims to achieve a balance between the number of rows and columns.
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const optimalSize = Math.sqrt(
      (viewportWidth * viewportHeight) / imagesCount
    );
    const cols = Math.floor(viewportWidth / optimalSize);

    const gridTarget = gridRef.current
      ? (gridRef.current as HTMLElement)
      : null;
    if (!gridTarget) return;

    const adjustedHeight = `calc(100vh - 60px)`; // Adjust as needed
    const adjustedWidth = `calc(100vw)`; // Adjust as needed

    gridTarget.style.height = adjustedHeight;
    gridTarget.style.width = adjustedWidth;
    gridTarget.style.display = "grid";

    if (gridSize) {
      gridTarget.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
      return;
    }

    if (board?.number_of_columns) {
      gridTarget.style.gridTemplateColumns = `repeat(${board.number_of_columns}, 1fr)`;
      return;
    }

    // Adjust the grid template to fit the calculated number of columns
    // Each column width is set to '1fr' to distribute the space evenly
    gridTarget.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

    // There's no need to set the gridTemplateRows in this approach because the height of each row will automatically adjust to the content
  };

  useEffect(() => {
    resizeGrid();
    // window.addEventListener("resize", resizeGrid);
    // return () => window.removeEventListener("resize", resizeGrid);
  }, [images, gridSize]);

  return (
    <div className="gallery-container">
      <div className="grid grid-cols-4 gap-2" ref={gridRef}>
        {images.map((image, index) => (
          <ImageGalleryItem
            key={image.id}
            image={image}
            board={board}
            setShowIcon={setShowIcon}
            inputRef={inputRef}
            disableActionList={disableActionList}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
