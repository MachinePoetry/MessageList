import { Pipe, PipeTransform } from '@angular/core';
import { IFile } from './../../models/interfaces/IFile';

@Pipe({
  name: 'blobToSrc'
})

export class BlobToSrcPipe implements PipeTransform {
  public transform(value: string, file: IFile, args?: any) {
    if (typeof value !== 'string') {
      throw new Error('BlobToSrcPipe can only be used with strings');
    }
    return value.startsWith('blob:') ? value : 'data:' + file.contentType + ';base64,' + file.src;
  }
}
