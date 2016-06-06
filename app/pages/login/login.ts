import {Page, NavController} from 'ionic-angular';
import {SignupPage} from '../signup/signup';
import {Tangentmicroservices} from '../../providers/tangentmicroservices/tangentmicroservices';
import {GetProjectsPage} from '../get-projects/get-projects';

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
            this.tangentServices.login(this.login.username, this.login.password);
            this.nav.push(GetProjectsPage);
        }
    }

    onSignup() {
        this.nav.push(SignupPage);
    }
}