[![Build Status](https://img.shields.io/travis/Storj/data-api.svg?branch=master&style=flat-square)](https://travis-ci.org/Storj/data-api)
[![Coverage Status](https://img.shields.io/coveralls/Storj/data-api.svg?style=flat-square)](https://coveralls.io/r/Storj/data-api)

# data-api

The Data API needs to be the layer that our apps go through to get data from our various data stores in a clean and consistent way. This will allow us to change the format of data behind the Data API while continuing to deliver the data in the same format to consumers of the Data API. This also allows us to control authentication and access to the back end databases and keep that auth out of our apps.

## Config

This application uses the 'config' module, which allows fine grained control over your config for various environments. You can use .json or .js files that start with the environment name (NODE_ENV), or you can use local.json or local.js to override the config for your local machine. All configs inherit from default.js, so you do not have to duplicate values. local.* is loaded last, and overrides other configs. config/local.* is also in .gitignore, so it is an ideal place for storing sensitive info.

## Backend Databases (Connectors)

Data-api is designed to work with multiple backends. You can specify more than one of each type below.

+ MongoDB
+ Elasticsearch
+ Easily extensible to other sources

## Clients

Client addresses and which methods they are allowed to call is configurable in... config!

+ Statusify - Writes reports to data-api
+ Audits? (not sure if this needs to pull data from here or the Storj API, or simply listen for events)
+ Accounting - Pulls stats and push accounting and payout data?
+ Data Publisher - Pull publishable stats and push to a publicly accessible place

## API Spec

### Communication
This should be implemented in JSON RPC

### Client Authentication
Authentication should be done by signing a nonce with private key on every transaction. It should mirror how we do authentication between farmers and Statusify.

~~We need to determine how to easily generate keys for new modules. We could drop in the module, which would create a key on the server side, (possibly have an admin user authorize the key creation with admin key) then move that key to the service.~~

We can generate keys and store them in the config/local.js of each system. This is in .gitignore.

### Request

```
{
  "method": "report.put",
  "id": 1234567,
  "params": {
    "address": "somefakeaddress",
    "message": "{\"farmer_id\": 12345, \"date_range\": { \"start\": \"startdatehere\", \"end\": \"enddatehere\" }, \"percent\": 99.999 }",
    "timestamp": "2016-04-14T13:05:29-04:00",
    "signature": "siggoeshere"
  }
}
```
+ address(STRING) - This is used to verify the signature
+ message(JSON STRING) - This is the data that we're pushing
+ method(STRING) - [get|put|list|status] (others?) This would let the data-api know if we want to pull or push data, or execute other methods

### Fields
| Name        | Type            | Description                                        |
| ------------|-----------------|----------------------------------------------------|
| method      | String          | JSON RPC Method to be called                       |
| id          | Int             | JSON RPC Call Id                                   |
| params      | JSON Object     | JSON Object containing service related data        |
| timestamp   | ISO8601 (String)| Timestamp marking the time of the request          |
| signature   | String          | Signature of (params - signature  )                |

### Methods
| Name         | Arguments           | Returns            | Description                                            |
| -------------|---------------------|--------------------|--------------------------------------------------------|
| report.put   |                     | JSON RPC formatted response | Submit a report. |
| list         |                     | JSON RPC formatted response | List of available methods for the client |
| status       |                     | JSON RPC formatted response | Status of the Data-api service |

### Params
| Parameter    | Type             | Description                                      |
| -------------|------------------|--------------------------------------------------|
| message      | JSON             | JSON to get or put                               |

#### Directory Structure
- data-api/
  - methods/
    - list.js
    - status.js
    - report/
      - get.js
      - put.js
  - models/
    - report

## Initial Implementation
The initial implementation should include the following methods, clients, and datastores...

#### Methods
+ list
+ status
+ report.put

#### Clients
+ Statusify

#### Datastores
+ MongoDB
