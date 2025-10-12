import { Injectable } from '@nestjs/common';
import { PostDomainService } from '../../domain/services/post-domain.service';
import { UseCase } from '../../../../shared/application/interfaces/use-case.interface';

interface UnpublishPostRequest {
  postId: string;
  authorId: string;
}

@Injectable()
export class UnpublishPostUseCase implements UseCase<UnpublishPostRequest, any> {
  constructor(private readonly postDomainService: PostDomainService) {}

  async execute(request: UnpublishPostRequest) {
    const { postId, authorId } = request;

    const post = await this.postDomainService.unpublishPost(postId, authorId);

    return {
      message: 'Post unpublished successfully',
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
