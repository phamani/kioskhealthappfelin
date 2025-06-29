import React from 'react';
import { ConditionWithQuestionnaire, QuestionnaireData } from '@/types/conditions';

interface SummaryProps {
  conditions: ConditionWithQuestionnaire[];
  questionnaireData: QuestionnaireData;
  onSubmit: () => void;
  onEdit: (conditionName: string) => void;
}

const QuestionnaireSummary: React.FC<SummaryProps> = ({ 
  conditions, 
  questionnaireData, 
  onSubmit, 
  onEdit 
}) => {
  const conditionsWithQuestionnaires = conditions.filter(
    condition => condition.questionnaire
  );

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Review Your Answers</h2>
      <p className="text-gray-600 mb-8">
        Please review all your answers below. You can edit any questionnaire before final submission.
      </p>

      <div className="space-y-8">
        {conditionsWithQuestionnaires.map((condition) => {
          const conditionData = questionnaireData[condition.ArrhythmiaName];
          
          return (
            <div key={condition.ArrhythmiaName} className="border border-gray-200 rounded-lg p-5">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-blue-800">
                  {condition.ArrhythmiaName}
                </h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  condition.questionnaire?.calculatedRiskLevel === 'HighRisk' 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-orange-100 text-orange-800'
                }`}>
                  {condition.questionnaire?.calculatedRiskLevel === 'HighRisk' ? "High Risk" : "Suspected"}
                </span>
              </div>

              <div className="mb-2">
                <span className="font-medium">Score: </span>
                <span>
                  {condition.questionnaire?.score} / {conditionData.calculated_max_score}
                </span>
              </div>

              <div className="space-y-4 mt-4">
                {conditionData.questions.map((question, qIndex) => (
                  <div key={qIndex} className="border-b border-gray-100 pb-4 last:border-0">
                    <p className="font-medium text-gray-700">{question.text}</p>
                    <div className="flex justify-between mt-1">
                      <p className="text-gray-600">
                        Answer: <span className="font-medium">
                          {condition.questionnaire?.answers[qIndex]}
                        </span>
                      </p>
                      <p className="text-gray-600">
                        Score: {question.scoring[condition.questionnaire?.answers[qIndex] || 0]}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => onEdit(condition.ArrhythmiaName)}
                className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                Edit Answers
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-10 pt-6 border-t border-gray-200 flex justify-end space-x-4">
        <button
          onClick={onSubmit}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
        >
          Submit All Answers
        </button>
      </div>
    </div>
  );
};

export default QuestionnaireSummary;