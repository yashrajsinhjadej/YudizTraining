const express = require('express');
const app = express();
const adminRoutes = require('./routes/admin'); // Import admin routes
const user = require('./routes/user');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/admin', adminRoutes); // Use admin routes

app.use('/user', user);



app.get('/health', (req, res) => {
    res.send('Health check passed');
});



app.listen(3000, () => {
    console.log('Server is running on port 3000');
});