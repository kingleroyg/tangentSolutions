import {Component, ViewChild} from '@angular/core';
import {App, Page, Modal, Alert, NavController, ItemSliding, List, Loading, Toast} from 'ionic-angular';
import {UserData} from '../../providers/user-data';
import {ProjectDetailPage} from '../project-detail/project-detail';
import {AddProjectPage} from '../add-project/add-project';

@Component({
    templateUrl: 'build/pages/projects/projects.html',
    providers: [UserData]
})
export class ProjectsPage {
    // the list is a child of the schedule page
    // @ViewChild('scheduleList') gets a reference to the list
    // with the variable #scheduleList, `read: List` tells it to return
    // the List and not a reference to the element
    @ViewChild('scheduleList', { read: List }) scheduleList: List;

    projects;
    loading = Loading.create({
        content: "Please wait...",
        dismissOnPageChange: true
    });

    constructor(
        private app: App,
        private nav: NavController,
        private user: UserData
    ) {
    }

    ionViewDidEnter() {
        this.app.setTitle('Project');
    }

    ngAfterViewInit() {
        this.updateProjects();
    }

    updateProjects() {
        this.nav.present(this.loading);
        this.user.getProjects().then(data => {
            this.loading.dismiss();
            if (data['status'] == 200) {
                this.loading.dismiss();
                this.projects = data['data'];
            } else {
                this.loading.dismiss();
                this.projects = {};
            }
        });
    }

    viewProject(project) {
        let modal = Modal.create(ProjectDetailPage, { project: project });
        this.nav.present(modal);
        let toast: any;

        modal.onDismiss((data: any[]) => {
            console.log(data);
            if (data) {
                if (data['type'] == 'save') {
                    if (data['status'] == 200) {
                        toast = Toast.create({
                            message: project.title + ' has been Saved',
                            duration: 3000
                        });
                    } else {
                        toast = Toast.create({
                            message: 'error saving ' + project.title,
                            duration: 3000
                        });
                    }
                    this.loading.dismiss();
                    this.nav.present(toast);
                } else if (data['type'] == 'delete') {
                    if (data['status'] == 200) {
                        this.deleteProject(project)
                    }
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
                        this.user.deleteProject(project).then(data => {
                            this.loading.dismiss();
                            var index = this.projects.indexOf(project);
                            this.projects.splice(index, 1);
                            console.log('success');
                        });

                        this.nav.present(toast);
                    }
                }
            ]
        });
        this.nav.present(alert);
    }

    refreshProject() {
        this.projects = {};
        this.updateProjects();
    }

    addProject() {
        let modal = Modal.create(AddProjectPage);
        this.nav.present(modal);
        let toast: any;
        modal.onDismiss((data: any[]) => {
            if (data) {
                if (data['status'] == 200) {
                    this.projects.push(data['data']);
                    toast = Toast.create({
                        message: data['data']['title'] + ' has been created',
                        duration: 3000
                    });
                } else {
                    toast = Toast.create({
                        message: 'error creating ' + data['data']['title'],
                        duration: 3000
                    });
                }
                this.loading.dismiss();
                this.nav.present(toast);
            }
        });
    }
}