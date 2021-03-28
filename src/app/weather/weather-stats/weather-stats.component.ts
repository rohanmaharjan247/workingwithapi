import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Airinfo } from '../models/airinfo.model';
import { Cityinfo } from '../models/cityinfo.model';
import { Temperature } from '../models/temperature.model';
import { Weather } from '../models/weather.model';
import { WeatherService } from '../services/weather.service';
import { interval } from 'rxjs';
import { Avgaqidata } from '../models/avgaqidata.model';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-weather-stats',
  templateUrl: './weather-stats.component.html',
  styleUrls: ['./weather-stats.component.scss'],
})
export class WeatherStatsComponent implements OnInit, AfterViewInit {
  weathers: Weather[];
  temperature: Temperature = new Temperature();
  hourlyTemperature: Temperature = new Temperature();
  hourlyDate = new Date();
  cityInfo: Cityinfo = new Cityinfo();
  airPollutionInfo: Airinfo = new Airinfo();
  forecastAirPollution: Airinfo[] = [];
  historyAP: Avgaqidata[] = [];
  forecastAP: Avgaqidata[] = [];
  loadingCurrentWeather = false;
  loadingAirPollution = false;
  loadingHistoryAP = false;
  loadingForecastAP = false;
  loadingDailyForcast = false;
  dailyForecast:any = {};
  constructor(private _weatherService: WeatherService, private title:Title) {
    this.title.setTitle('Kathmandu Air Quality Index - Working with Apis');
  }

  ngOnInit(): void {
    this.getCurrentWeather();
    this.getHourlyWeather();
    interval(1000 * 60 * 60).subscribe((val) => {

      this.getHourlyWeather();

    });
  }

  ngAfterViewInit(): void {}

  getCurrentWeather() {
    this.loadingCurrentWeather = true;
    this._weatherService.getCurrentWeather().subscribe((data: any) => {
      this.cityInfo = new Cityinfo();
      this.weathers = data.weather;
      this.temperature = data.main;
      this.cityInfo.id = data.id;
      this.cityInfo.name = data.name;
      this.cityInfo.lat = data.coord.lat;
      this.cityInfo.lon = data.coord.lon;
      this.cityInfo.sunrise = new Date(data.sys.sunrise * 1000);
      this.cityInfo.sunset = new Date(data.sys.sunset * 1000);
      this.cityInfo.country = data.sys.country;
      this.loadingCurrentWeather = false;
      this.getDailyForecast(data.coord.lat, data.coord.lon);
      this.getCurrentAirPollution(data.coord.lat, data.coord.lon);
      this.getHistoryAirPollution(data.coord.lat, data.coord.lon);
      this.getForecastAirPollution(data.coord.lat, data.coord.lon);
    });
  }

  getHourlyWeather() {
    this._weatherService.getHourlyWeather().subscribe((data: any) => {

      this.hourlyTemperature = data.main;
      this.hourlyDate = new Date(data.dt * 1000);
    });
  }

  getDailyForecast(lat: number, lon: number){
    this.loadingDailyForcast = true;
    this._weatherService.getDailyForecast(lat, lon).subscribe((data:any)=>{

      this.dailyForecast = data;
      this.loadingDailyForcast = false;
    })
  }

  getCurrentAirPollution(lat: number, lon: number) {
    this.loadingAirPollution = true;

    this._weatherService
      .getCurrentAirPollution(lat, lon)
      .subscribe((data: any) => {
        this.airPollutionInfo.airquality = this.airQuality(
          data.list[0].main.aqi
        );
        this.airPollutionInfo.pollutionIndex = data.list[0].components;
        this.loadingAirPollution = false;
      });
  }

  getForecastAirPollution(lat: number, lon: number) {
    this.loadingForecastAP = true;
    this._weatherService
      .getForecastAirPollution(lat, lon)
      .subscribe((data: any) => {

        let forecastArr = data.list;
        forecastArr.forEach((forecast) => {
          this.forecastAirPollution.push({
            airquality: this.airQuality(forecast.main.aqi),
            pollutionIndex: forecast.components,
            pollutiondate: new Date(forecast.dt * 1000),
          });
        });

        this.forecastAP = this.calculateAQI(this.forecastAirPollution, false);

        this.loadingForecastAP = false;
      });
  }

  getHistoryAirPollution(lat: number, lon: number) {
    this.loadingHistoryAP = true;
    const start = Math.floor(new Date().getTime() / 1000);
    const end = this.threeDaysAgo();
    this._weatherService
      .getHistoryAirPollution(lat, lon, start, end)
      .subscribe((data: any) => {

        let forecastArr = data.list;
        forecastArr.forEach((forecast) => {
          this.forecastAirPollution.push({
            airquality: this.airQuality(forecast.main.aqi),
            pollutionIndex: forecast.components,
            pollutiondate: new Date(forecast.dt * 1000),
          });
        });
        this.historyAP = this.calculateAQI(this.forecastAirPollution, true);

        this.loadingHistoryAP = false;
      });
  }

  private calculateAQI(apData: Airinfo[], isHistory: boolean) {
    let dateArr:Date[] = [];
    if (isHistory) dateArr = this.getDateForHistory();
    else dateArr = this.getDateForForecast();
    let historicalAQIData: Avgaqidata[] = [];
    let totalPm2_5 = 0;
    let totalPm10 = 0;
    let totalCO = 0;
    let totalO3 = 0;
    let totalNo2 = 0;
    let totalSo2 = 0;
    let count = 0;
    dateArr.forEach((history) => {
      totalPm2_5 = 0;
      totalPm10 = 0;
      totalCO = 0;
      totalO3 = 0;
      totalNo2 = 0;
      totalSo2 = 0;
      apData.forEach((data) => {
        if (
          data.pollutiondate.getDate() === history.getDate() &&
          data.pollutiondate.getMonth() === history.getMonth() &&
          data.pollutiondate.getFullYear() === history.getFullYear()
        ) {
          totalPm2_5 += data.pollutionIndex.pm2_5;
          totalPm10 += data.pollutionIndex.pm10;
          totalCO += data.pollutionIndex.co;
          totalO3 += data.pollutionIndex.o3;
          totalNo2 += data.pollutionIndex.no2;
          totalSo2 += data.pollutionIndex.so2;
          count++;
        }
      });
      let Pm2_5Aqi = totalPm2_5 / count;
      let Pm10Aqi = totalPm10 / count;
      let COAqi = totalCO / count;
      let O3Aqi = totalO3 / count;
      let No2Aqi = totalNo2 / count;
      let So2Aqi = totalSo2 / count;
      let totalAQI = [Pm2_5Aqi, Pm10Aqi, COAqi, O3Aqi, No2Aqi, So2Aqi];
      let maxAQI = Math.max(...totalAQI);
      let aqi = this.checkAirQuality(maxAQI);
      historicalAQIData.push({
        avgPm2_5: Pm2_5Aqi,
        avgPm10: Pm10Aqi,
        avgCO: COAqi,
        avgO3: O3Aqi,
        avgNo2: No2Aqi,
        avgSo2: So2Aqi,
        date: history,
        aqi: aqi,
      });
    });
    return historicalAQIData;
  }

  private threeDaysAgo() {
    let weekDate = new Date();
    weekDate.setDate(weekDate.getDate() - 3);
    return Math.floor(weekDate.getTime() / 1000);
  }

  private airQuality(airQualityIndex: number) {
    switch (airQualityIndex) {
      case 1:
        return 'Good';
      case 2:
        return 'Fair';
      case 3:
        return 'Moderate';
      case 4:
        return 'Poor';
      case 5:
        return 'Very Poor';
      default:
        return 'Not Found';
    }
  }

  private getDateForHistory() {
    let historyDate = new Date();
    let returnDate: Date[] = [];
    for (let i = 1; i <= 3; i++) {
      returnDate.push(
        new Date(
          historyDate.getFullYear(),
          historyDate.getMonth(),
          historyDate.getDate() - i
        )
      );
    }
    return returnDate;
  }

  private getDateForForecast(){
    let forecastDate = new Date();
    let returnDate: Date[] = [];
    for (let i = 1; i <= 3; i++) {
      returnDate.push(
        new Date(
          forecastDate.getFullYear(),
          forecastDate.getMonth(),
          forecastDate.getDate() + i
        )
      );
    }
    return returnDate;
  }

  private checkAirQuality(airQuality: number) {
    let aq = 0;
    if (airQuality > 0 && airQuality <= 50) {
      aq = 1;
    } else if (airQuality > 50 && airQuality <= 100) {
      aq = 2;
    } else if (airQuality > 100 && airQuality <= 150) {
      aq = 3;
    } else if (airQuality > 150 && airQuality <= 200) {
      aq = 4;
    } else if (airQuality > 250 && airQuality <= 300) {
      aq = 5;
    } else {
      aq = 6;
    }
    return aq;
  }

  public getColor(airQuality: number) {
    let aq = '';
    switch (airQuality) {
      case 1:
        aq = 'good';
        break;
      case 2:
        aq = 'fair';
        break;
      case 3:
        aq = 'moderate';
        break;
      case 4:
        aq = 'poor';
        break;
      case 5:
        aq = 'verypoor';
        break;
      case 6:
        aq = 'severe';
        break;
      default:
        aq = 'Not Found';
        break;
    }
    return aq;
  }

  public covertUnixDate(unixDate:number){
    return new Date(unixDate * 1000);
  }
}
