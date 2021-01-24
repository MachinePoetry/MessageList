export class WarningModalParams {
  constructor(public header: string, public warningText: string, public type: string, id?: number) {
    if (id) {
      this.id = id;
    }
  }

  public id: number | null = null;
}
