#!/bin/bash

curl -XPOST http://localhost:3000/  --header "Content-Type:application/json" -d '
{
  "method": "REPORT",
  "id": "965a1a28779e2a81b558d250e6da612e",
  "params": {
    "storage": {
      "free": -235924775577,
      "used": 235924775577
    },
    "contact": {
      "userAgent": "6.0.11",
      "protocol": "1.0.0",
      "address": "009s.storjlt.xyz",
      "port": 5101,
      "nodeID": "3b34ec02932daff43f92a1014b0c244de3a362d8",
      "lastSeen": 1483353745808
    },
    "payment": "AiZv91u42KI+yaMED/2xlJsh4G4TJM8JL0GFwpCjWehskwS9dFTXmi4/fb/2X7tYre+44ewkBe5mTFUrjxDbtoEu0DrfbeNMJY6aktvf4OZ0OWXQWLv2ZR65oEBkjGWihkbbIMzKfoIQl8elxOvplrNXwyPVWp7/Xm7UcFKxDx5I",
    "timestamp": 1483458457085,
    "signature": "IArd6tozl2Tzeocupb3MYMx6egTJZ1mwJD3uH58i2MEcSW/nGnPFQCFxBzUoNgdMvsSw5iA69/ajD9XbraSnVXg="
  }
}'

#{
#	"method": "REPORT",
#	"id": "965a1a28779e2a81b558d250e6da612e",
#	"params": {
#		"storage": {
#			"free": -235924775577,
#			"used": 235924775577
#		},
#		"contact": {
#			"userAgent": "6.0.11",
#			"protocol": "1.0.0",
#			"address": "009s.storjlt.xyz",
#			"port": 5101,
#			"nodeID": "3b34ec02932daff43f92a1014b0c244de3a362d8",
#			"lastSeen": 1483353745808
#		},
#		"payment": "AiZv91u42KI+yaMED/2xlJsh4G4TJM8JL0GFwpCjWehskwS9dFTXmi4/fb/2X7tYre+44ewkBe5mTFUrjxDbtoEu0DrfbeNMJY6aktvf4OZ0OWXQWLv2ZR65oEBkjGWihkbbIMzKfoIQl8elxOvplrNXwyPVWp7/Xm7UcFKxDx5I",
#		"timestamp": 1483458457085,
#		"signature": "IArd6tozl2Tzeocupb3MYMx6egTJZ1mwJD3uH58i2MEcSW/nGnPFQCFxBzUoNgdMvsSw5iA69/ajD9XbraSnVXg="
#  }
#}
#'
