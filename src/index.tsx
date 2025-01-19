import React from "react";
import ReactDOM from "react-dom/client";
import Scheduler from './tasks/scheduler';
import App from "./App";

const scheduler = new Scheduler();

// Variable para condicionar fallos
// let failCondition = false;

scheduler.addTask({
  id: 1,
  execute: async () => { 
    const rootElement = document.getElementById("root");
    if (rootElement) {
      const root = ReactDOM.createRoot(rootElement);
      root.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      )
    }
  },
  dependencies: []
});

// scheduler.addTask({
//   id: 2,
//   execute: async () => { 
//     console.log("Executing task 2"); 
//     const randomCondition = 1;
//     if (randomCondition > 0.7) {
//       throw new Error("Task 2 failed due to random condition");
//     }
//   },
//   dependencies: [3]
// });

// scheduler.addTask({
//   id: 3,
//   execute: async () => { 
//     console.log("Executing task 3"); 
//     // Simulates successful completion
//   },
//   dependencies: []
// });

// scheduler.addTask({
//   id: 4,
//   execute: async () => { 
//     console.log("Executing task 4"); 
//   },
//   dependencies: [1]
// });

// scheduler.addTask({
//   id: 5,
//   execute: async () => { 
//     console.log("Executing task 5"); 
//     // Conditional failure
//     if (failCondition) {
//       throw new Error("Task 5 failed due to conditional logic");
//     }
//   },
//   dependencies: [4]
// });

// scheduler.addTask({
//   id: 6,
//   execute: async () => { 
//     console.log("Executing task 6"); 
//     // Activate failure condition
//     failCondition = true;
//   },
//   dependencies: [5]
// });

// scheduler.addTask({
//   id: 7,
//   execute: async () => { 
//     console.log("Executing task7"); 
//     // No dependencies
//   },
//   dependencies: []
// });

// scheduler.addTask({
//   id: 8,
//   execute: async () => { 
//     console.log("Executing task 8"); 
//   },
//   dependencies: [1, 7]
// });

// // Simulating a circular dependency
// scheduler.addTask({
//   id: 9,
//   execute: async () => { 
//     console.log("Executing task 9"); 
//   },
//   dependencies: [10]
// });

// scheduler.addTask({
//   id: 10,
//   execute: async () => { 
//     console.log("Executing task 10"); 
//   },
//   dependencies: [9]
// });

(async () => {
  await scheduler.runAllTasks();
})();
