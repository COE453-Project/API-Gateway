const express = require('express');
const app = express();
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const cors = require('cors');
const { createHandler } = require("graphql-http/lib/use/express");

let got;
import('got').then((gotModule) => {
  got = gotModule.default || gotModule;
});

app.use(cors({
  origin: 'http://localhost:3000'
}));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const schema = buildSchema(`

  type Medicine {
    id: Int
    name: String
    description: String
    productionDate: String
    expiryDate: String
    stored: String
    lastUpdate: String
    status: String
  }

  type Query {
    getMedicines: [Medicine]
    oneMedicine(id: Int): Medicine
  }

  type Mutation {
    addMedicine(name: String, description: String, productionDate: String, expiryDate: String): Medicine
    updateMedicine(id: Int, name: String, description: String, productionDate: String, expiryDate: String): Medicine
    deleteMedicine(id: Int): Boolean
  }
`);

const root = {
  
  async getMedicines(){
    try {
      const response = await got('https://backend-get-all-medicines-olz2xjbmza-uc.a.run.app/');
      const data = JSON.parse(response.body);
      return data;
    } catch (error) {
      console.error('Error:', error);
    }
  }

}

app.all(
  "/",
  createHandler({
    schema: schema,
    rootValue: root,
  })
)

app.listen(3001, () => {
    console.log('Server is running on port 3000');
});