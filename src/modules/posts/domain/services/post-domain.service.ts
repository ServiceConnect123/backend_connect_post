import { Injectable, Inject } from '@nestjs/common';
import type { PostRepository } from '../repositories/post.repository';
import { POST_REPOSITORY_TOKEN } from '../repositories/post.repository.token';
import { Post } from '../entities/post.entity';
import { NotFoundException, ValidationException } from '../../../../shared/infrastructure/exceptions/domain.exceptions';

@Injectable()
export class PostDomainService {
  constructor(
    @Inject(POST_REPOSITORY_TOKEN) private readonly postRepository: PostRepository,
  ) {}

  async createPost(data: {
    id: string;
    title: string;
    content: string;
    authorId: string;
    tags?: string[];
  }): Promise<Post> {
    if (!data.title.trim()) {
      throw new ValidationException('Post title cannot be empty');
    }

    if (!data.content.trim()) {
      throw new ValidationException('Post content cannot be empty');
    }

    const post = Post.create({
      id: data.id,
      title: data.title.trim(),
      content: data.content.trim(),
      authorId: data.authorId,
      tags: data.tags?.map(tag => tag.trim()).filter(tag => tag.length > 0) || [],
    });

    return await this.postRepository.save(post);
  }

  async updatePost(postId: string, data: {
    title?: string;
    content?: string;
    tags?: string[];
  }): Promise<Post> {
    const post = await this.postRepository.findById(postId);
    if (!post) {
      throw new NotFoundException('Post');
    }

    let updatedPost = post;

    if (data.title !== undefined || data.content !== undefined) {
      const title = data.title?.trim() || post.title;
      const content = data.content?.trim() || post.content;

      if (!title) {
        throw new ValidationException('Post title cannot be empty');
      }

      if (!content) {
        throw new ValidationException('Post content cannot be empty');
      }

      updatedPost = updatedPost.updateContent(title, content);
    }

    if (data.tags !== undefined) {
      // Replace all tags with new ones
      const cleanTags = data.tags.map(tag => tag.trim()).filter(tag => tag.length > 0);
      updatedPost = Post.create({
        id: updatedPost.id,
        title: updatedPost.title,
        content: updatedPost.content,
        authorId: updatedPost.authorId,
        isPublished: updatedPost.isPublished,
        tags: cleanTags,
      });
    }

    return await this.postRepository.save(updatedPost);
  }

  async publishPost(postId: string, authorId: string): Promise<Post> {
    const post = await this.postRepository.findById(postId);
    if (!post) {
      throw new NotFoundException('Post');
    }

    if (post.authorId !== authorId) {
      throw new ValidationException('You can only publish your own posts');
    }

    if (post.isPublished) {
      throw new ValidationException('Post is already published');
    }

    const publishedPost = post.publish();
    return await this.postRepository.save(publishedPost);
  }

  async unpublishPost(postId: string, authorId: string): Promise<Post> {
    const post = await this.postRepository.findById(postId);
    if (!post) {
      throw new NotFoundException('Post');
    }

    if (post.authorId !== authorId) {
      throw new ValidationException('You can only unpublish your own posts');
    }

    if (!post.isPublished) {
      throw new ValidationException('Post is already unpublished');
    }

    const unpublishedPost = post.unpublish();
    return await this.postRepository.save(unpublishedPost);
  }

  async deletePost(postId: string, authorId: string): Promise<void> {
    const post = await this.postRepository.findById(postId);
    if (!post) {
      throw new NotFoundException('Post');
    }

    if (post.authorId !== authorId) {
      throw new ValidationException('You can only delete your own posts');
    }

    await this.postRepository.delete(postId);
  }
}
