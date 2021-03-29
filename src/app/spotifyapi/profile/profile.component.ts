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

  getUserPlaylist() {
    if (this.isAuthorized && this.userId != '') {
      this._spotifyService
        .getUserPlaylists(this.userId)
        .pipe(takeUntil(this.toDestroy$))
        .subscribe((data) => {

        });
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

  millisTominutes = (millis) =>{
    var minutes = Math.floor(millis / 60000);
    var seconds = Number(((millis%60000)/1000).toFixed(0));

    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }
}
