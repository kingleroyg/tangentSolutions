import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import {Storage, SqlStorage, Events} from 'ionic-angular';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class Tangentmicroservices {
    private data;
    private storage;
    private projects;
    _favorites = [];
    HAS_LOGGED_IN = 'hasLoggedIn';

    constructor(public http: Http, private events: Events) {
        this.storage = new Storage(SqlStorage, { name: 'user' });

        this.HAS_LOGGED_IN = 'hasLoggedIn';
    }
    /*
    *name: GetToken
    *description: Gets a user token
    *params: Username , password
    */
    getToken(username, password) {
        let body = JSON.stringify({ "username": username, "password": password });
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post('http://userservice.staging.tangentmicroservices.com/api-token-auth/', body, options)
            .map(res => res.json())
            .catch(this.handleError);
    }
    /*
    *name: create Project
    *description: Creates a new Project
    *params: project: Object
    */
    createProject(project) {
        let token = this.getUsertoken();

        let body = JSON.stringify(project);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        headers.append('Authorization', '71456dbd15de0c0b6d2b4b44e5a92ad94c6def97');

        let options = new RequestOptions({ headers: headers });
        return this.http.post('http://projectservice.staging.tangentmicroservices.com:80/api/v1/projects/', body, options)
            .map(res => res.json())
            .catch(this.handleError);
    }
    /*
    *name: delete Project
    *description: Deletes a project
    *params: project: Object
    */
    deleteProject(project) {
        let token = this.getUsertoken();
        let body = JSON.stringify(project);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        headers.append('Authorization', '71456dbd15de0c0b6d2b4b44e5a92ad94c6def97');
        console.log('PK');
        console.log(project['pk']);
        let options = new RequestOptions({ headers: headers });
        return this.http.delete('http://projectservice.staging.tangentmicroservices.com:80/api/v1/projects/' + project['pk'] + '/', options);
    }
    /*
    *name: update Project
    *description: Updates a user project
    *params: project: Object
    */
    updateProject(project) {
        let token = this.getUsertoken();
        let body = JSON.stringify(project);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        headers.append('Authorization', '71456dbd15de0c0b6d2b4b44e5a92ad94c6def97');

        let options = new RequestOptions({ headers: headers });
        return this.http.put('http://projectservice.staging.tangentmicroservices.com:80/api/v1/projects/' + project['pk'] + '/', body, options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    handleError(error) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }

    /*
    *name: Login
    *description: Logs user into the application
    *params:username : string , password : string
    */
    login(username, password) {
        this.getToken(username, password).subscribe(data => {
            if (data['token']) {
                this.setUserDetails(username, password, data['token']);
                this.storage.set(this.HAS_LOGGED_IN, true);
                this.events.publish('user:login');
            }
        }
        );
    }

    GetUserToken() {
        return this.storage.get('token').then((value) => {
            return value;
        });
    }

    getDetails() {
        let headers = new Headers();
        //let tokenNum: string;

        let tokenNum = this.GetUserToken().then((username) => {
            return username;
        });
        console.log(tokenNum);

        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', '71456dbd15de0c0b6d2b4b44e5a92ad94c6def97');

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

    getToken_() {
        return new Promise((resolve, reject) => {
            this.storage.get("token").then((tokenValue) => {
                resolve(tokenValue);
            }).catch(error => {
                reject(error);
            })
        });
    }

    /*
    *name: setUserDetails
    *description: Saves user details locally
    *params:
    */
    setUserDetails(username, password, token) {
        console.log("Username: " + username + " password: " + password + " token: " + token);
        this.storage.set('username', username);
        this.storage.set('password', password);
        this.storage.set('token', token);
    }

    /*
    *name: logout
    *description: Logs user out of the application
    *params:
    */
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

    getUsertoken() {
        return this.storage.get('token').then((value) => {
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