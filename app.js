const express = require('express');

const app = express();
const port = process.env.PORT || 8080;

app.use(express.static('src'));

app.get('/', (req, res) => {
  res.render('index.html');
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
