import {Page, NavController, NavParams, ViewController, Toast, Loading} from 'ionic-angular';
import {ProjectsPage} from '../projects/projects';
import {UserData} from '../../providers/user-data';
;
@Page({
    templateUrl: 'build/pages/add-project/add-project.html',
    providers: [UserData]
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
    loading = Loading.create({
        content: "Please wait...",
        dismissOnPageChange: true
    });

    constructor(
        public nav: NavController,
        private user: UserData,
        private viewCtrl: ViewController) {
        this.project.is_billable = false;
        this.project.is_active = false;
        this.project.start_date = '2016-07-06';
    }

    onCreateProject(form) {
        this.submitted = true;
        if (form.valid) {
            this.nav.present(this.loading);

            this.user.createProject(this.project).then(data => {
                if (data['status'] == 200) {
                    this.dismiss({ 'type': 'save', 'status': 200, 'data': this.project });
                    console.log('success');
                } else {
                    this.loading.dismiss();
                    console.log('fail');
                    this.dismiss({ 'type': 'save', 'status': 400, 'data': this.project });
                }
            });
        }
    }

    dismiss(data) {
        // using the injected ViewController this page
        // can "dismiss" itself and pass back data
        this.viewCtrl.dismiss(data);
    }
}