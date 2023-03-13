//login multipale
// import Login from "../PageObjects/Login.js";
// describe('Fiduciary Testing', () => {
//     //login
//     it('Fiduciary Login', () => {
//         cy.fixture('Login.json').then((data) => {
//             cy.intercept('POST', '**/api/users/login').as('login');
//             data.forEach((userdata) => {
//                 cy.visit(userdata.url + '/login');
//                 const ln = new Login();
//                 ln.setLogin()
//                 cy.get('#dmxValidatorErrorformLoginemail').should('have.text', 'This field is required.');
//                 ln.setEmail(userdata.email)
//                 ln.setLogin()
//                 cy.get('#dmxValidatorErrorformLoginpassword').should('have.text', 'This field is required.');
//                 ln.setPassword(userdata.password)
//                 ln.setCheckLogin()
//                 ln.setLogin()
//                 cy.wait('@login',{ requestTimeout: 10000 });
//                 cy.get('@login').then((xhr) => {
//                     expect(xhr.response.statusCode).to.eq(data);
//                     if (xhr.response.statusCode == 401) {
//                         cy.log('login Unsuccessful');

//                     } else {
//                         cy.log('login successful');
//                         expect(xhr.response.statusCode).to.eq(200);
//                         cy.intercept('GET', '**/api/users/logout?').as('logout');
//                         cy.get('.bi-box-arrow-right').click()
//                         cy.wait('@logout', { requestTimeout: 10000 });
//                         cy.get('@logout').then((xhr) => {
//                             if (xhr.response.statusCode == 401) {
//                                 expect(xhr.response.statusCode).to.eq(401);
//                                 cy.log('logout Unsuccessful');
//                             } else {
//                                 cy.log('logout successful');
//                                 expect(xhr.response.statusCode).to.eq(200);
//                             }
//                         })
//                     }
//                 })
//                 cy.wait(1000)
//             })
//         })
//     })
//     //Not login
//     it('Fiduciary Not Login', () => {
//         cy.fixture('NotLogin.json').then((data) => {
//             cy.intercept('POST', '**/api/users/login').as('login');
//             cy.visit(data.url + '/login');
//             const ln = new Login();
//             ln.setLogin()
//             cy.get('#dmxValidatorErrorformLoginemail').should('have.text', 'This field is required.');
//             ln.setEmail(data.email)
//             ln.setLogin()
//             cy.get('#dmxValidatorErrorformLoginpassword').should('have.text', 'This field is required.');
//             ln.setPassword(data.password)
//             ln.setCheckLogin()
//             ln.setLogin()
//             cy.wait('@login');
//             cy.get('@login').then((xhr) => {
//                 if (xhr.response.statusCode == 401) {
//                     expect(xhr.response.statusCode).to.eq(401);
//                     cy.log('login Unsuccessful');

//                 } else {
//                     cy.log('login successful');
//                     expect(xhr.response.statusCode).to.eq(200);
//                 }
//             })

//         })
//     })
// })



//Add SettingServices
// import Login from "../PageObjects/Login.js";
// describe('Fiduciary Testing', () => {
//     let login_fiduciary;
//     let page_access;
//     beforeEach('login', () => {
//         cy.fixture('Login.json').then((data) => {
//             cy.intercept('POST', '**/api/users/login').as('login');
//             cy.visit(data.url + '/login');
//             const ln = new Login();
//             ln.setLogin()
//             cy.get('#dmxValidatorErrorformLoginemail').should('have.text', 'This field is required.');
//             ln.setEmail(data.email)
//             ln.setLogin()
//             cy.get('#dmxValidatorErrorformLoginpassword').should('have.text', 'This field is required.');
//             ln.setPassword(data.password)
//             ln.setCheckLogin()
//             ln.setLogin()
//             cy.wait('@login', { requestTimeout: 10000 });
//             cy.get('@login').then((xhr) => {
//                 if (xhr.response.statusCode == 401) {
//                     login_fiduciary = false;
//                     expect(xhr.response.statusCode).to.eq(401);
//                     cy.log('login Unsuccessful');
//                 } else {
//                     login_fiduciary = true;
//                     cy.log('login successful');
//                     expect(xhr.response.statusCode).to.eq(200);
//                     cy.intercept('GET', '**/api/common/content?').as('access');
//                     cy.wait('@access', { requestTimeout: 10000 });
//                     cy.get('@access').then((xhr) => {
//                         page_access = xhr.response.body.Access;
//                     })
//                 }
//             })
//         })
//     })
//     //Add Service
//     it('Setting Services', () => {
//         if (login_fiduciary == true) {
//             cy.log(page_access);
//             if (page_access.services.view == true) {
//                 cy.get('#menuCollapseButton7').click();
//                 cy.get('[href="/settings/services"]').click();
//                 //Verify element on page
//                 cy.get('.mb-0.me-auto').should('have.text', 'Services');
//                 cy.get('#txtSearch').should('be.visible');
//                 cy.get('#selDimensionId').should('be.visible');
//                 cy.get("div[class='card']").should('be.visible');
//                 //Add Services
//                 if (page_access.services.add == true) {
//                     cy.get('#btnAddServices').click();
//                 } else {
//                     cy.get('#btnAddServices').click({ force: true });
//                 }
//                 //Check all element on Add Service Model
//                 cy.get("h5[class='text-center modal-title']").should('have.text', 'Add Service');
//                 cy.get("div[id='modalServiceUpdate'] button[aria-label='Close']").should('be.visible');
//                 cy.get('#txtServiceName').should('be.visible');
//                 cy.get('#selDimensionName').should('be.visible');
//                 cy.get('#btnUpdateCancel').should('be.visible');
//                 cy.get('#btnUpdateSubmit').should('be.visible');
//                 //data add in form to json
//                 cy.fixture('SettingService').then((data) => {
//                     cy.intercept('POST', '**/api/settings/services/add-edit').as('add_service');
//                     cy.get('#btnUpdateSubmit').click();
//                     cy.get('#dmxValidatorErrorformUpdateServicesservice_name').should('have.text','This field is required.');
//                     cy.get('#txtServiceName').type(data.service_name);
//                     cy.get('#btnUpdateSubmit').click();
//                     cy.get('#dmxValidatorErrorformUpdateServicesdimension_id').should('have.text','This field is required.');
//                     cy.get('#selDimensionName').select(data.dimension_name);
//                     cy.get('#btnUpdateSubmit').click();
//                     cy.wait('@add_service', { requestTimeout: 10000 });
//                     cy.get('@add_service').then((xhr) => {
//                         if (xhr.response.body == 'Access Denied') {
//                             cy.log(xhr.response.body);
//                             expect(xhr.response.statusCode).to.eq(401);
//                             cy.get('#btnUpdateCancel').click();//click in cancel button
//                         } else if(xhr.response.statusCode==400){
//                             expect(xhr.response.statusCode).to.eq(400);
//                             cy.get('#dmxValidatorErrorformUpdateServicesservice_name').should('have.text','Service already exists .');
//                             cy.log('Service already exists');
//                             cy.get('#btnUpdateCancel').click();//click in cancel button
//                         }
//                         else {
//                             cy.log('Add service Successfully');
//                             expect(xhr.response.statusCode).to.eq(200);
//                         }
//                     })
//                 })
//             }
//         }
//     })
//     afterEach('logout', () => {
//         cy.intercept('GET', '**/api/users/logout?').as('logout');
//         cy.get('.bi-box-arrow-right').click()
//         cy.wait('@logout', { requestTimeout: 10000 });
//             cy.get('@logout').then((xhr) => {
//                 if (xhr.response.statusCode == 401) {
//                     expect(xhr.response.statusCode).to.eq(401);
//                     cy.log('logout Unsuccessful');
//                 } else {
//                     cy.log('logout successful');
//                     expect(xhr.response.statusCode).to.eq(200);
//                 }
//             })
//     })
// })








import Login from "../PageObjects/Login.js";
import users from "../fixtures/test.json"
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
        //access
        it('Fiduciary Login', () => {
            //login
            cy.loginByForm(email, password)
            cy.visit('https://frx-wl-one.slashash.dev/dashboard');
            cy.intercept('GET', '**/api/common/content?').as('access');
            cy.wait('@access', { requestTimeout: 10000 });
            cy.get('@access').then((xhr) => {
                page_access = xhr.response.body.Access.services;
                expect(access.view).to.equal(page_access.view);
                expect(access.add).to.equal(page_access.add);
                expect(access.edit).to.equal(page_access.edit);
                expect(access.delete).to.equal(page_access.delete);
            })
        })


        //visible
        it('Fiduciary Login', () => {
            //login
            cy.loginByForm(email, password)
            cy.visit('https://frx-wl-one.slashash.dev/settings/services');
            //Verify element on page
            cy.get('.mb-0.me-auto').should('have.text', page_name);

            //CURD opertaion
            cy.get("div[class='card']").should(visible.view);
            cy.get('#btnAddServices').should(visible.add);
            cy.get('[data-bs-target="#modalServiceUpdate"]').should(visible.edit);
            cy.get('[data-bs-target="#modalServiceDelete"]').should(visible.delete);
        })
    }
})
















        //Add Plan Sponsor (success)
        if(access.view == true && access.add == true) {
            it(' Plan Sponsor Add and Get Success Status', () => {
                //login
                cy.loginByForm(email, password)
                cy.visit('https://frx-wl-one.slashash.dev/settings/services');
                //Verify element on page
                cy.get('.mb-0.me-auto').should('have.text', page_name);
                //click add service button
                cy.get(".btn.btn-primary[data-bs-toggle='modal']").click({ force: true });
                // Check all element on Add Service Model
                cy.get("div[id='modalAdd'] h5[class='modal-title']").should('have.text', 'Add Plan Sponsor');
                cy.get("div[id='modalServiceUpdate'] button[aria-label='Close']").should('be.visible');
                cy.get('#txtName').should('be.visible');
                cy.get('#txtLegalName').should('be.visible');
                cy.get('#txtPlanName').should('be.visible');
                cy.get('#selTeam').should('be.visible');
                cy.get('#txtPlanAmount').should('be.visible');
                cy.get('#txtParticipant').should('be.visible');
                cy.get('#selRK').should('be.visible');
                cy.get('#selIndustryID').should('be.visible');
                cy.get('#selState').should('be.visible');
                cy.get('#selPlanType').should('be.visible');
                cy.get('.col-6.mb-3').should('be.visible');
                cy.get(':nth-child(14) > .col-12 > .form-control').should('be.visible');
                cy.get("form[id='formAdd'] button[aria-label='Close']").should('be.visible');
                cy.get(".btn.btn-primary.me-1").should('be.visible');
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

        