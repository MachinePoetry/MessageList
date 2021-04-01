import { AppFile } from './appFile';

export class FileCollection {
  public images: (File | AppFile)[] = [];
  public video: (File | AppFile)[] = [];
  public audio: (File | AppFile)[] = [];
  public files: (File | AppFile)[] = [];
}
