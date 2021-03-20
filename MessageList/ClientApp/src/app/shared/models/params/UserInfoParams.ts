import { User } from './../user';

export class UserInfoParams {
  constructor(user: User, mode: string) {
    this.id = user.id;
    this.email = user.email;
    this.messagesToLoadAmount = user.messagesToLoadAmount;
    this.roles = user.roles;
    this.mode = mode;
  }

  public id: number | null = null;
  public email: string = '';
  public messagesToLoadAmount: number = 30;
  public changePasswordKey: string = '';
  public roles: string[] = [];
  public rolesIds: number[] = [];
  public mode: string = '';
  public password: string = '';
}
