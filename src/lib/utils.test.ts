import { describe, expect, it } from "vitest";
import { cn } from "./utils";

describe("cn utility function", () => {
  it("should merge class names", () => {
    const result = cn("text-red-500", "font-bold");

    expect(result).toContain("text-red-500");
    expect(result).toContain("font-bold");
  });

  it("should merge conflicting Tailwind classes", () => {
    const result = cn("px-2", "px-4");

    expect(result).toBe("px-4");
  });

  it("should handle conditional classes", () => {
    const isActive = true;

    const result = cn(
      "button",
      isActive && "active",
      !isActive && "disabled",
    );

    expect(result).toContain("button");
    expect(result).toContain("active");
    expect(result).not.toContain("disabled");
  });
});