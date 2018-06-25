import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';

import { CoinsComponent } from './Coins/Coins.component';
import { EnergyComponent } from './Energy/Energy.component';

import { ProsumerComponent } from './Prosumer/Prosumer.component';

import { TransactionPPComponent } from './TransactionPP/TransactionPP.component';

import { AllTransactionsComponent } from './AllTransactions/AllTransactions.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'About', component: AboutComponent },

  { path: 'Coins', component: CoinsComponent },
  { path: 'Energy', component: EnergyComponent },

  { path: 'Prosumer', component: ProsumerComponent },

  { path: 'TransactionPP', component: TransactionPPComponent },

  { path: 'AllTransactions', component: AllTransactionsComponent },

  { path: '**', redirectTo: '' }
];

@NgModule({
 imports: [RouterModule.forRoot(routes)],
 exports: [RouterModule],
 providers: []
})
export class AppRoutingModule { }
