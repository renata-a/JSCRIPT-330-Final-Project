const mongoose = require('mongoose');

beforeAll(async () => {
    await mongoose.connect('mongodb://localhost/final-database', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

afterAll(async () => {
    await mongoose.connection.close();
});

beforeEach(async () => {
    await mongoose.connection.db.dropDatabase();
});
