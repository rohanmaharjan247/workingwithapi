import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';

const routes: Routes = [
  { path: '', redirectTo: 'pagenotfound', pathMatch: 'full' },
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
    path: 'pagenotfound',
    component: PagenotfoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
