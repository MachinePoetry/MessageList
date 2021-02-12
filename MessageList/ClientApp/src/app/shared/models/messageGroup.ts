import { Message } from './message';

export class MessageGroup {
  public id: number;
  public name: string = '';
  public messages: Message[] = [];
  public userId: number;
}
