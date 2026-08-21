import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import LearnerProgressBadge from "../components/LearnerProgressBadge";


describe("LearnerProgressBadge", () => {
  it("renders the default state with its default label", () => {
    render(<LearnerProgressBadge status="default" />);
    expect(screen.getByText("Not Started")).toBeInTheDocument();
  });

  it("renders the in-progress state with its default label", () => {
    render(<LearnerProgressBadge status="in-progress" />);
    expect(screen.getByText("In Progress")).toBeInTheDocument();
  });

  it("renders the completed state with its default label", () => {
    render(<LearnerProgressBadge status="completed" />);
    expect(screen.getByText("Completed")).toBeInTheDocument();
  });

  it("renders the disabled state with its default label", () => {
    render(<LearnerProgressBadge status="disabled" />);
    expect(screen.getByText("Locked")).toBeInTheDocument();
  });

  it("falls back to the default state when no status is provided", () => {
    render(<LearnerProgressBadge />);
    expect(screen.getByText("Not Started")).toBeInTheDocument();
  });

  it("renders a custom label instead of the default one when provided", () => {
    render(<LearnerProgressBadge status="in-progress" label="3/10 Lessons" />);
    expect(screen.getByText("3/10 Lessons")).toBeInTheDocument();
    expect(screen.queryByText("In Progress")).not.toBeInTheDocument();
  });

  it("marks the disabled state as aria-disabled for accessibility", () => {
    render(<LearnerProgressBadge status="disabled" />);
    const badge = screen.getByRole("status");
    expect(badge).toHaveAttribute("aria-disabled", "true");
  });

  it("does not mark non-disabled states as aria-disabled", () => {
    render(<LearnerProgressBadge status="completed" />);
    const badge = screen.getByRole("status");
    expect(badge).not.toHaveAttribute("aria-disabled");
  });

  it("exposes an accessible status role with a matching label for screen readers", () => {
    render(<LearnerProgressBadge status="completed" />);
    const badge = screen.getByRole("status", { name: "Completed" });
    expect(badge).toBeInTheDocument();
  });

  it("applies an extra custom className when provided", () => {
    render(<LearnerProgressBadge status="default" className="my-extra-class" />);
    const badge = screen.getByRole("status");
    expect(badge.className).toContain("my-extra-class");
  });
});