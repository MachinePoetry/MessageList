import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cutLongString'
})

export class CutLongStringPipe implements PipeTransform {
  public transform(text: string, cutTo: number, stub: string, args?: any) {
    if (typeof text !== 'string') {
      throw new Error('CutLongStringPipe can only be used with strings');
    }
    if (text.length > cutTo) {
      text = text.substring(0, cutTo);
      text += stub;
    }
    return text;
  }
}
