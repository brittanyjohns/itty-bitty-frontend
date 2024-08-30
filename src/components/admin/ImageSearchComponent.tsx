import { useEffect, useState, useRef } from "react";
import { ImageResult, imageSearch } from "../../data/search";
import {
  IonButton,
  IonButtons,
  IonIcon,
  IonItem,
  IonLoading,
  IonSelect,
  IonSelectOption,
  useIonViewWillLeave,
} from "@ionic/react";
import React from "react";
import { Image } from "../../data/images";
import ImageCropper from "../images/ImageCropper";
import { set } from "d3";
import { searchCircleSharp, searchSharp } from "ionicons/icons";
import { useCurrentUser } from "../../contexts/UserContext";
import { labelForScreenSize } from "../../data/utils";

const ImageSearchComponent = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [placeholder, setPlaceholder] = useState("smile");
  const [images, setImages] = useState<ImageResult[]>([]);
  const [newImageSrc, setNewImageSrc] = useState<string | null>(null);
  const [newImageLabel, setNewImageLabel] = useState<string | null>(null);
  const [imageType, setImageType] = useState<string>("clipart");
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [nextStartIndex, setNextStartIndex] = useState<number>(11);
  const { smallScreen, mediumScreen, largeScreen } = useCurrentUser();
  useIonViewWillLeave(() => {
    console.log("Leaving Search Google Images");
    resetSearch();
    setNewImageSrc(null);
    setNewImageLabel(null);
  });

  const loadInitialImages = async () => {
    const params = {
      q: placeholder,
      imgType: imageType,
      start: nextStartIndex,
      num: 10,
    };

    try {
      const imgResult = await imageSearch(placeholder, params);
      console.log("Image Search Result: ", imgResult);
      setImages(imgResult);
      setNextStartIndex(imgResult[0].startIndex);
    } catch (error) {
      console.error("Image Search Error: ", error);
      alert("Failed to load images");
    }
  };

  const handleSearch = async () => {
    if (!query) {
      alert("Please enter a search query");
      return;
    }

    setLoading(true);
    const params = {
      q: query,
      imgType: imageType,
      start: nextStartIndex,
      num: 10,
    };

    try {
      const imgResult = await imageSearch(query, params);

      if (!imgResult) {
        alert("Something went wrong. Please try again later");
        return;
      }
      setImages(imgResult);
      setNextStartIndex(imgResult[0].startIndex);
    } catch (error) {
      console.error("Image Search Error: ", error);
      alert("Failed to load images");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query) {
    } else {
      setImages([]);
      setPlaceholder("smile");
      loadInitialImages();
    }
  }, []);

  const handleClick = async (imageResult: ImageResult) => {
    setLoading(true);
    try {
      const imgUrl = imageResult.link;
      setNewImageSrc(imgUrl);
      if (query === "") {
        setQuery(placeholder);
        setNewImageLabel(placeholder);
      } else {
        setNewImageLabel(query);
      }

      const result = true;
      if (result) {
        resetSearch();
        // alert("Image saved successfully");
      } else {
        alert("Failed to save image");
      }
    } catch (error) {
      console.error("Save Image Error: ", error);
      alert("Failed to save image");
    } finally {
      setLoading(false);
    }
  };

  const resetSearch = () => {
    setQuery("");
    setImages([]);
    setPageNumber(1);
  };

  const handleInput = (inputStr: string) => {
    setQuery(inputStr);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setImages([]); // Reset images on new search
      setPageNumber(1); // Reset to first page
      handleSearch();
    }
  };

  const previousPage = () => {
    if (pageNumber > 1) {
      setPageNumber((prevPage) => prevPage - 1);
      handleSearch();
    }
  };

  const nextPage = () => {
    setPageNumber((prevPage) => prevPage + 1);
    handleSearch();
  };

  const imageTypes = [
    "clipart",
    "face",
    "lineart",
    "stock",
    "photo",
    "animated",
  ];

  return (
    <div>
      <IonLoading isOpen={loading} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-1 p-3 bg-gray-100 rounded-md shadow-md bg-opacity-50">
        <div className="flex items-center w-full">
          <input
            type="text"
            value={query}
            ref={inputRef}
            className="w-full"
            onChange={(e) => handleInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Search for images (e.g. ${placeholder})`}
          />
          <IonButton
            type="submit"
            className="ml-1"
            onClick={() => {
              setImages([]);
              setPageNumber(1);
              handleSearch();
            }}
          >
            <IonIcon icon={searchSharp} />
          </IonButton>
        </div>
        <div className="flex items-center">
          <IonSelect
            value={imageType}
            placeholder="Image Type"
            labelPlacement="stacked"
            label="Image Type"
            className=""
            selectedText={imageType}
            onIonChange={(e) => setImageType(e.detail.value)}
          >
            {imageTypes.map((type, index) => (
              <IonSelectOption key={index} value={type}>
                {type}
              </IonSelectOption>
            ))}
          </IonSelect>
        </div>
      </div>

      {images.length > 0 && (
        <>
          <IonButtons className="flex justify-between my-4">
            <IonButton fill="outline" onClick={previousPage}>
              Prev Page
            </IonButton>
            <p className="text-center">Page {pageNumber}</p>

            <IonButton fill="outline" onClick={nextPage}>
              Next Page
            </IonButton>
          </IonButtons>
        </>
      )}
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 my-4">
        {images.map((img, index) => (
          <div
            key={index}
            className="flex flex-col items-center cursor-pointer"
            onClick={() => handleClick(img)}
          >
            <img src={img.thumbnail} alt={img.title} />
            <a href={img.link} target="_blank" rel="noreferrer">
              {labelForScreenSize(
                img.title,
                200,
                smallScreen,
                mediumScreen,
                largeScreen
              )}
            </a>
          </div>
        ))}
      </div>
      {images.length > 0 && (
        <IonButtons className="flex justify-between mt-8">
          <IonButton fill="outline" onClick={previousPage}>
            Prev Page
          </IonButton>
          <IonButton fill="outline" onClick={resetSearch}>
            Reset Search
          </IonButton>
          <IonButton fill="outline" onClick={nextPage}>
            Next Page
          </IonButton>
        </IonButtons>
      )}

      {newImageSrc && (
        <ImageCropper
          existingImageSrc={newImageSrc}
          existingLabel={newImageLabel}
          setLoading={setLoading}
          hidePaste={true}
        />
      )}
    </div>
  );
};

export default ImageSearchComponent;
