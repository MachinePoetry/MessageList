import { FileCollection } from './fileCollection';
import { UrlPreviewResponse } from './urlPreviewResponse';

export class NewMessage {
  public text: string = '';
  public fileCollection: FileCollection = new FileCollection();
  public urlPreviews: UrlPreviewResponse[] = [];
}
