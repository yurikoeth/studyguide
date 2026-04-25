import Anthropic from "@anthropic-ai/sdk";
import type { Domain, Objective, Video } from "../types/course.js";
import type { DifficultyLevel, Question } from "../types/question.js";
import { SYSTEM_PROMPT, buildGenerationPrompt } from "./prompts.js";
import { parseAIResponse } from "./parse.js";

export async function generateQuestions(
  apiKey: string,
  domain: Domain,
  objective: Objective,
  video: Video,
  difficulty: DifficultyLevel = "medium",
  count: number = 5
): Promise<Question[]> {
  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: buildGenerationPrompt(domain, objective, video, difficulty, count),
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";
  const generated = parseAIResponse(text);

  const now = Date.now();
  return generated.map((q, i) => ({
    id: `${video.id}-${now}-${i}`,
    videoId: video.id,
    domainId: domain.id,
    objectiveId: objective.id,
    difficulty: q.difficulty,
    stem: q.stem,
    choices: q.choices,
    correctChoiceId: q.correctChoiceId,
    explanation: q.explanation,
    tags: q.tags,
    createdAt: now,
  }));
}
