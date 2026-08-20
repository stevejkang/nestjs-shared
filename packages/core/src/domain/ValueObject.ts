export interface ValueObjectProps {
  // biome-ignore lint/suspicious/noExplicitAny: index signature requires any for generic constraint flexibility
  [index: string]: any;
}

export abstract class ValueObject<T extends ValueObjectProps> {
  public props: T;

  protected constructor(props: T) {
    this.props = { ...props };
  }

  public equals(valueObject?: ValueObject<T>): boolean {
    if (valueObject === null || valueObject === undefined) {
      return false;
    }

    return JSON.stringify(this.props) === JSON.stringify(valueObject.props);
  }
}
