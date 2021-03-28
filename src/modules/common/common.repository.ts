import { EntityRepository, Repository, FindManyOptions, FindConditions, SelectQueryBuilder } from 'typeorm';
import { encode, decode } from 'opaqueid';
import { PaginationArgs } from 'src/graphql/types/common.args';
import { generateQueryByFilter } from './common.helpers';
import { Pagination } from './pagination';

/**
 * The invalid cursor type error.
 */
export class InvalidCursorTypeError extends Error {
  /**
   * Constructs a new InvalidCursorTypeError
   * @param expectedType The expected cursor type.
   * @param actualType The actual cursor type.
   */
  constructor(private readonly expectedType: string, private readonly actualType: string) {
    super();
    this.name = 'Invalid Cursor Type Error';
    this.message = `Invalid cursor, expected type ${expectedType}, but got type ${actualType}`;
  }
}

/**
 * The invalid cursor error.
 */
export class InvalidCursorError extends Error {
  /**
   * Constructs a new InvalidCursorError.
   */
  constructor() {
    super();
    this.name = 'Invalid Cursor Error';
    this.message = 'Invalid cursor';
  }
}

/**
 * A cursor object.
 */
export interface Cursor {
  /**
   * The ID of the entity.
   */
  id: string;
  /**
   * The entity type.
   */
  type: string;
  /**
   * The entity index in the results.
   */
  index: number;
}

/**
 * Encodes a pagination cursor.
 * @param id The entity ID.
 * @param type The entity type.
 * @param index The entity index in the results.
 */
export function encodeCursor(id: string, type: string, index: number) {
  return encode(`C|${type}|${id}|${index}`);
}

/**
 * Decodes a pagination cursor.
 * @param cursor The cursor to decode.
 * @param type The entity type.
 */
export function decodeCursor(cursor: string, type: string): Cursor {
  // Split the cursor
  const [cursorPrefix, cursorType, id, index] = decode(cursor).split('|');
  // Verify that it is a valid cursor
  if (cursorPrefix !== 'C') throw new InvalidCursorError();
  // Throw an error if the cursor type is incorrect
  if (cursorType !== type) throw new InvalidCursorTypeError(type, cursorType);
  // Return the cursor data
  return {
    id,
    type: cursorType,
    index: parseInt(index, 10),
  };
}

/**
 * A page info object.
 */
export interface PageInfo {
  /**
   * The last cursor in the page.
   */
  endCursor: string | null;
  /**
   * The first cursor in the page.
   */
  startCursor: string | null;
  /**
   * Is there another page after.
   */
  hasNextPage: boolean;
  /**
   * Is there a preceding page.
   */
  hasPrevPage: boolean;
}

/**
 * An edge object.
 */
export interface Edge<T> {
  node: T;
  cursor: string;
}

/**
 * A connection object.
 */
export interface Connection<T> {
  totalCount: number;
  pageInfo: PageInfo;
  edges: Edge<T>[];
}

/**
 * The pagination options object.
 */
export interface PaginateOptions<Entity, K extends keyof Entity> {
  /**
   * How many results to load.
   */
  first: number;
  /**
   * A cursor to find results after.
   */
  after?: string;
  /**
   * The name of the entity type.
   */
  type: string;
  /**
   * Should the cursor be validated for integrity.
   */
  validateCursor?: boolean;

  cursorKey: K;
}

@EntityRepository()
export class CommonRepository<Model> extends Repository<Model> {
  async paginate(
    data: PaginationArgs,
    searchOptions?: FindConditions<Model> | FindManyOptions<Model>,
    cb?: (val: FindConditions<Model> | FindManyOptions<Model>) => FindConditions<Model> | FindManyOptions<Model>,
  ): Promise<Pagination<Model>> {
    const page = data.page || 1;
    const limit = data.limit || 15;
    const where = generateQueryByFilter(data.filters);
    const options = cb ? cb({ ...searchOptions, where }) : { ...searchOptions, where };

    const [items, total] = await this.findAndCount({
      skip: limit * (page - 1),
      take: limit,
      ...options,
    });
    return createPaginationObject(items, total, page, limit);
  }

  async customPaginate(
    queryBuilder: SelectQueryBuilder<Model>,
    { limit, page }: { limit?: number; page?: number },
  ): Promise<Pagination<Model>> {
    page = page || 1;
    limit = limit || 15;
    const skip = limit * (page - 1);

    const [items, total] = await queryBuilder.take(limit).skip(skip).getManyAndCount();

    return createPaginationObject(items, total, page, limit);
  }

  paginateCursor = async (
    options: FindManyOptions<Model>,
    findOptions: PaginateOptions<Model, any>,
  ): Promise<Connection<Model>> => {
    // If no cursor is provided, start at the beginning
    let skip = 0;
    let decodedCursor: Cursor = {
      id: '',
      type: '',
      index: 1,
    };

    // Check if we have a cursor
    if (findOptions.after) {
      // Attempt to decode the cursor
      decodedCursor = decodeCursor(findOptions.after, findOptions.type);
      // Include the cursor in the query to check if there is a previous page
      skip = decodedCursor.index;
    }
    const [results, totalCount] = await this.findAndCount({ ...options, skip });
    // Make sure the cursor is valid
    if (decodedCursor && findOptions.validateCursor) {
      // Make sure the ID of the first result matches the cursor ID
      if (decodedCursor.id !== results[0][findOptions.cursorKey]) throw new InvalidCursorError();
    }
    // Convert the nodes into edges
    const edges: Edge<Model>[] = results.map((node, i) => ({
      node,
      cursor: encodeCursor(node[findOptions.cursorKey], findOptions.type, i + 1 + skip),
    }));

    // Generate the page info
    const pageInfo: PageInfo = {
      startCursor: edges[0] ? edges[0].cursor : null,
      endCursor: edges[edges.length - 1] ? edges[edges.length - 1].cursor : null,
      hasNextPage: results.length + skip < totalCount,
      hasPrevPage: skip !== 0,
    };
    // Return the connection
    return {
      pageInfo,
      edges,
      totalCount,
    };
  };
}

function createPaginationObject<T>(items: T[], totalItems: number, currentPage: number, limit: number) {
  const totalPages = Math.ceil(totalItems / limit);
  const routes = {};

  return new Pagination(
    items,
    {
      totalItems: totalItems,
      itemCount: items.length,
      itemsPerPage: limit,
      totalPages: totalPages,
      currentPage: currentPage,
    },
    routes,
  );
}
