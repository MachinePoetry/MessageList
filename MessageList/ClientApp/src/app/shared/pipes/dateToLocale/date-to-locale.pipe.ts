import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateToLocale'
})

export class DateToLocalePipe implements PipeTransform {
  transform(value: string, toLocale: string, args?: any) {
    return new Date(value).toLocaleString(toLocale);
  }
}
