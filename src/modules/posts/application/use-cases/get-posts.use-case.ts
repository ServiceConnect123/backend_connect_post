import { Injectable, Inject } from '@nestjs/common';
import type { PostRepository } from '../../domain/repositories/post.repository';
import { POST_REPOSITORY_TOKEN } from '../../domain/repositories/post.repository.token';
import { GetPostsDto } from '../dtos/get-posts.dto';
import { UseCase } from '../../../../shared/application/interfaces/use-case.interface';

@Injectable()
export class GetPostsUseCase implements UseCase<GetPostsDto, any> {
  constructor(
    @Inject(POST_REPOSITORY_TOKEN) private readonly postRepository: PostRepository,
  ) {}

  async execute(request: GetPostsDto) {
    const { published, limit = 10, offset = 0, search } = request;

    const [posts, total] = await Promise.all([
      this.postRepository.findAll({ published, limit, offset, search }),
      this.postRepository.count({ published, search }),
    ]);

    return {
      posts: posts.map(post => ({
        id: post.id,
        title: post.title,
        content: post.content,
        authorId: post.authorId,
        isPublished: post.isPublished,
        tags: post.tags,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      })),
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    };
  }
}
