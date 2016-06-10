import {Component, ViewChild, enableProdMode} from '@angular/core';
import {ionicBootstrap, Events, Platform, Nav, MenuController, Loading} from 'ionic-angular';
import {StatusBar, Splashscreen, Network, Connection} from 'ionic-native';
import {UserData} from './providers/user-data';
import {AccountPage} from './pages/account/account';
import {TabsPage} from './pages/tabs/tabs';
import {LoginPage} from './pages/login/login';
import {SignupPage} from './pages/signup/signup';
import {TutorialPage} from './pages/tutorial/tutorial';

enableProdMode();

interface PageObj {
    title: string;
    component: any;
    icon: string;
    index?: number;
}

@Component({
    templateUrl: 'build/app.html'
})
class ConferenceApp {
    // the root nav is a child of the root app component
    // @ViewChild(Nav) gets a reference to the app's root nav
    @ViewChild(Nav) nav: Nav;

    // List of pages that can be navigated to from the left menu
    // the left menu only works after login
    // the login page disables the left menu
    appPages: PageObj[] = [

    ];
    loggedInPages: PageObj[] = [
        { title: 'Account', component: AccountPage, icon: 'person' },
        { title: 'Logout', component: TabsPage, icon: 'log-out' }
    ];
    loggedOutPages: PageObj[] = [
        { title: 'Login', component: LoginPage, icon: 'log-in' },
        // { title: 'Signup', component: SignupPage, icon: 'person-add' }
    ];
    rootPage: any = TutorialPage;

    constructor(
        private events: Events,
        private userData: UserData,
        private menu: MenuController,
        platform: Platform
    ) {
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
        this.userData.hasLoggedIn().then((hasLoggedIn) => {
            this.enableMenu(hasLoggedIn === 'true');
        });

        this.listenToLoginEvents();
    }

    openPage(page: PageObj) {
        // the nav component was found using @ViewChild(Nav)
        // reset the nav to remove previous pages and only have this page
        // we wouldn't want the back button to show in this scenario
        if (page.index) {
            this.nav.setRoot(page.component, { tabIndex: page.index });
        } else {
            this.nav.setRoot(page.component);
        }

        if (page.title === 'Logout') {
            // Give the menu time to close before changing to logged out
            setTimeout(() => {
                this.userData.logout();
                this.nav.setRoot(TutorialPage);
                this.nav.push(TutorialPage);
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
        });
    }

    enableMenu(loggedIn) {
        this.menu.enable(loggedIn, 'loggedInMenu');
        this.menu.enable(!loggedIn, 'loggedOutMenu');
    }
}

ionicBootstrap(ConferenceApp, [UserData], {
    tabbarPlacement: 'bottom'
});