import express from 'express';
const bodyParser = require('body-parser');
import routes from './routes/index.js';

const PORT = process.env.PORT || 5000;
const app = express();

app.use(bodyParser.json());
app.use('/', routes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
