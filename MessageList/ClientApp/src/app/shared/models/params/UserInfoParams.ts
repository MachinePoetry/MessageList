import { User } from './../user';

export class UserInfoParams {
  constructor(user: User, mode: string) {
    this.id = user.id;
    this.email = user.email;
    this.messagesToLoadAmount = user.messagesToLoadAmount;
    this.isAdmin = user.isAdmin;
    this.mode = mode;
  }

  public id: number | null = null;
  public email: string = '';
  public messagesToLoadAmount: number = 30;
  public isAdmin: boolean = false;
  public changePasswordKey: string = '';
  public mode: string = '';
  public password: string = '';
}
