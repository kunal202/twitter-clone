const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname+'/assets')))

router.get('/',(req, res)=>{
    res.sendFile(__dirname+'/index.html')
})

app.use('/', router);

app.listen(process.env.PORT||3000, ()=>{
  console.log('Port no is + http://localhost:3000/');
});