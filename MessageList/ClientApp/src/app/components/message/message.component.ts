import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FileService } from '../../shared/services/file-service/file.service';
import { FilePreviewMode } from './../../shared/models/componentModes/filePreviewMode';
import { UrlPreviewMode } from './../../shared/models/componentModes/urlPreviewMode';
import { Message } from './../../shared/models/message';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css'],
})

export class MessageComponent {
  constructor(public fileService: FileService) { };

  @Input() message: Message = new Message();
  @Output() editMessage = new EventEmitter<Message>();
  @Output() deleteMessage = new EventEmitter<Message>();
  public filePreviewMode = FilePreviewMode;
  public linkPreviewMode = UrlPreviewMode;

  public edit(message) {
    this.editMessage.emit(message);
  }

  public delete(message) {
    this.deleteMessage.emit(message);
  }
}
