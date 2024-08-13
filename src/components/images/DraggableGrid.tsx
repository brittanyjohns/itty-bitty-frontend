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
    console.log("Layout changed: ", layout);
    console.log("screenSize: ", screenSize);
  };

  // console.log("Board layout: ", boardLayout);
  // console.log("screenSize: ", screenSize);
  // boardLayout[screenSize][img.id]
  return (
    <ResponsiveGridLayout
      className="layout"
      breakpoints={{ lg: 1000, md: 800, sm: 600 }}
      // cols={boardLayout}
      cols={
        board
          ? {
              lg: board.large_screen_columns,
              md: board.medium_screen_columns,
              sm: board.small_screen_columns,
              xs: 4,
              xxs: 2,
            }
          : { lg: 4, md: 3, sm: 3, xs: 1, xxs: 1 }
      }
      width={width}
      rowHeight={rowHeight}
      onLayoutChange={handleLayoutChange}
      // margin={[5, 5]}
      compactType={compactType}
      preventCollision={false}
      onBreakpointChange={(newBreakpoint, newCols) => {
        console.log("Breakpoint change: ", newBreakpoint, newCols);
      }}
    >
      {images.map((img: any, index: number) => (
        <div
          key={Number(img.id)}
          data-grid={{
            ...img.layout[screenSize],
            // x: img.layout.x,
            // y: img.layout.y,
            // w: img.layout.w,
            // h: img.layout.h,
            // ...boardLayout[screenSize][img.id],
            // minW: img.layout.minW,
            // layout: img.layout,
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
