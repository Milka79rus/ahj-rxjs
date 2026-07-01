export default class TasksWidget {
  constructor(selectorId, listId, store) {
    this.selector = document.getElementById(selectorId);
    this.list = document.getElementById(listId);
    this.store = store;
    this.selectedProjectId = null;
  }

  init() {
    const initialProjects = this.store.state.projects;
    if (initialProjects.length > 0) {
      this.selectedProjectId = initialProjects[0].id;
    }

    this.renderSelector(initialProjects);

    // Слушаем смену проекта в селекторе
    this.selector.addEventListener('change', (e) => {
      this.selectedProjectId = Number(e.target.value);
      this.renderTasks(this.store.state.projects);
    });

    // Подписываемся на Стор, чтобы перерисовывать задачи при кликах
    this.store.state$.subscribe((state) => {
      this.renderTasks(state.projects);
    });
  }

  renderSelector(projects) {
    this.selector.innerHTML = projects.map((p) => `<option value="${p.id}">${p.name}</option>`).join('');
  }

  renderTasks(projects) {
    this.list.innerHTML = '';
    const currentProject = projects.find((p) => p.id === this.selectedProjectId);

    if (!currentProject) return;

    currentProject.tasks.forEach((task) => {
      const li = document.createElement('li');
      li.className = 'task-item';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = task.done;

      checkbox.addEventListener('change', () => {
        this.store.toggleTask(this.selectedProjectId, task.id);
      });

      const label = document.createElement('span');
      label.textContent = task.name;
      if (task.done) {
        label.classList.add('completed');
      }

      li.appendChild(checkbox);
      li.appendChild(label);
      this.list.appendChild(li);
    });
  }
}
