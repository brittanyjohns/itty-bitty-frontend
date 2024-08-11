import GridLayout, { WidthProvider } from "react-grid-layout";

const ResponsiveGridLayout = WidthProvider(GridLayout);
import React, { useEffect, useState } from "react";

import "./../main.css";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import ImageGalleryItem from "./ImageGalleryItem";
import { Board, updateBoard } from "../../data/boards";
import { Image } from "../../data/images";
import { ChildBoard } from "../../data/child_boards";

interface DraggableGridProps {
  columns: number;
  images: any;
  onLayoutChange?: any;
  disableReorder?: boolean;
  enableResize?: boolean;
  board?: Board | ChildBoard;
  setShowIcon?: any;
  inputRef?: any;
  mute?: boolean;
  onPlayAudioList?: any;
  onImageClick?: any;
  viewOnClick?: boolean;
  showRemoveBtn?: boolean;
  compactType?: any;
  preventCollision?: boolean;
}
const DraggableGrid: React.FC<DraggableGridProps> = ({
  images,
  onLayoutChange,
  columns,
  disableReorder,
  enableResize,
  board,
  setShowIcon,
  inputRef,
  mute,
  onPlayAudioList,
  onImageClick,
  viewOnClick,
  showRemoveBtn,
  compactType,
  preventCollision,
}) => {
  const [width, setWidth] = useState(window.innerWidth);
  const [rowHeight, setRowHeight] = useState(180);
  const updateRowHeight = () => {
    const adjustWidth = width - 50;
    const dynamicRowHeight = Math.floor(adjustWidth / columns);
    setRowHeight(dynamicRowHeight);
  };
  useEffect(() => {
    updateRowHeight();
  }, [width, columns]);

  useEffect(() => {
    const handleResize = () => {
      const currentWidth = window.innerWidth;
      setWidth(currentWidth);
      const adjustWidth = width - 10;
      const dynamicRowHeight = Math.floor(adjustWidth / columns);
      setRowHeight(dynamicRowHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleSetDisplayImage = async (image: Image) => {
    if (board) {
      console.log("Setting display image: ", image);
      const updatingBoard: Board | ChildBoard = {
        ...board,
        display_image_url: image.src,
      };

      const savedBoard = await updateBoard(updatingBoard);
      console.log("Saved board: ", savedBoard);
      window.location.reload();
      // alert("Response: " + savedBoard);
      // setBoard(savedBoard);
    }
  };
  return (
    <ResponsiveGridLayout
      className="layout"
      cols={columns}
      width={width}
      rowHeight={rowHeight}
      onLayoutChange={onLayoutChange}
      // margin={[5, 5]}
      compactType={compactType}
      preventCollision={preventCollision}
    >
      {images.map((img: any, index: number) => (
        <div
          key={Number(img.id)}
          data-grid={{
            ...img.layout,
            isResizable: enableResize,
            isBounded: true,
            allowOverlap: false,
            static: disableReorder,
          }}
          className={`relative items-center cursor-pointer`}
        >
          <ImageGalleryItem
            key={index}
            image={img}
            board={board}
            setShowIcon={setShowIcon}
            inputRef={inputRef}
            mute={mute}
            onPlayAudioList={onPlayAudioList}
            onImageClick={onImageClick}
            viewOnClick={viewOnClick}
            showRemoveBtn={showRemoveBtn}
            onSetDisplayImage={handleSetDisplayImage}
          />
        </div>
      ))}
    </ResponsiveGridLayout>
  );
};

export default DraggableGrid;
