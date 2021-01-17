import { Injectable } from '@angular/core';
import { IFileCollection } from '../../models/interfaces/IFileCollection';
import { IMessageParams } from './../../models/interfaces/IMessageParams';

@Injectable()

export class FileService {
  constructor() { }

  public imageMaxSize: number = 1050000;
  public audioMaxSize: number = 20500000;
  public videoMaxSize: number = 105000000;
  public fileMaxSize: number = 10500000;

  public convertParamsToFormData(collection: IFileCollection, params: IMessageParams): FormData {
    let fd: FormData = new FormData();

    for (let key in params) {
      if (params[key] && params[key] !== 'string') {
        fd.append(key, params[key].toString());
      } else {
        fd.append(key, params[key]);
      }
    }

    if (collection.images.length) {
      collection.images.forEach((value) => {
        fd.append('images', value);
      });
    }
    if (collection.video.length) {
      collection.video.forEach((value) => {
        fd.append('video', value);
      });
    }
    if (collection.audio.length) {
      collection.audio.forEach((value) => {
        fd.append('audio', value);
      });
    }
    if (collection.files.length) {
      collection.files.forEach((value) => {
        fd.append('files', value);
      });
    }

    return fd;
  }

  public convertBase64StringToFile(base64: string, fileName: string): File {
    let arr: string[] = base64.split(',');
    let mime: string = arr[0].match(/:(.*?);/)[1];
    let bstr = atob(arr[1])
    let byteArrLength = bstr.length;
    let u8arr = new Uint8Array(byteArrLength);

    while (byteArrLength--) {
      u8arr[byteArrLength] = bstr.charCodeAt(byteArrLength);
    }

    return new File([u8arr], fileName, { type: mime });
  }

  public isFileCollectionValid(collection: IFileCollection): boolean {
    return (collection.images.length > 0 || collection.video.length > 0 || collection.audio.length > 0 || collection.files.length > 0);
  }

  public cleanFileCollection(collection: IFileCollection): void {
    for (let key in collection) {
      collection[key] = [];
    }
  }

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
