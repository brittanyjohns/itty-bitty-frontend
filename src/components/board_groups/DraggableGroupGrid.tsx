import GridLayout, { WidthProvider } from "react-grid-layout";

const ResponsiveGridLayout = WidthProvider(GridLayout);
import React, { useEffect, useState } from "react";

import "./../main.css";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { Board, updateBoard } from "../../data/boards";
import BoardGalleryItem from "./BoardGalleryItem";
import { BoardGroup, updateBoardGroup } from "../../data/board_groups";
import { useHistory } from "react-router";

interface DraggableGroupGridProps {
  columns: number;
  boards: any;
  onLayoutChange?: any;
  disableReorder?: boolean;
  enableResize?: boolean;
  boardGroup?: BoardGroup;
  setShowIcon?: any;
  inputRef?: any;
  mute?: boolean;
  onPlayAudioList?: any;
  onBoardClick?: any;
  viewOnClick?: boolean;
  showRemoveBtn?: boolean;
  viewLockOnClick?: boolean;
}
const DraggableGroupGrid: React.FC<DraggableGroupGridProps> = ({
  boards,
  onLayoutChange,
  columns,
  disableReorder,
  enableResize,
  boardGroup,
  setShowIcon,
  inputRef,
  mute,
  onPlayAudioList,
  onBoardClick,
  viewOnClick,
  showRemoveBtn,
  viewLockOnClick,
}) => {
  const [width, setWidth] = useState(window.innerWidth);
  const [rowHeight, setRowHeight] = useState(180);
  const history = useHistory();
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

  const handleSetDisplayBoard = async (
    boardGroup: BoardGroup,
    board: Board
  ) => {
    if (boardGroup && board) {
      boardGroup.display_image_url = board.display_image_url;
      const response = await updateBoardGroup(boardGroup);
      history.push(`/board-groups/${boardGroup.id}`);
    }
  };

  return (
    <ResponsiveGridLayout
      className="layout"
      cols={columns}
      width={width}
      rowHeight={rowHeight}
      onLayoutChange={onLayoutChange}
      margin={[10, 5]}
    >
      {boards &&
        boards.map((board: Board, index: number) => (
          <div
            key={Number(board.id)}
            data-grid={{
              ...board.layout,
              isResizable: enableResize,
              isBounded: true,
              allowOverlap: false,
              static: disableReorder,
            }}
            className={`relative items-center cursor-pointer`}
          >
            <BoardGalleryItem
              key={index}
              board={board}
              boardGroup={boardGroup}
              setShowIcon={setShowIcon}
              inputRef={inputRef}
              mute={mute}
              onPlayAudioList={onPlayAudioList}
              onBoardClick={onBoardClick}
              viewOnClick={viewOnClick}
              viewLockOnClick={viewLockOnClick}
              showRemoveBtn={showRemoveBtn}
              onSetDisplayBoard={handleSetDisplayBoard}
            />
          </div>
        ))}
    </ResponsiveGridLayout>
  );
};

export default DraggableGroupGrid;
