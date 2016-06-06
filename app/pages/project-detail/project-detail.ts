import {Page, NavController, NavParams} from 'ionic-angular';

@Page({
    templateUrl: 'build/pages/project-detail/project-detail.html',
})
export class ProjectDetailPage {
    project;
    tasks;

    constructor(public nav: NavController, private navParam: NavParams) {
        this.project = this.navParam.get('project');

        this.tasks = this.project.task_set;
    }

    onSaveInfo() {
    }
}