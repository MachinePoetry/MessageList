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

  public cleanFileCollection(collection: IFileCollection) {
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
