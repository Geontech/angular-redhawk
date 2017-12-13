/**
 * This is only for local test
 */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Component } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AngularRedhawkModule }  from 'angular-redhawk';

@Component({
  selector: 'app',
  template: `
  <h1 arRedhawk #rh="arRedhawk">Connected to REDHAWK?: {{ rh.service.$configured | async }}</h1>
  <p>Note: This playground application assumes REST-Python is running on localhost on port 8080.</p>
  `
})
class AppComponent {}

@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [ AppComponent ],
  imports: [ BrowserModule, AngularRedhawkModule ]
})
class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);
