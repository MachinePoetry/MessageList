import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AttachFileModalParams } from './../../models/attachFileModalParams';

@Component({
  selector: 'app-attach-file-from-web',
  templateUrl: './attach-file-from-web.modal.html',
  styleUrls: ['./attach-file-from-web.modal.css']
})

export class AttachFileFromWebModal {
  constructor(private _activeModal: NgbActiveModal) { }

  @Input() modalWindowParams: AttachFileModalParams;

  public fileUrl: string = '';
  public isBrokenUrl: boolean = false;
  public disabled: boolean = false;
  private _files: File[] = [];

  public getContentFromUrl() {
    this.fileUrl.startsWith('https://www') || this.fileUrl.startsWith('http://www') ? this.isBrokenUrl = false : this.isBrokenUrl = true;
  }

  public ok(closeType: string): void {

  }

  public cancel(closeType: string) {
    this._activeModal.close(closeType);
  }
}
