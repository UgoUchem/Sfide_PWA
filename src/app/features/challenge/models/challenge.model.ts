export type Challenge = {
  id: string;
  name: string;
  description: string;
  rules: string[];
  difficulty: string;
  bonus: string;
  actionsRequired: string[];
  maxViolations: number;
  assignedTo: string[]; // list of usernames assigned
};
