import {Injectable} from '@angular/core';
import {Storage, LocalStorage, Events} from 'ionic-angular';
import {Http, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';

@Injectable()
export class UserData {
    _favorites = [];
    HAS_LOGGED_IN = 'hasLoggedIn';
    storage = new Storage(LocalStorage);

    constructor(private events: Events, private http: Http) { }

    hasFavorite(sessionName) {
        return (this._favorites.indexOf(sessionName) > -1);
    }

    addFavorite(sessionName) {
        this._favorites.push(sessionName);
    }

    removeFavorite(sessionName) {
        let index = this._favorites.indexOf(sessionName);
        if (index > -1) {
            this._favorites.splice(index, 1);
        }
    }

    login(username, password) {
        // don't have the data yet
        return new Promise(resolve => {
            // We're using Angular HTTP provider to request the data,
            // then on the response, it'll map the JSON data to a parsed JS object.
            // Next, we process the data and resolve the promise with the new data.
            let body = JSON.stringify({ "username": username, "password": password });
            let headers = new Headers({ 'Content-Type': 'application/json' });
            let options = new RequestOptions({ headers: headers });
            this.http.post('http://userservice.staging.tangentmicroservices.com/api-token-auth/', body, options)
                .map(res => res.json())
                .subscribe(data => {
                    this.setUserDetails(username, password, data['token']);
                    this.events.publish('user:login');
                    resolve({ 'status': 200, data });
                }, err => resolve(400),
                () => resolve(200));
        }).catch(this.handleError);
    }

    /*
    *name: Get Projects
    *description: Gets all projects
    *params:
    */
    getProjects() {
        return new Promise(resolve => {
            this.getUserToken().then((token) => {
                let headers = new Headers();
                headers.append('Content-Type', 'application/json');
                headers.append('Authorization', token);
                let options = new RequestOptions({ headers: headers });
                this.http.get(`http://projectservice.staging.tangentmicroservices.com:80/api/v1/projects/`, { headers: headers })
                    .map(res => res.json())
                    .subscribe(data => {
                        resolve({ 'status': 200, data });
                    }, err => resolve(400),
                    () => resolve(200));
            })
        }).catch(this.handleError);
    }

    /*
    *name: update Project
    *description: Updates a user project
    *params: project: Object
    */
    saveProject(project) {
        return new Promise(resolve => {
            this.getUserToken().then((token) => {
                let headers = new Headers();
                let body = JSON.stringify(project);
                headers.append('Content-Type', 'application/json');
                headers.append('Authorization', token);
                let options = new RequestOptions({ headers: headers });
                this.http.put('http://projectservice.staging.tangentmicroservices.com:80/api/v1/projects/' + project['pk'] + '/', body, options)
                    .map(res => res.json())
                    .subscribe(data => {
                        resolve({ 'status': 200, data });
                    }, err => resolve(400),
                    () => resolve(200));
            })
        }).catch(this.handleError);
    }

    /*
    *name: delete Project
    *description: Deletes a project
    *params: project: Object
    */
    deleteProject(project) {
        return new Promise(resolve => {
            this.getUserToken().then((token) => {
                let headers = new Headers();
                let body = JSON.stringify(project);
                headers.append('Content-Type', 'application/json');
                headers.append('Authorization', token);
                let options = new RequestOptions({ headers: headers });
                this.http.delete('http://projectservice.staging.tangentmicroservices.com:80/api/v1/projects/' + project['pk'] + '/', options)
                    .map(res => res.json())
                    .subscribe(data => {
                        //FYI : The return statment returns nothing :( , So its okey if you get a 400
                        resolve({ 'status': 200, data });
                    }, err => resolve(400),
                    () => resolve(200));
            })
        }).catch(this.handleError);
    }

    /*
    *name: create Project
    *description: Creates a new Project
    *params: project: Object
    */
    createProject(project) {
        return new Promise(resolve => {
            this.getUserToken().then((token) => {
                let headers = new Headers();
                let body = JSON.stringify(project);
                headers.append('Content-Type', 'application/json');
                headers.append('Authorization', token);
                let options = new RequestOptions({ headers: headers });
                this.http.post('http://projectservice.staging.tangentmicroservices.com:80/api/v1/projects/', body, options)
                    .map(res => res.json())
                    .subscribe(data => {
                        resolve({ 'status': 200, data });
                    }, err => resolve(400),
                    () => resolve(200));
            })
        }).catch(this.handleError);
    }

    signup(username, password) {
        /*
         this.setUserDetails(username, password, token);
         this.events.publish('user:signup');
         */
    }

    logout() {
        this.events.publish('user:logout');
        this.storage.remove(this.HAS_LOGGED_IN);
        this.storage.remove('username');
        this.storage.remove('password');
        this.storage.remove('token');
    }

    setUserDetails(username, password, token) {
        this.storage.set('username', username);
        this.storage.set(this.HAS_LOGGED_IN, true);
        this.storage.set('password', password);
        this.storage.set('token', token);
    }

    getUserToken() {
        return this.storage.get('token').then((value) => {
            return value;
        });
    }

    getUsername() {
        return this.storage.get('username').then((value) => {
            return value;
        });
    }

    // return a promise
    hasLoggedIn() {
        return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
            return value;
        });
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
*name: handleError
*description: Handles HTTP errors
*params: error
*/
    handleError(error) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }
}