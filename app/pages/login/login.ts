import {Page, NavController} from 'ionic-angular';
import {Tangentmicroservices} from '../../providers/tangentmicroservices/tangentmicroservices';
import {GetProjectsPage} from '../get-projects/get-projects';

@Page({
    templateUrl: 'build/pages/login/login.html',
    providers: [Tangentmicroservices]
})
export class LoginPage {
    public login;
    public submitted;

    constructor(public nav: NavController, public tangentServices: Tangentmicroservices) {
        this.login = {};
        this.submitted = false;
    }

    onLogin(form) {
        this.submitted = true;

        if (form.valid) {
            this.tangentServices.login(this.login.username, this.login.username);
            this.nav.pop(GetProjectsPage);
        }
    }
}