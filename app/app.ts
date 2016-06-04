import {ViewChild} from '@angular/core';
import {App, Platform, Nav, Events, MenuController} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {GetProjectsPage} from './pages/get-projects/get-projects';
import {ListPage} from './pages/list/list';
import {LoginPage} from './pages/login/login';
import {Tangentmicroservices} from './providers/tangentmicroservices/tangentmicroservices';

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

    rootPage: any = GetProjectsPage;
    pages: Array<{ title: string, component: any }>

    public loggedIn;
    // List of pages that can be navigated to from the left menu
    // the left menu only works after login
    // the login page disables the left menu
    // used for an example of ngFor and navigation
    appPages: PageObj[] = [
        { title: 'GetProjectsPage', component: GetProjectsPage, icon: 'calendar' },
        { title: 'List', component: ListPage, icon: 'contacts' }
    ];
    loggedInPages: PageObj[] = [
        { title: 'GetProjectsPage', component: GetProjectsPage, icon: 'calendar' },
        { title: 'Logout', component: ListPage, icon: 'log-out' }
    ];
    loggedOutPages: PageObj[] = [
        { title: 'GetProjectsPage', component: GetProjectsPage, icon: 'calendar' },
        { title: 'Login', component: LoginPage, icon: 'log-in' },
        //  { title: 'Signup', component: SignupPage, icon: 'person-add' }
    ];

    constructor(private platform: Platform, public events: Events, public tangentService: Tangentmicroservices, public menu: MenuController) {
        this.initializeApp();

        this.loggedIn = false;

        // decide which menu items should be hidden by current login status stored in local storage
        this.tangentService.hasLoggedIn().then((hasLoggedIn) => {
            this.enableMenu(hasLoggedIn === 'true');
        });

        this.listenToLoginEvents();
    }
    initializeApp() {
        this.platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            StatusBar.styleDefault();
        });
    }

    openPage(page: PageObj) {
        //  openPage(page) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        // the nav component was found using @ViewChild(Nav)
        // reset the nav to remove previous pages and only have this page
        // we wouldn't want the back button to show in this scenario
        if (page.index) {
            this.nav.setRoot(page.component);
        } else {
            this.nav.setRoot(page.component);
        }

        if (page.title === 'Logout') {
            // Give the menu time to close before changing to logged out
            setTimeout(() => {
                this.tangentService.logout();
            }, 1000);
        }
        // this.nav.setRoot(page.component);
    }

    listenToLoginEvents() {
        this.events.subscribe('user:login', () => {
            console.log('user has logged in');
            this.loggedIn = true;
            this.enableMenu('true');
        });

        this.events.subscribe('user:signup', () => {
            console.log('user has logged in');
            this.loggedIn = true;
        });

        this.events.subscribe('user:logout', () => {
            console.log('user has logged out');
            this.enableMenu('false');
            this.loggedIn = false;
        });
    }

    enableMenu(loggedIn) {
        this.menu.enable(loggedIn, 'loggedInMenu');
        this.menu.enable(!loggedIn, 'loggedOutMenu');
    }
}