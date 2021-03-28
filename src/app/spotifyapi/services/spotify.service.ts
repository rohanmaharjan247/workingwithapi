import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable()
export class SpotifyService {

  static ACCESSTOKEN = '';

  constructor(private http: HttpClient) {}

  getSpotifyProfile() {
    return this.http.get(`${environment.api}/profile`, {headers: new HttpHeaders().set('Authorization', localStorage.getItem('access_token'))});
  }

  getSpotifyPlaylists(){
    return this.http.get(`${environment.api}/playlists`, {headers: new HttpHeaders().set('Authorization', localStorage.getItem('access_token'))});
  }

  getSpotifyAuth() {
    return this.http.get(`${environment.api}/spotifyauth`);
  }

  callback(code, state) {
    return this.http.get(`${environment.api}/callback`, {
      params: new HttpParams().set('code', code).set('state', state),
    });
  }
}
