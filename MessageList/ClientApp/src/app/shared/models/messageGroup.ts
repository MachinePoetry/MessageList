import { Message } from './Message';

export class MessageGroup {
  public id: number;
  public name: string = '';
  public messages: Message[] = [];
  public userId: number;
}
