import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class WebService {
  httpOptions = {
    headers: new HttpHeaders({ 
      'Content-Type': 'application/json;application/x-www-form-urlencodeed; charset=utf-8',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    })
  };

  constructor(
    private http: Http,
    private httpClient : HttpClient) { }
  login(param:{ user: string; pass: string; }){
    //const url = "http://10.43.214.204:8888/login";
    const url = "/login";
    console.log(param);
    return this.httpClient.post(url, param/*{"user":"admin","pass":"admin"}*/);
    //return this.http.post(url, param).toPromise();
  }
  execMML(mml: string) {
    //const url = "http://10.43.214.204:8888/mml?mml=" + mml;
    const url = "/mml?mml=" + mml;
    //return this.http.get(url)
    //  .toPromise()
    //  .then(res => res.json())
    //  .catch(this.handleError);
    return this.httpClient.get(url, this.httpOptions);
  }
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only   
    return Promise.reject(error.message || error);
  }
}
