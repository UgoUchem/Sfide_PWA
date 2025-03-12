export type Challenge = {
  id: number;
  name: string;
  description: string;
  rules: string[];
  difficulty: string;
  bonus: string;
  actionsRequired: string[];
  maxViolations: number;
};
