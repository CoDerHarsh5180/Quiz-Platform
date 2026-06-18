import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css'; 
import { useTest } from '../context/testContext';
import { createQuestion, createQuestionAI, getSection, getStructure } from '../Api/apirequests';


export default function CreateQuestion({ id, sec }) {
  const { setAddQues } = useTest();
  const [section, setSection] = useState('A');
  const [mode, setMode] = useState('manual');

  const [optionImg, setOptionImg] = useState(null);
  const [sectionBImg, setSectionBImg] = useState(null);
  const [promptImg, setPromptImg] = useState(null);
  const [referenceImg, setReferenceImg] = useState(null);

  const [text, setText] = useState('')
  const [options, setOption]=useState(['', '', '', ''])
  const [correctAnswer, setCorrectAnswer]=useState('')
  const [subject, setSubject]=useState('')
  const [type, setType] = useState('')
  const [sectionArray, setSetionArray] = useState([])

  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    getStructure(id)
      .then(res=>{
        console.log(res.data)
        setSetionArray(res.data.sections)
      })
      .catch(e=>console.log(e))
    getSection(section, id)
          .then((data) => {
            if (data.data[0] && String(data.data[0].testId) === id) {
              setType(data.data[0].typeOfQues);
              console.log(data.data[0])
            }
            console.log(data.data);
          });
  },[section])

  useEffect(()=>{
    console.log(optionImg)
    console.log(sectionBImg)
    console.log(promptImg)
    console.log(referenceImg)
  },[optionImg, sectionBImg, promptImg, referenceImg])
  const handleSubmit = (e) => {
    e.preventDefault();
    if(mode==='manual'){
      createQuestion(
          text,
          section,
          options,
          correctAnswer, 
          subject,
          id,
          (type==='MCQ' || type==='MSQ')?optionImg:sectionBImg,
          setLoading
      )
    }

    else{
      createQuestionAI(
        promptImg,
        referenceImg,
        subject,
        id,
        section,
        setLoading
      )
    }

  };

  return (
    <div className="max-w-2xl mx-auto my-8 p-6 bg-white rounded-xl shadow-md border border-gray-100 relative text-black">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Question</h2>
      <span 
        className="absolute top-0 right-0 p-3 cursor-pointer text-gray-500 hover:text-gray-700 z-10" 
        onClick={() => { setAddQues(false); }}
      >
        <X />
      </span>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Section Dropdown */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Select Section</label>
          <select 
            value={section} 
            onChange={(e) => setSection(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          >
            {
              sectionArray.map((id, index)=>{
                const secChar = String.fromCharCode(65 + index);
                return(
                  <option key={secChar} value={secChar}>
                    Section {secChar}
                  </option>
                )
              })
            }
          </select>
        </div>

        {/* 2. Mode Radio Buttons */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Input Type</label>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input 
                type="radio" 
                name="mode" 
                value="manual" 
                checked={mode === 'manual'}
                onChange={() => setMode('manual')}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">Manual</span>
            </label>
            
            <label className="flex items-center gap-2 cursor-pointer group">
              <input 
                type="radio" 
                name="mode" 
                value="prompt" 
                checked={mode === 'prompt'}
                onChange={() => setMode('prompt')}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">Prompt</span>
            </label>
          </div>
        </div>

        <hr className="border-gray-200 my-4" />

        {/* 3. Conditional Layouts */}
        {mode === 'manual' ? (
          <div key="manual-mode-wrapper" className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
              <textarea 
                placeholder="Enter your question in Latex form here..." 
                rows="3"
                value={text}
                onChange={(e)=>setText(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input 
                placeholder="Subject" 
                value={subject}
                onChange={(e)=>setSubject(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            {type==='MCQ' || type==='MSQ' ? (
              <div key="manual-section-a" className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">Options</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {['option1', 'option2', 'option3', 'option4'].map((opt, idx) => (
                    <input 
                      key={idx}
                      type="text" 
                      placeholder={opt} 
                      onChange={(e)=>setOption(prev=>{prev[idx]=e.target.value; return prev})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  ))}
                </div>
                
                <div className="mt-4">
                  <ImageUploadWithCrop 
                    label="Upload Option Image" 
                    onCropped={setOptionImg} 
                    currentImage={optionImg}
                  />
                </div>
                
              </div>
            ) : (
              <div key="manual-section-b">
                <ImageUploadWithCrop 
                  label="Upload Section B Image" 
                  onCropped={setSectionBImg} 
                  currentImage={sectionBImg}
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Correct Answer</label>
              <input 
                placeholder="Correct Answer of the Question" 
                value={correctAnswer}
                onChange={(e)=>setCorrectAnswer(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>
        ) : (
          <div key="prompt-mode-wrapper" className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input 
                placeholder="Subject" 
                value={subject}
                onChange={(e)=>setSubject(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <ImageUploadWithCrop 
                label="Prompt Image" 
                onCropped={setPromptImg} 
                currentImage={promptImg}
              />
            </div>
            
            <div>
              <ImageUploadWithCrop 
                label="Reference Image" 
                onCropped={setReferenceImg} 
                currentImage={referenceImg}
              />
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-4 flex justify-between">
          <button 
            type="submit" 
            className={(!loading && `w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg shadow-sm transition-colors cursor-pointer`) || (loading && `loader`)} 
            onClick = {()=>{setLoading(true)}}
          >
            Submit Request
          </button>
          {loading && <button className='max-w-1/2 p-2 bg-red-500 text-white' onClick={()=>{setLoading(false)}}>Retry!</button>}
        </div>
      </form>
    </div>
  );
}

// --- FREE-FORM CROPPER DRAG SELECTION COMPONENT ---

function ImageUploadWithCrop({ label, onCropped, currentImage }) {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);

  const onFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setImageSrc(reader.result));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // Automatically initialises a clean initial cropping rectangle selection
  function onImageLoad(e) {
    imgRef.current = e.currentTarget;
    const { width, height } = e.currentTarget;
    
    // Default select a generic landscape rect in the center
    const initialCrop = centerCrop(
      makeAspectCrop({ unit: '%', width: 80 }, null, width, height),
      width,
      height
    );
    setCrop(initialCrop);
    setCompletedCrop(initialCrop);
  }

  const handleSaveCrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (imgRef.current && completedCrop) {
      const croppedBase64 = getCroppedImg(imgRef.current, completedCrop);
      onCropped(croppedBase64);
      setImageSrc(null);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input 
        type="file" 
        accept="image/*"
        onChange={onFileChange}
        onClick={(e) => { e.target.value = null; }}
        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-5 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
      />

      {currentImage && (
        <div className="mt-2 relative inline-block max-w-full">
          <img src={currentImage} alt="Cropped" className="max-h-28 w-auto rounded-lg border border-gray-200 object-contain" />
          <button 
            type="button"
            onClick={() => onCropped(null)} 
            className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 shadow-sm"
          >
            <X size={12} />
          </button>
        </div>
      )}

      {imageSrc && (
        <div className="fixed inset-0 z-[200] bg-black/80 flex flex-col items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-xl p-4 flex flex-col gap-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <h3 className="text-lg font-bold text-gray-800">Drag to Select Question Area</h3>
            
            <div className="flex justify-center bg-gray-100 p-2 rounded-lg max-h-96 overflow-auto border border-gray-200">
              {/* Native handles are rendered natively via CSS injection */}
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
              >
                <img 
                  src={imageSrc} 
                  alt="Crop Workspace" 
                  onLoad={onImageLoad}
                  className="max-w-full h-auto max-h-80 object-contain"
                />
              </ReactCrop>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); setImageSrc(null); }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCrop}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm"
              >
                Crop & Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- HIGHLY ACCURATE ELEMENT DIMENSION EXTRACTION ---

function getCroppedImg(image, crop) {
  const canvas = document.createElement('canvas');
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  
  canvas.width = crop.width * scaleX;
  canvas.height = crop.height * scaleY;

  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Set high quality image rendering paths
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width * scaleX,
    crop.height * scaleY
  );

  return canvas.toDataURL('image/jpeg', 0.95);
}