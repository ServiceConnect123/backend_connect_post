import { Injectable } from '@nestjs/common';
import { PostDomainService } from '../../domain/services/post-domain.service';
import { UpdatePostDto } from '../dtos/update-post.dto';
import { UseCase } from '../../../../shared/application/interfaces/use-case.interface';

interface UpdatePostRequest {
  postId: string;
  updatePostDto: UpdatePostDto;
  authorId: string;
}

@Injectable()
export class UpdatePostUseCase implements UseCase<UpdatePostRequest, any> {
  constructor(private readonly postDomainService: PostDomainService) {}

  async execute(request: UpdatePostRequest) {
    const { postId, updatePostDto, authorId } = request;

    const post = await this.postDomainService.updatePost(postId, updatePostDto);

    return {
      message: 'Post updated successfully',
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
