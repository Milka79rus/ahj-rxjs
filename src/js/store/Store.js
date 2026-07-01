import { BehaviorSubject } from 'rxjs';

export default class Store {
  constructor(initialState) {
    this.subject = new BehaviorSubject(initialState);
    this.state$ = this.subject.asObservable();
  }

  // Быстрый способ получить текущие данные без подписки
  get state() {
    return this.subject.getValue();
  }

  // Переключение флажка задачи (done: true/false)
  toggleTask(projectId, taskId) {
    const updatedProjects = this.state.projects.map((project) => {
      if (project.id === projectId) {
        const updatedTasks = project.tasks.map((task) => {
          if (task.id === taskId) {
            return { ...task, done: !task.done };
          }
          return task;
        });
        return { ...project, tasks: updatedTasks };
      }
      return project;
    });

    // Пушим обновленное состояние всем подписчикам
    this.subject.next({ projects: updatedProjects });
  }
}
