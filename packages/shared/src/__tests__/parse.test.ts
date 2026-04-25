import { describe, it, expect } from "vitest";
import { parseAIResponse } from "../ai/parse.js";

describe("AI Response Parser", () => {
  const validQuestion = {
    stem: "A technician is replacing a laptop battery. Which of the following should be done FIRST?",
    choices: [
      { id: "A", text: "Remove the old battery" },
      { id: "B", text: "Power off the laptop" },
      { id: "C", text: "Disconnect the AC adapter" },
      { id: "D", text: "Ground yourself with an ESD strap" },
    ],
    correctChoiceId: "B",
    explanation:
      "The first step is to power off the laptop. A is wrong because you should not remove the battery while the laptop is on. C is a good step but comes after powering off. D is important but the immediate first step is powering off.",
    tags: ["laptop", "battery", "safety"],
    difficulty: "easy",
  };

  it("parses valid JSON array", () => {
    const input = JSON.stringify([validQuestion]);
    const result = parseAIResponse(input);
    expect(result).toHaveLength(1);
    expect(result[0].stem).toContain("technician");
    expect(result[0].choices).toHaveLength(4);
    expect(result[0].correctChoiceId).toBe("B");
  });

  it("handles markdown code fence wrapping", () => {
    const input = "```json\n" + JSON.stringify([validQuestion]) + "\n```";
    const result = parseAIResponse(input);
    expect(result).toHaveLength(1);
  });

  it("rejects invalid JSON", () => {
    expect(() => parseAIResponse("not json")).toThrow();
  });

  it("rejects questions with wrong number of choices", () => {
    const bad = {
      ...validQuestion,
      choices: [{ id: "A", text: "only one" }],
    };
    expect(() => parseAIResponse(JSON.stringify([bad]))).toThrow();
  });

  it("rejects questions with invalid choice IDs", () => {
    const bad = {
      ...validQuestion,
      choices: [
        { id: "1", text: "wrong id format" },
        { id: "2", text: "wrong" },
        { id: "3", text: "wrong" },
        { id: "4", text: "wrong" },
      ],
    };
    expect(() => parseAIResponse(JSON.stringify([bad]))).toThrow();
  });

  it("rejects questions with too-short stems", () => {
    const bad = { ...validQuestion, stem: "Short?" };
    expect(() => parseAIResponse(JSON.stringify([bad]))).toThrow();
  });

  it("parses multiple questions", () => {
    const input = JSON.stringify([validQuestion, validQuestion, validQuestion]);
    const result = parseAIResponse(input);
    expect(result).toHaveLength(3);
  });
});
