import React, { useEffect, useState, useRef } from 'react';
import { Image, ImageGalleryProps, SelectImageGalleryProps, getImages } from '../data/images';
import { IonCol, IonGrid, IonRow, IonImg, IonInput, IonButton, IonIcon, IonSearchbar, IonCardContent, IonCardHeader, IonCard, IonCardTitle, IonCardSubtitle } from '@ionic/react';
import {
    add,
    playCircleOutline,
    trashBinOutline
} from 'ionicons/icons';
import { TextToSpeech } from '@capacitor-community/text-to-speech';

import '../index.css'
// import TTS from 'cordova-plugin-tts';
import { image } from 'ionicons/icons';
import { addImageToBoard, getRemainingImages } from '../data/boards';
import { get, set } from 'react-hook-form';
const SelectImageGallery: React.FC<SelectImageGalleryProps> = ({ images, boardId, page }) => {
    const gridRef = useRef(null); // Ref for the grid container
    const inputRef = useRef<HTMLIonInputElement>(null);
    const [showIcon, setShowIcon] = useState(false);
    const [remainingImages, setRemainingImages] = useState<Image[]>(images);
    const [currentPage, setCurrentPage] = useState<number>(page);

    const [results, setResults] = useState<string[]>(remainingImages ? remainingImages.map((img) => img.label) : []);

    const resizeGrid = () => {
        const currentGrid = gridRef.current ? gridRef.current as HTMLElement : null;

        if (currentGrid) {
            const imagesCount = currentGrid.children.length || 0;
            const sqrt = Math.sqrt(imagesCount);
            const rows = Math.ceil(sqrt);
            let cols = Math.round(sqrt);

            const adjustedHeight = `calc(100vh - 60px - 32px)`;
            const adjustedWidth = `calc(100vw - 120px - 32px)`;

            currentGrid.style.width = adjustedWidth;
            currentGrid.style.height = adjustedHeight;
            currentGrid.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
            currentGrid.style.gridTemplateRows = `repeat(${rows}, minmax(0, 1fr))`;
        } else {
            console.error('Grid container not found');
        }
    }

    const handleImageClick = (image: Image) => {
        if (!image) return;
        const result = addImageToBoard(boardId, image.id);
        console.log('handleImageClick', image);
        window.location.reload();
    };

    const clearInput = () => {
        if (inputRef.current) {
            inputRef.current.value = '';
        }
        setShowIcon(false);
    }

    const handleSearch = (event: CustomEvent) => {
        // const query = event.detail.value;
        // console.log('handleSearch', query);
        let query = '';
        const target = event.target as HTMLIonSearchbarElement;
        if (target) query = target.value!.toLowerCase();
        setCurrentPage(1);
        getMoreImages(query);
        console.log('handleSearch', query);
    }

    const getMoreImages = async (query: string) => {
        if (!boardId) return;
        const remainingImgs = await getRemainingImages(boardId, {
            query: query,
            page: currentPage
        });
        setRemainingImages(remainingImgs);
        console.log('getMoreImages', remainingImgs);
      }

    // Resize grid on mount and when images state changes
    useEffect(() => {
        console.log('SelectImageGallery useEffect - Images changed');
        setRemainingImages(images);
        // resizeGrid();
        // Add window resize event listener to adjust grid on viewport change
        // window.addEventListener('resize', resizeGrid);
        // return () => window.removeEventListener('resize', resizeGrid);
    }, [images]);

    useEffect(() => {
        resizeGrid();

        setRemainingImages(images);
        console.log('Remaining images', remainingImages);
    }   , []);

    return (
        <IonCard>
        <IonCardHeader>
          <IonCardTitle>
            Search existing images
          </IonCardTitle>
          <IonCardSubtitle>Click the image to add it to your board.</IonCardSubtitle>
        </IonCardHeader>
    
        <IonCardContent>
            <IonSearchbar debounce={1000} onIonInput={handleSearch} animated={true} placeholder="Animated"></IonSearchbar>
        </IonCardContent>
            <div className="my-auto mx-auto h-[calc(100vh-30px-32px)] w-[calc(100vw-60px-32px)] overflow-hidden grid grid-cols-3 gap-1" ref={gridRef}>
                {remainingImages.map((image, i) => (
                    <div className='flex relative w-full hover:cursor-pointer text-center' onClick={() => handleImageClick(image)} key={image.id}>
                        <IonImg src={image.src} alt={image.label} className="absolute object-contain w-full h-full top-0 left-0" />
                        <span className="font-medium text-xs md:text-sm lg:text-md rounded bg-white bg-opacity-90 overflow-hidden absolute bottom-0 left-0 right-0 p-0 text-black">
                            {image.label}
                            <audio>
                                <source src={image.audio} type="audio/aac" />
                            </audio>
                        </span>
                    </div>
                ))}
            </div>
        </IonCard>
    );
};

export default SelectImageGallery;
