const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');
const patternRoutes = require('./routes/pattern');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost/final-database', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Routes
app.use('/users', userRoutes);
app.use('/patterns', patternRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;


