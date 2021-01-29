import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'secondsToTime'
})

export class SecondsToTimePipe implements PipeTransform {
  public transform(value: number) {
    if (typeof value !== 'number') {
      throw new Error('SecondsToTime can only be used with number');
    }
    let result: string = '';
    let secondsAmount = Math.trunc(value);
    let currentHour = Math.trunc(secondsAmount / 3600);
    let currentMinute = Math.trunc(secondsAmount / 60) < 60 ? Math.trunc(secondsAmount / 60) : Math.trunc(secondsAmount / 60) - 60;
    let currentSecond = secondsAmount < 60 ? secondsAmount : secondsAmount % 60;

    if (currentHour > 0) {
      // result string has format "00:00:00", so here are two types of ":"  1) a part of a string  2) a part of ternary operator "? :"
      result = `${currentHour < 10 ? `0${currentHour}` : currentMinute}:${currentMinute < 10 ? `0${currentMinute}` : currentMinute}:${currentSecond < 10 ? `0${currentSecond}` : currentSecond}`;
    } else {
      result = `${ currentMinute < 10 ? `0${currentMinute}` : currentMinute }:${ currentSecond < 10 ? `0${currentSecond}` : currentSecond }`;
    }

    return result;
  }
}
