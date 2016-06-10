import {Component} from '@angular/core';
import {NavController, MenuController, Loading} from 'ionic-angular';
import {TabsPage} from '../tabs/tabs';
import {SignupPage} from '../signup/signup';
import {UserData} from '../../providers/user-data';

@Component({
    templateUrl: 'build/pages/login/login.html'
})
export class LoginPage {
    login: { username?: string, password?: string } = {};
    submitted = false;

    constructor(private nav: NavController, private userData: UserData, private menu: MenuController) {
    }

    onLogin(form) {
        let loading = Loading.create({
            content: "Authenticating...",
            dismissOnPageChange: true
        });

        this.submitted = true;

        if (form.valid) {
            this.nav.present(loading);
            this.userData.login(this.login.username.toLowerCase(), this.login.password.toLowerCase())
                .then(data => {
                    console.log(data);
                    if (data['status'] == 200) {
                        loading.dismiss();
                        console.log('pass');
                        this.nav.setRoot(TabsPage);
                        this.nav.push(TabsPage);
                    } else {
                        loading.dismiss();
                        this.login = {};
                        console.log('fail');
                    }
                });
        }
    }

    onSignup() {
        this.nav.push(SignupPage);
    }

    ionViewDidEnter() {
        // the root left menu should be disabled on the tutorial page
        this.menu.enable(false);
    }

    ionViewWillLeave() {
        // enable the root left menu when leaving the tutorial page
        this.menu.enable(true);
    }
}