/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from 'react';
import { QuestionnaireData } from '@/types/conditions';
import { ArrhythmiaRisk } from '@/types/client-profile';
import { useTranslation } from '@/hooks/useTranslation';

interface ConditionItemProps {
  risk: ArrhythmiaRisk;
  questionnaireData: QuestionnaireData;
}

const ConditionItem: React.FC<ConditionItemProps> = ({ risk, questionnaireData }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { t, i18n } = useTranslation();
  const conditionData = questionnaireData[risk.ArrhythmiaName];
  
  // Check if current language is Arabic
  const isArabic = i18n.language === 'ar';

  // Helper function to get localized question text
  const getQuestionText = (question: any) => {
    return isArabic && question.text_ar ? question.text_ar : question.text;
  };

  // Helper function to get localized answer text
  const getAnswerText = (question: any, answer: string) => {
    if (!answer) return t('conditions.notAnswered');
    
    // Handle basic Yes/No translations first
    if (isArabic) {
      switch (answer.toLowerCase()) {
        case 'yes':
          return t('assessment.yes');
        case 'no':
          return t('assessment.no');
        case 'sometimes':
          return t('assessment.sometimes');
        case 'never':
          return t('assessment.never');
        case 'always':
          return t('assessment.always');
        case 'often':
          return t('assessment.often');
        case 'rarely':
          return t('assessment.rarely');
      }
    }
    
    // Handle multiple choice options if they exist
    if (question.options) {
      const answerIndex = question.options.findIndex((option: string) => option === answer);
      
      // If Arabic options exist and we found the index, use the Arabic option
      if (isArabic && question.options_ar && answerIndex !== -1) {
        return question.options_ar[answerIndex];
      }
    }
    
    return answer;
  };

  // Helper function to get assessment text based on risk level
  const getAssessmentSummary = () => {
    if (risk.InitialRiskLevel === "Confirmed") {
      return t('conditions.assessmentTexts.confirmed');
    } else if (risk.QuestionnaireRiskLevel === "Suspected") {
      return t('conditions.assessmentTexts.suspectedPattern').replace('{conditionName}', risk.ArrhythmiaName);
    } else {
      return t('conditions.assessmentTexts.highRiskPattern').replace('{conditionName}', risk.ArrhythmiaName);
    }
  };

  const getAssessmentDescription = () => {
    if (risk.InitialRiskLevel === "Confirmed") {
      return t('conditions.assessmentTexts.confirmedDescription');
    } else if (risk.QuestionnaireRiskLevel === "Suspected") {
      return t('conditions.assessmentTexts.suspectedDescription').replace('{conditionName}', risk.ArrhythmiaName);
    } else {
      return t('conditions.assessmentTexts.highRiskDescription').replace('{conditionName}', risk.ArrhythmiaName);
    }
  };

  const getRecommendation = () => {
    if (risk.InitialRiskLevel === "Confirmed") {
      return null;
    } else if (risk.QuestionnaireRiskLevel === "Suspected") {
      return t('conditions.assessmentTexts.suspectedRecommendation');
    } else {
      return t('conditions.assessmentTexts.highRiskRecommendation').replace('{conditionName}', risk.ArrhythmiaName);
    }
  };

  return (
    <div className="flex flex-col space-y-4 bg-white rounded-lg shadow-sm p-4 md:p-6">
      {/* Header Section - Collapsible */}
      <div 
        className="flex items-center space-x-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Status Indicator */}
        <div className={`min-w-6 h-6 rounded-full ${risk.Detected ? 'bg-green-100' : 'bg-blue-100'} flex items-center justify-center`}>
          {risk.Detected ? (
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>

        {/* Condition Name and Confidence */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <span className={`font-medium truncate ${risk.Detected ? 'text-green-700' : 'text-gray-800'}`}>
              {risk.ArrhythmiaName}
            </span>
            <span className="text-sm text-gray-500 whitespace-nowrap">{t('conditions.confidenceRatio')}</span>
          </div>
          <div className="mt-1 flex items-center gap-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2 min-w-[100px]">
              <div
                className={`${risk.Detected ? 'bg-green-600' : 'bg-blue-600'} h-2 rounded-full`}
                style={{ width: `${risk.Confidence}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium whitespace-nowrap">{risk.Confidence.toFixed(2)}%</span>
          </div>
        </div>

        {/* Expand/Collapse Icon */}
        <svg
          className={`w-5 h-5 text-gray-500 transform transition-transform flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Expanded Content */}
      {isExpanded && conditionData && risk.Answers && (
        <div className="ml-2 sm:ml-10 pl-4 border-l-2 border-gray-200">
          <div className="bg-gray-50 rounded-lg p-4 md:p-6 space-y-4">
            
            {risk.InitialRiskLevel !== "Confirmed" ? (
              <>
              {/* Condition Header */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3 mb-4">
                <h4 className="text-lg md:text-xl font-semibold text-blue-800">{risk.ArrhythmiaName}</h4>
                <span className={`px-3 py-1 rounded-full text-xs md:text-sm font-medium ${
                  risk.QuestionnaireRiskLevel === 'HighRisk' 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {risk.QuestionnaireRiskLevel === 'HighRisk' ? t('conditions.highRisk') : t('conditions.mediumRisk')}
                </span>
              </div>

              {/* Questions & Answers */}
              <div className="space-y-4">
                <h5 className="text-md font-semibold text-gray-800">{t('conditions.questionnaireResponses')}</h5>
                <div className="space-y-4">
                  {conditionData.questions.map((question, qIndex) => (
                    <div key={qIndex} className="border-b border-gray-200 pb-4 last:border-0">
                      <p className="text-sm md:text-base font-medium text-gray-700">{getQuestionText(question)}</p>
                      <div className="mt-2 text-sm md:text-base">
                        <p className="text-gray-600">
                          <span className="font-medium">{t('conditions.answer')}: </span>
                          {risk.Answers?.[qIndex]?.Answer 
                            ? getAnswerText(question, risk.Answers[qIndex].Answer)
                            : t('conditions.notAnswered')
                          }
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
            ) : null}
 
            {/* Assessment Summary */}
            <div className="space-y-4 mt-6">
              <h4 className="text-lg md:text-xl font-semibold text-blue-800">{t('conditions.assessmentSummary')}</h4>
              <hr className="border-gray-200" />

              <div className="space-y-2">
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-800">{t('assessmentSummary.scenarios.noPatternDetected.title')}</span>
                  <span className="text-sm md:text-base mt-1 font-semibold">
                    {getAssessmentSummary()}
                  </span>
                </div>

                <div className="border-b border-gray-200 pb-4 last:border-0">
                  <p className="text-sm md:text-base text-gray-700">
                    {getAssessmentDescription()}
                  </p> 
                </div> 

                {risk.InitialRiskLevel !== "Confirmed" && (
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-800">{t('conditions.recommendation')}</span>
                    <span className="text-sm md:text-base mt-1">
                      {getRecommendation()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="space-y-4 mt-6">
              <h4 className="text-lg md:text-xl font-semibold text-blue-800">{t('conditions.disclaimer')}</h4>
              <hr className="border-gray-200" />
              <p className="text-sm md:text-base text-gray-700">
                {t('conditions.assessmentTexts.disclaimerText')}
              </p> 
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConditionItem;