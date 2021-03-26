export class Airinfo {
  airquality: string = '';
  pollutiondate: Date = new Date();
  pollutionIndex: AirQuality = new AirQuality();
}

export class AirQuality{
  co: number = 0;
  nh3: number = 0;
  no: number = 0;
  no2: number = 0;
  o3: number = 0;
  pm2_5: number = 0;
  pm10: number = 0;
  so2: number = 0;
}
