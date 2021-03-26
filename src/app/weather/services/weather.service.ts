import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable()
export class WeatherService {
  constructor(private http: HttpClient) {}

  getCurrentWeather() {
    return this.http.get(environment.api + '/currentweather');
  }

  getHourlyWeather() {
    return this.http.get(environment.api + '/hourlyweather');
  }

  getDailyForecast(lat: number, lon: number) {
    return this.http.get(environment.api + '/onecall', {
      params: new HttpParams().set('lat', String(lat)).set('lon', String(lon)),
    });
  }

  getCurrentAirPollution(lat: number, lon: number) {
    return this.http.get(environment.api + '/currentairpollution', {
      params: new HttpParams().set('lat', String(lat)).set('lon', String(lon)),
    });
  }

  getForecastAirPollution(lat: number, lon: number) {
    return this.http.get(environment.api + '/forecastairpollution', {
      params: new HttpParams().set('lat', String(lat)).set('lon', String(lon)),
    });
  }
  getHistoryAirPollution(lat: number, lon: number, start: number, end: number) {
    return this.http.get(environment.api + '/forecastairpollution', {
      params: new HttpParams()
        .set('lat', String(lat))
        .set('lon', String(lon))
        .set('start', String(start))
        .set('end', String(end)),
    });
  }
}
