const express = require('express');
const cors = require('cors');
const dropdownRoutes = require('./routes/dropdownRoutes');
const roleRoutes = require('./routes/roleRoutes');
const employeeRoutes = require('./routes/employeeRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/Api/DropDown', dropdownRoutes);
app.use('/Api/Role', roleRoutes);
app.use('/Api/Employees', employeeRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
