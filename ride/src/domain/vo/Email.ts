export default class Email {
  private value: string;

  constructor(email: string) {
    if (!new RegExp(/^(.+)@(.+)$/).test(email))
      throw new Error('Invalid email');
    this.value = email;
  }

  public getValue() {
    return this.value;
  }
}
