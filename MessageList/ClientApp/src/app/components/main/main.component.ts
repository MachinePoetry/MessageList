import { Component, OnInit, AfterViewInit, ViewChild, ViewChildren, ElementRef, HostListener, ViewEncapsulation, QueryList } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { HttpService } from '../../shared/services/httpService/http-service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModal } from '../../shared/modals/confirm/confirm.modal';
import { ConfirmModalParams } from '../../shared/models/confirmModalParams';
import { User } from '../../shared/models/user';
import { MessageGroup } from '../../shared/models/messageGroup';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, AfterViewInit {
  constructor(private httpService: HttpService, private _route: ActivatedRoute, private _modalService: NgbModal) { }

  @ViewChild('appHeader', { read: ElementRef }) appHeader: ElementRef;
  @ViewChild('groupMessageBlock') groupMessageBlock: ElementRef;
  @ViewChildren('group') groupes: QueryList<ElementRef>;
  @ViewChild('messageBlock') messageBlock: ElementRef;
  @ViewChild('searchBlock') searchBlock: ElementRef;
  @ViewChild('enterMessageBlock') enterMessageBlock: ElementRef;
  @ViewChild('enterMessageField') enterMessageField: ElementRef;
  @ViewChildren('message') messages: QueryList<ElementRef>;
  @ViewChild('messageEditingBlock') messageEditingBlock: ElementRef;


  // Component variables

  public showAlert: boolean;
  public errorText: string;
  public selectedGroupId: number | null = null;
  public selectedMessageId: number | null;
  public showGroupCreationForm: boolean = false;
  public editMessageGroupFormId: number | null = null;
  public searchString: string = '';
  public isCollapsed: boolean = true;
  public showEditMessageForm: boolean = false;
  public newMessage: string = '';
  private isMessagesIterable = true;
  private isGroupesIterable = true;

  public authUserInfo: User;
  public authUserMessageGroups: MessageGroup[] = [];


  // Create new group

  public createNewMessageGroup(form: NgForm): void {
    let groupParams: { name: string, userId: number | null } = {
      name: form.value.name,
      userId: this.authUserInfo.id
    }
    this.enterMessageField.nativeElement.focus();

    this.httpService.post('/api/messageGroup/create', groupParams).subscribe(data => {
      this.showGroupCreationForm = false;
      this.httpService.get('api/messages/getGroupesAndMessages', { id: this.authUserInfo.id }).subscribe((data: MessageGroup[]) => {
        this.authUserMessageGroups = data;
        this.selectedGroupId = this.authUserMessageGroups[this.authUserMessageGroups.length - 1]?.id;
        this.isGroupesIterable = true;
      },
        error => {
          this.errorText = error.message;
          this.showAlert = true;
        }
      )
    },
      error => {
        this.errorText = error.message;
        this.showAlert = true;
      }
    );
  }

  // Update existing group

  public updateMessageGroup(groupId: number, groupName: string): void {
    let groupParams: { userId: number, id: number | null, name: string } = {
      userId: this.authUserInfo.id,
      id: groupId,
      name: groupName
    }
    this.enterMessageField.nativeElement.focus();

    this.httpService.post('/api/messageGroup/update', groupParams).subscribe(data => {
      this.showGroupCreationForm = false;
      this.httpService.get('api/messages/getGroupesAndMessages', { id: this.authUserInfo.id }).subscribe((data: MessageGroup[]) => {
        this.authUserMessageGroups = data;
        this.editMessageGroupFormId = null;
      },
        error => {
          this.errorText = error.message;
          this.showAlert = true;
        }
      )
    },
      error => {
        this.errorText = error.message;
        this.showAlert = true;
      }
    );
  }

    // Create and Update new message

  public createAndUpdateMessage(messageId?: number): void {

    let messageParams: { authUserId: number, messageGroupId: number | null, text: string, id: number | null } = {
      authUserId: this.authUserInfo.id,
      messageGroupId: this.selectedGroupId,
      text: this.newMessage,
      id: this.selectedMessageId
    }
    this.enterMessageField.nativeElement.focus();

    let url: string = this.showEditMessageForm ? '/api/messages/update' : '/api/messages/create';

    this.httpService.post(url, messageParams).subscribe(data => {

      this.httpService.get('api/messages/getGroupesAndMessages', { id: this.authUserInfo.id }).subscribe((data: MessageGroup[]) => {
        this.authUserMessageGroups = data;
        if (url === '/api/messages/create') {
          this.isMessagesIterable = true;
        }
      },
        error => {
          this.errorText = error.message;
          this.showAlert = true;
        }
      )
    },
      error => {
        this.errorText = error.message;
        this.showAlert = true;
      }
    );

    this.enterMessageField.nativeElement.value = '';
    this.newMessage = '';
    this.toggleEditingMessageForm(false, null);
    this.setMessageCreationFormHeight();
    this.selectedMessageId = null;
  }

  toggleEditingMessageForm(isVisible: boolean, messageId: number, messageText?: string) {
    this.showEditMessageForm = isVisible;
    this.selectedMessageId = messageId;
    if (isVisible) {
      this.messageEditingBlock.nativeElement.classList.remove('d-none');
      this.messageEditingBlock.nativeElement.classList.add('d-block');
      this.enterMessageField.nativeElement.value = messageText;
      this.setMessageCreationFormHeight();
      this._setMessageBlockHeight();
      this.enterMessageField.nativeElement.focus();
    } else {
      this.messageEditingBlock.nativeElement.classList.remove('d-block');
      this.messageEditingBlock.nativeElement.classList.add('d-none');
      this.enterMessageField.nativeElement.value = '';
      this.setMessageCreationFormHeight();
      this._setMessageBlockHeight();
      this.enterMessageField.nativeElement.focus();
    }
  }

    // Search

  public searchMessages(): void {
    let searchParams: { id: number, groupId: number, stringToSearch: string } = {
      id: this.authUserInfo.id,
      groupId: this.selectedGroupId,
      stringToSearch: this.searchString
    }

    if (this.searchString.length > 0) {
      this.httpService.get('api/messages/search', searchParams).subscribe((data: MessageGroup[]) => {
        this.authUserMessageGroups = data;
      },
        error => {
          this.errorText = error.message;
          this.showAlert = true;
        }
      )
    }
  }

  public stopSearchMessages(): void {
    this.enterMessageField.nativeElement.focus();

    if (this.isCollapsed == false) {
      this.isCollapsed = true;
      this.searchString = '';

      this.httpService.get('api/messages/getGroupesAndMessages', { id: this.authUserInfo.id }).subscribe((data: MessageGroup[]) => {
        this.authUserMessageGroups = data;
      },
        error => {
          this.errorText = error.message;
          this.showAlert = true;
        }
      )
    }
  }

    // Modals

  public modalOpen(requesetMethod: string, header: string, body: string, entityId: number, url: string) {
    let modalRef = this._modalService.open(ConfirmModal);
    modalRef.result.then((result) => {
      if (result === 'okButton') {
        this.httpService.get('api/messages/getGroupesAndMessages', { id: this.authUserInfo.id }).subscribe((data: MessageGroup[]) => {
          this.authUserMessageGroups = data;

          if (url === 'api/messageGroup/delete' && this.selectedGroupId === entityId) {
            this.selectedGroupId = this.authUserMessageGroups[this.authUserMessageGroups.length - 1]?.id;
            this.isGroupesIterable = true;
          }
          this.enterMessageField.nativeElement.focus();
        },
          error => { }
        );
      }
    }, (reason) => { });
    modalRef.componentInstance.modalWindowParams = new ConfirmModalParams(requesetMethod, header, body, this.authUserInfo, entityId, url);
    modalRef.hidden.subscribe(() => this.enterMessageField.nativeElement.focus());
  }

    // Component methods

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this._setMessageBlockHeight();
  }

  public groupsTrackFn(index, group) {
    return group.name;
  }

  changeMessageGroup() {
    this.stopSearchMessages();
    this.isMessagesIterable = true;
  }

  hideGroupCreationForm() {
    this.showGroupCreationForm = false;
    this.enterMessageField.nativeElement.focus();
  }

  hideGroupUpdateForm() {
    this.editMessageGroupFormId = null;
    this.enterMessageField.nativeElement.focus();
  }

  public setMessageCreationFormHeight() {
    this.enterMessageField.nativeElement.style.height = 'auto';
    this.enterMessageField.nativeElement.style.height = this.enterMessageField.nativeElement.scrollHeight < window.innerHeight / 5 ? this.enterMessageField.nativeElement.scrollHeight + 2 + 'px' : window.innerHeight / 5 + 'px';
    this._setMessageBlockHeight();
  }

  public _setMessageBlockHeight(): void {
    this.messageBlock.nativeElement.style.height = window.innerHeight - this.appHeader.nativeElement.offsetHeight -
                                                   this.searchBlock.nativeElement.offsetHeight - this.enterMessageBlock.nativeElement.offsetHeight + 'px';
  }

  // Implemented interfaces

  ngOnInit() {
    this.authUserInfo = this._route.snapshot.data['user'];

    if (this.authUserInfo != null) {
      this.httpService.get('api/messages/getGroupesAndMessages', { id: this.authUserInfo.id }).subscribe((data: MessageGroup[]) => {
        this.authUserMessageGroups = data;
        if (this.authUserMessageGroups.length > 0) {
          this.selectedGroupId = this.authUserMessageGroups[this.authUserMessageGroups.length - 1]?.id;
        }
      });
    }
  }

  ngAfterViewInit() {
    this._setMessageBlockHeight();
    this.messages.changes.subscribe((list: QueryList<ElementRef>) => {
      if (this.isMessagesIterable) {
        this.messageBlock.nativeElement.scrollTop = this.messageBlock.nativeElement.scrollHeight;
        this.isMessagesIterable = false;
      }
    });
    this.groupes.changes.subscribe((list: QueryList<ElementRef>) => {
      if (this.isGroupesIterable) {
        this.groupMessageBlock.nativeElement.scrollTop = this.groupMessageBlock.nativeElement.scrollHeight;
        this.isGroupesIterable = false;
      }
    });
  }
}
