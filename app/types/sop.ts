// SOP 相關的 TypeScript 類型定義

export interface SOPStep {
  id: string;
  title: string;
  description: string;
  order: number;
}

export interface SOP {
  id: string;
  title: string;
  purpose: string;
  inputs: string[];
  steps: SOPStep[];
  outputs: string[];
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
}

export interface CreateSOPRequest {
  title: string;
  purpose: string;
  inputs: string[];
  steps: Omit<SOPStep, 'id'>[];
  outputs: string[];
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  tags?: string[];
}

export interface AISuggestionRequest {
  field: 'purpose' | 'inputs' | 'steps' | 'outputs' | 'faqs';
  context: string;
  currentContent?: string;
}

export interface AISuggestionResponse {
  suggestions: string[];
  confidence: number;
}

