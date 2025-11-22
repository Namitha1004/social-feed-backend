import { z } from 'zod';

export const createPostSchema = z.object({
  body: z.object({
    content: z.string().min(1, 'Content is required').max(5000, 'Content must be at most 5000 characters'),
  }),
});

export const updatePostSchema = z.object({
  body: z.object({
    content: z.string().min(1, 'Content is required').max(5000, 'Content must be at most 5000 characters'),
  }),
  params: z.object({
    id: z.string().uuid('Invalid post ID'),
  }),
});

export const getPostSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid post ID'),
  }),
});

