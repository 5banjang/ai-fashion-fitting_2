import React from 'react';
import { IconX } from './Icons';

interface FullScreenAdProps {
  showCloseButton: boolean;
  onClose: () => void;
}

const FullScreenAd: React.FC<FullScreenAdProps> = ({ showCloseButton, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/80 flex flex-col justify-center items-center z-50">
      <div className="absolute top-4 right-4">
        {showCloseButton && (
          <button
            onClick={onClose}
            className="bg-white/20 hover:bg-white/40 rounded-full p-2 transition-colors"
            aria-label="Close ad"
          >
            <IconX className="w-6 h-6 text-white" />
          </button>
        )}
      </div>
      
      <div className="w-full max-w-md p-4">
        {/* 나중에 구글 애드센스 코드를 이 부분에 삽입합니다. */}
        <div className="bg-gray-700 h-96 flex justify-center items-center rounded-lg">
          <p className="text-white text-lg">광고 표시 영역</p>
        </div>
      </div>

      {!showCloseButton && (
         <p className="text-white mt-4 text-sm">잠시 후 광고를 닫을 수 있습니다.</p>
      )}
    </div>
  );
};

export default FullScreenAd;