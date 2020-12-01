import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, HostListener, ViewEncapsulation, } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { HttpService } from '../../shared/services/httpService/http-service.service';
import { User } from '../../shared/models/user';
import { MessageGroup } from '../../shared/models/messageGroup';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  //TO DO: Read about it. This one below is for styles for dynamically added html. Without it styles do not work.
  encapsulation: ViewEncapsulation.None
})
export class MainComponent implements OnInit, AfterViewInit {
  constructor(private httpService: HttpService, private _route: ActivatedRoute) { }

  @ViewChild('appHeader', { read: ElementRef }) appHeader: ElementRef;
  @ViewChild('groupMessageBlock') groupMessageBlock: ElementRef;
  @ViewChild('messageBlock') messageBlock: ElementRef;
  @ViewChild('searchBlock') searchBlock: ElementRef;
  @ViewChild('enterMessageBlock') enterMessageBlock: ElementRef;
  @ViewChild('enterMessageField') enterMessageField: ElementRef;
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
  public createMessageTextarea: string = '';

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
        // scroll to end, but somewhy it scrolls not exactly to end.
        this.selectedGroupId ? this.selectedGroupId = this.selectedGroupId : this.selectedGroupId = this.authUserMessageGroups[this.authUserMessageGroups.length - 1]?.id;
        this.groupMessageBlock.nativeElement.scrollTop = this.groupMessageBlock.nativeElement.scrollHeight * 2;
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

  // Update and delete existing group

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
        // scroll down to the end
        // el.nativeElement.querySelector('input').focus();
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

  public deleteExistingGroup(groupId: number): void {
    let groupParams: { id: number, userId: number } = {
      id: groupId,
      userId: this.authUserInfo.id
    }
    this.enterMessageField.nativeElement.focus();

    this.httpService.post('/api/messageGroup/delete', groupParams).subscribe(() => {

      this.httpService.get('api/messages/getGroupesAndMessages', { id: this.authUserInfo.id }).subscribe((data: MessageGroup[]) => {
        this.authUserMessageGroups = data;
        this.selectedGroupId === groupId ? this.selectedGroupId = this.authUserMessageGroups[this.authUserMessageGroups.length - 1]?.id : this.selectedGroupId = this.selectedGroupId;
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
      text: this.createMessageTextarea,
      id: this.selectedMessageId
    }
    this.enterMessageField.nativeElement.focus();

    let url: string = this.showEditMessageForm ? '/api/messages/update' : '/api/messages/create';

    this.httpService.post(url, messageParams).subscribe(data => {
      this.createMessageTextarea = '';
      this.selectedMessageId = null;
      this.toggleEditingMessageForm(false, null);

      this.httpService.get('api/messages/getGroupesAndMessages', { id: this.authUserInfo.id }).subscribe((data: MessageGroup[]) => {
        this.authUserMessageGroups = data;
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

    // Delete existing message

  public deleteExistingMessage(messageId: number): void {
    let messageParams: { id: number, authUserId: number | null } = {
      id: messageId,
      authUserId: this.authUserInfo.id
    }
    this.enterMessageField.nativeElement.focus();

    this.httpService.post('/api/messages/delete', messageParams).subscribe(data => {

      this.httpService.get('api/messages/getGroupesAndMessages', { id: this.authUserInfo.id }).subscribe((data: MessageGroup[]) => {
        this.authUserMessageGroups = data;
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

    // Component methods

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this._setMessageBlockHeight();
  }

  public groupsTrackFn(index, group) {
    return group.name;
  }

  hideGroupCreationForm() {
    this.showGroupCreationForm = false;
    this.enterMessageField.nativeElement.focus();
  }

  hideGroupUpdateForm() {
    this.editMessageGroupFormId = null;
    this.enterMessageField.nativeElement.focus();
  }

  private _setMessageBlockHeight(editMessageBlock?: ElementRef): void {
    let newMessageFormHeight: number = editMessageBlock ? this.enterMessageBlock.nativeElement.offsetHeight :
                                       this.enterMessageBlock.nativeElement.offsetHeight - (editMessageBlock?.nativeElement.offsetHeight || 0);

    this.messageBlock.nativeElement.style.height = window.innerHeight - this.appHeader.nativeElement.offsetHeight -
                                       this.searchBlock.nativeElement.offsetHeight - newMessageFormHeight + 'px';
  }

  parseDateToRussianLocale(date: string): string {
    return new Date(date).toLocaleString("ru");
  }

  parseMessageText(message: string): string {
    return message.replace('\n', '<br>');
  }

  toggleEditingMessageForm(trigger: boolean, messageId: number) {
    this.showEditMessageForm = trigger;
    this.selectedMessageId = messageId;
    if (trigger) {
      this.messageEditingBlock.nativeElement.classList.remove('d-none');
      this.messageEditingBlock.nativeElement.classList.add('d-block');
      this._setMessageBlockHeight(this.messageEditingBlock)
    } else {
      this.messageEditingBlock.nativeElement.classList.remove('d-block');
      this.messageEditingBlock.nativeElement.classList.add('d-none');
      this._setMessageBlockHeight();
    }
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
    this.groupMessageBlock.nativeElement.scrollTop = this.groupMessageBlock.nativeElement.scrollHeight;
  }
}
