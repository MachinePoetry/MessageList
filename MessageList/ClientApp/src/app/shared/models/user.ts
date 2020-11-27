export class User {
  public id: number;
  public email: string;
  public password: string;
  public isEmailConfirmed: boolean;
  public createdAt: Date;
  public isAdmin: boolean;
  public MessageGroups: any[];
}
