import Login from "../PageObjects/Login.js";
import users from "../fixtures/AllPlanSponsors.json"
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
        let search = users[user].search;
        let filters = users[user].filters;
        let redirect = users[user].redirect;
        let add_plan_sponsors = users[user].add_plan_sponsors;
        let delete_plan_sponsors = users[user].delete_plan_sponsors;

        //access
        it('Check All Plan Sponsors Access', () => {
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
                    page_access = xhr.response.body.Access.ps_list;
                    expect(access.view).to.equal(page_access.view);
                    expect(access.add).to.equal(page_access.add);
                    expect(access.edit).to.equal(page_access.edit);
                    expect(access.delete).to.equal(page_access.delete);
                })
            })
        })

        //visible
        it('check All Plan Sponsors all CRUD visible', () => {
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
            cy.visit('https://frx-wl-one.slashash.dev/plan-sponsor/all')
            //Verify element on page
            cy.get('.mb-0.me-auto').should('have.text', page_name);

            //CURD opertaion
            cy.get("div[class='card']").should(visible.view.table);
            cy.get('thead > tr > :nth-child(2)').should(visible.view.team);
            cy.get('thead > tr > :nth-child(9)').should(visible.view.assigned_to);
            // cy.get('thead > tr > :nth-child(1)').should(visible.view.assigned_to);
            cy.get('[data-bs-target="#modalAdd"]').should(visible.add);
            cy.get(':nth-child(1) > :nth-child(10) > .dropdown > #dropdownActions').click();
            //edit delete show
            visible.edit.show.forEach((item) => {
                cy.get('.dropdown-menu.show').should('include.text', item);
            })
            //edit delete not show
            visible.edit.not_show.forEach((item) => {
                cy.get('.dropdown-menu.show').should('not.include.text', item);
            })
        })

        //Search
        it('Search function in  All Plan Sponsors', () => {
            //login
            cy.loginByForm(email, password)
            cy.visit('https://frx-wl-one.slashash.dev/plan-sponsor/all');
            //Verify element on page
            cy.get('.mb-0.me-auto').should('have.text', page_name);
            //team
            search.team.forEach((item) => {
                cy.get('#txtSearch').clear().type(item);
                cy.wait(500)
                cy.get('table>tbody>tr>td:nth-child(2)')
                    .each(($row, index, $rows) => {
                        cy.get($row).should('contain', item)
                    })
            })
            //plan sponsor
            search.plan_sponsor.forEach((item) => {
                cy.get('#txtSearch').clear().type(item.toLowerCase());
                cy.wait(500)
                cy.get('table>tbody>tr>td:nth-child(3)')
                    .each(($row, index, $rows) => {
                        cy.get($row).should('contain', item)
                    })
            })
            //industry
            search.industry.forEach((item) => {
                cy.get('#txtSearch').clear().type(item);
                cy.wait(500)
                cy.get('table>tbody>tr>td:nth-child(7)')
                    .each(($row, index, $rows) => {
                        cy.get($row).should('contain', item)
                    })
            })
            //recordkeeper
            search.recordkeeper.forEach((item) => {
                cy.get('#txtSearch').clear().type(item);
                cy.wait(500)
                cy.get('table>tbody>tr>td:nth-child(8)')
                    .each(($row, index, $rows) => {
                        cy.get($row).should('contain', item)
                    })
            })
        })

        //filter
        it('Filter function in  All Plan Sponsors', () => {
            //login
            cy.loginByForm(email, password)
            cy.visit('https://frx-wl-one.slashash.dev/plan-sponsor/all');
            //Verify element on page
            cy.get('.mb-0.me-auto').should('have.text', page_name);
            //team
            filters.team.forEach((item) => {
                cy.get('#btnFilterToggle').click();
                cy.get('#selFTeam').select(item);
                cy.get('.btn.btn-secondary.mt-2').click();
                cy.wait(500)
                cy.get('table>tbody>tr>td:nth-child(2)')
                    .each(($row, index, $rows) => {
                        cy.get($row).should('contain', item)
                    })
                cy.get('.btn.btn-outline-secondary.mt-2').click();
            })
            //recordkeeper
            filters.recordkeeper.forEach((item) => {
                cy.get('#btnFilterToggle').click();
                cy.get('#selFRK').select(item);
                cy.get('.btn.btn-secondary.mt-2').click();
                cy.wait(500)
                cy.get('table>tbody>tr>td:nth-child(8)')
                    .each(($row, index, $rows) => {
                        cy.get($row).should('contain', item)
                    })
                cy.get('.btn.btn-outline-secondary.mt-2').click();
            })
        })

        //redirect
        it('Redirect function in  All Plan Sponsors', () => {
            //login
            cy.loginByForm(email, password)
            cy.visit('https://frx-wl-one.slashash.dev/plan-sponsor/all');
            //Verify element on page
            cy.get('.mb-0.me-auto').should('have.text', page_name);
            cy.get('body > div:nth-child(13) > div:nth-child(2) > div:nth-child(2) > div:nth-child(13) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > table:nth-child(1) > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(3) > span:nth-child(1)').then(($name) => {
                let txt = $name.text()
                redirect.forEach((item) => {
                    cy.get(':nth-child(1) > :nth-child(10) > .dropdown > #dropdownActions').click();
                    cy.get("div[class='dropdown-menu show']").contains(item.name).click({ force: true });

                    if (item.name == 'All Reports') {
                        cy.get('h3').should('have.text', txt);
                    }
                    else {
                        cy.get('h3').should('have.text', txt + '-' + item.name);
                    }
                    cy.url().should('include', item.url);
                    cy.get("a[title='All Charters']").click();
                })
            })
        })

        //Add Plan Sponsor (success)
        if (access.view == true && access.add == true) {
            it(' Plan Sponsor Add and Get Success Status', () => {
                //login
                cy.loginByForm(email, password)
                cy.visit('https://frx-wl-one.slashash.dev/plan-sponsor/all');
                //Verify element on page
                cy.get('.mb-0.me-auto').should('have.text', page_name);
                //click add service button
                cy.get(".btn.btn-primary[data-bs-toggle='modal']").click({ force: true });
                // Check all element visible Add Service Model
                cy.get("div[id='modalAdd'] h5[class='modal-title']").should('have.text', 'Add Plan Sponsor');
                cy.get("div[id='modalAdd'] div[class='modal-header'] button[aria-label='Close']").should('be.visible');
                cy.get('#txtName').should('be.visible');
                cy.get('#txtLegalName').should('be.visible');
                cy.get('#txtPlanName').should('be.visible');
                cy.get('#selProfile').should(visible.add_plan_sponsors_form.question_profile);
                cy.get('#selTeam').should(visible.add_plan_sponsors_form.team);
                cy.get('#txtPlanAmount').should('be.visible');
                cy.get('#txtParticipant').should('be.visible');
                cy.get('#selRK').should('be.visible');
                cy.get('#selIndustryID').should('be.visible');
                cy.get('#selState').should('be.visible');
                cy.get('#selAssignUser').should(visible.add_plan_sponsors_form.user);
                cy.get('#selPlanType').should('be.visible');
                cy.get('.col-6.mb-3').should('be.visible');
                cy.get(':nth-child(14) > .col-12 > .form-control').should('be.visible');
                cy.get("button[aria-label='Close']").should('be.visible');
                cy.get(".btn.btn-primary.me-1").should('be.visible');
                //data add in form to json
                cy.fixture('AddPlanSponsor.json').then((data) => {
                    cy.intercept('POST', '**/api/plan-sponsors/add').as('add_plan_sponsors');
                    cy.get(".btn.btn-primary.me-1").click();
                    //validation check
                    cy.get('#dmxValidatorErrorformAddplan_name').should('have.text', 'This field is required.');
                    if (visible.add_plan_sponsors_form.team == 'be.visible') {
                        cy.get('#dmxValidatorErrorformAddteam_id').should('have.text', 'This field is required.');
                    }
                    if (visible.add_plan_sponsors_form.user == 'be.visible') {
                        cy.get('#dmxValidatorErrorformAddassigned_to').should('have.text', 'This field is required.');
                    }
                    cy.get('#dmxValidatorErrorformAddplan_amount').should('have.text', 'This field is required.');
                    cy.get('#dmxValidatorErrorformAddnum_participants').should('have.text', 'This field is required.');
                    cy.get('#dmxValidatorErrorformAddrecordkeeper_id').should('have.text', 'This field is required.');
                    cy.get('#dmxValidatorErrorformAddindustry_id').should('have.text', 'This field is required.');
                    cy.get('#dmxValidatorErrorformAddstate_id').should('have.text', 'This field is required.');
                    //add data in form
                    cy.get('#txtName').type(data.plan_sponsor_name);
                    cy.get('#txtLegalName').type(data.legal_name);
                    cy.get('#txtPlanName').type(data.plan_name);
                    if (visible.add_plan_sponsors_form.question_profile == 'be.visible') {
                        cy.get('#selProfile').select(data.question_profile);
                    }
                    if (visible.add_plan_sponsors_form.team == 'be.visible') {
                        cy.get('#selTeam').select(data.team);
                    }
                    cy.get('#txtPlanAmount').type(data.plan_assets);
                    cy.get('#txtParticipant').type(data.plan_participants);
                    cy.get('#selRK').select(data.recordkeeper);
                    cy.get('#selIndustryID').select(data.industry);
                    cy.get('#selState').select(data.state);
                    if (visible.add_plan_sponsors_form.user == 'be.visible') {
                        cy.get('#selAssignUser').select(data.user);
                    }
                    cy.get('#selPlanType').select(data.plan_type);
                    cy.get("label[for='ProspectYes']").click();

                    cy.get(".btn.btn-primary.me-1").click();
                    cy.wait('@add_plan_sponsors', { requestTimeout: 10000 });
                    cy.get('@add_plan_sponsors').then((xhr) => {
                        expect(xhr.response.statusCode).to.eq(add_plan_sponsors.success);
                    })
                })
            })
        }

        //Add Plan Sponsor (unauthorized)
        if (access.view == true && access.add == false) {
            it(' Plan Sponsor Add and Get unauthorized Status', () => {
                //login
                cy.loginByForm(email, password)
                cy.visit('https://frx-wl-one.slashash.dev/plan-sponsor/all');
                //Verify element on page
                cy.get('.mb-0.me-auto').should('have.text', page_name);
                //click add service button
                cy.get(".btn.btn-primary[data-bs-toggle='modal']").click({ force: true });
                // Check all element visible Add Service Model
                cy.get("div[id='modalAdd'] h5[class='modal-title']").should('have.text', 'Add Plan Sponsor');
                cy.get("div[id='modalAdd'] div[class='modal-header'] button[aria-label='Close']").should('be.visible');
                cy.get('#txtName').should('be.visible');
                cy.get('#txtLegalName').should('be.visible');
                cy.get('#txtPlanName').should('be.visible');
                cy.get('#selProfile').should(visible.add_plan_sponsors_form.question_profile);
                cy.get('#selTeam').should(visible.add_plan_sponsors_form.team);
                cy.get('#txtPlanAmount').should('be.visible');
                cy.get('#txtParticipant').should('be.visible');
                cy.get('#selRK').should('be.visible');
                cy.get('#selIndustryID').should('be.visible');
                cy.get('#selState').should('be.visible');
                cy.get('#selAssignUser').should(visible.add_plan_sponsors_form.user);
                cy.get('#selPlanType').should('be.visible');
                cy.get('.col-6.mb-3').should('be.visible');
                cy.get(':nth-child(14) > .col-12 > .form-control').should('be.visible');
                cy.get("button[aria-label='Close']").should('be.visible');
                cy.get(".btn.btn-primary.me-1").should('be.visible');
                //data add in form to json
                cy.fixture('AddPlanSponsor.json').then((data) => {
                    cy.intercept('POST', '**/api/plan-sponsors/add').as('add_plan_sponsors');
                    cy.get(".btn.btn-primary.me-1").click();
                    //validation check
                    cy.get('#dmxValidatorErrorformAddplan_name').should('have.text', 'This field is required.');
                    if (visible.add_plan_sponsors_form.team == 'be.visible') {
                        cy.get('#dmxValidatorErrorformAddteam_id').should('have.text', 'This field is required.');
                    }
                    if (visible.add_plan_sponsors_form.user == 'be.visible') {
                        cy.get('#dmxValidatorErrorformAddassigned_to').should('have.text', 'This field is required.');
                    }
                    cy.get('#dmxValidatorErrorformAddplan_amount').should('have.text', 'This field is required.');
                    cy.get('#dmxValidatorErrorformAddnum_participants').should('have.text', 'This field is required.');
                    cy.get('#dmxValidatorErrorformAddrecordkeeper_id').should('have.text', 'This field is required.');
                    cy.get('#dmxValidatorErrorformAddindustry_id').should('have.text', 'This field is required.');
                    cy.get('#dmxValidatorErrorformAddstate_id').should('have.text', 'This field is required.');
                    //add data in form
                    cy.get('#txtName').type(data.plan_sponsor_name);
                    cy.get('#txtLegalName').type(data.legal_name);
                    cy.get('#txtPlanName').type(data.plan_name);
                    if (visible.add_plan_sponsors_form.question_profile == 'be.visible') {
                        cy.get('#selProfile').select(data.question_profile);
                    }
                    if (visible.add_plan_sponsors_form.team == 'be.visible') {
                        cy.get('#selTeam').select(data.team);
                    }
                    cy.get('#txtPlanAmount').type(data.plan_assets);
                    cy.get('#txtParticipant').type(data.plan_participants);
                    cy.get('#selRK').select(data.recordkeeper);
                    cy.get('#selIndustryID').select(data.industry);
                    cy.get('#selState').select(data.state);
                    if (visible.add_plan_sponsors_form.user == 'be.visible') {
                        cy.get('#selAssignUser').select(data.user);
                    }
                    cy.get('#selPlanType').select(data.plan_type);
                    cy.get("label[for='ProspectYes']").click();

                    cy.get(".btn.btn-primary.me-1").click();
                    cy.wait('@add_plan_sponsors', { requestTimeout: 10000 });
                    cy.get('@add_plan_sponsors').then((xhr) => {
                        expect(xhr.response.statusCode).to.eq(add_plan_sponsors.unauthorized);
                    })
                })
            })
        }

        //delete Plan Sponsor (success)
        if (access.view == true && access.delete == true) {
            it('Plan Sponsor delete and Get Success Status', () => {
                //login
                cy.loginByForm(email, password)
                cy.visit('https://frx-wl-one.slashash.dev/plan-sponsor/all');
                //Verify element on page
                cy.get('.mb-0.me-auto').should('have.text', page_name);
                //click delete service button
                cy.fixture('AddPlanSponsor.json').then((data) => {
                    cy.intercept('POST', '**/api/plan-sponsors/delete').as('delete_plan_sponsor');
                    if (access.add == true) {
                        if(visible.view.team=='be.visible'){
                        cy.contains(data.team).parent('tr').find('div>[id="dropdownActions"]').click();
                        }else{
                            cy.contains('td', data.plan_sponsor_name).siblings().find('div>[id="dropdownActions"]').click({ force: true })
                        }
                        cy.get("div[class='dropdown-menu show'] a[class='dropdown-item text-danger']").click({ force: true });
                    } else {
                        cy.get('body > div:nth-child(12) > div:nth-child(2) > div:nth-child(2) > div:nth-child(13) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > table:nth-child(1) > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(9) > div:nth-child(1) > button:nth-child(1)').click();
                        cy.get("div[class='dropdown-menu show'] a[class='dropdown-item text-danger']").click({ force: true })
                    }
                    // Check all element visible in  delete Service Model
                    cy.get(".modal-title.text-danger").should('have.text', 'Delete Plan Sponsor');
                    cy.get("form[id='FormDelete'] button[type='button']").should('be.visible');
                    cy.get('.btn.btn-danger').should('be.visible');
                    cy.get('.btn.btn-danger').click();
                    cy.wait('@delete_plan_sponsor', { requestTimeout: 10000 });
                    cy.get('@delete_plan_sponsor').then((xhr) => {
                        expect(xhr.response.statusCode).to.eq(delete_plan_sponsors.success);
                    })
                })
            })
        }

        //delete Plan Sponsor (unauthorized)
        if (access.view == true && access.delete == false) {
            it('Plan Sponsor delete and Get unauthorized Status', () => {
                //login
                cy.loginByForm(email, password)
                cy.visit('https://frx-wl-one.slashash.dev/plan-sponsor/all');
                //Verify element on page
                cy.get('.mb-0.me-auto').should('have.text', page_name);
                //click delete service button
                cy.fixture('AddPlanSponsor.json').then((data) => {
                    cy.intercept('POST', '**/api/plan-sponsors/delete').as('delete_plan_sponsor');
                    if (access.add == true) {
                        if(visible.view.team=='be.visible'){
                            cy.contains(data.team).parent('tr').find('div>[id="dropdownActions"]').click();
                            }else{
                                cy.contains('td', data.plan_sponsor_name).siblings().find('div>[id="dropdownActions"]').click({ force: true })
                            }
                        cy.get("div[class='dropdown-menu show'] a[class='dropdown-item text-danger']").click({ force: true });
                    } else {
                        cy.get('body > div:nth-child(12) > div:nth-child(2) > div:nth-child(2) > div:nth-child(13) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > table:nth-child(1) > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(9) > div:nth-child(1) > button:nth-child(1)').click();
                        cy.get("div[class='dropdown-menu show'] a[class='dropdown-item text-danger']").click({ force: true })
                    }
                    // Check all element visible in  delete Service Model
                    cy.get(".modal-title.text-danger").should('have.text', 'Delete Plan Sponsor');
                    cy.get("form[id='FormDelete'] button[type='button']").should('be.visible');
                    cy.get('.btn.btn-danger').should('be.visible');
                    cy.get('.btn.btn-danger').click();
                    cy.wait('@delete_plan_sponsor', { requestTimeout: 10000 });
                    cy.get('@delete_plan_sponsor').then((xhr) => {
                        expect(xhr.response.statusCode).to.eq(delete_plan_sponsors.unauthorized);
                    })
                })
            })
        }

    }
})