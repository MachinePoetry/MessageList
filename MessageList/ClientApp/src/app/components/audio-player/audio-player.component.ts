import { Component, Input } from '@angular/core';
import { FileService } from './../../shared/services/file-service/file.service';
import { AppFile } from './../../shared/models/appFile';
import { FilePreviewMode } from './../../shared/models/componentModes/filePreviewMode';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.css']
})

export class AudioPlayerComponent {
  constructor(private _fileService: FileService) { }

  @Input() public audioFile: AppFile;
  @Input() public mode: string;

  public isPaused: boolean = true;
  public isPlayStarted: boolean = false;
  public isControlsVisible: boolean = false;
  public audioProgress: number = 0;
  public volume: number = 1;
  public filePreviewMode = FilePreviewMode;

  public togglePlay(audio: HTMLMediaElement, audioAppFile: AppFile): void {
    this._fileService.getFileData(audioAppFile, 'audio', this.mode, audio, null);

    if (audio.paused) {
      audio.play();
      this.isPaused = false;
      this.isControlsVisible = true;
      this.isPlayStarted = true;
    } else {
      audio.pause();
      this.isPaused = true;
    }
  }

  public showProgress(audio: HTMLMediaElement): void {
    this.audioProgress = audio.currentTime;
  }

  public changeAudioProgress(audio: HTMLMediaElement): void {
    audio.currentTime = this.audioProgress;
  }

  public changeVolume(audio: HTMLMediaElement): void {
    audio.volume = this.volume;
  }

  public resetAudioControls(audio: HTMLMediaElement): void {
    audio.currentTime = 0;
    this.audioProgress = 0;
    this.isPaused = true;
    this.isPlayStarted = false;
  }

  public setFileUrl(fileBlock: AppFile, fileType: string, link: HTMLLinkElement): void {
    if (this.mode === this.filePreviewMode.message) {
      this._fileService.getFileData(fileBlock, fileType, this.mode, null, link);
    }
  }
}
