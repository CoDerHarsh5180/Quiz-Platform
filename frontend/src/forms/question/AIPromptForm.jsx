import React from 'react';
import ImageUploadWithCrop from '../../Components/ImageUploadWithCrop';

/** AI / OCR prompt form body for CreateQuestion. */
export default function AIPromptForm({
  subject, setSubject, subjects,
  promptImg, setPromptImg,
  referenceImg, setReferenceImg,
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[var(--color-text-on-light)] mb-1">Subject</label>
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full px-4 py-2 border border-[var(--color-border-light)] rounded-lg focus:ring-2 focus:ring-[var(--color-blue-focus)] focus:border-[var(--color-blue-focus)] outline-none"
          required
        >
          <option value="">Select a Subject</option>
          {subjects.map((subj, idx) => {
            const name = typeof subj === 'object' ? subj?.name || subj?._id : subj;
            return <option key={idx} value={name}>{name}</option>;
          })}
        </select>
      </div>

      <ImageUploadWithCrop
        label="Prompt Image (Question snippet)"
        onCropped={setPromptImg}
        currentImage={promptImg}
      />

      <ImageUploadWithCrop
        label="Reference Image (Optional diagram / reference)"
        onCropped={setReferenceImg}
        currentImage={referenceImg}
      />
    </div>
  );
}
