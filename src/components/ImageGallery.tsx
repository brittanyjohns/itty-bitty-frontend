import React, { useEffect, useState, useRef } from 'react';
import { Image, ImageGalleryProps } from '../data/images';
import { IonImg } from '@ionic/react';

import { TextToSpeech } from '@capacitor-community/text-to-speech';
import '../index.css'
import { useHistory } from 'react-router';
import ActionList from './ActionList';
import { removeImageFromBoard } from '../data/boards';
const ImageGallery: React.FC<ImageGalleryProps> = ({ images, boardId, setShowIcon, inputRef }) => {
    const gridRef = useRef(null); // Ref for the grid container
    const [audioList, setAudioList] = useState<string[]>([]);
    const [imageId, setImageId] = useState<string>('');
    const [leaving, setLeaving] = useState<boolean>(false);
    const history = useHistory();
    const [showActionList, setShowActionList] = useState<boolean>(false);
    const longPressTimer = useRef<NodeJS.Timeout | null>(null);
    const galleryRef = useRef<HTMLDivElement>(null);

    const resizeGrid = () => {
        const imagesCount = images.length;
        const sqrt = Math.sqrt(imagesCount);
        let rows = Math.ceil(sqrt);
        let cols = Math.round(sqrt);
        const gallery = galleryRef.current ? galleryRef.current as HTMLElement : null;

        const currentGrid = gridRef.current ? gridRef.current as HTMLElement : null;
        const galleryWidth = gallery?.offsetWidth;
        const galleryHeight = gallery?.offsetHeight;
        let landscapeRows = 3;
        let portraitCols = 2;
        if (imagesCount > 20) {
            landscapeRows = 4;
            portraitCols = 4;
        }
        if (gallery) {

            const adjustedHeight = `calc(100vh - 51px )`;
            const adjustedWidth = `calc(100vw)`;

            // gallery.style.width = adjustedWidth;
            if (galleryWidth && galleryHeight && currentGrid) {
                currentGrid.style.height = adjustedHeight;
                currentGrid.style.width = adjustedWidth;
                if (galleryWidth > galleryHeight) {
                    if (galleryHeight > 700) {

                        landscapeRows += 4;
                    }
                    //  landscape
                    currentGrid.style.gridTemplateRows = `repeat(${landscapeRows}, minmax(0, 1fr))`;
                }
                if (galleryWidth < galleryHeight) {
                    let protraitRows = (galleryWidth * 2) / 100;
                    //  Round up to the nearest integer
                    protraitRows = Math.floor(protraitRows);

                    console.log('Testing protraitRows', protraitRows);
                    // portrait
                    if (galleryHeight > 700 && galleryHeight < 900) {
                        protraitRows += 1;
                        console.log('Adding Row', protraitRows);
                    }
                    if (galleryHeight > 900) {
                        protraitRows += 1;
                        console.log('Adding Row', protraitRows);
                    }
                    currentGrid.style.gridTemplateRows = `repeat(${protraitRows}, minmax(0, 1fr))`;
                }
            }
        }
    }

    const handleImageClick = (image: Image) => {
        const audioSrc = image.audio;

        const label = image.label;
        if (inputRef.current) {
            inputRef.current.value += ` ${label}`
        }
        if (inputRef.current?.value) {
            setShowIcon(true);
        } else {
            setShowIcon(false);
        }

        if (leaving) {
            console.log('Leaving');
            return;
        }
        if (!audioSrc) {
            speak(label);
            return;
        }
        setAudioList([...audioList, audioSrc as string]);
        const audio = new Audio(audioSrc);
        audio.play();
    };

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

    const handleButtonPress = (event: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>) => {
        const imageId = (event.target as HTMLDivElement).id;

        longPressTimer.current = setTimeout(() => {
            setShowActionList(true); // Show the action list on long press
            setLeaving(true);
        }, 800); // 500 milliseconds threshold for long press
    };

    const handleButtonRelease = (event: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>) => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current); // Cancel the timer if the button is released before the threshold
            longPressTimer.current = null;
        }
    };

    const handleActionSelected = (action: string) => {
        if (action === 'delete') {
            if (!boardId) {
                console.error('Board ID is missing');
                return;
            }
            const result = remove(imageId, boardId);
            console.log('Action', result);
            // window.location.reload();
        } else if (action === 'edit') {
            history.push(`/images/${imageId}/edit`);
        }
        setShowActionList(false);
    };

    const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
        const imageId = (event.target as HTMLDivElement).id;
        if (!imageId) {
            return;
        }
        setImageId(imageId);
    }

    const remove = async (imageId: string, boardId: string) => {
        const result = await removeImageFromBoard(boardId, imageId);
        console.log('Remove Image from Board', result);
        return result;
    };

    // Resize grid on mount and when images state changes
    useEffect(() => {
        resizeGrid();
        // Add window resize event listener to adjust grid on viewport change
        window.addEventListener('resize', resizeGrid);
        return () => window.removeEventListener('resize', resizeGrid);
    }, [images]);

    return (
        <div className="gallery-container" ref={galleryRef}>
            <div className="my-auto mx-auto grid grid-rows-4 grid-flow-col gap-1" ref={gridRef}>
                {images.map((image, i) => (
                    <div className='h-20 border bg-white rounded-md flex relative w-full hover:cursor-pointer text-center' onClick={() => handleImageClick(image)} key={image.id}
                        onTouchStart={(e) => handleButtonPress(e)}
                        onPointerDown={(e) => handlePointerDown(e)}
                        onTouchEnd={(e) => handleButtonRelease(e)}
                        onMouseDown={(e) => handleButtonPress(e)} // For desktop
                        onMouseUp={handleButtonRelease} // For desktop
                        onMouseLeave={handleButtonRelease} // Cancel on mouse leave to handle edge cases
                    >
                        <IonImg id={image.id} src={image.src} alt={image.label} className="absolute object-contain w-full h-full top-0 left-0" />
                        <span className="font-medium text-xs md:text-sm lg:text-md rounded bg-white bg-opacity-90 overflow-hidden absolute bottom-0 left-0 right-0 p-0 text-black">
                            {image.label.length > 20 ? image.label.substring(0, 20) + "..." : image.label}
                            <audio>
                                <source src={image.audio} type="audio/aac" />
                            </audio>
                        </span>
                        <ActionList
                            isOpen={showActionList}
                            onClose={() => setShowActionList(false)}
                            onActionSelected={(action: string) => handleActionSelected(action)}
                        />
                    </div>

                ))}
            </div>
        </div>
    );
};

export default ImageGallery;
