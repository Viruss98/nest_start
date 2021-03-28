import { InterfaceType, Field, ID, ObjectType, Int } from '@nestjs/graphql';
import { Type } from '@nestjs/common';

@InterfaceType({
  description: 'Node',
})
export abstract class Node {
  @Field(() => ID)
  id: string;
}

@InterfaceType()
export abstract class Edge {
  cursor?: string;
}

@ObjectType()
export class PageInfo {
  startCursor?: string;

  endCursor?: string;

  hasPrevPage: boolean;

  hasNextPage: boolean;
}

@InterfaceType()
export abstract class Connection {
  @Field(() => Int)
  itemCount: number;

  @Field(() => Int)
  totalItems: number;

  @Field(() => Int)
  pageCount: number;

  next?: string;
  previous?: string;
}

@InterfaceType()
export abstract class CursorConnection {
  @Field(() => Int)
  totalCount: number;

  pageInfo: PageInfo;
}

@ObjectType()
class BasePaginationMeta {
  itemCount: number;
  /**
   * the total amount of items
   */
  totalItems: number;
  /**
   * the amount of items that were requested per page
   */
  itemsPerPage: number;
  /**
   * the total amount of pages in this paginator
   */
  totalPages: number;
  /**
   * the current page this paginator "points" to
   */
  currentPage: number;
}

export function PaginationBase<T>(classRef: Type<T>) {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedType {
    @Field(() => [classRef], { nullable: true })
    items: T[];

    meta: BasePaginationMeta;
  }
  return PaginatedType;
}

export function PaginationCursor<T>(classRef: Type<T>) {
  @ObjectType(`${classRef.name}Edge`)
  abstract class EdgeType {
    @Field(() => String)
    cursor: string;

    @Field(() => classRef)
    node: T;
  }

  @ObjectType({ isAbstract: true })
  abstract class PaginatedType {
    @Field(() => [EdgeType], { nullable: true })
    edges: EdgeType[];

    @Field(() => [classRef], { nullable: true })
    nodes: T[];

    @Field(() => Int)
    totalCount: number;
    pageInfo: PageInfo;
  }
  return PaginatedType;
}
