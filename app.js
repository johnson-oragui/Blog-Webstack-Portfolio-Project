require('dotenv').config();
import express from 'express';
import expressEjsLayouts from 'express-ejs-layouts'; 

// instance of express
const app = express();

// middle ware
app.use(expressEjsLayouts);

// port
const PORT = process.env.PORT || 5000;

// get methods
app.get('/', (req, res) => {
  res.send('hello world');
});

// event listener
app.listen(PORT, () => {
  console.log(`App running on http://localhost:${PORT}`);
});
