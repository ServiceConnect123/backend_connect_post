import { Injectable } from '@nestjs/common';
import type { PostRepository } from '../../domain/repositories/post.repository';
import { Post } from '../../domain/entities/post.entity';

@Injectable()
export class PostRepositoryImpl implements PostRepository {
  private posts: Post[] = []; // In-memory storage for demonstration

  constructor() {
    // Initialize with some sample posts
    this.initializeSamplePosts();
  }

  private initializeSamplePosts() {
    const samplePosts = [
      Post.create({
        id: 'post_1',
        title: 'Welcome to BackConnectPost',
        content: 'This is your first post in the new hexagonal architecture blog platform. Built with NestJS, following clean architecture principles.',
        authorId: 'admin-user-id', // This should match a real user ID
        isPublished: true,
        tags: ['welcome', 'nestjs', 'architecture'],
      }),
      Post.create({
        id: 'post_2',
        title: 'Understanding Hexagonal Architecture',
        content: 'Hexagonal Architecture, also known as Ports and Adapters, is a software design pattern that promotes separation of concerns and testability.',
        authorId: 'admin-user-id',
        isPublished: false,
        tags: ['architecture', 'design-patterns', 'hexagonal'],
      }),
    ];

    this.posts = samplePosts;
  }

  async findById(id: string): Promise<Post | null> {
    const post = this.posts.find(p => p.id === id);
    return post || null;
  }

  async findByAuthor(authorId: string): Promise<Post[]> {
    return this.posts.filter(p => p.authorId === authorId);
  }

  async findAll(options?: {
    published?: boolean;
    limit?: number;
    offset?: number;
    search?: string;
  }): Promise<Post[]> {
    let filteredPosts = [...this.posts];

    // Filter by published status
    if (options?.published !== undefined) {
      filteredPosts = filteredPosts.filter(p => p.isPublished === options.published);
    }

    // Filter by search term (title or content)
    if (options?.search) {
      const searchTerm = options.search.toLowerCase();
      filteredPosts = filteredPosts.filter(
        p =>
          p.title.toLowerCase().includes(searchTerm) ||
          p.content.toLowerCase().includes(searchTerm) ||
          p.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    // Sort by creation date (newest first)
    filteredPosts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    // Apply pagination
    const offset = options?.offset || 0;
    const limit = options?.limit || 10;
    
    return filteredPosts.slice(offset, offset + limit);
  }

  async save(post: Post): Promise<Post> {
    const existingIndex = this.posts.findIndex(p => p.id === post.id);
    
    if (existingIndex >= 0) {
      // Update existing post
      this.posts[existingIndex] = post;
    } else {
      // Add new post
      this.posts.push(post);
    }
    
    return post;
  }

  async delete(id: string): Promise<void> {
    const index = this.posts.findIndex(p => p.id === id);
    if (index >= 0) {
      this.posts.splice(index, 1);
    }
  }

  async count(options?: { published?: boolean; search?: string }): Promise<number> {
    let filteredPosts = [...this.posts];

    // Filter by published status
    if (options?.published !== undefined) {
      filteredPosts = filteredPosts.filter(p => p.isPublished === options.published);
    }

    // Filter by search term
    if (options?.search) {
      const searchTerm = options.search.toLowerCase();
      filteredPosts = filteredPosts.filter(
        p =>
          p.title.toLowerCase().includes(searchTerm) ||
          p.content.toLowerCase().includes(searchTerm) ||
          p.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    return filteredPosts.length;
  }
}
