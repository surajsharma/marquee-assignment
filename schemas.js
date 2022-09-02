const company_table = `            
  "id" SERIAL,
  "name" VARCHAR(256) NOT NULL,
  "cin" VARCHAR(21) UNIQUE NOT NULL,
  PRIMARY KEY ("id") 
`;

module.exports = { company_table };
