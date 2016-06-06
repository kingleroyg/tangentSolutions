import {Page, NavController, NavParams} from 'ionic-angular';
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
}