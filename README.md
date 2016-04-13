# data-api

The Data API needs to be the layer that our apps go through to get data from our various data stores in a clean and consistent way. This will allow us to change the format of data behind the Data API while continuing to deliver the data in the same format to consumers of the Data API. This also allows us to control authentication and access to the back end databases and keep that auth out of our apps.

## Backend Databases

+ MongoDB
+ Elasticsearch

## Data Consumers/Creators

+ Stats Generator - Pulls Stats from Data API and pushes to ES
+ Audits? (not sure if this needs to pull data from here or the Storj API, or simply listen for events)
+ Accounting - Pulls stats and push accounting and payout data?
+ Data Publisher - Pull publishable stats and push to a publicly accessible place

| Command      | Arguments           | Returns            | Description                                            |
| -------------|---------------------|--------------------|--------------------------------------------------------|
| get          | service, set_type   | json_object | Get a dataset for a particular service.                |
| put          | service, set_type   | response_code(int) | Submit data for a service of a particular type. |
