import { Component, Input, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FileService } from './../../services/file-service/file.service';
import { AttachFileModalParams } from './../../models/params/attachFileModalParams';
import { WarningModal } from './../warning/warning.modal';
import { WarningModalParams } from './../../models/params/warningModalParams';

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

  public onChange(event): void {
    if (event.target.files.length > 8) {
      let modalRef = this._modalService.open(WarningModal);
      modalRef.result.then((result) => { }, (reason) => { });
      modalRef.componentInstance.modalWindowParams = new WarningModalParams('Предупреждение!', 'Не допускается загрузка более 8 файлов одного типа в одно сообщение', 'warning');
      return;
    } else {
      for (var file of event.target.files) {
        if (file.size < this._maxFileSize && this._checkFileType(file)) {
          this.files.push(file);
        }
      }
      this._activeModal.close(this.files);
    }
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
