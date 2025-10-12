import { Injectable, OnModuleInit } from '@nestjs/common';
import type { PostRepository } from '../../domain/repositories/post.repository';
import { Post } from '../../domain/entities/post.entity';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PostSupabaseRepository implements PostRepository, OnModuleInit {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async onModuleInit() {
    await this.prisma.$connect();
  }

  async findById(id: string): Promise<Post | null> {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post) return null;

    return Post.create({
      id: post.id,
      title: post.title,
      content: post.content,
      authorId: post.authorId,
      isPublished: post.isPublished,
      tags: post.tags,
    });
  }

  async findByAuthor(authorId: string): Promise<Post[]> {
    const posts = await this.prisma.post.findMany({
      where: { authorId },
      orderBy: { createdAt: 'desc' },
    });

    return posts.map(post =>
      Post.create({
        id: post.id,
        title: post.title,
        content: post.content,
        authorId: post.authorId,
        isPublished: post.isPublished,
        tags: post.tags,
      })
    );
  }

  async findAll(options?: {
    published?: boolean;
    limit?: number;
    offset?: number;
    search?: string;
  }): Promise<Post[]> {
    const where: any = {};

    if (options?.published !== undefined) {
      where.isPublished = options.published;
    }

    if (options?.search) {
      const searchTerm = options.search;
      where.OR = [
        { title: { contains: searchTerm, mode: 'insensitive' } },
        { content: { contains: searchTerm, mode: 'insensitive' } },
        { tags: { has: searchTerm } },
      ];
    }

    const posts = await this.prisma.post.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: options?.limit || 10,
      skip: options?.offset || 0,
    });

    return posts.map(post =>
      Post.create({
        id: post.id,
        title: post.title,
        content: post.content,
        authorId: post.authorId,
        isPublished: post.isPublished,
        tags: post.tags,
      })
    );
  }

  async save(post: Post): Promise<Post> {
    const postData = {
      title: post.title,
      content: post.content,
      authorId: post.authorId,
      isPublished: post.isPublished,
      tags: post.tags,
    };

    const savedPost = await this.prisma.post.upsert({
      where: { id: post.id },
      update: postData,
      create: {
        id: post.id,
        ...postData,
      },
    });

    return Post.create({
      id: savedPost.id,
      title: savedPost.title,
      content: savedPost.content,
      authorId: savedPost.authorId,
      isPublished: savedPost.isPublished,
      tags: savedPost.tags,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.post.delete({
      where: { id },
    });
  }

  async count(options?: { published?: boolean; search?: string }): Promise<number> {
    const where: any = {};

    if (options?.published !== undefined) {
      where.isPublished = options.published;
    }

    if (options?.search) {
      const searchTerm = options.search;
      where.OR = [
        { title: { contains: searchTerm, mode: 'insensitive' } },
        { content: { contains: searchTerm, mode: 'insensitive' } },
        { tags: { has: searchTerm } },
      ];
    }

    return await this.prisma.post.count({ where });
  }
}
