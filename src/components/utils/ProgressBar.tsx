import React, { useEffect, useState } from "react";
import { IonProgressBar } from "@ionic/react";
interface ProgressBarProps {
  progressToSet: number;
}
const ProgressBar: React.FC<ProgressBarProps> = ({ progressToSet }) => {
  const [buffer, setBuffer] = useState(0.06);

  const [progress, setProgress] = useState(progressToSet);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     console.log("progress", progress);
  //     setProgress((prevProgress) => prevProgress + 0.08);
  //   }, 100); // 50ms

  //   return () => clearInterval(interval);
  // }, []);
  // useEffect(() => {
  //   setProgress(progressToSet);
  // }, [progressToSet]);

  // if (progress > 1) {
  //   setTimeout(() => {
  //     setProgress(0);
  //   }, 1000); // Reset progress bar after 1 second
  // }

  useEffect(() => {
    const interval = setInterval(() => {
      setBuffer((prevBuffer) => prevBuffer + 0.06);
      setProgress((prevProgress) => prevProgress + 0.06);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (progress > 1) {
    setTimeout(() => {
      setBuffer(0.06);
      setProgress(0);
    }, 1000);
  }

  return <IonProgressBar value={progress}></IonProgressBar>;
};
export default ProgressBar;
