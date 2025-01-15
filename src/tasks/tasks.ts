export interface Task {
    id: number;
    execute: () => Promise<void>;
    dependencies: number[];
  }
  