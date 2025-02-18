export default class Name {
  private value: string;

  constructor(name: string) {
    if (!new RegExp(/[a-zA-Z] [a-zA-Z]+/).test(name))
      throw new Error('Invalid name');

    this.value = name;
  }

  public getValue(): string {
    return this.value;
  }
}
