import { z } from "zod";

const ChoiceSchema = z.object({
  id: z.enum(["A", "B", "C", "D"]),
  text: z.string().min(1),
});

const GeneratedQuestionSchema = z.object({
  stem: z.string().min(10),
  choices: z.array(ChoiceSchema).length(4),
  correctChoiceId: z.enum(["A", "B", "C", "D"]),
  explanation: z.string().min(10),
  tags: z.array(z.string()),
  difficulty: z.enum(["easy", "medium", "hard"]),
});

export const GeneratedQuestionsSchema = z.array(GeneratedQuestionSchema);

export type GeneratedQuestion = z.infer<typeof GeneratedQuestionSchema>;

export function parseAIResponse(text: string): GeneratedQuestion[] {
  // Try to extract JSON from the response (handle markdown code blocks)
  let jsonStr = text.trim();

  // Strip markdown code fences if present
  const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    jsonStr = jsonMatch[1].trim();
  }

  const parsed = JSON.parse(jsonStr);
  return GeneratedQuestionsSchema.parse(parsed);
}
