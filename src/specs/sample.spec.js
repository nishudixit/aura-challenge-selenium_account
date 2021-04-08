import {
  emailCreateElement,
  submitCreateElement,
  customerFirstNameElement,
  customerLastNameElement,
  emailElement,
  passwordElement,
  addressElement,
  cityElement,
  stateElement,
  postcodeElement,
  phoneMobileElement,
  aliasElement,
  submitAccountElement
}
from "../page-objects/registration.po";
import Chance from 'chance';
import { addressesListElement } from "../page-objects/my-account.po";

const EC = protractor.ExpectedConditions;
const chance = new Chance();
const timeout = 5000;
const password = '@@TeST##L0giC';
const randomEmailId = chance.email({ domain: 'test.com' });
const firstName = chance.first();
const lastName = chance.last();
const address = chance.address();
const city = chance.city();
const zipCode = chance.zip();
const mobileNumber = chance.phone();

describe("Aura Code Challenge - Create User Account Tests", () => {

  beforeEach(function () {
    browser.get('/index.php?controller=authentication&back=my-account');
  });

  it("it loads authentication page", () => {
    expect(browser.getTitle()).toBe("Login - My Store");
  });
  it("registration form loaded and completing process", () => {
    browser.wait(EC.presenceOf(emailCreateElement()), timeout)
    .then(() => emailCreateElement().sendKeys(randomEmailId))
    .then(() => browser.wait(EC.presenceOf(submitCreateElement()), timeout))
    .then(() => submitCreateElement().click())
    .then(() => browser.wait(EC.presenceOf(customerFirstNameElement()), timeout))
    .then(() => customerFirstNameElement().sendKeys(firstName))
    .then(() => customerLastNameElement().sendKeys(lastName))
    .then(() => expect(emailElement().getAttribute('value')).toEqual(randomEmailId))
    .then(() => passwordElement().sendKeys(password))
    .then(() => addressElement().sendKeys(address))
    .then(() => cityElement().sendKeys(city))
    .then(() => browser.wait(EC.presenceOf(stateElement().element(by.cssContainingText('option', 'Florida'))), timeout))
    .then(() => stateElement().element(by.cssContainingText('option', 'Florida')).click())
    .then(() => postcodeElement().sendKeys(zipCode))
    .then(() => phoneMobileElement().sendKeys(mobileNumber))
    .then(() => aliasElement().clear().sendKeys('code test'))
    .then(() => submitAccountElement().click())
    .then(() => browser.wait(EC.presenceOf(addressesListElement()), timeout))
    .then(() => expect(browser.getTitle()).toBe("My account - My Store"))
  });

});
