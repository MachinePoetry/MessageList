import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FileService } from '../../shared/services/fileService/file.service';
import { FilePreviewMode } from './../../shared/models/componentModes/filePreviewMode';
import { Message } from './../../shared/models/Message';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css'],
})

export class MessageComponent {
  constructor(public fileService: FileService) { };

  @Input() message: Message;
  @Output() editMessage = new EventEmitter<Message>();
  @Output() deleteMessage = new EventEmitter<Message>();
  public filePreviewMode = FilePreviewMode;

  public edit(message) {
    this.editMessage.emit(message);
  }

  public delete(message) {
    this.deleteMessage.emit(message);
  }
}
