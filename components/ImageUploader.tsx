import React, { useCallback } from 'react';
import { IconPhoto, IconCamera } from './Icons';

interface ImageUploaderProps {
    onImageUpload: (base64Image: string) => void;
    uploaderId: string;
    captureMode: 'user' | 'environment';
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, uploaderId, captureMode }) => {

    const handleFileChange = useCallback((file: File | null) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (typeof e.target?.result === 'string') {
                    onImageUpload(e.target.result);
                }
            };
            reader.readAsDataURL(file);
        }
    }, [onImageUpload]);

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFileChange(e.target.files ? e.target.files[0] : null);
        e.target.value = ''; // Reset input to allow re-uploading the same file
    };

    const commonButtonClasses = "flex-1 flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-600 rounded-lg hover:bg-gray-700 hover:border-gray-500 transition-colors duration-200 cursor-pointer text-center";

    return (
        <div className="flex gap-4 w-full">
            <label htmlFor={uploaderId} className={commonButtonClasses}>
                <IconPhoto className="h-8 w-8 text-gray-400 mb-2" />
                <span className="font-medium text-gray-300">갤러리</span>
                <input
                    id={uploaderId}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={onInputChange}
                />
            </label>
            <label htmlFor={`${uploaderId}-capture`} className={commonButtonClasses}>
                <IconCamera className="h-8 w-8 text-gray-400 mb-2" />
                <span className="font-medium text-gray-300">카메라</span>
                <input
                    id={`${uploaderId}-capture`}
                    type="file"
                    accept="image/*"
                    capture={captureMode}
                    className="hidden"
                    onChange={onInputChange}
                />
            </label>
        </div>
    );
};

export default ImageUploader;
