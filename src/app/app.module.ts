import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TicketsComponent } from './tickets/tickets.component';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CoreComponent } from './core/core.component';

@NgModule({
  declarations: [
    AppComponent,
    TicketsComponent,
    CoreComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule, ReactiveFormsModule, NgbPaginationModule, NgbModule,
    HttpClientModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
