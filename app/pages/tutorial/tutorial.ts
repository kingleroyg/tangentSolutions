import {Component} from '@angular/core';
import {NavController, MenuController, Events} from 'ionic-angular';
import {TabsPage} from '../tabs/tabs';
import {SignupPage} from '../signup/signup';
import {LoginPage} from '../login/login';
import {UserData} from '../../providers/user-data';

interface Slide {
    title: string;
    description: string;
    image: string;
}

@Component({
    templateUrl: 'build/pages/tutorial/tutorial.html'
})
export class TutorialPage {
    slides: Slide[];
    showSkip = true;

    constructor(private nav: NavController, private menu: MenuController, private userData: UserData, private events: Events) {
        this.userData.hasLoggedIn().then((hasLoggedIn) => {
            console.log(hasLoggedIn);
            if (hasLoggedIn === 'true') {
                this.events.publish('user:login');
                this.nav.setRoot(TabsPage);
                this.nav.push(TabsPage);
            }
        });

        this.slides = [
            {
                title: 'Welcome',
                description: 'The <b>Tangent Solution </b> interview assignment of a hybrid application .',
                image: 'img/ica-slidebox-img-1.png',
            },
            {
                title: 'What came first ?',
                description: '<b>Framework</b> . This application was built using Ionic2, Angular2 and Typescript.',
                image: 'img/ica-slidebox-img-2.png',
            },
            {
                title: 'Im not picky',
                description: 'This application should be compatible for <b>ANDROID</b> , <b>IOS</b> and <b>WINDOWS</b>.',
                image: 'img/ica-slidebox-img-3.png',
            }
        ];
    }

    startApp() {
        this.nav.setRoot(LoginPage);
        this.nav.push(LoginPage);
    }

    onSlideChangeStart(slider) {
        this.showSkip = !slider.isEnd;
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