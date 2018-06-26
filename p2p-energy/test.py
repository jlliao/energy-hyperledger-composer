import requests

url = "http://localhost:3000/api"

prosumerURL = "sap.energy.Prosumer"
coinsURL = "sap.energy.Coins"
energyURL = "sap.energy.Energy"
energyToCoinsURL = "sap.energy.EnergyToCoins"

prosumerId = coinsId = energyId = "1000"
firstName = "Jianglong"
lastName = "Liao"
addCoinsValue = 0
addEnergyValue = 0 
transferEnergyValue = 0
energyRate = 0

# add a prosumer#1000
addProsumer = {
  "$class": prosumerURL,
  "prosumerID": prosumerId,
  "firstName": firstName,
  "lastName": lastName,
  "coins": "resource:{}#{}".format(coinsURL, coinsId),
  "energy": "resource:{}#{}".format(energyURL, energyId)
} 

headers = {'Content-type': 'application/json'}

print("****** add prosumer#1000 ******")

ap = requests.post(url = "{}/{}".format(url, prosumerURL), json = addProsumer, headers = headers)
print(ap.text)

# add coins to prosumer#1000
addCoins = {
  "$class": coinsURL,
  "coinsID": coinsId,
  "value": addCoinsValue,
  "ownerID": prosumerId,
  "owner": {
    "$class": prosumerURL,
    "prosumerID": prosumerId,
    "firstName": firstName,
    "lastName": lastName,
    "coins": "resource:{}#{}".format(coinsURL, coinsId),
    "energy": "resource:{}#{}".format(energyURL, energyId)
  }
}

print("****** add coins to #1000 ******")

ac = requests.post(url = "{}/{}".format(url, coinsURL), json = addCoins, headers = headers)
print(ac.text)

# add energy to prosumer#1000
addEnergy = {
  "$class": energyURL,
  "energyID": energyId,
  "value": addEnergyValue,
  "ownerID": prosumerId,
  "owner": {
    "$class": prosumerURL,
    "prosumerID": prosumerId,
    "firstName": firstName,
    "lastName": lastName,
    "coins": "resource:{}#{}".format(coinsURL, coinsId),
    "energy": "resource:{}#{}".format(energyURL, energyId)
  }
}

print("****** add energy to #1000 ******")

ae = requests.post(url = "{}/{}".format(url, energyURL), json = addEnergy, headers = headers)
print(ae.text)

# get prosumer#1000 information
print("****** get the info of #1000 ******")

prosumerInfo = requests.get(url = "{}/{}/{}".format(url, prosumerURL, prosumerId))
print(prosumerInfo.text)

# get coins info of a prosumer#1000
print("****** get coinsinfo of #1000 ******")

coinsInfo = requests.get(url = "{}/{}/{}".format(url, coinsURL, coinsId))
print(coinsInfo.text)

# get energy info of a prosumer#1000
print("****** get energyinfo of #1000 ******")

energyInfo = requests.get(url = "{}/{}/{}".format(url, energyURL, energyId))
print(energyInfo.text)

# transact energy from prosumer#1000 to prosumer #1001
