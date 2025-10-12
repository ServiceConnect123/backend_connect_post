import { Injectable } from '@nestjs/common';
import { PostDomainService } from '../../domain/services/post-domain.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { UseCase } from '../../../../shared/application/interfaces/use-case.interface';

interface CreatePostRequest {
  createPostDto: CreatePostDto;
  authorId: string;
}

@Injectable()
export class CreatePostUseCase implements UseCase<CreatePostRequest, any> {
  constructor(private readonly postDomainService: PostDomainService) {}

  async execute(request: CreatePostRequest) {
    const { createPostDto, authorId } = request;
    
    // Generate a unique ID for the post
    const postId = `post_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const post = await this.postDomainService.createPost({
      id: postId,
      title: createPostDto.title,
      content: createPostDto.content,
      authorId,
      tags: createPostDto.tags,
    });

    return {
      message: 'Post created successfully',
      post: {
        id: post.id,
        title: post.title,
        content: post.content,
        authorId: post.authorId,
        isPublished: post.isPublished,
        tags: post.tags,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      },
    };
  }
}
