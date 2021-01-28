import { Pipe, PipeTransform } from '@angular/core';
import { AppFile } from './../../models/appFile';

@Pipe({
  name: 'blobToSrc'
})

export class BlobToSrcPipe implements PipeTransform {
  public transform(value: string, file: AppFile, args?: any) {
    if (typeof value === 'string') {
      return value.startsWith('data:') ? value : 'data:' + file.type + ';base64,' + file.src;
    }
  }
}
