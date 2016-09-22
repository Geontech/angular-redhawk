import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpModule }    from '@angular/http' ;

// Angular Redhawk framework
import { ArSupportModule } from 'angular-redhawk';

// The top-level app component
import { AppComponent }   from './app.component';

@NgModule({
  imports:      [
    BrowserModule,
    FormsModule,
    HttpModule,
    ArSupportModule
    ],
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
