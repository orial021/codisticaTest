import { Task } from './tasks'

class Scheduler {
  // Maps to store tasks, completed tasks, failed tasks, and in-progress tasks
  private tasks: Map<string, Task> = new Map()
  private completedTasks: Set<string> = new Set()
  private failedTasks: Set<string> = new Set()
  private inProgressTasks: Set<string> = new Set()

  // Add a new task to the scheduler
  addTask(task: Task): void {
    if (this.tasks.has(task.id)) {
      throw new Error(`Task with id ${task.id} already exists.`)
    }
    this.tasks.set(task.id, task)
  }

  // Run all tasks in the scheduler
  async runAllTasks(): Promise<void> {
    const taskResults: { [key: string]: string } = {}

    for (const task of this.tasks.values()) {
      try {
        await this.runTask(task, taskResults)
      } catch (error: any) {
        throw new Error(`Error running task ${task.id}: ${error.message}`)
      }
    }

    console.log('Task execution results:', taskResults)
  }

  // Run a single task, ensuring dependencies are resolved
  private async runTask(task: Task, taskResults: { [key: string]: string }): Promise<void> {
    if (this.completedTasks.has(task.id) || this.failedTasks.has(task.id)) {
      return
    }

    if (this.inProgressTasks.has(task.id)) {
      this.markFailedTasks(task.id, taskResults)
      return
    }

    this.inProgressTasks.add(task.id)

    try {
      for (const dependencyId of task.dependencies) {
        if (this.failedTasks.has(dependencyId)) {
          this.failedTasks.add(task.id)
          taskResults[task.id] = `Failed: Dependency ${dependencyId} failed`
          this.inProgressTasks.delete(task.id)  // Remove from in-progress tasks
          return
        }
        if (!this.completedTasks.has(dependencyId)) {
          const dependencyTask = this.tasks.get(dependencyId)
          if (dependencyTask) {
            await this.runTask(dependencyTask, taskResults)
          } else {
            throw new Error(`Dependency ${dependencyId} does not exist.`)
          }
        }
      }

      // Additional check after resolving dependencies
      if (this.failedTasks.has(task.id)) {
        return
      }

      // Explicit check just before executing the task
      for (const dependencyId of task.dependencies) {
        if (this.failedTasks.has(dependencyId)) {
          this.failedTasks.add(task.id)
          taskResults[task.id] = `Failed: Dependency ${dependencyId} failed`
          this.inProgressTasks.delete(task.id)  // Remove from in-progress tasks
          return
        }
      }

      await task.execute()
      this.completedTasks.add(task.id)
      taskResults[task.id] = 'Success'
    } catch (error: any) {
      this.failedTasks.add(task.id)
      taskResults[task.id] = `Failed: ${error.message}`
    } finally {
      this.inProgressTasks.delete(task.id)
    }
  }

  // Mark tasks as failed due to circular dependencies
  private markFailedTasks(taskId: string, taskResults: { [key: string]: string }): void {
    const queue = [taskId]
    while (queue.length > 0) {
      const currentTaskId = queue.shift()
      if (currentTaskId && !this.failedTasks.has(currentTaskId)) {
        this.failedTasks.add(currentTaskId)
        taskResults[currentTaskId] = 'Skipped due to circular dependency'
        const currentTask = this.tasks.get(currentTaskId)
        if (currentTask) {
          for (const dependencyId of currentTask.dependencies) {
            queue.push(dependencyId)
          }
        }
      }
    }
  }
}

export default Scheduler
