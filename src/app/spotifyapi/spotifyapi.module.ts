import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SpotifyapiRoutingModule } from './spotifyapi-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { SpotifyService } from './services/spotify.service';
import { HttpClientModule } from '@angular/common/http';

import {} from 'angular-oauth2-oidc';
import { OAuthModule } from 'angular-oauth2-oidc';
import { CookieService } from 'ngx-cookie-service';
import { CallbackComponent } from './callback/callback.component';
import { SanitizerPipe } from '../sanitizer.pipe';

@NgModule({
  declarations: [ProfileComponent, CallbackComponent, SanitizerPipe],
  imports: [
    CommonModule,
    HttpClientModule,
    SpotifyapiRoutingModule,
    OAuthModule.forRoot()
  ],
  providers: [SpotifyService, CookieService]
})
export class SpotifyapiModule { }
