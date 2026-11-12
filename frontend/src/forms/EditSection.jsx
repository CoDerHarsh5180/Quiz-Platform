import React, { useState, useEffect } from 'react';
import { useTest } from '../context/testContext';
import { EditTheSection, getSection, getStructure } from '../Api/structureApi';
import { X } from 'lucide-react';

function EditSection({ id, noOfSec }) {
  console.log(noOfSec);
  const { testArray, loading1, setSectionEditing } = useTest();
  const [section, setSection] = useState("");
  const [positiveMarks, setPositiveMarks] = useState(0);
  const [negativeMarks, setNegativeMarks] = useState(0);
  const [instructions, setInstructions] = useState("");
  const [noOfQues, setNoOfQues] = useState(0);
  const [typeOfQues, setTypeOfQues] = useState('MCQ');
  const [sectionArray, setSetionArray] = useState([])
  useEffect(() => {
    getStructure(id)
      .then(res=>{
        console.log(res.data)
        setSetionArray(res.data.sections)
      })
      .catch(e=>console.log(e))
    if (!section) return;
    getSection(section, id)
      .then((data) => {
        if (data.data[0] && String(data.data[0].testId) === id) {
          setInstructions(data.data[0].instructions);
          setPositiveMarks(data.data[0].plusMarks);
          setNegativeMarks(data.data[0].minusMarks);
          setNoOfQues(data.data[0].numOfQues);
          setTypeOfQues(data.data[0].typeOfQues);
        }
        console.log(data.data);
      });

      
  }, [section, id]);

  const handleSave = (e) => {
    e.preventDefault();
    EditTheSection(id, section, positiveMarks, negativeMarks, instructions, noOfQues, typeOfQues);
  };

  return (
    <div className="max-w-2xl mx-auto my-8 p-6 bg-[var(--color-bg-card)] text-[var(--color-text-primary)] rounded-xl -shadow-md border border-[var(--color-border)] relative">
      <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">Edit Section</h2>
      
      <span 
        className="absolute top-0 right-0 p-3 cursor-pointer text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] z-10" 
        onClick={() => { setSectionEditing(false); }}
      >
        <X />
      </span>

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. Select Section Dropdown */}
        <div>
          <label className="block text-sm font-semibold text-[var(--color-text-primary)] mb-2">
            Select Section
          </label>
          <select 
            name="Section" 
            value={section || "None"}
            onChange={(e) => setSection(e.target.value === "None" ? null : e.target.value)}
            className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-blue-focus)] focus:border-[var(--color-blue-focus)] outline-none transition-all text-[var(--color-text-muted)]"    
          >
            <option value="None" className='text-sm bg-[var(--color-bg-input)]'>None</option>
            

            {
              sectionArray.map((id, index)=>{
                const secChar = String.fromCharCode(65 + index);
                return(
                  <option key={secChar} value={secChar} className='text-sm bg-[var(--color-bg-input)]'>
                    Section {secChar}
                  </option>
                )
              })
            }
          </select>
        </div>

        <hr className="border-[var(--color-border)] my-4" />

        {/* 2. Form Fields Grid / Controls */}
        <div className="space-y-4">
          {/* Two-Column Grid for Marking Scheme */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium  mb-1">
                +ve Marks
              </label>
              <input
                type="number"
                value={positiveMarks}
                onChange={(e) => setPositiveMarks(e.target.value)}
                placeholder="Positive Marks"
                className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-blue-focus)] focus:border-[var(--color-blue-focus)] outline-none text-[var(--color-text-primary)]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium  mb-1">
                -ve Marks
              </label>
              <input
                type="number"
                value={negativeMarks}
                onChange={(e) => setNegativeMarks(e.target.value)}
                placeholder="Negative Marks"
                className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-blue-focus)] focus:border-[var(--color-blue-focus)] outline-none text-[var(--color-text-primary)]"
                required
              />
            </div>
          </div>

          {/* Instructions Input */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Instructions
            </label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Enter instructions for this section..."
              rows="3"
              className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-blue-focus)] focus:border-[var(--color-blue-focus)] outline-none text-[var(--color-text-primary)]"
              required
            />
          </div>

          {/* Number of Questions & Selection Type Wrapper */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Number of Questions
              </label>
              <input
                type="number"
                value={noOfQues}
                onChange={(e) => setNoOfQues(e.target.value)}
                placeholder="Add Number of Questions"
                className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-blue-focus)] focus:border-[var(--color-blue-focus)] outline-none text-[var(--color-text-primary)]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Select Type of Question
              </label>
              <select
                value={typeOfQues}
                onChange={(e) => setTypeOfQues(e.target.value)}
                className="w-full px-4 py-2 border border-[var(--color-border)] bg-[var(--color-bg-page)] rounded-lg focus:ring-2 focus:ring-[var(--color-blue-focus)] focus:border-[var(--color-blue-focus)] outline-none transition-all text-[var(--color-text-primary)]"
              >
                <option value="MCQ">MCQ</option>
                <option value="MSQ">MSQ</option>
                <option value="NUMERICAL">NUMERICAL</option>
                <option value="TRUE/FALSE">TRUE/FALSE</option>
                <option value="DESCRIPTIVE">DESCRIPTIVE</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Button Segment */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-[var(--color-blue)] hover:bg-[var(--color-blue-hover)] text-[var(--color-text-primary)] font-medium py-2.5 px-4 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditSection;