import { Component, Input, Output, EventEmitter, ViewChild, ViewChildren, ElementRef, QueryList, AfterViewInit } from '@angular/core';
import { LinkPreviewResponse } from './../../shared/models/linkPreviewResponse';

@Component({
  selector: 'link-preview',
  templateUrl: './link-preview.component.html',
  styleUrls: ['./link-preview.component.css']
})

export class LinkPreviewComponent implements AfterViewInit {

  @Input() public previews: LinkPreviewResponse[] = [];
  @Input() public mode: string;
  @Output() public changePreviewsEvent = new EventEmitter<LinkPreviewResponse[]>();
  @Output() public setNoPreviewUrlsEvent = new EventEmitter<string[]>();

  @ViewChild('linkPreviewContainer') linkPreviewContainer: ElementRef;
  @ViewChildren('linkPreviewBlock') linkPreviewBlocks: QueryList<ElementRef>;

  private _noPreviewUrls: string[] = []

  public redirectByLink(url: string): void {
    window.open(url, "_blank");
  }

  public banUrlForPreview(url: string) {
    this._noPreviewUrls.push(url);
    this.setNoPreviewUrlsEvent.emit(this._noPreviewUrls);
    for (let response of this.previews) {
      if (url === response.url) {
        response.bannedForPreview = true;
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
