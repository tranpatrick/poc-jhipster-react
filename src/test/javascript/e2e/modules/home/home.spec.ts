import { element, by, browser } from 'protractor';

import NavBarPage from '../../page-objects/navbar-page';
import SignInPage from '../../page-objects/signin-page';
import {
  getMessageRecordsCount,
  getRecordsCount,
  isVisible,
  waitUntilAnyDisplayed,
  waitUntilCount,
  waitUntilDisplayed
} from '../../util/utils';
import MessageComponentsPage from '../../entities/message/message.page-object';
import HomePage from '../../page-objects/home-page';
import home from 'app/modules/home/home';

const expect = chai.expect;

describe('Home', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let homeComponentPage: HomePage;
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
  });

  it('should load Messages', async () => {
    homeComponentPage = new HomePage();
    expect(await homeComponentPage.title.getText()).to.match(/Welcome, Java Hipster!/);
    expect(await homeComponentPage.newMsgButton.isEnabled()).to.be.true;
    await waitUntilAnyDisplayed([homeComponentPage.noRecords, homeComponentPage.records]);

    beforeRecordsCount = (await isVisible(homeComponentPage.noRecords)) ? 0 : await getMessageRecordsCount(homeComponentPage.records);
  });

  it('should create and save Messages', async () => {
    await homeComponentPage.openMsgModal();
    expect(await homeComponentPage.newMsgModal.isPresent()).to.be.true;
    expect(await homeComponentPage.newMsgModal.isDisplayed()).to.be.true;

    await homeComponentPage.setContentInput('coucou');
    expect(await homeComponentPage.getContentInput()).to.match(/coucou/);

    await homeComponentPage.saveMsg();
    expect(await homeComponentPage.newMsgModal.isPresent()).to.be.false;

    await waitUntilDisplayed(homeComponentPage.records);
    expect(await getMessageRecordsCount(homeComponentPage.records)).to.eq(beforeRecordsCount + 1);
  });
});
