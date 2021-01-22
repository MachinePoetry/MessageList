import { Component, AfterViewInit, Input, Output, EventEmitter, ViewChild, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { FileService } from './../../shared/services/fileService/file.service';
import { FilePreviewMode } from './../../shared/models/classes/filePreviewMode';
import { IFile } from './../../shared/models/interfaces/IFile';
import { IFileCollection } from './../../shared/models/interfaces/IFileCollection';
import { BlobToSrcPipe } from './../../shared/pipes/blobToSrc/blob-to-src.pipe';

@Component({
  selector: 'app-file-preview',
  templateUrl: './file-preview.component.html',
  styleUrls: ['./file-preview.component.css']
})

export class FilePreviewComponent implements AfterViewInit {
  constructor(private _fileService: FileService, private _blobToSrc: BlobToSrcPipe) { }

  @Input() public fileCollection: IFileCollection = {
    images: [], video: [], audio: [], files: []
  };
  @Input() public mode: string;
  @Output() changeFilesEvent = new EventEmitter<IFileCollection>();

  @ViewChild('imageBlockContainer') imageBlockContainer: ElementRef;
  @ViewChildren('imageBlock') imageBlocks: QueryList<ElementRef>;
  @ViewChild('videoBlockContainer') videoBlockContainer: ElementRef;
  @ViewChildren('videoBlock') videoBlocks: QueryList<ElementRef>;
  @ViewChild('audioBlockContainer') audioBlockContainer: ElementRef;
  @ViewChildren('audioBlock') audioBlocks: QueryList<ElementRef>;
  @ViewChild('fileBlockContainer') fileBlockContainer: ElementRef;
  @ViewChildren('fileBlock') fileBlocks: QueryList<ElementRef>;

  public fileUrl: string = '';
  public isImgModalVisible: boolean = false;
  public filePreviewMode = FilePreviewMode;

  public setPreviewWidth(collection): number {
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

  public showImageModal(image: IFile, imgModal: IFile): void {
    imgModal.src = this._blobToSrc.transform(image.src, image);
    this.isImgModalVisible = true;
  }

  public hideImageModal(): void {
    this.isImgModalVisible = false;
  }

  public setFileUrl(fileBlock: IFile): void {
    if (this.mode === this.filePreviewMode.message && fileBlock.src.startsWith("data:")) {
      let base64string = this._blobToSrc.transform(fileBlock.src, fileBlock);
      let fileToDownload: File = this._fileService.convertBase64StringToFile(base64string, fileBlock.name);
      let url = URL.createObjectURL(fileToDownload);
      this.fileUrl = url;
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

  ngAfterViewInit() {
    this._showPreview(this.imageBlockContainer, this.imageBlocks, 'images', 8, '0px');
    this._showPreview(this.videoBlockContainer, this.videoBlocks, 'video', 8, '0px');
    this._showPreview(this.audioBlockContainer, this.audioBlocks, 'audio', 42, '0px');
    this._showPreview(this.fileBlockContainer, this.fileBlocks, 'files', 4, '0px');
  }
}

