import { Component, OnInit, AfterViewInit, ViewChild, ViewChildren, ElementRef, HostListener, ViewEncapsulation, QueryList } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { HttpService } from './../../shared/services/http-service/http.service';
import { TextService } from './../../shared/services/text-service/text.service';
import { ToastService } from './../../shared/services/toast-service/toast.service';
import { FileService } from './../../shared/services/file-service/file.service';
import { NgbModal, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from "rxjs";
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModal } from './../../shared/modals/confirm/confirm.modal';
import { ConfirmModalParams } from './../../shared/models/params/confirmModalParams';
import { AttachFileModal } from './../../shared/modals/attach-file/attach-file.modal';
import { AttachFileModalParams } from './../../shared/models/params/attachFileModalParams';
import { WarningModal } from './../../shared/modals/warning/warning.modal';
import { WarningModalParams } from './../../shared/models/params/warningModalParams';
import { User } from './../../shared/models/user';
import { MessageGroup } from './../../shared/models/messageGroup';
import { SpinnerMode } from './../../shared/models/componentModes/spinnerMode';
import { FilePreviewMode } from './../../shared/models/componentModes/filePreviewMode';
import { UrlPreviewResponse } from './../../shared/models/urlPreviewResponse';
import { UrlPreviewMode } from './../../shared/models/componentModes/urlPreviewMode';
import { AppUrl } from './../../shared/models/appUrl';
import { FileCollection } from './../../shared/models/fileCollection';
import { SearchParams } from './../../shared/models/params/searchParams';
import { MessageGroupCreateParams } from './../../shared/models/params/messageGroupCreateParams';
import { MessageGroupUpdateParams } from './../../shared/models/params/messageGroupUpdateParams';
import { MessageParams } from './../../shared/models/params/messageParams';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./main.component.css']
})

export class MainComponent implements OnInit, AfterViewInit {
  constructor(private _httpService: HttpService, private _textService: TextService, private _route: ActivatedRoute, private _toastService: ToastService,
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
  @ViewChild('spinner') spinner: ElementRef;


  // Component variables

  public selectedGroupId: number | null = null;
  public selectedMessageId: number | null;
  public showGroupCreationForm: boolean = false;
  public editMessageGroupFormId: number | null = null;
  public searchString: string = '';
  public isCollapsed: boolean = true;
  public showEditMessageForm: boolean = false;
  public isFileMenuActive: boolean = false;
  private _previousMessageBlockHeight: number | null = null;
  public searchDate: NgbDateStruct;
  public newMessage = { text: '', urlPreviews: [], fileCollection: { images: [], video: [], audio: [], files: [] } };
  public filesDefaultState: FileCollection = new FileCollection();
  private _messagesToLoadCounter: number = 30;
  private _freezeScrollBar = false;
  private _isMessagesIterable = true;
  private _isGroupesIterable = true;
  private readonly _notOnlySpaceBar = /\S/;
  public isSubmitButtonDisabled: boolean = false;
  public isNewMessagesUploading: boolean = false;
  public isFirstLoad: boolean = true;
  public spinnerMode = SpinnerMode;
  public filePreviewMode = FilePreviewMode;
  public linkPreviewMode = UrlPreviewMode;

  public authUserInfo: User = new User();
  public authUserMessageGroups: MessageGroup[] = [];

  public selectedNewsCategory: string = '//mediarepost.ru/widget-news?cat=1&fon=gray';

  public newsCategories = [
    { url: '//mediarepost.ru/widget-news?cat=1&fon=gray', name: 'Новости' },
    { url: '//mediarepost.ru/widget-news?cat=39&fon=gray', name: 'Политика' },
    { url: '//mediarepost.ru/widget-news?cat=31&fon=gray', name: 'Происшествия' },
    { url: '//mediarepost.ru/widget-news?cat=30&fon=gray', name: 'Война и конфликты' },
    { url: '//mediarepost.ru/widget-news?cat=3&fon=gray',  name: 'Наука и технологии' },
    { url: '//mediarepost.ru/widget-news?cat=32&fon=gray', name: 'Военная территория' },
    { url: '//mediarepost.ru/widget-news?cat=14&fon=gray', name: 'Блоги' },
    { url: '//mediarepost.ru/widget-news?cat=34&fon=gray', name: 'Видео' }
  ];


  // Create new group

  public createNewMessageGroup(form: NgForm): void {
    if (form.valid && this._notOnlySpaceBar.test(form.value.newGroupName)) {
      let groupParams: MessageGroupCreateParams = new MessageGroupCreateParams(form.value.newGroupName, this.authUserInfo.id);
      this._toggleInlineSpinner(true);
      this.enterMessageField.nativeElement.focus();

      this._httpService.post('/api/messageGroup/create', groupParams).subscribe(data => {
        this.showGroupCreationForm = false;
        this._refreshGroupsAndMessages({ id: this.authUserInfo.id },
          () => {
            this.selectedGroupId = this.authUserMessageGroups[this.authUserMessageGroups.length - 1]?.id;
            this._isGroupesIterable = true;
            this._toggleInlineSpinner(false);
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
      let groupParams: MessageGroupUpdateParams = new MessageGroupUpdateParams(form.value.updateGroupName, this.authUserInfo.id, groupId);
      this._toggleInlineSpinner(true);
      this.enterMessageField.nativeElement.focus();

      this._httpService.post('/api/messageGroup/update', groupParams).subscribe(data => {
        this.showGroupCreationForm = false;
        this._refreshGroupsAndMessages({ id: this.authUserInfo.id },
          () => {
            this._toggleInlineSpinner(false);
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
    if (!this.selectedGroupId) {
      this._toastService.showDanger('Не выбрана группа сообщений');
      return;
    }

    if ((form.valid && this._notOnlySpaceBar.test(this.newMessage.text)) || this._fileService.isFileCollectionValid(this.newMessage.fileCollection) || this.newMessage.urlPreviews.length) {

      let tempMessageText = this.newMessage.text; // clear preview related code immideatly to prevent url previews creating again while they are being sent to server already
      form.resetForm();
      this.newMessage.text = '';

      this._toggleInlineSpinner(true);

      let params: MessageParams = new MessageParams(this.authUserInfo.id, this.selectedGroupId, tempMessageText, this.selectedMessageId);
      let messageParams: FormData = this._fileService.convertParamsToFormData(this.newMessage.urlPreviews, this.newMessage.fileCollection, params);

      this.enterMessageField.nativeElement.focus();
      this.newMessage.urlPreviews = [];
      this.newMessage.fileCollection = new FileCollection();

      let url: string = this.showEditMessageForm ? '/api/messages/update' : '/api/messages/create';

      this._httpService.post(url, messageParams).subscribe(data => {
        this._refreshGroupsAndMessages({ id: this.authUserInfo.id },
          () => {
            if (url === '/api/messages/create') {
              this._isMessagesIterable = true;
            }
            this._toggleInlineSpinner(false);
          }
        );
      },
        error => this._toastService.showDanger(error.message)
      );

      this.toggleEditingMessageForm(false, null, null, this.filesDefaultState);
      this.setMessageCreationFormHeight();
      this.selectedMessageId = null;
    }
  }

  private _toggleForm(css1: string, css2: string, value: string, files: FileCollection, urls?: UrlPreviewResponse[]) {
    this.messageEditingBlock.nativeElement.classList.remove(css1);
    this.messageEditingBlock.nativeElement.classList.add(css2);
    this.enterMessageField.nativeElement.value = value;
    this.newMessage.text = value;
    if (files) {
      this.newMessage.fileCollection = files;
    }
    if (urls) {
      this.newMessage.urlPreviews = urls;
    }
    this.setMessageCreationFormHeight();
    this._setMessageBlockHeight();
    this.enterMessageField.nativeElement.focus();
  }

  public toggleEditingMessageForm(isVisible: boolean, messageId: number, messageText?: string, files?: FileCollection, urls?: UrlPreviewResponse[]): void {
    this.showEditMessageForm = isVisible;
    this.selectedMessageId = messageId;
    if (isVisible) {
      this._toggleForm('d-none', 'd-block', messageText, files, urls);
    } else {
      this._toggleForm('d-block', 'd-none', '', this.filesDefaultState, []);
      this.newMessage.text = '';
    }
  }

    // Search

  private _searchRequest(searchParams: SearchParams): void {
    this._httpService.post('api/messages/search', searchParams).subscribe((data: MessageGroup[]) => {
      this.authUserMessageGroups = data;
      this._scrollToBottom(this.messageBlock);
      this.searchDate = null;
      this._toggleInlineSpinner(false);
    },
      error => this._toastService.showDanger(error.message)
    )
  }

  public searchMessages(form?: NgForm): void {
    if (form && form.valid && this._notOnlySpaceBar.test(this.searchString) && this.searchString.length > 0) {
      let searchParams: SearchParams = new SearchParams(this.authUserInfo.id, this.selectedGroupId, this.searchString, null);
      this._toggleInlineSpinner(true);
      this._searchRequest(searchParams);
      form.resetForm({ searchInput: this.searchString });
    } else if (!form && this.searchDate) {
      let searchParams: SearchParams = new SearchParams(this.authUserInfo.id, this.selectedGroupId, '', this.searchDate);
      this._toggleInlineSpinner(true);
      this._searchRequest(searchParams);
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
      this._toggleInlineSpinner(true);
      this._refreshGroupsAndMessages({ id: this.authUserInfo.id }, () => this._toggleInlineSpinner(false));
    }
  }

    // Modals

  public modalOpen(requesetMethod: string, header: string, body: string, entityId: number, url: string): void {
    let modalRef = this._modalService.open(ConfirmModal);
    modalRef.result.then((result) => {
      if (result instanceof Observable) {
        result.subscribe(data => {
          this._refreshGroupsAndMessages({ id: this.authUserInfo.id },
            () => {
              if (url === 'api/messageGroup/delete' && this.selectedGroupId === entityId) {
                this.selectedGroupId = this.authUserMessageGroups[this.authUserMessageGroups.length - 1]?.id;
                this._isGroupesIterable = true;
                this._isMessagesIterable = true;
              }
              this._toggleInlineSpinner(false);
              this.enterMessageField.nativeElement.focus();
            }
          );
        }, error => { this._toastService.showDanger(error.message) })
      }
    }, (reason) => { });
    if (url === 'api/messages/delete') {
      modalRef.componentInstance.modalWindowParams = new ConfirmModalParams(requesetMethod, header, body, this.authUserInfo, entityId, url,
        { authUserId: this.authUserInfo.id, selectedMessageId: entityId });
    } else if (url === 'api/messageGroup/delete') {
      modalRef.componentInstance.modalWindowParams = new ConfirmModalParams(requesetMethod, header, body, this.authUserInfo, entityId, url,
        { authUserId: this.authUserInfo.id, selectedGroupId: entityId });
    }
    modalRef.hidden.subscribe(() => { this._toggleInlineSpinner(true), this.enterMessageField.nativeElement.focus() });
  }

  public attachFileModalOpen(modalType: string, header: string, entity: string): void {
    let modalRef = this._modalService.open(AttachFileModal, { centered: true });
    modalRef.result.then((result) => {
      if (Array.isArray(result) && result.length > 0) {
        if ((result.length + this.newMessage.fileCollection[this._fileService.getFileCollectionType(result)].length) > 8) {
          let modalRef = this._modalService.open(WarningModal);
          modalRef.result.then((result) => { }, (reason) => { });
          modalRef.componentInstance.modalWindowParams = new WarningModalParams('Предупреждение!', 'Не допускается загрузка более 8 файлов одного типа в одно сообщение', 'warning');
          return;
        } else {
          for (let file of result) {
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function (e) {
              file.src = e.target.result;
            };
            this.newMessage.fileCollection[this._fileService.getFileCollectionType(result)].push(file);
          }
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
      this._messagesToLoadCounter = this.authUserInfo.messagesToLoadAmount;
    }
    this._httpService.get('api/messages/getGroupesAndMessages', userMesagesParams).subscribe((data: MessageGroup[]) => {
      this.authUserMessageGroups = data;
      this.isFirstLoad = false;

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
        this.isNewMessagesUploading = true;
        this._messagesToLoadCounter += this.authUserInfo.messagesToLoadAmount;
        this._freezeScrollBar = true;
        this._refreshGroupsAndMessages({ id: this.authUserInfo.id, counter: this._messagesToLoadCounter, groupId: this.selectedGroupId }, () => { this.isNewMessagesUploading = false });
      }
    }
  }

  public groupsTrackFn(index, group): void {
    return group.name;
  }

  private _toggleInlineSpinner(doVisible: boolean): void {
    if (doVisible) {
      this.spinner.nativeElement.classList.remove('d-none');
      this.spinner.nativeElement.classList.add('d-block');
    } else {
      this.spinner.nativeElement.classList.remove('d-block');
      this.spinner.nativeElement.classList.add('d-none');
    }
    this.isSubmitButtonDisabled = doVisible;
    this._setMessageBlockHeight();
  }

  public changeMessageGroup(): void {
    this.stopSearchMessages();
    this._isMessagesIterable = true;
    this._messagesToLoadCounter = this.authUserInfo.messagesToLoadAmount;
  }

  public hideGroupCreationForm(): void {
    this.showGroupCreationForm = false;
    this.enterMessageField.nativeElement.focus();
  }

  public hideGroupUpdateForm(): void {
    this.editMessageGroupFormId = null;
    this.enterMessageField.nativeElement.focus();
  }

  public setChangedFilesCollection(files: FileCollection): void {
    let fileCollectionClone: FileCollection = this._fileService.getFileCollectionClone(files);
    this.newMessage.fileCollection = fileCollectionClone;
    this._setMessageBlockHeight();
    this._scrollToBottom(this.messageBlock);
    this.enterMessageField.nativeElement.focus();
  }

  public changePreviews(previews: UrlPreviewResponse[]): void {
    let previewsClone: UrlPreviewResponse[] = this._fileService.getUrlPreviewsClone(previews);
    this.newMessage.urlPreviews = previewsClone;
    this._setMessageBlockHeight();
    this.enterMessageField.nativeElement.focus();
  }

  public closeFileMenu(tooltip: NgbTooltip): void {
    setTimeout(() => { !this.isFileMenuActive ? tooltip.close() : null }, 70)
  }

  private _scrollToBottom(block: ElementRef): void {
    block.nativeElement.scrollTop = block.nativeElement.scrollHeight;
  }

  public setMessageCreationFormHeight(): void {
    this.enterMessageField.nativeElement.style.height = 'auto';
    this.enterMessageField.nativeElement.style.height = this.enterMessageField.nativeElement.scrollHeight < window.innerHeight / 5 ? this.enterMessageField.nativeElement.scrollHeight +
                                                        2 + 'px' : window.innerHeight / 5 + 'px';
    this._setMessageBlockHeight();
  }

  private _setMessageBlockHeight(): void {
    this.messageBlock.nativeElement.style.height = window.innerHeight - this.appHeader.nativeElement.offsetHeight -
                                                   this.searchBlock.nativeElement.offsetHeight - this.enterMessageBlock.nativeElement.offsetHeight + 'px';
  }

  // Implemented interfaces' methods

  ngOnInit() {
    this.authUserInfo = this._route.snapshot.data['user'];
    this._messagesToLoadCounter = this.authUserInfo.messagesToLoadAmount;

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
    if (!this.authUserInfo.isGreeted && sessionStorage.getItem('isGreeted') !== 'true') {
      let modalRef = this._modalService.open(WarningModal);
      modalRef.result.then((result) => { }, (reason) => { });
      modalRef.componentInstance.modalWindowParams = new WarningModalParams('Приветствие', this._textService.greetingText, 'greeting', this.authUserInfo.id);
    }

    let urls: string[] = [];
    let appUrls: AppUrl[] = [];

    let timer = setInterval(() => {
      urls = this._textService.getUrlsFromText(this.newMessage.text).filter((value, index, thisArr) => thisArr.indexOf(value) === index);
      appUrls = this._textService.convertUrlsToAppUrls(urls, appUrls);
      this._textService.getPreviewsForUrls(appUrls, this.newMessage.urlPreviews);
    }, 2500);
  }
}
