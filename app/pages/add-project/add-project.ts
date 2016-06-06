import {Page, NavController, Loading} from 'ionic-angular';
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

    constructor(public nav: NavController, private tangentService: Tangentmicroservices) {
        this.project.is_billable = false;
        this.project.is_active = false;
        this.project.start_date = '1778-09-09';
    }

    onCreateProject(form) {
        this.submitted = true;

        let loading = Loading.create({
            content: "Please wait...",
            duration: 9000,
            dismissOnPageChange: false
        });
        this.nav.present(loading);

        this.tangentService.createProject(this.project)
            .subscribe(data => {
                loading.dismiss();
                this.nav.push(GetProjectsPage, { 'newPoject': data });
            });
    }
}