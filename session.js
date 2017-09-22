
exports.options = {
  host: 'lonch.cjt5lkku4gno.us-west-2.rds.amazonaws.com',
  user: 'lonch_master',
  password: 'M2H5hZmb',
  port: '3306', 
  database: 'lonch',
  checkExpirationInterval: 10000,
  cookie: {
    expires: 31536000000
  },
  schema: {
    tableName: 'sessions',
    columnNames: {
    session_id: 'session_id',
    expires: 'expires',
    data: 'data'
    }
  }
};

