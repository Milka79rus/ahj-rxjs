import PollingWidget from './PollingWidget';
import PostsWidget from './PostsWidget';
import Store from './store/Store';
import StatsWidget from './components/StatsWidget';
import TasksWidget from './components/TasksWidget';

const initialDashboardData = {
  projects: [
    {
      id: 1,
      name: 'iOS App',
      tasks: [
        { id: 101, name: 'Push Notifications', done: true },
        { id: 102, name: 'Apple Pay Support', done: false },
        { id: 103, name: 'Fix crash on iOS 15', done: false },
      ],
    },
    {
      id: 2,
      name: 'Android App',
      tasks: [
        { id: 201, name: 'Google Play Billing', done: false },
        { id: 202, name: 'Material You Design', done: true },
      ],
    },
  ],
};

export default class App {
  init() {
    document.addEventListener('DOMContentLoaded', () => {
      this.initTabs();
      this.initWidgets();
    });
  }

  initTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach((t) => t.classList.remove('active'));
        contents.forEach((c) => c.classList.remove('active'));

        tab.classList.add('active');
        const targetContent = document.getElementById(tab.dataset.tab);
        if (targetContent) {
          targetContent.classList.add('active');
        }
      });
    });
  }

  initWidgets() {
    const serverBaseUrl = 'https://server-peach-mu.vercel.app';

    // --- Задача 1 (Polling) ---
    const pollingWidget = new PollingWidget('messages-tbody', `${serverBaseUrl}/api/unread`);
    pollingWidget.init();

    // --- Задача 2 (Posts & Comments) ---
    const postsWidget = new PostsWidget('posts-container', serverBaseUrl);
    postsWidget.init();

    // --- Задача 3 (Project Dashboard) ---
    const store = new Store(initialDashboardData);

    const statsWidget = new StatsWidget('stats-list', store);
    statsWidget.init();

    const tasksWidget = new TasksWidget('project-selector', 'tasks-list', store);
    tasksWidget.init();
  }
}
