export type Challenge = {
    id:string;
    title:string;
    description:string;
    rules:string[];
    difficulty:string;
    bonus?:string;
    progress?:number; // Track progress (e.g., points or completed tasks)
}