import { Component, Input, Output, EventEmitter, ViewChild, ViewChildren, ElementRef, QueryList, AfterViewInit } from '@angular/core';
import { LinkPreviewResponse } from './../../shared/models/linkPreviewResponse';

@Component({
  selector: 'url-preview',
  templateUrl: './url-preview.component.html',
  styleUrls: ['./url-preview.component.css']
})

export class UrlPreviewComponent implements AfterViewInit {

  @Input() public previews: LinkPreviewResponse[] = [];
  @Input() public mode: string;
  @Output() public changePreviewsEvent = new EventEmitter<LinkPreviewResponse[]>();

  @ViewChild('linkPreviewContainer') linkPreviewContainer: ElementRef;
  @ViewChildren('linkPreviewBlock') linkPreviewBlocks: QueryList<ElementRef>;

  public redirectByLink(url: string): void {
    window.open(url, "_blank");
  }

  public banUrlForPreview(url: string) {
    for (let response of this.previews) {
      if (url === response.url) {
        this.previews.splice(this.previews.indexOf(response), 1);
      }
    }
  }

  ngAfterViewInit() {
    this.linkPreviewBlocks.changes.subscribe((list: QueryList<ElementRef>) => {
      this.linkPreviewContainer.nativeElement.style.height = this.previews.length > 0 ? '200px' : '0px';
      this.changePreviewsEvent.emit(this.previews);
    });
  }
}
