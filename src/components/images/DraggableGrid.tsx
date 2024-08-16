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
  screenSize?: string;
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
  screenSize,
}) => {
  const [width, setWidth] = useState(window.innerWidth);
  const [rowHeight, setRowHeight] = useState(180);

  const [currentNumberOfColumns, setCurrentNumberOfColumns] = useState(columns);
  // const [boardLayout, setBoardLayout] = useState(board?.layout);
  const [currentScreenSize, setCurrentScreenSize] = useState(screenSize);
  // useEffect(() => {
  //   updateRowHeight();
  //   console.log("rowHeight: ", rowHeight);
  // }, [width, currentNumberOfColumns, rowHeight]);

  // useEffect(() => {
  //   console.log("on load rowHeight: ", rowHeight);
  //   const handleResize = () => {
  //     const currentWidth = window.innerWidth;
  //     setWidth(currentWidth);
  //     console.log("Columns: ", currentNumberOfColumns);
  //     console.log("Current width: ", currentWidth);
  //     // (rowHeight * h) + (marginH * (h - 1)
  //     const testExample = rowHeight * 1 + 10 * (1 - 1);
  //     console.log("Test example: ", testExample);
  //     const adjustWidth = currentWidth - 0;
  //     const dynamicRowHeight = Math.floor(adjustWidth / columns);
  //     console.log("Dynamic row height: ", dynamicRowHeight);
  //     setRowHeight(dynamicRowHeight);
  //   };

  //   window.addEventListener("resize", handleResize);

  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, []);

  useEffect(() => {
    const dynamicRowHeight = rowHeight * 1 + 10 * currentNumberOfColumns;
    console.log("Dynamic row height: ", dynamicRowHeight);
  }, [currentNumberOfColumns]);

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
      breakpoints={{ lg: 1200, md: 996, sm: 768 }}
      margin={{
        lg: [5, 60],
        md: [5, 20],
        sm: [5, 10],
      }}
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
      compactType={compactType}
      preventCollision={false}
      onBreakpointChange={(newBreakpoint, newCols) => {
        setCurrentNumberOfColumns(newCols);
        setCurrentScreenSize(newBreakpoint);
        if (updateScreenSize) {
          updateScreenSize(newBreakpoint, newCols);
        }
      }}
    >
      {images.map((img: any, index: number) => (
        <div
          key={Number(img.id)}
          data-grid={{
            ...img.layout[currentScreenSize ?? "lg"],
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
            rowHeight={rowHeight}
          />
        </div>
      ))}
    </ResponsiveGridLayout>
  );
};

export default DraggableGrid;
