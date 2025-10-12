import { Injectable } from '@nestjs/common';
import { PostDomainService } from '../../domain/services/post-domain.service';
import { UseCase } from '../../../../shared/application/interfaces/use-case.interface';

interface DeletePostRequest {
  postId: string;
  authorId: string;
}

@Injectable()
export class DeletePostUseCase implements UseCase<DeletePostRequest, any> {
  constructor(private readonly postDomainService: PostDomainService) {}

  async execute(request: DeletePostRequest) {
    const { postId, authorId } = request;

    await this.postDomainService.deletePost(postId, authorId);

    return {
      message: 'Post deleted successfully',
    };
  }
}
