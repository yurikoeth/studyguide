import type { Domain, Objective, Video } from "../types/course.js";
import type { DifficultyLevel } from "../types/question.js";

export const SYSTEM_PROMPT = `You are a CompTIA A+ certification exam question generator. Generate practice questions that closely mirror the style, difficulty, and format of real CompTIA A+ exam questions.

Rules:
- Each question must have exactly 4 answer choices labeled A, B, C, D
- Exactly one choice is correct
- Include scenario-based questions where appropriate ("A technician is troubleshooting...")
- The explanation must explain WHY the correct answer is right AND briefly why each wrong answer is wrong
- Use technical terminology accurately
- Vary question styles: straightforward recall, application/scenario, and analysis
- Return valid JSON only, no markdown or extra text`;

export function buildGenerationPrompt(
  domain: Domain,
  objective: Objective,
  video: Video,
  difficulty: DifficultyLevel,
  count: number
): string {
  return `Generate ${count} CompTIA A+ practice questions.

Exam: ${domain.exam} (Core 1)
Domain ${domain.number}: ${domain.name} (${domain.percentage}% of exam)
Objective ${objective.id}: ${objective.description}
Specific Topic: ${video.title}
Related Sub-Topics: ${objective.subTopics.join(", ")}
Difficulty: ${difficulty}

Return as a JSON array with this exact structure:
[
  {
    "stem": "The question text here",
    "choices": [
      { "id": "A", "text": "First option" },
      { "id": "B", "text": "Second option" },
      { "id": "C", "text": "Third option" },
      { "id": "D", "text": "Fourth option" }
    ],
    "correctChoiceId": "A",
    "explanation": "Detailed explanation of why A is correct and why B, C, D are wrong",
    "tags": ["relevant", "topic", "tags"],
    "difficulty": "${difficulty}"
  }
]`;
}
