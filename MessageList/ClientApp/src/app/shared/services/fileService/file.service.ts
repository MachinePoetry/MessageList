import { Injectable } from '@angular/core';

@Injectable()

export class FileService {
  constructor() { }

  public imageMaxSize: number = 1050000;
  public audioMaxSize: number = 20500000;
  public videoMaxSize: number = 105000000;
  public fileMaxSize: number = 10500000;

  public getFileCollectionType(collection: File[]): string {
    let collectionType: string = '';

    if (this.isImage(collection[0])) {
      collectionType = 'images';
    } else if (this.isVideo(collection[0])) {
      collectionType = 'video';
    } else if (this.isAudio(collection[0])) {
      collectionType = 'audio';
    } else if (this.isFile(collection[0])) {
      collectionType = 'files';
    }

    return collectionType;
  }

  public isImage = (file: File) => {
    return file.type.startsWith('image/') ? true : false;
  }

  public isVideo = (file: File) => {
    return file.type.startsWith('video/') ? true : false;
  }

  public isAudio = (file: File) => {
    return file.type.startsWith('audio/') ? true : false;
  }

  public isFile = (file: File) => {
    return (!file.type.startsWith('image/') && !file.type.startsWith('video/') && !file.type.startsWith('audio/')) ? true : false;
  }
}
