import { UniqueEntityID } from './UniqueEntityID';
import { DomainEvent } from './DomainEvent';

export interface AggregateObjectProps {
  // biome-ignore lint/suspicious/noExplicitAny: index signature requires any for generic constraint flexibility
  [index: string]: any;
}

export abstract class AggregateRoot<T extends AggregateObjectProps> {
  public readonly props: T;
  private readonly _id: UniqueEntityID;
  private _domainEvents: DomainEvent[] = [];

  protected constructor(props: T, id?: UniqueEntityID) {
    this.props = { ...props };
    this._id = id ? id : new UniqueEntityID();
  }

  get id(): UniqueEntityID {
    return this._id;
  }

  get domainEvents(): readonly DomainEvent[] {
    return this._domainEvents;
  }

  protected addDomainEvent(domainEvent: DomainEvent): void {
    this._domainEvents.push(domainEvent);
  }

  public clearEvents(): void {
    this._domainEvents = [];
  }
}
