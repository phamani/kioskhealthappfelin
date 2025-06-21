/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from 'react';
import { QuestionnaireData } from '@/types/conditions';
import { ArrhythmiaRisk } from '@/types/client-profile';

interface ConditionItemProps {
  risk: ArrhythmiaRisk;
  questionnaireData: QuestionnaireData;
}

const ConditionItem: React.FC<ConditionItemProps> = ({ risk, questionnaireData }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const conditionData = questionnaireData[risk.ArrhythmiaName];

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
            <span className="text-sm text-gray-500 whitespace-nowrap">Confidence Ratio</span>
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
            
            {risk.InitialRiskLevel != "Confirmed" ? (
              <>
              {/* Condition Header */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3 mb-4">
                <h4 className="text-lg md:text-xl font-semibold text-blue-800">{risk.ArrhythmiaName}</h4>
                <span className={`px-3 py-1 rounded-full text-xs md:text-sm font-medium ${
                  risk.QuestionnaireRiskLevel === 'HighRisk' 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {risk.QuestionnaireRiskLevel === 'HighRisk' ? "High Risk" : "Medium Risk"}
                </span>
              </div>



              {/* Questions & Answers */}
              <div className="space-y-4">
                <h5 className="text-md font-semibold text-gray-800">Questionnaire Responses</h5>
                <div className="space-y-4">
                  {conditionData.questions.map((question, qIndex) => (
                    <div key={qIndex} className="border-b border-gray-200 pb-4 last:border-0">
                      <p className="text-sm md:text-base font-medium text-gray-700">{question.text}</p>
                      <div className="mt-2 text-sm md:text-base">
                        <p className="text-gray-600">
                          <span className="font-medium">Answer: </span>
                          {risk.Answers?.[qIndex]?.Answer || 'Not answered'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
            ) : ("")}
 
            {/* Assessment Summary */}
            <div className="space-y-4 mt-6">
              <h4 className="text-lg md:text-xl font-semibold text-blue-800">Assessment Summary</h4>
              <hr className="border-gray-200" />

              <div className="space-y-2">
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-800">ASSESSMENT SUMMARY:</span>
                  <span className="text-sm md:text-base mt-1 font-semibold">
                    {risk.InitialRiskLevel == "Confirmed" ? 
                      `No cardiac arrhythmia patterns detected` : 
                      risk.QuestionnaireRiskLevel == "Suspected" ? 
                      `Potential ${risk.ArrhythmiaName} pattern detected; questionnaire does not support finding` : 
                      `Potential ${risk.ArrhythmiaName} pattern detected; questionnaire supports finding`}
                  </span>
                </div>

                <div className="border-b border-gray-200 pb-4 last:border-0">
                  <p className="text-sm md:text-base text-gray-700">
                    {risk.InitialRiskLevel == "Confirmed" ? 
                      `The AI-based facial analysis did not detect abnormal RR interval patterns associated with the cardiac conditions screened. This screening tool analyzes facial video for RR interval patterns and is not equivalent to diagnostic tests. A negative result does not rule out cardiac conditions.` : 
                    risk.QuestionnaireRiskLevel == "Suspected" ? 
                      `The AI detected RR interval patterns consistent with potential ${risk.ArrhythmiaName}, but questionnaire responses did not indicate typical symptoms. A single abnormal pattern may occur due to technical factors during screening.` : 
                      `The AI-based facial analysis detected RR interval patterns consistent with potential ${risk.ArrhythmiaName}. The patient's responses to the targeted questionnaire indicated symptoms and risk factors that align with this finding. While this screening combines AI pattern recognition with symptom assessment, it is not diagnostic and requires clinical confirmation`}
                  </p> 
                </div> 

                {risk.InitialRiskLevel != "Confirmed" && (
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-800">RECOMMENDATION:</span>
                    <span className="text-sm md:text-base mt-1">
                      {risk.InitialRiskLevel == "Suspected" ? 
                        `Moderate risk assessment (YELLOW). Consider repeating screening 5 additional times to establish pattern consistency.` : 
                        `High risk assessment (RED). Clinical evaluation recommended to assess for ${risk.ArrhythmiaName} using standard diagnostic protocols.`}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="space-y-4 mt-6">
              <h4 className="text-lg md:text-xl font-semibold text-blue-800">Disclaimer</h4>
              <hr className="border-gray-200" />
              <p className="text-sm md:text-base text-gray-700">
                This screening tool supplements clinical judgment only. It uses facial video analysis to detect potential RR interval patterns. A single screening provides preliminary information only.
                Positive findings require clinical correlation and diagnostic testing. Negative findings do not rule out cardiac conditions. Apply professional judgment when interpreting results.
              </p> 
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConditionItem;