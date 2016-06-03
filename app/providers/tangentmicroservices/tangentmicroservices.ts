import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import {Storage, SqlStorage} from 'ionic-angular';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class Tangentmicroservices {
    //data: any = null;
    private storage;
    private data;
    public favoritesURL;

    constructor(public http: Http) {
        this.storage = new Storage(SqlStorage, { name: 'user' });

        this.favoritesURL = 'http://userservice.staging.tangentmicroservices.com/api-token-auth/';

        //this.getToken(username, password);
    }

    getToken(username, password) {
        let body = JSON.stringify({ "username": "admin", "password": "admin" });
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post('http://userservice.staging.tangentmicroservices.com/api-token-auth/', body, options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    handleError(error) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}