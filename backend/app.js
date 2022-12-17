const express = require('express');
const sequelize = require('./util/database');
const bodyParser = require('body-parser');
const cors = require('cors');

const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');
const purchaseRoutes = require('./routes/purchase')
const premiumFeaturesRoutes = require('./routes/premiumFeatures');
const User = require('./models/user');
const Expense = require('./models/expense');

const Order =require('./models/order');

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json({ extended: false }));
app.use('/user', userRoutes);
app.use('/expense', expenseRoutes);
app.use('/payment', purchaseRoutes);
app.use('/premium', premiumFeaturesRoutes);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

const port = 3000;

sequelize.sync().then(() => {
    console.log('Database connected!');
    app.listen(port, () => {
        console.log(`Server started at port: ${port}`);
    });
}).catch(err => {
    console.log('Error: ', err);
});

