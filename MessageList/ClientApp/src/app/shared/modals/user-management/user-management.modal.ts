import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from './../../services/http-service/http.service';
import { User } from './../../../shared/models/user';

@Component({
  selector: 'user-management-modal',
  templateUrl: './user-management.modal.html',
  styleUrls: ['./user-management.modal.css']
})

export class UserManagementModal implements OnInit {
  constructor(public activeModal: NgbActiveModal, private _httpService: HttpService) { }

  public authUserId: number | null = null;
  public users: User[] = [];
  public selectedIds: number[] = [];

  public toggleSelection(id: number): void {
    const idIndex = this.selectedIds.indexOf(id);
    idIndex > -1 ? this.selectedIds.splice(idIndex, 1) : this.selectedIds.push(id);
  }

  ngOnInit() {
    this._httpService.get('api/admin/getUsers').subscribe((data: User[]) => {
      this.users = data;
    })
  }
}
