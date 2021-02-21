export class User {
  public id: number;
  public email: string = '';
  public isChangePasswordKeySet: boolean = false;
  public createdAt: string = '';
  public messagesToLoadAmount: number = 30;
  public isGreeted: boolean = false;
  public isAdmin: boolean = false;
}
