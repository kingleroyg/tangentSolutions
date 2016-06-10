import {Component} from '@angular/core';
import {NavParams} from 'ionic-angular';
import {ProjectsPage} from '../projects/projects';
import {AboutPage} from '../about/about';

@Component({
    templateUrl: 'build/pages/tabs/tabs.html'
})
export class TabsPage {
    // set the root pages for each tab
    tab1Root: any = ProjectsPage;
    tab4Root: any = AboutPage;
    mySelectedIndex: number;

    constructor(navParams: NavParams) {
        this.mySelectedIndex = navParams.data.tabIndex || 0;
    }
}