import Login from "../PageObjects/Login.js";
import users from "../fixtures/RKFeeBenchmarkStudyRecap.json"

Cypress.on("uncaught:exception", (error) => {
    if (
        error.message.includes(
            "Timed out after waiting `5000ms` for your remote page to load.",
        )
    ) {
        return false;
    }
});

Cypress.on("fail", (error) => {
    if (
        error.message.includes(
            "Timed out after waiting `5000ms` for your remote page to load.",
        )
    ) {
        return false;
    }

    throw error;
});
Cypress.config("pageLoadTimeout", 5000);



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
        let add_rk_fee_benchmark = users[user].add_rk_fee_benchmark;
        let delete_rk_fee_benchmark = users[user].delete_rk_fee_benchmark;
        let filters = users[user].filters;

        //access
        it('Check RK Fee Benchmark Study Recap Page Access', () => {
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
                    page_access = xhr.response.body.Access.rk_fee_benchmark;
                    expect(access.view).to.equal(page_access.view);
                    expect(access.add).to.equal(page_access.add);
                    expect(access.edit).to.equal(page_access.edit);
                    expect(access.delete).to.equal(page_access.delete);
                    expect(access.export).to.equal(page_access.export);
                })
            })
        })

        //visible
        it('check RK Fee Benchmark Study Recap Page all CRUD visible', () => {
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
            cy.visit('https://frx-wl-one.slashash.dev/fee-rx/rk-fee-benchmark-study-recap/all')
            //Verify element on page
            cy.get('.mb-0.me-auto').should('have.text', page_name);

            //CURD opertaion
            cy.get('.table.table-striped.table-hover').should(visible.view);
            cy.get(".btn.btn-primary[data-bs-toggle='modal']").should(visible.add);
            cy.get('[title="Download Report"]').should(visible.export);
            cy.get('[data-bs-target="#modalDelete"]').should(visible.delete);
        })

        function formatDate(date) {
            var d = new Date(date),
                month = '' + d.toLocaleString('default', { month: 'short' }),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;

            return month + ' ' + day + ', ' + year;
        }
        //filter
        it('Filter function in  RK Fee Benchmark Study Recap page', () => {
            //login
            cy.loginByForm(email, password)
            cy.visit('https://frx-wl-one.slashash.dev/fee-rx/rk-fee-benchmark-study-recap/all');
            //Verify element on page
            cy.get('.mb-0.me-auto').should('have.text', page_name);
            //plan_sponsor
            filters.plan_sponsor.forEach((item) => {
                cy.get('#btnFilterToggle').click();
                cy.wait(500)
                cy.get('#fSelPlanSponsor').select(item);
                cy.get('.flex-column > .btn-secondary').click();
                cy.wait(500)
                cy.get('table>tbody>tr>td:nth-child(2)')
                    .each(($row, index, $rows) => {
                        cy.get($row).should('contain', item)
                    })
                cy.get('.flex-column > .d-flex > .btn').click();
            })

            //date
            filters.date.forEach((item) => {
                cy.get('#btnFilterToggle').click();
                cy.get('#fdtReportDate').type(item);
                cy.get('.flex-column > .btn-secondary').click();
                cy.wait(500)
                cy.get('table>tbody>tr>td:nth-child(4)')
                    .each(($row, index, $rows) => {

                        cy.get($row).should('contain', formatDate(item))
                    })
                cy.get('.flex-column > .d-flex > .btn').click();
            })
        })

        //Add(Generate Report) RK Fee Benchmark Study Recap (success)
        if (access.view == true && access.add == true) {
            it(' RK Fee Benchmark Study Recap Add and Get Success Status', () => {
                //login
                cy.loginByForm(email, password)
                cy.visit('https://frx-wl-one.slashash.dev/fee-rx/rk-fee-benchmark-study-recap/all');
                //Verify element on page
                cy.get('.mb-0.me-auto').should('have.text', page_name);
                //click add service button
                cy.get(".btn.btn-primary[data-bs-toggle='modal']").click({ force: true });
                // Check all element visible Add Service Model
                cy.fixture('ReportRKFeeBenchmark.json').then((data) => {
                    cy.intercept('POST', '**/api/reports/fee-rx/generate-rk-fee-benchmark-study-recap').as('generate_report');
                    cy.get('.modal-footer > .btn-primary').click();
                    //validation check
                    cy.get('#dmxValidatorErrorformGenerateReportplan_sponsor_id').should('have.text', 'This field is required.');
                    cy.get('#selPlanSponsor').select(data.plan_sponsor);
                    cy.wait(1000)
                    cy.get("div[class='row justify-content-center mb-3'] div[class='input-group']").should('be.visible');
                    cy.get(':nth-child(2) > .form-floating > .form-control').should('be.visible');
                    cy.get('#txtCurrentRK').should('be.visible');
                    cy.get('#numRKBaseFee').should('be.visible');
                    cy.get('#numRKPerHeadFee').should('be.visible');
                    cy.get('#numRKAssetBasedFee').should('be.visible');
                    cy.get('#selRKName').should('be.visible');
                    cy.get('#selRecommendation').should('be.visible');
                    cy.get('#repeatBenchmarkPoints > :nth-child(1) > .d-flex').should('be.visible');
                    cy.get('.modal-footer > .btn-primary').should('be.visible');
                    //add data in form
                    cy.get('#selRKName').select(data.recordkeeper);
                    cy.get('#selRKFeeSched').should('be.visible');
                    cy.get('#selRKFeeSched').select(data.recordkeeper_schedule);
                    cy.get('#cbAddTPAFee0').check();
                    cy.get('#selTPAFeeSched').should('be.visible');
                    cy.get('#selTPAFeeSched').select(data.tpa_schedule);
                    cy.get('#selRecommendation').select(data.recommendation)
                    cy.get('.modal-footer > .btn-primary').click();
                    cy.wait('@generate_report', { requestTimeout: 20000 });
                    cy.get('@generate_report').then((xhr) => {
                        expect(xhr.response.statusCode).to.eq(add_rk_fee_benchmark.success);
                    })
                })
            })
        }

        //Add(Generate Report) RK Fee Benchmark Study Recap (unauthorized)
        if (access.view == true && access.add == false) {
            it(' RK Fee Benchmark Study Recap Add and Get unauthorized Status', () => {
                //login
                cy.loginByForm(email, password)
                cy.visit('https://frx-wl-one.slashash.dev/fee-rx/rk-fee-benchmark-study-recap/all');
                //Verify element on page
                cy.get('.mb-0.me-auto').should('have.text', page_name);
                //click add service button
                cy.get(".btn.btn-primary[data-bs-toggle='modal']").click({ force: true });
                // Check all element visible Add Service Model
                cy.fixture('ReportRKFeeBenchmark.json').then((data) => {
                    cy.intercept('POST', '**/api/reports/fee-rx/generate-rk-fee-benchmark-study-recap').as('generate_report');
                    cy.get('.modal-footer > .btn-primary').click();
                    //validation check
                    cy.get('#dmxValidatorErrorformGenerateReportplan_sponsor_id').should('have.text', 'This field is required.');
                    cy.get('#selPlanSponsor').select(data.plan_sponsor);
                    cy.wait(1000)
                    cy.get("div[class='row justify-content-center mb-3'] div[class='input-group']").should('be.visible');
                    cy.get(':nth-child(2) > .form-floating > .form-control').should('be.visible');
                    cy.get('#txtCurrentRK').should('be.visible');
                    cy.get('#numRKBaseFee').should('be.visible');
                    cy.get('#numRKPerHeadFee').should('be.visible');
                    cy.get('#numRKAssetBasedFee').should('be.visible');
                    cy.get('#selRKName').should('be.visible');
                    cy.get('#selRecommendation').should('be.visible');
                    cy.get('#repeatBenchmarkPoints > :nth-child(1) > .d-flex').should('be.visible');
                    cy.get('.modal-footer > .btn-primary').should('be.visible');
                    //add data in form
                    cy.get('#selRKName').select(data.recordkeeper);
                    cy.get('#selRKFeeSched').should('be.visible');
                    cy.get('#selRKFeeSched').select(data.recordkeeper_schedule);
                    cy.get('#cbAddTPAFee0').check();
                    cy.get('#selTPAFeeSched').should('be.visible');
                    cy.get('#selTPAFeeSched').select(data.tpa_schedule);
                    cy.get('#selRecommendation').select(data.recommendation)
                    cy.get('.modal-footer > .btn-primary').click();
                    cy.wait('@generate_report', { requestTimeout: 20000 });
                    cy.get('@generate_report').then((xhr) => {
                        expect(xhr.response.statusCode).to.eq(add_rk_fee_benchmark.unauthorized);
                    })
                })
            })
        }

        //Export Report (RK Fee Benchmark Study Recap)
        if (access.view == true && access.export == true) {
            it('Export Report', () => {
                //login
                cy.loginByForm(email, password)
                cy.intercept('GET', '**/api/reports/list?limit=25&report_rule=rk%20fee%20benchmark&report_type_id=2&f_ps_id=&f_report_date=&offset=0').as('report_list');
                cy.visit('https://frx-wl-one.slashash.dev/fee-rx/rk-fee-benchmark-study-recap/all');
                //Verify element on page
                cy.get('.mb-0.me-auto').should('have.text', page_name);
                //Report list
                cy.wait('@report_list', { requestTimeout: 10000 });
                cy.get('@report_list').then((xhr) => {
                    expect(xhr.response.statusCode).to.eq(200);
                    //Get Report token
                    cy.request('GET', 'https://frx-wl-one.slashash.dev/api/testing/get-token?report_id='+xhr.response.body.qReports.data[0].report_id).then(
                        (response) => {
                            cy.visit('https://frx-wl-one.slashash.dev/'+response.body.qGetToken.report_path+'/'+response.body.qGetToken.r_token);
                            cy.fixture('ReportRKFeeBenchmark.json').then((data) => {
                                cy.wait(500)
                            // cy.get('.col.text-capitalize').should(data.plan_sponsor);
                            cy.get(':nth-child(9) > :nth-child(1)').should('contain',data.plan_assets);
                            cy.get(':nth-child(9) > :nth-child(3)').should('contain',data.plan_participants);
                            cy.get(':nth-child(2) > tr > :nth-child(2)').should('have.text',data.current_rk_fee);
                            cy.get(':nth-child(2) > tr > :nth-child(4)').should('have.text',data.current_fee);
                            cy.get('#repeatProviders > tr > :nth-child(2)').should('have.text',data.proposed_rk_fee);
                            cy.get('#repeatProviders > tr > :nth-child(4)').should('have.text',data.proposed_fee);
                            cy.get('#repeatProviders > tr > :nth-child(5)').should('have.text',data.savings);
                            })
                        }
                    )
                })

            })
        }

        //delete Generate Report) RK Fee Benchmark Study Recap (success)
        if (access.view == true && access.delete == true) {
            it('RK Fee Benchmark Study Recap delete and Get Success Status', () => {
                //login
                cy.loginByForm(email, password)
                cy.visit('https://frx-wl-one.slashash.dev/fee-rx/rk-fee-benchmark-study-recap/all');
                //Verify element on page
                cy.get('.mb-0.me-auto').should('have.text', page_name);
                //click delete service button
                cy.fixture('ReportRKFeeBenchmark.json').then((data) => {
                    cy.intercept('POST', '**/api/reports/delete').as('delete_report');
                    if (access.add == true) {
                        cy.contains(data.plan_sponsor).parent('tr').find('[data-bs-target="#modalDelete"]').click({ force: true });
                    } else {
                        cy.get('tbody tr:nth-child(1) td:nth-child(5) button:nth-child(2)').click({ force: true });
                    }
                    // Check all element visible in  delete Service Model
                    cy.get(".modal-title.text-danger").should('have.text', 'Delete Report');
                    cy.get("div[class='modal-dialog modal-dialog-centered'] button[aria-label='Close']").should('be.visible');
                    cy.get("div[class='modal-dialog modal-dialog-centered'] div[class='modal-footer'] button[type='button']").should('be.visible');
                    cy.get('.btn-danger').click();
                    cy.wait('@delete_report', { requestTimeout: 10000 });
                    cy.get('@delete_report').then((xhr) => {
                        expect(xhr.response.statusCode).to.eq(delete_rk_fee_benchmark.success);
                    })
                })
            })
        }

        //delete Generate Report) RK Fee Benchmark Study Recap (unauthorized)
        if (access.view == true && access.delete == false) {
            it('RK Fee Benchmark Study Recap delete and Get unauthorized Status', () => {
                //login
                cy.loginByForm(email, password)
                cy.visit('https://frx-wl-one.slashash.dev/fee-rx/rk-fee-benchmark-study-recap/all');
                //Verify element on page
                cy.get('.mb-0.me-auto').should('have.text', page_name);
                //click delete service button
                cy.fixture('ReportRKFeeBenchmark.json').then((data) => {
                    cy.intercept('POST', '**/api/reports/delete').as('delete_report');
                    if (access.add == true) {
                        cy.contains(data.plan_sponsor).parent('tr').find('[data-bs-target="#modalDelete"]').click({ force: true });
                    } else {
                        cy.get('tbody tr:nth-child(1) td:nth-child(5) button:nth-child(2)').click({ force: true });
                    }
                    // Check all element visible in  delete Service Model
                    cy.get(".modal-title.text-danger").should('have.text', 'Delete Report');
                    cy.get("div[class='modal-dialog modal-dialog-centered'] button[aria-label='Close']").should('be.visible');
                    cy.get("div[class='modal-dialog modal-dialog-centered'] div[class='modal-footer'] button[type='button']").should('be.visible');
                    cy.get('.btn-danger').click();
                    cy.wait('@delete_report', { requestTimeout: 10000 });
                    cy.get('@delete_report').then((xhr) => {
                        expect(xhr.response.statusCode).to.eq(delete_rk_fee_benchmark.unauthorized);
                    })
                })
            })
        }
    }
})