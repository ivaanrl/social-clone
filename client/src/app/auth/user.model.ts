export class User {
  constructor(
    public email: string,
    private id: string,
    public username: string,
    public profile_pic_name: string,
    public date: number
  ) {}

  get getUsername() {
    if (this.username) {
      return this.username;
    }
  }

  get getid() {
    return this.id;
  }

  get getProfilePicName() {
    return this.profile_pic_name;
  }
}
