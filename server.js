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

app.use(cors());

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
    storedAtTimestamp: String
    lastUpdatedTimestamp: String
    expiryStatus: String
  }

  type Query {
    getMedicines(status: String): [Medicine]
    oneMedicine(id: Int): Medicine
  }

  type Mutation {
    addMedicine(name: String, description: String, productionDate: String, expiryDate: String): Medicine
    updateMedicine(id: Int, name: String, description: String, productionDate: String, expiryDate: String): Medicine
    deleteMedicine(id: Int): Boolean
  }
`);

const root = {
  
  async getMedicines({status}){
    try {
      const response = await got('https://backend-get-all-medicines-olz2xjbmza-uc.a.run.app/?status=' + status);
      const data = JSON.parse(response.body);
      return data;
    } catch (error) {
      console.error('Error:', error);
    }
  },

  async oneMedicine({ id }){
    try {
      console.log(id);
      console.log("Hello there")
      const response = await got('https://us-central1-coe453-project-423412-f0.cloudfunctions.net/Get-One-Medicine/'+id);
      const data = JSON.parse(response.body);
      return data;
    } catch (error) {
      console.error('Error:', error);
    }
  },

  async addMedicine({name, description, productionDate, expiryDate}){
    console.log(name);
    console.log(description);
    console.log(productionDate);
    console.log(expiryDate);
    try {
      const response = await got.post('https://backend-create-medicine-olz2xjbmza-uc.a.run.app', {
        json: {
          name: name,
          description: description,
          productionDate: productionDate,
          expiryDate: expiryDate
        }
      });
      const data = JSON.parse(response.body);
      return data;
    } catch (error) {
      console.error('Error:', error);
    }
  },

  async updateMedicine({id, name, description, productionDate, expiryDate}){
    try {
      const response = await got.put('https://backend-update-medicine-olz2xjbmza-uc.a.run.app/'+id, {
        json: {
          name: name,
          description: description,
          productionDate: productionDate,
          expiryDate: expiryDate
        }
      });
      const data = JSON.parse(response.body);
      return data;
    } catch (error) {
      console.error('Error:', error);
    }
  },

  async deleteMedicine({id}){
    try {
      const response = await got.delete('https://backend-delete-medicine-olz2xjbmza-uc.a.run.app/'+id);
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