import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'secondsToTime'
})

export class SecondsToTimePipe implements PipeTransform {
  public transform(milliSeconds: number, mode: string) {
    let result: string = '';
    let unitOfMeasure: number = (mode === 'audioPlayer' ? 1 : 1000);
    let days = Math.floor(milliSeconds / (86400 * unitOfMeasure));
    milliSeconds -= days * (86400 * unitOfMeasure);
    let hours = Math.floor(milliSeconds / (60 * 60 * unitOfMeasure));
    milliSeconds -= hours * (60 * 60 * unitOfMeasure);
    let minutes = Math.floor(milliSeconds / (60 * unitOfMeasure));
    milliSeconds -= minutes * (60 * unitOfMeasure);
    let seconds = Math.floor(milliSeconds / unitOfMeasure);

    if (mode === 'uptime') {
      result = (days < 10 ? '0' + days : days) + "d:" + (hours < 10 ? '0' + hours : hours) + "h:" + (minutes < 10 ? '0' + minutes : minutes) +
        "m:" + (seconds < 10 ? '0' + seconds : seconds) + "sec";
    }

    if (mode === 'audioPlayer') {
      if (hours > 0) {
        result = (hours < 10 ? '0' + hours : hours) + ":" + (minutes < 10 ? '0' + minutes : minutes) + ":" + (seconds < 10 ? '0' + seconds : seconds);
      } else {
        result = (minutes < 10 ? '0' + minutes : minutes) + ":" + (seconds < 10 ? '0' + seconds : seconds);
      }
    }

    return result;
  }
}
