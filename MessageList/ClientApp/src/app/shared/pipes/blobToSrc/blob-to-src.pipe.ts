import { Pipe, PipeTransform } from '@angular/core';
import { IFile } from './../../models/interfaces/IFile';

@Pipe({
  name: 'blobToSrc'
})

export class BlobToSrcPipe implements PipeTransform {
  public transform(value: string, file: IFile, args?: any) {
    if (typeof value === 'string') {
      return value.startsWith('data:') ? value : 'data:' + file.type + ';base64,' + file.src;
    }
  }
}
