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
    _favorites = [];
    HAS_LOGGED_IN = 'hasLoggedIn';

    constructor(public http: Http, private events: Events) {
        this.storage = new Storage(SqlStorage, { name: 'user' });

        this.favoritesURL = 'http://userservice.staging.tangentmicroservices.com/api-token-auth/';
        this.HAS_LOGGED_IN = 'hasLoggedIn';
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

    login(username) {
        let password: string = 'admin';
        //Get tokem
        this.storage.set(this.HAS_LOGGED_IN, true);
        let token: string = '71456dbd15de0c0b6d2b4b44e5a92ad94c6def97';
        this.setUserDetails(username, password, token);

        this.events.publish('user:login');
    }

    setUsername(username) {
        this.storage.set('username', username);
    }

    setUserDetails(username, password, tokem) {
        this.storage.set('username', username);
        this.storage.set('password', password);
        this.storage.set('token', tokem);
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