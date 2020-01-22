export class User {
  constructor(
    public email: string,
    private id: string,
    public username: string
  ) {}

  get getUsername() {
    if (this.username) {
      return this.username;
    }
  }
}
