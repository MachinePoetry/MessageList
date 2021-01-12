export interface IMessageParams {
  authUserId: number,
  messageGroupId: number | null,
  text: string,
  selectedMessageId: number | null
}
