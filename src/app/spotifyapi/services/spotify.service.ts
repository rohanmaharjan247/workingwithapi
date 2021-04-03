import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable()
export class SpotifyService {
  static ACCESSTOKEN = '';

  constructor(private http: HttpClient) {}

  getSpotifyProfile() {
    return this.http.get(`${environment.api}/profile`, {
      headers: new HttpHeaders().set(
        'Authorization',
        localStorage.getItem('access_token')
      ),
    });
  }

  getSpotifyPlaylists() {
    return this.http.get(`${environment.api}/playlists`, {
      headers: new HttpHeaders().set(
        'Authorization',
        localStorage.getItem('access_token')
      ),
    });
  }

  getSpotifyPlaylist(playlistId: string) {
    return this.http.get(`${environment.api}/playlistinfo`, {
      headers: new HttpHeaders().set(
        'Authorization',
        localStorage.getItem('access_token')
      ),
      params: new HttpParams().set('playlistid', playlistId),
    });
  }

  getUserPlaylists(userid: string) {
    return this.http.get(`${environment.api}/userplaylist`, {
      headers: new HttpHeaders().set(
        'Authorization',
        localStorage.getItem('access_token')
      ),
      params: new HttpParams().set('userid', userid),
    });
  }

  getUserTop(type: string) {
    return this.http.get(`${environment.api}/usertop`, {
      headers: new HttpHeaders().set(
        'Authorization',
        localStorage.getItem('access_token')
      ),
      params: new HttpParams().set('type', type),
    });
  }

  search(searchText: string) {
    return this.http.get(`${environment.api}/searchspotify`, {
      headers: new HttpHeaders().set(
        'Authorization',
        localStorage.getItem('access_token')
      ),
      params: new HttpParams().set('searchtext', searchText),
    });
  }

  browseNewRelease(country: string) {
    return this.http.get(`${environment.api}/browsenewrelease`, {
      headers: new HttpHeaders().set(
        'Authorization',
        localStorage.getItem('access_token')
      ),
      params: new HttpParams().set('searchtext', country),
    });
  }

  browseFeaturedPlaylists(country: string) {
    return this.http.get(`${environment.api}/browsefeaturedplaylists`, {
      headers: new HttpHeaders().set(
        'Authorization',
        localStorage.getItem('access_token')
      ),
      params: new HttpParams().set('searchtext', country),
    });
  }

  recommendation(seedArtists, seedGenres, seedTracks) {
    return this.http.get(`${environment.api}/recommendations`, {
      headers: new HttpHeaders().set(
        'Authorization',
        localStorage.getItem('access_token')
      ),
      params: new HttpParams()
        .set('seedartist', seedArtists)
        .set('seedgenre', seedGenres)
        .set('seedtrack', seedTracks),
    });
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
