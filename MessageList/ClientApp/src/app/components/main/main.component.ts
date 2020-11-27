import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, HostListener, ViewEncapsulation, } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpService } from '../../shared/services/httpService/http-service.service';
import { User } from '../../shared/models/user';
import { MessageGroup } from '../../shared/models/messageGroup'

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  //TO DO: Read about it. This one below is for styles for dynamically added html. Without it styles do not work.
  encapsulation: ViewEncapsulation.None
})
export class MainComponent implements OnInit, AfterViewInit {
  constructor(private httpService: HttpService) { }

  @ViewChild('appHeader', { read: ElementRef }) appHeader: ElementRef;
  @ViewChild('groupMessageBlock') groupMessageBlock: ElementRef;
  @ViewChild('messageBlock') messageBlock: ElementRef;
  @ViewChild('searchBlock') searchBlock: ElementRef;
  @ViewChild('enterMessageBlock') enterMessageBlock: ElementRef;
  @ViewChild('messageEditingBlock') messageEditingBlock: ElementRef;


  // Component variables

  public showAlert: boolean;
  public errorText: string;
  public selectedGroupId: number | null = null;
  public selectedMessageId: number | null;
  public showGroupCreationTemplate: boolean = false;
  public showEditMessageGroupForm: number | null = null;
  public showEditMessageForm: boolean = false;
  public createMessageTextarea: string = '';

  public authUserInfo: User;
  public authUserMessageGroups: MessageGroup[] = [];


  // Create new group

  public addNewGroupTemplate(): void {
    this.showGroupCreationTemplate = true;
  }

  public createNewMessageGroup(form: NgForm): void {
    let groupParams: { name: string, userId: number | null } = {
      name: form.value.name,
      userId: this.authUserInfo.id
    }

    this.httpService.post('/api/messageGroup/create', groupParams).subscribe(data => {
      this.showGroupCreationTemplate = false;
      this.httpService.get('api/users/getGroupesAndMessages', { id: this.authUserInfo.id }).subscribe((data: MessageGroup[]) => {
        this.authUserMessageGroups = data;
        // scroll to end, but somewhy it scrolls not exactly to end.
        this.selectedGroupId ? this.selectedGroupId = this.selectedGroupId : this.selectedGroupId = this.authUserMessageGroups[this.authUserMessageGroups.length - 1]?.id;
        this.groupMessageBlock.nativeElement.scrollTop = this.groupMessageBlock.nativeElement.scrollHeight * 2;
        console.log(this.selectedGroupId);
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

    this.httpService.post('/api/messageGroup/update', groupParams).subscribe(data => {
      this.showGroupCreationTemplate = false;
      this.httpService.get('api/users/getGroupesAndMessages', { id: this.authUserInfo.id }).subscribe((data: MessageGroup[]) => {
        this.authUserMessageGroups = data;
        this.showEditMessageGroupForm = null;
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

    this.httpService.post('/api/messageGroup/delete', groupParams).subscribe(() => {

      this.httpService.get('api/users/getGroupesAndMessages', { id: this.authUserInfo.id }).subscribe((data: MessageGroup[]) => {
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

    // Create new message

  public createAndUpdateMessage(messageId?: number): void {

    let messageParams: { authUserId: number, messageGroupId: number | null, text: string, id: number | null } = {
      authUserId: this.authUserInfo.id,
      messageGroupId: this.selectedGroupId,
      text: this.createMessageTextarea,
      id: this.selectedMessageId
    }

    let url: string = this.showEditMessageForm ? '/api/message/update' : '/api/message/create';

    this.httpService.post(url, messageParams).subscribe(data => {
      this.createMessageTextarea = '';
      this.selectedMessageId = null;
      this.toggleEditingMessageForm(false, null);

      this.httpService.get('api/users/getGroupesAndMessages', { id: this.authUserInfo.id }).subscribe((data: MessageGroup[]) => {
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

    this.httpService.post('/api/message/delete', messageParams).subscribe(data => {

      this.httpService.get('api/users/getGroupesAndMessages', { id: this.authUserInfo.id }).subscribe((data: MessageGroup[]) => {
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

    // Component methods

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this._setMessageBlockHeight();
  }

  public groupsTrackFn(index, group) {
    return group.name;
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
    this.httpService.get('api/users/getAuthUserInfo').subscribe((data: User) => {
      this.authUserInfo = data;
      if (this.authUserInfo != null) {
        this.httpService.get('api/users/getGroupesAndMessages', { id: this.authUserInfo.id }).subscribe((data: MessageGroup[]) => {
          this.authUserMessageGroups = data;
          if (this.authUserMessageGroups.length > 0) {
            this.selectedGroupId = this.authUserMessageGroups[this.authUserMessageGroups.length - 1]?.id;
          }
        });
      }
    });
  }

  ngAfterViewInit() {
    this._setMessageBlockHeight();
    this.groupMessageBlock.nativeElement.scrollTop = this.groupMessageBlock.nativeElement.scrollHeight;
  }
}
