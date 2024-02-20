const { Pool } = require('pg');

const pool = new Pool({
  user: 'ratemytutor',
  host: 'ratemytutor-db-instance.cn6kmc0ka3p3.us-east-2.rds.amazonaws.com',
  database: 'rate_my_tutor_db',
  password: 'ratemytutor',
  port: 5432, // Default PostgreSQL port
});

module.exports = pool;
