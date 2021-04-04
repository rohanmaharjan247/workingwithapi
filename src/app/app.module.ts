import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SanitizerPipe } from './sanitizer.pipe';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { StravaloginComponent } from './stravalogin/stravalogin.component';



@NgModule({
  declarations: [
    AppComponent,
    PagenotfoundComponent,
    StravaloginComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
