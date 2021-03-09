import { AudioPlayerComponent } from './audio-player.component';
import { AppFile } from './../../shared/models/appFile';
import { FileService } from './../../shared/services/file-service/file.service';
import { BlobToSrcPipe } from './../../shared/pipes/blob-to-src/blob-to-src.pipe';
import { SecondsToTimePipe } from './../../shared/pipes/seconds-to-time/seconds-to-time.pipe';
import { SafeUrlPipe } from './../../shared/pipes/safe-url/safe-url.pipe';
import { FormsModule } from '@angular/forms';
import { TestBed } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';
import { Pipe, NO_ERRORS_SCHEMA } from '@angular/core';

@Pipe({ name: 'blobToSrc' })
class BlobToSrcPipeStub {
  public transform() { };
}

@Pipe({ name: 'safeUrl' })
class SafeUrlPipeStub {
  public transform() { };
}

@Pipe({ name: 'secondsToTime' })
class SecondsToTimePipeStub {
  public transform() { };
}


describe('AudioPlayerComponent', () => {
  let component: AudioPlayerComponent;
  let fixture: ComponentFixture<AudioPlayerComponent>;
  let mockBlobToSrcPipe = { transform: jasmine.createSpy('transform').and.returnValue(true) };
  let mockFileService = { isImage: jasmine.createSpy('transform').and.returnValue(true) };
  let appFile: AppFile;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [AudioPlayerComponent, BlobToSrcPipeStub, SafeUrlPipeStub, SecondsToTimePipeStub],
      providers: [
        { provide: FileService, useValue: mockFileService },
        { provide: BlobToSrcPipe, useValue: mockBlobToSrcPipe },
        { provide: SecondsToTimePipe, useValue: mockFileService },
        { provide: SafeUrlPipe, useValue: mockFileService },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(AudioPlayerComponent);
    component = fixture.componentInstance;
    component.mode = 'preview';

    await fixture.whenStable();
    appFile = new AppFile();
    appFile.type = 'image/jpeg';
    appFile.src = 'iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAA';
    component.audioFile = appFile;
    fixture.detectChanges();
  });

  it('should create the Audio player component', () => {
    expect(component).toBeTruthy();
  })

  it('should render audio container', () => {
    let audioContainer: HTMLDivElement = fixture.nativeElement.querySelector('#audioContainer');
    expect(audioContainer).toBeTruthy();
  })

  it('should have <audio> tag ready', () => {
    let audio: HTMLMediaElement = fixture.nativeElement.querySelector('audio');
    expect(audio).toBeTruthy();
  })

  it('should render link to download audio file', () => {
    let link: HTMLLinkElement = fixture.nativeElement.querySelector('a[download]');
    expect(link).toBeTruthy();
  })

  it('should render default audio duration', () => {
    let duration: HTMLSpanElement = fixture.nativeElement.querySelector('.current-time');
    expect(duration.textContent).toBe(' 00:00 ');
  })
})
