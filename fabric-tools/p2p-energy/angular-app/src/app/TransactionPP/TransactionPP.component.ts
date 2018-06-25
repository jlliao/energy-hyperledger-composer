import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { TransactionPPService } from './TransactionPP.service';
import 'rxjs/add/operator/toPromise';

//provide associated components
@Component({
	selector: 'app-TransactionPP',
	templateUrl: './TransactionPP.component.html',
	styleUrls: ['./TransactionPP.component.css'],
  	providers: [TransactionPPService]
})

//TransactionPPComponent class
export class TransactionPPComponent {

  //define rate of conversion
  private prosumerCoinsPerEnergy = 1;
  private prosumerEnergyPerCoin = (1 / this.prosumerCoinsPerEnergy).toFixed(2);  

  //define variables
  private coinsExchanged;
  private checkResultProducerEnergy = true;
  private checkResultConsumerCoins = true;

  myForm: FormGroup;
  private errorMessage;
  private transactionFrom;

  private allProsumers;
  private producerProsumer;
  private consumerProsumer;
  
  private energyToCoinsObj;
  private transactionID;

  //initialize form variables
  producerProsumerID = new FormControl("", Validators.required);
	consumerProsumerID = new FormControl("", Validators.required); 
	energyValue = new FormControl("", Validators.required);
	coinsValue = new FormControl("", Validators.required);
  
  constructor(private serviceTransaction:TransactionPPService, fb: FormBuilder) {
    //intialize form  
	  this.myForm = fb.group({		  
		  producerProsumerID:this.producerProsumerID,
		  consumerProsumerID:this.consumerProsumerID,
      energyValue:this.energyValue,
      coinsValue:this.coinsValue,
    });
    
  };

  //on page initialize, load all prosumers
  ngOnInit(): void {
    this.transactionFrom  = false;
    this.loadAllProsumers()
    .then(() => {                     
            this.transactionFrom  = true;
    });
    
  }

  //get all Prosumers
  loadAllProsumers(): Promise<any> {

    //retrieve all prosumers in the tempList array
    let tempList = [];
    
    //call serviceTransaction to get all prosumer objects
    return this.serviceTransaction.getAllProsumers()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      
      //append tempList with the prosumer objects returned
      result.forEach(prosumer => {
        tempList.push(prosumer);
      });

      //assign tempList to allProsumers
      this.allProsumers = tempList;
    })
    .catch((error) => {
        if(error == 'Server error'){
            this.errorMessage = "Could not connect to REST server. Please check your configuration details";
        }
        else if(error == '404 - Not Found'){
				this.errorMessage = "404 - Could not find API route. Please check your available APIs."
        }
        else{
            this.errorMessage = error;
        }
    });
  }

  //execute transaction
  execute(form: any): Promise<any> {
          
    //loop through all prosumers, and get producer and consumer prosumer from user input
    for (let prosumer of this.allProsumers) {      
      if(prosumer.prosumerID == this.producerProsumerID.value){
        this.producerProsumer = prosumer;
      }
      if(prosumer.prosumerID == this.consumerProsumerID.value){
        this.consumerProsumer = prosumer;
      }
    }
    
    //identify energy and coins id which will be debited
    var splitted_energyID = this.producerProsumer.energy.split("#", 2); 
    var energyID = String(splitted_energyID[1]);

    var splitted_coinsID = this.consumerProsumer.coins.split("#", 2); 
    var coinsID = String(splitted_coinsID[1]);
    
    //calculate coins exchanges from the rate
    this.coinsExchanged = this.prosumerCoinsPerEnergy * this.energyValue.value;

    //create transaction object
    this.energyToCoinsObj = {
      $class: "sap.energy.EnergyToCoins",
      "energyRate": this.prosumerCoinsPerEnergy,
      "energyValue": this.energyValue.value,
      "coinsInc": this.producerProsumer.coins,
      "coinsDec": this.consumerProsumer.coins,
      "energyInc": this.consumerProsumer.energy,
      "energyDec": this.producerProsumer.energy,         
    };

    //check consumer coins and producer energy assets for enough balance before creating transaction
    //call serviceTransaction to get energy asset
    return this.serviceTransaction.getEnergy(energyID)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      //check if enough value
      if(result.value) {
        if ((result.value - this.energyValue.value) < 0 ){
          this.checkResultProducerEnergy = false;
          this.errorMessage = "Insufficient energy in producer account";
          return false;
        }
        return true;
      }
    })
    .then((checkProducerEnergy) => {
      //if positive on sufficient energy, then check coins asset whether sufficient coins
      if(checkProducerEnergy)
      {
        //call serviceTransaction to get coins asset        
        this.serviceTransaction.getCoins(coinsID)
        .toPromise()
        .then((result) => {
          this.errorMessage = null;
          //check if enough value
          if(result.value) {
            if ((result.value - this.coinsExchanged) < 0 ){
              this.checkResultConsumerCoins = false;
              this.errorMessage = "Insufficient coins in consumer account";
              return false;
            }
            return true;
          }
        })
        .then((checkConsumerCoins) => {
          //if positive on sufficient coins, then call transaction
          if(checkConsumerCoins)
          {
            //call serviceTransaction call the energyToCoins transaction with energyToCoinsObj as parameter            
            this.serviceTransaction.energyToCoins(this.energyToCoinsObj)      
            .toPromise()
            .then((result) => {
              this.errorMessage = null;
              this.transactionID = result.transactionId;
              console.log(result)     
            })
            .catch((error) => {
                if(error == 'Server error'){
                    this.errorMessage = "Could not connect to REST server. Please check your configuration details";
                }
                else if(error == '404 - Not Found'){
                this.errorMessage = "404 - Could not find API route. Please check your available APIs."
                }
                else{
                    this.errorMessage = error;
                }
            }).then(() => {
              this.transactionFrom = false;
            });
          }
        });
      }        
    });
  }
          
}