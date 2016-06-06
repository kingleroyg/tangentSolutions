import {Page, NavController, Alert} from 'ionic-angular';
import {Tangentmicroservices} from '../../providers/tangentmicroservices/tangentmicroservices';
import {LoginPage} from '../login/login';

@Page({
    templateUrl: 'build/pages/account/account.html',
})
export class AccountPage {
    username: string;

    constructor(private nav: NavController, private tangentServices: Tangentmicroservices) {
    }

    ngAfterViewInit() {
        this.getUsername();
    }

    updatePicture() {
        console.log('Clicked to update picture');
    }

    // Present an alert with the current username populated
    // clicking OK will update the username and display it
    // clicking Cancel will close the alert and do nothing
    changeUsername() {
        let alert = Alert.create({
            title: 'Change Username',
            buttons: [
                'Cancel'
            ]
        });
        alert.addInput({
            name: 'username',
            value: this.username,
            placeholder: 'username'
        });
        alert.addButton({
            text: 'Ok',
            handler: data => {
                //this.tangentServices.setUsername(data.username);
                this.getUsername();
            }
        });

        this.nav.present(alert);
    }

    getUsername() {
        this.tangentServices.getUsername().then((username) => {
            this.username = username;
        });
    }

    changePassword() {
        console.log('Clicked to change password');
    }

    logout() {
        this.tangentServices.logout();
        this.nav.setRoot(LoginPage);
    }
}