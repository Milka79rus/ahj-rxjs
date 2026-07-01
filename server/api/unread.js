import { faker } from '@faker-js/faker';

export default function handler(req, res) {
  // Разрешаем предварительные запросы OPTIONS (CORS)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const count = faker.number.int({ min: 0, max: 3 });
  const messages = [];

  for (let i = 0; i < count; i++) {
    messages.push({
      id: faker.string.uuid(),
      from: faker.internet.email(),
      subject: faker.lorem.sentence({ min: 2, max: 4 }),
      body: faker.lorem.paragraph(),
      received: Math.floor(Date.now() / 1000),
    });
  }

  return res.status(200).json({
    status: 'ok',
    timestamp: Math.floor(Date.now() / 1000),
    messages,
  });
}
