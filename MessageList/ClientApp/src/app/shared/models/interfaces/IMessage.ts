import { IFileCollection } from './IFileCollection';

export interface IMessage {
  id: number | null;
  text: string;
  createdAt: string;
  related_message_group: number;
  fileCollection: IFileCollection;
}
