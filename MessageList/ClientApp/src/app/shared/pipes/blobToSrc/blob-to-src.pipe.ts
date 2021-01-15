import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'blobToSrc'
})

export class BlobToSrcPipe implements PipeTransform {
  public transform(value: string, file: any, args?: any) {
    if (typeof value !== 'string') {
      throw new Error('BlobToSrcPipe can only be used with strings');
    }
    return value.startsWith('blob:') ? value : 'data:' + file.contentType + ';base64,' + file.src;
  }
}
