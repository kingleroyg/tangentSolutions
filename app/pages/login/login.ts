import {Page, NavController} from 'ionic-angular';

@Page({
    templateUrl: 'build/pages/login/login.html',
})
export class LoginPage {
    public login;
    public submitted;

    constructor(public nav: NavController) {
        this.login = {};
        this.submitted = false;
    }

    onLogin(form) {
        this.submitted = true;

        if (form.valid) {
            // this.userData.login();
            /// this.nav.push(TabsPage);
        }
    }
}