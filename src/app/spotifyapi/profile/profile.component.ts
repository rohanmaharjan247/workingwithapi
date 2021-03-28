import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { CookieService } from 'ngx-cookie-service';
import { SpotifyService } from '../services/spotify.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  isAuthorized = false;

  profile:any = {};
  playlists: any = [];

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
      console.log(params);
      this.isAuthorized = params.isAuthorized;
    });
  }

  ngOnInit(): void {
    if (!this.isAuthorized){
      this.authorize();
    }
    else{
      this.getSpotifyProfile();
      this.getSpotifyPlaylists();
    }
  }

  getSpotifyProfile() {
    if(this.isAuthorized)
    this._spotifyService.getSpotifyProfile().subscribe((data: any) => {
      this.profile = data;
    });
    else{
      this.authorize();
      alert('Please login to get spotify profile')
    }
  }

  getSpotifyPlaylists(){
    if(this.isAuthorized){
      this._spotifyService.getSpotifyPlaylists().subscribe((data:any)=>{
        console.log('playlist', data);
        this.playlists = data.items;
      })
    }
    else{
      this.authorize();
      alert('Please login to get spotify profile')
    }
  }

  authorize() {
    this._spotifyService.getSpotifyAuth().subscribe((data: any) => {
      console.log(data);
      this.spotifyLogin.nativeElement.href = data;
     // this.spotifyLogin.nativeElement.click();
      //  this.getSpotifyProfile();
    });
    //this.oauthService.initLoginFlow();
  }
}