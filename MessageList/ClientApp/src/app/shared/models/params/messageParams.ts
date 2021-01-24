export class MessageParams {
  constructor(public authUserId: number, public messageGroupId: number | null, public text: string, public selectedMessageId: number | null) { }
}
