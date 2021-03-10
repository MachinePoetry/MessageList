import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileSize'
})

export class FileSizePipe implements PipeTransform {
  public transform(fileSize: number, args?: any) {
    return fileSize < 1000 ? fileSize + ' Байт' : Math.floor(fileSize / 1000) + ' КБ';
  }
}
