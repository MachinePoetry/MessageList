import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FileService } from '../../shared/services/fileService/file.service';
import { FilePreviewMode } from './../../shared/models/classes/filePreviewMode';
import { IMessage } from './../../shared/models/interfaces/IMessage';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css'],
})

export class MessageComponent {
  constructor(public fileService: FileService) { };

  @Input() message: IMessage;
  @Output() editMessage = new EventEmitter<IMessage>();
  @Output() deleteMessage = new EventEmitter<IMessage>();
  public filePreviewMode = FilePreviewMode;

  public edit(message) {
    this.editMessage.emit(message);
  }

  public delete(message) {
    this.deleteMessage.emit(message);
  }
}
