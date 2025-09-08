
import React from 'react';
import { IconPhoto } from './Icons';

interface ResultDisplayProps {
    resultImage: string | null;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ resultImage }) => {
    if (!resultImage) {
        return (
            <div className="flex flex-col items-center justify-center h-96 bg-gray-700/50 rounded-lg">
                <IconPhoto className="h-16 w-16 text-gray-500" />
                <p className="mt-4 text-lg text-gray-400">합성 결과가 여기에 표시됩니다.</p>
            </div>
        );
    }

    return (
        <div className="relative">
            <img src={resultImage} alt="Generated composite" className="w-full rounded-lg shadow-2xl" />
            <a 
                href={resultImage} 
                download="composite-image.png"
                className="absolute bottom-4 right-4 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition font-semibold"
            >
                이미지 다운로드
            </a>
        </div>
    );
};

export default ResultDisplay;
