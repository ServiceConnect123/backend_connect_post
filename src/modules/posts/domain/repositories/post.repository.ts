import { Post } from '../entities/post.entity';

export interface PostRepository {
  findById(id: string): Promise<Post | null>;
  findByAuthor(authorId: string): Promise<Post[]>;
  findAll(options?: { 
    published?: boolean;
    limit?: number;
    offset?: number;
    search?: string;
  }): Promise<Post[]>;
  save(post: Post): Promise<Post>;
  delete(id: string): Promise<void>;
  count(options?: { published?: boolean; search?: string }): Promise<number>;
}
