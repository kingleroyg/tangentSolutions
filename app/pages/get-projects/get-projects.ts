import {IonicApp, Page, Modal, Toast, Alert, NavController, ItemSliding, List, NavParams, Loading} from 'ionic-angular';
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

    public projects;

    constructor(private app: IonicApp, private nav: NavController, private tangentService: Tangentmicroservices, private navParams: NavParams) {
        let loading = Loading.create({
            content: "Please wait...",
            duration: 9000,
            dismissOnPageChange: false
        });

        this.nav.present(loading);
        this.tangentService.getDetails()
            .then(data => {
                loading.dismiss();
                this.projects = data;
            });
    }

    viewProject(project) {
        let modal = Modal.create(ProjectDetailPage, { project: project });
        this.nav.present(modal);

        modal.onDismiss((data: any[]) => {
            if (data) {
                if (data['save']) {
                    //this.excludeTracks = data;
                    //this.updateSchedule();
                } else if (data['delete']) {
                    this.deleteProject(data['delete']);
                }
            }
        });
    }

    deleteProject(project) {
        let alert = Alert.create({
            title: 'Confirm Delete',
            message: 'Do you want to delete ' + project.title + ' ?.',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        //console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Delete',
                    handler: () => {
                        let toast = Toast.create({
                            message: project.title + ' has been Deleted',
                            duration: 3000
                        });

                        this.tangentService.deleteProject(project)
                            .subscribe(data => {
                                var index = this.projects.indexOf(project);
                                this.projects.splice(index, 1);
                            });
                        this.nav.present(toast);
                    }
                }
            ]
        });
        this.nav.present(alert);
    }

    addProject() {
        let modal = Modal.create(AddProjectPage);
        this.nav.present(modal);

        modal.onDismiss((data: any[]) => {
            if (data) {
                if (data['add']) {
                    let loading = Loading.create({
                        content: "Please wait...",

                        dismissOnPageChange: false
                    });
                    this.nav.present(loading);

                    this.tangentService.createProject(data['add'])
                        .subscribe(res => {
                            console.log(data['add']);
                            this.projects.push(data['add']);
                            loading.dismiss();
                            //this.nav.push(GetProjectsPage, { 'newPoject': data });
                        });
                }
            }
        });
    }

    refresh() {
        this.projects = [];

        let loading = Loading.create({
            content: "Please wait...",
            duration: 9000,
            dismissOnPageChange: false
        });

        this.nav.present(loading);
        this.tangentService.getDetails()
            .then(data => {
                loading.dismiss();
                this.projects = data;
            });
    }
}