import { IFileCollection } from './interfaces/IFileCollection';

export class Message {
  id: number | null;
  text: string;
  createdAt: string;
  related_message_group: number;
  fileCollection: IFileCollection;
}
