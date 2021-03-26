import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WeatherStatsComponent } from './weather-stats/weather-stats.component';

const routes: Routes = [
  {path:'', component: WeatherStatsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WeatherRoutingModule { }
