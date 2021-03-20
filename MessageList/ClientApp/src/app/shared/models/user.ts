export class User {
  public id: number | null = null;
  public email: string = '';
  public isChangePasswordKeySet: boolean = false;
  public createdAt: string = '';
  public messagesToLoadAmount: number = 30;
  public isGreeted: boolean = false;
  public roles: string[] = [];
}
