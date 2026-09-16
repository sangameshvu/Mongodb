const express = require('express');

const adminRouter = require('./routes/admin');
const userRouter = require('./routes/user');

const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '.env') })

const app = express();

const PORT =process.env.PORT || 3000;
app.use(express.json());

app.use('/admin',adminRouter);
app.use('/user',userRouter);

app.listen(PORT,()=>{
    console.log(`Server is running @ PORT: ${PORT}`)
});
