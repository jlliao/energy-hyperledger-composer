import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ProsumerService } from './Prosumer.service';
import 'rxjs/add/operator/toPromise';

//provide associated components
@Component({
  selector: 'app-Prosumer',
  templateUrl: './Prosumer.component.html',
  styleUrls: ['./Prosumer.component.css'],
  providers: [ProsumerService]
})

//ProsumerComponent class
export class ProsumerComponent implements OnInit {

  //define variables
  myForm: FormGroup;

  private allProsumers;
  private prosumer;
  private currentId;
  private errorMessage;

  private coins;
  private energy;

  //initialize form variables
  prosumerID = new FormControl('', Validators.required);
  firstName = new FormControl('', Validators.required);
  lastName = new FormControl('', Validators.required);
  coinsValue = new FormControl('', Validators.required);
  energyValue = new FormControl('', Validators.required);


  constructor(private serviceProsumer: ProsumerService, fb: FormBuilder) {
    //intialize form
    this.myForm = fb.group({
      prosumerID: this.prosumerID,
      firstName: this.firstName,
      lastName: this.lastName,
      coinsValue:this.coinsValue,
      energyValue:this.energyValue,
    });
  };

  //on page initialize, load all prosumers
  ngOnInit(): void {
    this.loadAll();
  }

  //load all prosumers and the energy and coins assets associated to it 
  loadAll(): Promise<any>  {
    
    //retrieve all prosumers in the prosumerList array
    let prosumerList = [];

    //call serviceProsumer to get all prosumer objects
    return this.serviceProsumer.getAllProsumers()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      
      //append prosumerList with the prosumer objects returned
      result.forEach(prosumer => {
        prosumerList.push(prosumer);
      });     
    })
    .then(() => {

      //for each prosumer, get the associated coins and energy asset
      for (let prosumer of prosumerList) {

        //get coinsID from the prosumer.coins string
        var splitted_coinsID = prosumer.coins.split("#", 2); 
        var coinsID = String(splitted_coinsID[1]);

        //call serviceProsumer to get coins asset
        this.serviceProsumer.getCoins(coinsID)
        .toPromise()
        .then((result) => {
          this.errorMessage = null;
          //update prosumer
          if(result.value){
            prosumer.coinsValue = result.value;
          }
        });

        //get energyID from the prosumer.energy string
        var splitted_energyID = prosumer.energy.split("#", 2); 
        var energyID = String(splitted_energyID[1]);
        
        //call serviceProsumer to get energy asset
        this.serviceProsumer.getEnergy(energyID)
        .toPromise()
        .then((result) => {
          this.errorMessage = null;
          //update prosumer
          if(result.value){
            prosumer.energyValue = result.value;
          }
        });

      }

      //assign prosumerList to allProsumers
      this.allProsumers = prosumerList;
    });

  }

  //add Prosumer participant
  addProsumer(form: any): Promise<any> {

    //create assets for prosumer and the prosumer on the blockchain network
    return this.createAssetsProsumer()
      .then(() => {           
        this.errorMessage = null;
        this.myForm.setValue({
            "prosumerID":null,
            "firstName":null,
            "lastName":null,
            "coinsValue":null,
            "energyValue":null,
        });
      })
      .catch((error) => {
        if(error == 'Server error'){
            this.errorMessage = "Could not connect to REST server. Please check your configuration details";
        }
        else if (error == '500 - Internal Server Error') {
          this.errorMessage = "Input error";
        }
        else{
            this.errorMessage = error;
        }
    });
  }

  //create coins and energy associated with the Prosumer, followed by the Prosumer
  createAssetsProsumer(): Promise<any> {

    //create coins asset json
    this.coins = {
      $class: "sap.energy.Coins",
          "coinsID":"CO_" + this.prosumerID.value,
          "value":this.coinsValue.value,
          "ownerID":this.prosumerID.value,
          "ownerEntity":'Prosumer'
    };
    
    //create energy asset json
    this.energy = {
      $class: "sap.energy.Energy",
          "energyID":"EN_" + this.prosumerID.value,
          "value":this.energyValue.value,
          "ownerID":this.prosumerID.value,
          "ownerEntity":'Prosumer'        
    };
    
    //create prosumer participant json
    this.prosumer = {
      $class: "sap.energy.Prosumer",
          "prosumerID":this.prosumerID.value,
          "firstName":this.firstName.value,
          "lastName":this.lastName.value,
          "coins":"CO_" + this.prosumerID.value,
          "energy":"EN_" + this.prosumerID.value
    };    

    //call serviceProsumer to add coins asset, pass created coins asset json as parameter
    return this.serviceProsumer.addCoins(this.coins)
    .toPromise()
		.then(() => {
      
      //call serviceProsumer to add energy asset, pass created energy asset json as parameter
			this.serviceProsumer.addEnergy(this.energy)
      .toPromise()
		  .then(() => {
          
        //call serviceProsumer to add prosumer participant, pass created prosumer participant json as parameter
        this.serviceProsumer.addProsumer(this.prosumer)
        .toPromise()
        .then(() => {
          //reload page to display the created prosumer
          location.reload();          
        });
		  });   
		});
  }

  //allow update name of Prosumer
  updateProsumer(form: any): Promise<any> {
    
    //create json of prosumer participant to update name
    this.prosumer = {
      $class: "sap.energy.Prosumer",          
      "firstName":this.firstName.value,          
      "lastName":this.lastName.value,
      "coins": "resource:sap.energy.Coins#CO_" + form.get("prosumerID").value,
      "energy": "resource:sap.energy.Energy#EN_" + form.get("prosumerID").value
    };

    //call serviceProsumer to update prosumer, pass prosumerID of which prosumer to update as parameter
    return this.serviceProsumer.updateProsumer(form.get("prosumerID").value,this.prosumer)
		.toPromise()
		.then(() => {
			this.errorMessage = null;
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

  //delete Prosumer and the coins and cash assets associated to it
  deleteProsumer(): Promise<any> {

    //call serviceProsumer to delete prosumer, pass prosumerID as parameter
    return this.serviceProsumer.deleteProsumer(this.currentId)
		.toPromise()
		.then(() => {
      this.errorMessage = null;
      
      //call serviceProsumer to delete coins asset, pass coinsID as parameter
      this.serviceProsumer.deleteCoins("CO_"+this.currentId)
      .toPromise()
      .then(() => {

          //call serviceProsumer to delete energy asset, pass energyID as parameter
          this.serviceProsumer.deleteEnergy("EN_"+this.currentId)
          .toPromise()
          .then(() => {
              console.log("Deleted")
          });
      });            
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

  //set id
  setId(id: any): void{
    this.currentId = id;
  }

  //get form based on prosumerID
  getForm(id: any): Promise<any>{

    //call serviceProsumer to get prosumer participant object
    return this.serviceProsumer.getProsumer(id)
    .toPromise()
    .then((result) => {
			this.errorMessage = null;
      let formObject = {        
            "prosumerID":null,          
            "firstName":null,          
            "lastName":null,
            "coinsValue":null,          
            "energyValue":null,
                      
      };

      //update formObject
      if(result.prosumerID){
        formObject.prosumerID = result.prosumerID;
      }else{
        formObject.prosumerID = null;
      }
    
      if(result.firstName){
        formObject.firstName = result.firstName;
      }else{
        formObject.firstName = null;
      }
    
      if(result.lastName){
        formObject.lastName = result.lastName;
      }else{
        formObject.lastName = null;
      }

      this.myForm.setValue(formObject);

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

  //reset form
  resetForm(): void{
    this.myForm.setValue({           
          "prosumerID":null, 
          "firstName":null,       
          "lastName":null,

          "coinsValue":null,
          "energyValue":null,
      });
  }

}