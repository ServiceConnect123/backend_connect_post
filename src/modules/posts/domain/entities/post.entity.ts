import { Entity } from '../../../../shared/domain/entities/entity.base';

export class Post extends Entity<string> {
  constructor(
    id: string,
    public readonly title: string,
    public readonly content: string,
    public readonly authorId: string,
    public readonly isPublished: boolean = false,
    public readonly tags: string[] = [],
  ) {
    super(id);
  }

  static create(data: {
    id: string;
    title: string;
    content: string;
    authorId: string;
    isPublished?: boolean;
    tags?: string[];
  }): Post {
    return new Post(
      data.id,
      data.title,
      data.content,
      data.authorId,
      data.isPublished || false,
      data.tags || [],
    );
  }

  publish(): Post {
    this.touch();
    return new Post(
      this._id,
      this.title,
      this.content,
      this.authorId,
      true,
      this.tags,
    );
  }

  unpublish(): Post {
    this.touch();
    return new Post(
      this._id,
      this.title,
      this.content,
      this.authorId,
      false,
      this.tags,
    );
  }

  updateContent(title: string, content: string): Post {
    this.touch();
    return new Post(
      this._id,
      title,
      content,
      this.authorId,
      this.isPublished,
      this.tags,
    );
  }

  addTag(tag: string): Post {
    if (this.tags.includes(tag)) {
      return this;
    }
    
    this.touch();
    return new Post(
      this._id,
      this.title,
      this.content,
      this.authorId,
      this.isPublished,
      [...this.tags, tag],
    );
  }

  removeTag(tag: string): Post {
    const newTags = this.tags.filter(t => t !== tag);
    if (newTags.length === this.tags.length) {
      return this;
    }

    this.touch();
    return new Post(
      this._id,
      this.title,
      this.content,
      this.authorId,
      this.isPublished,
      newTags,
    );
  }
}
