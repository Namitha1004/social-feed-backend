import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Hash password for all users
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create Owner
  const owner = await prisma.user.upsert({
    where: { email: 'owner@example.com' },
    update: {},
    create: {
      email: 'owner@example.com',
      username: 'owner',
      password: hashedPassword,
      firstName: 'Owner',
      lastName: 'User',
      role: 'OWNER',
    },
  });

  // Create Admins
  const admin1 = await prisma.user.upsert({
    where: { email: 'admin1@example.com' },
    update: {},
    create: {
      email: 'admin1@example.com',
      username: 'admin1',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'One',
      role: 'ADMIN',
    },
  });

  const admin2 = await prisma.user.upsert({
    where: { email: 'admin2@example.com' },
    update: {},
    create: {
      email: 'admin2@example.com',
      username: 'admin2',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'Two',
      role: 'ADMIN',
    },
  });

  // Create Regular Users
  const users = [];
  for (let i = 1; i <= 5; i++) {
    const user = await prisma.user.upsert({
      where: { email: `user${i}@example.com` },
      update: {},
      create: {
        email: `user${i}@example.com`,
        username: `user${i}`,
        password: hashedPassword,
        firstName: `User`,
        lastName: `${i}`,
        bio: `This is user ${i}'s bio`,
      },
    });
    users.push(user);
  }

  // Create Posts
  const posts = [];
  const allUsers = [owner, admin1, admin2, ...users];
  
  for (let i = 0; i < 10; i++) {
    const author = allUsers[i % allUsers.length];
    const post = await prisma.post.create({
      data: {
        content: `This is post number ${i + 1} by ${author.username}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
        authorId: author.id,
      },
    });
    posts.push(post);
  }

  // Create some likes
  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    const likers = allUsers.filter((u) => u.id !== post.authorId).slice(0, Math.floor(Math.random() * 3) + 1);
    
    for (const liker of likers) {
      await prisma.like.create({
        data: {
          userId: liker.id,
          postId: post.id,
        },
      });
    }
  }

  // Create some follows
  for (let i = 0; i < users.length; i++) {
    if (i < users.length - 1) {
      await prisma.follow.create({
        data: {
          followerId: users[i].id,
          followingId: users[i + 1].id,
        },
      });
    }
  }

  // Create some activities
  for (const post of posts) {
    await prisma.activity.create({
      data: {
        userId: post.authorId,
        type: 'POST_CREATED',
        metadata: JSON.stringify({ postId: post.id }),
      },
    });
  }

  console.log('Seed data created successfully!');
  console.log(`Owner: ${owner.email}`);
  console.log(`Admins: ${admin1.email}, ${admin2.email}`);
  console.log(`Users: ${users.map((u) => u.email).join(', ')}`);
  console.log(`Posts: ${posts.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

