import {Page} from 'ionic-angular';
import {Tangentmicroservices} from '../../providers/tangentmicroservices/tangentmicroservices';

@Page({
    templateUrl: 'build/pages/get-projects/get-projects.html',
    providers: [Tangentmicroservices]
})
export class GetProjectsPage {
    public projects;

    constructor(public tangentServices: Tangentmicroservices) {
        /*
        this.tangentServices.getToken('admin', 'admin').subscribe(data => {
            console.log(data);
        }
        );
        */
    }
}