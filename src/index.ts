import Scheduler from './tasks/scheduler';

const scheduler = new Scheduler();

// Variable para condicionar fallos
let failCondition = false;

scheduler.addTask({
  id: "taskA",
  execute: async () => { 
    console.log("Executing taskA"); 
  },
  dependencies: ["taskB", "taskC"]
});

scheduler.addTask({
  id: "taskB",
  execute: async () => { 
    console.log("Executing taskB"); 
    const randomCondition = 1;
    if (randomCondition > 0.7) {
      throw new Error("TaskB failed due to random condition");
    }
  },
  dependencies: ["taskC"]
});

scheduler.addTask({
  id: "taskC",
  execute: async () => { 
    console.log("Executing taskC"); 
    // Simula la finalización exitosa
  },
  dependencies: []
});

scheduler.addTask({
  id: "taskD",
  execute: async () => { 
    console.log("Executing taskD"); 
  },
  dependencies: ["taskA"]
});

scheduler.addTask({
  id: "taskE",
  execute: async () => { 
    console.log("Executing taskE"); 
    // Fallo condicionado
    if (failCondition) {
      throw new Error("TaskE failed due to conditional logic");
    }
  },
  dependencies: ["taskD"]
});

scheduler.addTask({
  id: "taskF",
  execute: async () => { 
    console.log("Executing taskF"); 
    // Activar condición de fallo
    failCondition = true;
  },
  dependencies: ["taskE"]
});

scheduler.addTask({
  id: "taskG",
  execute: async () => { 
    console.log("Executing taskG"); 
    // No tiene dependencias
  },
  dependencies: []
});

scheduler.addTask({
  id: "taskH",
  execute: async () => { 
    console.log("Executing taskH"); 
  },
  dependencies: ["taskA", "taskG"]
});

// Simulación de una dependencia circular
scheduler.addTask({
  id: "taskI",
  execute: async () => { 
    console.log("Executing taskI"); 
  },
  dependencies: ["taskJ"]
});

scheduler.addTask({
  id: "taskJ",
  execute: async () => { 
    console.log("Executing taskJ"); 
  },
  dependencies: ["taskI"]
});

(async () => {
  await scheduler.runAllTasks();
})();
