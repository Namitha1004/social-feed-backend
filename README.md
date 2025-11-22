# Social Feed Backend

A complete social feed backend API built with Node.js, Express, Prisma, and PostgreSQL.

## Features

- JWT Authentication (Access + Refresh tokens)
- Role-based access control (USER, ADMIN, OWNER)
- User management
- Posts and likes
- Follow/unfollow users
- Block/unblock users
- Activity logging
- Pagination
- Input validation with Zod
- Centralized error handling

## Tech Stack

- Node.js + Express
- Prisma ORM
- PostgreSQL
- JWT
- Zod
- bcryptjs

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database URL and JWT secrets
```

3. Set up database:
```bash
npx prisma migrate dev
npx prisma generate
```

4. Seed the database:
```bash
npm run prisma:seed
```

5. Start the server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login
- POST `/api/auth/refresh` - Refresh access token
- POST `/api/auth/logout` - Logout
- POST `/api/auth/logout-all` - Logout from all devices

### Users
- GET `/api/users` - Get all users (Admin only)
- GET `/api/users/:id` - Get user profile
- PUT `/api/users/:id` - Update user profile
- DELETE `/api/users/:id` - Delete user
- GET `/api/users/:id/followers` - Get user's followers
- GET `/api/users/:id/following` - Get user's following

### Posts
- POST `/api/posts` - Create a post
- GET `/api/posts` - Get all posts
- GET `/api/posts/:id` - Get a post
- PUT `/api/posts/:id` - Update a post
- DELETE `/api/posts/:id` - Delete a post
- GET `/api/posts/user/:id` - Get user's posts

### Likes
- POST `/api/likes/post/:id` - Like a post
- DELETE `/api/likes/post/:id` - Unlike a post
- GET `/api/likes/post/:id` - Get post likes
- GET `/api/likes/user/:id` - Get user's likes

### Follows
- POST `/api/follows/:id` - Follow a user
- DELETE `/api/follows/:id` - Unfollow a user

### Blocks
- POST `/api/blocks/:id` - Block a user
- DELETE `/api/blocks/:id` - Unblock a user
- GET `/api/blocks` - Get blocked users

### Activities
- GET `/api/activities/user/:id` - Get user activities
- GET `/api/activities` - Get all activities (Admin only)

## Seed Data

The seed script creates:
- 1 Owner (owner@example.com)
- 2 Admins (admin1@example.com, admin2@example.com)
- 5 Users (user1@example.com - user5@example.com)
- 10 Posts
- Sample likes and follows

Default password for all users: `password123`

## Testing

Import the Postman collection from `tests/postman/SocialFeed.postman_collection.json` to test all endpoints.

