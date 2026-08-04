import { db } from './index';
import { categories, tags, sources, users } from './schema';
import { nanoid } from 'nanoid';

async function seed() {
  console.log('Seeding database...');

  const catNames = [
    'World', 'Politics', 'Business', 'Finance', 'Crypto', 
    'AI', 'Technology', 'Science', 'Health', 'Sports', 
    'Entertainment', 'Gaming'
  ];

  for (const name of catNames) {
    await db.insert(categories).values({
      id: nanoid(),
      name,
      slug: name.toLowerCase(),
      description: `Latest news and updates about ${name}`,
    }).onConflictDoNothing();
  }

  const tagNames = ['Breaking', 'Analysis', 'Exclusive', 'Trending', 'Opinion'];
  for (const name of tagNames) {
    await db.insert(tags).values({
      id: nanoid(),
      name,
      slug: name.toLowerCase(),
    }).onConflictDoNothing();
  }

  const sourceNames = [
    { name: 'Reuters', url: 'https://reuters.com', type: 'news', score: 95 },
    { name: 'Associated Press', url: 'https://apnews.com', type: 'news', score: 95 },
    { name: 'Official Govt Portal', url: 'https://gov.example', type: 'official', score: 100 },
    { name: 'TechCrunch', url: 'https://techcrunch.com', type: 'news', score: 80 },
    { name: 'Reddit', url: 'https://reddit.com', type: 'social', score: 40 },
  ];

  for (const s of sourceNames) {
    await db.insert(sources).values({
      id: nanoid(),
      name: s.name,
      url: s.url,
      type: s.type,
      reliabilityScore: s.score,
    }).onConflictDoNothing();
  }

  // Create a default admin user
  await db.insert(users).values({
    id: 'admin-1',
    name: 'System Admin',
    email: 'admin@daytonightnews.com',
    password: 'hashed_password_here',
    role: 'admin',
  }).onConflictDoNothing();

  console.log('Seeding completed successfully!');
}

seed().catch(console.error);
