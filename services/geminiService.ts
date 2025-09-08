
import { GoogleGenAI, Modality, Part } from "@google/genai";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const dataUrlToPart = (dataUrl: string): Part => {
    const [header, data] = dataUrl.split(',');
    const mimeTypeMatch = header.match(/:(.*?);/);
    if (!mimeTypeMatch || !data) {
        throw new Error("Invalid data URL format");
    }
    const mimeType = mimeTypeMatch[1];
    return {
        inlineData: {
            mimeType,
            data,
        },
    };
};

export const generateVirtualTryOnImage = async (
    personImage: string,
    clothingImage: string,
    compositionType: 'full' | 'upper'
): Promise<string> => {
    
    const model = 'gemini-2.5-flash-image-preview';

    const compositionInstruction = compositionType === 'full' 
        ? "Extend the image to create a realistic, full-body view of the subject in a simple standing pose."
        : "Extend the image to create a realistic, upper-body (waist-up) view of the subject.";

    const prompt = `
      You are an AI virtual stylist. Your task is to dress the subject from the first image with the clothing from the second image.

      **Key Instructions:**

      1.  **SUBJECT (IMAGE 1):** This is your model. It could be a person, a cartoon character, or an animal. **You must preserve the subject's key features, style, and identity.** For people, this means face, hair, and skin tone. For characters or animals, this means their unique appearance. This is the most important rule.
      2.  **CLOTHING (IMAGE 2):** This is the style reference. Re-create this clothing to fit the subject's body shape naturally.
      3.  **ACTION:**
          - Remove any existing clothing from the subject if necessary.
          - Dress the subject in the new clothing, ensuring a realistic or stylistically appropriate fit, with natural-looking folds and shadows.
          - ${compositionInstruction}
      4.  **OUTPUT:**
          - A single high-quality image that matches the style of the original subject.
          - Use a simple, neutral background that complements the subject.
          - **Do not include any text, logos, or watermarks in the output image.**
    `;


    const parts: Part[] = [
        dataUrlToPart(personImage),
        dataUrlToPart(clothingImage),
        { text: prompt }
    ];

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: { parts: parts },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });

        const imagePart = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);
        
        if (imagePart && imagePart.inlineData) {
            const { mimeType, data } = imagePart.inlineData;
            return `data:${mimeType};base64,${data}`;
        } else {
            // If no image is returned, find and use the text part for the error message.
            const textPart = response.candidates?.[0]?.content?.parts?.find(part => part.text);
            const textResponse = textPart?.text ?? 'No text response available.';
            console.error("No image part in response. Text response:", textResponse);
            throw new Error(`AI가 이미지를 생성하지 못했습니다. 응답: ${textResponse}`);
        }
    } catch (error) {
        console.error("Error calling Gemini API:", error);

        let userFriendlyMessage = "이미지 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";

        if (error instanceof Error) {
            const errorMessage = error.message.toLowerCase();
            if (errorMessage.includes('quota') || errorMessage.includes('rate limit')) {
                userFriendlyMessage = "API 사용량 한도를 초과했습니다. Google Cloud 또는 AI Studio 대시보드에서 사용량 및 결제 설정을 확인해주세요.";
            } else if (errorMessage.includes('safety')) {
                userFriendlyMessage = "생성 요청이 안전 정책에 의해 거부되었습니다. 다른 이미지를 사용해 보세요.";
            } else {
                userFriendlyMessage = `오류가 발생했습니다: ${error.message}`;
            }
        }
        
        throw new Error(userFriendlyMessage);
    }
};
