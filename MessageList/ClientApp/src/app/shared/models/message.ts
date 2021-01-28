import { FileCollection } from './fileCollection';

export class Message {
  id: number | null = null;
  text: string = '';
  createdAt: string = '';
  related_message_group: number;
  fileCollection: FileCollection = new FileCollection();
}
