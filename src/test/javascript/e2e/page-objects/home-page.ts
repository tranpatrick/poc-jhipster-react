import { $, browser, by, element, ElementFinder } from 'protractor';

export default class HomePage {
  title: ElementFinder = element(by.id('home-heading'));
  noRecords: ElementFinder = element(by.css('#app-view-container .table-responsive div.alert.alert-warning'));
  records: ElementFinder = element(by.id('messages'));
  loggedIdMsg: ElementFinder = element(by.id('loggedInMsg'));
  newMsgButton: ElementFinder = element(by.id('newMessage'));
  newMsgModal: ElementFinder = element(by.id('newMessageModal'));
  contentInput: ElementFinder = element(by.id('message-content'));
  saveMsgButton: ElementFinder = element(by.id('save-msg'));

  constructor() {}

  async getLoggedInMsg() {
    return this.loggedIdMsg;
  }

  async openMsgModal() {
    await this.newMsgButton.click();
  }

  async setContentInput(content) {
    await this.contentInput.sendKeys(content);
  }

  async getContentInput() {
    return this.contentInput.getAttribute('value');
  }

  async saveMsg() {
    await this.saveMsgButton.click();
  }
}
