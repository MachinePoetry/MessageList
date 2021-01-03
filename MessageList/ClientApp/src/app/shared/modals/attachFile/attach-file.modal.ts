import { Component, Input, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FileService } from './../../services/fileService/file.service';
import { AttachFileFromWebModal } from './../attachFileFromWeb/attach-file-from-web.modal';
import { AttachFileModalParams } from './../../models/attachFileModalParams';

@Component({
  selector: 'app-attach-file',
  templateUrl: './attach-file.modal.html',
  styleUrls: ['./attach-file.modal.css']
})

export class AttachFileModal implements OnInit {
  constructor(private _activeModal: NgbActiveModal, private _modalService: NgbModal, private _fileService: FileService) { }

  @Input() modalWindowParams: AttachFileModalParams;

  private _checkFileType: (file: File) => boolean;
  private _maxFileSize: number;
  public files: File[] = [];

  public onChange(event) {
    for (var file of event.target.files) {
      if (file.size < this._maxFileSize && this._checkFileType(file)) {
        this.files.push(file);
      }
    }
    this._activeModal.close(this.files);
  }

  public openFileFromWebModal(): void {
    let modalRef = this._modalService.open(AttachFileFromWebModal, { centered: true });
    modalRef.result.then((result) => {

    }, (reason) => { });
  }

  public cancel(closeType: string): void {
    this._activeModal.close(closeType);
  }

  ngOnInit() {
    switch (this.modalWindowParams.modalType) {
      case 'image':
        this._checkFileType = this._fileService.isImage;
        this._maxFileSize = this._fileService.imageMaxSize;
        break;
      case 'video':
        this._checkFileType = this._fileService.isVideo;
        this._maxFileSize = this._fileService.videoMaxSize;
        break;
      case 'audio':
        this._checkFileType = this._fileService.isAudio;
        this._maxFileSize = this._fileService.audioMaxSize;
        break;
      case 'file':
        this._checkFileType = this._fileService.isFile;
        this._maxFileSize = this._fileService.fileMaxSize;
        break;
      default:
        this._checkFileType = this._fileService.isFile;
        this._maxFileSize = this._fileService.fileMaxSize;
    }
  }
}
