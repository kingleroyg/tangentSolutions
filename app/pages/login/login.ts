import {Page, NavController} from 'ionic-angular';
import {SignupPage} from '../signup/signup';
import {Tangentmicroservices} from '../../providers/tangentmicroservices/tangentmicroservices';
import {SchedulePage} from '../schedule/schedule';

@Page({
    templateUrl: 'build/pages/login/login.html'
})
export class LoginPage {
    login: { username?: string, password?: string } = {};
    submitted = false;

    constructor(private nav: NavController, private tangentServices: Tangentmicroservices) { }

    onLogin(form) {
        this.submitted = true;

        if (form.valid) {
            this.tangentServices.login(this.login.username);
            this.nav.push(SchedulePage);
        }
    }

    onSignup() {
        this.nav.push(SignupPage);
    }
}