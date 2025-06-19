import { useEffect, useState } from 'react'; 
import Head from 'next/head'; 
import Cookies from 'js-cookie';
import Swal from "sweetalert2";

import { Button } from "@/components/ui/button";
import ConditionQuestionnaire from '@/components/condition-questionnaire';
import QuestionnaireSummary from '@/components/questionnaire-summary';
import { ConditionWithQuestionnaire, QuestionnaireAnswer, QuestionnaireData, RiskLevel } from '@/types/conditions';
import questionnaireData from '@/data/questionnaire.json';
import { useTranslation } from "@/hooks/useTranslation";

    
interface ClientAssessmentProps { 
  onNext: () => void;
  onPrev: () => void;
}

const ClientAssessment = ({onNext, onPrev}: ClientAssessmentProps) => { 
  const { t } = useTranslation();
  const [conditions, setConditions] = useState<ConditionWithQuestionnaire[]>([]);
  const [currentConditionIndex, setCurrentConditionIndex] = useState(0);
  const [showSummary, setShowSummary] = useState(false); 
  const [loading, setLoading] = useState(true)
  const [isQuestionnaireCompleted, setIsQuestionnaireCompleted] = useState(false);

  const conditionsNeedingQuestionnaires = conditions.filter(
    condition => condition.InitialRiskLevel === 'HighRisk' || condition.InitialRiskLevel === 'Suspected'
  );
 
  const currentCondition = conditionsNeedingQuestionnaires[currentConditionIndex];
  const conditionIndexInOriginalArray = currentCondition ? conditions.findIndex(
    c => c.ArrhythmiaName === currentCondition.ArrhythmiaName
  ) : 0;

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const userId = Cookies.get('userId');

    useEffect(() => {
        const fetchClientConditions = async () => {
            setLoading(true) 

            try {
                const response = await fetch(`${apiUrl}/Arrhythmia/GetArrhythmiaRequests?clientId=${userId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "ngrok-skip-browser-warning": "true",
                    },
                });

                const responseJson = await response.json();
                if (!responseJson.IsSuccess) throw new Error("Failed to fetch data");
                 
                const clientConditions: ConditionWithQuestionnaire[] = responseJson.Result;

                setConditions(clientConditions); 
            } catch (error) {
                console.error("Error fetching user data:", error) ;
            } finally {
                setLoading(false)
            }
        }

        fetchClientConditions()
    }, []);

  const handleQuestionnaireComplete = (
    conditionIndex: number,
    answers: Record<number, string>,
    score: number,
    calculatedRiskLevel: RiskLevel
  ) => {
    const mappedAnswers: QuestionnaireAnswer[] = Object.entries(answers).map(([index, answer]) =>
    ({
      ArrhythmiaResultId: 0,
      Index: parseInt(index),
      Answer: answer
    }));

    const updatedConditions = [...conditions];
    updatedConditions[conditionIndex] = {
      ...updatedConditions[conditionIndex],
      QuestionnaireRiskLevel: calculatedRiskLevel,
      QuestionnaireScore: score,
      Answers: mappedAnswers,
      questionnaire: {
        answers,
        score,
        calculatedRiskLevel
      }
    };

    setConditions(updatedConditions); 

    if (currentConditionIndex < conditionsNeedingQuestionnaires.length - 1) {
      setCurrentConditionIndex(currentConditionIndex + 1);
    } else {
      // All questionnaires completed, submit to backend
      //submitResults(updatedConditions);
      //setShowSummary(true);
      setIsQuestionnaireCompleted(true);
    }
  };

  const handleEditCondition = (conditionName: string) => {
    const index = conditionsNeedingQuestionnaires.findIndex(
      c => c.ArrhythmiaName === conditionName
    );
    setCurrentConditionIndex(index);
    setShowSummary(false);
  };

  const handleSubmit = async () => {
    await submitResults(conditions);
  };

  const submitResults = async (updatedConditions: ConditionWithQuestionnaire[]) => {
    try {
      const conditionsToUpdate = updatedConditions.filter(
        condition => condition.InitialRiskLevel === 'HighRisk' || condition.InitialRiskLevel === 'Suspected'
      );

      const response = await fetch(`${apiUrl}/Arrhythmia/EditArrhythmiaQuestionnaire`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          conditions: conditionsToUpdate,
        }),
      });

      const responseJson = await response.json();
                
      if (responseJson.IsSuccess) {
        onNext();
        // router.push(`/patient-summary/${router.query.patientId}`);
      } else {
        await Swal.fire({
            icon: "error",
            title: "Error!",
            text: responseJson.Message,
            confirmButtonColor: "#dc2626",
        });
        console.error('Failed to save results');
      }
    } catch (error) {
      await Swal.fire({
            icon: "error",
            title: "Error!",
            text: "Something went wrong, please try again later!",
            confirmButtonColor: "#dc2626",
        });
      console.error('Error saving results:', error);
    }
  };
 
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">{t('assessment.loadingClientData')}</p>
        </div>
      </div>
    )
  }

  if (conditionsNeedingQuestionnaires.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">        
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">{t('assessment.complete')}</h1>
          <p className="text-gray-600 mb-6">
            {t('assessment.noQuestionnairesRequired')}
          </p>

          <button
            onClick={onPrev}
            className="px-6 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition" 
          >
            {t('buttons.back')}
          </button>

          <button
            onClick={onNext}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition ml-2"
          >
            {t('buttons.continue')}
          </button> 
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>{t('assessment.patientAssessment')}</title>
      </Head>

       <div className="max-w-7xl mx-auto">
        <> 
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">{t('assessment.patientHealthAssessment')}</h1>
          {!isQuestionnaireCompleted ? (
            <ConditionQuestionnaire
              key={`condition-${currentConditionIndex}`}
              condition={currentCondition}
              questionnaireData={questionnaireData as unknown as QuestionnaireData}
              onComplete={(answers, score, calculatedRiskLevel) =>
                  handleQuestionnaireComplete(conditionIndexInOriginalArray, answers, score, calculatedRiskLevel)
              }
              currentConditionIndex={currentConditionIndex}
              totalConditions={conditionsNeedingQuestionnaires.length}
            />
          ):(
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">              
              <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">{t('assessment.complete')}</h1>
                <p className="text-gray-600 mb-6">
                  {t('assessment.completeSubtitle')}
                </p> 
              </div>
            </div>
          )} 
        </>
        {/* {showSummary ? (
            <QuestionnaireSummary
                conditions={conditions}
                questionnaireData={questionnaireData as unknown as QuestionnaireData}
                onSubmit={handleSubmit}
                onEdit={handleEditCondition}
            /> 
        ) : 
        (
          <> 
            <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">{t('assessment.patientHealthAssessment')}</h1>
            
            <ConditionQuestionnaire
                key={`condition-${currentConditionIndex}`}
                condition={currentCondition}
                questionnaireData={questionnaireData as unknown as QuestionnaireData}
                onComplete={(answers, score, calculatedRiskLevel) =>
                    handleQuestionnaireComplete(conditionIndexInOriginalArray, answers, score, calculatedRiskLevel)
                }
                currentConditionIndex={currentConditionIndex}
                totalConditions={conditionsNeedingQuestionnaires.length}
            />
          </>
        )} */}
      </div>

      <div className="flex justify-between pt-6">
        <Button
        onClick={onPrev}
        className="text-xl py-6 px-10 bg-gray-200 text-gray-800 hover:bg-gray-300"
        >
        {t('buttons.back')}
        </Button>

        <Button
          onClick={handleSubmit}
          disabled={!isQuestionnaireCompleted}
          className="text-xl py-6 px-10 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {t('buttons.continue')}
        </Button>
    </div>
    </div>

  );
};
  
export default ClientAssessment;