import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';
// export namespace sap.energy{
   export class Prosumer extends Participant {
      prosumerID: string;
      firstName: string;
      lastName: string;
      coins: Coins;
      energy: Energy;
   }

   export enum OwnerEntity {
      Prosumer,
   }

   export class Coins extends Asset {
      coinsID: string;
      value: number;
      ownerID: string;
      ownerEntity: OwnerEntity;
   }
   export class Energy extends Asset {
      energyID: string;
      value: number;
      ownerID: string;
      ownerEntity: OwnerEntity;
   }
   export class EnergyToCoins extends Transaction {
      energyRate: number;
      energyValue: number;
      coinsInc: Coins;
      coinsDec: Coins;
      energyInc: Energy;
      energyDec: Energy;
   }
// }
