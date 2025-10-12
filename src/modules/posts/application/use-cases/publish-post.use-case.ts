import { Injectable } from '@nestjs/common';
import { PostDomainService } from '../../domain/services/post-domain.service';
import { UseCase } from '../../../../shared/application/interfaces/use-case.interface';

interface PublishPostRequest {
  postId: string;
  authorId: string;
}

@Injectable()
export class PublishPostUseCase implements UseCase<PublishPostRequest, any> {
  constructor(private readonly postDomainService: PostDomainService) {}

  async execute(request: PublishPostRequest) {
    const { postId, authorId } = request;

    const post = await this.postDomainService.publishPost(postId, authorId);

    return {
      message: 'Post published successfully',
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
