export interface IMessage {
  authUserId: number,
  messageGroupId: number | null,
  text: string,
  id: number | null
}
