import Login from "../PageObjects/Login.js";
import users from "../fixtures/service.json"
describe('Fiduciary Testing', () => {
    let page_access;
    for (let user in users) {
        let email = users[user].email;
        let password = users[user].password;
        let url = users[user].url;
        let rule_name = users[user].rule_name;
        let page_name = users[user].page_name;
        let access = users[user].access;
        let visible = users[user].visible;
        let addservice = users[user].addservice;
        let editservice = users[user].editservice;
        let deleteservice = users[user].deleteservice;

        //access
        it('Check Service Access', () => {
            //login
            cy.intercept('POST', '**/api/users/login').as('login');
            cy.intercept('GET', '**/api/common/content?').as('access');
            cy.visit(url + '/login');
            const ln = new Login();
            ln.setEmail(email)
            ln.setPassword(password)
            ln.setCheckLogin()
            ln.setLogin()
            cy.wait('@login', { requestTimeout: 10000 });
            cy.get('@login').then((xhr) => {
                expect(xhr.response.statusCode).to.eq(200);
                cy.wait('@access', { requestTimeout: 10000 });
                cy.get('@access').then((xhr) => {
                    page_access = xhr.response.body.Access.services;
                    expect(access.view).to.equal(page_access.view);
                    expect(access.add).to.equal(page_access.add);
                    expect(access.edit).to.equal(page_access.edit);
                    expect(access.delete).to.equal(page_access.delete);
                })
            })
        })

        //visible
        it('check Service all CRUD visible', () => {
            //login
            cy.intercept('POST', '**/api/users/login').as('login');
            cy.visit(url + '/login');
            const ln = new Login();
            ln.setEmail(email)
            ln.setPassword(password)
            ln.setCheckLogin()
            ln.setLogin()
            cy.wait('@login', { requestTimeout: 10000 });
            cy.get('@login').then((xhr) => {
                expect(xhr.response.statusCode).to.eq(200);
            })
            cy.get('#menuCollapseButton7').click();
            cy.get('[href="/settings/services"]').click();
            //Verify element on page
            cy.get('.mb-0.me-auto').should('have.text', page_name);

            //CURD opertaion
            cy.get("div[class='card']").should(visible.view);
            cy.get('#btnAddServices').should(visible.add);
            cy.get('[data-bs-target="#modalServiceUpdate"]').should(visible.edit);
            cy.get('[data-bs-target="#modalServiceDelete"]').should(visible.delete);
        })

        //Add Service (success)
        if (access.view == true && access.add == true) {
            it('Service Add and Get Success Status', () => {
                //login
                cy.loginByForm(email, password)
                cy.visit('https://frx-wl-one.slashash.dev/settings/services');
                //Verify element on page
                cy.get('.mb-0.me-auto').should('have.text', page_name);
                //click add service button
                cy.get('#btnAddServices').click({ force: true });
                // Check all element on Add Service Model
                cy.get("h5[class='text-center modal-title']").should('have.text', 'Add Service');
                cy.get("div[id='modalServiceUpdate'] button[aria-label='Close']").should('be.visible');
                cy.get('#txtServiceName').should('be.visible');
                cy.get('#selDimensionName').should('be.visible');
                cy.get('#btnUpdateCancel').should('be.visible');
                cy.get('#btnUpdateSubmit').should('be.visible');
                //data add in form to json
                cy.fixture('SettingService').then((data) => {
                    cy.intercept('POST', '**/api/settings/services/add-edit').as('add_service');
                    cy.get('#btnUpdateSubmit').click();
                    cy.get('#dmxValidatorErrorformUpdateServicesservice_name').should('have.text', 'This field is required.');
                    cy.get('#txtServiceName').type(data.service_name.toLowerCase());
                    cy.get('#btnUpdateSubmit').click();
                    cy.get('#dmxValidatorErrorformUpdateServicesdimension_id').should('have.text', 'This field is required.');
                    cy.get('#selDimensionName').select(data.dimension_name);
                    cy.get('#btnUpdateSubmit').click();
                    cy.wait('@add_service', { requestTimeout: 10000 });
                    cy.get('@add_service').then((xhr) => {
                        if (xhr.response.statusCode == addservice.invalid) {
                            expect(xhr.response.statusCode).to.eq(addservice.invalid);
                        }
                        else {
                            expect(xhr.response.statusCode).to.eq(addservice.success);
                        }
                    })
                })
            })
        }

        //Add Service (invalid)
        if (access.view == true && access.add == true) {
            it('Service Add and Get Invalid Status', () => {
                //login
                cy.loginByForm(email, password)
                cy.visit('https://frx-wl-one.slashash.dev/settings/services');
                //Verify element on page
                cy.get('.mb-0.me-auto').should('have.text', page_name);
                //click add service button
                cy.get('#btnAddServices').click({ force: true });
                // Check all element on Add Service Model
                cy.get("h5[class='text-center modal-title']").should('have.text', 'Add Service');
                cy.get("div[id='modalServiceUpdate'] button[aria-label='Close']").should('be.visible');
                cy.get('#txtServiceName').should('be.visible');
                cy.get('#selDimensionName').should('be.visible');
                cy.get('#btnUpdateCancel').should('be.visible');
                cy.get('#btnUpdateSubmit').should('be.visible');
                //data add in form to json
                cy.fixture('SettingService').then((data) => {
                    cy.intercept('POST', '**/api/settings/services/add-edit').as('add_service');
                    cy.get('#btnUpdateSubmit').click();
                    cy.get('#dmxValidatorErrorformUpdateServicesservice_name').should('have.text', 'This field is required.');
                    cy.get('#txtServiceName').type(data.service_name.toLowerCase());
                    cy.get('#btnUpdateSubmit').click();
                    cy.get('#dmxValidatorErrorformUpdateServicesdimension_id').should('have.text', 'This field is required.');
                    cy.get('#selDimensionName').select(data.dimension_name);
                    cy.get('#btnUpdateSubmit').click();
                    cy.wait('@add_service', { requestTimeout: 10000 });
                    cy.get('@add_service').then((xhr) => {
                        if (xhr.response.statusCode == addservice.invalid) {
                            expect(xhr.response.statusCode).to.eq(addservice.invalid);
                        }
                        else {
                            expect(xhr.response.statusCode).to.eq(addservice.success);
                        }
                    })
                })
            })
        }

        //Add Service (unauthorized)
        if (access.view == true && access.add == false) {
            it('Service Add and Get Unauthorized Status', () => {
                //login
                cy.loginByForm(email, password)
                cy.visit('https://frx-wl-one.slashash.dev/settings/services');
                //Verify element on page
                cy.get('.mb-0.me-auto').should('have.text', page_name);
                //click add service button
                cy.get('#btnAddServices').click({ force: true });
                // Check all element on Add Service Model
                cy.get("h5[class='text-center modal-title']").should('have.text', 'Add Service');
                cy.get("div[id='modalServiceUpdate'] button[aria-label='Close']").should('be.visible');
                cy.get('#txtServiceName').should('be.visible');
                cy.get('#selDimensionName').should('be.visible');
                cy.get('#btnUpdateCancel').should('be.visible');
                cy.get('#btnUpdateSubmit').should('be.visible');
                //data add in form to json
                cy.fixture('SettingService').then((data) => {
                    cy.intercept('POST', '**/api/settings/services/add-edit').as('add_service');
                    cy.get('#btnUpdateSubmit').click();
                    cy.get('#dmxValidatorErrorformUpdateServicesservice_name').should('have.text', 'This field is required.');
                    cy.get('#txtServiceName').type(data.service_name.toLowerCase());
                    cy.get('#btnUpdateSubmit').click();
                    cy.get('#dmxValidatorErrorformUpdateServicesdimension_id').should('have.text', 'This field is required.');
                    cy.get('#selDimensionName').select(data.dimension_name);
                    cy.get('#btnUpdateSubmit').click();
                    cy.wait('@add_service', { requestTimeout: 10000 });
                    cy.get('@add_service').then((xhr) => {
                        expect(xhr.response.statusCode).to.eq(addservice.unauthorized);
                    })
                })
            })
        }

        //edit Service (success)
        if (access.view == true && access.edit == true) {
            it('Service Edit and Get Success Status', () => {
                //login
                cy.loginByForm(email, password)
                cy.visit('https://frx-wl-one.slashash.dev/settings/services');
                //Verify element on page
                cy.get('.mb-0.me-auto').should('have.text', page_name);
                //click edit service button
                cy.fixture('SettingService').then((data) => {
                    cy.intercept('POST', '**/api/settings/services/add-edit').as('edit_service');
                    if (access.add == true) {
                        cy.contains(data.service_name, { timeout: 10000 }).parent('tr').find('div>[data-bs-target="#modalServiceUpdate"]').click({ force: true });
                    } else {
                        cy.get('body > div:nth-child(10) > div:nth-child(2) > div:nth-child(2) > div:nth-child(8) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > table:nth-child(1) > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(3) > div:nth-child(1) > button:nth-child(1)').click({ force: true })
                    }
                    // Check all element on Add Service Model
                    cy.get("h5[class='text-center modal-title']").should('have.text', 'Edit Service');
                    cy.get("div[id='modalServiceUpdate'] button[aria-label='Close']").should('be.visible');
                    cy.get('#txtServiceName').should('be.visible');
                    cy.get('#selDimensionName').should('be.visible');
                    cy.get('#btnUpdateCancel').should('be.visible');
                    cy.get('#btnUpdateSubmit').should('be.visible');
                    cy.get('#btnUpdateSubmit').click();
                    cy.wait('@edit_service', { requestTimeout: 10000 });
                    cy.get('@edit_service').then((xhr) => {
                        expect(xhr.response.statusCode).to.eq(editservice.success);
                    })
                })
            })
        }

        //edit Service (unauthorized)
        if (access.view == true && access.edit == false) {
            it('Service Edit and Get Unauthorized Status', () => {
                //login
                cy.loginByForm(email, password)
                cy.visit('https://frx-wl-one.slashash.dev/settings/services');
                //Verify element on page
                cy.get('.mb-0.me-auto').should('have.text', page_name);
                //click edit service button
                cy.fixture('SettingService').then((data) => {
                    cy.intercept('POST', '**/api/settings/services/add-edit').as('edit_service');
                    if (access.add == true) {
                        cy.contains(data.service_name, { timeout: 10000 }).parent('tr').find('div>[data-bs-target="#modalServiceUpdate"]').click({ force: true });
                    } else {
                        cy.get('body > div:nth-child(10) > div:nth-child(2) > div:nth-child(2) > div:nth-child(8) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > table:nth-child(1) > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(3) > div:nth-child(1) > button:nth-child(1)').click({ force: true })
                    }
                    // Check all element on Add Service Model
                    cy.get("h5[class='text-center modal-title']").should('have.text', 'Edit Service');
                    cy.get("div[id='modalServiceUpdate'] button[aria-label='Close']").should('be.visible');
                    cy.get('#txtServiceName').should('be.visible');
                    cy.get('#selDimensionName').should('be.visible');
                    cy.get('#btnUpdateCancel').should('be.visible');
                    cy.get('#btnUpdateSubmit').should('be.visible');
                    cy.get('#btnUpdateSubmit').click();
                    cy.wait('@edit_service', { requestTimeout: 10000 });
                    cy.get('@edit_service').then((xhr) => {
                        expect(xhr.response.statusCode).to.eq(editservice.unauthorized);
                    })
                })
            })
        }

        //delete Service (success)
        if (access.view == true && access.delete == true) {
            it('Service delete and Get Success Status', () => {
                //login
                cy.loginByForm(email, password)
                cy.visit('https://frx-wl-one.slashash.dev/settings/services');
                //Verify element on page
                cy.get('.mb-0.me-auto').should('have.text', page_name);
                //click delete service button
                cy.fixture('SettingService').then((data) => {
                    cy.intercept('POST', '**/api/settings/services/delete').as('delete_service');
                    if (access.add == true) {
                        cy.contains(data.service_name).parent('tr').find('div>[data-bs-target="#modalServiceDelete"]').click({ force: true });
                    } else {
                        cy.get('body > div:nth-child(10) > div:nth-child(2) > div:nth-child(2) > div:nth-child(8) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > table:nth-child(1) > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(3) > div:nth-child(1) > button:nth-child(2)').click({ force: true })
                    }
                    // Check all element on delete Service Model
                    cy.get(".text-center.modal-title.text-danger").should('have.text', 'Delete Service');
                    cy.get('#btnDeleteCancel').should('be.visible');
                    cy.get('#btnDeleteSubmit').should('be.visible');
                    cy.get('#btnDeleteSubmit').click();
                    cy.wait('@delete_service', { requestTimeout: 10000 });
                    cy.get('@delete_service').then((xhr) => {
                        expect(xhr.response.statusCode).to.eq(deleteservice.success);
                    })
                })
            })
        }

        //delete Service (unauthorized)
        if (access.view == true && access.delete == false) {
            it('Service delete and Get unauthorized Status', () => {
                //login
                cy.loginByForm(email, password)
                cy.visit('https://frx-wl-one.slashash.dev/settings/services');
                //Verify element on page
                cy.get('.mb-0.me-auto').should('have.text', page_name);
                //click delete service button
                cy.fixture('SettingService').then((data) => {
                    cy.intercept('POST', '**/api/settings/services/delete').as('delete_service');
                    if (access.add == true) {
                        cy.contains(data.service_name).parent('tr').find('div>[data-bs-target="#modalServiceDelete"]').click({ force: true });
                    } else {
                        cy.get('body > div:nth-child(10) > div:nth-child(2) > div:nth-child(2) > div:nth-child(8) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > table:nth-child(1) > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(3) > div:nth-child(1) > button:nth-child(2)').click({ force: true })
                    }
                    // Check all element on delete Service Model
                    cy.get(".text-center.modal-title.text-danger").should('have.text', 'Delete Service');
                    cy.get('#btnDeleteCancel').should('be.visible');
                    cy.get('#btnDeleteSubmit').should('be.visible');
                    cy.get('#btnDeleteSubmit').click();
                    cy.wait('@delete_service', { requestTimeout: 10000 });
                    cy.get('@delete_service').then((xhr) => {
                        expect(xhr.response.statusCode).to.eq(deleteservice.unauthorized);
                    })
                })
            })
        }
    }
})