export class ChangeMessagesToLoadParams {
  constructor(public authUserId: number, public messagesToLoadAmount: number) {
    this.authUserId = authUserId;
    this.messagesToLoadAmount = messagesToLoadAmount;
  };
  public authUserId: number | null = null;
  public messagesToLoadAmount: number = 20;
}
