import { Component, OnInit, AfterViewInit, ViewChild, ViewChildren, ElementRef, HostListener, ViewEncapsulation, QueryList } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { HttpService } from '../../shared/services/httpService/http-service.service';
import { ToastService } from '../../shared/services/toastService/toast.service';
import { FileService } from '../../shared/services/fileService/file.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModal } from '../../shared/modals/confirm/confirm.modal';
import { ConfirmModalParams } from '../../shared/models/confirmModalParams';
import { AttachFileModal } from '../../shared/modals/attachFile/attach-file.modal';
import { AttachFileModalParams } from '../../shared/models/attachFileModalParams';
import { User } from '../../shared/models/user';
import { MessageGroup } from '../../shared/models/messageGroup';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./main.component.css']
})

export class MainComponent implements OnInit, AfterViewInit {
  constructor(private _httpService: HttpService, private _route: ActivatedRoute, private _toastService: ToastService,
              private _modalService: NgbModal, private _fileService: FileService) { }

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

  public selectedGroupId: number | null = null;
  public selectedMessageId: number | null;
  public showGroupCreationForm: boolean = false;
  public editMessageGroupFormId: number | null = null;
  public searchString: string = '';
  public isCollapsed: boolean = true;
  public showEditMessageForm: boolean = false;
  private _previousMessageBlockHeight: number | null = null;
  public newMessage: string = '';
  private _messagesToLoadCounter: number = 30;
  private _freezeScrollBar = false;
  private _isMessagesIterable = true;
  private _isGroupesIterable = true;
  public fileCollection: { images: File[], video: File[], audio: File[], files: File[] } = {
    images: [], video: [], audio: [], files: []
  };
  private readonly _notOnlySpaceBar = /\S/;

  public authUserInfo: User = new User();
  public authUserMessageGroups: MessageGroup[] = [];


  // Create new group

  public createNewMessageGroup(form: NgForm): void {
    if (form.valid && this._notOnlySpaceBar.test(form.value.newGroupName)) {
      let groupParams: { name: string, userId: number | null } = {
        name: form.value.newGroupName,
        userId: this.authUserInfo.id
      }
      this.enterMessageField.nativeElement.focus();

      this._httpService.post('/api/messageGroup/create', groupParams).subscribe(data => {
        this.showGroupCreationForm = false;
        this._refreshGroupsAndMessages({ id: this.authUserInfo.id },
          () => {
            this.selectedGroupId = this.authUserMessageGroups[this.authUserMessageGroups.length - 1]?.id;
            this._isGroupesIterable = true;
          }
        );
      },
        error => this._toastService.showDanger(error.message)
      );
    }
  }

  // Update existing group

  public updateMessageGroup(groupId: number, form: NgForm): void {
    if (form.valid && this._notOnlySpaceBar.test(form.value.updateGroupName)) {
      let groupParams: { userId: number, id: number | null, name: string } = {
        userId: this.authUserInfo.id,
        id: groupId,
        name: form.value.updateGroupName
      }
      this.enterMessageField.nativeElement.focus();

      this._httpService.post('/api/messageGroup/update', groupParams).subscribe(data => {
        this.showGroupCreationForm = false;
        this._refreshGroupsAndMessages({ id: this.authUserInfo.id },
          () => {
            this.editMessageGroupFormId = null;
          }
        );
      },
        error => this._toastService.showDanger(error.message)
      );
    }
  }

    // Create and Update new message

  public createAndUpdateMessage(form: NgForm): void {
    if (form.valid && this._notOnlySpaceBar.test(this.newMessage)) {
      let messageParams: { authUserId: number, messageGroupId: number | null, text: string, id: number | null } = {
        authUserId: this.authUserInfo.id,
        messageGroupId: this.selectedGroupId,
        text: this.newMessage,
        id: this.selectedMessageId
      }
      this.enterMessageField.nativeElement.focus();

      let url: string = this.showEditMessageForm ? '/api/messages/update' : '/api/messages/create';

      this._httpService.post(url, messageParams).subscribe(data => {
        this._refreshGroupsAndMessages({ id: this.authUserInfo.id },
          () => {
            if (url === '/api/messages/create') {
              this._isMessagesIterable = true;
            }
          }
        );
      },
        error => this._toastService.showDanger(error.message)
      );

      form.resetForm();
      this.newMessage = '';
      this.toggleEditingMessageForm(false, null);
      this.setMessageCreationFormHeight();
      this.selectedMessageId = null;
    }
  }

  private _toggleForm(css1: string, css2: string, value: string) {
    this.messageEditingBlock.nativeElement.classList.remove(css1);
    this.messageEditingBlock.nativeElement.classList.add(css2);
    this.enterMessageField.nativeElement.value = value;
    this.setMessageCreationFormHeight();
    this._setMessageBlockHeight();
    this.enterMessageField.nativeElement.focus();
  }

  public toggleEditingMessageForm(isVisible: boolean, messageId: number, messageText?: string): void {
    this.showEditMessageForm = isVisible;
    this.selectedMessageId = messageId;
    if (isVisible) {
      this._toggleForm('d-none', 'd-block', messageText);
    } else {
      this._toggleForm('d-block', 'd-none', '');
      this.newMessage = '';
    }
  }

    // Search

  public searchMessages(form: NgForm): void {
    if (form.valid && this._notOnlySpaceBar.test(this.searchString)) {
      let searchParams: { id: number, groupId: number, stringToSearch: string } = {
        id: this.authUserInfo.id,
        groupId: this.selectedGroupId,
        stringToSearch: this.searchString
      }

      if (this.searchString.length > 0) {
        this._httpService.get('api/messages/search', searchParams).subscribe((data: MessageGroup[]) => {
          this.authUserMessageGroups = data;
        },
          error => this._toastService.showDanger(error.message)
        )
        form.resetForm({ searchInput: this.searchString});
      }
    }
  }

  public stopSearchMessages(form?: NgForm): void {
    this.enterMessageField.nativeElement.focus();
    if (form) {
      form.resetForm();
    }
    if (this.isCollapsed == false) {
      this.isCollapsed = true;
      this.searchString = '';
      this._isMessagesIterable = true;
      this._refreshGroupsAndMessages({ id: this.authUserInfo.id });
    }
  }

    // Modals

  public modalOpen(requesetMethod: string, header: string, body: string, entityId: number, url: string): void {
    let modalRef = this._modalService.open(ConfirmModal);
    modalRef.result.then((result) => {
      if (result === 'okButton') {
        this._refreshGroupsAndMessages({ id: this.authUserInfo.id },
          () => {
            if (url === 'api/messageGroup/delete' && this.selectedGroupId === entityId) {
              this.selectedGroupId = this.authUserMessageGroups[this.authUserMessageGroups.length - 1]?.id;
              this._isGroupesIterable = true;
              this._isMessagesIterable = true;
            }
            this.enterMessageField.nativeElement.focus();
          }
        );
      }
    }, (reason) => { });
    modalRef.componentInstance.modalWindowParams = new ConfirmModalParams(requesetMethod, header, body, this.authUserInfo, entityId, url);
    modalRef.hidden.subscribe(() => this.enterMessageField.nativeElement.focus());
  }

  public attachFileModalOpen(modalType: string, header: string, entity: string) {
    let modalRef = this._modalService.open(AttachFileModal, { centered: true });
    modalRef.result.then((result) => {
      if (Array.isArray(result) && result.length > 0) {
        for (var file of result) {
          let reader = new FileReader();
          reader.onload = function (e) { 
            file.src = e.target.result;
          };
          reader.readAsDataURL(file);
          this.fileCollection[this._fileService.getFileCollectionType(result)].push(file);
        }
      }
    }, (reason) => { });
    modalRef.componentInstance.modalWindowParams = new AttachFileModalParams(modalType, header, entity);
  }

    // Component methods

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this._setMessageBlockHeight();
  }

  private _refreshGroupsAndMessages(userMesagesParams: object, addActionsToPromise?: () => void): void {
    if (!userMesagesParams.hasOwnProperty('counter')) {
      this._messagesToLoadCounter = 30;
    }
    this._httpService.get('api/messages/getGroupesAndMessages', userMesagesParams).subscribe((data: MessageGroup[]) => {
      this.authUserMessageGroups = data;
      if (addActionsToPromise) {
        addActionsToPromise();
      }
    },
      error => this._toastService.showDanger(error.message)
    )
  }

  public uploadNewMessages(): void {
    this._previousMessageBlockHeight = this.messageBlock.nativeElement.scrollHeight;
    if (this.messageBlock.nativeElement.scrollTop === 0) {
      let messagesInBlockAmount = this.authUserMessageGroups.filter(group => group.id === this.selectedGroupId)[0].messages.length;
      this._isMessagesIterable = false;
      if (messagesInBlockAmount === this._messagesToLoadCounter) {
        this._messagesToLoadCounter += 30;
        this._freezeScrollBar = true;
        this._refreshGroupsAndMessages({ id: this.authUserInfo.id, counter: this._messagesToLoadCounter, groupId: this.selectedGroupId });
      }
    }
  }

  public groupsTrackFn(index, group): void {
    return group.name;
  }

  public changeMessageGroup(): void {
    this.stopSearchMessages();
    this._isMessagesIterable = true;
    this._messagesToLoadCounter = 30;
  }

  public hideGroupCreationForm(): void {
    this.showGroupCreationForm = false;
    this.enterMessageField.nativeElement.focus();
  }

  public hideGroupUpdateForm(): void {
    this.editMessageGroupFormId = null;
    this.enterMessageField.nativeElement.focus();
  }

  public setChangedFilesCollection(files: any): void {
    this.fileCollection = files;
    this._setMessageBlockHeight();
    this._scrollToBottom(this.messageBlock);
  }

  private _scrollToBottom(block: ElementRef): void {
    block.nativeElement.scrollTop = block.nativeElement.scrollHeight;
  }

  public setMessageCreationFormHeight(): void {
    this.enterMessageField.nativeElement.style.height = 'auto';
    this.enterMessageField.nativeElement.style.height = this.enterMessageField.nativeElement.scrollHeight < window.innerHeight / 5 ? this.enterMessageField.nativeElement.scrollHeight + 2 + 'px' : window.innerHeight / 5 + 'px';
    this._setMessageBlockHeight();
  }

  private _setMessageBlockHeight(): void {
    this.messageBlock.nativeElement.style.height = window.innerHeight - this.appHeader.nativeElement.offsetHeight -
                                                   this.searchBlock.nativeElement.offsetHeight - this.enterMessageBlock.nativeElement.offsetHeight + 'px';
  }

  // Implemented interfaces

  ngOnInit() {
    this.authUserInfo = this._route.snapshot.data['user'];

    if (this.authUserInfo != null) {
      this._refreshGroupsAndMessages({ id: this.authUserInfo.id },
        () => {
          if (this.authUserMessageGroups.length > 0) {
            this.selectedGroupId = this.authUserMessageGroups[this.authUserMessageGroups.length - 1]?.id;
          }
        }
      );
    }
  }

  ngAfterViewInit() {
    this._setMessageBlockHeight();
    this.messages.changes.subscribe((list: QueryList<ElementRef>) => {
      if (this._isMessagesIterable) {
        this._scrollToBottom(this.messageBlock);
        this._isMessagesIterable = false;
      }
      if (this._freezeScrollBar) {
        this.messageBlock.nativeElement.scrollTop = this.messageBlock.nativeElement.scrollHeight - this._previousMessageBlockHeight;
        this._freezeScrollBar = false;
      }
    });
    this.groupes.changes.subscribe((list: QueryList<ElementRef>) => {
      if (this._isGroupesIterable) {
        this._scrollToBottom(this.groupMessageBlock);
        this._isGroupesIterable = false;
      }
    });
  }
}
