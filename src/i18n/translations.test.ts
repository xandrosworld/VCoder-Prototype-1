import { describe, expect, it } from "vitest";
import { learningContent } from "../data/learningContent";
import { translateText } from "./translations";

describe("translateText", () => {
  it("translates language switcher and tour controls", () => {
    expect(translateText("Language", "vi")).toBe("Ngôn ngữ");
    expect(translateText("Skip", "vi")).toBe("Bỏ qua");
    expect(translateText("Next (1 of 10)", "vi")).toBe("Tiếp (1/10)");
  });

  it("translates dynamic assessment labels", () => {
    expect(translateText("Assessment not started", "vi")).toBe("Bài đánh giá chưa bắt đầu");
    expect(translateText("P1 MCQ", "vi")).toBe("P1 Trắc nghiệm");
    expect(translateText("P5 Mini-viva", "vi")).toBe("P5 Phỏng vấn ngắn");
  });

  it("matches generated long-form text after whitespace changes", () => {
    const source = learningContent.find((lesson) => lesson.id === "lesson-2a")!.body;

    const translated = translateText(source, "vi");

    expect(translated).toContain("Tại sao CI xanh không đủ");
    expect(translated).not.toContain("Why CI green is not enough");
  });
});
