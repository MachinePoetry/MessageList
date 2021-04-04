import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { UrlPreviewResponse } from './../../models/urlPreviewResponse';
import { FileCollection } from './../../models/fileCollection';
import { AppFile } from './../../models/appFile';
import { AppFileCollection } from './../../models/appFileCollection';
import { MessageParams } from './../../models/params/messageParams';

@Injectable()

export class FileService {
  constructor(private _httpClient: HttpClient) { }

  public imageMaxSize: number = 1050000;
  public audioMaxSize: number = 20500000;
  public videoMaxSize: number = 105000000;
  public fileMaxSize: number = 10500000;

  private _appendFilesToFormData(collection: (File | AppFile)[], paramName: string, paramIdsName: string, fd: FormData): void {
    collection.forEach((value) => {
      value instanceof File ? fd.append(paramName, value) : fd.append(paramIdsName, value.id.toString());
    });
  }

  public convertParamsToFormData(previews: UrlPreviewResponse[], fileCollection: FileCollection, params: MessageParams): FormData {
    let fd: FormData = new FormData();

    fd.append('authUserId', params.authUserId.toString());
    fd.append('messageGroupId', params.messageGroupId.toString());
    fd.append('text', params.text);
    params.selectedMessageId ? fd.append('selectedMessageId', params.selectedMessageId.toString()) : fd.append('selectedMessageId', null);

    previews.forEach((value) => {
      value.id ? fd.append('urlPreviewIds', value.id.toString()) : fd.append('urlPreviews', JSON.stringify(value));
    });

    this._appendFilesToFormData(fileCollection.images, 'images', 'imagesIds', fd);
    this._appendFilesToFormData(fileCollection.video, 'video', 'videoIds', fd);
    this._appendFilesToFormData(fileCollection.audio, 'audio', 'audioIds', fd);
    this._appendFilesToFormData(fileCollection.files, 'files', 'filesIds', fd);

    return fd;
  }

  private _sendDataRequest(appFile: AppFile, fileType: string, mediaFile: HTMLMediaElement, link: HTMLLinkElement, addActionsToPromise: () => void): void {
    let httpParams: HttpParams = new HttpParams();
    httpParams = httpParams.set('fileId', appFile.id.toString());
    httpParams = httpParams.set('fileType', fileType);
    httpParams = httpParams.set('contentType', appFile.type);

    this._httpClient.get('api/files/fileData', { params: httpParams, responseType: 'blob' }).subscribe(data => {
      let reader: FileReader = new FileReader();
      reader.readAsDataURL(data);
      reader.onload = function (e) {
        if (mediaFile) {
          mediaFile.src = e.target.result.toString();
        } else if (link) {
          link.href = e.target.result.toString();
          addActionsToPromise ? addActionsToPromise() : null;
        }
      };
    });
  }

  public getFileData(appFile: AppFile, fileType: string, mediaFile?: HTMLMediaElement, link?: HTMLLinkElement): void {
    if (mediaFile) {
      this._sendDataRequest(appFile, fileType, mediaFile, null, null);
    } else if (link && !link.href.length) {
      this._sendDataRequest(appFile, fileType, null, link, () => link.click());
    }
  }

  //public convertBase64StringToFile(base64: string, fileName: string): File {
  //  let arr: string[] = base64.split(',');
  //  let mime: string = arr[0].match(/:(.*?);/)[1];
  //  let bstr;
  //  try {
  //    bstr = atob(arr[1]);
  //  } catch { };
  //  if (bstr) {
  //    let byteArrLength = bstr.length;
  //    let u8arr = new Uint8Array(byteArrLength);

  //    while (byteArrLength--) {
  //      u8arr[byteArrLength] = bstr.charCodeAt(byteArrLength);
  //    }
  //  return new File([u8arr], fileName, { type: mime });
  //  }
  //}

  //public convertAppFileCollectionToFileCollection(collection: AppFileCollection): FileCollection {
  //  let resultCollection: FileCollection = {
  //    images: [], video: [], audio: [], files: []
  //  }
  //  for (let arr in collection) {
  //    if (collection[arr].length) {
  //      let fileArr: File[] = [];
  //      collection[arr].forEach(el => {
  //        // Preview component gets files from 2 sources: from message (means from server) and from user PC, but they all are sent to server as js File.
  //        // If element is not a js File type (if came to preview from server) convert it to js File type. If it is File (came to preview from user PC) take it as is.
  //        if (!(el instanceof File)) {
  //          let base64: string = this._blobToSrc.transform(el.src, el);
  //          if (base64) {
  //            let newFile = this.convertBase64StringToFile(base64, el.name);
  //            if (newFile) {
  //              Object.defineProperty(newFile, 'src', { value: base64, writable: true });
  //              fileArr.push(newFile);
  //            }
  //          }
  //        } else {
  //          fileArr.push(el);
  //        }
  //      })
  //      resultCollection[arr] = fileArr;
  //    }
  //  }
  //  return resultCollection;
  //} 

  public isFileCollectionValid(collection: FileCollection | AppFileCollection): boolean {
    return (collection.images.length > 0 || collection.video.length > 0 || collection.audio.length > 0 || collection.files.length > 0);
  }

  public getUrlPreviewsClone(collection: UrlPreviewResponse[]): UrlPreviewResponse[] {
    let collectionClone: UrlPreviewResponse[] = [];
    collectionClone = collection.slice();
    return collectionClone;
  }

  public getFileCollectionClone(collection: FileCollection): FileCollection {
    let collectionClone: FileCollection = new FileCollection();
    collectionClone.images = collection.images.slice();
    collectionClone.video = collection.video.slice();
    collectionClone.audio = collection.audio.slice();
    collectionClone.files = collection.files.slice();
    return collectionClone;
  }

  public cleanFileCollection(collection: FileCollection): void {
    for (let key in collection) {
      collection[key] = [];
    }
  }

  public getFileCollectionType(collection: (File | AppFile)[]): string {
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

  public isImage = (file: File | AppFile) => {
    return file.type.startsWith('image/') ? true : false;
  }

  public isVideo = (file: File | AppFile) => {
    return file.type.startsWith('video/') ? true : false;
  }

  public isAudio = (file: File | AppFile) => {
    return file.type.startsWith('audio/') ? true : false;
  }

  public isFile = (file: File | AppFile) => {
    return (!file.type.startsWith('image/') && !file.type.startsWith('video/') && !file.type.startsWith('audio/')) ? true : false;
  }
}
