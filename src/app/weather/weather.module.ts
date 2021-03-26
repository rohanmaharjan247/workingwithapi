import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { WeatherRoutingModule } from './weather-routing.module';
import { WeatherStatsComponent } from './weather-stats/weather-stats.component';
import { WeatherService } from './services/weather.service';

@NgModule({
  declarations: [WeatherStatsComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    WeatherRoutingModule
  ],
  providers: [WeatherService]
})
export class WeatherModule { }
