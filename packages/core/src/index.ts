// domain
export { AggregateRoot } from './domain/AggregateRoot';
export type { AggregateObjectProps } from './domain/AggregateRoot';
export { ValueObject } from './domain/ValueObject';
export type { ValueObjectProps } from './domain/ValueObject';
export { Result } from './domain/Result';
export { Identifier } from './domain/Identifier';
export { UniqueEntityID } from './domain/UniqueEntityID';
export { BooleanInteger } from './domain/BooleanInteger';
export { type DomainEvent, BaseDomainEvent } from './domain/DomainEvent';

// application
export { type UseCase } from './application/UseCase';
export { type CoreResponse } from './application/CoreResponse';
export { Facade } from './application/Facade';

// presentation
export {
  ControllerResponse,
  ControllerResponseOnError,
  ControllerResponseErrorObject,
} from './presentation/ControllerResponse';
export {
  PaginationQuery,
  DEFAULT_PAGINATION_PAGE,
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_MAX_PAGINATION_LIMIT,
} from './presentation/PaginationQuery';
export { PaginationResponse } from './presentation/PaginationResponse';
export { CursorPaginationQuery } from './presentation/CursorPaginationQuery';
export { CursorPaginationResponse } from './presentation/CursorPaginationResponse';

// presentation/decorators
export { TransformToNumber } from './presentation/decorators/TransformToNumber';
export { TransformToNumberArray } from './presentation/decorators/TransformToNumberArray';
export { TransformCommaToArray } from './presentation/decorators/TransformCommaToArray';
export { TransformToBoolean } from './presentation/decorators/TransformToBoolean';
export { TransformEmptyToNull } from './presentation/decorators/TransformEmptyToNull';
export { IsValidUrl, type IsValidUrlOptions } from './presentation/decorators/IsValidUrl';
