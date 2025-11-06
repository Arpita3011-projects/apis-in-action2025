// Mock data to use when DB is not available
const mockVideos = [
  {
    _id: '1',
    title: 'Introduction to APIs',
    slug: 'introduction-to-apis',
    content: 'Learn the basics of REST APIs and how they work',
    videoUrl: 'https://example.com/videos/intro-apis',
    thumbnail: 'https://example.com/thumbnails/intro-apis.jpg',
    duration: '10:00',
    likes: 42,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '2',
    title: 'Building REST APIs',
    slug: 'building-rest-apis',
    content: 'Step by step guide to building REST APIs with Express',
    videoUrl: 'https://example.com/videos/building-apis',
    thumbnail: 'https://example.com/thumbnails/building-apis.jpg',
    duration: '15:00',
    likes: 28,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const mockUsers = [
  {
    _id: 'admin1',
    name: 'Admin User',
    email: 'admin@example.com',
    password: '$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGhM1A8W9kkDvqfqD7ZKqS', // password: admin123
    role: 'admin'
  },
  {
    _id: 'user1',
    name: 'Test User',
    email: 'user@example.com',
    password: '$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGhM1A8W9kkDvqfqD7ZKqS', // password: admin123
    role: 'user'
  }
];

module.exports = {
  videos: mockVideos,
  users: mockUsers
};