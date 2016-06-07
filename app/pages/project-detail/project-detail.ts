import {Page, NavController, NavParams, ViewController, Toast, Alert} from 'ionic-angular';
import {GetProjectsPage} from '../get-projects/get-projects';
import {Tangentmicroservices} from '../../providers/tangentmicroservices/tangentmicroservices';

@Page({
    templateUrl: 'build/pages/project-detail/project-detail.html',
})
export class ProjectDetailPage {
    project;
    tasks;

    constructor(
        public nav: NavController,
        private navParam: NavParams,
        private tangentService: Tangentmicroservices,
        private viewCtrl: ViewController) {
        this.project = this.navParam.get('project');
    }

    onSaveInfo() {
        this.tangentService.updateProject(this.project)
            .subscribe(data => {
                this.dismiss({ 'save': data });
            });
    }

    deleteProject(project) {
        this.dismiss({ 'delete': project });
    }

    dismiss(data) {
        // using the injected ViewController this page
        // can "dismiss" itself and pass back data
        this.viewCtrl.dismiss(data);
    }
}