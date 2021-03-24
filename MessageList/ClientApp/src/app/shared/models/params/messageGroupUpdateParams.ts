import { MessageGroupCreateParams } from './messageGroupCreateParams';

export class MessageGroupUpdateParams extends MessageGroupCreateParams {
  constructor(public name: string, public authUserId: number, public selectedGroupId: number | null) { super(name, authUserId) }
}
