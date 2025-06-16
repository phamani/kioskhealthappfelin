/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-wrapper-object-types */
/* eslint-disable react-hooks/exhaustive-deps */

import { useState, useEffect } from 'react';
import { QuestionnaireData, ConditionWithQuestionnaire, RiskLevel } from '@/types/conditions';
import ProgressBar from '@/components/ui/progressbar';
import StepIndicators from '@/components/ui/step-indicator';

interface Props {
  condition: ConditionWithQuestionnaire;
  questionnaireData: QuestionnaireData;
  onComplete: (answers: Record<number, string>, score: number, calculatedRiskLevel: RiskLevel) => void;
  currentConditionIndex: number;
  totalConditions: number;
  key: string
}

const ConditionQuestionnaire = ({ condition, questionnaireData, onComplete, currentConditionIndex, totalConditions, key}: Props) => {
  const [currentConditionProgressIndex, setCurrentConditionProgressIndex] = useState(currentConditionIndex);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestionStepIndex, setCurrentQuestionStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const conditionQuestionnaire = questionnaireData[condition.ArrhythmiaName];

  if (!conditionQuestionnaire) {
    return <div>No questionnaire available for this condition.</div>;
  }

  const currentQuestion = conditionQuestionnaire.questions[currentQuestionIndex];

  const handleAnswer = (answer: string) => {
    const newAnswers = { ...answers, [currentQuestionIndex]: answer };
    setAnswers(newAnswers);

    if (currentQuestionIndex < conditionQuestionnaire.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentQuestionStepIndex(currentQuestionStepIndex + 1);
    } 
    else {
      // Calculate score when all questions are answered
      const score = conditionQuestionnaire.questions.reduce((total, question, index) => {
        const answer = newAnswers[index];
        return total + (answer ? question.scoring[answer] : 0);
      }, 0);

      const calculatedRiskLevel: RiskLevel = score >= conditionQuestionnaire.min_score_threshold ? 'HighRisk' : 'Suspected'; 
      setCurrentConditionProgressIndex(currentConditionProgressIndex + 1); 
      setCurrentQuestionStepIndex(currentQuestionStepIndex + 1);

      onComplete(newAnswers, score, calculatedRiskLevel);
    }
  };

  const handleQuestionNavigation = (index: number) => {
    if (index < conditionQuestionnaire.questions.length && answers[index] !== undefined) {
      setCurrentQuestionIndex(index);
      setCurrentQuestionStepIndex(index);
    }
  };

  return (
    <div className="questionnaire-container max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* Overall assessment progress */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">
          Assessment Progress: Condition {(currentConditionProgressIndex + 1) > totalConditions ? totalConditions : (currentConditionProgressIndex + 1)} of {totalConditions}
        </h2>
        <ProgressBar current={currentConditionProgressIndex} total={totalConditions} />
      </div>
 
      <h3 className="text-xl font-bold text-blue-800 mb-4">Part {currentConditionProgressIndex + 1} Questionnaire</h3>

      {/* Current condition progress */}
      <div className="mb-6">
        <ProgressBar current={currentQuestionIndex + 1} total={conditionQuestionnaire.questions.length} />
      </div>

      {/* Question navigation steps */}
      <StepIndicators
        steps={conditionQuestionnaire.questions.map((q, i) => `Q${i + 1}`)}
        currentStep={currentQuestionStepIndex}
        onStepClick={handleQuestionNavigation}
      />

      {/* Current question */}
      <div className="question bg-gray-50 p-6 rounded-lg mb-6">
        <p className="text-lg font-medium mb-4">{currentQuestion.text}</p>
        
        {currentQuestion.type === 'yes_no' ? (
          <div className="flex space-x-4">
            <button onClick={() => handleAnswer('Yes')} className="px-6 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition">Yes</button>
            <button onClick={() => handleAnswer('No')} className="px-6 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition">No</button>
          </div>
        ) : (
          <select 
            onChange={(e) => handleAnswer(e.target.value)} 
            value={answers[currentQuestionIndex] || ''}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                <option value="">Select an option</option>
                {currentQuestion.options?.map((option) => (
                <option key={option} value={option}>
                    {option}
                </option>
                ))}
          </select>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="justify-between">
        <div className='mb-3'>
          <span className="text-gray-600 self-center">
            Question {currentQuestionIndex + 1} of {conditionQuestionnaire.questions.length}
          </span>
        </div>
         
         <div className='flex'>
          <button
            onClick={() => {setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1)); setCurrentQuestionStepIndex(Math.max(0, currentQuestionStepIndex - 1));}}
            disabled={currentQuestionIndex === 0}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
        
          <button
            onClick={() => {
              if (currentQuestionIndex < conditionQuestionnaire.questions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                setCurrentQuestionStepIndex(currentQuestionStepIndex + 1)
              } else if (Object.keys(answers).length === conditionQuestionnaire.questions.length) {
                // Calculate score if all questions are answered
                const score = conditionQuestionnaire.questions.reduce((total, question, index) => {
                  return total + question.scoring[answers[index]];
                }, 0);
                const calculatedRiskLevel = score >= conditionQuestionnaire.min_score_threshold ? 'HighRisk' : 'Suspected';
                onComplete(answers, score, calculatedRiskLevel);
              }
            }}
            disabled={!answers[currentQuestionIndex]}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {currentQuestionIndex < conditionQuestionnaire.questions.length - 1 ? 'Next' : 'Complete'}
          </button>
         </div>
        
      </div>
    </div>
  );
};

export default ConditionQuestionnaire;