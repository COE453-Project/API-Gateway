const express = require('express');
const app = express();
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const cors = require('cors');

let fetch;

import('node-fetch').then(nodeFetch => {
  fetch = nodeFetch;
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
    medicines: [Medicine]
    oneMedicine(id: Int): Medicine
  }

  type Mutation {
    addMedicine(name: String, description: String, productionDate: String, expiryDate: String): Medicine
    updateMedicine(id: Int, name: String, description: String, productionDate: String, expiryDate: String): Medicine
    deleteMedicine(id: Int): Boolean
  }
`);

const root = {
  getMedicines: async () => {
    const response = await fetch('https://backend-get-all-medicines-olz2xjbmza-uc.a.run.app/');
    const data = await response.json();
    return data;
  },
  getOneMedicine: ({id}) => {
    return medicines.find(medicine => medicine.id === id);
  },
  addMedicine: ({name, description, productionDate, expiryDate}) => {
    const id = medicines.length + 1;
    const medicine = {id, name, description, productionDate, expiryDate, stored: 'yes', lastUpdate: new Date().toISOString(), status: 'active'};
    medicines.push(medicine);
    return medicine;
  },
  updateMedicine: ({id, name, description, productionDate, expiryDate}) => {
    const medicine = medicines.find(medicine => medicine.id === id);
    medicine.name = name;
    medicine.description = description;
    medicine.productionDate = productionDate;
    medicine.expiryDate = expiryDate;
    medicine.lastUpdate = new Date().toISOString();
    return medicine;
  },
  deleteMedicine: ({id}) => {
    medicines = medicines.filter(medicine => medicine.id !== id);
  }
}


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});