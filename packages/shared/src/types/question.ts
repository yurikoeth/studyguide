export type DifficultyLevel = "easy" | "medium" | "hard";

export interface Choice {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  videoId: string;
  domainId: string;
  objectiveId: string;
  difficulty: DifficultyLevel;
  stem: string;
  choices: Choice[];
  correctChoiceId: string;
  explanation: string;
  tags: string[];
  createdAt: number;
}
