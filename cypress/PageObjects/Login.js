class Login{
    txtEmail="#txtEmail";
    txtPassword="#txtPass";
    checkRemember="#cbRemember";
    txtLogin="button[type='submit']";

    setEmail(email) {
        cy.get(this.txtEmail).type(email);
    }
    setPassword(password) {
        cy.get(this.txtPassword).type(password);
    }
    setCheckLogin() {
        cy.get(this.checkRemember).check();
    }
    setLogin() {
        cy.get(this.txtLogin).click();
    }
}

export default Login;