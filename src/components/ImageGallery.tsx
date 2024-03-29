import React, { useEffect, useState, useRef } from 'react';
import { Image, ImageGalleryProps } from '../data/images';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import './main.css'
import { useHistory } from 'react-router';
import ActionList from './ActionList';
import { removeImageFromBoard } from '../data/boards';
import ImageGalleryItem from './ImageGalleryItem';
import FloatingWordsBtn from './FloatingWordsBtn';

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, board, setShowIcon, inputRef }) => {
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

        // Calculate the number of columns based on the viewport width and the square root of the number of images.
        // This aims to achieve a balance between the number of rows and columns.
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const optimalSize = Math.sqrt(viewportWidth * viewportHeight / imagesCount);
        const cols = Math.floor(viewportWidth / optimalSize);

        const gridTarget = gridRef.current ? gridRef.current as HTMLElement : null;
        if (!gridTarget) return;

        const adjustedHeight = `calc(100vh - 60px)`; // Adjust as needed
        const adjustedWidth = `calc(100vw)`; // Adjust as needed

        gridTarget.style.height = adjustedHeight;
        gridTarget.style.width = adjustedWidth;
        gridTarget.style.display = 'grid';

        if (board?.number_of_columns && imagesCount > 4) {
            gridTarget.style.gridTemplateColumns = `repeat(${board.number_of_columns}, 1fr)`;
            return;
        }

        // Adjust the grid template to fit the calculated number of columns
        // Each column width is set to '1fr' to distribute the space evenly
        gridTarget.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

        // There's no need to set the gridTemplateRows in this approach because the height of each row will automatically adjust to the content
    };

    // Call resizeGrid function inside useEffect hook to adjust the grid on mount and when images state changes or viewport size changes
    useEffect(() => {
        resizeGrid();
        window.addEventListener('resize', resizeGrid);
        return () => {
            window.removeEventListener('resize', resizeGrid);
        };
    }, [images]);




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
        if (board?.predifined) {    
            console.log('Predefined board');
            return;
        }
        longPressTimer.current = setTimeout(() => {
            setShowActionList(true); // Show the action list on long press
            setLeaving(true);
        }, 500); // 500 milliseconds threshold for long press
    };

    const handleButtonRelease = (event: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>) => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current); // Cancel the timer if the button is released before the threshold
            longPressTimer.current = null;
        }
    };

    const handleActionSelected = (action: string) => {
        console.log('Action Selected', action);
        if (!imageId) {
            return;
        }

        if (action === 'delete') {
            if (!board?.id) {
                return;
            }
            async function removeImage() {
                if (!board?.id) {
                    return;
                }
                const result = await removeImageFromBoard(board.id, imageId);
                if (result.error) {
                    console.error('Error:', result.error);
                    alert(`Error: ${result.error}`);
                    return;
                }
                window.location.reload();
            }
            removeImage();
            // window.location.reload();
        } else if (action === 'edit') {
            history.push(`/images/${imageId}`);
        }
        setShowActionList(false);
    };

    const onActionListClose = () => {
        setShowActionList(false);
        setLeaving(false);
    }

    const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
        const imageId = (event.target as HTMLDivElement).id;
        if (!imageId) {
            return;
        }
        setImageId(imageId);
    }

    // Resize grid on mount and when images state changes
    // useEffect(() => {
    //     resizeGrid();
    //     // Add window resize event listener to adjust grid on viewport change
    //     window.addEventListener('resize', resizeGrid);
    //     return () => window.removeEventListener('resize', resizeGrid);
    // }, [images]);

    return (
        <div className="gallery-container" ref={galleryRef}>
                  <FloatingWordsBtn />

            <div className="grid grid-cols-1 gap-1" ref={gridRef}>
                {images.map((image, i) => (
                    <div className='image-container flex relative w-full hover:cursor-pointer text-center'
                        onClick={() => handleImageClick(image)} key={image.id}
                        onTouchStart={(e) => handleButtonPress(e)}
                        onPointerDown={(e) => handlePointerDown(e)}
                        onTouchEnd={(e) => handleButtonRelease(e)}
                        onMouseDown={(e) => handleButtonPress(e)}
                        onMouseUp={handleButtonRelease} 
                        onMouseLeave={handleButtonRelease}>
                        <ImageGalleryItem key={image.id} image={image} />

                        {!board?.predifined && (
                            <ActionList
                                isOpen={showActionList}
                                onClose={() => onActionListClose()}
                                onActionSelected={(action: string) => handleActionSelected(action)}
                            />)}
                    </div>
                ))}
            </div>
        </div>);
};

export default ImageGallery;
