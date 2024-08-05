import GridLayout, { WidthProvider } from "react-grid-layout";
import React, { useEffect, useState } from "react";
import "./../main.css";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import ImageGalleryItem from "./ImageGalleryItem";
import { Board, getBoard, updateBoard } from "../../data/boards";
import { Image } from "../../data/images";
import { get } from "react-hook-form";

const ResponsiveGridLayout = WidthProvider(GridLayout);

interface DraggableGridProps {
  columns: number;
  images: any;
  onLayoutChange?: any;
  disableReorder?: boolean;
  enableResize?: boolean;
  board?: Board;
  setShowIcon?: any;
  inputRef?: any;
  mute?: boolean;
  onPlayAudioList?: any;
  onImageClick?: any;
  viewOnClick?: boolean;
  showRemoveBtn?: boolean;
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
}) => {
  const [width, setWidth] = useState(window.innerWidth);
  const [rowHeight, setRowHeight] = useState(180);
  const [currentBoard, setCurrentBoard] = useState<Board | undefined>(board);

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
    if (currentBoard) {
      console.log("Setting display image: ", image);
      const updatingBoard: Board = {
        ...currentBoard,
        display_image_url: image.src,
      };

      const savedBoard = await updateBoard(updatingBoard);
      console.log("Saved board: ", savedBoard);
      window.location.reload();
    }
  };

  const handleImageClick = async (image: Image) => {
    console.log("Image mode: ", image);
    if (image.mode === "predictive" && image.predictive_board_id) {
      console.log("Drag - Predictive image clicked", image);
      // Fetch the new board using the predictive_board_id
      const newBoard = await fetchBoard(image.predictive_board_id);
      console.log("New board: ", newBoard);
      // Rerender the DraggableGrid with the new board
      setCurrentBoard(newBoard);
      return;
    }

    if (onImageClick) {
      onImageClick(image);
    }
  };

  const fetchBoard = async (boardId: string): Promise<Board> => {
    const response = await getBoard(boardId);
    console.log("Fetched board: ", response);
    return response;
  };

  return (
    <ResponsiveGridLayout
      className="layout"
      cols={columns}
      width={width}
      rowHeight={rowHeight}
      onLayoutChange={onLayoutChange}
      margin={[10, 2]}
    >
      {currentBoard &&
        currentBoard?.images &&
        currentBoard?.images.map((img: Image, index: number) => (
          <div
            key={Number(img.id)}
            data-grid={{
              ...img.layout,
              isResizable: enableResize,
              isBounded: true,
              allowOverlap: false,
              static: disableReorder,
            }}
            className="relative cursor-pointer"
          >
            <ImageGalleryItem
              key={index}
              image={img}
              board={currentBoard}
              setShowIcon={setShowIcon}
              inputRef={inputRef}
              mute={mute}
              onPlayAudioList={onPlayAudioList}
              onImageClick={handleImageClick}
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
