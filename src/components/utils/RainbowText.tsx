import React from "react";

// Array of colors for the rainbow effect
const rainbowColors = [
  "#FF0000", // Red
  "#FF7F00", // Orange
  //   "#FFFF00", // Yellow
  //   "#00FF00", // Green
  "#0000FF", // Blue
  //   "#4B0082", // Indigo
  "#8B00FF", // Violet
];

interface RainbowTextProps {
  text: string;
}

const RainbowText: React.FC<RainbowTextProps> = ({ text }) => {
  return (
    <span className="p-1">
      {text.split("").map((char, index) => (
        <span
          key={index}
          style={{ color: rainbowColors[index % rainbowColors.length] }}
        >
          {char}
        </span>
      ))}
    </span>
  );
};

export default RainbowText;
