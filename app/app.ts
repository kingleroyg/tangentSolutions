import {ViewChild} from '@angular/core';
import {App, Events, Platform, Nav, MenuController, Modal, Loading} from 'ionic-angular';
import {StatusBar, Splashscreen, Network, Connection} from 'ionic-native';
import {AccountPage} from './pages/account/account';
import {LoginPage} from './pages/login/login';
import {SignupPage} from './pages/signup/signup';
import {TutorialPage} from './pages/tutorial/tutorial';
import {GetProjectsPage} from  './pages/get-projects/get-projects';
import {Tangentmicroservices} from './providers/tangentmicroservices/tangentmicroservices';
import {AboutPage} from './pages/about/about';

interface PageObj {
    title: string;
    component: any;
    icon: string;
    index?: number;
}

@App({
    templateUrl: 'build/app.html',
    providers: [[Events], [Tangentmicroservices]],
    config: {} // http://ionicframework.com/docs/v2/api/config/Config/
})
class MyApp {
    @ViewChild(Nav) nav: Nav;

    // List of pages that can be navigated to from the left menu
    // the left menu only works after login
    // the login page disables the left menu
    // used for an example of ngFor and navigation
    appPages: PageObj[] = [
        { title: 'About', component: AboutPage, icon: 'help' }

    ];
    loggedInPages: PageObj[] = [
        { title: 'Projects', component: GetProjectsPage, icon: 'calendar' },
        { title: 'Account', component: AccountPage, icon: 'person' },
        { title: 'Logout', component: LoginPage, icon: 'log-out' }
    ];

    loggedOutPages: PageObj[] = [
        { title: 'Login', component: LoginPage, icon: 'log-in' }
        //{ title: 'Signup', component: SignupPage, icon: 'person-add' }
    ];

    rootPage: any = GetProjectsPage;
    //rootPage: any = TutorialPage;

    constructor(private platform: Platform, private events: Events, private tangentService: Tangentmicroservices, private menu: MenuController) {
        // Call any initial plugins when ready
        platform.ready().then(() => {
            StatusBar.styleDefault();
            Splashscreen.hide();
        });

        let loading = Loading.create({
            content: `
                     <div class="custom-spinner-container">
                     <div class="custom-spinner-box"></div>
                     </div>
                     <p>This application requires a internet connect.</p>`,
            duration: 90000
        });
        // watch network for a disconnect
        let disconnectSubscription = Network.onDisconnect().subscribe(() => {
            this.nav.present(loading);
            console.log('network was disconnected :-( ')
        });

        // watch network for a connection
        let connectSubscription = Network.onConnect().subscribe(() => {
            loading.onDismiss(() => {
                console.log('network connected!');
            });
        });

        // decide which menu items should be hidden by current login status stored in local storage
        this.tangentService.hasLoggedIn().then((hasLoggedIn) => {
            // this.enableMenu(hasLoggedIn === 'true');
            if (hasLoggedIn === 'true') {
                this.enableMenu('true');
            } else {
                this.enableMenu('false');

                let modal = Modal.create(LoginPage);
                this.nav.present(modal);

                //this.nav.push(LoginPage);
            }
        });

        this.listenToLoginEvents();
    }

    openPage(page: PageObj) {
        // the nav component was found using @ViewChild(Nav)
        // reset the nav to remove previous pages and only have this page
        // we wouldn't want the back button to show in this scenario
        if (page.index) {
            this.nav.setRoot(GetProjectsPage);
        } else {
            this.nav.setRoot(page.component);
        }

        if (page.title === 'Logout') {
            // Give the menu time to close before changing to logged out
            setTimeout(() => {
                this.tangentService.logout();
            }, 1000);
        }
    }

    listenToLoginEvents() {
        this.events.subscribe('user:login', () => {
            this.enableMenu(true);
        });

        this.events.subscribe('user:signup', () => {
            this.enableMenu(true);
        });

        this.events.subscribe('user:logout', () => {
            this.enableMenu(false);
            this.nav.push(LoginPage);
        });
    }

    enableMenu(loggedIn) {
        this.menu.enable(loggedIn, 'loggedInMenu');
        this.menu.enable(!loggedIn, 'loggedOutMenu');
    }
}