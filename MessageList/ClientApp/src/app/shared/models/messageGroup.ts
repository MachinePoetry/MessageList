import { IMessage } from './interfaces/IMessage';

export class MessageGroup {
  public id: number;
  public name: string;
  public messages: IMessage[];
  public userId: number;
}
