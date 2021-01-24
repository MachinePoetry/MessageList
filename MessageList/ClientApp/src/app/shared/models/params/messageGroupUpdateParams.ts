import { MessageGroupCreateParams } from './messageGroupCreateParams';

export class MessageGroupUpdateParams extends MessageGroupCreateParams {
  constructor(public name: string, public userId: number | null, public id: number | null) { super(name, userId) }
}
