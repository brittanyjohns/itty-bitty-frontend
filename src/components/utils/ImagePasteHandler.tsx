import React, { useEffect } from 'react';

interface ImagePasteHandlerProps {
    setFile: (file: File) => void;
}

const ImagePasteHandler: React.FC<ImagePasteHandlerProps> = ({ setFile }) => {
    useEffect(() => {
        const handlePaste = (evt: ClipboardEvent) => {
            const clipboardItems = evt.clipboardData?.items;
            if (!clipboardItems) return;

            const items = Array.from(clipboardItems).filter(item => /^image\//.test(item.type));
            if (items.length === 0) {
                return;
            }

            const item = items[0];
            const blob = item.getAsFile();
            if (!blob) return;

            const imageEle = document.getElementById('preview') as HTMLImageElement;
            if (imageEle) {
                imageEle.src = URL.createObjectURL(blob);
            }

            const file = new File([blob], "file name", { type: "image/jpeg", lastModified: new Date().getTime() });
            console.log('file', file);
            const container = new DataTransfer();
            container.items.add(file);
            const fileInput = document.querySelector('#file_input') as HTMLInputElement;
            const fileField = document.querySelector('#file_field') as HTMLImageElement;
            console.log('fileInput', fileInput);
            console.log('fileField', fileField);
            if (fileInput) {
                fileInput.files = container.files;
            }
            if (fileField) {
                fileField.src = URL.createObjectURL(file);
            }
            setFile(file);
        };

        document.addEventListener('paste', handlePaste);

        return () => {
            document.removeEventListener('paste', handlePaste);
        };
    }, []);

    return (
        <div>
            {/* <input type="file" id="file_input" style={{ display: 'none' }} /> */}
            {/* <img id="preview" alt="Preview" /> */}
        </div>
    );
};

export default ImagePasteHandler;
