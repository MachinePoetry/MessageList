import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'safeUrl'
})

export class SafeUrl implements PipeTransform {
  constructor(private _sanitizer: DomSanitizer) { }

  public transform(url: string) {
    return this._sanitizer.bypassSecurityTrustUrl(url);
  }
}
