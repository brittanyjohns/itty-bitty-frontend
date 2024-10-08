import { useEffect, useState, useRef } from "react";
import { ImageResult, imageSearch } from "../../data/search";
import {
  IonButton,
  IonButtons,
  IonIcon,
  IonInput,
  IonItem,
  IonLoading,
  IonSelect,
  IonSelectOption,
  IonText,
  useIonViewWillLeave,
} from "@ionic/react";
import React from "react";
import { saveTempDoc } from "../../data/images";
import ImageCropper from "../images/ImageCropper";
import { searchSharp } from "ionicons/icons";
import { useCurrentUser } from "../../contexts/UserContext";
import { labelForScreenSize } from "../../data/utils";
interface ImageSearchComponentProps {
  startingQuery?: string;
  imageId?: string;
  triggerSearch?: boolean;
}

const ImageSearchComponent: React.FC<ImageSearchComponentProps> = ({
  startingQuery,
  imageId,
  triggerSearch,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const searchButtonRef = useRef<HTMLIonButtonElement>(null);
  const [loading, setLoading] = useState(false);
  const [showNoResults, setShowNoResults] = useState(false);
  const [query, setQuery] = useState(startingQuery || "");
  const [imgColorType, setImgColorType] = useState<string>("color");
  const imgColorTypes = ["color", "gray", "mono", "trans"];
  const [secondarySearch, setSecondarySearch] = useState<string>("");
  const [placeholder, setPlaceholder] = useState("smile");
  const [images, setImages] = useState<ImageResult[]>([]);
  const [newImageSrc, setNewImageSrc] = useState<string | null>(null);
  const [newImageLabel, setNewImageLabel] = useState<string | null>(null);
  const [imageType, setImageType] = useState<string>("clipart");
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [nextStartIndex, setNextStartIndex] = useState<number>(11);
  const { smallScreen, mediumScreen, largeScreen, isWideScreen } =
    useCurrentUser();
  useIonViewWillLeave(() => {
    resetSearch();
    setNewImageSrc(null);
    setNewImageLabel(null);
  });

  const handleSearch = async () => {
    if (!query) {
      alert("Please enter a search query");
      return;
    }
    await load();
  };

  const load = async () => {
    setLoading(true);
    try {
      const params = {
        q: query,
        imgType: imageType,
        start: nextStartIndex,
        num: 10,
        imgColorType: imgColorType,
        secondarySearch: secondarySearch,
      };
      if (query === "") {
        return;
      }
      const imgResult = await imageSearch(query, params);

      if (!imgResult) {
        console.log("Something went wrong. Please try again later");
        return;
      }
      setImages(imgResult);
      if (imgResult.length > 0) {
        setNextStartIndex(imgResult[0].startIndex);
      } else {
        setShowNoResults(true);
      }
    } catch (error) {
      console.error("Image Search Error: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query) {
      console.log("Query: ", query);
    } else {
      setImages([]);
      if (startingQuery) {
        setQuery(startingQuery);
        setPlaceholder(startingQuery);
        load();
      } else {
        setPlaceholder("smile");
        load();
      }
    }
  }, []);

  useEffect(() => {
    if (triggerSearch && images.length === 0) {
      handleSearch();
    }
  }, [triggerSearch]);

  const handleClick = async (imageResult: ImageResult) => {
    setLoading(true);
    try {
      const imgUrl = imageResult.link;

      // setNewImageSrc(imgUrl);
      let tmpLabel = imageResult.title;
      if (query === "") {
        setQuery(placeholder);
        setNewImageLabel(placeholder);
        tmpLabel = placeholder;
      } else {
        setNewImageLabel(query);
        tmpLabel = query;
      }

      const result = await saveTempDoc(imgUrl, tmpLabel, imageId);
      if (result) {
        resetSearch();
        // setNewImageSrc(result["image_url"]);
        window.location.href = `/images/${result["id"]}`;
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
    setQuery(startingQuery || "");
    setSecondarySearch("");
    setImgColorType("color");
    setImages([]);
    setPageNumber(1);
  };

  const handleInput = (inputStr: string) => {
    setQuery(inputStr);
  };

  const handleKeyDown = (e: any) => {
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
    <div className="pb-5 mx-auto">
      <IonLoading isOpen={loading} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 bg-gray-50 rounded-lg border border-gray-200 p-2 my-4">
        <div className="flex items-center w-full mx-auto">
          <input
            type="text"
            value={query}
            ref={inputRef}
            className="w-full"
            onChange={(e: any) => handleInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Search for images (e.g. ${placeholder})`}
          />
          <IonButton
            type="submit"
            ref={searchButtonRef}
            className="mx-2"
            onClick={() => {
              setImages([]);
              setPageNumber(1);
              handleSearch();
            }}
          >
            <IonIcon icon={searchSharp} size="small" />
          </IonButton>
        </div>
        <div className="flex items-center w-1/2 md:w-1/4 mx-auto">
          <IonSelect
            value={imageType}
            placeholder="Image Type"
            labelPlacement="stacked"
            label="Image Type"
            className="mx-2"
            selectedText={imageType}
            onIonChange={(e: any) => setImageType(e.detail.value)}
          >
            {imageTypes.map((type, index) => (
              <IonSelectOption key={index} value={type}>
                {type}
              </IonSelectOption>
            ))}
          </IonSelect>
          <IonSelect
            value={imgColorType}
            placeholder="Color Type"
            labelPlacement="stacked"
            label="Color Type"
            className="mx-2"
            selectedText={imgColorType}
            onIonChange={(e: any) => setImgColorType(e.detail.value)}
          >
            {imgColorTypes.map((type, index) => (
              <IonSelectOption key={index} value={type}>
                {type}
              </IonSelectOption>
            ))}
          </IonSelect>
        </div>

        <IonInput
          value={secondarySearch}
          placeholder="Secondary Search"
          aria-label="Secondary Search"
          helperText="Enter additional search terms - this will override the main search above but will not affect the image label"
          onIonInput={(e: any) => setSecondarySearch(e.detail.value || "")}
          onKeyDown={handleKeyDown}
          // onKeyDown={(e: any) => {
          //   if (e.key === "Enter") {
          //     setImages([]); // Reset images on new search
          //     setPageNumber(1); // Reset to first page
          //     handleSearch();
          //   }
          // }}
        />
        <IonItem
          className="flex items-center w-full mx-auto p-2 my-3"
          lines="none"
        >
          <IonText className="text-xs text-center text-gray-500">
            Images are sourced through Google and marked for public/commercial
            use. However, it is the user's responsibility to ensure proper usage
            rights for selected images.
          </IonText>
        </IonItem>
      </div>
      {showNoResults && (
        <div className="text-center my-4">
          <p>No results found. Please try another search.</p>
        </div>
      )}

      {images.length > 0 && !isWideScreen && (
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
      <div className="md:mt-8 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 my-4">
        {images.length > 0 &&
          images.map((img, index) => (
            <div
              key={index}
              className="flex flex-col items-center cursor-pointer border border-gray-200 rounded-lg p-2"
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
