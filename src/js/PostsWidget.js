import { ajax } from 'rxjs/ajax';
import { forkJoin, of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';

export default class PostsWidget {
  constructor(containerId, baseUrl) {
    this.container = document.getElementById(containerId);
    this.baseUrl = baseUrl;
  }

  init() {
    // 1. Сначала делаем запрос за списком последних постов
    ajax
      .getJSON(`${this.baseUrl}/api/posts`)
      .pipe(
        map((res) => res.data || []),
        // 2. switchMap переключает поток на параллельные запросы комментов
        switchMap((posts) => {
          if (posts.length === 0) return of([]);

          // Для каждого поста создаем отдельный мини-поток запроса комментариев
          const postWithComments$ = posts.map((post) =>
            ajax.getJSON(`${this.baseUrl}/api/posts?id=${post.id}&comments=true`).pipe(
              // Склеиваем данные поста и массив его комментариев вместе
              map((res) => ({ ...post, comments: res.data || [] })),
              catchError(() => of({ ...post, comments: [] })),
            ),
          );

          // forkJoin выполнит все запросы параллельно и вернет один общий массив
          return forkJoin(postWithComments$);
        }),
      )
      .subscribe((postsWithComments) => {
        // 3. Рендерим уже полностью собранные посты с комментами внутри
        this.renderPosts(postsWithComments);
      });
  }

  renderPosts(posts) {
    this.container.innerHTML = '';

    if (posts.length === 0) {
      this.container.innerHTML = '<p>Постов пока нет...</p>';
      return;
    }

    posts.forEach((post) => {
      const postEl = document.createElement('div');
      postEl.className = 'post-card';

      // Формируем HTML для комментариев к этому посту
      const commentsHtml = post.comments
        .map(
          (comment) => `
        <div class="comment-item">
          <img src="${comment.avatar}" class="comment-avatar" alt="avatar">
          <div class="comment-body">
            <strong class="comment-author">${comment.author}</strong>
            <p class="comment-text" style="margin: 4px 0 0 0;">${comment.content}</p>
          </div>
        </div>
      `,
        )
        .join('');

      postEl.innerHTML = `
        <div class="post-header">
          <img src="${post.avatar}" class="post-avatar" alt="avatar">
          <div class="post-info">
            <strong class="post-author">${post.author}</strong>
            <div class="post-date" style="font-size: 12px; color: #88px;">
              ${new Date(post.created * 1000).toLocaleDateString('ru-RU')}
            </div>
          </div>
        </div>
        <div class="post-content">
          <h3 style="margin: 10px 0;">${post.title}</h3>
          <img src="${post.image}" class="post-image" alt="post image" style="border-radius: 6px;">
        </div>
        <div class="post-comments-section" style="margin-top: 15px;">
          <h4 style="margin-bottom: 10px; color: #555;">Последние комментарии (${post.comments.length})</h4>
          <div class="comments-list">${
            commentsHtml || '<p style="color: #999; font-size: 14px;">Пока нет комментариев</p>'
          }</div>
        </div>
      `;
      this.container.appendChild(postEl);
    });
  }
}
