import GridLayout, { WidthProvider } from "react-grid-layout";

const ResponsiveGridLayout = WidthProvider(GridLayout);
import React, { useEffect, useState } from "react";

import "./main.css";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import ImageGalleryItem from "./ImageGalleryItem";
import { Board } from "../data/boards";
interface DraggableGridProps {
  columns: number;
  images: any;
  onLayoutChange?: any;
  disableReorder?: boolean;
  board?: Board;
  setShowIcon?: any;
  inputRef?: any;
  disableActionList?: boolean;
  mute?: boolean;
}
const DraggableGrid: React.FC<DraggableGridProps> = ({
  images,
  onLayoutChange,
  columns,
  disableReorder,
  board,
  setShowIcon,
  inputRef,
  disableActionList,
  mute,
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
      const adjustWidth = width - 100;
      const dynamicRowHeight = Math.floor(adjustWidth / columns);
      setRowHeight(dynamicRowHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <ResponsiveGridLayout
      className="layout"
      cols={columns}
      width={width}
      rowHeight={rowHeight}
      onLayoutChange={onLayoutChange}
    >
      {images.map((img: any, index: number) => (
        <div
          key={img.layout.i}
          data-grid={{
            ...img.layout,
            isResizable: false,
            isBounded: true,
            allowOverlap: false,
            static: disableReorder,
          }}
          className="relative cursor-pointer"
        >
          <ImageGalleryItem
            key={index}
            image={img}
            board={board}
            setShowIcon={setShowIcon}
            inputRef={inputRef}
            disableActionList={disableActionList}
            mute={mute}
          />
        </div>
      ))}
    </ResponsiveGridLayout>
  );
};

export default DraggableGrid;
