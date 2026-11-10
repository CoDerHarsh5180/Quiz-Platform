import React, { useState } from 'react';
import QuestionDisplayView from './question/QuestionDisplayView';
import QuestionEditForm from './question/QuestionEditForm';

/** Thin shell: switches between read-only display and edit form. */
function QuestionCard({ question, sectionType = 'MCQ', sectionName = '', subjects = [], onUpdated }) {
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdated = (updatedQ) => {
    onUpdated(updatedQ);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <QuestionEditForm
        question={question}
        sectionType={sectionType}
        subjects={subjects}
        onUpdated={handleUpdated}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <QuestionDisplayView
      question={question}
      sectionType={sectionType}
      onEdit={() => setIsEditing(true)}
    />
  );
}

export default QuestionCard;
