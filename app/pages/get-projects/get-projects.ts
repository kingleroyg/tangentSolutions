import {IonicApp, Page, Modal, Alert, NavController, ItemSliding, List} from 'ionic-angular';
import {Tangentmicroservices} from '../../providers/tangentmicroservices/tangentmicroservices';
import {ViewChild} from '@angular/core';

@Page({
    templateUrl: 'build/pages/get-projects/get-projects.html',
    providers: [Tangentmicroservices]
})
export class GetProjectsPage {
    //@ViewChild('scheduleList', { read: List }) scheduleList: List;

    dayIndex = 0;
    queryText = '';
    segment = 'all';
    excludeTracks = [];
    shownSessions = [];
    groups = [];

    public projects;

    constructor(private app: IonicApp, private nav: NavController, private tangentService: Tangentmicroservices) {
        this.tangentService.getDetails()
            .then(data => {
                this.projects = data;
                console.log(this.projects);
            });
    }
}