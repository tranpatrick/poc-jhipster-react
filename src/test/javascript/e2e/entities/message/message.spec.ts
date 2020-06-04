import { browser, element, by, protractor } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import MessageComponentsPage, { MessageDeleteDialog } from './message.page-object';
import MessageUpdatePage from './message-update.page-object';
import {
  waitUntilDisplayed,
  waitUntilAnyDisplayed,
  click,
  getRecordsCount,
  waitUntilHidden,
  waitUntilCount,
  isVisible
} from '../../util/utils';

const expect = chai.expect;

describe('Message e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let messageComponentsPage: MessageComponentsPage;
  let messageUpdatePage: MessageUpdatePage;
  let messageDeleteDialog: MessageDeleteDialog;
  let beforeRecordsCount = 0;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.waitUntilDisplayed();

    await signInPage.username.sendKeys('admin');
    await signInPage.password.sendKeys('admin');
    await signInPage.loginButton.click();
    await signInPage.waitUntilHidden();
    await waitUntilDisplayed(navBarPage.entityMenu);
    await waitUntilDisplayed(navBarPage.adminMenu);
    await waitUntilDisplayed(navBarPage.accountMenu);
  });

  it('should load Messages', async () => {
    await navBarPage.getEntityPage('message');
    messageComponentsPage = new MessageComponentsPage();
    expect(await messageComponentsPage.title.getText()).to.match(/Messages/);

    expect(await messageComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilAnyDisplayed([messageComponentsPage.noRecords, messageComponentsPage.table]);

    beforeRecordsCount = (await isVisible(messageComponentsPage.noRecords)) ? 0 : await getRecordsCount(messageComponentsPage.table);
  });

  it('should load create Message page', async () => {
    await messageComponentsPage.createButton.click();
    messageUpdatePage = new MessageUpdatePage();
    expect(await messageUpdatePage.getPageTitle().getText()).to.match(/Create or edit a Message/);
    await messageUpdatePage.cancel();
  });

  it('should create and save Messages', async () => {
    await messageComponentsPage.createButton.click();
    await messageUpdatePage.setContentInput('content');
    expect(await messageUpdatePage.getContentInput()).to.match(/content/);
    await messageUpdatePage.setPublicationDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
    expect(await messageUpdatePage.getPublicationDateInput()).to.contain('2001-01-01T02:30');
    await messageUpdatePage.userSelectLastOption();
    await waitUntilDisplayed(messageUpdatePage.saveButton);
    await messageUpdatePage.save();
    await waitUntilHidden(messageUpdatePage.saveButton);
    expect(await isVisible(messageUpdatePage.saveButton)).to.be.false;

    expect(await messageComponentsPage.createButton.isEnabled()).to.be.true;

    await waitUntilDisplayed(messageComponentsPage.table);

    await waitUntilCount(messageComponentsPage.records, beforeRecordsCount + 1);
    expect(await messageComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);
  });

  it('should delete last Message', async () => {
    const deleteButton = messageComponentsPage.getDeleteButton(messageComponentsPage.records.last());
    await click(deleteButton);

    messageDeleteDialog = new MessageDeleteDialog();
    await waitUntilDisplayed(messageDeleteDialog.deleteModal);
    expect(await messageDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/halitranApp.message.delete.question/);
    await messageDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(messageDeleteDialog.deleteModal);

    expect(await isVisible(messageDeleteDialog.deleteModal)).to.be.false;

    await waitUntilAnyDisplayed([messageComponentsPage.noRecords, messageComponentsPage.table]);

    const afterCount = (await isVisible(messageComponentsPage.noRecords)) ? 0 : await getRecordsCount(messageComponentsPage.table);
    expect(afterCount).to.eq(beforeRecordsCount);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
