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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowseComponent } from './browse/browse.component';
import { SearchComponent } from './search/search.component';

@NgModule({
  declarations: [ProfileComponent, CallbackComponent, SanitizerPipe, BrowseComponent, SearchComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SpotifyapiRoutingModule,
    OAuthModule.forRoot()
  ],
  providers: [SpotifyService, CookieService]
})
export class SpotifyapiModule { }
