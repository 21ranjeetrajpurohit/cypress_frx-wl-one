import Login from "../PageObjects/Login.js";
import users from "../fixtures/Profile.json"
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
        let plan_sponsor = users[user].plan_sponsor;
        let edit_profile = users[user].edit_profile;
        let redirect = users[user].redirect;

        //access
        it('Check Profile Page Access', () => {
            //login
            cy.intercept('POST', '**/api/users/login').as('login');
            cy.intercept('GET', '**/api/common/content?').as('access');
            cy.visit(url + '/login');
            const ln = new Login();
            ln.setEmail(email);
            ln.setPassword(password);
            ln.setCheckLogin();
            ln.setLogin();
            cy.wait('@login', { requestTimeout: 10000 });
            cy.get('@login').then((xhr) => {
                expect(xhr.response.statusCode).to.eq(200);
                cy.wait('@access', { requestTimeout: 20000 });
                cy.get('@access').then((xhr) => {
                    page_access = xhr.response.body.Access.ps_profile;
                    expect(access.view).to.equal(page_access.view);
                    expect(access.add).to.equal(page_access.add);
                    expect(access.edit).to.equal(page_access.edit);
                    expect(access.delete).to.equal(page_access.delete);
                })
            })
        })

        //visible
        it('check Profile Page all CRUD visible', () => {
            //login
            cy.intercept('POST', '**/api/users/login').as('login');
            cy.visit(url + '/login');
            const ln = new Login();
            ln.setEmail(email);
            ln.setPassword(password);
            ln.setCheckLogin();
            ln.setLogin();
            cy.wait('@login', { requestTimeout: 10000 });
            cy.get('@login').then((xhr) => {
                expect(xhr.response.statusCode).to.eq(200);
            })
            cy.visit('https://frx-wl-one.slashash.dev/plan-sponsor/profile')
            //Verify element on page
            cy.get('.mb-0.me-auto').should('have.text', page_name);

            //CURD opertaion
            cy.get('#content > .card > :nth-child(1)').should(visible.view);
            cy.get('#selPlanSponsorID').select(plan_sponsor);
            cy.get('.text-center > .btn').should(visible.edit);
        })

        //redirect
        it('Redirect function in  Profile Page', () => {
            //login
            cy.loginByForm(email, password)
            cy.visit('https://frx-wl-one.slashash.dev/plan-sponsor/profile');
            //Verify element on page
            cy.get('.mb-0.me-auto').should('have.text', page_name);
            cy.get('#selPlanSponsorID').select(plan_sponsor);
            cy.wait(500);
            redirect.forEach((item) => {
                cy.get('#dropdownPSGoToOptionBtn',).click();
                cy.get('li>[class="dropdown-item"]').contains(item.name).click();
                if (item.name == 'All Reports') {
                    cy.get('h3').should('have.text', plan_sponsor);
                }
                else {
                    cy.get('h3').should('have.text', plan_sponsor + '-' + item.name);
                }
                cy.url().should('include', item.url);
            })
        })

        //edit profile (success)
        if (access.view == true && access.edit == true) {
            it('Profile Edit and Get Success Status', () => {
                //login
                cy.loginByForm(email, password)
                cy.visit('https://frx-wl-one.slashash.dev/plan-sponsor/profile');
                //Verify element on page
                cy.get('.mb-0.me-auto').should('have.text', page_name);
                //click edit service button
                cy.fixture('EditProfile').then((data) => {
                    cy.intercept('POST', '**/api/plan-sponsors/edit').as('edit_profile');
                    cy.get('#selPlanSponsorID').select(plan_sponsor);
                    cy.wait(500);
                    //Check all element visible edit profile Model
                    cy.get('.container > .justify-content-center > :nth-child(1)').should('be.visible');
                    cy.get('#txtName').should('be.visible');
                    cy.get('#setlIndustryID').should('be.visible');
                    cy.get('#selState').should('be.visible');
                    cy.get('#selPlanType').should('be.visible');
                    cy.get('#formEditProfile > :nth-child(2) > :nth-child(5)').should('be.visible');
                    cy.get('.text-center > .btn').should('be.visible');
                    //data add in edit form
                    cy.get('#txtName').clear().type(data.plan_sponsor_name);
                    cy.get('#setlIndustryID').select(data.industry);
                    cy.get('#selState').select(data.state);
                    cy.get('#selPlanType').select(data.plan_type);
                    cy.get('[for="ProspectNo"]').click();
                    cy.get('.text-center > .btn').click({ force: true });
                    cy.wait('@edit_profile', { requestTimeout: 10000 });
                    cy.get('@edit_profile').then((xhr) => {
                        expect(xhr.response.statusCode).to.eq(edit_profile.success);
                    })
                })
            })
        }

        //edit profile (unauthorized)
        if (access.view == true && access.edit == false) {
            it('Profile Edit and Get unauthorized Status', () => {
                //login
                cy.loginByForm(email, password)
                cy.visit('https://frx-wl-one.slashash.dev/plan-sponsor/profile');
                //Verify element on page
                cy.get('.mb-0.me-auto').should('have.text', page_name);
                //click edit service button
                cy.fixture('EditProfile').then((data) => {
                    cy.intercept('POST', '**/api/plan-sponsors/edit').as('edit_profile');
                    cy.get('#selPlanSponsorID').select(plan_sponsor);
                    //Check all element visible edit profile Model
                    cy.get('.container > .justify-content-center > :nth-child(1)')
                    cy.get('#txtName').should('be.visible');
                    cy.get('#setlIndustryID').should('be.visible');
                    cy.get('#selState').should('be.visible');
                    cy.get('#selPlanType').should('be.visible');
                    cy.get('#formEditProfile > :nth-child(2) > :nth-child(5)').should('be.visible');
                    cy.get('.text-center > .btn').should('be.visible');
                    //data add in edit form
                    cy.get('#txtName').clear().type(data.plan_sponsor_name);
                    cy.get('#setlIndustryID').select(data.industry);
                    cy.get('#selState').select(data.state);
                    cy.get('#selPlanType').select(data.plan_type);
                    cy.get('[for="ProspectNo"]').click();
                    cy.get('.text-center > .btn').click({ force: true });
                    cy.wait('@edit_profile', { requestTimeout: 10000 });
                    cy.get('@edit_profile').then((xhr) => {
                        expect(xhr.response.statusCode).to.eq(edit_profile.unauthorized);
                    })
                })
            })
        }
    }
})