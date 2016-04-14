# data-api

The Data API needs to be the layer that our apps go through to get data from our various data stores in a clean and consistent way. This will allow us to change the format of data behind the Data API while continuing to deliver the data in the same format to consumers of the Data API. This also allows us to control authentication and access to the back end databases and keep that auth out of our apps.

## Backend Databases

+ MongoDB
+ Elasticsearch

## Data Consumers/Creators

+ Stautsify - Writes reports to MongoDB
+ Stats Generator - Pulls Stats from Data API and pushes to MongoDB and ES
+ Audits? (not sure if this needs to pull data from here or the Storj API, or simply listen for events)
+ Accounting - Pulls stats and push accounting and payout data?
+ Data Publisher - Pull publishable stats and push to a publicly accessible place

## API Spec

### Communication
This should be implemented in JSON RPC

### Authentication
Authentication should be done by signing a nonce with private key on every transaction. It should mirror how we do authentication between farmers and Statusify.

We need to determine how to easily generate keys for new modules. We could drop in the module, which would create a key on the server side, (possibly have an admin user authorize the key creation with admin key) then move that key to the service.

### Request

```
{
  "method": "put",
  "id": 1234567,
  "params": {
    "service": "stat-generator",
    "type": "uptime",
    "message": "{\"farmer_id\": 12345, \"date_range\": { \"start\": \"startdatehere\", \"end\": \"enddatehere\" }, \"percent\": 99.999 }"
  },
  "timestamp": "2016-04-14T13:05:29-04:00",
  "signature": "siggoeshere"
}
```

+ auth(JSON) - This would be a JSON object containing authentication information
  + This could be done in the header instead
  + We need to discuss how to do auth to/from all of these microservices
  + We should consider humans authenticating but also service accounts where automation is necessary
+ service(STRING) - This is the name of the service that we're pushing data for
  + Each service should have it's own module that is dynamically loaded from files in a directory
  + Upon load of each service, the service is registered and exposed as an available service
+ set_type(STRING)
+ data_destination(STRING) ? Could allow the pushing service to determine where the data goes? Might simply leave this up to the data-api + message - This is the data that we're pushing
+ message(JSON) - This is the data that we're pushing
+ method(STRING) - [get|put|list|status] (others?) This would let the data-api know if we want to pull or push data, or execute other methods

### Fields
| Name        | Type            | Description                                        |
| ------------|-----------------|----------------------------------------------------|
| method      | String          | JSON RPC Method to be called                       |
| id          | Int             | JSON RPC Call Id                                   |
| params      | JSON Object     | JSON Object containing service related data        |
| timestamp   | ISO8601 (String)| Timestamp marking the time of the request          |
| signature   | String          | Signature on nonce                                 |

### Methods
| Name         | Arguments           | Returns            | Description                                            |
| -------------|---------------------|--------------------|--------------------------------------------------------|
| get          |                     | json_object | Get a dataset for a particular service.                |
| put          |                     | response_code(int) | Submit data for a service of a particular type. |
| list         |                     | response_code(int) | Submit data for a service of a particular type. |
| status       |                     | response_code(int) | Submit data for a service of a particular type. |

### Params
| Parameter    | Type             | Description                                      |
| -------------|------------------|--------------------------------------------------|
| service      | String           | Name of the service to interact with             |
| type         | String           | Type of data point to put or get                 |
| message      | JSON             | JSON to get or put                               |


### Service Module
A service module would be a folder containing the various files configuring a service.

#### Directory Structure
- data-api
  - methods
    - list.js
    - status.js
  - services
    - ServiceName
      - service.json - Config file describing the service
      - types (models) - We should move the model from statusify to data-api and write through it so we don't have to maintain the model in more than one location
      - methods
        - get.js
        - put.js
        - list.js
        - status.js

#### Example

##### service.json
```
{
  "name": "Statusify",
  "inputs": (need to identify authorized services that can push data to this service),
  "outputs": {
    "mongodb": {
      "name: "Statusify MongoDB",
      "uri": "mongodb://mymongo.host.com:bleh?ssl=true",
      "options": {
        "ssl": true
      }
    },
    "elasticsearch": {
      "name": "Production ELK Stack",
      "uri": "es.storj.io",
      "options": {
        "ssl": true
      }
    }
  },
  "types": [{
    "name": "report",
    "description": "Report data received from farmers"
  }],
}
```

## Initial Implementation
The initial implementation should include the following methods, services, and databases...

#### Methods
+ get
+ put

#### Services
+ Statusify
+ stat-generator (needs a better name)

#### Databases
+ MongoDB
