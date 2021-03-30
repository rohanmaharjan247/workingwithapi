import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { CookieService } from 'ngx-cookie-service';
import { Subject } from 'rxjs';
import { SpotifyService } from '../services/spotify.service';
import { takeUntil } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  private readonly toDestroy$: Subject<boolean> = new Subject<boolean>();
  isAuthorized = false;

  profile: any = {};
  playlists: any = [];
  userPlaylist: any = {};
  userId = '';
  userTopArtist: any = [];
  userTopAlbum: any = [];

  searchedAlbums = [];
  searchedArtists = [];
  searchedPlaylists = [];
  searchedTracks = [];

  searchText = new FormControl();
  @ViewChild('spotifyLogin') spotifyLogin: ElementRef;

  constructor(
    private _spotifyService: SpotifyService,
    private title: Title,
    private oauthService: OAuthService,
    private cookieService: CookieService,
    private router: Router,
    private avRouter: ActivatedRoute
  ) {
    this.title.setTitle('Spotify Profile -  Working with APIs');
    this.avRouter.queryParams.subscribe((params) => {
      this.isAuthorized = params.isAuthorized;
    });
  }
  ngOnDestroy(): void {
    this.toDestroy$.next(true);
    this.toDestroy$.unsubscribe();
  }

  ngOnInit(): void {
    if (!this.isAuthorized) {
      this.authorize();
    } else {
      this.getSpotifyProfile();
      this.getSpotifyPlaylists();
      this.getUserTopArtist();
      this.getUserTopTracks();
    }
  }

  getSpotifyProfile() {
    if (this.isAuthorized)
      this._spotifyService
        .getSpotifyProfile()
        .pipe(takeUntil(this.toDestroy$))
        .subscribe((data: any) => {
          this.profile = data;
        });
    else {
      this.authorize();
      alert('Please login to get spotify profile');
    }
  }

  getSpotifyPlaylists() {
    if (this.isAuthorized) {
      this._spotifyService
        .getSpotifyPlaylists()
        .pipe(takeUntil(this.toDestroy$))
        .subscribe((data: any) => {
          this.playlists = data.items;
        });
    } else {
      this.authorize();
      alert('Please login to get spotify profile');
    }
  }

  getPlaylistById(playlistId: string) {
    if (this.isAuthorized) {
      this._spotifyService
        .getSpotifyPlaylist(playlistId)
        .pipe(takeUntil(this.toDestroy$))
        .subscribe((data: any) => {
          this.userPlaylist = data;
        });
    }
  }

  getUserTopArtist() {
    this._spotifyService
      .getUserTop('artists')
      .pipe(takeUntil(this.toDestroy$))
      .subscribe((data: any) => {
        this.userTopArtist = data.items;
      });
  }

  getUserTopTracks() {
    this._spotifyService
      .getUserTop('tracks')
      .pipe(takeUntil(this.toDestroy$))
      .subscribe((data: any) => {
        this.userTopAlbum = data.items;
      });
  }

  getUserPlaylist() {
    if (this.isAuthorized && this.userId != '') {
      this._spotifyService
        .getUserPlaylists(this.userId)
        .pipe(takeUntil(this.toDestroy$))
        .subscribe((data) => {});
    }
  }

  search() {
    if (this.searchText.value != '' && this.searchText.value != null) {
      this._spotifyService
        .search(this.searchText.value)
        .subscribe((data: any) => {
          console.log(data);
          this.searchedAlbums = data.albums.items;
          this.searchedArtists = data.artists.items;
          this.searchedPlaylists = data.playlists.items;
          this.searchedTracks = data.tracks.items;
        });
    } else {
      alert('Search text required');
    }
  }

  authorize() {
    this._spotifyService
      .getSpotifyAuth()
      .pipe(takeUntil(this.toDestroy$))
      .subscribe((data: any) => {
        this.spotifyLogin.nativeElement.href = data.link;
        // this.spotifyLogin.nativeElement.click();
        //  this.getSpotifyProfile();
      });
    //this.oauthService.initLoginFlow();
  }

  millisTominutes = (millis) => {
    var minutes = Math.floor(millis / 60000);
    var seconds = Number(((millis % 60000) / 1000).toFixed(0));

    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  getFeaturedArtists(artists) {
    let featuredArtists = artists.slice(1);
    let returnString = '';
    for (let i = 0; i < featuredArtists.length; i++) {
      if (i == 0) {
        returnString += `(Feat. ${featuredArtists[i].name}`;
      } else {
        returnString += ` & ${featuredArtists[i].name}`;
      }
    }
    if (returnString != '') returnString += ')';
    return returnString;
  }
}
