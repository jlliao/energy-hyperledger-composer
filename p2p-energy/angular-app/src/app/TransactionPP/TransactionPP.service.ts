import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs/Observable';

import { Prosumer } from '../sap.energy';
import { Coins } from '../sap.energy';
import { Energy } from '../sap.energy';
import { EnergyToCoins } from '../sap.energy';

import 'rxjs/Rx';

// Can be injected into a constructor
@Injectable()
export class TransactionPPService {

    //define namespace strings for api calls
	  private PROSUMER: string = 'Prosumer';
    private ENERGY: string = 'Energy';
    private COINS: string = 'Coins';
    private ENERGY_TO_COINS: string = 'EnergyToCoins';

    //use data.service.ts to create services to make API calls
    constructor(private prosumerService: DataService<Prosumer>, private coinsService: DataService<Coins>, private energyService: DataService<Energy>, private energyToCoinsService: DataService<EnergyToCoins>) {
    };

    //get all prosumer objects on the blockchain network
    public getAllProsumers(): Observable<Prosumer[]> {
        return this.prosumerService.getAll(this.PROSUMER);
    }

    //get energy asset by id
    public getEnergy(id: any): Observable<Energy> {
      return this.energyService.getSingle(this.ENERGY, id);
    }

    //get coins asset by id
    public getCoins(id: any): Observable<Coins> {
      return this.coinsService.getSingle(this.COINS, id);
    }
   
    //create energy to coins transaction
    public energyToCoins(itemToAdd: any): Observable<EnergyToCoins> {
      return this.energyToCoinsService.add(this.ENERGY_TO_COINS, itemToAdd);
    }

}