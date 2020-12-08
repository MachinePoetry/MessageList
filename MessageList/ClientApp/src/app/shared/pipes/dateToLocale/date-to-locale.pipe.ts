import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateToLocale'
})

export class DateToLocalePipe implements PipeTransform {
  transform(value: string, toLocale: string, args?: any) {
    if (typeof value !== 'string') {
      throw new Error('DateToLocale can only be used with Date formatted strings');
    }
    return new Date(value).toLocaleString(toLocale);
  }
}
