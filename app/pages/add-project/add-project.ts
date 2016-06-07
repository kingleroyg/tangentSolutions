import {Page, NavController, Loading, ViewController} from 'ionic-angular';
import {Tangentmicroservices} from '../../providers/tangentmicroservices/tangentmicroservices';
import {GetProjectsPage} from '../get-projects/get-projects';

@Page({
    templateUrl: 'build/pages/add-project/add-project.html',
    providers: [Tangentmicroservices]
})
export class AddProjectPage {
    project: {
        title?: string,
        description?: string,
        start_date?: string,
        end_date?: string,
        is_billable?: boolean,
        is_active?: boolean
    } = {};
    submitted = false;

    constructor(
        public nav: NavController,
        private tangentService: Tangentmicroservices,
        private viewCtrl: ViewController) {
        this.project.is_billable = false;
        this.project.is_active = false;
        this.project.start_date = '2016-06-06';
    }

    onCreateProject(form) {
        this.submitted = true;
        if (form.valid) {
            this.dismiss({ 'add': this.project });
        }
    }

    dismiss(data) {
        // using the injected ViewController this page
        // can "dismiss" itself and pass back data
        this.viewCtrl.dismiss(data);
    }
}