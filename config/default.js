// DEFAULTS
// override this in `${environment}.js` or local.js
// see https://github.com/lorenwest/node-config

const config = {
  PORT: process.env.PORT || 3000,
  limits: {
    bodyParser: '1kb'
  },
  log: {
    timestamp: true,
    level: 'debug'
  },
  datastores: {
    mongodb: {
      type: 'mongodb',
      url: 'mongodb://localhost:27017/data-api',
      options: {},
      schemas: ['report']
    },
    elasticsearch: {
      type: 'elasticsearch',
      host: 'http://localhost:9200',
      apiVersion: '2.2',
      schemas: ['report']
    }
  },
  clients: {
    statusify: ['somefakeaddress']
  },
  methods: {
    list: true,
    status: true,
    'report.put': ['statusify'],
    'report.get': []
  }
};

module.exports = config;
