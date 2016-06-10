import {Page, NavController, NavParams, ViewController, Toast, Loading} from 'ionic-angular';
import {ProjectsPage} from '../projects/projects';
import {UserData} from '../../providers/user-data';

@Page({
    templateUrl: 'build/pages/project-detail/project-detail.html',
    providers: [UserData]
})
export class ProjectDetailPage {
    submitted = false;
    project;
    tasks;
    loading = Loading.create({
        content: "Please wait...",
        dismissOnPageChange: true
    });

    constructor(
        public nav: NavController,
        private navParam: NavParams,
        private user: UserData,
        private viewCtrl: ViewController) {
        this.project = this.navParam.get('project');
    }

    onSaveInfo(form) {
        this.submitted = true;
        if (form.valid) {
            this.nav.present(this.loading);

            this.user.saveProject(this.project).then(data => {
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

    deleteProject(project) {
        this.dismiss({ 'type': 'delete', 'status': 200, 'data': this.project });
        console.log('success from details');
    }

    dismiss(data) {
        // using the injected ViewController this page
        // can "dismiss" itself and pass back data
        this.viewCtrl.dismiss(data);
    }
}