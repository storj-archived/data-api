// DEFAULTS
// override this in `${environment}.js` or local.js

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
      host: 'http://localhost:9200'
    }
  },
  clients: {
    statusify: ['somefakeaddress']
  },
  methods: {
    list: true,
    status: true,
    'report.put': ['statusify']
  }
};

module.exports = config;
