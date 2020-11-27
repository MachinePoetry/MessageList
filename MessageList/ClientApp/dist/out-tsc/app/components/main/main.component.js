import { __decorate } from "tslib";
import { Component, ViewChild, ElementRef, HostListener, ViewEncapsulation, } from '@angular/core';
let MainComponent = class MainComponent {
    constructor(httpService) {
        this.httpService = httpService;
        this.selectedGroupId = null;
        this.showGroupCreationTemplate = false;
        this.showEditMessageGroupForm = null;
        this.showEditMessageForm = false;
        this.createMessageTextarea = '';
        this.authUserMessageGroups = [];
    }
    // Create new group
    addNewGroupTemplate() {
        this.showGroupCreationTemplate = true;
    }
    createNewMessageGroup(form) {
        let groupParams = {
            name: form.value.name,
            userId: this.authUserInfo.id
        };
        this.httpService.post('/api/messageGroup/create', groupParams).subscribe(data => {
            this.showGroupCreationTemplate = false;
            this.httpService.get('api/users/getGroupesAndMessages', { id: this.authUserInfo.id }).subscribe((data) => {
                var _a;
                this.authUserMessageGroups = data;
                // scroll to end, but somewhy it scrolls not exactly to end.
                this.selectedGroupId ? this.selectedGroupId = this.selectedGroupId : this.selectedGroupId = (_a = this.authUserMessageGroups[this.authUserMessageGroups.length - 1]) === null || _a === void 0 ? void 0 : _a.id;
                this.groupMessageBlock.nativeElement.scrollTop = this.groupMessageBlock.nativeElement.scrollHeight * 2;
                console.log(this.selectedGroupId);
            }, error => {
                this.errorText = error.message;
                this.showAlert = true;
            });
        }, error => {
            this.errorText = error.message;
            this.showAlert = true;
        });
    }
    // Update and delete existing group
    updateMessageGroup(groupId, groupName) {
        let groupParams = {
            userId: this.authUserInfo.id,
            id: groupId,
            name: groupName
        };
        this.httpService.post('/api/messageGroup/update', groupParams).subscribe(data => {
            this.showGroupCreationTemplate = false;
            this.httpService.get('api/users/getGroupesAndMessages', { id: this.authUserInfo.id }).subscribe((data) => {
                this.authUserMessageGroups = data;
                this.showEditMessageGroupForm = null;
                // scroll down to the end
                // el.nativeElement.querySelector('input').focus();
            }, error => {
                this.errorText = error.message;
                this.showAlert = true;
            });
        }, error => {
            this.errorText = error.message;
            this.showAlert = true;
        });
    }
    deleteExistingGroup(groupId) {
        let groupParams = {
            id: groupId,
            userId: this.authUserInfo.id
        };
        this.httpService.post('/api/messageGroup/delete', groupParams).subscribe(() => {
            this.httpService.get('api/users/getGroupesAndMessages', { id: this.authUserInfo.id }).subscribe((data) => {
                var _a;
                this.authUserMessageGroups = data;
                this.selectedGroupId === groupId ? this.selectedGroupId = (_a = this.authUserMessageGroups[this.authUserMessageGroups.length - 1]) === null || _a === void 0 ? void 0 : _a.id : this.selectedGroupId = this.selectedGroupId;
            }, error => {
                this.errorText = error.message;
                this.showAlert = true;
            });
        }, error => {
            this.errorText = error.message;
            this.showAlert = true;
        });
    }
    // Create new message
    createAndUpdateMessage(messageId) {
        let messageParams = {
            authUserId: this.authUserInfo.id,
            messageGroupId: this.selectedGroupId,
            text: this.createMessageTextarea,
            id: this.selectedMessageId
        };
        let url = this.showEditMessageForm ? '/api/message/update' : '/api/message/create';
        this.httpService.post(url, messageParams).subscribe(data => {
            this.createMessageTextarea = '';
            this.selectedMessageId = null;
            this.toggleEditingMessageForm(false, null);
            this.httpService.get('api/users/getGroupesAndMessages', { id: this.authUserInfo.id }).subscribe((data) => {
                this.authUserMessageGroups = data;
            }, error => {
                this.errorText = error.message;
                this.showAlert = true;
            });
        }, error => {
            this.errorText = error.message;
            this.showAlert = true;
        });
    }
    // Delete existing message
    deleteExistingMessage(messageId) {
        let messageParams = {
            id: messageId,
            authUserId: this.authUserInfo.id
        };
        this.httpService.post('/api/message/delete', messageParams).subscribe(data => {
            this.httpService.get('api/users/getGroupesAndMessages', { id: this.authUserInfo.id }).subscribe((data) => {
                this.authUserMessageGroups = data;
            }, error => {
                this.errorText = error.message;
                this.showAlert = true;
            });
        }, error => {
            this.errorText = error.message;
            this.showAlert = true;
        });
    }
    // Component methods
    onResize(event) {
        this._setMessageBlockHeight();
    }
    groupsTrackFn(index, group) {
        return group.name;
    }
    _setMessageBlockHeight(editMessageBlock) {
        let newMessageFormHeight = editMessageBlock ? this.enterMessageBlock.nativeElement.offsetHeight :
            this.enterMessageBlock.nativeElement.offsetHeight - ((editMessageBlock === null || editMessageBlock === void 0 ? void 0 : editMessageBlock.nativeElement.offsetHeight) || 0);
        this.messageBlock.nativeElement.style.height = window.innerHeight - this.appHeader.nativeElement.offsetHeight -
            this.searchBlock.nativeElement.offsetHeight - newMessageFormHeight + 'px';
    }
    parseDateToRussianLocale(date) {
        return new Date(date).toLocaleString("ru");
    }
    parseMessageText(message) {
        return message.replace('\n', '<br>');
    }
    toggleEditingMessageForm(trigger, messageId) {
        this.showEditMessageForm = trigger;
        this.selectedMessageId = messageId;
        if (trigger) {
            this.messageEditingBlock.nativeElement.classList.remove('d-none');
            this.messageEditingBlock.nativeElement.classList.add('d-block');
            this._setMessageBlockHeight(this.messageEditingBlock);
        }
        else {
            this.messageEditingBlock.nativeElement.classList.remove('d-block');
            this.messageEditingBlock.nativeElement.classList.add('d-none');
            this._setMessageBlockHeight();
        }
    }
    // Implemented interfaces
    ngOnInit() {
        this.httpService.get('api/users/getAuthUserInfo').subscribe((data) => {
            this.authUserInfo = data;
            if (this.authUserInfo != null) {
                this.httpService.get('api/users/getGroupesAndMessages', { id: this.authUserInfo.id }).subscribe((data) => {
                    var _a;
                    this.authUserMessageGroups = data;
                    if (this.authUserMessageGroups.length > 0) {
                        this.selectedGroupId = (_a = this.authUserMessageGroups[this.authUserMessageGroups.length - 1]) === null || _a === void 0 ? void 0 : _a.id;
                    }
                });
            }
        });
    }
    ngAfterViewInit() {
        this._setMessageBlockHeight();
        this.groupMessageBlock.nativeElement.scrollTop = this.groupMessageBlock.nativeElement.scrollHeight;
    }
};
__decorate([
    ViewChild('appHeader', { read: ElementRef })
], MainComponent.prototype, "appHeader", void 0);
__decorate([
    ViewChild('groupMessageBlock')
], MainComponent.prototype, "groupMessageBlock", void 0);
__decorate([
    ViewChild('messageBlock')
], MainComponent.prototype, "messageBlock", void 0);
__decorate([
    ViewChild('searchBlock')
], MainComponent.prototype, "searchBlock", void 0);
__decorate([
    ViewChild('enterMessageBlock')
], MainComponent.prototype, "enterMessageBlock", void 0);
__decorate([
    ViewChild('messageEditingBlock')
], MainComponent.prototype, "messageEditingBlock", void 0);
__decorate([
    HostListener('window:resize', ['$event'])
], MainComponent.prototype, "onResize", null);
MainComponent = __decorate([
    Component({
        selector: 'app-main',
        templateUrl: './main.component.html',
        styleUrls: ['./main.component.css'],
        //TO DO: Read about it. This one below is for styles for dynamically added html. Without it styles do not work.
        encapsulation: ViewEncapsulation.None
    })
], MainComponent);
export { MainComponent };
//# sourceMappingURL=main.component.js.map