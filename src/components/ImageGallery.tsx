import React, { useEffect, useState, useRef } from 'react';
import { Image, ImageGalleryProps, getImages } from '../data/images';
import { IonCol, IonGrid, IonRow, IonImg, IonInput, IonButton, IonIcon } from '@ionic/react';
import {
    playCircleOutline,
    trashBinOutline
} from 'ionicons/icons';
import { TextToSpeech } from '@capacitor-community/text-to-speech';

import '../index.css'
// import TTS from 'cordova-plugin-tts';
import { image } from 'ionicons/icons';
const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
    const gridRef = useRef(null); // Ref for the grid container
    const [audioList, setAudioList] = useState<string[]>([]);
    const inputRef = useRef<HTMLIonInputElement>(null);
    const [showIcon, setShowIcon] = useState(false);

    const handleInputChange = () => {
        console.log('handleInputChange', inputRef.current?.value);
    }
    const fetchImages = async () => {
        const imgs = images;
        console.log('fetchImages', imgs);
    }

    const resizeGrid = () => {
        console.log('Resizing grid', gridRef.current);
        const currentGrid = gridRef.current ? gridRef.current as HTMLElement : null;

        if (currentGrid) {
            console.log('currentGrid.style.width', currentGrid.style.width);
            console.log('currentGrid.style.gridTemplateColumns', currentGrid.style.gridTemplateColumns);
            console.log('currentGrid.style.gridTemplateRows', currentGrid.style.gridTemplateRows);
            const imagesCount = currentGrid.children.length || 0;
            const sqrt = Math.sqrt(imagesCount);
            const rows = Math.ceil(sqrt);
            let cols = Math.round(sqrt);
            // cols += 1;

            const adjustedHeight = `calc(100vh - 115px - 32px)`;
            // const adjustedHeight = `calc(100vh - 80px)`;
            const adjustedWidth = `calc(100vw - 32px)`;

            currentGrid.style.width = adjustedWidth;
            currentGrid.style.height = adjustedHeight;
            currentGrid.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
            currentGrid.style.gridTemplateRows = `repeat(${rows}, minmax(0, 1fr))`;
        } else {
            console.error('Grid container not found');
        }
    }

    const handleImageClick = (image: Image) => {
        const audioSrc = image.audio;
        console.log('handleImageClick', image);
        const label = image.label;
        if (inputRef.current) {
            inputRef.current.value += ` ${label}`
        }
        if (inputRef.current?.value) {
            setShowIcon(true);
        } else {
            setShowIcon(false);
        }
        if (!audioSrc) {
            speak(label);
            return;
        }
        setAudioList([...audioList, audioSrc as string]);
        const audio = new Audio(audioSrc);
        audio.play();
    };

    useEffect(() => {
        fetchImages();
    }, []);


    const speak = async (text: string) => {
        await TextToSpeech.speak({
            text: text,
            lang: 'en-US',
            rate: 1.0,
            pitch: 1.0,
            volume: 1.0,
            category: 'ambient',
        });
    };

    const clearInput = () => {
        if (inputRef.current) {
            inputRef.current.value = '';
        }
        setShowIcon(false);
    }

    // Resize grid on mount and when images state changes
    useEffect(() => {
        resizeGrid();
        // Add window resize event listener to adjust grid on viewport change
        window.addEventListener('resize', resizeGrid);
        return () => window.removeEventListener('resize', resizeGrid);
    }, [images]);

    return (
        <div>
            <IonInput placeholder="" ref={inputRef} onIonChange={handleInputChange} readonly={true}>
            </IonInput>
            <div className="flex justify-between">
            {showIcon &&
                <IonButton  size="small" onClick={() => speak(inputRef.current?.value as string)}><IonIcon slot="icon-only"
                    icon={playCircleOutline} onClick={() => speak(inputRef.current?.value as string)}></IonIcon> </IonButton>
            }
            {showIcon && 
                <IonButton size="small" onClick={() => clearInput()}><IonIcon slot="icon-only" icon={trashBinOutline} onClick={() => clearInput()}></IonIcon></IonButton>
            
            }
            </div>
            <div className="my-auto mx-auto h-[calc(100vh-60px-32px)] w-[calc(100vw-32px)] overflow-hidden grid grid-cols-1 gap-1" ref={gridRef}>
                {images.map((image, i) => (
                    // <IonCol key={i} >
                    <div className='flex relative w-full hover:cursor-pointer text-center' onClick={() => handleImageClick(image)}>
                        <IonImg src={image.src} alt={image.label} className="absolute object-contain w-full h-full top-0 left-0" />
                        <span className="font-medium text-xs md:text-sm lg:text-md rounded bg-white bg-opacity-90 overflow-hidden absolute bottom-0 left-0 right-0 p-0 text-black">
                            {image.label}
                            <audio>
                                <source src={image.audio} type="audio/aac" />
                            </audio>
                        </span>
                    </div>
                    // </IonCol>
                ))}
            </div>
        </div>
    );
};

export default ImageGallery;
