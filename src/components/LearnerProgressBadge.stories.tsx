import LearnerProgressBadge from "./LearnerProgressBadge";

export default {
  title: "Components/LearnerProgressBadge",
  component: LearnerProgressBadge,
  argTypes: {
    status: {
      control: "select",
      options: ["default", "in-progress", "completed", "disabled"],
    },
  },
};

export const Default = {
  args: { status: "default" },
};

export const InProgress = {
  args: { status: "in-progress" },
};

export const Completed = {
  args: { status: "completed" },
};

export const Disabled = {
  args: { status: "disabled" },
};

// Shows all 4 states together, side by side — useful for quick visual QA
export const AllStates = {
  render: () => (
    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
      <LearnerProgressBadge status="default" />
      <LearnerProgressBadge status="in-progress" />
      <LearnerProgressBadge status="completed" />
      <LearnerProgressBadge status="disabled" />
    </div>
  ),
};

// Example with a custom label instead of the default one
export const CustomLabel = {
  args: { status: "in-progress", label: "3/10 Lessons" },
};