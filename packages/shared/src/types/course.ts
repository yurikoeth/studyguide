export type ExamCode = "220-1201" | "220-1202";

export interface Domain {
  id: string;
  exam: ExamCode;
  name: string;
  number: number;
  percentage: number;
  objectives: Objective[];
}

export interface Objective {
  id: string;
  description: string;
  subTopics: string[];
}

export interface Video {
  id: string;
  title: string;
  domainId: string;
  objectiveId: string;
  exam: ExamCode;
  youtubeId: string;
  order: number;
}

export interface VideoProgress {
  videoId: string;
  watched: boolean;
  watchedAt: number | null;
  notes: string | null;
}
