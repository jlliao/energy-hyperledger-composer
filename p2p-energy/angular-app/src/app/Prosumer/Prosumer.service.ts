import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs/Observable';
import { Prosumer } from '../sap.energy';
import 'rxjs/Rx';

import { Coins } from '../sap.energy';
import { Energy } from '../sap.energy';

// Can be injected into a constructor
@Injectable()
export class ProsumerService {

  //define namespace strings for api calls
	private PROSUMER: string = 'Prosumer';  
  private COINS: string = 'Coins';
  private ENERGY: string = 'Energy';

  constructor(private prosumerService: DataService<Prosumer>, private coinsService: DataService<Coins>, private energyService: DataService<Energy>) {
  };

  public getAllProsumers(): Observable<Prosumer[]> {
    return this.prosumerService.getAll(this.PROSUMER);
  }

  //get prosumer by id
  public getProsumer(id: any): Observable<Prosumer> {
    return this.prosumerService.getSingle(this.PROSUMER, id);
  }

  //add prosumer
  public addProsumer(itemToAdd: any): Observable<Prosumer> {
    return this.prosumerService.add(this.PROSUMER, itemToAdd);
  }

  //delete prosumer
  public deleteProsumer(id: any): Observable<Prosumer> {
    return this.prosumerService.delete(this.PROSUMER, id);
  }

  //update prosumer
  public updateProsumer(id: any, itemToUpdate: any): Observable<Prosumer> {
    return this.prosumerService.update(this.PROSUMER, id, itemToUpdate);
  }


  //similar functions for coins asset
  public getAllCoins(): Observable<Coins[]> {
    return this.coinsService.getAll(this.COINS);
  }

  public getCoins(id: any): Observable<Coins> {
    return this.coinsService.getSingle(this.COINS, id);
  }

  public addCoins(itemToAdd: any): Observable<Coins> {
    return this.coinsService.add(this.COINS, itemToAdd);
  }

  public updateCoins(id: any, itemToUpdate: any): Observable<Coins> {
    return this.coinsService.update(this.COINS, id, itemToUpdate);
  }

  public deleteCoins(id: any): Observable<Coins> {
    console.log(id)
    return this.coinsService.delete(this.COINS, id);
  }


  //similar functions for energy asset
  public getAllEnergy(): Observable<Energy[]> {
    return this.energyService.getAll(this.ENERGY);
  }

  public getEnergy(id: any): Observable<Energy> {
    return this.energyService.getSingle(this.ENERGY, id);
  }

  public addEnergy(itemToAdd: any): Observable<Energy> {
    return this.energyService.add(this.ENERGY, itemToAdd);
  }

  public updateEnergy(id: any, itemToUpdate: any): Observable<Energy> {
    return this.energyService.update(this.ENERGY, id, itemToUpdate);
  }

  public deleteEnergy(id: any): Observable<Energy> {
    return this.energyService.delete(this.ENERGY, id);
  }

}