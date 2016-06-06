import {IonicApp, Page, Modal, Alert, NavController, ItemSliding, List, NavParams} from 'ionic-angular';
import {Tangentmicroservices} from '../../providers/tangentmicroservices/tangentmicroservices';
import {ViewChild} from '@angular/core';
import {ProjectDetailPage} from '../project-detail/project-detail';
import {AddProjectPage} from '../add-project/add-project';

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

    constructor(private app: IonicApp, private nav: NavController, private tangentService: Tangentmicroservices, private navParams: NavParams) {
        this.tangentService.getDetails()
            .then(data => {
                this.projects = data;
            });
    }

    viewProject(project) {
        this.nav.push(ProjectDetailPage, { project: project });
    }

    deleteProject(project) {
        this.tangentService.deleteProject(project)
            .subscribe(data => {
                //this.nav.push(GetProjectsPage, { 'newPoject': data });
            });
    }

    addProject() {
        this.nav.push(AddProjectPage);
    }
}