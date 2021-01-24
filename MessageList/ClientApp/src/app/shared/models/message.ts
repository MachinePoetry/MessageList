import { FileCollection } from './FileCollection';

export class Message {
  id: number | null;
  text: string;
  createdAt: string;
  related_message_group: number;
  fileCollection: FileCollection;
}
