import React, { useState, useRef } from 'react';
import { X } from 'lucide-react';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

// Converts canvas crop to a base64 jpeg string
function getCroppedImg(image, crop) {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

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

    function onImageLoad(e) {
        imgRef.current = e.currentTarget;
        const { width, height } = e.currentTarget;
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
            <label className="block text-sm font-medium text-[var(--color-text-on-light)]">{label}</label>
            <input
                type="file"
                accept="image/*"
                onChange={onFileChange}
                onClick={(e) => { e.target.value = null; }}
                className="w-full text-sm text-[var(--color-text-faint)] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-blue-light)] file:text-[var(--color-blue)] hover:file:bg-[var(--color-blue-light)] cursor-pointer"
            />

            {currentImage && (
                <div className="mt-2 relative inline-block max-w-full">
                    <img src={currentImage} alt="Cropped" className="max-h-28 w-auto rounded-lg border border-[var(--color-border-light)] object-contain" />
                    <button
                        type="button"
                        onClick={() => onCropped(null)}
                        className="absolute -top-1.5 -right-1.5 bg-[var(--color-error)] text-[var(--color-text-primary)] rounded-full p-0.5 hover:bg-[var(--color-error-hover)] shadow-sm"
                    >
                        <X size={12} />
                    </button>
                </div>
            )}

            {imageSrc && (
                <div className="fixed inset-0 z-[200] bg-black/80 flex flex-col items-center justify-center p-4">
                    <div className="bg-[var(--color-modal-bg)] w-full max-w-2xl rounded-xl p-4 flex flex-col gap-4 max-h-[90vh] overflow-y-auto shadow-2xl">
                        <h3 className="text-lg font-bold text-[var(--color-text-dark)]">Drag to Select Question Area</h3>
                        <div className="flex justify-center bg-[var(--color-border-light)] p-2 rounded-lg max-h-96 overflow-auto border border-[var(--color-border-light)]">
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
                                className="px-4 py-2 border border-[var(--color-border-light)] rounded-lg text-sm font-medium text-[var(--color-text-on-light)] hover:bg-[var(--color-border-light)]"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSaveCrop}
                                className="px-4 py-2 bg-[var(--color-blue)] text-[var(--color-text-primary)] rounded-lg text-sm font-medium hover:bg-[var(--color-blue-hover)] shadow-sm"
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

export default ImageUploadWithCrop;
