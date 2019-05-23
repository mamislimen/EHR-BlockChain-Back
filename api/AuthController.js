var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const axios = require('axios');
var config = require('./config');
var VerifyToken = require('./VerifyToken');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json()); 
var ids=[];
var patients=[];
 
router.post ('/login',function(req,res)
{
 var auth= false;
 var token= null;
 var login=req.body.login;
 var password=req.body.password;
 
 async function getPatient(login,password) {
  return await axios.get('http://34.247.209.188:3000/api/Patient')
  .then( (response)=> {
    let crediential=[]
  response.data.forEach(function(user) {
    if(user.username===login && user.password===password)
    crediential.push(user);
   return crediential;
});
  }).catch(function (error) {
    // handle error
    console.log(error);
  });}

  async function getAdmin(login,password) {
    return await axios.get('http://34.247.209.188:3000/api/Admin')
    .then( (response)=> {
      let credientials=[]
    
    response.data.forEach(function(user) {
    
      if(user.username===login && user.password===password)
      credientials.push(user);
     return credientials;
  });
    }).catch(function (error) {
      // handle error
      console.log(error);
    });}

    axios.all([getPatient(login,password), getAdmin(login,password)])
  .then(axios.spread(function (patient, admin) {
    if (typeof patient !== 'undefined' && patient.length > 0) {
      var payload = {
        patientId: patient[0].patientId,
        user: 'patient',
       }; 
       token = jwt.sign(payload, config.secret, {
        expiresIn: 3600 // expires in 24 hours
      });
      
          res.status(200).send({ auth: true, token: token,user:'patient' });
  }else if (typeof admin !== 'undefined' && admin.length > 0) {
    var payload = {
      adminId: admin[0].adminId, 
      user: 'admin', 
  
     };
     token = jwt.sign(payload, config.secret, {
      expiresIn: 3600 // expires in 24 hours
    });
        res.status(200).send({ auth: true, token: token,user:'admin' });
}else
{
  res.status(200).send({ auth: false, token: null ,user:patient});
}
  }));
  
});
 

  router.get('/logout', function(req, res) {
    res.status(200).send({ auth: false, token: null });
  });
  router.get('/card', function(req, res) {
  
    res.status(200).send(ids);
    ids=[];
  });

  router.get('/card/:id', function(req, res) {
    ids.push(req.params.id);
    console.log(req.params.id);
    res.status(200).send({ id: req.params.id });
  });

 
  router.post ('/logincard',function(req,res)
{
 var auth= false;
 var token= null;
 var idcard1=req.body.idcard1;
 var idcard2=req.body.idcard2;
  

 async function getUser(idcard1) {
  return await axios.get('http://34.247.209.188:3000/api/Patient')
  .then( (response)=> {
    let u=[];
  response.data.forEach(function(user) {
   
    if(user.Emprunt===idcard1)
    u.push(user); 
    });
  return u;
  }).catch(function (error) {
    // handle error
    console.log(error);
  });
 
}

 async function getPract(idcard2) {
  return await axios.get('http://34.247.209.188:3000/api/Practitioner')
  .then( (response) =>{
    let pract=[];
  response.data.forEach(function(user) {
    if(user.Emprunt===idcard2)
    pract.push(user);
});
  return pract; 
  }).catch(function (error) {
    // handle error
    console.log(error);
  });
 

}
async function getPharmacy(idcard2) {
  return await axios.get('http://34.247.209.188:3000/api/Pharmacy')
  .then( (response) =>{
    let Phar=[];
  response.data.forEach(function(user) {
    if(user.Emprunt===idcard2)
    Phar.push(user);
});
  return Phar; 
  }).catch(function (error) {
    // handle error
    console.log(error);
  });
 

}
axios.all([getUser(idcard1), getPract(idcard2),getPharmacy(idcard2)])
  .then(axios.spread(function (users, practitioner,pharmacy) {
    if (typeof practitioner !== 'undefined' && practitioner.length > 0) {
      var payload = {
        patientId: users[0].patientId,
        pratitionerId: practitioner[0].pratitionerId,
        firstName:practitioner[0].firstName,
        lastName: practitioner[0].lastName,
        email: practitioner[0].email, 
        cin: practitioner[0].cin,
        phoneNumber: practitioner[0].phoneNumber,
        speciality: practitioner[0].speciality, 
        addressLine: practitioner[0].addressLine,
        user: 'practitioner',
       }; 
      token = jwt.sign(payload, config.secret, {
        expiresIn: 3600 // expires in 24 hours
      });
          res.status(200).send({ auth: true, token: token,user:'practitioner' });
  }else if (typeof pharmacy !== 'undefined' && pharmacy.length > 0) {
    var payload = {
      patientId: users[0].patientId,
      pharmacyId: pharmacy[0].pharmacyId,
      name:pharmacy[0].name,
      addressLine: pharmacy[0].addressLine,
      phoneNumber: pharmacy[0].phoneNumber, 
      user: 'pharmacy', 
  
     };
    token = jwt.sign(payload, config.secret, {
      expiresIn: 3600 // expires in 24 hours
    });
        res.status(200).send({ auth: true, token: token,user:'pharmacy' });
}else
{
  res.status(200).send({ auth: false, token: null });
}
  

  }));
 
 
  
})

  module.exports = router;