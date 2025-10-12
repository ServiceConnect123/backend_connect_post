import { ApiProperty } from '@nestjs/swagger';

export class PostDto {
  @ApiProperty({
    description: 'Post unique identifier',
    example: 'uuid-v4-string',
  })
  id: string;

  @ApiProperty({
    description: 'Post title',
    example: 'My Amazing Post Title',
  })
  title: string;

  @ApiProperty({
    description: 'Post content',
    example: 'This is the content of my post...',
  })
  content: string;

  @ApiProperty({
    description: 'Post publication status',
    example: true,
  })
  isPublished: boolean;

  @ApiProperty({
    description: 'Post author ID',
    example: 'uuid-v4-string',
  })
  authorId: string;

  @ApiProperty({
    description: 'Post creation timestamp',
    example: '2023-10-11T20:07:23.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last post update timestamp',
    example: '2023-10-11T20:07:23.000Z',
  })
  updatedAt: Date;
}

export class PostsListResponseDto {
  @ApiProperty({
    description: 'Array of posts',
    type: [PostDto],
  })
  posts: PostDto[];

  @ApiProperty({
    description: 'Total number of posts',
    example: 25,
  })
  total: number;

  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Number of posts per page',
    example: 10,
  })
  limit: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 3,
  })
  totalPages: number;
}
