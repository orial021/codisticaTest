import Scheduler from '../tasks/scheduler';

describe('Scheduler', () => {
  it('should run tasks in the correct order', async () => {
    const scheduler = new Scheduler();

    const mockTaskA = jest.fn(async () => {});
    const mockTaskB = jest.fn(async () => {});
    const mockTaskC = jest.fn(async () => {});

    scheduler.addTask({
      id: 1,
      execute: mockTaskA,
      dependencies: [2, 3]
    });

    scheduler.addTask({
      id: 2,
      execute: mockTaskB,
      dependencies: [3]
    });

    scheduler.addTask({
      id: 3,
      execute: mockTaskC,
      dependencies: []
    });

    await scheduler.runAllTasks();

    expect(mockTaskC).toHaveBeenCalled();
    expect(mockTaskB).toHaveBeenCalled();
    expect(mockTaskA).toHaveBeenCalled();

    const callOrder = [
      mockTaskC.mock.invocationCallOrder[0],
      mockTaskB.mock.invocationCallOrder[0],
      mockTaskA.mock.invocationCallOrder[0]
    ];

    expect(callOrder).toEqual(callOrder.sort());
  });

  it('should detect and handle circular dependencies', async () => {
    const scheduler = new Scheduler();

    const mockTaskI = jest.fn(async () => {});
    const mockTaskJ = jest.fn(async () => {});

    scheduler.addTask({
      id: 4,
      execute: mockTaskI,
      dependencies: [5]
    });

    scheduler.addTask({
      id: 5,
      execute: mockTaskJ,
      dependencies: [4]
    });

    await scheduler.runAllTasks();

    expect(mockTaskI).not.toHaveBeenCalled();
    expect(mockTaskJ).not.toHaveBeenCalled();
  });

  it('should handle failed tasks and prevent dependent tasks from running', async () => {
    const scheduler = new Scheduler();

    const mockTaskA = jest.fn(async () => {});
    const mockTaskB = jest.fn(async () => { 
      throw new Error("TaskB failed");
    });
    const mockTaskC = jest.fn(async () => {});

    scheduler.addTask({
      id: 6,
      execute: mockTaskA,
      dependencies: [7]
    });

    scheduler.addTask({
      id: 7,
      execute: mockTaskB,
      dependencies: [8]
    });

    scheduler.addTask({
      id: 8,
      execute: mockTaskC,
      dependencies: []
    });

    await scheduler.runAllTasks();

    expect(mockTaskC).toHaveBeenCalled();
    expect(mockTaskB).toHaveBeenCalled();
    expect(mockTaskA).not.toHaveBeenCalled();  // TaskA should not be called due to TaskB failure
  });

  it('should run independent tasks immediately', async () => {
    const scheduler = new Scheduler();

    const mockTaskA = jest.fn(async () => {});
    const mockTaskB = jest.fn(async () => {});

    scheduler.addTask({
      id: 9,
      execute: mockTaskA,
      dependencies: []
    });

    scheduler.addTask({
      id: 10,
      execute: mockTaskB,
      dependencies: []
    });

    await scheduler.runAllTasks();

    expect(mockTaskA).toHaveBeenCalled();
    expect(mockTaskB).toHaveBeenCalled();
  });
});
