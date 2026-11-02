import { GoogleGenAI, Type } from '@google/genai';
import 'dotenv/config';
import axios from 'axios'
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

if(!process.env.GEMINI_API_KEY){
    console.log("FATAL ERROR: GEMINI_API_KEY is not set in the environment variables.");
    process.exit(1);
}


const prompt = `You are a specialized OCR and LaTeX extraction assistant. Your job is to analyze the provided image of a quiz question and extract its contents into a valid JSON object.

CRITICAL RULES:
1. Identify the core question text. Convert any mathematical formulas, symbols, or equations into valid inline LaTeX format using single dollar signs, like this: $E = mc^2$.
2. Identify the options if present. Convert option contents to LaTeX if they contain math.
3. If options are NOT present in the image, Add 4 options According to your own Intelligence.
4. Identify or derive the correct answer based on the question text or any markings in the image. If it cannot be determined, set "correctAnswer" to null.
5. Return ONLY the raw JSON string.

Expected Output JSON Schema:
{
  "question": "string containing text and $LaTeX$",
  "options": ["option 1 text/$LaTeX$", "option 2 text/$LaTeX$"],
  "correctAnswer": "string matching the exact text of the correct option, or null"
}`



async function urlToGenerativePart(url) {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const mimeType = response.headers['content-type'];
    return {
      inlineData: {
        data: Buffer.from(response.data).toString("base64"),
        mimeType
      },
    };
  } catch (error) {
    throw new Error(`Failed to fetch image: ${error.message}`);
  }
}

const getPromptForType = (type) => {
  if (type === 'NUMERICAL') {
    return `You are a specialized OCR and LaTeX extraction assistant. Your job is to analyze the provided image of a numerical quiz question and extract its contents into a valid JSON object.

CRITICAL RULES:
1. Identify the core question text. Convert any mathematical formulas, symbols, or equations into valid inline LaTeX format using single dollar signs, like this: $E = mc^2$.
2. This is a NUMERICAL question without options. Set "options" to an empty list [].
3. Identify or derive the numerical correct answer based on the question text or markings. If it cannot be determined, set "correctAnswer" to null.
4. Return ONLY the raw JSON string.

Expected Output JSON Schema:
{
  "question": "string containing text and $LaTeX$",
  "options": [],
  "correctAnswer": "string containing numerical value, or null"
}`;
  }

  return `You are a specialized OCR and LaTeX extraction assistant. Your job is to analyze the provided image of a quiz question and extract its contents into a valid JSON object.

CRITICAL RULES:
1. Identify the core question text. Convert any mathematical formulas, symbols, or equations into valid inline LaTeX format using single dollar signs, like this: $E = mc^2$.
2. Identify the options if present. Convert option contents to LaTeX if they contain math.
3. If options are NOT present in the image, Add 4 options According to your own Intelligence.
4. Identify or derive the correct answer based on the question text or any markings in the image. If it cannot be determined, set "correctAnswer" to null.
5. Return ONLY the raw JSON string.

Expected Output JSON Schema:
{
  "question": "string containing text and $LaTeX$",
  "options": ["option 1 text/$LaTeX$", "option 2 text/$LaTeX$"],
  "correctAnswer": "string matching the exact text of the correct option, or null"
}`;
};

const generateQues = async(imageUrl, type)=>{
  const effectivePrompt = getPromptForType(type);
  console.log(effectivePrompt)
    try {
        console.log(imageUrl)
        const imagePart = await urlToGenerativePart(imageUrl);
        console.log("Image Converted")
       
        const response = await ai.models.generateContent({
            model: 'gemini-3.5-flash',
            contents: [
                imagePart,
                effectivePrompt
              ]
        })
        let rawText = response.text.trim();

    // 3. Clean the response defensively (in case the AI ignores the markdown rule)
    if (rawText.startsWith("```json")) {
      rawText = rawText.replace(/^```json\s*/, "").replace(/\s*```$/, "");
    } else if (rawText.startsWith("```")) {
      rawText = rawText.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }

    // 4. Parse into your verified object
    const parsedData = JSON.parse(rawText);

    // Validate structure before database injection
    const isNoOptionType = type === 'NUMERICAL' || type === 'DESCRIPTIVE';
    const finalQuestionSchema = {
      question: parsedData.question || "Untitled Question",
      options: isNoOptionType ? [] : (Array.isArray(parsedData.options) ? parsedData.options : []),
      correctAnswer: parsedData.correctAnswer || null
    };
    return finalQuestionSchema;
          
    }catch(e){
        console.log(e)
    }
}

export {generateQues}