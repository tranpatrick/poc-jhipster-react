import { element, by, ElementFinder } from 'protractor';

export default class MessageUpdatePage {
  pageTitle: ElementFinder = element(by.id('halitranApp.message.home.createOrEditLabel'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));
  contentInput: ElementFinder = element(by.css('input#message-content'));
  publicationDateInput: ElementFinder = element(by.css('input#message-publicationDate'));
  userSelect: ElementFinder = element(by.css('select#message-user'));

  getPageTitle() {
    return this.pageTitle;
  }

  async setContentInput(content) {
    await this.contentInput.sendKeys(content);
  }

  async getContentInput() {
    return this.contentInput.getAttribute('value');
  }

  async setPublicationDateInput(publicationDate) {
    await this.publicationDateInput.sendKeys(publicationDate);
  }

  async getPublicationDateInput() {
    return this.publicationDateInput.getAttribute('value');
  }

  async userSelectLastOption() {
    await this.userSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async userSelectOption(option) {
    await this.userSelect.sendKeys(option);
  }

  getUserSelect() {
    return this.userSelect;
  }

  async getUserSelectedOption() {
    return this.userSelect.element(by.css('option:checked')).getText();
  }

  async save() {
    await this.saveButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }

  getSaveButton() {
    return this.saveButton;
  }
}
