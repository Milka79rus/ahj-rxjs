export default class StatsWidget {
  constructor(elementId, store) {
    this.element = document.getElementById(elementId);
    this.store = store;
  }

  init() {
    // Подписываемся на изменения в Сторе
    this.store.state$.subscribe((state) => {
      this.render(state.projects);
    });
  }

  render(projects) {
    this.element.innerHTML = '';

    projects.forEach((project) => {
      // Считаем только открытые задачи (где done === false)
      const openTasksCount = project.tasks.filter((task) => !task.done).length;

      const li = document.createElement('li');
      li.className = 'stats-item';
      li.innerHTML = `
        <strong class="project-name">${project.name}</strong>
        <span class="badge">${openTasksCount}</span>
      `;
      this.element.appendChild(li);
    });
  }
}
