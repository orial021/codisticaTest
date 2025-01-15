export interface Task {
    id: string;
    execute: () => Promise<void>;
    dependencies: string[];
  }
  