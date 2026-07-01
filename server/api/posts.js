import { faker } from '@faker-js/faker';

const posts = Array.from({ length: 5 }, () => ({
  id: faker.string.uuid(),
  author_id: faker.string.uuid(),
  author: faker.person.fullName(),
  avatar: faker.image.avatar(),
  title: faker.lorem.sentence(),
  image: faker.image.urlPicsumPhotos({ width: 640, height: 480 }),
  created: Math.floor(Date.now() / 1000) - faker.number.int({ min: 1000, max: 50000 }),
}));

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id, comments } = req.query;

  // Если запрос вида /api/posts?id=xxx&comments=true — отдаем комменты к посту
  if (id && comments === 'true') {
    const count = faker.number.int({ min: 1, max: 3 });
    const fakeComments = Array.from({ length: count }, () => ({
      id: faker.string.uuid(),
      post_id: id,
      author_id: faker.string.uuid(),
      author: faker.person.fullName(),
      avatar: faker.image.avatar(),
      content: faker.lorem.sentences(2),
      created: Math.floor(Date.now() / 1000),
    }));

    return res.status(200).json({ status: 'ok', data: fakeComments });
  }

  // Иначе просто отдаем список постов
  return res.status(200).json({ status: 'ok', data: posts });
}
