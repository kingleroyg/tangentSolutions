import {Page, NavController, NavParams, Toast, Alert} from 'ionic-angular';
import {GetProjectsPage} from '../get-projects/get-projects';
import {Tangentmicroservices} from '../../providers/tangentmicroservices/tangentmicroservices';

@Page({
    templateUrl: 'build/pages/project-detail/project-detail.html',
})
export class ProjectDetailPage {
    project;
    tasks;

    constructor(public nav: NavController, private navParam: NavParams, private tangentService: Tangentmicroservices) {
        this.project = this.navParam.get('project');

        this.tasks = this.project.task_set;
    }

    onSaveInfo() {
        this.tangentService.updateProject(this.project)
            .subscribe(data => {
                this.nav.push(GetProjectsPage, { 'newPoject': data });
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
                                //this.nav.pop(GetProjectsPage);
                                this.nav.push(GetProjectsPage);
                                //var index = this.project.indexOf(project);
                                //this.project.splice(index, 1);
                            });
                        this.nav.present(toast);
                    }
                }
            ]
        });
        this.nav.present(alert);
    }
}