import { WidthProvider } from "react-grid-layout";
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
import { set } from "d3";

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
  setShowLoading: any;
  showLoading?: boolean;
  setBoard?: any;
  xMargin: number;
  yMargin: number;
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
  setShowLoading,
  setBoard,
  xMargin,
  yMargin,
}) => {
  const [width, setWidth] = useState(window.innerWidth);
  const [rowHeight, setRowHeight] = useState(0);
  const [imgRef, setImgRef] = useState<HTMLDivElement | null>(null);

  const [currentNumberOfColumns, setCurrentNumberOfColumns] = useState(columns);
  // const [boardLayout, setBoardLayout] = useState(board?.layout);
  const [currentScreenSize, setCurrentScreenSize] = useState(screenSize);
  // const initialMarginSettings: [number, number] | null = [
  //   xMargin ?? 0,
  //   yMargin ?? 0,
  // ];
  // const [marginSettings, setMarginSettings] = useState<
  //   [number, number] | undefined
  // >(initialMarginSettings);
  useEffect(() => {
    updateRowHeight();
  }, [width, currentNumberOfColumns, rowHeight]);

  useEffect(() => {
    if (xMargin !== undefined && yMargin !== undefined) {
    } else {
    }
  }, [xMargin, yMargin, currentScreenSize]);

  const updateRowHeight = () => {
    const adjustWidth = width + 5;
    const dynamicRowHeight = Math.floor(adjustWidth / currentNumberOfColumns);
    setRowHeight(dynamicRowHeight);
  };

  useEffect(() => {
    if (imgRef) {
      const width = imgRef.clientWidth;
      setRowHeight(width);
      updateRowHeight();
    }
  }, [imgRef]);

  const handleSetDisplayImage = async (image: Image) => {
    setShowLoading(true);
    if (board) {
      const updatingBoard: Board | ChildBoard = {
        ...board,
        display_image_url: image.src,
      };

      const savedBoard = await updateBoard(updatingBoard);
      setShowLoading(false);
      setBoard(savedBoard);
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

  const handleBreakpointChange = (newBreakpoint: string, newCols: number) => {
    setCurrentScreenSize(newBreakpoint);
    setCurrentNumberOfColumns(newCols);
    if (updateScreenSize) {
      updateScreenSize(newBreakpoint);
    }
  };
  return (
    <ResponsiveGridLayout
      className="layout"
      breakpoints={{ lg: 769, md: 600, sm: 599 }}
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
      margin={[xMargin, yMargin]}
      preventCollision={preventCollision}
      onBreakpointChange={(newBreakpoint, newCols) => {
        handleBreakpointChange(newBreakpoint, newCols);
      }}
    >
      {images.map((img: any, index: number) => (
        <div
          key={img.id}
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
            setRowHeight={setRowHeight}
            setImgRef={(element: HTMLDivElement) => {
              setImgRef(element);
            }}
          />
        </div>
      ))}
    </ResponsiveGridLayout>
  );
};

export default DraggableGrid;
