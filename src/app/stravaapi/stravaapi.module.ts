import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StravaapiRoutingModule } from './stravaapi-routing.module';
import {StravaloginComponent} from './stravalogin/stravalogin.component';

@NgModule({
  declarations: [StravaloginComponent],
  imports: [
    CommonModule,
    StravaapiRoutingModule
  ]
})
export class StravaapiModule { }
