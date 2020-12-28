import { Component, AfterViewInit, Input, Output, EventEmitter, ViewChild, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { FileService } from '../../shared/services/fileService/file.service';

@Component({
  selector: 'app-file-preview',
  templateUrl: './file-preview.component.html',
  styleUrls: ['./file-preview.component.css']
})

export class FilePreviewComponent implements AfterViewInit {
  constructor(private _fileService: FileService) { }

  @Input() public fileCollection: { images: File[], video: File[], audio: File[], files: File[] } = {
    images: [], video: [], audio: [], files: []
  };
  @Output() changeFilesEvent = new EventEmitter<any>();

  @ViewChild('imageBlockContainer') imageBlockContainer: ElementRef;
  @ViewChildren('imageBlock') imageBlocks: QueryList<ElementRef>;
  @ViewChild('videoBlockContainer') videoBlockContainer: ElementRef;
  @ViewChildren('videoBlock') videoBlocks: QueryList<ElementRef>;
  @ViewChild('audioBlockContainer') audioBlockContainer: ElementRef;
  @ViewChildren('audioBlock') audioBlocks: QueryList<ElementRef>;
  @ViewChild('fileBlockContainer') fileBlockContainer: ElementRef;
  @ViewChildren('fileBlock') fileBlocks: QueryList<ElementRef>;

  public setImageWidth(): number {
    if (this.fileCollection.images.length <= 3) {
      return 32;
    } else if (this.fileCollection.images.length >= 4 && this.fileCollection.images.length <= 5) {
      return Math.ceil(95 / this.fileCollection.images.length);
    } else if (this.fileCollection.images.length >= 6 && this.fileCollection.images.length <= 9) {
      return Math.ceil(90 / this.fileCollection.images.length);
    } else {
      return 10;
    }
  }

  public enlargeImage(): void {

  }

  public deleteFile(file: File): void {
    let targetCollection: string;
    if (this._fileService.isImage(file)) {
      targetCollection = 'images';
    } else if (this._fileService.isVideo(file)) {
      targetCollection = 'video';
    } else if (this._fileService.isAudio(file)) {
      targetCollection = 'audio';
    } else if (this._fileService.isFile(file)) {
      targetCollection = 'files';
    } 
    this.fileCollection[targetCollection] = this.fileCollection[targetCollection].filter(im => im !== file);
  }

  private _showPreview(container: ElementRef, blocks: QueryList<ElementRef>, parentCollection: string, showSize: string, hideSize: string): void {
    blocks.changes.subscribe((list: QueryList<ElementRef>) => {
      container.nativeElement.style.height = this.fileCollection[parentCollection].length > 0 ? showSize : hideSize;
      this.changeFilesEvent.emit(this.fileCollection);
    });
  }

  ngAfterViewInit() {
    this._showPreview(this.imageBlockContainer, this.imageBlocks, 'images', '10vh', '0px');
    this._showPreview(this.videoBlockContainer, this.videoBlocks, 'video', '10vh', '0px');
    this._showPreview(this.audioBlockContainer, this.audioBlocks, 'audio', '5vh', '0px');
    this._showPreview(this.fileBlockContainer, this.fileBlocks, 'files', '5vh', '0px');
  }
}

