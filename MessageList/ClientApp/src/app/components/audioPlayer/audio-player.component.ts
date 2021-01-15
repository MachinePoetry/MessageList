import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.css']
})

export class AudioPlayerComponent {

  @Input() public audioFile: any;
  @Input() public mode: string;

  public isPaused: boolean = true;
  public isPlayStarted: boolean = false;
  public isControlsVisible: boolean = false;
  public audioProgress: number = 0;
  public volume: number = 1;

  public togglePlay(audio: HTMLMediaElement): void {
    if (audio.paused) {
      if (audio.readyState >= 2) {
        audio.play();
        this.isPaused = false;
        this.isControlsVisible = true;
        this.isPlayStarted = true;
      }
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
}
