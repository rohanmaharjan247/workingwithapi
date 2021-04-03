import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { BrowseComponent } from './spotifyapi/browse/browse.component';
import { ProfileComponent } from './spotifyapi/profile/profile.component';
import { SearchComponent } from './spotifyapi/search/search.component';
import { WeatherStatsComponent } from './weather/weather-stats/weather-stats.component';

const routes: Routes = [  
  {
    path: 'weather',
    loadChildren: () =>
      import('./weather/weather.module').then((m) => m.WeatherModule),
  },
  {
    path: 'spotify',
    loadChildren: () =>
      import('./spotifyapi/spotifyapi.module').then((m) => m.SpotifyapiModule),
  },
  {
    path: 'strava',
    loadChildren: () => import('./stravaapi/stravaapi.module').then((m)=>m.StravaapiModule)
  },
  {
    path: '**',
    component: PagenotfoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
