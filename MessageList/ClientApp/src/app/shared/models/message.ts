import { FileCollection } from './fileCollection';
import { LinkPreviewResponse } from './linkPreviewResponse';

export class Message {
  id: number | null = null;
  text: string = '';
  createdAt: string = '';
  related_message_group: number;
  fileCollection: FileCollection = new FileCollection();
  urlPreviews: LinkPreviewResponse[] = [];
}
