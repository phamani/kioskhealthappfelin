export type RiskLevel = 'Confirmed' | 'Suspected' | 'HighRisk';

export interface ApiConditionResult {
  Id: number,
  IsDetected: boolean;
  Confidence: number;
  InitialRiskLevel: RiskLevel;
  QuestionnaireRiskLevel: RiskLevel;
  QuestionnaireScore: number;
  Answers: QuestionnaireAnswer[]
}

export interface ConditionWithQuestionnaire extends ApiConditionResult {
  ArrhythmiaName: string;
  questionnaire?: {
    answers: Record<number, string>; 
    score: number;
    calculatedRiskLevel: RiskLevel;
  };
}

export interface Question {
  text: string;
  type: string; 
  options?: string[];
  scoring: Record<string, number>;
}

export interface ConditionQuestionnaire {
  questions: Question[];
  min_score_threshold: number;
  calculated_max_score: number;
}

export interface QuestionnaireAnswer{
    ArrhythmiaResultId: number,
    Index: number,
    Answer: string
}

export type QuestionnaireData = Record<string, ConditionQuestionnaire>;