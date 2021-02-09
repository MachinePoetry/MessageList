import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

export class SearchParams {
  constructor(public authUserId: number, public groupId: number, public stringToSearch: string, public dateToSearch: NgbDateStruct) { }
}
