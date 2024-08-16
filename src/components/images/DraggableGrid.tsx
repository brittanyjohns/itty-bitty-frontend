import GridLayout, { WidthProvider } from "react-grid-layout";
import { Responsive as ResponsiveGridLayoutTemp } from "react-grid-layout";

const ResponsiveGridLayout = WidthProvider(ResponsiveGridLayoutTemp);
import React, { useEffect, useState } from "react";

import "./../main.css";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import ImageGalleryItem from "./ImageGalleryItem";
import { Board, updateBoard } from "../../data/boards";
import { Image } from "../../data/images";
import { ChildBoard } from "../../data/child_boards";
import { useCurrentUser } from "../../contexts/UserContext";

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
  setCurrentLayout?: any;
  updateScreenSize?: any;
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
  setCurrentLayout,
  updateScreenSize,
}) => {
  const [width, setWidth] = useState(window.innerWidth);
  const [rowHeight, setRowHeight] = useState(180);
  const { screenSize } = useCurrentUser();
  const updateRowHeight = () => {
    const adjustWidth = width - 50;
    const dynamicRowHeight = Math.floor(adjustWidth / columns);
    setRowHeight(dynamicRowHeight);
  };
  const [boardLayout, setBoardLayout] = useState(board?.layout);
  useEffect(() => {
    updateRowHeight();
  }, [width, columns]);

  useEffect(() => {
    console.log("Columns changed: ", columns);
  }, [columns]);

  useEffect(() => {
    console.log("Board changed: ", board);
    if (board) {
      setBoardLayout(board.layout);
    }
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

  const handleLayoutChange = (layout: any) => {
    if (onLayoutChange) {
      onLayoutChange(layout);
    }
    if (setCurrentLayout) {
      setCurrentLayout(layout);
    }
  };
  return (
    <ResponsiveGridLayout
      className="layout"
      breakpoints={{ lg: 1200, md: 800, sm: 600 }}
      // cols={boardLayout}
      cols={
        board
          ? {
              lg: board.large_screen_columns || 4,
              md: board.medium_screen_columns || 3,
              sm: board.small_screen_columns || 3,
              xs: 4,
              xxs: 2,
            }
          : { lg: 4, md: 3, sm: 3, xs: 1, xxs: 1 }
      }
      width={width}
      rowHeight={rowHeight}
      onLayoutChange={handleLayoutChange}
      // margin={[5, 5]}
      // margin={{
      // lg: [10, 10],
      // md: [0, 0],
      // sm: [0, 20],
      // xs: [10, 10],
      // xxs: [10, 10],
      // }}
      compactType={compactType}
      preventCollision={false}
      onBreakpointChange={(newBreakpoint, newCols) => {
        console.log("Breakpoint change: ", newBreakpoint, newCols);
        if (updateScreenSize) {
          updateScreenSize(newBreakpoint, newCols);
        }
      }}
    >
      {images.map((img: any, index: number) => (
        <div
          key={Number(img.id)}
          data-grid={{
            ...img.layout[screenSize],
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
