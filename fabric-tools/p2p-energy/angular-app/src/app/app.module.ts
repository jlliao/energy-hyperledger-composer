import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { Configuration }     from './configuration';
import { DataService } from './data.service';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';


import { CoinsComponent } from './Coins/Coins.component';
import { EnergyComponent } from './Energy/Energy.component';

import { ProsumerComponent } from './Prosumer/Prosumer.component';

import { TransactionPPComponent } from './TransactionPP/TransactionPP.component';

import { AllTransactionsComponent } from './AllTransactions/AllTransactions.component';

  @NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,

    CoinsComponent,
    EnergyComponent,
    
    ProsumerComponent,
    
    TransactionPPComponent,

    AllTransactionsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [
    Configuration,
    DataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
