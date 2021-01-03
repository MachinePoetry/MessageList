import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-attach-file-from-web',
  templateUrl: './attach-file-from-web.modal.html',
  styleUrls: ['./attach-file-from-web.modal.css']
})

export class AttachFileFromWebModal {
  constructor(private _activeModal: NgbActiveModal) { }

  public fileUrl: string = '';
  public fileUrlReady: string = '';
  public isBrokenUrl: boolean = false;
  public disabled: boolean = false;

  public getContentFromUrl() {
    if ((this.fileUrl.startsWith('https://') || this.fileUrl.startsWith('http://'))) {
      this.isBrokenUrl = false;
      //clearTimeout(timer);
      //let timer = setTimeout(() => { this.fileUrlReady = this.fileUrl }, 1000);
      this.fileUrlReady = this.fileUrl;
    } else {
      this.isBrokenUrl = true;
    }
  }

  public ok(closeType: string): void {
    // close modal with video url inside to send it to main.ts
  }

  public cancel(closeType: string) {
    this._activeModal.close(closeType);
  }
}
