import { Component, AfterViewInit, Input, Output, EventEmitter, ViewChild, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { FileService } from './../../shared/services/file-service/file.service';
import { FilePreviewMode } from './../../shared/models/componentModes/filePreviewMode';
import { AppFile } from './../../shared/models/appFile';
import { FileCollection } from './../../shared/models/fileCollection';
import { BlobToSrcPipe } from './../../shared/pipes/blob-to-src/blob-to-src.pipe';

@Component({
  selector: 'app-file-preview',
  templateUrl: './file-preview.component.html',
  styleUrls: ['./file-preview.component.css']
})

export class FilePreviewComponent implements AfterViewInit {
  constructor(private _fileService: FileService, private _blobToSrc: BlobToSrcPipe) { }

  @Input() public fileCollection: FileCollection = new FileCollection();
  @Input() public mode: string;
  @Output() changeFilesEvent = new EventEmitter<FileCollection>();

  @ViewChild('imageBlockContainer') imageBlockContainer: ElementRef;
  @ViewChildren('imageBlock') imageBlocks: QueryList<ElementRef>;
  @ViewChild('videoBlockContainer') videoBlockContainer: ElementRef;
  @ViewChildren('videoBlock') videoBlocks: QueryList<ElementRef>;
  @ViewChild('audioBlockContainer') audioBlockContainer: ElementRef;
  @ViewChildren('audioBlock') audioBlocks: QueryList<ElementRef>;
  @ViewChild('fileBlockContainer') fileBlockContainer: ElementRef;
  @ViewChildren('fileBlock') fileBlocks: QueryList<ElementRef>;

  public isImgModalVisible: boolean = false;
  public filePreviewMode = FilePreviewMode;

  public setPreviewWidth(collection: File[] | AppFile[]): number {
    if (collection.length <= 3) {
      return 32;
    } else if (collection.length >= 4 && collection.length <= 5) {
      return Math.ceil(95 / collection.length);
    } else if (collection.length >= 6 && collection.length <= 9) {
      return Math.ceil(88 / collection.length);
    } else {
      return 10;
    }
  }

  public showImageModal(image: AppFile, imgModal: AppFile): void {
    imgModal.src = this._blobToSrc.transform(image.src, image);
    this.isImgModalVisible = true;
  }

  public hideImageModal(): void {
    this.isImgModalVisible = false;
  }

  public setFileUrl(fileBlock: AppFile, fileType: string, link: HTMLLinkElement): void {
    if (this.mode === this.filePreviewMode.message) {
      this._fileService.getFileData(fileBlock, fileType, this.mode, null, link);
    }
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

  private _showPreview(container: ElementRef, blocks: QueryList<ElementRef>, parentCollection: string, showSize: number, hideSize: string): void {
    blocks.changes.subscribe((list: QueryList<ElementRef>) => {
      let height: string = showSize + 'vh';

      if (parentCollection === 'images' || parentCollection === 'video') {
        height = this.fileCollection[parentCollection].length > 0 ? showSize + 'vh' : hideSize;
      } else if (parentCollection === 'audio') {
        height = this.fileCollection[parentCollection].length > 0 ? this.fileCollection[parentCollection].length * showSize + 'px' : hideSize;
      } else if (parentCollection === 'files') {
        height = this.fileCollection[parentCollection].length > 0 ? Math.ceil(this.fileCollection[parentCollection].length / 2) * showSize + 'vh' : hideSize;
      }
      container.nativeElement.style.height = height;
      this.changeFilesEvent.emit(this.fileCollection);
    });
  }

  public getVideoData(video: HTMLMediaElement, videoAppFile: AppFile): void {
    this._fileService.getFileData(videoAppFile, 'video', this.mode, video, null);
  }

  ngAfterViewInit() {
    this._showPreview(this.imageBlockContainer, this.imageBlocks, 'images', 8, '0px');
    this._showPreview(this.videoBlockContainer, this.videoBlocks, 'video', 12, '0px');
    this._showPreview(this.audioBlockContainer, this.audioBlocks, 'audio', 42, '0px');
    this._showPreview(this.fileBlockContainer, this.fileBlocks, 'files', 4, '0px');
  }
}

