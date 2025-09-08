
import React, { useState } from 'react';
import ImageUploader from './components/ImageUploader';
import ResultDisplay from './components/ResultDisplay';
import Loader from './components/Loader';
import { generateVirtualTryOnImage } from './services/geminiService';
import { IconSparkles, IconX } from './components/Icons';

type CompositionType = 'full' | 'upper';

const App: React.FC = () => {
    const [personImage, setPersonImage] = useState<string | null>(null);
    const [clothingImage, setClothingImage] = useState<string | null>(null);
    const [resultImage, setResultImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [compositionType, setCompositionType] = useState<CompositionType>('full');

    const handlePersonImageUpload = (image: string) => {
        setPersonImage(image);
        setResultImage(null); // Clear previous result
    };
    
    const handleClothingImageUpload = (image: string) => {
        setClothingImage(image);
        setResultImage(null); // Clear previous result
    };

    const handleGenerate = async () => {
        if (!personImage || !clothingImage) {
            setError('모든 사진을 입력해주세요.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setResultImage(null);

        try {
            const generatedImage = await generateVirtualTryOnImage(personImage, clothingImage, compositionType);
            setResultImage(generatedImage);
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : '이미지 생성 중 알 수 없는 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const isReady = !!personImage && !!clothingImage;

    const ImagePreview = ({ image, onClear }: { image: string; onClear: () => void; }) => (
        <div className="relative group w-full h-64">
            <img src={image} alt="Preview" className="w-full h-full object-contain rounded-lg bg-gray-700/50" />
            <button 
                onClick={onClear} 
                className="absolute top-2 right-2 bg-black/50 hover:bg-red-600/80 rounded-full p-1.5 transition-all z-10"
                aria-label="Remove image"
            >
                <IconX className="w-4 h-4 text-white" />
            </button>
        </div>
    );
    
    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="text-center mb-8">
                    <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
                        AI 패션 피팅룸
                    </h1>
                    <p className="mt-2 text-lg text-gray-400">
                        사람, 캐릭터, 동물 등 원하는 모델에게 옷을 입혀보세요.
                    </p>
                </header>

                <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column: Inputs */}
                    <div className="flex flex-col gap-6">
                        <div className="bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col items-center">
                            <h2 className="text-2xl font-semibold mb-4 w-full border-b border-gray-700 pb-2 flex items-center">
                                <span className="text-indigo-400 mr-2">1</span> 모델 사진 업로드
                            </h2>
                            {personImage ? (
                                <ImagePreview image={personImage} onClear={() => setPersonImage(null)} />
                            ) : (
                                <ImageUploader 
                                    onImageUpload={handlePersonImageUpload} 
                                    uploaderId="person-uploader"
                                    captureMode="user"
                                />
                            )}
                        </div>

                        <div className="bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col items-center">
                            <h2 className="text-2xl font-semibold mb-4 w-full border-b border-gray-700 pb-2 flex items-center">
                                <span className="text-indigo-400 mr-2">2</span> 옷 사진 업로드
                            </h2>
                             {clothingImage ? (
                                <ImagePreview image={clothingImage} onClear={() => setClothingImage(null)} />
                            ) : (
                                <ImageUploader 
                                    onImageUpload={handleClothingImageUpload} 
                                    uploaderId="clothing-uploader"
                                    captureMode="environment"
                                />
                            )}
                        </div>
                    </div>
                    
                    {/* Right Column: Action & Result */}
                    <div className="flex flex-col gap-6">
                        <div className="bg-gray-800 p-6 rounded-xl shadow-lg sticky top-8">
                            <h2 className="text-2xl font-semibold mb-4 border-b border-gray-700 pb-2 flex items-center"><span className="text-indigo-400 mr-2">3</span> AI로 입어보기</h2>
                            
                            <div className="mb-4">
                                <p className="text-sm font-medium text-gray-400 mb-2 text-center">합성 타입 선택</p>
                                <div className="flex justify-center gap-2 sm:gap-4 p-1 bg-gray-700 rounded-lg">
                                    <button
                                        onClick={() => setCompositionType('full')}
                                        className={`w-full px-4 py-2 rounded-md font-semibold transition-colors duration-200 ${compositionType === 'full' ? 'bg-indigo-600 text-white shadow' : 'text-gray-300 hover:bg-gray-600'}`}
                                    >
                                        전신
                                    </button>
                                    <button
                                        onClick={() => setCompositionType('upper')}
                                        className={`w-full px-4 py-2 rounded-md font-semibold transition-colors duration-200 ${compositionType === 'upper' ? 'bg-indigo-600 text-white shadow' : 'text-gray-300 hover:bg-gray-600'}`}
                                    >
                                        상반신
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={handleGenerate}
                                disabled={!isReady || isLoading}
                                className="w-full flex items-center justify-center gap-2 text-lg font-bold py-3 px-6 rounded-lg transition-all duration-300 ease-in-out bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:saturate-50"
                            >
                                <IconSparkles className="w-6 h-6"/>
                                {isLoading ? '피팅 중...' : '가상으로 입어보기'}
                            </button>
                            {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
                            
                            <div className="mt-6">
                                {isLoading ? (
                                    <div className="flex flex-col items-center justify-center h-96 bg-gray-700/50 rounded-lg">
                                        <Loader />
                                        <p className="mt-4 text-lg">AI가 옷을 입혀보고 있습니다...</p>
                                        <p className="text-sm text-gray-400">모델에 맞춰 옷을 재구성 중입니다.</p>
                                    </div>
                                ) : (
                                    <ResultDisplay resultImage={resultImage} />
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default App;