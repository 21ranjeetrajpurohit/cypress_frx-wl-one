import Login from "../PageObjects/Login.js";
import users from "../fixtures/PlanCostBenchmark.json"

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
        let filters = users[user].filters;
        let add_plan_cost_benchmark = users[user].add_plan_cost_benchmark;
        let delete_plan_cost_benchmark = users[user].delete_plan_cost_benchmark;


        //access
        it('Check Plan Cost Benchmark Page Access', () => {
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
                    page_access = xhr.response.body.Access.plan_cost_benchmark;
                    expect(access.view).to.equal(page_access.view);
                    expect(access.add).to.equal(page_access.add);
                    expect(access.edit).to.equal(page_access.edit);
                    expect(access.delete).to.equal(page_access.delete);
                    expect(access.export).to.equal(page_access.export);
                })
            })
        })

        //visible
        it('check Plan Cost Benchmark Page all CRUD visible', () => {
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
            cy.visit('https://frx-wl-one.slashash.dev/fee-rx/plan-cost-benchmark/all')
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

            return day + ' ' + month + ' ' + year;
        }
        //filter
        it('Filter function in  Plan Cost Benchmark page', () => {
            //login
            cy.loginByForm(email, password)
            cy.visit('https://frx-wl-one.slashash.dev/fee-rx/plan-cost-benchmark/all');
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

        //Add(Generate Report) Plan Cost Benchmark (success)
        if (access.view == true && access.add == true) {
            it('Plan Cost Benchmark Add and Get Success Status', () => {
                //login
                cy.loginByForm(email, password)
                cy.visit('https://frx-wl-one.slashash.dev/fee-rx/plan-cost-benchmark/all');
                //Verify element on page
                cy.get('.mb-0.me-auto').should('have.text', page_name);
                //click add service button
                cy.get(".btn.btn-primary[data-bs-toggle='modal']").click({ force: true });
                // Check all element visible Add Service Model
                cy.fixture('ReportPlanCostBenchmark.json').then((data) => {
                    cy.intercept('POST', '**/api/reports/fee-rx/generate-plan-cost-benchmark').as('generate_report');
                    cy.get('#selPlanSponsor').should('be.visible');
                    cy.get('#txtReportDate').should('be.visible');
                    cy.get('.modal-footer > .btn-primary').click();
                    //validation check
                    cy.get('#dmxValidatorErrorformGenerateReportplan_sponsor_id').should('have.text', 'This field is required.');
                    cy.get('#dmxValidatorErrorformGenerateReportreport_date').should('have.text', 'This field is required.');
                    cy.get('#selPlanSponsor').select(data.plan_sponsor);
                    cy.wait(1000)
                    //add data in form
                    cy.get('#txtReportDate').type(data.report_date);
                    cy.get('[type="checkbox"][name="show_charts[]"]').check({force: true})
                    cy.get('.modal-footer > .btn-primary').click();
                    cy.wait('@generate_report', { requestTimeout: 20000 });
                    cy.get('@generate_report').then((xhr) => {
                        expect(xhr.response.statusCode).to.eq(add_plan_cost_benchmark.success);
                    })
                })
            })
        }

        //Add(Generate Report)  Plan Cost Benchmark (unauthorized)
        if (access.view == true && access.add == false) {
            it('Plan Cost Benchmark Add and Get unauthorized Status', () => {
                //login
                cy.loginByForm(email, password)
                cy.visit('https://frx-wl-one.slashash.dev/fee-rx/plan-cost-benchmark/all');
                //Verify element on page
                cy.get('.mb-0.me-auto').should('have.text', page_name);
                //click add service button
                cy.get(".btn.btn-primary[data-bs-toggle='modal']").click({ force: true });
                // Check all element visible Add Service Model
                cy.fixture('ReportPlanCostBenchmark.json').then((data) => {
                    cy.intercept('POST', '**/api/reports/fee-rx/generate-plan-cost-benchmark').as('generate_report');
                    cy.get('#selPlanSponsor').should('be.visible');
                    cy.get('#txtReportDate').should('be.visible');
                    cy.get('.modal-footer > .btn-primary').click();
                    //validation check
                    cy.get('#dmxValidatorErrorformGenerateReportplan_sponsor_id').should('have.text', 'This field is required.');
                    cy.get('#dmxValidatorErrorformGenerateReportreport_date').should('have.text', 'This field is required.');
                    cy.get('#selPlanSponsor').select(data.plan_sponsor);
                    cy.wait(1000)
                    //add data in form
                    cy.get('#txtReportDate').type(data.report_date);
                    cy.get('[type="checkbox"][name="show_charts[]"]').check({force: true})
                    cy.get('.modal-footer > .btn-primary').click();
                    cy.wait('@generate_report', { requestTimeout: 20000 });
                    cy.get('@generate_report').then((xhr) => {
                        expect(xhr.response.statusCode).to.eq(add_plan_cost_benchmark.unauthorized);
                    })
                })
            })
        }

        //Export Report (Plan Cost Benchmark)
        if (access.view == true && access.export == false) {
            it('Export Report', () => {
                //login
                cy.loginByForm(email, password)
                cy.intercept('GET', '**/api/reports/list?limit=25&report_rule=historical%20cost%20trend&report_type_id=8&f_ps_id=&f_report_date=&offset=0').as('report_list');
                cy.visit('https://frx-wl-one.slashash.dev/fee-rx/plan-cost-benchmark/all');
                //Verify element on page
                cy.get('.mb-0.me-auto').should('have.text', page_name);
                //Report list
                cy.wait('@report_list', { requestTimeout: 10000 });
                cy.get('@report_list').then((xhr) => {
                    expect(xhr.response.statusCode).to.eq(200);
                    //Get Report token
                    cy.request('GET', 'https://frx-wl-one.slashash.dev/api/testing/get-token?report_id=' + xhr.response.body.qReports.data[0].report_id).then(
                        (response) => {
                            cy.visit('https://frx-wl-one.slashash.dev/' + response.body.qGetToken.report_path + '/' + response.body.qGetToken.r_token);
                            cy.fixture('ReportPlanCostBenchmark.json').then((data) => {
                                cy.wait(500)
                                cy.get('.mx-auto > .fw-bolder').should('have.text','Plan Cost Benchmarking');

                                cy.get('#repeatAllCosts > :nth-child(2) > .flex-column > :nth-child(2) > :nth-child(1)').should('have.text',data.total_costs);
                                cy.get('#repeatAllCosts > :nth-child(2) > .flex-column > :nth-child(2) > :nth-child(2)').should('have.text',data.total_costs_percent);

                                cy.get(':nth-child(2) > .flex-column > :nth-child(4) > :nth-child(1)').should('have.text',data.investment_costs);
                                cy.get(':nth-child(2) > .flex-column > :nth-child(4) > :nth-child(2)').should('have.text',data.investment_costs_percent);

                                cy.get(':nth-child(2) > .flex-column > :nth-child(6) > :nth-child(1)').should('have.text',data.advisory_costs);
                                cy.get(':nth-child(2) > .flex-column > :nth-child(6) > :nth-child(2)').should('have.text',data.advisory_costs_percent);

                                cy.get(':nth-child(2) > .flex-column > :nth-child(8) > :nth-child(1)').should('have.text',data.recordkeeping_costs);
                                cy.get(':nth-child(2) > .flex-column > :nth-child(8) > :nth-child(2)').should('have.text',data.recordkeeping_costs_percent);

                                cy.get(':nth-child(2) > .flex-column > :nth-child(10)').should('have.text',data.per_participant_cost);
                            })
                        }
                    )
                })

            })
        }

        //delete Generate Report Plan Cost Benchmark (success)
        if (access.view == true && access.delete == true) {
            it('Plan Cost Benchmark delete and Get Success Status', () => {
                //login
                cy.loginByForm(email, password)
                cy.visit('https://frx-wl-one.slashash.dev/fee-rx/plan-cost-benchmark/all');
                //Verify element on page
                cy.get('.mb-0.me-auto').should('have.text', page_name);
                //click delete service button
                cy.fixture('ReportPlanCostBenchmark.json').then((data) => {
                    cy.intercept('POST', '**/api/reports/delete').as('delete_report');
                    if (access.add == true) {
                        cy.contains(data.plan_sponsor).parent('tr').find('[data-bs-target="#modalDelete"]').click({ force: true });
                    } else {
                        cy.get('tbody tr:nth-child(1) td:nth-child(5) button:nth-child(2)').click({ force: true });
                    }
                    // Check all element visible in  delete Service Model
                    cy.get(".modal-title.text-danger").should('have.text', 'Delete Report');
                    cy.get("div[class='modal-dialog modal-dialog-centered modal-dialog-scrollable'] button[aria-label='Close']").should('be.visible');
                    cy.get("button[class='btn btn-outline-secondary']").should('be.visible');
                    cy.get('.btn-danger').click();
                    cy.wait('@delete_report', { requestTimeout: 10000 });
                    cy.get('@delete_report').then((xhr) => {
                        expect(xhr.response.statusCode).to.eq(delete_plan_cost_benchmark.success);
                    })
                })
            })
        }

        //delete Generate Report Plan Cost Benchmark (unauthorized)
        if (access.view == true && access.delete == false) {
            it('Plan Cost Benchmark delete and Get unauthorized Status', () => {
                //login
                cy.loginByForm(email, password)
                cy.visit('https://frx-wl-one.slashash.dev/fee-rx/plan-cost-benchmark/all');
                //Verify element on page
                cy.get('.mb-0.me-auto').should('have.text', page_name);
                //click delete service button
                cy.fixture('ReportPlanCostBenchmark.json').then((data) => {
                    cy.intercept('POST', '**/api/reports/delete').as('delete_report');
                    if (access.add == true) {
                        cy.contains(data.plan_sponsor).parent('tr').find('[data-bs-target="#modalDelete"]').click({ force: true });
                    } else {
                        cy.get('tbody tr:nth-child(1) td:nth-child(5) button:nth-child(2)').click({ force: true });
                    }
                    // Check all element visible in  delete Service Model
                    cy.get(".modal-title.text-danger").should('have.text', 'Delete Report');
                    cy.get("div[class='modal-dialog modal-dialog-centered modal-dialog-scrollable'] button[aria-label='Close']").should('be.visible');
                    cy.get("button[class='btn btn-outline-secondary']").should('be.visible');
                    cy.get('.btn-danger').click();
                    cy.wait('@delete_report', { requestTimeout: 10000 });
                    cy.get('@delete_report').then((xhr) => {
                        expect(xhr.response.statusCode).to.eq(delete_plan_cost_benchmark.unauthorized);
                    })
                })
            })
        }
    }
})