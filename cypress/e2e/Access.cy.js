import Login from "../PageObjects/Login.js";
import users from "../fixtures/Login.json";
import access from "../fixtures/Access.json";
describe('Fiduciary Testing', () => {
    //login
    for (let user in users) {
        let email = users[user].email;
        let password = users[user].password;
        let url = users[user].url;
        let statusCode = users[user].statusCode;
        let manage_users = users[user].manage_users;
        let preferences = users[user].preferences;
        for (let page in access) {
            let page_url = access[page].page_url;
            it('Fiduciary Login', () => {
                cy.intercept('POST', '**/api/users/login').as('login');
                cy.visit(url + '/login');
                const ln = new Login();
                ln.setEmail(email)
                ln.setLogin()
                ln.setPassword(password)
                ln.setCheckLogin()
                ln.setLogin()
                cy.wait('@login', { requestTimeout: 10000 });
                cy.get('@login').then((xhr) => {
                    expect(xhr.response.statusCode).to.eq(statusCode);
                })
                cy.get(page_url).should(preferences);
            })
        }
    }
})