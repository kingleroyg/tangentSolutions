import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import {Storage, SqlStorage, Events} from 'ionic-angular';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class Tangentmicroservices {
    //data: any = null;

    private data;
    public favoritesURL;
    private storage;
    private projects;
    _favorites = [];
    HAS_LOGGED_IN = 'hasLoggedIn';

    constructor(public http: Http, private events: Events) {
        this.storage = new Storage(SqlStorage, { name: 'user' });

        this.favoritesURL = 'http://userservice.staging.tangentmicroservices.com/api-token-auth/';
        this.HAS_LOGGED_IN = 'hasLoggedIn';
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

    login(username, password) {
        this.storage.set(this.HAS_LOGGED_IN, true);
        let token: string = '71456dbd15de0c0b6d2b4b44e5a92ad94c6def97';

        this.events.publish('user:login');

        this.getToken(username, password).subscribe(data => {
            if (data['token']) {
                this.setUserDetails(username, password, token)
            }
        }
        );
    }

    getDetails() {
        let headers = new Headers();

        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', '71456dbd15de0c0b6d2b4b44e5a92ad94c6def97');

        if (this.projects) {
            // already loaded data
            return Promise.resolve(this.projects);
        }

        // don't have the data yet
        return new Promise(resolve => {
            // We're using Angular HTTP provider to request the data,
            // then on the response, it'll map the JSON data to a parsed JS object.
            // Next, we process the data and resolve the promise with the new data.
            this.http.get(`http://projectservice.staging.tangentmicroservices.com:80/api/v1/projects/`, { headers: headers })
                .map(res => res.json())
                .subscribe(data => {
                    // we've got back the raw data, now generate the core schedule data
                    // and save the data for later reference
                    this.data = data;
                    resolve(this.data);
                });
        });
    }

    setUsername(username) {
        this.storage.set('username', username);
    }

    setUserDetails(username, password, token) {
        console.log("Username: " + username + " password: " + password + " token: " + token);
        this.storage.set('username', username);
        this.storage.set('password', password);
        this.storage.set('token', token);
    }

    logout() {
        this.storage.remove(this.HAS_LOGGED_IN);
        this.storage.remove('username');
        this.storage.remove('password');
        this.storage.remove('token');

        this.events.publish('user:logout');
    }

    getUsername() {
        return this.storage.get('username').then((value) => {
            return value;
        });
    }

    //return promise
    hasLoggedIn() {
        return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
            return value;
        });
    }
}