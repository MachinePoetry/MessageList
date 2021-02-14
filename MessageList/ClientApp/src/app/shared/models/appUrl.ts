export class AppUrl {
  constructor(public newUrl: string) {
    this.url = newUrl;
  }
  public url: string = '';
  public hasPreview: boolean = false;
}
