import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

export interface ISearchable {
  id: number,
  groupId: number,
  stringToSearch: string,
  dateToSearch: NgbDateStruct
}
