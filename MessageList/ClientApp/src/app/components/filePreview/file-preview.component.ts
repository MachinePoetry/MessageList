import { Component, AfterViewInit, Input, Output, EventEmitter, ViewChild, ViewChildren, QueryList, ElementRef } from '@angular/core';

@Component({
  selector: 'app-file-preview',
  templateUrl: './file-preview.component.html',
  styleUrls: ['./file-preview.component.css']
})

export class FilePreviewComponent implements AfterViewInit {

  @Input() fileCollection: any;
  @Output() changeFilesEvent = new EventEmitter<any>();

  @ViewChild('imageBlockContainer') imageBlockContainer: ElementRef;
  @ViewChildren('imageBlock') imageBlocks: QueryList<ElementRef>;

  public imageWidth(): number {
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

  public deleteImage(image: File): void {
    this.fileCollection.images = this.fileCollection.images.filter(im => im !== image);
  }

  ngAfterViewInit() {
    this.imageBlocks.changes.subscribe((list: QueryList<ElementRef>) => {
      this.imageBlockContainer.nativeElement.style.height = this.fileCollection.images.length > 0 ? '10vh' : '0px';
      this.changeFilesEvent.emit(this.fileCollection);
    });
  }
}

