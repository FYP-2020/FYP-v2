if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }

var express = require('express');
var app = express();
app.set('view engine','ejs');
app.use(express.static('./public'));
app.listen(3000);
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended:false});
app.use(bodyParser.urlencoded({ extended: false })) // parse application/x-www-form-urlencoded
app.use(bodyParser.json()) 
var mysql = require('mysql');
var nodemailer = require('nodemailer');
var cron = require('node-cron');
const session = require('express-session');
const passport = require('passport');
//var LocalStrategy = require('passport-local').Strategy;
var MySQLStore = require('express-mysql-session')(session);
console.log(new Date());

var mysqlConnection = mysql.createConnection({
host : 'db4free.net',
 user: 'amirahfatin',
 password: 'kyochonpedas',
  database: 'fyp2020',
  multipleStatements: true
});

var options = {
  host : 'db4free.net',
   user: 'amirahfatin',
   password: 'kyochonpedas',
    database: 'fyp2020',
  
  };

var sessionStore = new MySQLStore(options);

mysqlConnection.connect((err) => {
  if (!err)
      console.log('DB connection succeeded.');
  else
      console.log('DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2));
});


const initializePassport = require('./passport-config')

const users = [];
const u =[];
 
mysqlConnection.query("select * from userprofile", function(err, rows){
  if(err) {
    throw err;
  } else {
    setValue(rows);
  }
});

function setValue(value) {
  users.push(value);


  for (var i=0; i<users[0].length;i++){
      u.push(users[0][i])


  }
}

initializePassport(
  passport,
  name => u.find(user => user.name === name),
  id => u.find(user => user.user_id === id)
)


function checkAuthenticated(req, res, next) {// if user not logged in but try to open page
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/')
}

function checkNotAuthenticated(req, res, next) {// if user already login but try open login page
  if (req.isAuthenticated()) {
    return res.redirect('/keseluruhanProgresTugasan')
  }
  next()
}



//module.exports = (function(app){
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  //store: sessionStore,
  saveUninitialized: false,
 // cookie: { secure: true }
}))
app.use(passport.initialize());
app.use(passport.session());
//app.use(methodOverride('_method'))


  
  function authRole(role) {//check role
  // console.log(person);

  return (req, res, next) => {
    console.log(req.user.role);
  if (req.user.role !== role) {
  res.status(401)
  // return res.send('Not allowed')
  res.render('denied.ejs')
  }
  
   next()
  }
  }

  var totalapp = [];
 
 mysqlConnection.query('SELECT * from leaveApplication WHERE applydate!="default" ', function(err, rows){
  if(err) {
    throw err;
  } else {
   totalapp.push(rows);
  
  }
});


 app.get('/logout', (req, res) => {
    //person = [];
    req.logOut()
    res.redirect('/');
    })
   
  
app.get('/',checkNotAuthenticated, (req, res) => {
  res.render('login.ejs');
  })
  app.get('/error', (req, res) => {
    res.render('error.ejs');
    })

    //====================== E TUGASAN=========================================================================
// =====================================================================================================================================================================================
// ===================================================================================Homepage==========================================================================================
// =====================================================================================================================================================================================
  app.get('/keseluruhanProgresTugasan',checkAuthenticated,(req,res)=>{
    var name = req.user.fullname;
    mysqlConnection.query('SELECT COUNT(DISTINCT uniqueID) as tempID, SUM(taskpoints) as total, COUNT(uniqueID) as totalTitle, title as newTitle, taskname, uniqueID, collaborators, SUM(completion) as completiontask, teamDateCompletion, dueDate FROM taskProgress GROUP BY title, uniqueID, collaborators, teamDateCompletion, dueDate, taskname' , function(error, results, fields) {
      res.render('keseluruhanProgresTugasan.ejs', {
        taskProgress : results,
        name:name
      });
     });
    
})

// =====================================================================================================================================================================================
// ===================================================================================StatusBebananKeseluruhan==========================================================================================
// =====================================================================================================================================================================================
app.get('/agihanTugasanKeseluruhan',checkAuthenticated,(req,res)=>{
  var name = req.user.fullname;
  let today = new Date()
  var month = new Array(12)
  month[0]= "January"
  month[1]= "February"
  month[2]= "March"
  month[3]= "April"
  month[4]= "May"
  month[5]= "June"
  month[6]= "July"
  month[7]= "August"
  month[8]= "September"
  month[9]= "October"
  month[10]= "November"
  month[11]= "December"
  var bulan = month[today.getMonth()]
  console.log(bulan);

  mysqlConnection.query('SELECT name,peratus,mesyuaratdetail,tinggidetail,sederhanadetail,rendahdetail FROM taskpoint WHERE month=? AND Category!="" ORDER BY peratus DESC' , [bulan],function(error, results, fields) {
    res.render('agihanTugasanKeseluruhan.ejs', {
      taskpoint : results,
      name: name
    });
   });
  
})


 

  app.post('/keseluruhanProgresTugasan',passport.authenticate('local',{
    successRedirect: '/keseluruhanProgresTugasan',
    failureRedirect:'/error'
  }));

  // =====================================================================================================================================================================================
// ===================================================================================Ketersediaan======================================================================================
// =====================================================================================================================================================================================
app.get('/admin_ketersediaanKakitangan',checkAuthenticated,(req,res)=>{
  var name = req.user.fullname;
  mysqlConnection.query('SELECT A.name as name, A.day as day, A.slot_1 AS slot_1, A.slot_2 AS slot_2, A.slot_3 AS slot_3, A.slot_4 AS slot_4, A.slot_5 AS slot_5, A.slot_6 AS slot_6, A.slot_7 AS slot_7, A.slot_8 AS slot_8, A.slot_9 AS slot_9, A.slot_10 AS slot_10, A.slot_11 AS slot_11, A.slot_12 AS slot_12, A.slot_13 AS slot_13, A.slot_14 AS slot_14, A.slot_15 AS slot_15, A.slot_16 AS slot_16, A.slot_17 AS slot_17, A.slot_18 AS slot_18, A.slot_19 AS slot_19, A.slot_20 AS slot_20, A.slot_21 AS slot_21, A.slot_22 AS slot_22, (SELECT C.peratus FROM taskpoint C WHERE C.name = A.name AND C.month = "January") AS percentage1, (SELECT C.peratus FROM taskpoint C WHERE C.name = A.name AND C.month = "February") AS percentage2, (SELECT C.peratus FROM taskpoint C WHERE C.name = A.name AND C.month = "March") AS percentage3, (SELECT C.peratus FROM taskpoint C WHERE C.name = A.name AND C.month = "April") AS percentage4, (SELECT C.peratus FROM taskpoint C WHERE C.name = A.name AND C.month = "May") AS percentage5, (SELECT C.peratus FROM taskpoint C WHERE C.name = A.name AND C.month = "June") AS percentage6, (SELECT C.peratus FROM taskpoint C WHERE C.name = A.name AND C.month = "July") AS percentage7, (SELECT C.peratus FROM taskpoint C WHERE C.name = A.name AND C.month = "August") AS percentage8, (SELECT C.peratus FROM taskpoint C WHERE C.name = A.name AND C.month = "September") AS percentage9, (SELECT C.peratus FROM taskpoint C WHERE C.name = A.name AND C.month = "October") AS percentage10, (SELECT C.peratus FROM taskpoint C WHERE C.name = A.name AND C.month = "November") AS percentage11, (SELECT C.peratus FROM taskpoint C WHERE C.name = A.name AND C.month = "December") AS percentage12 FROM availabilityStaff A WHERE A.type = "Comp" ORDER BY (SELECT C.peratus FROM taskpoint C WHERE C.name = A.name AND C.month = "January"), (SELECT C.peratus FROM taskpoint C WHERE C.name = A.name AND C.month = "February"), (SELECT C.peratus FROM taskpoint C WHERE C.name = A.name AND C.month = "March"), (SELECT C.peratus FROM taskpoint C WHERE C.name = A.name AND C.month = "April"), (SELECT C.peratus FROM taskpoint C WHERE C.name = A.name AND C.month = "May"), (SELECT C.peratus FROM taskpoint C WHERE C.name = A.name AND C.month = "June"), (SELECT C.peratus FROM taskpoint C WHERE C.name = A.name AND C.month = "July"), (SELECT C.peratus FROM taskpoint C WHERE C.name = A.name AND C.month = "August") , (SELECT C.peratus FROM taskpoint C WHERE C.name = A.name AND C.month = "September"), (SELECT C.peratus FROM taskpoint C WHERE C.name = A.name AND C.month = "October"), (SELECT C.peratus FROM taskpoint C WHERE C.name = A.name AND C.month = "November"), (SELECT C.peratus FROM taskpoint C WHERE C.name = A.name AND C.month = "December")' , function(error, results, fields) {
    res.render('admin_ketersediaanKakitangan.ejs', {
      availabilityStaff : results,
      name:name
    });
   });
  
})

 // =====================================================================================================================================================================================
// ===================================================================================Tugasan===========================================================================================
// =====================================================================================================================================================================================
app.get('/admin_aturTugasan',checkAuthenticated,function(req,res){
  var name = req.user.fullname;
  mysqlConnection.query('SELECT A.name as name, A.day as day, A.slot_1 AS slot_1, A.slot_2 AS slot_2, A.slot_3 AS slot_3, A.slot_4 AS slot_4, A.slot_5 AS slot_5, A.slot_6 AS slot_6, A.slot_7 AS slot_7, A.slot_8 AS slot_8, A.slot_9 AS slot_9, A.slot_10 AS slot_10, A.slot_11 AS slot_11, A.slot_12 AS slot_12, A.slot_13 AS slot_13, A.slot_14 AS slot_14, A.slot_15 AS slot_15, A.slot_16 AS slot_16, A.slot_17 AS slot_17, A.slot_18 AS slot_18, A.slot_19 AS slot_19, A.slot_20 AS slot_20, A.slot_21 AS slot_21, A.slot_22 AS slot_22, (SELECT C.peratus FROM taskpoint C WHERE C.name = A.name AND C.month = "January") AS percentage1, (SELECT C.peratus FROM taskpoint C WHERE C.name = A.name AND C.month = "February") AS percentage2, (SELECT C.peratus FROM taskpoint C WHERE C.name = A.name AND C.month = "March") AS percentage3, (SELECT C.peratus FROM taskpoint C WHERE C.name = A.name AND C.month = "April") AS percentage4, (SELECT C.peratus FROM taskpoint C WHERE C.name = A.name AND C.month = "May") AS percentage5, (SELECT C.peratus FROM taskpoint C WHERE C.name = A.name AND C.month = "June") AS percentage6, (SELECT C.peratus FROM taskpoint C WHERE C.name = A.name AND C.month = "July") AS percentage7, (SELECT C.peratus FROM taskpoint C WHERE C.name = A.name AND C.month = "August") AS percentage8, (SELECT C.peratus FROM taskpoint C WHERE C.name = A.name AND C.month = "September") AS percentage9, (SELECT C.peratus FROM taskpoint C WHERE C.name = A.name AND C.month = "October") AS percentage10, (SELECT C.peratus FROM taskpoint C WHERE C.name = A.name AND C.month = "November") AS percentage11, (SELECT C.peratus FROM taskpoint C WHERE C.name = A.name AND C.month = "December") AS percentage12 FROM availabilityStaff A WHERE A.type = "Comp" ORDER BY (SELECT C.peratus FROM taskpoint C WHERE C.name = A.name AND C.month = "January"), (SELECT C.peratus FROM taskpoint C WHERE C.name = A.name AND C.month = "February"), (SELECT C.peratus FROM taskpoint C WHERE C.name = A.name AND C.month = "March"), (SELECT C.peratus FROM taskpoint C WHERE C.name = A.name AND C.month = "April"), (SELECT C.peratus FROM taskpoint C WHERE C.name = A.name AND C.month = "May"), (SELECT C.peratus FROM taskpoint C WHERE C.name = A.name AND C.month = "June"), (SELECT C.peratus FROM taskpoint C WHERE C.name = A.name AND C.month = "July"), (SELECT C.peratus FROM taskpoint C WHERE C.name = A.name AND C.month = "August") , (SELECT C.peratus FROM taskpoint C WHERE C.name = A.name AND C.month = "September"), (SELECT C.peratus FROM taskpoint C WHERE C.name = A.name AND C.month = "October"), (SELECT C.peratus FROM taskpoint C WHERE C.name = A.name AND C.month = "November"), (SELECT C.peratus FROM taskpoint C WHERE C.name = A.name AND C.month = "December")'  , function(error, results, fields) {
    res.render('admin_aturTugasan.ejs', {
    availabilityStaff : results,
    name:name
    });
  });
});

app.get('/admin_pengurusanTugas', checkAuthenticated, function(req,res){
  var name = req.user.fullname;
  console.log(name); 
  
  mysqlConnection.query('SELECT A.id AS id, A.uniqueID AS uniqueID, A.task AS task, A.date AS date, A.timeFrom AS timeFrom, A.timeUntil AS timeUntil, A.location AS location, A.title AS title, A.note AS note, A.dueDate AS dueDate, A.tahap AS tahap, A.agenda AS agenda, A.names AS names, A.role AS role, A.owner_name AS owner_name, B.taskowner AS taskowner, B.status AS status FROM tasksMgmt A LEFT JOIN taskProgress B ON A.uniqueID = B.uniqueID WHERE A.names  LIKE '+mysqlConnection.escape('%'+name+'%')+'OR A.owner_name LIKE'+mysqlConnection.escape('%'+name+'%')+'OR B.taskowner LIKE'+mysqlConnection.escape('%'+name+'%')+'GROUP BY A.id, A.uniqueID, A.task, A.date, A.timeFrom, A.timeUntil, A.title, A.note, A.dueDate, A.tahap, A.agenda, A.names, A.role, A.owner_name, B.status, B.taskowner', function(error, results, fields) {
      res.render('admin_pengurusanTugas.ejs', { 
                   tasksMgmt: results,
                   name: name
      });
    });
  });

  app.get('/kemaskiniProgresTugasan', checkAuthenticated, function(req,res){
    var assigner;
    var owner;
    var name = req.user.fullname;
    console.log(name); 
    
    // "SELECT * FROM card WHERE name LIKE " + connection.escape('%'+req.body.search+'%')
      mysqlConnection.query('SELECT * FROM taskProgress WHERE taskowner LIKE '+mysqlConnection.escape('%'+name+'%'), function(error, results, fields) {
        res.render('kemaskiniProgresTugasan.ejs', { 
                     taskProgress: results,
                     name: name
        });
      });
    });

    app.get('/updateProgress/(:id)',checkAuthenticated,function(req, res, next) {

      let id_uniqueID_status = req.params.id;
      var aftersplit = id_uniqueID_status.split("_");
      var id = parseInt(aftersplit[0]); 
      var uniqueID = aftersplit[1];
      var status = aftersplit[2];
  
      var points = 0;
      var completion = 0;
      var teamDateCompletion;
  
      if(status == "Belum Mula"){
        points = 0;
        completion = 0;
  
        let form_data = {
            status: status,
            taskpoints: points,
            completion: completion
        }
  
          mysqlConnection.query('UPDATE taskProgress SET ? WHERE id = ' + id, form_data, function(err, result) {
          //if(err) throw err
          if (err) {
              res.redirect('/kemaskiniProgresTugasan')
          } else {
  
              res.redirect('/kemaskiniProgresTugasan')
              console.log("one task sucessfully updated")
          }
      })
      }
       
      else if(status == "Sedang Dijalankan"){
        points= 50;
        completion = 0;
  
        let form_data = {
            status: status,
            taskpoints: points,
            completion: completion
        }
  
          mysqlConnection.query('UPDATE taskProgress SET ? WHERE id = ' + id, form_data, function(err, result) {
          //if(err) throw err
          if (err) {
              res.redirect('/kemaskiniProgresTugasan')
          } else {
  
              res.redirect('/kemaskiniProgresTugasan')
              console.log("one task sucessfully updated")
          }
      })
  
      }
  
      else if(status == "Selesai"){
        points = 100;
        completion = 1;
        teamDateCompletion = new Date().toISOString().slice(0, 10);
  
        let form_data = {
            status: status,
            taskpoints: points,
            completion: completion
        }
  
        let teamCompletion = {
          teamDateCompletion: new Date().toISOString().slice(0, 10)
        }
  
         mysqlConnection.query('UPDATE taskProgress SET ? WHERE uniqueID IN(?) ' ,[teamCompletion, uniqueID], function(error, results, fields){
              if(error) throw error;
              console.log("Team Completion date is updated");
              });
  
  
          mysqlConnection.query('UPDATE taskProgress SET ? WHERE id = ' + id, form_data, function(err, result) {
          //if(err) throw err
          if (err) {
              res.redirect('/kemaskiniProgresTugasan')
          } else {
  
              res.redirect('/kemaskiniProgresTugasan')
              console.log("one task sucessfully updated")
          }
      })
  
      } 
      
  })    

  app.get('/delete/(:id)', function(req, res, next) {

    var id_timeFrom_timeUntil_date_names_tahap = req.params.id;
    var aftersplit = id_timeFrom_timeUntil_date_names_tahap.split("_");
    var id = parseInt(aftersplit[0]);
    var timeFrom = aftersplit[1];
    var timeUntil = aftersplit[2];
    var date = aftersplit[3];
    var name1 = aftersplit[4];
    var tahap = aftersplit[5];
    var title = aftersplit[6];
    var comma = ",";
    var con_date = comma.concat(date);

    var name2 = name1.replace("[","");
    var name3 = name2.replace("]","");
    var search = '"';
    var replaceWith = '';
    var name4 = name3.split(search).join(replaceWith);
    var nameArr = [];
    nameArr.push(name4.split(","));

    var start = 0;
    var finish = 0;

    var getDate = new Date(date);
    var weekday = new Array(7);
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";

    var day = weekday[getDate.getDay()];

    var timeFrom_ar = ["7:30", "8:00", "8:30", "9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", 
            "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"];

    var timeUntil_ar = ["8:00", "8:30", "9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", 
            "16:00", "16:30", "17:00", "17:30", "18:00", "18:30"];

    for (var i = 0; i < timeFrom_ar.length; i++)  { 
      if(timeFrom_ar[i] == timeFrom)
        {start = i+1;} //1
      }

    for (var i = 0; i < timeUntil_ar.length; i++) {       
    if(timeUntil_ar[i] == timeUntil)
      {finish = i+1;} //22
    }

    var range = finish - start;
  
  console.log(con_date);
  console.log(day);
  console.log(name4);
  console.log(timeFrom);
  console.log(timeUntil);
  console.log(start);
  console.log(range);


    for(var p = 0; p< nameArr.length; p++) { 

      for(var j = 0; j< nameArr[p].length; j++) {
        console.log(nameArr[p][j]);

         if(tahap == "Tinggi"){
            mysqlConnection.query('UPDATE taskpoint SET tinggi = tinggi-1, tinggidetail = replace(tinggidetail, ?, ""), peratus = peratus-3 WHERE name = ?'
            ,[title, nameArr[p][j]], function(error, results, fields){
                if(error) throw error;
                console.log("task points is updated");
            })
            }

            else if(tahap == "Sederhana"){
            mysqlConnection.query('UPDATE taskpoint SET sederhana = sederhana-1, sederhanadetail = replace(sederhanadetail, ?, ""), peratus = peratus-2 WHERE name = ?'
            ,[title, nameArr[p][j]], function(error, results, fields){
                if(error) throw error;
                console.log("task points is updated");
            })
            }

            else if(tahap == "Rendah" || tahap == "Sangat Rendah"){
            mysqlConnection.query('UPDATE taskpoint SET rendah = rendah-1, rendahdetail = replace(rendahdetail, ?, ""), peratus = peratus-1 WHERE name = ?'
            ,[title, nameArr[p][j]], function(error, results, fields){
                if(error) throw error;
                console.log("task points is updated");
            })
            }

        if (range == 0){
          mysqlConnection.query('UPDATE availabilityStaff SET slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", "") WHERE name LIKE '+mysqlConnection.escape('%'+nameArr[p][j]+'%')+' AND type = "Comp" AND day IN (?)'
            ,[start, start, con_date, start, start, day], function(error, results, fields){
                if(error) throw error;
                console.log("Availability Staff is updated");
          });
         }

        if (range == 1){
        mysqlConnection.query('UPDATE availabilityStaff SET slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", "") WHERE name LIKE '+mysqlConnection.escape('%'+nameArr[p][j]+'%')+' AND type = "Comp" AND day IN (?)'
          ,[start, start, con_date, start, start, (start+1), (start+1), con_date, (start+1), (start+1), day], function(error, results, fields){
              if(error) throw error;
              console.log("Availability Staff is updated");
        });
       }
     
     if (range == 2){
        mysqlConnection.query('UPDATE availabilityStaff SET slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", "") WHERE name LIKE '+mysqlConnection.escape('%'+nameArr[p][j]+'%')+' AND type = "Comp" AND day IN (?)'
          ,[start, start, con_date, start, start, (start+1), (start+1), con_date, (start+1), (start+1), (start+2), (start+2), con_date, (start+2), (start+2), day], function(error, results, fields){
              if(error) throw error;
              console.log("Availability Staff is updated");
        });
       }
     
     if (range == 3){
        mysqlConnection.query('UPDATE availabilityStaff SET slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", "") WHERE name LIKE '+mysqlConnection.escape('%'+nameArr[p][j]+'%')+' AND type = "Comp" AND day IN (?)'
          ,[start, start, con_date, start, start, (start+1), (start+1), con_date, (start+1), (start+1), (start+2), (start+2), con_date, (start+2), (start+2), (start+3), (start+3), con_date, (start+3), (start+3), day], function(error, results, fields){
              if(error) throw error;
              console.log("Availability Staff is updated");
        });
       }
     
     if (range == 4){
        mysqlConnection.query('UPDATE availabilityStaff SET slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", "") WHERE name LIKE '+mysqlConnection.escape('%'+nameArr[p][j]+'%')+' AND type = "Comp" AND day IN (?)'
          ,[start, start, con_date, start, start, (start+1), (start+1), con_date, (start+1), (start+1), (start+2), (start+2), con_date, (start+2), (start+2), (start+3), (start+3), con_date, (start+3), (start+3), (start+4), (start+4), con_date, (start+4), (start+4), day], function(error, results, fields){
              if(error) throw error;
              console.log("Availability Staff is updated");
        });
       }
     
     if (range == 5){
        mysqlConnection.query('UPDATE availabilityStaff SET slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", "") WHERE name LIKE '+mysqlConnection.escape('%'+nameArr[p][j]+'%')+' AND type = "Comp" AND day IN (?)'
          ,[start, start, con_date, start, start, (start+1), (start+1), con_date, (start+1), (start+1), (start+2), (start+2), con_date, (start+2), (start+2), (start+3), (start+3), con_date, (start+3), (start+3), (start+4), (start+4), con_date, (start+4), (start+4), (start+5), (start+5), con_date, (start+5), (start+5), day], function(error, results, fields){
              if(error) throw error;
              console.log("Availability Staff is updated");
        });
       }
     
     if (range == 6){
        mysqlConnection.query('UPDATE availabilityStaff SET slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", "") WHERE name LIKE '+mysqlConnection.escape('%'+nameArr[p][j]+'%')+' AND type = "Comp" AND day IN (?)'
          ,[start, start, con_date, start, start, (start+1), (start+1), con_date, (start+1), (start+1), (start+2), (start+2), con_date, (start+2), (start+2), (start+3), (start+3), con_date, (start+3), (start+3), (start+4), (start+4), con_date, (start+4), (start+4), (start+5), (start+5), con_date, (start+5), (start+5), (start+6), (start+6), con_date, (start+6), (start+6), day], function(error, results, fields){
              if(error) throw error;
              console.log("Availability Staff is updated");
        });
       }
     
     if (range == 7){
        mysqlConnection.query('UPDATE availabilityStaff SET slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", "") WHERE name LIKE '+mysqlConnection.escape('%'+nameArr[p][j]+'%')+' AND type = "Comp" AND day IN (?)'
          ,[start, start, con_date, start, start, (start+1), (start+1), con_date, (start+1), (start+1), (start+2), (start+2), con_date, (start+2), (start+2), (start+3), (start+3), con_date, (start+3), (start+3), (start+4), (start+4), con_date, (start+4), (start+4), (start+5), (start+5), con_date, (start+5), (start+5), (start+6), (start+6), con_date, (start+6), (start+6), (start+7), (start+7), con_date, (start+7), (start+7), day], function(error, results, fields){
              if(error) throw error;
              console.log("Availability Staff is updated");
        });
       }
     
     if (range == 8){
        mysqlConnection.query('UPDATE availabilityStaff SET slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", "") WHERE name LIKE '+mysqlConnection.escape('%'+nameArr[p][j]+'%')+' AND type = "Comp" AND day IN (?)'
          ,[start, start, con_date, start, start, (start+1), (start+1), con_date, (start+1), (start+1), (start+2), (start+2), con_date, (start+2), (start+2), (start+3), (start+3), con_date, (start+3), (start+3), (start+4), (start+4), con_date, (start+4), (start+4), (start+5), (start+5), con_date, (start+5), (start+5), (start+6), (start+6), con_date, (start+6), (start+6), (start+7), (start+7), con_date, (start+7), (start+7), (start+8), (start+8), con_date, (start+8), (start+8), day], function(error, results, fields){
              if(error) throw error;
              console.log("Availability Staff is updated");
        });
       }
     
     if (range == 9){
        mysqlConnection.query('UPDATE availabilityStaff SET slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", "") WHERE name LIKE '+mysqlConnection.escape('%'+nameArr[p][j]+'%')+' AND type = "Comp" AND day IN (?)'
          ,[start, start, con_date, start, start, (start+1), (start+1), con_date, (start+1), (start+1), (start+2), (start+2), con_date, (start+2), (start+2), (start+3), (start+3), con_date, (start+3), (start+3), (start+4), (start+4), con_date, (start+4), (start+4), (start+5), (start+5), con_date, (start+5), (start+5), (start+6), (start+6), con_date, (start+6), (start+6), (start+7), (start+7), con_date, (start+7), (start+7), (start+8), (start+8), con_date, (start+8), (start+8), (start+9), (start+9), con_date, (start+9), (start+9), day], function(error, results, fields){
              if(error) throw error;
              console.log("Availability Staff is updated");
        });
       }
     
     if (range == 10){
        mysqlConnection.query('UPDATE availabilityStaff SET slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", "") WHERE name LIKE '+mysqlConnection.escape('%'+nameArr[p][j]+'%')+' AND type = "Comp" AND day IN (?)'
          ,[start, start, con_date, start, start, (start+1), (start+1), con_date, (start+1), (start+1), (start+2), (start+2), con_date, (start+2), (start+2), (start+3), (start+3), con_date, (start+3), (start+3), (start+4), (start+4), con_date, (start+4), (start+4), (start+5), (start+5), con_date, (start+5), (start+5), (start+6), (start+6), con_date, (start+6), (start+6), (start+7), (start+7), con_date, (start+7), (start+7), (start+8), (start+8), con_date, (start+8), (start+8), (start+9), (start+9), con_date, (start+9), (start+9),(start+10), (start+10), con_date, (start+10), (start+10), day], function(error, results, fields){
              if(error) throw error;
              console.log("Availability Staff is updated");
        });
       }
     
     if (range == 11){
        mysqlConnection.query('UPDATE availabilityStaff SET slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", "") WHERE name LIKE '+mysqlConnection.escape('%'+nameArr[p][j]+'%')+' AND type = "Comp" AND day IN (?)'
          ,[start, start, con_date, start, start, (start+1), (start+1), con_date, (start+1), (start+1), (start+2), (start+2), con_date, (start+2), (start+2), (start+3), (start+3), con_date, (start+3), (start+3), (start+4), (start+4), con_date, (start+4), (start+4), (start+5), (start+5), con_date, (start+5), (start+5), (start+6), (start+6), con_date, (start+6), (start+6), (start+7), (start+7), con_date, (start+7), (start+7), (start+8), (start+8), con_date, (start+8), (start+8), (start+9), (start+9), con_date, (start+9), (start+9), (start+10), (start+10), con_date, (start+10), (start+10), (start+11), (start+11), con_date, (start+11), (start+11), day], function(error, results, fields){
              if(error) throw error;
              console.log("Availability Staff is updated");
        });
       }
     
     if (range == 12){
        mysqlConnection.query('UPDATE availabilityStaff SET slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", "") WHERE name LIKE '+mysqlConnection.escape('%'+nameArr[p][j]+'%')+' AND type = "Comp" AND day IN (?)'
          ,[start, start, con_date, start, start, (start+1), (start+1), con_date, (start+1), (start+1), (start+2), (start+2), con_date, (start+2), (start+2), (start+3), (start+3), con_date, (start+3), (start+3), (start+4), (start+4), con_date, (start+4), (start+4), (start+5), (start+5), con_date, (start+5), (start+5), (start+6), (start+6), con_date, (start+6), (start+6), (start+7), (start+7), con_date, (start+7), (start+7), (start+8), (start+8), con_date, (start+8), (start+8), (start+9), (start+9), con_date, (start+9), (start+9), (start+10), (start+10), con_date, (start+10), (start+10), (start+11), (start+11), con_date, (start+11), (start+11), (start+12), (start+12), con_date, (start+12), (start+12), day], function(error, results, fields){
              if(error) throw error;
              console.log("Availability Staff is updated");
        });
       }
     
     if (range == 13){
        mysqlConnection.query('UPDATE availabilityStaff SET slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", "") WHERE name LIKE '+mysqlConnection.escape('%'+nameArr[p][j]+'%')+' AND type = "Comp" AND day IN (?)'
          ,[start, start, con_date, start, start, (start+1), (start+1), con_date, (start+1), (start+1), (start+2), (start+2), con_date, (start+2), (start+2), (start+3), (start+3), con_date, (start+3), (start+3), (start+4), (start+4), con_date, (start+4), (start+4), (start+5), (start+5), con_date, (start+5), (start+5), (start+6), (start+6), con_date, (start+6), (start+6), (start+7), (start+7), con_date, (start+7), (start+7), (start+8), (start+8), con_date, (start+8), (start+8), (start+9), (start+9), con_date, (start+9), (start+9), (start+10), (start+10), con_date, (start+10), (start+10), (start+11), (start+11), con_date, (start+11), (start+11), (start+12), (start+12), con_date, (start+12), (start+12),(start+13), (start+13), con_date, (start+13), (start+13), day], function(error, results, fields){
              if(error) throw error;
              console.log("Availability Staff is updated");
        });
       }
     
     if (range == 14){
        mysqlConnection.query('UPDATE availabilityStaff SET slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", "") WHERE name LIKE '+mysqlConnection.escape('%'+nameArr[p][j]+'%')+' AND type = "Comp" AND day IN (?)'
          ,[start, start, con_date, start, start, (start+1), (start+1), con_date, (start+1), (start+1), (start+2), (start+2), con_date, (start+2), (start+2), (start+3), (start+3), con_date, (start+3), (start+3), (start+4), (start+4), con_date, (start+4), (start+4), (start+5), (start+5), con_date, (start+5), (start+5), (start+6), (start+6), con_date, (start+6), (start+6), (start+7), (start+7), con_date, (start+7), (start+7), (start+8), (start+8), con_date, (start+8), (start+8), (start+9), (start+9), con_date, (start+9), (start+9), (start+10), (start+10), con_date, (start+10), (start+10), (start+11), (start+11), con_date, (start+11), (start+11), (start+12), (start+12), con_date, (start+12), (start+12),(start+13), (start+13), con_date, (start+13), (start+13),(start+14), (start+14), con_date, (start+14), (start+14), day], function(error, results, fields){
              if(error) throw error;
              console.log("Availability Staff is updated");
        });
       }
     
     if (range == 15){
        mysqlConnection.query('UPDATE availabilityStaff SET slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", "") WHERE name LIKE '+mysqlConnection.escape('%'+nameArr[p][j]+'%')+' AND type = "Comp" AND day IN (?)'
          ,[start, start, con_date, start, start, (start+1), (start+1), con_date, (start+1), (start+1), (start+2), (start+2), con_date, (start+2), (start+2), (start+3), (start+3), con_date, (start+3), (start+3), (start+4), (start+4), con_date, (start+4), (start+4), (start+5), (start+5), con_date, (start+5), (start+5), (start+6), (start+6), con_date, (start+6), (start+6), (start+7), (start+7), con_date, (start+7), (start+7), (start+8), (start+8), con_date, (start+8), (start+8), (start+9), (start+9), con_date, (start+9), (start+9), (start+10), (start+10), con_date, (start+10), (start+10), (start+11), (start+11), con_date, (start+11), (start+11), (start+12), (start+12), con_date, (start+12), (start+12),(start+13), (start+13), con_date, (start+13), (start+13),(start+14), (start+14), con_date, (start+14), (start+14),(start+15), (start+15), con_date, (start+15), (start+15), day], function(error, results, fields){
              if(error) throw error;
              console.log("Availability Staff is updated");
        });
       }
     
     if (range == 16){
        mysqlConnection.query('UPDATE availabilityStaff SET slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", "") WHERE name LIKE '+mysqlConnection.escape('%'+nameArr[p][j]+'%')+' AND type = "Comp" AND day IN (?)'
          ,[start, start, con_date, start, start, (start+1), (start+1), con_date, (start+1), (start+1), (start+2), (start+2), con_date, (start+2), (start+2), (start+3), (start+3), con_date, (start+3), (start+3), (start+4), (start+4), con_date, (start+4), (start+4), (start+5), (start+5), con_date, (start+5), (start+5), (start+6), (start+6), con_date, (start+6), (start+6), (start+7), (start+7), con_date, (start+7), (start+7), (start+8), (start+8), con_date, (start+8), (start+8), (start+9), (start+9), con_date, (start+9), (start+9), (start+10), (start+10), con_date, (start+10), (start+10), (start+11), (start+11), con_date, (start+11), (start+11), (start+12), (start+12), con_date, (start+12), (start+12),(start+13), (start+13), con_date, (start+13), (start+13),(start+14), (start+14), con_date, (start+14), (start+14),(start+15), (start+15), con_date, (start+15), (start+15),(start+16), (start+16), con_date, (start+16), (start+16), day], function(error, results, fields){
              if(error) throw error;
              console.log("Availability Staff is updated");
        });
       }
     
     if (range == 17){
        mysqlConnection.query('UPDATE availabilityStaff SET slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", "") WHERE name LIKE '+mysqlConnection.escape('%'+nameArr[p][j]+'%')+' AND type = "Comp" AND day IN (?)'
          ,[start, start, con_date, start, start, (start+1), (start+1), con_date, (start+1), (start+1), (start+2), (start+2), con_date, (start+2), (start+2), (start+3), (start+3), con_date, (start+3), (start+3), (start+4), (start+4), con_date, (start+4), (start+4), (start+5), (start+5), con_date, (start+5), (start+5), (start+6), (start+6), con_date, (start+6), (start+6), (start+7), (start+7), con_date, (start+7), (start+7), (start+8), (start+8), con_date, (start+8), (start+8), (start+9), (start+9), con_date, (start+9), (start+9), (start+10), (start+10), con_date, (start+10), (start+10), (start+11), (start+11), con_date, (start+11), (start+11), (start+12), (start+12), con_date, (start+12), (start+12),(start+13), (start+13), con_date, (start+13), (start+13),(start+14), (start+14), con_date, (start+14), (start+14),(start+15), (start+15), con_date, (start+15), (start+15),(start+16), (start+16), con_date, (start+16), (start+16),(start+17), (start+17), con_date, (start+17), (start+17), day], function(error, results, fields){
              if(error) throw error;
              console.log("Availability Staff is updated");
        });
       }
     
     if (range == 18){
        mysqlConnection.query('UPDATE availabilityStaff SET slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", "") WHERE name LIKE '+mysqlConnection.escape('%'+nameArr[p][j]+'%')+' AND type = "Comp" AND day IN (?)'
          ,[start, start, con_date, start, start, (start+1), (start+1), con_date, (start+1), (start+1), (start+2), (start+2), con_date, (start+2), (start+2), (start+3), (start+3), con_date, (start+3), (start+3), (start+4), (start+4), con_date, (start+4), (start+4), (start+5), (start+5), con_date, (start+5), (start+5), (start+6), (start+6), con_date, (start+6), (start+6), (start+7), (start+7), con_date, (start+7), (start+7), (start+8), (start+8), con_date, (start+8), (start+8), (start+9), (start+9), con_date, (start+9), (start+9), (start+10), (start+10), con_date, (start+10), (start+10), (start+11), (start+11), con_date, (start+11), (start+11), (start+12), (start+12), con_date, (start+12), (start+12),(start+13), (start+13), con_date, (start+13), (start+13),(start+14), (start+14), con_date, (start+14), (start+14),(start+15), (start+15), con_date, (start+15), (start+15),(start+16), (start+16), con_date, (start+16), (start+16),(start+17), (start+17), con_date, (start+17), (start+17), (start+18), (start+18), con_date, (start+18), (start+18), day], function(error, results, fields){
              if(error) throw error;
              console.log("Availability Staff is updated");
        });
       }
     
     if (range == 19){
        mysqlConnection.query('UPDATE availabilityStaff SET slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", "") WHERE name LIKE '+mysqlConnection.escape('%'+nameArr[p][j]+'%')+' AND type = "Comp" AND day IN (?)'
          ,[start, start, con_date, start, start, (start+1), (start+1), con_date, (start+1), (start+1), (start+2), (start+2), con_date, (start+2), (start+2), (start+3), (start+3), con_date, (start+3), (start+3), (start+4), (start+4), con_date, (start+4), (start+4), (start+5), (start+5), con_date, (start+5), (start+5), (start+6), (start+6), con_date, (start+6), (start+6), (start+7), (start+7), con_date, (start+7), (start+7), (start+8), (start+8), con_date, (start+8), (start+8), (start+9), (start+9), con_date, (start+9), (start+9), (start+10), (start+10), con_date, (start+10), (start+10), (start+11), (start+11), con_date, (start+11), (start+11), (start+12), (start+12), con_date, (start+12), (start+12),(start+13), (start+13), con_date, (start+13), (start+13),(start+14), (start+14), con_date, (start+14), (start+14),(start+15), (start+15), con_date, (start+15), (start+15),(start+16), (start+16), con_date, (start+16), (start+16),(start+17), (start+17), con_date, (start+17), (start+17), (start+18), (start+18), con_date, (start+18), (start+18), (start+19), (start+19), con_date, (start+19), (start+19), day], function(error, results, fields){
              if(error) throw error;
              console.log("Availability Staff is updated");
        });
       }
     
     if (range == 20){
        mysqlConnection.query('UPDATE availabilityStaff SET slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", "") WHERE name LIKE '+mysqlConnection.escape('%'+nameArr[p][j]+'%')+' AND type = "Comp" AND day IN (?)'
          ,[start, start, con_date, start, start, (start+1), (start+1), con_date, (start+1), (start+1), (start+2), (start+2), con_date, (start+2), (start+2), (start+3), (start+3), con_date, (start+3), (start+3), (start+4), (start+4), con_date, (start+4), (start+4), (start+5), (start+5), con_date, (start+5), (start+5), (start+6), (start+6), con_date, (start+6), (start+6), (start+7), (start+7), con_date, (start+7), (start+7), (start+8), (start+8), con_date, (start+8), (start+8), (start+9), (start+9), con_date, (start+9), (start+9), (start+10), (start+10), con_date, (start+10), (start+10), (start+11), (start+11), con_date, (start+11), (start+11), (start+12), (start+12), con_date, (start+12), (start+12),(start+13), (start+13), con_date, (start+13), (start+13),(start+14), (start+14), con_date, (start+14), (start+14),(start+15), (start+15), con_date, (start+15), (start+15),(start+16), (start+16), con_date, (start+16), (start+16),(start+17), (start+17), con_date, (start+17), (start+17), (start+18), (start+18), con_date, (start+18), (start+18), (start+19), (start+19), con_date, (start+19), (start+19),(start+20), (start+20), con_date, (start+20), (start+20), day], function(error, results, fields){
              if(error) throw error;
              console.log("Availability Staff is updated");
        });
       }
     
     if (range == 21){
        mysqlConnection.query('UPDATE availabilityStaff SET slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ",TTM", "") WHERE name LIKE '+mysqlConnection.escape('%'+nameArr[p][j]+'%')+' AND type = "Comp" AND day IN (?)'
          ,[start, start, con_date, start, start, (start+1), (start+1), con_date, (start+1), (start+1), (start+2), (start+2), con_date, (start+2), (start+2), (start+3), (start+3), con_date, (start+3), (start+3), (start+4), (start+4), con_date, (start+4), (start+4), (start+5), (start+5), con_date, (start+5), (start+5), (start+6), (start+6), con_date, (start+6), (start+6), (start+7), (start+7), con_date, (start+7), (start+7), (start+8), (start+8), con_date, (start+8), (start+8), (start+9), (start+9), con_date, (start+9), (start+9), (start+10), (start+10), con_date, (start+10), (start+10), (start+11), (start+11), con_date, (start+11), (start+11), (start+12), (start+12), con_date, (start+12), (start+12),(start+13), (start+13), con_date, (start+13), (start+13),(start+14), (start+14), con_date, (start+14), (start+14),(start+15), (start+15), con_date, (start+15), (start+15),(start+16), (start+16), con_date, (start+16), (start+16),(start+17), (start+17), con_date, (start+17), (start+17), (start+18), (start+18), con_date, (start+18), (start+18), (start+19), (start+19), con_date, (start+19), (start+19),(start+20), (start+20), con_date, (start+20), (start+20),(start+21), (start+21), con_date, (start+21), (start+21), day], function(error, results, fields){
              if(error) throw error;
              console.log("Availability Staff is updated");
        });
       }

      }
    }

    mysqlConnection.query('DELETE FROM tasksMgmt WHERE id = ' + id, function(err, result) {
        //if(err) throw err
        if (err) {
            res.redirect('/admin_pengurusanTugas')
        } else {

            res.redirect('/admin_pengurusanTugas')
            console.log("one task sucessfully deleted")
        }
    })
})
 

         app.get('/edit_TugasanTetapanMasa/(:id)', function(req, res) {
          var name = req.user.fullname;
              let id = req.params.id;
             
              mysqlConnection.query('SELECT * FROM tasksMgmt WHERE id = ?', id, function(err, rows, fields) {
                  if(err) throw err
                   
                  // if user not found
                  if (rows.length <= 0) {
                      res.redirect('/admin_pengurusanTugas')
                  }
                  // if book found
                  else {
                      // render to edit.ejs
                      res.render('edit_TugasanTetapanMasa', {
                          id: rows[0].id,
                          task:rows[0].task,
                          date: rows[0].date,
                          timeFrom: rows[0].timeFrom,
                          timeUntil: rows[0].timeUntil,
                          location: rows[0].location,
                          title: rows[0].title,
                          note: rows[0].note,               
                          names: rows[0].names,
                          tahap: rows[0].tahap,
                          name:name
                      })
                  }
              })
          })

          app.post('/update/:id',urlencodedParser, function(req, res, next) {
            let location = req.body.location;
            let title = req.body.title;
            let note = req.body.note;
            let id = req.params.id; 
         
            let tahap = req.body.tahap;
            let previousTahap = req.body.previousTahap;
        
            var name1 = JSON.stringify(req.body.task_owner);
            var name2 = name1.replace("[",""); 
            var name3 = name2.replace("]","");
            var search = '"';
            var replaceWith ='';
            var name4 = name3.split(search).join(replaceWith);
            var arr= name4.split(",");

            var d = new Date()
            var months = new Array(7);
            months[0] = "January";
            months[1] = "February";
            months[2] = "March";
            months[3] = "April";
            months[4] = "May";
            months[5] = "June";
            months[6] = "July";
            months[7] = "August";
            months[8] = "September";
            months[9] = "October";
            months[10] = "November";
            months[11] = "December";
       
       
           var month = months[d.getMonth()];
           var bulan = d.getMonth()+1;
       
           var t = JSON.stringify(new Date().getDate());
        
            for(var i=0; i<arr.length; i++){
                if(previousTahap != tahap){
        
                    if(tahap == "Tinggi"){
                    mysqlConnection.query('UPDATE taskpoint SET tinggi = tinggi +3 ,tinggidetail = CONCAT(tinggidetail, "," ,?), peratus = CASE WHEN peratus < 40 THEN peratus +3 ELSE peratus END, pinperatus=CONCAT(pinperatus,",",peratus),pindate=CONCAT(pindate,",",?)WHERE NAME=? AND MONTH =? ', [note,t,arr[i],month], function(error, results, fields){
                         if(error) throw error;
                         console.log("1 hard point inserted");
                         console.log("1 hard detail inserted");
                         console.log("total points updated");
                        });     
                    }
        
                    else if(tahap == "Sederhana"){
                      mysqlConnection.query('UPDATE taskpoint SET sederhana = sederhana+2 ,sederhanadetail = CONCAT(sederhanadetail, "," ,?), peratus = CASE WHEN peratus< 40 THEN peratus +2 ELSE peratus END, pinperatus=CONCAT(pinperatus,",",peratus),pindate=CONCAT(pindate,",",?) WHERE NAME=? AND MONTH =?  ', [note,t,arr[i],month], function(error, results, fields){
                        if(error) throw error;
                        console.log("1 medium point inserted");
                        console.log("1 medium detail inserted");
                        console.log("total points updated");
                       }); 
                    }
        
                    else if(tahap == "Rendah" || tahap == "Sangat Rendah"){
                      mysqlConnection.query('UPDATE taskpoint SET rendah = rendah+1 ,rendahdetail = CONCAT(rendahdetail, "," ,?), peratus = CASE WHEN peratus <40 THEN peratus +1 ELSE peratus END,pinperatus=CONCAT(pinperatus,",",peratus),pindate=CONCAT(pindate,",",?) WHERE NAME=? AND MONTH =?  ', [note,t,arr[i],month], function(error, results, fields){
                        if(error) throw error;
                        console.log("1 easy point inserted");
                        console.log("1 easy detail inserted");
                        console.log("total points updated");
                       });    
                    }
        
                    if(previousTahap == "Tinggi"){
                    mysqlConnection.query('UPDATE taskpoint SET tinggi = tinggi-1, tinggidetail = replace(tinggidetail, ?, ""), peratus = peratus-3 WHERE name = ?'
                    ,[note, arr[i]], function(error, results, fields){
                        if(error) throw error;
                        console.log("task points is updated");
                    })
                    }
        
                    else if(previousTahap == "Sederhana"){
                    mysqlConnection.query('UPDATE taskpoint SET sederhana = sederhana-1, sederhanadetail = replace(sederhanadetail, ?, ""), peratus = peratus-2 WHERE name = ?'
                    ,[note, arr[i]], function(error, results, fields){
                        if(error) throw error;
                        console.log("task points is updated");
                    })
                    }
        
                    else if(previousTahap == "Rendah" || previousTahap == "Sangat Rendah"){
                    mysqlConnection.query('UPDATE taskpoint SET rendah = rendah-1, rendahdetail = replace(rendahdetail, ?, ""), peratus = peratus-1 WHERE name = ?'
                    ,[note, arr[i]], function(error, results, fields){
                        if(error) throw error;
                        console.log("task points is updated");
                    })
                    }
                }
        
              }
        
                var form_data = {        
                    location: location,
                    title: title,
                    note: note,
                    tahap:tahap}
                // update query
        
                mysqlConnection.query('UPDATE tasksMgmt SET ? WHERE id = ' + id, form_data, function(err, result) {
                  
                        res.redirect('/admin_pengurusanTugas');
                    
                })
            
        })


        app.get('/delete_TFM/(:id)', function(req, res, next) {

          var id_uniqueID = req.params.id;
          var aftersplit = id_uniqueID.split("_");
          var id = parseInt(aftersplit[0]); 
          var uniqueID = aftersplit[1];
          var title = aftersplit[2];
          var name1 = aftersplit[3];
          var name2 = name1.replace("[",""); 
          var name3 = name2.replace("]","");
          var search = '"';
          var replaceWith ='';
          var name4 = name3.split(search).join(replaceWith);
          var arr= name4.split(",");
          var tahap = aftersplit[4];
      
          console.log(id_uniqueID);
          console.log(id);    
          console.log(uniqueID);
      
          for(var i=0; i<arr.length; i++){
      
          if(tahap == "Tinggi"){
                  mysqlConnection.query('UPDATE taskpoint SET tinggi = tinggi-1, tinggidetail = replace(tinggidetail, ?, ""), peratus = peratus-3 WHERE name = ?'
                  ,[title, arr[i]], function(error, results, fields){
                      if(error) throw error;
                      console.log("task points is updated");
                  })
                  }
      
                  else if(tahap == "Sederhana"){
                  mysqlConnection.query('UPDATE taskpoint SET sederhana = sederhana-1, sederhanadetail = replace(sederhanadetail, ?, ""), peratus = peratus-2 WHERE name = ?'
                  ,[title, arr[i]], function(error, results, fields){
                      if(error) throw error;
                      console.log("task points is updated");
                  })
                  }
      
                  else if(tahap == "Rendah" || tahap == "Sangat Rendah"){
                  mysqlConnection.query('UPDATE taskpoint SET rendah = rendah-1, rendahdetail = replace(rendahdetail, ?, ""), peratus = peratus-1 WHERE name = ?'
                  ,[title, arr[i]], function(error, results, fields){
                      if(error) throw error;
                      console.log("task points is updated");
                  })
                  }
              }
      
         mysqlConnection.query('DELETE FROM taskProgress WHERE uniqueID IN(?) ', [uniqueID], function(error, results, fields){
                if(error) throw error;
                console.log("One flexible task is deleted");
                });
           
          mysqlConnection.query('DELETE FROM tasksMgmt WHERE id = ' + id, function(err, result) {
              //if(err) throw err
              if (err) {
                  res.redirect('/admin_pengurusanTugas')
              } else {
      
                  res.redirect('/admin_pengurusanTugas')
                  console.log("one task sucessfully deleted")
              }
          })
      })

      app.get('/edit_TugasanFleksibelMasa/(:id)', function(req, res) {
        var name = req.user.fullname;
            let id = req.params.id;
           
            mysqlConnection.query('SELECT * FROM tasksMgmt WHERE id = ?', id, function(err, rows, fields) {
                if(err) throw err
                 
                // if user not found
                if (rows.length <= 0) {
                    res.redirect('/admin_pengurusanTugas')
                }
                // if book found
                else {
                    // render to edit.ejs
                    res.render('edit_TugasanFleksibelMasa', {
                        id: rows[0].id,
                        uniqueID:rows[0].uniqueID,
                        task:rows[0].task,
                        dueDate: rows[0].dueDate,
                        title: rows[0].title,
                        note: rows[0].note,               
                        names: rows[0].names,
                        tahap: rows[0].tahap,
                        name:name
                    })
                }
            })
        })

        app.post('/update_TugasanFleksibelMasa/:id',urlencodedParser, function(req, res, next) {
          let title = req.body.title;
          let note = req.body.note;
          let id_uniqueID = req.params.id; 
          let aftersplit = id_uniqueID.split("_");
          let id = parseInt(aftersplit[0]);
          let uniqueID = aftersplit[1];
          let dueDate = req.body.dueDate
          let tahap = req.body.tahap;
          let previousTahap = req.body.previousTahap;
      
          var name1 = JSON.stringify(req.body.task_owner);
          var name2 = name1.replace("[",""); 
          var name3 = name2.replace("]","");
          var search = '"';
          var replaceWith ='';
          var name4 = name3.split(search).join(replaceWith);
          var arr= name4.split(",");

          var d = new Date()
          var months = new Array(7);
          months[0] = "January";
          months[1] = "February";
          months[2] = "March";
          months[3] = "April";
          months[4] = "May";
          months[5] = "June";
          months[6] = "July";
          months[7] = "August";
          months[8] = "September";
          months[9] = "October";
          months[10] = "November";
          months[11] = "December";
     
     
         var month = months[d.getMonth()];
         var bulan = d.getMonth()+1;
     
         var t = JSON.stringify(new Date().getDate());
       
              var form_data = { 
                  title: title,
                  note: note,
                  dueDate: dueDate,
                  tahap: tahap
                }
      
                var progress = {
                  title:title,
                  taskname:note,
                  dueDate:dueDate
                }
      
              for(var i=0; i<arr.length; i++){
              if(previousTahap != tahap){
      
                  if(tahap == "Tinggi"){
                    mysqlConnection.query('UPDATE taskpoint SET tinggi = tinggi +3 ,tinggidetail = CONCAT(tinggidetail, "," ,?), peratus = CASE WHEN peratus < 40 THEN peratus +3 ELSE peratus END, pinperatus=CONCAT(pinperatus,",",peratus),pindate=CONCAT(pindate,",",?)WHERE NAME=? AND MONTH =? ', [note,t,arr[i],month], function(error, results, fields){
                      if(error) throw error;
                      console.log("1 hard point inserted");
                      console.log("1 hard detail inserted");
                      console.log("total points updated");
                     });   
                  }
      
                  else if(tahap == "Sederhana"){
                    mysqlConnection.query('UPDATE taskpoint SET sederhana = sederhana+2 ,sederhanadetail = CONCAT(sederhanadetail, "," ,?), peratus = CASE WHEN peratus< 40 THEN peratus +2 ELSE peratus END, pinperatus=CONCAT(pinperatus,",",peratus),pindate=CONCAT(pindate,",",?) WHERE NAME=? AND MONTH =?  ', [note,t,arr[i],month], function(error, results, fields){
                      if(error) throw error;
                      console.log("1 medium point inserted");
                      console.log("1 medium detail inserted");
                      console.log("total points updated");
                     });  
                  }
      
                  else if(tahap == "Rendah" || tahap == "Sangat Rendah"){
                    mysqlConnection.query('UPDATE taskpoint SET rendah = rendah+1 ,rendahdetail = CONCAT(rendahdetail, "," ,?), peratus = CASE WHEN peratus <40 THEN peratus +1 ELSE peratus END,pinperatus=CONCAT(pinperatus,",",peratus),pindate=CONCAT(pindate,",",?) WHERE NAME=? AND MONTH =?  ', [note,t,arr[i],month], function(error, results, fields){
                      if(error) throw error;
                      console.log("1 easy point inserted");
                      console.log("1 easy detail inserted");
                      console.log("total points updated");
                     });    
                  }
      
                  if(previousTahap == "Tinggi"){
                  mysqlConnection.query('UPDATE taskpoint SET tinggi = tinggi-1, tinggidetail = replace(tinggidetail, ?, ""), peratus = peratus-3 WHERE name = ?'
                  ,[note, arr[i]], function(error, results, fields){
                      if(error) throw error;
                      console.log("task points is updated");
                  })
                  }
      
                  else if(previousTahap == "Sederhana"){
                  mysqlConnection.query('UPDATE taskpoint SET sederhana = sederhana-1, sederhanadetail = replace(sederhanadetail, ?, ""), peratus = peratus-2 WHERE name = ?'
                  ,[note, arr[i]], function(error, results, fields){
                      if(error) throw error;
                      console.log("task points is updated");
                  })
                  }
      
                  else if(previousTahap == "Rendah" || previousTahap == "Sangat Rendah"){
                  mysqlConnection.query('UPDATE taskpoint SET rendah = rendah-1, rendahdetail = replace(rendahdetail, ?, ""), peratus = peratus-1 WHERE name = ?'
                  ,[note, arr[i]], function(error, results, fields){
                      if(error) throw error;
                      console.log("task points is updated");
                  })
                  }
              }
      
            }
      
               mysqlConnection.query('UPDATE taskProgress SET ? WHERE uniqueID = ? ', [progress,uniqueID], function(error, results, fields){
                       if(error) throw error;
                       console.log("task progress is updated");
                      });   
              // update query
              mysqlConnection.query('UPDATE tasksMgmt SET ? WHERE id = ' + id, form_data, function(err, result) {
                
                      res.redirect('/admin_pengurusanTugas');
                  
              })
          
      })

 //===============================================================save specific time and non specific time tasks to db=====================================================================
 app.post('/admin_pengurusanTugas',urlencodedParser,function(req,res){
  var name1 = JSON.stringify(req.body.name);
  var id = JSON.stringify(req.body.userID)
  var name2 = name1.replace("[",""); 
  var name3 = name2.replace("]","");
  var search = '"';
  var replaceWith ='';
  var name4 = name3.split(search).join(replaceWith);
  var arr= name4.split(",");
  var rolename = "Penyerah Tugas";
  var name = JSON.stringify(req.body.name);
  console.log(name1);
  var obj = JSON.stringify(req.body);
  var jsonObj = JSON.parse(obj);
        
   // ----------------------------Specific vs Non-Specific-----------------------------------
   // Specific Time Task:                          Non-Specific Time Task:
   // 1. Tajuk (Default)                           1. Tajuk (Default)
   // 2. Tugas (Default)                           2. Tugas (Default)
   // 3. Tahap Kesukaran (Default)                 3. Tahap Kesukaran (Default)
   // 4. Lokasi                                    4. Tarikh Akhir
   // 5. Tarikh                                    5. Display workload status based on due date month
   // 6. Masa Dari
   // 7. Masa Sehingga
   // 8. Display Availability based on date & time
       
     
     if(jsonObj.task === "Tugasan Fleksibel Masa"){

       var getDate = jsonObj.tarikhakhir;
       var monthToday = new Date(getDate);
       var month = monthToday.getMonth();
       var temp_arr = [];
       var uniqueID = (Date.now().toString(36) + Math.random().toString(36).substr(2,15)).toUpperCase();
       let today = new Date().toISOString().slice(0, 10)
       var owner_name = req.user.fullname;

       let data = {
         uniqueID: uniqueID,
         role: rolename, 
         task: req.body.task, //category 
         title:req.body.title, //tajuk
         note:req.body.notes, //tugas
         dueDate:req.body.tarikhakhir, //tarikh akhir
         tahap:req.body.tahap, //tahap kesukaran
         names:name,
         date:"-",
         timeFrom: "",
         timeUntil: "",
         location: "-",
         agenda: "",
         owner_name: owner_name}; //selected staff


         for(var i=0; i < arr.length ; i++ ){

         var obj = JSON.stringify(req.body);
         var jsonObj = JSON.parse(obj);
         console.log(jsonObj.task);
         var d = new Date()
     var months = new Array(7);
     months[0] = "January";
     months[1] = "February";
     months[2] = "March";
     months[3] = "April";
     months[4] = "May";
     months[5] = "June";
     months[6] = "July";
     months[7] = "August";
     months[8] = "September";
     months[9] = "October";
     months[10] = "November";
     months[11] = "December";


    var m = months[d.getMonth()];
    var bulan = d.getMonth()+1;

    var t = JSON.stringify(new Date().getDate());
    
     if(jsonObj.tahap==="Tinggi"){
     
       mysqlConnection.query('UPDATE taskpoint SET tinggi = tinggi +3 ,tinggidetail = CONCAT(tinggidetail, "," ,?), peratus = CASE WHEN peratus < 40 THEN peratus +3 ELSE peratus END, pinperatus=CONCAT(pinperatus,",",peratus),pindate=CONCAT(pindate,",",?)WHERE NAME=? AND MONTH =? ', [req.body.title,t,arr[i],m], function(error, results, fields){
          if(error) throw error;
          console.log("1 hard point inserted");
          console.log("1 hard detail inserted");
          console.log("total points updated");
         });
       
          mysqlConnection.query('UPDATE availabilityStaff SET percentage? = percentage?+3 WHERE name = ? ', [(month+1), (month+1),arr[i]], function(error, results, fields){
           if(error) throw error;
           console.log("total points updated");
 
          });
      }

     else if(jsonObj.tahap==="Sederhana"){
       
       mysqlConnection.query('UPDATE taskpoint SET sederhana = sederhana+2 ,sederhanadetail = CONCAT(sederhanadetail, "," ,?), peratus = CASE WHEN peratus< 40 THEN peratus +2 ELSE peratus END, pinperatus=CONCAT(pinperatus,",",peratus),pindate=CONCAT(pindate,",",?) WHERE NAME=? AND MONTH =?  ', [req.body.title,t,arr[i],m], function(error, results, fields){
          if(error) throw error;
          console.log("1 medium point inserted");
          console.log("1 medium detail inserted");
          console.log("total points updated");
         });
        
          mysqlConnection.query('UPDATE availabilityStaff SET percentage? = percentage?+2 WHERE name = ? ', [(month+1), (month+1),arr[i]], function(error, results, fields){
           if(error) throw error;
           console.log("total points updated");
 
          });
      }

      else{
       
       mysqlConnection.query('UPDATE taskpoint SET rendah = rendah+1 ,rendahdetail = CONCAT(rendahdetail, "," ,?), peratus = CASE WHEN peratus <40 THEN peratus +1 ELSE peratus END,pinperatus=CONCAT(pinperatus,",",peratus),pindate=CONCAT(pindate,",",?) WHERE NAME=? AND MONTH =?  ', [req.body.title,t,arr[i],m], function(error, results, fields){
          if(error) throw error;
          console.log("1 easy point inserted");
          console.log("1 easy detail inserted");
          console.log("total points updated");
         });
         
          mysqlConnection.query('UPDATE availabilityStaff SET percentage? = percentage?+1 WHERE name = ? ', [(month+1), (month+1),arr[i]], function(error, results, fields){
           if(error) throw error;
           console.log("total points updated");
 
          });
      }

    //   for(var j = 0; j<arr.length; j++){              

    //      temp_arr.push(arr[j]);
    //   }

    // var newTemp = JSON.stringify(temp_arr);
    

        mysqlConnection.query('INSERT INTO taskProgress(uniqueID, category, title, taskname, taskowner, dueDate, status, feedback, notes, taskassigner, taskpoints, completion, collaborators, teamDateCompletion) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [uniqueID, req.body.task, req.body.title, req.body.notes, arr[i], req.body.tarikhakhir, "Belum Mula", "Tiada", "", owner_name, 0, 0, name, today], function(error, results, fields){
           if(error) throw error;
           console.log("Flexible task is updated");
           });

         // temp_arr = [];

  } //end for loop
     
      let sql = "INSERT INTO tasksMgmt SET ?";
      mysqlConnection.query(sql , data, function(error, results) {
       if(error) throw error;
       console.log("1 document inserted");
         res.redirect('/admin_pengurusanTugas');
      });

     }
// ----------------------------------------------------------------------------------------------------------------------------------------------------
     else if(jsonObj.task === "Tugasan Tetapan Masa"){

       var uniqueID = (Date.now().toString(36) + Math.random().toString(36).substr(2,15)).toUpperCase();
       var filter1 = JSON.stringify(req.body.from);
       var filter2 = JSON.stringify(req.body.to);

       var start = 0;
       var finish = 0;

       var getDate = jsonObj.tarikh;
       var monthToday = new Date(getDate);
       var month = monthToday.getMonth();
       var months = [0,1,2,3,4,5,6,7,8,9,10,11];
       var unselectedMonth = [];

       for(var j = 0; j<months.length; j++){
         if(months[j] != month){
           unselectedMonth.push(months[j]);
         }
       }
       console.log(month);
       console.log(unselectedMonth);

      // convert date to day
       var weekday = new Array(7);
       weekday[0] = "Sunday";
       weekday[1] = "Monday";
       weekday[2] = "Tuesday";
       weekday[3] = "Wednesday";
       weekday[4] = "Thursday";
       weekday[5] = "Friday";
       weekday[6] = "Saturday";

       var day = weekday[monthToday.getDay()];

       var level = jsonObj.tahap;
       var levelpoint = 0;

       if(level === "Tinggi"){
         levelpoint = 3;
       }

       else if(level === "Sederhana"){
         levelpoint = 2;
       }

       else if(level === "Rendah"){
         levelpoint = 1;
       }

       var start_ar = ["7:30", "8:00", "8:30", "9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", 
       "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"];

       var finish_ar = ["8:00", "8:30", "9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", 
       "16:00", "16:30", "17:00", "17:30", "18:00", "18:30"];


       for (var i = 0; i < start_ar.length; i++)  { 
           if((jsonObj.from===start_ar[i]))
             { start = i+1;} //1
           }


       for (var i = 0; i < finish_ar.length; i++) {       
           if((jsonObj.to===finish_ar[i]))
             { finish = i+1;} //22
           }

       var range = finish - start;
       console.log(start);
       console.log(finish);
       console.log(range);
       var owner_name = req.user.fullname;


       let data = {
         uniqueID:uniqueID,
         role: rolename, 
         task: req.body.task, 
         date:req.body.tarikh, 
         timeFrom:req.body.from, 
         timeUntil: req.body.to, 
         location:req.body.location, 
         title:req.body.title, 
         note:req.body.notes, 
         tahap:req.body.tahap,
         names:name,
         agenda:"",
         dueDate:"-",
         owner_name: owner_name};

          //save to task details and points (analyse workload)=================================
  for(var i=0; i < arr.length ; i++ ){

   var obj = JSON.stringify(req.body);
   var jsonObj = JSON.parse(obj);
   console.log(jsonObj.task);
   
    
     if(jsonObj.tahap==="Tinggi"){
     
       mysqlConnection.query('UPDATE taskpoint SET tinggi = tinggi +3 ,tinggidetail = CONCAT(tinggidetail, "," ,?), peratus = CASE WHEN peratus < 40 THEN peratus +3 ELSE peratus END, pinperatus=CONCAT(pinperatus,",",peratus),pindate=CONCAT(pindate,",",?)WHERE NAME=? AND MONTH =? ', [req.body.title,t,arr[i],m], function(error, results, fields){
          if(error) throw error;
          console.log("1 hard point inserted");
          console.log("1 hard detail inserted");
          console.log("total points updated");
         });
       
          mysqlConnection.query('UPDATE availabilityStaff SET percentage? = percentage?+3 WHERE name = ? ', [(month+1), (month+1),arr[i]], function(error, results, fields){
           if(error) throw error;
           console.log("total points updated");
 
          });
      }

     else if(jsonObj.tahap==="Sederhana"){
       
       mysqlConnection.query('UPDATE taskpoint SET sederhana = sederhana+2 ,sederhanadetail = CONCAT(sederhanadetail, "," ,?), peratus = CASE WHEN peratus< 40 THEN peratus +2 ELSE peratus END, pinperatus=CONCAT(pinperatus,",",peratus),pindate=CONCAT(pindate,",",?) WHERE NAME=? AND MONTH =?  ', [req.body.title,t,arr[i],m], function(error, results, fields){
          if(error) throw error;
          console.log("1 medium point inserted");
          console.log("1 medium detail inserted");
          console.log("total points updated");
         });
        
          mysqlConnection.query('UPDATE availabilityStaff SET percentage? = percentage?+2 WHERE name = ? ', [(month+1), (month+1),arr[i]], function(error, results, fields){
           if(error) throw error;
           console.log("total points updated");
 
          });
      }

      else{
       
       mysqlConnection.query('UPDATE taskpoint SET rendah = rendah+1 ,rendahdetail = CONCAT(rendahdetail, "," ,?), peratus = CASE WHEN peratus <40 THEN peratus +1 ELSE peratus END,pinperatus=CONCAT(pinperatus,",",peratus),pindate=CONCAT(pindate,",",?) WHERE NAME=? AND MONTH =?  ', [req.body.title,t,arr[i],m], function(error, results, fields){
          if(error) throw error;
          console.log("1 easy point inserted");
          console.log("1 easy detail inserted");
          console.log("total points updated");
         });
         
          mysqlConnection.query('UPDATE availabilityStaff SET percentage? = percentage?+1 WHERE name = ? ', [(month+1), (month+1),arr[i]], function(error, results, fields){
           if(error) throw error;
           console.log("total points updated");
 
          });
      }

  } //end for loop

     
        if(range == 0){
         for(var i=0; i < arr.length ; i++ ){
            mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), percentage? = percentage? + ? WHERE type = "Comp" AND name = ? AND day = ?',
           [start, start, getDate, start, start, (month+1),(month+1), levelpoint, arr[i], day], function(error, results, fields){
           if(error) throw error;
           console.log("slots updated");
 
          });

         }               
       }

       if(range == 1){
         for(var i=0; i < arr.length ; i++ ){
            mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), percentage? = percentage? + ? WHERE type = "Comp" AND name = ? AND day = ?', 
           [start, start, getDate, start, start, (start+1), (start+1), getDate, (start+1), (start+1), (month+1),(month+1), levelpoint, arr[i], day], function(error, results, fields){
           if(error) throw error;
           console.log("slots updated");
 
          });

         }               
       }

       if(range == 2){ //not yet
         for(var i=0; i < arr.length ; i++ ){

           mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), percentage? = percentage? + ? WHERE type = "Comp" AND name = ? AND day = ?', 
   [start, start, getDate, start, start, (start+1), (start+1), getDate, (start+1), (start+1), (start+2), (start+2), getDate, (start+2), (start+2), (month+1),(month+1), levelpoint, arr[i], day], function(error, results, fields){
           if(error) throw error;
           console.log("slots updated");
 
          });

         }               
       }

        if(range == 3){
         for(var i=0; i < arr.length ; i++ ){

           mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), percentage? = percentage? + ? WHERE type = "Comp" AND name = ? AND day = ?', 
             [start, start, getDate, start, start, (start+1), (start+1), getDate, (start+1), (start+1), (start+2), (start+2), getDate, (start+2), (start+2), (start+3), (start+3), getDate, (start+3), (start+3), (month+1),(month+1), levelpoint, arr[i], day], function(error, results, fields){
           if(error) throw error;
           console.log("slots updated");
 
          });

         }               
       }

       if(range == 4){
         for(var i=0; i < arr.length ; i++ ){

           mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), percentage? = percentage? + ? WHERE type = "Comp" AND name = ? AND day = ?', 
             [start, start, getDate, start, start, (start+1), (start+1), getDate, (start+1), (start+1), (start+2), (start+2), getDate, (start+2), (start+2), (start+3), (start+3), getDate, (start+3), (start+3), (start+4), (start+4), getDate, (start+4), (start+4), (month+1),(month+1), levelpoint, arr[i], day], function(error, results, fields){
           if(error) throw error;
           console.log("slots updated");
 
          });


         }               
       }
 
   if(range == 5){
         for(var i=0; i < arr.length ; i++ ){
           mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), percentage? = percentage? + ? WHERE type = "Comp" AND name = ? AND day = ?', 
             [start, start, getDate, start, start, (start+1), (start+1), getDate, (start+1), (start+1), (start+2), (start+2), getDate, (start+2), (start+2), (start+3), (start+3), getDate, (start+3), (start+3), (start+4), (start+4), getDate, (start+4), (start+4), (start+5), (start+5), getDate, (start+5), (start+5), (month+1),(month+1), levelpoint, arr[i], day], function(error, results, fields){
           if(error) throw error;
           console.log("slots updated");
 
          });


         }               
       } //done

        if(range == 6){
         for(var i=0; i < arr.length ; i++ ){

             mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), act_? = CONCAT(act_?,",","TTM"), percentage? = percentage? + ? WHERE type = "Comp" AND name = ? AND day = ?', 
   [start, start, getDate, start, start, (start+1), (start+1), getDate, (start+1), (start+1), (start+2), (start+2), getDate, (start+2), (start+2),(start+3), (start+3), getDate, (start+3), (start+3),(start+4), (start+4), getDate, (start+4), (start+4),(start+5), (start+5), getDate, (start+5), (start+5),(start+6), (start+6), getDate, (start+6), (start+6), (month+1),(month+1), levelpoint, arr[i], day], function(error, results, fields){
           if(error) throw error;
           console.log("slots updated");
 
          });

         }               
       }

       if(range == 7){
         for(var i=0; i < arr.length ; i++ ){

             mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), percentage? = percentage? + ? WHERE type = "Comp" AND name = ? AND day = ?',
   [start, start, getDate, start, start, (start+1), (start+1), getDate, (start+1), (start+1), (start+2), (start+2), getDate, (start+2), (start+2), (start+3), (start+3), getDate, (start+3), (start+3), (start+4), (start+4), getDate, (start+4), (start+4), (start+5), (start+5), getDate, (start+5), (start+5), (start+6), (start+6), getDate, (start+6), (start+6), (start+7), (start+7), getDate, (start+7), (start+7), (month+1),(month+1), levelpoint, arr[i], day], function(error, results, fields){
           if(error) throw error;
           console.log("slots updated");
 
          });

         }               
       }

       if(range == 8){
         for(var i=0; i < arr.length ; i++ ){

             mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), percentage? = percentage? + ? WHERE type = "Comp" AND name = ? AND day = ?',
   [start, start, getDate, start, start, (start+1), (start+1), getDate, (start+1), (start+1), (start+2), (start+2), getDate, (start+2), (start+2), (start+3), (start+3), getDate, (start+3), (start+3), (start+4), (start+4), getDate, (start+4), (start+4), (start+5), (start+5), getDate, (start+5), (start+5), (start+6), (start+6), getDate, (start+6), (start+6), (start+7), (start+7), getDate, (start+7), (start+7), (start+8), (start+8), getDate, (start+8), (start+8), (month+1),(month+1), levelpoint, arr[i], day], function(error, results, fields){
           if(error) throw error;
           console.log("slots updated");
 
          });

         }               
       }

       if(range == 9){
         for(var i=0; i < arr.length ; i++ ){

             mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), percentage? = percentage? + ? WHERE type = "Comp" AND name = ? AND day = ?',
   [start, start, getDate, start, start, (start+1), (start+1), getDate, (start+1), (start+1), (start+2), (start+2), getDate, (start+2), (start+2),(start+3), (start+3), getDate, (start+3), (start+3),(start+4), (start+4), getDate, (start+4), (start+4),(start+5), (start+5), getDate, (start+5), (start+5),(start+6), (start+6), getDate, (start+6), (start+6),(start+7), (start+7), getDate, (start+7), (start+7),(start+8), (start+8), getDate, (start+8), (start+8),(start+9), (start+9), getDate, (start+9), (start+9), (month+1),(month+1), levelpoint, arr[i], day], function(error, results, fields){
           if(error) throw error;
           console.log("slots updated");
 
          });

         }               
       }

       if(range == 10){
         for(var i=0; i < arr.length ; i++ ){

             mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), percentage? = percentage? + ? WHERE type = "Comp" AND name = ? AND day = ?', 
   [start, start, getDate, start, start, (start+1), (start+1), getDate, (start+1), (start+1), (start+2), (start+2), getDate, (start+2), (start+2),(start+3), (start+3), getDate, (start+3), (start+3),(start+4), (start+4), getDate, (start+4), (start+4),(start+5), (start+5), getDate, (start+5), (start+5),(start+6), (start+6), getDate, (start+6), (start+6),(start+7), (start+7), getDate, (start+7), (start+7),(start+8), (start+8), getDate, (start+8), (start+8),(start+9), (start+9), getDate, (start+9), (start+9), (start+10), (start+10), getDate, (start+10), (start+10), (month+1),(month+1), levelpoint, arr[i], day], function(error, results, fields){
           if(error) throw error;
           console.log("slots updated");
 
          });

         }               
       }

       if(range == 11){
         for(var i=0; i < arr.length ; i++ ){

             mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), percentage? = percentage? + ? WHERE type = "Comp" AND name = ? AND day = ?', 
   [start, start, getDate, start, start, (start+1), (start+1), getDate, (start+1), (start+1), (start+2), (start+2), getDate, (start+2), (start+2),(start+3), (start+3), getDate, (start+3), (start+3),(start+4), (start+4), getDate, (start+4), (start+4),(start+5), (start+5), getDate, (start+5), (start+5),(start+6), (start+6), getDate, (start+6), (start+6),(start+7), (start+7), getDate, (start+7), (start+7),(start+8), (start+8), getDate, (start+8), (start+8),(start+9), (start+9), getDate, (start+9), (start+9), (start+10), (start+10), getDate, (start+10), (start+10), (start+11), (start+11), getDate, (start+11), (start+11), (month+1),(month+1), levelpoint, arr[i], day], function(error, results, fields){
           if(error) throw error;
           console.log("slots updated");
 
          });

         }               
       }

       if(range == 12){
         for(var i=0; i < arr.length ; i++ ){
             mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), percentage? = percentage? + ? WHERE type = "Comp" AND name = ? AND day = ?', 
   [start, start, getDate, start, start, (start+1), (start+1), getDate, (start+1), (start+1), (start+2), (start+2), getDate, (start+2), (start+2),(start+3), (start+3), getDate, (start+3), (start+3),(start+4), (start+4), getDate, (start+4), (start+4),(start+5), (start+5), getDate, (start+5), (start+5),(start+6), (start+6), getDate, (start+6), (start+6),(start+7), (start+7), getDate, (start+7), (start+7),(start+8), (start+8), getDate, (start+8), (start+8),(start+9), (start+9), getDate, (start+9), (start+9), (start+10), (start+10), getDate, (start+10), (start+10), (start+11), (start+11), getDate, (start+11), (start+11), (start+12), (start+12), getDate, (start+12), (start+12), (month+1),(month+1), levelpoint, arr[i], day], function(error, results, fields){
           if(error) throw error;
           console.log("slots updated");
 
          });

         }               
       }

       if(range == 13){
         for(var i=0; i < arr.length ; i++ ){

             mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), percentage? = percentage? + ? WHERE type = "Comp" AND name = ? AND day = ?', 
   [start, start, getDate, start, start, (start+1), (start+1), getDate, (start+1), (start+1), (start+2), (start+2), getDate, (start+2), (start+2),(start+3), (start+3), getDate, (start+3), (start+3),(start+4), (start+4), getDate, (start+4), (start+4),(start+5), (start+5), getDate, (start+5), (start+5),(start+6), (start+6), getDate, (start+6), (start+6),(start+7), (start+7), getDate, (start+7), (start+7),(start+8), (start+8), getDate, (start+8), (start+8),(start+9), (start+9), getDate, (start+9), (start+9), (start+10), (start+10), getDate, (start+10), (start+10), (start+11), (start+11), getDate, (start+11), (start+11), (start+12), (start+12), getDate, (start+12), (start+12), (start+13), (start+13), getDate, (start+13), (start+13), (month+1),(month+1), levelpoint, arr[i], day], function(error, results, fields){
           if(error) throw error;
           console.log("slots updated");
 
          });

         }               
       }

       if(range == 14){
         for(var i=0; i < arr.length ; i++ ){
             mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), percentage? = percentage? + ? WHERE type = "Comp" AND name = ? AND day = ?', 
   [start, start, getDate, start, start, (start+1), (start+1), getDate, (start+1), (start+1), (start+2), (start+2), getDate, (start+2), (start+2),(start+3), (start+3), getDate, (start+3), (start+3),(start+4), (start+4), getDate, (start+4), (start+4),(start+5), (start+5), getDate, (start+5), (start+5),(start+6), (start+6), getDate, (start+6), (start+6),(start+7), (start+7), getDate, (start+7), (start+7),(start+8), (start+8), getDate, (start+8), (start+8),(start+9), (start+9), getDate, (start+9), (start+9), (start+10), (start+10), getDate, (start+10), (start+10), (start+11), (start+11), getDate, (start+11), (start+11), (start+12), (start+12), getDate, (start+12), (start+12), (start+13), (start+13), getDate, (start+13), (start+13), (start+14), (start+14), getDate, (start+14), (start+14), (month+1),(month+1), levelpoint, arr[i], day], function(error, results, fields){
           if(error) throw error;
           console.log("slots updated");
 
          });

         }               
       }

       if(range == 15){
         for(var i=0; i < arr.length ; i++ ){

             mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), percentage? = percentage? + ? WHERE type = "Comp" AND name = ? AND day = ?', 
   [start, start, getDate, start, start, (start+1), (start+1), getDate, (start+1), (start+1),(start+2), (start+2), getDate, (start+2), (start+2),(start+3), (start+3), getDate, (start+3), (start+3),(start+4), (start+4), getDate, (start+4), (start+4),(start+5), (start+5), getDate, (start+5), (start+5),(start+6), (start+6), getDate, (start+6), (start+6),(start+7), (start+7), getDate, (start+7), (start+7),(start+8), (start+8), getDate, (start+8), (start+8),(start+9), (start+9), getDate, (start+9), (start+9), (start+10), (start+10), getDate, (start+10), (start+10), (start+11), (start+11), getDate, (start+11), (start+11), (start+12), (start+12), getDate, (start+12), (start+12), (start+13), (start+13), getDate, (start+13), (start+13), (start+14), (start+14), getDate, (start+14), (start+14), (start+15), (start+15), getDate, (start+15), (start+15), (month+1),(month+1), levelpoint, arr[i], day], function(error, results, fields){
           if(error) throw error;
           console.log("slots updated");
 
          });

         }               
       }

       if(range == 16){
         for(var i=0; i < arr.length ; i++ ){

             mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), percentage? = percentage? + ? WHERE type = "Comp" AND name = ? AND day = ?', 
   [start, start, getDate, start, start, (start+1), (start+1), getDate, (start+1), (start+1), (start+2), (start+2), getDate, (start+2), (start+2),(start+3), (start+3), getDate, (start+3), (start+3),(start+4), (start+4), getDate, (start+4), (start+4),(start+5), (start+5), getDate, (start+5), (start+5),(start+6), (start+6), getDate, (start+6), (start+6),(start+7), (start+7), getDate, (start+7), (start+7),(start+8), (start+8), getDate, (start+8), (start+8),(start+9), (start+9), getDate, (start+9), (start+9), (start+10), (start+10), getDate, (start+10), (start+10), (start+11), (start+11), getDate, (start+11), (start+11), (start+12), (start+12), getDate, (start+12), (start+12), (start+13), (start+13), getDate, (start+13), (start+13), (start+14), (start+14), getDate, (start+14), (start+14),(start+15), (start+15), getDate, (start+15), (start+15), (start+16), (start+16), getDate, (start+16), (start+16), (month+1),(month+1), levelpoint, arr[i], day], function(error, results, fields){
           if(error) throw error;
           console.log("slots updated");
 
          });

         }               
       }

       if(range == 17){
         for(var i=0; i < arr.length ; i++ ){

             mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),percentage? = percentage? + ? WHERE type = "Comp" AND name = ? AND day = ?', 
   [start, start, getDate, start, start, (start+1), (start+1), getDate, (start+1), (start+1), (start+2), (start+2), getDate, (start+2), (start+2),(start+3), (start+3), getDate, (start+3), (start+3),(start+4), (start+4), getDate, (start+4), (start+4),(start+5), (start+5), getDate, (start+5), (start+5),(start+6), (start+6), getDate, (start+6), (start+6),(start+7), (start+7), getDate, (start+7), (start+7),(start+8), (start+8), getDate, (start+8), (start+8),(start+9), (start+9), getDate, (start+9), (start+9), (start+10), (start+10), getDate, (start+10), (start+10), (start+11), (start+11), getDate, (start+11), (start+11), (start+12), (start+12), getDate, (start+12), (start+12), (start+13), (start+13), getDate, (start+13), (start+13), (start+14), (start+14), getDate, (start+14), (start+14),(start+15), (start+15), getDate, (start+15), (start+15),(start+16), (start+16), getDate, (start+16), (start+16),(start+17), (start+17), getDate, (start+17), (start+17), (month+1),(month+1), levelpoint, arr[i], day], function(error, results, fields){
           if(error) throw error;
           console.log("slots updated");
 
          });

         }               
       }

       if(range == 18){
         for(var i=0; i < arr.length ; i++ ){
             mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), percentage? = percentage? + ? WHERE type = "Comp" AND name = ? AND day = ?', 
   [start, start, getDate, start, start, (start+1), (start+1), getDate, (start+1), (start+1), (start+2), (start+2), getDate, (start+2), (start+2),(start+3), (start+3), getDate, (start+3), (start+3),(start+4), (start+4), getDate, (start+4), (start+4),(start+5), (start+5), getDate, (start+5), (start+5),(start+6), (start+6), getDate, (start+6), (start+6),(start+7), (start+7), getDate, (start+7), (start+7),(start+8), (start+8), getDate, (start+8), (start+8),(start+9), (start+9), getDate, (start+9), (start+9), (start+10), (start+10), getDate, (start+10), (start+10), (start+11), (start+11), getDate, (start+11), (start+11), (start+12), (start+12), getDate, (start+12), (start+12), (start+13), (start+13), getDate, (start+13), (start+13), (start+14), (start+14), getDate, (start+14), (start+14),(start+15), (start+15), getDate, (start+15), (start+15), (start+16), (start+16), getDate, (start+16), (start+16), (start+17), (start+17), getDate, (start+17), (start+17), (start+18), (start+18), getDate, (start+18), (start+18),(month+1),(month+1), levelpoint, arr[i], day], function(error, results, fields){
           if(error) throw error;
           console.log("slots updated");
 
          });

         }               
       }

       if(range == 19){
         for(var i=0; i < arr.length ; i++ ){

             mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), percentage? = percentage? + ? WHERE type = "Comp" AND name = ? AND day = ?', 
   [start, start, getDate, start, start, (start+1), (start+1), getDate, (start+1), (start+1), (start+2), (start+2), getDate, (start+2), (start+2),(start+3), (start+3), getDate, (start+3), (start+3),(start+4), (start+4), getDate, (start+4), (start+4),(start+5), (start+5), getDate, (start+5), (start+5),(start+6), (start+6), getDate, (start+6), (start+6),(start+7), (start+7), getDate, (start+7), (start+7),(start+8), (start+8), getDate, (start+8), (start+8),(start+9), (start+9), getDate, (start+9), (start+9), (start+10), (start+10), getDate, (start+10), (start+10), (start+11), (start+11), getDate, (start+11), (start+11), (start+12), (start+12), getDate, (start+12), (start+12), (start+13), (start+13), getDate, (start+13), (start+13), (start+14), (start+14), getDate, (start+14), (start+14),(start+15), (start+15), getDate, (start+15), (start+15), (start+16), (start+16), getDate, (start+16), (start+16), (start+17), (start+17), getDate, (start+17), (start+17), (start+18), (start+18), getDate, (start+18), (start+18), (start+19), (start+19), getDate, (start+19), (start+19), (month+1),(month+1), levelpoint, arr[i], day], function(error, results, fields){
           if(error) throw error;
           console.log("slots updated");
 
          });

         }               
       }

       if(range == 20){
         for(var i=0; i < arr.length ; i++ ){

             mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), percentage? = percentage? + ? WHERE type = "Comp" AND name = ? AND day = ?', 
   [start, start, getDate, start, start, (start+1), (start+1), getDate, (start+1), (start+1), (start+2), (start+2), getDate, (start+2), (start+2),(start+3), (start+3), getDate, (start+3), (start+3),(start+4), (start+4), getDate, (start+4), (start+4),(start+5), (start+5), getDate, (start+5), (start+5),(start+6), (start+6), getDate, (start+6), (start+6),(start+7), (start+7), getDate, (start+7), (start+7),(start+8), (start+8), getDate, (start+8), (start+8),(start+9), (start+9), getDate, (start+9), (start+9), (start+10), (start+10), getDate, (start+10), (start+10), (start+11), (start+11), getDate, (start+11), (start+11), (start+12), (start+12), getDate, (start+12), (start+12), (start+13), (start+13), getDate, (start+13), (start+13), (start+14), (start+14), getDate, (start+14), (start+14),(start+15), (start+15), getDate, (start+15), (start+15), (start+16), (start+16), getDate, (start+16), (start+16), (start+17), (start+17), getDate, (start+17), (start+17), (start+18), (start+18), getDate, (start+18), (start+18), (start+19), (start+19), getDate, (start+19), (start+19), (start+20), (start+20), getDate, (start+20), (start+20), (month+1),(month+1), levelpoint, arr[i], day], function(error, results, fields){
           if(error) throw error;
           console.log("slots updated");
 
          });

         }               
       }

       if(range == 21){
         for(var i=0; i < arr.length ; i++ ){

             mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","TTM"), percentage? = percentage? + ? WHERE type = "Comp" AND name = ? AND day = ?', 
   [start, start, getDate, start, start, (start+1), (start+1), getDate, (start+1), (start+1), (start+2), (start+2), getDate, (start+2), (start+2),(start+3), (start+3), getDate, (start+3), (start+3),(start+4), (start+4), getDate, (start+4), (start+4),(start+5), (start+5), getDate, (start+5), (start+5),(start+6), (start+6), getDate, (start+6), (start+6),(start+7), (start+7), getDate, (start+7), (start+7),(start+8), (start+8), getDate, (start+8), (start+8),(start+9), (start+9), getDate, (start+9), (start+9), (start+10), (start+10), getDate, (start+10), (start+10), (start+11), (start+11), getDate, (start+11), (start+11), (start+12), (start+12), getDate, (start+12), (start+12), (start+13), (start+13), getDate, (start+13), (start+13), (start+14), (start+14), getDate, (start+14), (start+14),(start+15), (start+15), getDate, (start+15), (start+15), (start+16), (start+16), getDate, (start+16), (start+16), (start+17), (start+17), getDate, (start+17), (start+17), (start+18), (start+18), getDate, (start+18), (start+18), (start+19), (start+19), getDate, (start+19), (start+19), (start+20), (start+20), getDate, (start+20), (start+20), (start+21), (start+21), getDate, (start+21), (start+21), (month+1),(month+1), levelpoint, arr[i], day], function(error, results, fields){
           if(error) throw error;
           console.log("slots updated");
 
          });

         }               
       }

      let sql = "INSERT INTO tasksMgmt SET ?";
      mysqlConnection.query(sql , data, function(error, results) {
       if(error) throw error;
       console.log("1 document inserted");
         res.redirect('/admin_pengurusanTugas');
      });
     }    

});     

// =====================================================================================================================================================================================
// ===================================================================================Meeting===========================================================================================
// =====================================================================================================================================================================================

app.get('/senaraiJemputanProgram', checkAuthenticated,function(req,res){
  var owner_name = req.user.fullname;  
  
    mysqlConnection.query('SELECT * FROM meetingInvitation WHERE name LIKE'+mysqlConnection.escape('%'+owner_name+'%')+'OR owner_name LIKE'+mysqlConnection.escape('%'+owner_name+'%')+'ORDER BY date', function(error, results, fields) {
      res.render('senaraiJemputanProgram.ejs', {
                    meetingInvitation : results,
                    owner_name: owner_name
      });
    });
  });
  
  app.get('/admin_aturanJemputanMesyuarat', function(req,res){
    var name = req.user.fullname;
  mysqlConnection.query('SELECT A.name as name, A.day as day, A.slot_1 AS slot_1, A.slot_2 AS slot_2, A.slot_3 AS slot_3, A.slot_4 AS slot_4, A.slot_5 AS slot_5, A.slot_6 AS slot_6, A.slot_7 AS slot_7, A.slot_8 AS slot_8, A.slot_9 AS slot_9, A.slot_10 AS slot_10, A.slot_11 AS slot_11, A.slot_12 AS slot_12, A.slot_13 AS slot_13, A.slot_14 AS slot_14, A.slot_15 AS slot_15, A.slot_16 AS slot_16, A.slot_17 AS slot_17, A.slot_18 AS slot_18, A.slot_19 AS slot_19, A.slot_20 AS slot_20, A.slot_21 AS slot_21, A.slot_22 AS slot_22, (SELECT C.peratus FROM taskpoint C WHERE C.name = A.name AND C.month = "January") AS percentage1, (SELECT C.peratus FROM taskpoint C WHERE C.name = A.name AND C.month = "February") AS percentage2, (SELECT C.peratus FROM taskpoint C WHERE C.name = A.name AND C.month = "March") AS percentage3, (SELECT C.peratus FROM taskpoint C WHERE C.name = A.name AND C.month = "April") AS percentage4, (SELECT C.peratus FROM taskpoint C WHERE C.name = A.name AND C.month = "May") AS percentage5, (SELECT C.peratus FROM taskpoint C WHERE C.name = A.name AND C.month = "June") AS percentage6, (SELECT C.peratus FROM taskpoint C WHERE C.name = A.name AND C.month = "July") AS percentage7, (SELECT C.peratus FROM taskpoint C WHERE C.name = A.name AND C.month = "August") AS percentage8, (SELECT C.peratus FROM taskpoint C WHERE C.name = A.name AND C.month = "September") AS percentage9, (SELECT C.peratus FROM taskpoint C WHERE C.name = A.name AND C.month = "October") AS percentage10, (SELECT C.peratus FROM taskpoint C WHERE C.name = A.name AND C.month = "November") AS percentage11, (SELECT C.peratus FROM taskpoint C WHERE C.name = A.name AND C.month = "December") AS percentage12 FROM availabilityStaff A WHERE A.type = "Comp" ORDER BY (SELECT C.peratus FROM taskpoint C WHERE C.name = A.name AND C.month = "January"), (SELECT C.peratus FROM taskpoint C WHERE C.name = A.name AND C.month = "February"), (SELECT C.peratus FROM taskpoint C WHERE C.name = A.name AND C.month = "March"), (SELECT C.peratus FROM taskpoint C WHERE C.name = A.name AND C.month = "April"), (SELECT C.peratus FROM taskpoint C WHERE C.name = A.name AND C.month = "May"), (SELECT C.peratus FROM taskpoint C WHERE C.name = A.name AND C.month = "June"), (SELECT C.peratus FROM taskpoint C WHERE C.name = A.name AND C.month = "July"), (SELECT C.peratus FROM taskpoint C WHERE C.name = A.name AND C.month = "August") , (SELECT C.peratus FROM taskpoint C WHERE C.name = A.name AND C.month = "September"), (SELECT C.peratus FROM taskpoint C WHERE C.name = A.name AND C.month = "October"), (SELECT C.peratus FROM taskpoint C WHERE C.name = A.name AND C.month = "November"), (SELECT C.peratus FROM taskpoint C WHERE C.name = A.name AND C.month = "December")' , function(error, results, fields) {
  res.render('admin_aturanJemputanMesyuarat.ejs', {
  availabilityStaff : results,
  name:name
  });
  });
  });
  
  app.get('/admin_aturMinitMesyuarat', function(req,res){
    var name = req.user.fullname;
  mysqlConnection.query('SELECT * FROM meetingInfo' , function(error, results, fields) {
  res.render('admin_minitMesyuarat.ejs', {
  meetingInfo : results,
  name:name
  });
  });
  });
  
  // To direct to admin_aturMinitMesyuarat page
app.get('/edit_admin_aturMinitMesyuarat/(:id)', checkAuthenticated,function(req, res) {

  let id = req.params.id;
  var owner_name = req.user.fullname;
 
  mysqlConnection.query('SELECT DISTINCT meetingInfo.uniqueID AS infoUniqueID, meetingInvitation.uniqueID AS uniqueID, meetingInvitation.title AS title, meetingInvitation.date AS date, meetingInvitation.location AS location, meetingInvitation.agenda AS agenda, meetingInvitation.timeFrom AS timeFrom, meetingInvitation.timeTo AS timeTo, meetingInvitation.name AS name, meetingInvitation.confirmation_status AS confirmation_status, meetingInvitation.meeting_id AS meetingNumber, meetingInfo.id AS itemNumber, meetingInfo.item AS item, meetingInfo.nota AS nota, meetingInfo.jenis AS jenis, meetingInfo.task_owner AS task_owner, meetingInfo.tahap AS tahap, meetingInfo.tarikhakhir AS tarikhakhir, meetingInfo.id AS id, (SELECT month FROM taskpoint WHERE name = meetingInvitation.name AND month = "January") AS January, (SELECT peratus FROM taskpoint WHERE name = meetingInvitation.name AND month = "January") AS JanuaryPoint,  (SELECT month FROM taskpoint WHERE name = meetingInvitation.name AND month = "February") AS February, (SELECT peratus FROM taskpoint WHERE name = meetingInvitation.name AND month = "February") AS FebruaryPoint, (SELECT month FROM taskpoint WHERE name = meetingInvitation.name AND month = "March") AS March, (SELECT peratus FROM taskpoint WHERE name = meetingInvitation.name AND month = "March") AS MarchPoint, (SELECT month FROM taskpoint WHERE name = meetingInvitation.name AND month = "April") AS April, (SELECT peratus FROM taskpoint WHERE name = meetingInvitation.name AND month = "April") AS AprilPoint, (SELECT month FROM taskpoint WHERE name = meetingInvitation.name AND month = "May") AS May, (SELECT peratus FROM taskpoint WHERE name = meetingInvitation.name AND month = "May") AS MayPoint, (SELECT month FROM taskpoint WHERE name = meetingInvitation.name AND month = "June") AS June, (SELECT peratus FROM taskpoint WHERE name = meetingInvitation.name AND month = "June") AS JunePoint, (SELECT month FROM taskpoint WHERE name = meetingInvitation.name AND month = "July") AS July, (SELECT peratus FROM taskpoint WHERE name = meetingInvitation.name AND month = "July") AS JulyPoint, (SELECT month FROM taskpoint WHERE name = meetingInvitation.name AND month = "August") AS August, (SELECT peratus FROM taskpoint WHERE name = meetingInvitation.name AND month = "August") AS AugustPoint, (SELECT month FROM taskpoint WHERE name = meetingInvitation.name AND month = "September") AS September, (SELECT peratus FROM taskpoint WHERE name = meetingInvitation.name AND month = "September") AS SeptemberPoint, (SELECT month FROM taskpoint WHERE name = meetingInvitation.name AND month = "October") AS October, (SELECT peratus FROM taskpoint WHERE name = meetingInvitation.name AND month = "October") AS OctoberPoint, (SELECT month FROM taskpoint WHERE name = meetingInvitation.name AND month = "November") AS November, (SELECT peratus FROM taskpoint WHERE name = meetingInvitation.name AND month = "November") AS NovemberPoint, (SELECT month FROM taskpoint WHERE name = meetingInvitation.name AND month = "December") AS December, (SELECT peratus FROM taskpoint WHERE name = meetingInvitation.name AND month = "December") AS DecemberPoint FROM meetingInvitation JOIN meetingInfo  ON meetingInvitation.uniqueID = meetingInfo.uniqueID JOIN taskpoint ON meetingInvitation.name = taskpoint.name WHERE meetingInvitation.uniqueID IN (?) ORDER BY meetingInvitation.uniqueID ', id, function(err, results, fields) {
      if(err) throw err
       
      // if user not found
      if (results.length <= 0) {
          res.redirect('/senaraiJemputanProgram')
      }

      else {
          res.render('admin_aturMinitMesyuarat', {meetingInvitation:results, owner_name:owner_name})
      }
  })
})

// To insert new sub meeting info
app.post('/insert_admin_meetingInfo/(:id)',urlencodedParser, function(req, res, next) {
  // MeetingInfo - as a whole
  // tasksMgmt - as a whole
  // taskProgress - as an individual
  // taskPoint - as an individual
  // Difficulty Level = ?

    let id = req.params.id;
    let item = req.body.item;
    let nota = req.body.nota;
    let jenis = req.body.jenis;
    let task_owner = JSON.stringify(req.body.task_owner);
    let tahap = req.body.tahap;
    let tarikhakhir = req.body.tarikhakhir;
    let title = req.body.title;    
    let today = new Date().toISOString().slice(0, 10);
    var owner_name = req.user.fullname;  
    var obj = JSON.stringify(req.body);
    var jsonObj = JSON.parse(obj);

    var d = new Date()
    var months = new Array(7);
    months[0] = "January";
    months[1] = "February";
    months[2] = "March";
    months[3] = "April";
    months[4] = "May";
    months[5] = "June";
    months[6] = "July";
    months[7] = "August";
    months[8] = "September";
    months[9] = "October";
    months[10] = "November";
    months[11] = "December";
   var m = months[d.getMonth()];
   var t = JSON.stringify(new Date().getDate());

 // For meeting info - info / decision
        var info_data = { 
            uniqueID:id,
            item:item,
            nota:nota,
            jenis:jenis,
            task_owner:JSON.stringify(req.body.task_owner),
            tahap:"",
            tarikhakhir:tarikhakhir
          }

  // For meeting info - task
        var taskInfo_data = { 
            uniqueID:id,
            item:item,
            nota:nota,
            jenis:jenis,
            task_owner:JSON.stringify(req.body.task_owner),
            tahap:tahap,
            tarikhakhir:tarikhakhir
          }
       

          if(jsonObj.item == "Tugas"){

            var name1 = JSON.stringify(req.body.task_owner);
            

            if(name1 == ""){
              var arr = [""];
            }

            else if(name1 != ""){
            var name2 = name1.replace("[",""); 
            var name3 = name2.replace("]","");
            var search = '"';
            var replaceWith ='';
            var name4 = name3.split(search).join(replaceWith);
            var arr= name4.split(",");
            }

            let task_data = {
            uniqueID:id,
            task:"Tugasan Mesyuarat",
            note:nota,
            names:JSON.stringify(req.body.task_owner),
            tahap:tahap,
            dueDate:tarikhakhir,
            role:"Penyerah Tugas",
            date:"",
            timeFrom:"",
            timeUntil:"",
            location:"",
            title: title,
            agenda:"",
            owner_name: owner_name
          }

           mysqlConnection.query('INSERT INTO tasksMgmt SET ?',[task_data], function(error, results, fields){
            if(error) throw error;
            console.log("Meeting task is inserted to tasksMgmt");
              });

           for(var i=0; i<arr.length; i++){

             mysqlConnection.query('INSERT INTO taskProgress(uniqueID, category, title, taskname, taskowner, dueDate, status, feedback, notes, taskassigner, taskpoints, completion, collaborators, teamDateCompletion) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
               [id, "Tugasan Mesyuarat", title, nota, arr[i], tarikhakhir, "Belum Mula", "Tiada", "", owner_name, 0, 0, task_owner, today], function(error, results, fields){
                  if(error) throw error;
                  console.log("Meeting task is inserted to taskProgress");
                  });          
           
            if(jsonObj.tahap==="Tinggi"){
            
              mysqlConnection.query('UPDATE taskpoint SET tinggi = tinggi +3 ,tinggidetail = CONCAT(tinggidetail, "," ,?), peratus = CASE WHEN peratus < 40 THEN peratus +3 ELSE peratus END, pinperatus=CONCAT(pinperatus,",",peratus),pindate=CONCAT(pindate,",",?) WHERE name = ? AND month=? ', [nota,t,arr[i],m], function(error, results, fields){
                 if(error) throw error;
                 console.log("1 hard point inserted");
                 console.log("1 hard detail inserted");
                 console.log("total points updated");
                });              
             }
  
            else if(jsonObj.tahap==="Sederhana"){
              
              mysqlConnection.query('UPDATE taskpoint SET sederhana = sederhana+2 ,sederhanadetail = CONCAT(sederhanadetail, "," ,?), peratus = CASE WHEN peratus< 40 THEN peratus +2 ELSE peratus END, pinperatus=CONCAT(pinperatus,",",peratus),pindate=CONCAT(pindate,",",?) WHERE name = ? AND month=? ', [nota,t,arr[i],m], function(error, results, fields){
                 if(error) throw error;
                 console.log("1 medium point inserted");
                 console.log("1 medium detail inserted");
                 console.log("total points updated");
                });
             }
  
             else if(jsonObj.tahap==="Rendah" || jsonObj.tahap ==="Sangat Rendah"){
              
              mysqlConnection.query('UPDATE taskpoint SET rendah = rendah+1 ,rendahdetail = CONCAT(rendahdetail, "," ,?), peratus = CASE WHEN peratus <40 THEN peratus +1 ELSE peratus END,pinperatus=CONCAT(pinperatus,",",peratus),pindate=CONCAT(pindate,",",?) WHERE name = ? AND month=? ', [nota,t,arr[i],m], function(error, results, fields){
                 if(error) throw error;
                 console.log("1 easy point inserted");
                 console.log("1 easy detail inserted");
                 console.log("total points updated");
                });
             }
          
           }//exit loop

            mysqlConnection.query('INSERT INTO meetingInfo SET ?',[taskInfo_data], function(error, results, fields){
            if(error) throw error;
            console.log("Meeting task is inserted");
              });

          }

          else{
             mysqlConnection.query('INSERT INTO meetingInfo SET ?',[info_data], function(error, results, fields){
            if(error) throw error;
            console.log("Meeting info is inserted");
              });

          }         
           
           
            mysqlConnection.query('SELECT DISTINCT meetingInfo.uniqueID AS infoUniqueID, meetingInvitation.uniqueID AS uniqueID, meetingInvitation.title AS title, meetingInvitation.date AS date, meetingInvitation.location AS location, meetingInvitation.agenda AS agenda, meetingInvitation.timeFrom AS timeFrom, meetingInvitation.timeTo AS timeTo, meetingInvitation.name AS name, meetingInvitation.confirmation_status AS confirmation_status, meetingInvitation.meeting_id AS meetingNumber, meetingInfo.id AS itemNumber, meetingInfo.item AS item, meetingInfo.nota AS nota, meetingInfo.jenis AS jenis, meetingInfo.task_owner AS task_owner, meetingInfo.tahap AS tahap, meetingInfo.tarikhakhir AS tarikhakhir, meetingInfo.id AS id, (SELECT month FROM taskpoint WHERE name = meetingInvitation.name AND month = "January") AS January, (SELECT peratus FROM taskpoint WHERE name = meetingInvitation.name AND month = "January") AS JanuaryPoint,  (SELECT month FROM taskpoint WHERE name = meetingInvitation.name AND month = "February") AS February, (SELECT peratus FROM taskpoint WHERE name = meetingInvitation.name AND month = "February") AS FebruaryPoint, (SELECT month FROM taskpoint WHERE name = meetingInvitation.name AND month = "March") AS March, (SELECT peratus FROM taskpoint WHERE name = meetingInvitation.name AND month = "March") AS MarchPoint, (SELECT month FROM taskpoint WHERE name = meetingInvitation.name AND month = "April") AS April, (SELECT peratus FROM taskpoint WHERE name = meetingInvitation.name AND month = "April") AS AprilPoint, (SELECT month FROM taskpoint WHERE name = meetingInvitation.name AND month = "May") AS May, (SELECT peratus FROM taskpoint WHERE name = meetingInvitation.name AND month = "May") AS MayPoint, (SELECT month FROM taskpoint WHERE name = meetingInvitation.name AND month = "June") AS June, (SELECT peratus FROM taskpoint WHERE name = meetingInvitation.name AND month = "June") AS JunePoint, (SELECT month FROM taskpoint WHERE name = meetingInvitation.name AND month = "July") AS July, (SELECT peratus FROM taskpoint WHERE name = meetingInvitation.name AND month = "July") AS JulyPoint, (SELECT month FROM taskpoint WHERE name = meetingInvitation.name AND month = "August") AS August, (SELECT peratus FROM taskpoint WHERE name = meetingInvitation.name AND month = "August") AS AugustPoint, (SELECT month FROM taskpoint WHERE name = meetingInvitation.name AND month = "September") AS September, (SELECT peratus FROM taskpoint WHERE name = meetingInvitation.name AND month = "September") AS SeptemberPoint, (SELECT month FROM taskpoint WHERE name = meetingInvitation.name AND month = "October") AS October, (SELECT peratus FROM taskpoint WHERE name = meetingInvitation.name AND month = "October") AS OctoberPoint, (SELECT month FROM taskpoint WHERE name = meetingInvitation.name AND month = "November") AS November, (SELECT peratus FROM taskpoint WHERE name = meetingInvitation.name AND month = "November") AS NovemberPoint, (SELECT month FROM taskpoint WHERE name = meetingInvitation.name AND month = "December") AS December, (SELECT peratus FROM taskpoint WHERE name = meetingInvitation.name AND month = "December") AS DecemberPoint FROM meetingInvitation JOIN meetingInfo  ON meetingInvitation.uniqueID = meetingInfo.uniqueID JOIN taskpoint ON meetingInvitation.name = taskpoint.name WHERE meetingInvitation.uniqueID IN (?) ORDER BY meetingInvitation.uniqueID ', id, function(err, results, fields) {
                if(err) throw err
                 
                // if user not found
                if (results.length <= 0) {
                    res.redirect('/senaraiJemputanProgram')
                }

                else {
                    res.render('admin_aturMinitMesyuarat', {meetingInvitation:results, owner_name:owner_name})
                }
            })
            
})


// to delete sub meeting info
app.get('/delete_meetingInfo/(:id)', function(req, res, next) {

  var id_uniqueID = req.params.id;
  var aftersplit = id_uniqueID.split("_");
  var id = parseInt(aftersplit[0]); 
  var uniqueID = aftersplit[1];
  var item = aftersplit[2];
  var nota = aftersplit[3];
  var jenis = aftersplit[4];
  var task_owner = aftersplit[5];
  var tahap = aftersplit[6];
  var tarikhakhir = aftersplit[7];
  var owner_name = req.user.fullname;  

  var name1 = task_owner;
  var name2 = name1.replace("[",""); 
  var name3 = name2.replace("]","");
  var search = '"';
  var replaceWith ='';
  var name4 = name3.split(search).join(replaceWith);
  var arr= name4.split(",");

  if(item == "Tugas"){
      mysqlConnection.query('DELETE FROM tasksMgmt WHERE uniqueID = ? AND note IN (?) AND dueDate IN (?) AND tahap IN (?) AND names IN (?)', [uniqueID, nota, tarikhakhir, tahap, task_owner], function(error, results, fields){
      if(error) throw error;
      console.log("Meeting info is deleted");

      mysqlConnection.query('DELETE FROM taskProgress WHERE uniqueID = ? AND taskname IN (?) AND dueDate = ? AND collaborators IN (?)', [uniqueID, nota, tarikhakhir, task_owner], function(error, results, fields){
      if(error) throw error;
      console.log("Meeting info is deleted");
    });
    });

  for(var i=0; i<arr.length; i++){

  if(tahap == "Tinggi"){
          mysqlConnection.query('UPDATE taskpoint SET tinggi = tinggi-1, tinggidetail = replace(tinggidetail, ?, ""), peratus = peratus-3 WHERE name = ?'
          ,[nota, arr[i]], function(error, results, fields){
              if(error) throw error;
              console.log("task points is updated");
          })
          }

          else if(tahap == "Sederhana"){
          mysqlConnection.query('UPDATE taskpoint SET sederhana = sederhana-1, sederhanadetail = replace(sederhanadetail, ?, ""), peratus = peratus-2 WHERE name = ?'
          ,[nota, arr[i]], function(error, results, fields){
              if(error) throw error;
              console.log("task points is updated");
          })
          }

          else if(tahap == "Rendah" || tahap == "Sangat Rendah"){
          mysqlConnection.query('UPDATE taskpoint SET rendah = rendah-1, rendahdetail = replace(rendahdetail, ?, ""), peratus = peratus-1 WHERE name = ?'
          ,[nota, arr[i]], function(error, results, fields){
              if(error) throw error;
              console.log("task points is updated");
          })
          }
      }

  }

  mysqlConnection.query('DELETE FROM meetingInfo WHERE id = ?', id, function(error, results, fields){
  if(error) throw error;
  console.log("Meeting info is deleted");
    });
 
  mysqlConnection.query('SELECT DISTINCT meetingInfo.uniqueID AS infoUniqueID, meetingInvitation.uniqueID AS uniqueID, meetingInvitation.title AS title, meetingInvitation.date AS date, meetingInvitation.location AS location, meetingInvitation.agenda AS agenda, meetingInvitation.timeFrom AS timeFrom, meetingInvitation.timeTo AS timeTo, meetingInvitation.name AS name, meetingInvitation.confirmation_status AS confirmation_status, meetingInvitation.meeting_id AS meetingNumber, meetingInfo.id AS itemNumber, meetingInfo.item AS item, meetingInfo.nota AS nota, meetingInfo.jenis AS jenis, meetingInfo.task_owner AS task_owner, meetingInfo.tahap AS tahap, meetingInfo.tarikhakhir AS tarikhakhir, meetingInfo.id AS id, (SELECT month FROM taskpoint WHERE name = meetingInvitation.name AND month = "January") AS January, (SELECT peratus FROM taskpoint WHERE name = meetingInvitation.name AND month = "January") AS JanuaryPoint,  (SELECT month FROM taskpoint WHERE name = meetingInvitation.name AND month = "February") AS February, (SELECT peratus FROM taskpoint WHERE name = meetingInvitation.name AND month = "February") AS FebruaryPoint, (SELECT month FROM taskpoint WHERE name = meetingInvitation.name AND month = "March") AS March, (SELECT peratus FROM taskpoint WHERE name = meetingInvitation.name AND month = "March") AS MarchPoint, (SELECT month FROM taskpoint WHERE name = meetingInvitation.name AND month = "April") AS April, (SELECT peratus FROM taskpoint WHERE name = meetingInvitation.name AND month = "April") AS AprilPoint, (SELECT month FROM taskpoint WHERE name = meetingInvitation.name AND month = "May") AS May, (SELECT peratus FROM taskpoint WHERE name = meetingInvitation.name AND month = "May") AS MayPoint, (SELECT month FROM taskpoint WHERE name = meetingInvitation.name AND month = "June") AS June, (SELECT peratus FROM taskpoint WHERE name = meetingInvitation.name AND month = "June") AS JunePoint, (SELECT month FROM taskpoint WHERE name = meetingInvitation.name AND month = "July") AS July, (SELECT peratus FROM taskpoint WHERE name = meetingInvitation.name AND month = "July") AS JulyPoint, (SELECT month FROM taskpoint WHERE name = meetingInvitation.name AND month = "August") AS August, (SELECT peratus FROM taskpoint WHERE name = meetingInvitation.name AND month = "August") AS AugustPoint, (SELECT month FROM taskpoint WHERE name = meetingInvitation.name AND month = "September") AS September, (SELECT peratus FROM taskpoint WHERE name = meetingInvitation.name AND month = "September") AS SeptemberPoint, (SELECT month FROM taskpoint WHERE name = meetingInvitation.name AND month = "October") AS October, (SELECT peratus FROM taskpoint WHERE name = meetingInvitation.name AND month = "October") AS OctoberPoint, (SELECT month FROM taskpoint WHERE name = meetingInvitation.name AND month = "November") AS November, (SELECT peratus FROM taskpoint WHERE name = meetingInvitation.name AND month = "November") AS NovemberPoint, (SELECT month FROM taskpoint WHERE name = meetingInvitation.name AND month = "December") AS December, (SELECT peratus FROM taskpoint WHERE name = meetingInvitation.name AND month = "December") AS DecemberPoint FROM meetingInvitation JOIN meetingInfo  ON meetingInvitation.uniqueID = meetingInfo.uniqueID JOIN taskpoint ON meetingInvitation.name = taskpoint.name WHERE meetingInvitation.uniqueID IN (?) ORDER BY meetingInvitation.uniqueID ', uniqueID, function(err, results, fields) {
      if(err) throw err
       
      // if user not found
      if (results.length <= 0) {
          res.redirect('/senaraiJemputanProgram')
      }

      else {
          res.render('admin_aturMinitMesyuarat', {meetingInvitation:results, owner_name:owner_name})
      }
  })
  
})

app.get('/edit_meetingInfo/(:id)', function(req, res, next) {
  var name = req.user.fullname;
      var item_uniqueID = req.params.id;
      var aftersplit = item_uniqueID.split("_");
      var itemPass = parseInt(aftersplit[0]);
      var uniqueID = aftersplit[1];
     
      mysqlConnection.query('SELECT DISTINCT meetingInfo.uniqueID AS infoUniqueID, meetingInvitation.uniqueID AS uniqueID, meetingInvitation.title AS title, meetingInvitation.date AS date, meetingInvitation.location AS location, meetingInvitation.timeFrom AS timeFrom, meetingInvitation.timeTo AS timeTo, meetingInvitation.name AS name, meetingInvitation.confirmation_status AS confirmation_status, meetingInvitation.meeting_id AS meetingNumber, meetingInfo.id AS itemNumber, meetingInfo.item AS item, meetingInfo.nota AS nota, meetingInfo.jenis AS jenis, meetingInfo.task_owner AS task_owner, meetingInfo.tahap AS tahap, meetingInfo.tarikhakhir AS tarikhakhir, meetingInfo.id AS id, (SELECT month FROM taskpoint WHERE name = meetingInvitation.name AND month = "January") AS January, (SELECT peratus FROM taskpoint WHERE name = meetingInvitation.name AND month = "January") AS JanuaryPoint,  (SELECT month FROM taskpoint WHERE name = meetingInvitation.name AND month = "February") AS February, (SELECT peratus FROM taskpoint WHERE name = meetingInvitation.name AND month = "February") AS FebruaryPoint, (SELECT month FROM taskpoint WHERE name = meetingInvitation.name AND month = "March") AS March, (SELECT peratus FROM taskpoint WHERE name = meetingInvitation.name AND month = "March") AS MarchPoint, (SELECT month FROM taskpoint WHERE name = meetingInvitation.name AND month = "April") AS April, (SELECT peratus FROM taskpoint WHERE name = meetingInvitation.name AND month = "April") AS AprilPoint, (SELECT month FROM taskpoint WHERE name = meetingInvitation.name AND month = "May") AS May, (SELECT peratus FROM taskpoint WHERE name = meetingInvitation.name AND month = "May") AS MayPoint, (SELECT month FROM taskpoint WHERE name = meetingInvitation.name AND month = "June") AS June, (SELECT peratus FROM taskpoint WHERE name = meetingInvitation.name AND month = "June") AS JunePoint, (SELECT month FROM taskpoint WHERE name = meetingInvitation.name AND month = "July") AS July, (SELECT peratus FROM taskpoint WHERE name = meetingInvitation.name AND month = "July") AS JulyPoint, (SELECT month FROM taskpoint WHERE name = meetingInvitation.name AND month = "August") AS August, (SELECT peratus FROM taskpoint WHERE name = meetingInvitation.name AND month = "August") AS AugustPoint, (SELECT month FROM taskpoint WHERE name = meetingInvitation.name AND month = "September") AS September, (SELECT peratus FROM taskpoint WHERE name = meetingInvitation.name AND month = "September") AS SeptemberPoint, (SELECT month FROM taskpoint WHERE name = meetingInvitation.name AND month = "October") AS October, (SELECT peratus FROM taskpoint WHERE name = meetingInvitation.name AND month = "October") AS OctoberPoint, (SELECT month FROM taskpoint WHERE name = meetingInvitation.name AND month = "November") AS November, (SELECT peratus FROM taskpoint WHERE name = meetingInvitation.name AND month = "November") AS NovemberPoint, (SELECT month FROM taskpoint WHERE name = meetingInvitation.name AND month = "December") AS December, (SELECT peratus FROM taskpoint WHERE name = meetingInvitation.name AND month = "December") AS DecemberPoint FROM meetingInvitation JOIN meetingInfo  ON meetingInvitation.uniqueID = meetingInfo.uniqueID JOIN taskpoint ON meetingInvitation.name = taskpoint.name WHERE meetingInvitation.uniqueID IN (?) ORDER BY meetingInvitation.uniqueID', uniqueID, function(err, results, fields) {
          if(err) throw err
          
          if (results.length <= 0) {
              res.redirect('/senaraiJemputanProgram')
          }
  
          else {
              // render to edit.ejs
              res.render('edit_meetingInfo', {
                 meetingInvitation:results, 
                 itemPass:itemPass,
                 name:name
              })
          }
      })
      
  })

  app.post('/update_meetingInfo/:id',urlencodedParser, function(req, res, next) {
    
    let id_itemNumber = req.params.id; 
    var aftersplit = id_itemNumber.split("_");
    let id = aftersplit[0];
    let itemNumber = aftersplit[1];
    let note = req.body.nota;

    let dueDate = req.body.tarikhakhir
    let tahap = req.body.tahap;
    let previousTahap = req.body.previousTahap;
    let task_owner = req.body.task_owner;
    let item = req.body.item;
    let jenis = req.body.jenis;    
    var owner_name = req.user.fullname;


    var name1 = JSON.stringify(req.body.task_owner);
    var name2 = name1.replace("[",""); 
    var name3 = name2.replace("]","");
    var a = "\\";
    var search = '"';
    var replaceWith ='';
    var name4 = name3.split(search).join(replaceWith);
    var arr= name4.split(",");
 
       var form_data = { 
            note: note,
            dueDate: dueDate,
            tahap: tahap
          }

          var progress = {
            taskname:note,
            dueDate:dueDate
          }

         var info_data = { 
            item:item,
            nota:note,
            jenis:jenis,
            tahap:tahap,
            tarikhakhir:dueDate
          }

        for(var i=0; i<arr.length; i++){
        if(previousTahap != tahap){

            if(tahap == "Tinggi"){
            mysqlConnection.query('UPDATE taskpoint SET tinggi = tinggi+1,tinggidetail = CONCAT(tinggidetail, "," ,?), peratus = peratus+3  WHERE name = ? ', [note,arr[i]], function(error, results, fields){
                 if(error) throw error;
                 console.log("1 hard point inserted");
                 console.log("1 hard detail inserted");
                 console.log("total points updated");
                });     
            }

            else if(tahap == "Sederhana"){
             mysqlConnection.query('UPDATE taskpoint SET sederhana = sederhana+1,sederhanadetail = CONCAT(sederhanadetail, "," ,?), peratus = peratus+2  WHERE name = ? ', [note,arr[i]], function(error, results, fields){
                 if(error) throw error;
                 console.log("1 hard point inserted");
                 console.log("1 hard detail inserted");
                 console.log("total points updated");
                });     
            }

            else if(tahap == "Rendah" || tahap == "Sangat Rendah"){
             mysqlConnection.query('UPDATE taskpoint SET rendah = rendah+1,rendahdetail = CONCAT(rendahdetail, "," ,?), peratus = peratus+1  WHERE name = ? ', [note,arr[i]], function(error, results, fields){
                 if(error) throw error;
                 console.log("1 hard point inserted");
                 console.log("1 hard detail inserted");
                 console.log("total points updated");
                });     
            }

            if(previousTahap == "Tinggi"){
            mysqlConnection.query('UPDATE taskpoint SET tinggi = tinggi-1, tinggidetail = replace(tinggidetail, ?, ""), peratus = peratus-3 WHERE name = ?'
            ,[note, arr[i]], function(error, results, fields){
                if(error) throw error;
                console.log("task points is updated");
            })
            }

            else if(previousTahap == "Sederhana"){
            mysqlConnection.query('UPDATE taskpoint SET sederhana = sederhana-1, sederhanadetail = replace(sederhanadetail, ?, ""), peratus = peratus-2 WHERE name = ?'
            ,[note, arr[i]], function(error, results, fields){
                if(error) throw error;
                console.log("task points is updated");
            })
            }

            else if(previousTahap == "Rendah" || previousTahap == "Sangat Rendah"){
            mysqlConnection.query('UPDATE taskpoint SET rendah = rendah-1, rendahdetail = replace(rendahdetail, ?, ""), peratus = peratus-1 WHERE name = ?'
            ,[note, arr[i]], function(error, results, fields){
                if(error) throw error;
                console.log("task points is updated");
            })
            }
        }

      }

      mysqlConnection.query('UPDATE taskProgress SET ? WHERE uniqueID = ? ', [progress,id], function(error, results, fields){
                 if(error) throw error;
                 console.log("task progress is updated");
                });   
    // update query
      mysqlConnection.query('UPDATE tasksMgmt SET ? WHERE uniqueID = ? ', [form_data,id], function(error, results, fields){
             if(error) throw error;
             console.log("task management is updated");
            });   

   // update query
      mysqlConnection.query('UPDATE meetingInfo SET ? WHERE id = ?', [info_data,itemNumber], function(error, results, fields){
             if(error) throw error;
             console.log("meeting info is updated");
            }); 

        mysqlConnection.query('SELECT DISTINCT meetingInfo.uniqueID AS infoUniqueID, meetingInvitation.uniqueID AS uniqueID, meetingInvitation.title AS title, meetingInvitation.date AS date, meetingInvitation.location AS location, meetingInvitation.agenda AS agenda, meetingInvitation.timeFrom AS timeFrom, meetingInvitation.timeTo AS timeTo, meetingInvitation.name AS name, meetingInvitation.confirmation_status AS confirmation_status, meetingInvitation.meeting_id AS meetingNumber, meetingInfo.id AS itemNumber, meetingInfo.item AS item, meetingInfo.nota AS nota, meetingInfo.jenis AS jenis, meetingInfo.task_owner AS task_owner, meetingInfo.tahap AS tahap, meetingInfo.tarikhakhir AS tarikhakhir, meetingInfo.id AS id, (SELECT month FROM taskpoint WHERE name = meetingInvitation.name AND month = "January") AS January, (SELECT peratus FROM taskpoint WHERE name = meetingInvitation.name AND month = "January") AS JanuaryPoint,  (SELECT month FROM taskpoint WHERE name = meetingInvitation.name AND month = "February") AS February, (SELECT peratus FROM taskpoint WHERE name = meetingInvitation.name AND month = "February") AS FebruaryPoint, (SELECT month FROM taskpoint WHERE name = meetingInvitation.name AND month = "March") AS March, (SELECT peratus FROM taskpoint WHERE name = meetingInvitation.name AND month = "March") AS MarchPoint, (SELECT month FROM taskpoint WHERE name = meetingInvitation.name AND month = "April") AS April, (SELECT peratus FROM taskpoint WHERE name = meetingInvitation.name AND month = "April") AS AprilPoint, (SELECT month FROM taskpoint WHERE name = meetingInvitation.name AND month = "May") AS May, (SELECT peratus FROM taskpoint WHERE name = meetingInvitation.name AND month = "May") AS MayPoint, (SELECT month FROM taskpoint WHERE name = meetingInvitation.name AND month = "June") AS June, (SELECT peratus FROM taskpoint WHERE name = meetingInvitation.name AND month = "June") AS JunePoint, (SELECT month FROM taskpoint WHERE name = meetingInvitation.name AND month = "July") AS July, (SELECT peratus FROM taskpoint WHERE name = meetingInvitation.name AND month = "July") AS JulyPoint, (SELECT month FROM taskpoint WHERE name = meetingInvitation.name AND month = "August") AS August, (SELECT peratus FROM taskpoint WHERE name = meetingInvitation.name AND month = "August") AS AugustPoint, (SELECT month FROM taskpoint WHERE name = meetingInvitation.name AND month = "September") AS September, (SELECT peratus FROM taskpoint WHERE name = meetingInvitation.name AND month = "September") AS SeptemberPoint, (SELECT month FROM taskpoint WHERE name = meetingInvitation.name AND month = "October") AS October, (SELECT peratus FROM taskpoint WHERE name = meetingInvitation.name AND month = "October") AS OctoberPoint, (SELECT month FROM taskpoint WHERE name = meetingInvitation.name AND month = "November") AS November, (SELECT peratus FROM taskpoint WHERE name = meetingInvitation.name AND month = "November") AS NovemberPoint, (SELECT month FROM taskpoint WHERE name = meetingInvitation.name AND month = "December") AS December, (SELECT peratus FROM taskpoint WHERE name = meetingInvitation.name AND month = "December") AS DecemberPoint FROM meetingInvitation JOIN meetingInfo  ON meetingInvitation.uniqueID = meetingInfo.uniqueID JOIN taskpoint ON meetingInvitation.name = taskpoint.name WHERE meetingInvitation.uniqueID IN (?) ORDER BY meetingInvitation.uniqueID ', id, function(err, results, fields) {
                if(err) throw err
                 
                // if user not found
                if (results.length <= 0) {
                    res.redirect('/senaraiJemputanProgram')
                }

                else {
                    res.render('admin_aturMinitMesyuarat', {meetingInvitation:results, owner_name:owner_name})
                }
            })
    
}) 

app.get('/delete_meetingInvitation/(:id)', function(req, res, next) {
  // <%=meetingInvitation[i].uniqueID%>_<%=meetingInvitation[i].date%>_<%= meetingInvitation[i].timeFrom%>_<%= meetingInvitation[i].timeTo%>_<%= meetingInvitation[i].name%>
    let id_date_timeFrom_timeTo_name = req.params.id;
    let aftersplit = id_date_timeFrom_timeTo_name.split("_");
    let id = aftersplit[0];
    let uniqueID = aftersplit[0];
    let date = aftersplit[1];
    let timeFrom = aftersplit[2];
    let timeUntil = aftersplit[3];
    var name1 = aftersplit[4];
    var title = aftersplit[5];
    var owner_name = req.user.fullname;
    
    mysqlConnection.query('DELETE FROM meetingInfo WHERE uniqueID = ?', id, function(error, results, fields){
        if(error) throw error;
        console.log("One meeting is deleted");
    });

    mysqlConnection.query('DELETE FROM taskProgress WHERE uniqueID = ?', id, function(error, results, fields){
        if(error) throw error;
        console.log("One meeting is deleted");
    });

    mysqlConnection.query('DELETE FROM tasksMgmt WHERE uniqueID = ?', id, function(error, results, fields){
        if(error) throw error;
        console.log("One meeting is deleted");
    });

    var comma = ",";
    var up1 = '"';
    var up2 = '"';
    var up1_date = up1.concat(date);
    var up2_date = up1_date.concat(up2);
    var con_date = comma.concat(up2_date);

    console.log(con_date);

    var nameArr = [];
    nameArr.push(name1.split(","));

    var start = 0;
    var finish = 0;

    var getDate = new Date(date);
    var weekday = new Array(7);
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";

    var day = weekday[getDate.getDay()];

    var timeFrom_ar = ["7:30", "8:00", "8:30", "9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", 
                       "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"];

    var timeUntil_ar = ["8:00", "8:30", "9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", 
                        "16:00", "16:30", "17:00", "17:30", "18:00", "18:30"];

    for (var i = 0; i < timeFrom_ar.length; i++)  { 
      if(timeFrom_ar[i] == timeFrom)
        {start = i+1;} //1
      }

    for (var i = 0; i < timeUntil_ar.length; i++) {       
    if(timeUntil_ar[i] == timeUntil)
      {finish = i+1;} //22
    }

  var range = finish - start;


    for(var p = 0; p< nameArr.length; p++) {

      for(var j = 0; j< nameArr[p].length; j++) {

        console.log(nameArr[p][j]);

        mysqlConnection.query('UPDATE taskpoint SET mesyuarat = mesyuarat-2, mesyuaratdetail = replace(mesyuaratdetail, ?, ""), peratus = peratus-2 WHERE name = ?'
            ,[title, nameArr[p][j]], function(error, results, fields){
                if(error) throw error;
                console.log("task points is updated");
            })

        if (range == 0){
          mysqlConnection.query('UPDATE availabilityStaff SET slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, "") WHERE name LIKE '+mysqlConnection.escape('%'+nameArr[p][j]+'%')+' AND type = "Comp" AND day IN (?)'
            ,[start, start, con_date, start, start, uniqueID, day], function(error, results, fields){
                if(error) throw error;
                console.log("Availability Staff is updated");
          });
         }

        if (range == 1){
        mysqlConnection.query('UPDATE availabilityStaff SET slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, "") WHERE name LIKE '+mysqlConnection.escape('%'+nameArr[p][j]+'%')+' AND type = "Comp" AND day IN (?)'
          ,[start, start, con_date, start, start, uniqueID, (start+1), (start+1), con_date, (start+1), (start+1), uniqueID, day], function(error, results, fields){
              if(error) throw error;
              console.log("Availability Staff is updated");
        });
       }
     
     if (range == 2){
        mysqlConnection.query('UPDATE availabilityStaff SET slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, "") WHERE name LIKE '+mysqlConnection.escape('%'+nameArr[p][j]+'%')+' AND type = "Comp" AND day IN (?)'
          ,[start, start, con_date, start, start, uniqueID, (start+1), (start+1), con_date, (start+1), (start+1), uniqueID, (start+2), (start+2), con_date, (start+2), (start+2), uniqueID, day], function(error, results, fields){
              if(error) throw error;
              console.log("Availability Staff is updated");
        });
       }
     
     if (range == 3){
        mysqlConnection.query('UPDATE availabilityStaff SET slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, "") WHERE name LIKE '+mysqlConnection.escape('%'+nameArr[p][j]+'%')+' AND type = "Comp" AND day IN (?)'
          ,[start, start, con_date, start, start, uniqueID, (start+1), (start+1), con_date, (start+1), (start+1), uniqueID, (start+2), (start+2), con_date, (start+2), (start+2), uniqueID, (start+3), (start+3), con_date, (start+3), (start+3), uniqueID, day], function(error, results, fields){
              if(error) throw error;
              console.log("Availability Staff is updated");
        });
       }
     
     if (range == 4){
        mysqlConnection.query('UPDATE availabilityStaff SET slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, "") WHERE name LIKE '+mysqlConnection.escape('%'+nameArr[p][j]+'%')+' AND type = "Comp" AND day IN (?)'
          ,[start, start, con_date, start, start, uniqueID, (start+1), (start+1), con_date, (start+1), (start+1), uniqueID, (start+2), (start+2), con_date, (start+2), (start+2), uniqueID, (start+3), (start+3), con_date, (start+3), (start+3), uniqueID, (start+4), (start+4), con_date, (start+4), (start+4), uniqueID, day], function(error, results, fields){
              if(error) throw error;
              console.log("Availability Staff is updated");
        });
       }
     
     if (range == 5){
        mysqlConnection.query('UPDATE availabilityStaff SET slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, "") WHERE name LIKE '+mysqlConnection.escape('%'+nameArr[p][j]+'%')+' AND type = "Comp" AND day IN (?)'
          ,[start, start, con_date, start, start, uniqueID, (start+1), (start+1), con_date, (start+1), (start+1), uniqueID, (start+2), (start+2), con_date, (start+2), (start+2), uniqueID, (start+3), (start+3), con_date, (start+3), (start+3), uniqueID, (start+4), (start+4), con_date, (start+4), (start+4), uniqueID, (start+5), (start+5), con_date, (start+5), (start+5), uniqueID, day], function(error, results, fields){
              if(error) throw error;
              console.log("Availability Staff is updated");
        });
       }
     
     if (range == 6){
        mysqlConnection.query('UPDATE availabilityStaff SET slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, "") WHERE name LIKE '+mysqlConnection.escape('%'+nameArr[p][j]+'%')+' AND type = "Comp" AND day IN (?)'
          ,[start, start, con_date, start, start, uniqueID, (start+1), (start+1), con_date, (start+1), (start+1), uniqueID, (start+2), (start+2), con_date, (start+2), (start+2), uniqueID, (start+3), (start+3), con_date, (start+3), (start+3), uniqueID, (start+4), (start+4), con_date, (start+4), (start+4), uniqueID, (start+5), (start+5), con_date, (start+5), (start+5), uniqueID, (start+6), (start+6), con_date, (start+6), (start+6), uniqueID, day], function(error, results, fields){
              if(error) throw error;
              console.log("Availability Staff is updated");
        });
       }
     
     if (range == 7){
        mysqlConnection.query('UPDATE availabilityStaff SET slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, "") WHERE name LIKE '+mysqlConnection.escape('%'+nameArr[p][j]+'%')+' AND type = "Comp" AND day IN (?)'
          ,[start, start, con_date, start, start, uniqueID, (start+1), (start+1), con_date, (start+1), (start+1), uniqueID, (start+2), (start+2), con_date, (start+2), (start+2), uniqueID, (start+3), (start+3), con_date, (start+3), (start+3), uniqueID, (start+4), (start+4), con_date, (start+4), (start+4), uniqueID, (start+5), (start+5), con_date, (start+5), (start+5), uniqueID, (start+6), (start+6), con_date, (start+6), (start+6), uniqueID, (start+7), (start+7), con_date, (start+7), (start+7), uniqueID, day], function(error, results, fields){
              if(error) throw error;
              console.log("Availability Staff is updated");
        });
       }
     
     if (range == 8){
        mysqlConnection.query('UPDATE availabilityStaff SET slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, "") WHERE name LIKE '+mysqlConnection.escape('%'+nameArr[p][j]+'%')+' AND type = "Comp" AND day IN (?)'
          ,[start, start, con_date, start, start, uniqueID, (start+1), (start+1), con_date, (start+1), (start+1), uniqueID, (start+2), (start+2), con_date, (start+2), (start+2), uniqueID, (start+3), (start+3), con_date, (start+3), (start+3), uniqueID, (start+4), (start+4), con_date, (start+4), (start+4), uniqueID, (start+5), (start+5), con_date, (start+5), (start+5), uniqueID, (start+6), (start+6), con_date, (start+6), (start+6), uniqueID, (start+7), (start+7), con_date, (start+7), (start+7), uniqueID, (start+8), (start+8), con_date, (start+8), (start+8), uniqueID, day], function(error, results, fields){
              if(error) throw error;
              console.log("Availability Staff is updated");
        });
       }
     
     if (range == 9){
        mysqlConnection.query('UPDATE availabilityStaff SET slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, "") WHERE name LIKE '+mysqlConnection.escape('%'+nameArr[p][j]+'%')+' AND type = "Comp" AND day IN (?)'
          ,[start, start, con_date, start, start, uniqueID, (start+1), (start+1), con_date, (start+1), (start+1), uniqueID, (start+2), (start+2), con_date, (start+2), (start+2), uniqueID, (start+3), (start+3), con_date, (start+3), (start+3), uniqueID, (start+4), (start+4), con_date, (start+4), (start+4), uniqueID, (start+5), (start+5), con_date, (start+5), (start+5), uniqueID, (start+6), (start+6), con_date, (start+6), (start+6), uniqueID, (start+7), (start+7), con_date, (start+7), (start+7), uniqueID, (start+8), (start+8), con_date, (start+8), (start+8), uniqueID, (start+9), (start+9), con_date, (start+9), (start+9), uniqueID, day], function(error, results, fields){
              if(error) throw error;
              console.log("Availability Staff is updated");
        });
       }
     
     if (range == 10){
        mysqlConnection.query('UPDATE availabilityStaff SET slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, "") WHERE name LIKE '+mysqlConnection.escape('%'+nameArr[p][j]+'%')+' AND type = "Comp" AND day IN (?)'
          ,[start, start, con_date, start, start, uniqueID, (start+1), (start+1), con_date, (start+1), (start+1), uniqueID, (start+2), (start+2), con_date, (start+2), (start+2), uniqueID, (start+3), (start+3), con_date, (start+3), (start+3), uniqueID, (start+4), (start+4), con_date, (start+4), (start+4), uniqueID, (start+5), (start+5), con_date, (start+5), (start+5), uniqueID, (start+6), (start+6), con_date, (start+6), (start+6), uniqueID, (start+7), (start+7), con_date, (start+7), (start+7), uniqueID, (start+8), (start+8), con_date, (start+8), (start+8), uniqueID, (start+9), (start+9), con_date, (start+9), (start+9), uniqueID,(start+10), (start+10), con_date, (start+10), (start+10), uniqueID, day], function(error, results, fields){
              if(error) throw error;
              console.log("Availability Staff is updated");
        });
       }
     
     if (range == 11){
        mysqlConnection.query('UPDATE availabilityStaff SET slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, "") WHERE name LIKE '+mysqlConnection.escape('%'+nameArr[p][j]+'%')+' AND type = "Comp" AND day IN (?)'
          ,[start, start, con_date, start, start, uniqueID, (start+1), (start+1), con_date, (start+1), (start+1), uniqueID, (start+2), (start+2), con_date, (start+2), (start+2), uniqueID, (start+3), (start+3), con_date, (start+3), (start+3), uniqueID, (start+4), (start+4), con_date, (start+4), (start+4), uniqueID, (start+5), (start+5), con_date, (start+5), (start+5), uniqueID, (start+6), (start+6), con_date, (start+6), (start+6), uniqueID, (start+7), (start+7), con_date, (start+7), (start+7), uniqueID, (start+8), (start+8), con_date, (start+8), (start+8), uniqueID, (start+9), (start+9), con_date, (start+9), (start+9), uniqueID, (start+10), (start+10), con_date, (start+10), (start+10), uniqueID, (start+11), (start+11), con_date, (start+11), (start+11), uniqueID, day], function(error, results, fields){
              if(error) throw error;
              console.log("Availability Staff is updated");
        });
       }
     
     if (range == 12){
        mysqlConnection.query('UPDATE availabilityStaff SET slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, "") WHERE name LIKE '+mysqlConnection.escape('%'+nameArr[p][j]+'%')+' AND type = "Comp" AND day IN (?)'
          ,[start, start, con_date, start, start, uniqueID, (start+1), (start+1), con_date, (start+1), (start+1), uniqueID, (start+2), (start+2), con_date, (start+2), (start+2), uniqueID, (start+3), (start+3), con_date, (start+3), (start+3), uniqueID, (start+4), (start+4), con_date, (start+4), (start+4), uniqueID, (start+5), (start+5), con_date, (start+5), (start+5), uniqueID, (start+6), (start+6), con_date, (start+6), (start+6), uniqueID, (start+7), (start+7), con_date, (start+7), (start+7), uniqueID, (start+8), (start+8), con_date, (start+8), (start+8), uniqueID, (start+9), (start+9), con_date, (start+9), (start+9), uniqueID, (start+10), (start+10), con_date, (start+10), (start+10), uniqueID, (start+11), (start+11), con_date, (start+11), (start+11), uniqueID, (start+12), (start+12), con_date, (start+12), (start+12), uniqueID, day], function(error, results, fields){
              if(error) throw error;
              console.log("Availability Staff is updated");
        });
       }
     
     if (range == 13){
        mysqlConnection.query('UPDATE availabilityStaff SET slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, "") WHERE name LIKE '+mysqlConnection.escape('%'+nameArr[p][j]+'%')+' AND type = "Comp" AND day IN (?)'
          ,[start, start, con_date, start, start, uniqueID, (start+1), (start+1), con_date, (start+1), (start+1), uniqueID, (start+2), (start+2), con_date, (start+2), (start+2), uniqueID, (start+3), (start+3), con_date, (start+3), (start+3), uniqueID, (start+4), (start+4), con_date, (start+4), (start+4), uniqueID, (start+5), (start+5), con_date, (start+5), (start+5), uniqueID, (start+6), (start+6), con_date, (start+6), (start+6), uniqueID, (start+7), (start+7), con_date, (start+7), (start+7), uniqueID, (start+8), (start+8), con_date, (start+8), (start+8), uniqueID, (start+9), (start+9), con_date, (start+9), (start+9), uniqueID, (start+10), (start+10), con_date, (start+10), (start+10), uniqueID, (start+11), (start+11), con_date, (start+11), (start+11), uniqueID, (start+12), (start+12), con_date, (start+12), (start+12), uniqueID,(start+13), (start+13), con_date, (start+13), (start+13), uniqueID, day], function(error, results, fields){
              if(error) throw error;
              console.log("Availability Staff is updated");
        });
       }
     
     if (range == 14){
        mysqlConnection.query('UPDATE availabilityStaff SET slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, "") WHERE name LIKE '+mysqlConnection.escape('%'+nameArr[p][j]+'%')+' AND type = "Comp" AND day IN (?)'
          ,[start, start, con_date, start, start, uniqueID, (start+1), (start+1), con_date, (start+1), (start+1), uniqueID, (start+2), (start+2), con_date, (start+2), (start+2), uniqueID, (start+3), (start+3), con_date, (start+3), (start+3), uniqueID, (start+4), (start+4), con_date, (start+4), (start+4), uniqueID, (start+5), (start+5), con_date, (start+5), (start+5), uniqueID, (start+6), (start+6), con_date, (start+6), (start+6), uniqueID, (start+7), (start+7), con_date, (start+7), (start+7), uniqueID, (start+8), (start+8), con_date, (start+8), (start+8), uniqueID, (start+9), (start+9), con_date, (start+9), (start+9), uniqueID, (start+10), (start+10), con_date, (start+10), (start+10), uniqueID, (start+11), (start+11), con_date, (start+11), (start+11), uniqueID, (start+12), (start+12), con_date, (start+12), (start+12), uniqueID,(start+13), (start+13), con_date, (start+13), (start+13), uniqueID,(start+14), (start+14), con_date, (start+14), (start+14), uniqueID, day], function(error, results, fields){
              if(error) throw error;
              console.log("Availability Staff is updated");
        });
       }
     
     if (range == 15){
        mysqlConnection.query('UPDATE availabilityStaff SET slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, "") WHERE name LIKE '+mysqlConnection.escape('%'+nameArr[p][j]+'%')+' AND type = "Comp" AND day IN (?)'
          ,[start, start, con_date, start, start, uniqueID, (start+1), (start+1), con_date, (start+1), (start+1), uniqueID, (start+2), (start+2), con_date, (start+2), (start+2), uniqueID, (start+3), (start+3), con_date, (start+3), (start+3), uniqueID, (start+4), (start+4), con_date, (start+4), (start+4), uniqueID, (start+5), (start+5), con_date, (start+5), (start+5), uniqueID, (start+6), (start+6), con_date, (start+6), (start+6), uniqueID, (start+7), (start+7), con_date, (start+7), (start+7), uniqueID, (start+8), (start+8), con_date, (start+8), (start+8), uniqueID, (start+9), (start+9), con_date, (start+9), (start+9), uniqueID, (start+10), (start+10), con_date, (start+10), (start+10), uniqueID, (start+11), (start+11), con_date, (start+11), (start+11), uniqueID, (start+12), (start+12), con_date, (start+12), (start+12), uniqueID,(start+13), (start+13), con_date, (start+13), (start+13), uniqueID,(start+14), (start+14), con_date, (start+14), (start+14), uniqueID,(start+15), (start+15), con_date, (start+15), (start+15), uniqueID, day], function(error, results, fields){
              if(error) throw error;
              console.log("Availability Staff is updated");
        });
       }
     
     if (range == 16){
        mysqlConnection.query('UPDATE availabilityStaff SET slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, "") WHERE name LIKE '+mysqlConnection.escape('%'+nameArr[p][j]+'%')+' AND type = "Comp" AND day IN (?)'
          ,[start, start, con_date, start, start, uniqueID, (start+1), (start+1), con_date, (start+1), (start+1), uniqueID, (start+2), (start+2), con_date, (start+2), (start+2), uniqueID, (start+3), (start+3), con_date, (start+3), (start+3), uniqueID, (start+4), (start+4), con_date, (start+4), (start+4), uniqueID, (start+5), (start+5), con_date, (start+5), (start+5), uniqueID, (start+6), (start+6), con_date, (start+6), (start+6), uniqueID, (start+7), (start+7), con_date, (start+7), (start+7), uniqueID, (start+8), (start+8), con_date, (start+8), (start+8), uniqueID, (start+9), (start+9), con_date, (start+9), (start+9), uniqueID, (start+10), (start+10), con_date, (start+10), (start+10), uniqueID, (start+11), (start+11), con_date, (start+11), (start+11), uniqueID, (start+12), (start+12), con_date, (start+12), (start+12), uniqueID,(start+13), (start+13), con_date, (start+13), (start+13), uniqueID,(start+14), (start+14), con_date, (start+14), (start+14), uniqueID,(start+15), (start+15), con_date, (start+15), (start+15), uniqueID,(start+16), (start+16), con_date, (start+16), (start+16), uniqueID, day], function(error, results, fields){
              if(error) throw error;
              console.log("Availability Staff is updated");
        });
       }
     
     if (range == 17){
        mysqlConnection.query('UPDATE availabilityStaff SET slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, "") WHERE name LIKE '+mysqlConnection.escape('%'+nameArr[p][j]+'%')+' AND type = "Comp" AND day IN (?)'
          ,[start, start, con_date, start, start, uniqueID, (start+1), (start+1), con_date, (start+1), (start+1), uniqueID, (start+2), (start+2), con_date, (start+2), (start+2), uniqueID, (start+3), (start+3), con_date, (start+3), (start+3), uniqueID, (start+4), (start+4), con_date, (start+4), (start+4), uniqueID, (start+5), (start+5), con_date, (start+5), (start+5), uniqueID, (start+6), (start+6), con_date, (start+6), (start+6), uniqueID, (start+7), (start+7), con_date, (start+7), (start+7), uniqueID, (start+8), (start+8), con_date, (start+8), (start+8), uniqueID, (start+9), (start+9), con_date, (start+9), (start+9), uniqueID, (start+10), (start+10), con_date, (start+10), (start+10), uniqueID, (start+11), (start+11), con_date, (start+11), (start+11), uniqueID, (start+12), (start+12), con_date, (start+12), (start+12), uniqueID,(start+13), (start+13), con_date, (start+13), (start+13), uniqueID,(start+14), (start+14), con_date, (start+14), (start+14), uniqueID,(start+15), (start+15), con_date, (start+15), (start+15), uniqueID,(start+16), (start+16), con_date, (start+16), (start+16), uniqueID,(start+17), (start+17), con_date, (start+17), (start+17), uniqueID, day], function(error, results, fields){
              if(error) throw error;
              console.log("Availability Staff is updated");
        });
       }
     
     if (range == 18){
        mysqlConnection.query('UPDATE availabilityStaff SET slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, "") WHERE name LIKE '+mysqlConnection.escape('%'+nameArr[p][j]+'%')+' AND type = "Comp" AND day IN (?)'
          ,[start, start, con_date, start, start, uniqueID, (start+1), (start+1), con_date, (start+1), (start+1), uniqueID, (start+2), (start+2), con_date, (start+2), (start+2), uniqueID, (start+3), (start+3), con_date, (start+3), (start+3), uniqueID, (start+4), (start+4), con_date, (start+4), (start+4), uniqueID, (start+5), (start+5), con_date, (start+5), (start+5), uniqueID, (start+6), (start+6), con_date, (start+6), (start+6), uniqueID, (start+7), (start+7), con_date, (start+7), (start+7), uniqueID, (start+8), (start+8), con_date, (start+8), (start+8), uniqueID, (start+9), (start+9), con_date, (start+9), (start+9), uniqueID, (start+10), (start+10), con_date, (start+10), (start+10), uniqueID, (start+11), (start+11), con_date, (start+11), (start+11), uniqueID, (start+12), (start+12), con_date, (start+12), (start+12), uniqueID,(start+13), (start+13), con_date, (start+13), (start+13), uniqueID,(start+14), (start+14), con_date, (start+14), (start+14), uniqueID,(start+15), (start+15), con_date, (start+15), (start+15), uniqueID,(start+16), (start+16), con_date, (start+16), (start+16), uniqueID,(start+17), (start+17), con_date, (start+17), (start+17), uniqueID, (start+18), (start+18), con_date, (start+18), (start+18), uniqueID, day], function(error, results, fields){
              if(error) throw error;
              console.log("Availability Staff is updated");
        });
       }
     
     if (range == 19){
        mysqlConnection.query('UPDATE availabilityStaff SET slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, "") WHERE name LIKE '+mysqlConnection.escape('%'+nameArr[p][j]+'%')+' AND type = "Comp" AND day IN (?)'
          ,[start, start, con_date, start, start, uniqueID, (start+1), (start+1), con_date, (start+1), (start+1), uniqueID, (start+2), (start+2), con_date, (start+2), (start+2), uniqueID, (start+3), (start+3), con_date, (start+3), (start+3), uniqueID, (start+4), (start+4), con_date, (start+4), (start+4), uniqueID, (start+5), (start+5), con_date, (start+5), (start+5), uniqueID, (start+6), (start+6), con_date, (start+6), (start+6), uniqueID, (start+7), (start+7), con_date, (start+7), (start+7), uniqueID, (start+8), (start+8), con_date, (start+8), (start+8), uniqueID, (start+9), (start+9), con_date, (start+9), (start+9), uniqueID, (start+10), (start+10), con_date, (start+10), (start+10), uniqueID, (start+11), (start+11), con_date, (start+11), (start+11), uniqueID, (start+12), (start+12), con_date, (start+12), (start+12), uniqueID,(start+13), (start+13), con_date, (start+13), (start+13), uniqueID,(start+14), (start+14), con_date, (start+14), (start+14), uniqueID,(start+15), (start+15), con_date, (start+15), (start+15), uniqueID,(start+16), (start+16), con_date, (start+16), (start+16), uniqueID,(start+17), (start+17), con_date, (start+17), (start+17), uniqueID, (start+18), (start+18), con_date, (start+18), (start+18), uniqueID, (start+19), (start+19), con_date, (start+19), (start+19), uniqueID, day], function(error, results, fields){
              if(error) throw error;
              console.log("Availability Staff is updated");
        });
       }
     
     if (range == 20){
        mysqlConnection.query('UPDATE availabilityStaff SET slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, "") WHERE name LIKE '+mysqlConnection.escape('%'+nameArr[p][j]+'%')+' AND type = "Comp" AND day IN (?)'
          ,[start, start, con_date, start, start, uniqueID, (start+1), (start+1), con_date, (start+1), (start+1), uniqueID, (start+2), (start+2), con_date, (start+2), (start+2), uniqueID, (start+3), (start+3), con_date, (start+3), (start+3), uniqueID, (start+4), (start+4), con_date, (start+4), (start+4), uniqueID, (start+5), (start+5), con_date, (start+5), (start+5), uniqueID, (start+6), (start+6), con_date, (start+6), (start+6), uniqueID, (start+7), (start+7), con_date, (start+7), (start+7), uniqueID, (start+8), (start+8), con_date, (start+8), (start+8), uniqueID, (start+9), (start+9), con_date, (start+9), (start+9), uniqueID, (start+10), (start+10), con_date, (start+10), (start+10), uniqueID, (start+11), (start+11), con_date, (start+11), (start+11), uniqueID, (start+12), (start+12), con_date, (start+12), (start+12), uniqueID,(start+13), (start+13), con_date, (start+13), (start+13), uniqueID,(start+14), (start+14), con_date, (start+14), (start+14), uniqueID,(start+15), (start+15), con_date, (start+15), (start+15), uniqueID,(start+16), (start+16), con_date, (start+16), (start+16), uniqueID,(start+17), (start+17), con_date, (start+17), (start+17), uniqueID, (start+18), (start+18), con_date, (start+18), (start+18), uniqueID, (start+19), (start+19), con_date, (start+19), (start+19), uniqueID,(start+20), (start+20), con_date, (start+20), (start+20), uniqueID, day], function(error, results, fields){
              if(error) throw error;
              console.log("Availability Staff is updated");
        });
       }
     
     if (range == 21){
        mysqlConnection.query('UPDATE availabilityStaff SET slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, ""), slot_? = replace(slot_?, ?, ""), act_? = replace(act_?, ?, "") WHERE name LIKE '+mysqlConnection.escape('%'+nameArr[p][j]+'%')+' AND type = "Comp" AND day IN (?)'
          ,[start, start, con_date, start, start, uniqueID, (start+1), (start+1), con_date, (start+1), (start+1), uniqueID, (start+2), (start+2), con_date, (start+2), (start+2), uniqueID, (start+3), (start+3), con_date, (start+3), (start+3), uniqueID, (start+4), (start+4), con_date, (start+4), (start+4), uniqueID, (start+5), (start+5), con_date, (start+5), (start+5), uniqueID, (start+6), (start+6), con_date, (start+6), (start+6), uniqueID, (start+7), (start+7), con_date, (start+7), (start+7), uniqueID, (start+8), (start+8), con_date, (start+8), (start+8), uniqueID, (start+9), (start+9), con_date, (start+9), (start+9), uniqueID, (start+10), (start+10), con_date, (start+10), (start+10), uniqueID, (start+11), (start+11), con_date, (start+11), (start+11), uniqueID, (start+12), (start+12), con_date, (start+12), (start+12), uniqueID,(start+13), (start+13), con_date, (start+13), (start+13), uniqueID,(start+14), (start+14), con_date, (start+14), (start+14), uniqueID,(start+15), (start+15), con_date, (start+15), (start+15), uniqueID,(start+16), (start+16), con_date, (start+16), (start+16), uniqueID,(start+17), (start+17), con_date, (start+17), (start+17), uniqueID, (start+18), (start+18), con_date, (start+18), (start+18), uniqueID, (start+19), (start+19), con_date, (start+19), (start+19), uniqueID,(start+20), (start+20), con_date, (start+20), (start+20), uniqueID,(start+21), (start+21), con_date, (start+21), (start+21), uniqueID, day], function(error, results, fields){
              if(error) throw error;
              console.log("Availability Staff is updated");
        });
       }

      }
    }


    mysqlConnection.query('DELETE FROM meetingInvitation WHERE uniqueID = ?', id, function(err, result) {
        //if(err) throw err
        if (err) {
            res.redirect('/senaraiJemputanProgram')
        } else {

            res.redirect('/senaraiJemputanProgram')
            console.log("one meeting sucessfully deleted")
        }
    })
})


app.get('/edit_admin_meetingInvitation/(:id)', function(req, res) {
  var name = req.user.fullname;
      let id = req.params.id;
     
      mysqlConnection.query('SELECT * FROM meetingInvitation WHERE uniqueID = ?', id, function(err, results, fields) {
          if(err) throw err
           
          // if user not found
          if (results.length <= 0) {
              res.redirect('/senaraiJemputanProgram')
          }
  
          else {
              res.render('edit_admin_meetingInvitation', {meetingInvitation:results, name:name})
          }
      })
  })

  app.post('/update_admin_meetingInvitation/:id',urlencodedParser, function(req, res, next) {
   
    let id = req.params.id;
    let category = req.body.category;
    let title = req.body.title;
    let agenda = req.body.agenda;
    let location = req.body.location;
 
        var form_data = { 
            category: category,
            title: title,
            agenda: agenda,
            location: location
          }

        mysqlConnection.query('UPDATE meetingInvitation SET ? WHERE uniqueID IN(?) ', [form_data, id], function(err, result) {
          
                res.redirect('/senaraiJemputanProgram');
            
        })
    
})

app.post('/insert_jemputanMesyuarat',checkAuthenticated, urlencodedParser,function(req,res) {
       var uniqueID = (Date.now().toString(36) + Math.random().toString(36).substr(2,15)).toUpperCase();
       var owner_name = req.user.fullname;
       var title = req.body.title;
       if(req.body.name != null){
       var name1 = JSON.stringify(req.body.name);
       var name2 = name1.replace("[",""); 
       var name3 = name2.replace("]","");
       var search = '"';
       var replaceWith ='';
       var name4 = name3.split(search).join(replaceWith);
       var arr= name4.split(",");
     }

     if(req.body.name == null){
      var arr = [""];
     }

       var role1 = JSON.stringify(req.body.attendeerole);
       var role2 = role1.replace("[",""); 
       var role3 = role2.replace("]","");
       var find = '"';
       var replaceit ='';
       var role4 = role3.split(find).join(replaceit);
       var arrRole= role4.split(",");

       var obj = JSON.stringify(req.body);
       var jsonObj = JSON.parse(obj);
       

                            
                 //save to task details and points (analyse workload)=================================
         for(var i=0; i < arr.length ; i++ ){            
            
               mysqlConnection.query('INSERT INTO meetingInvitation(uniqueID, owner_role, category, date, timeFrom, timeTo, location, title, agenda, name, attendee_role, owner_name, confirmation_status) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [uniqueID, req.body.ownerrole, req.body.task, req.body.selectedDate_from, req.body.selectedtime_from, req.body.selectedtime_until, req.body.location, req.body.title,  req.body.agenda, arr[i], arrRole[i], owner_name, "Unconfirmed"], function(error, results, fields){
                        if(error) throw error;
                        console.log("meeting invitation is updated");
                        });

         } //end for loop

        var filter1 = req.body.selectedtime_from;
        var filter2 = req.body.selectedtime_until;

              var start = 0;
              var finish = 0;

              var getDate = JSON.stringify(req.body.selectedDate_from);
              var monthToday = new Date(getDate);
              var month = monthToday.getMonth();
              var months = [0,1,2,3,4,5,6,7,8,9,10,11];
              var unselectedMonth = [];

              for(var j = 0; j<months.length; j++){
                if(months[j] != month){
                  unselectedMonth.push(months[j]);
                }
              }
             
             // convert date to day
              var weekday = new Array(7);
              weekday[0] = "Sunday";
              weekday[1] = "Monday";
              weekday[2] = "Tuesday";
              weekday[3] = "Wednesday";
              weekday[4] = "Thursday";
              weekday[5] = "Friday";
              weekday[6] = "Saturday";

              var day = weekday[monthToday.getDay()];

              var d = new Date()
     var months = new Array(7);
     months[0] = "January";
     months[1] = "February";
     months[2] = "March";
     months[3] = "April";
     months[4] = "May";
     months[5] = "June";
     months[6] = "July";
     months[7] = "August";
     months[8] = "September";
     months[9] = "October";
     months[10] = "November";
     months[11] = "December";


    var m = months[d.getMonth()];
    var bulan = d.getMonth()+1;

    var t = JSON.stringify(new Date().getDate());


              var start_ar = ["7:30", "8:00", "8:30", "9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", 
              "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"];

              var finish_ar = ["8:00", "8:30", "9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", 
              "16:00", "16:30", "17:00", "17:30", "18:00", "18:30"];


              for (var i = 0; i < start_ar.length; i++)  { 
                  if((jsonObj.selectedtime_from===start_ar[i]))
                    { start = i+1;} //1
                  }


              for (var i = 0; i < finish_ar.length; i++) {       
                  if((jsonObj.selectedtime_until===finish_ar[i]))
                    { finish = i+1;} //22
                  }

          var range = finish - start;

            if(range == 0){
                   mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), percentage? = percentage? + ? WHERE type = "Comp" AND name = ? AND day = ?',
           [start, start, getDate, start, start, uniqueID, (month+1),(month+1), 2,owner_name, day], function(error, results, fields){
                  if(error) throw error;
                  console.log("slots updated");
                  
        
                 });       
              }

              if(range == 1){
                   mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), percentage? = percentage? + ? WHERE type = "Comp" AND name = ? AND day = ?', 
           [start, start, getDate, start, start, uniqueID, (start+1), (start+1), getDate, (start+1), (start+1), uniqueID, (month+1),(month+1), 2,owner_name, day], function(error, results, fields){
                  if(error) throw error;
                  console.log("slots updated");
        
                 });

                }               

              if(range == 2){
                  mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), percentage? = percentage? + ? WHERE type = "Comp" AND name = ? AND day = ?', 
          [start, start, getDate, start, start, uniqueID, (start+1), (start+1), getDate, (start+1), (start+1), uniqueID, (start+2), (start+2), getDate, (start+2), (start+2), uniqueID, (month+1),(month+1), 2,owner_name, day], function(error, results, fields){
                  if(error) throw error;
                  console.log("slots updated");
        
                 });

                }   

               if(range == 3){
                  mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), percentage? = percentage? + ? WHERE type = "Comp" AND name = ? AND day = ?', 
                    [start, start, getDate, start, start, uniqueID, (start+1), (start+1), getDate, (start+1), (start+1),uniqueID, (start+2), (start+2), getDate, (start+2), (start+2), uniqueID, (start+3), (start+3), getDate, (start+3), (start+3), uniqueID, (month+1),(month+1), 2,owner_name, day], function(error, results, fields){
                  if(error) throw error;
                  console.log("slots updated");
        
                 });                             
              }

              if(range == 4){                
                  mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), percentage? = percentage? + ? WHERE type = "Comp" AND name = ? AND day = ?', 
                    [start, start, getDate, start, start, uniqueID, (start+1), (start+1), getDate, (start+1), (start+1), uniqueID, (start+2), (start+2), getDate, (start+2), (start+2), uniqueID, (start+3), (start+3), getDate, (start+3), (start+3), uniqueID, (start+4), (start+4), getDate, (start+4), (start+4), uniqueID, (month+1),(month+1), 2,owner_name, day], function(error, results, fields){
                  if(error) throw error;
                  console.log("slots updated");
                  
        
                 });
                }               
        
          if(range == 5){
                
                  mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), percentage? = percentage? + ? WHERE type = "Comp" AND name = ? AND day = ?', 
                    [start, start, getDate, start, start, uniqueID, (start+1), (start+1), getDate, (start+1), (start+1), uniqueID, (start+2), (start+2), getDate, (start+2), (start+2), uniqueID,  (start+3), (start+3), getDate, (start+3), (start+3), uniqueID, (start+4), (start+4), getDate, (start+4), (start+4), uniqueID, (start+5), (start+5), getDate, (start+5), (start+5), uniqueID,  (month+1),(month+1), 2,owner_name, day], function(error, results, fields){
                  if(error) throw error;
                  console.log("slots updated");
        
                 });

                }               

               if(range == 6){
                
                    mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), act_? = CONCAT(act_?,",",?), percentage? = percentage? + ? WHERE type = "Comp" AND name = ? AND day = ?', 
          [start, start, getDate, start, start, uniqueID, (start+1), (start+1), getDate, (start+1), (start+1), uniqueID, (start+2), (start+2), getDate, (start+2), (start+2), uniqueID,  (start+3), (start+3), getDate, (start+3), (start+3), uniqueID,(start+4), (start+4), getDate, (start+4), (start+4), uniqueID,(start+5), (start+5), getDate, (start+5), (start+5), uniqueID, (start+6), (start+6), getDate, (start+6), (start+6), uniqueID,  (month+1),(month+1), 2,owner_name, day], function(error, results, fields){
                  if(error) throw error;
                  console.log("slots updated");
        
                 });

                } 

              if(range == 7){
                
                    mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), percentage? = percentage? + ? WHERE type = "Comp" AND name = ? AND day = ?',
          [start, start, getDate, start, start, uniqueID, (start+1), (start+1), getDate, (start+1), (start+1), uniqueID, (start+2), (start+2), getDate, (start+2), (start+2), uniqueID,  (start+3), (start+3), getDate, (start+3), (start+3), uniqueID, (start+4), (start+4), getDate, (start+4), (start+4), uniqueID, (start+5), (start+5), getDate, (start+5), (start+5), uniqueID,  (start+6), (start+6), getDate, (start+6), (start+6), uniqueID,  (start+7), (start+7), getDate, (start+7), (start+7), uniqueID,  (month+1),(month+1), 2,owner_name, day], function(error, results, fields){
                  if(error) throw error;
                  console.log("slots updated");
                  
        
                 });

                }    

              if(range == 8){
                

                    mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), percentage? = percentage? + ? WHERE type = "Comp" AND name = ? AND day = ?',
          [start, start, getDate, start, start, uniqueID, (start+1), (start+1), getDate, (start+1), (start+1), uniqueID, (start+2), (start+2), getDate, (start+2), (start+2), uniqueID,  (start+3), (start+3), getDate, (start+3), (start+3), uniqueID, (start+4), (start+4), getDate, (start+4), (start+4), uniqueID, (start+5), (start+5), getDate, (start+5), (start+5), uniqueID,  (start+6), (start+6), getDate, (start+6), (start+6), uniqueID,  (start+7), (start+7), getDate, (start+7), (start+7), uniqueID,  (start+8), (start+8), getDate, (start+8), (start+8), uniqueID,  (month+1),(month+1), 2,owner_name, day], function(error, results, fields){
                  if(error) throw error;
                  console.log("slots updated");
                  
                 });

                } 

              if(range == 9){
                
                    mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), percentage? = percentage? + ? WHERE type = "Comp" AND name = ? AND day = ?',
          [start, start, getDate, start, start, uniqueID, (start+1), (start+1), getDate, (start+1), (start+1), uniqueID, (start+2), (start+2), getDate, (start+2), (start+2), uniqueID,  (start+3), (start+3), getDate, (start+3), (start+3), uniqueID,(start+4), (start+4), getDate, (start+4), (start+4), uniqueID,(start+5), (start+5), getDate, (start+5), (start+5), uniqueID, (start+6), (start+6), getDate, (start+6), (start+6), uniqueID, (start+7), (start+7), getDate, (start+7), (start+7), uniqueID, (start+8), (start+8), getDate, (start+8), (start+8), uniqueID, (start+9), (start+9), getDate, (start+9), (start+9), uniqueID,  (month+1),(month+1), 2,owner_name, day], function(error, results, fields){
                  if(error) throw error;
                  console.log("slots updated");
                  
        
                 });

                } 

              if(range == 10){
                

                    mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), percentage? = percentage? + ? WHERE type = "Comp" AND name = ? AND day = ?', 
          [start, start, getDate, start, start, uniqueID, (start+1), (start+1), getDate, (start+1), (start+1), uniqueID, (start+2), (start+2), getDate, (start+2), (start+2), uniqueID,  (start+3), (start+3), getDate, (start+3), (start+3), uniqueID,(start+4), (start+4), getDate, (start+4), (start+4), uniqueID,(start+5), (start+5), getDate, (start+5), (start+5), uniqueID, (start+6), (start+6), getDate, (start+6), (start+6), uniqueID, (start+7), (start+7), getDate, (start+7), (start+7), uniqueID, (start+8), (start+8), getDate, (start+8), (start+8), uniqueID, (start+9), (start+9), getDate, (start+9), (start+9), uniqueID,  (start+10), (start+10), getDate, (start+10), (start+10), uniqueID,  (month+1),(month+1), 2,owner_name, day], function(error, results, fields){
                  if(error) throw error;
                  console.log("slots updated");
                  
        
                 });

                }  

              if(range == 11){
                
                    mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), percentage? = percentage? + ? WHERE type = "Comp" AND name = ? AND day = ?', 
          [start, start, getDate, start, start, uniqueID, (start+1), (start+1), getDate, (start+1), (start+1), uniqueID, (start+2), (start+2), getDate, (start+2), (start+2), uniqueID,  (start+3), (start+3), getDate, (start+3), (start+3), uniqueID,(start+4), (start+4), getDate, (start+4), (start+4), uniqueID,(start+5), (start+5), getDate, (start+5), (start+5), uniqueID, (start+6), (start+6), getDate, (start+6), (start+6), uniqueID, (start+7), (start+7), getDate, (start+7), (start+7), uniqueID, (start+8), (start+8), getDate, (start+8), (start+8), uniqueID, (start+9), (start+9), getDate, (start+9), (start+9), uniqueID,  (start+10), (start+10), getDate, (start+10), (start+10), uniqueID,  (start+11), (start+11), getDate, (start+11), (start+11), uniqueID,  (month+1),(month+1), 2,owner_name, day], function(error, results, fields){
                  if(error) throw error;
                  console.log("slots updated");
                  
        
                 });

                } 

              if(range == 12){
                
                    mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), percentage? = percentage? + ? WHERE type = "Comp" AND name = ? AND day = ?', 
          [start, start, getDate, start, start, uniqueID, (start+1), (start+1), getDate, (start+1), (start+1), uniqueID, (start+2), (start+2), getDate, (start+2), (start+2), uniqueID, (start+3), (start+3), getDate, (start+3), (start+3), uniqueID,(start+4), (start+4), getDate, (start+4), (start+4), uniqueID,(start+5), (start+5), getDate, (start+5), (start+5), uniqueID, (start+6), (start+6), getDate, (start+6), (start+6), uniqueID, (start+7), (start+7), getDate, (start+7), (start+7), uniqueID, (start+8), (start+8), getDate, (start+8), (start+8), uniqueID, (start+9), (start+9), getDate, (start+9), (start+9), uniqueID,  (start+10), (start+10), getDate, (start+10), (start+10), uniqueID,  (start+11), (start+11), getDate, (start+11), (start+11), uniqueID,  (start+12), (start+12), getDate, (start+12), (start+12), uniqueID,  (month+1),(month+1), 2,owner_name, day], function(error, results, fields){
                  if(error) throw error;
                  console.log("slots updated");
                  
        
                 });

                }  

              if(range == 13){
                
                    mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), percentage? = percentage? + ? WHERE type = "Comp" AND name = ? AND day = ?', 
          [start, start, getDate, start, start, uniqueID, (start+1), (start+1), getDate, (start+1), (start+1), uniqueID, (start+2), (start+2), getDate, (start+2), (start+2), uniqueID,  (start+3), (start+3), getDate, (start+3), (start+3), uniqueID,(start+4), (start+4), getDate, (start+4), (start+4), uniqueID,(start+5), (start+5), getDate, (start+5), (start+5), uniqueID, (start+6), (start+6), getDate, (start+6), (start+6), uniqueID, (start+7), (start+7), getDate, (start+7), (start+7), uniqueID, (start+8), (start+8), getDate, (start+8), (start+8), uniqueID, (start+9), (start+9), getDate, (start+9), (start+9), uniqueID,  (start+10), (start+10), getDate, (start+10), (start+10), uniqueID,  (start+11), (start+11), getDate, (start+11), (start+11), uniqueID,  (start+12), (start+12), getDate, (start+12), (start+12), uniqueID,  (start+13), (start+13), getDate, (start+13), (start+13), uniqueID,  (month+1),(month+1), 2,owner_name, day], function(error, results, fields){
                  if(error) throw error;
                  console.log("slots updated");
                  
        
                 });

                }  

              if(range == 14){
                
                    mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), percentage? = percentage? + ? WHERE type = "Comp" AND name = ? AND day = ?', 
          [start, start, getDate, start, start, uniqueID, (start+1), (start+1), getDate, (start+1), (start+1), uniqueID, (start+2), (start+2), getDate, (start+2), (start+2), uniqueID,  (start+3), (start+3), getDate, (start+3), (start+3), uniqueID,(start+4), (start+4), getDate, (start+4), (start+4), uniqueID,(start+5), (start+5), getDate, (start+5), (start+5), uniqueID, (start+6), (start+6), getDate, (start+6), (start+6), uniqueID, (start+7), (start+7), getDate, (start+7), (start+7), uniqueID, (start+8), (start+8), getDate, (start+8), (start+8), uniqueID, (start+9), (start+9), getDate, (start+9), (start+9), uniqueID,  (start+10), (start+10), getDate, (start+10), (start+10), uniqueID,  (start+11), (start+11), getDate, (start+11), (start+11), uniqueID,  (start+12), (start+12), getDate, (start+12), (start+12), uniqueID,  (start+13), (start+13), getDate, (start+13), (start+13), uniqueID,  (start+14), (start+14), getDate, (start+14), (start+14), uniqueID,  (month+1),(month+1), 2,owner_name, day], function(error, results, fields){
                  if(error) throw error;
                  console.log("slots updated");
                  
        
                 });

                }  

              if(range == 15){
                
                    mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), percentage? = percentage? + ? WHERE type = "Comp" AND name = ? AND day = ?', 
          [start, start, getDate, start, start, uniqueID, (start+1), (start+1), getDate, (start+1), (start+1),(start+2), (start+2), getDate, (start+2), (start+2), uniqueID,  (start+3), (start+3), getDate, (start+3), (start+3), uniqueID,(start+4), (start+4), getDate, (start+4), (start+4), uniqueID,(start+5), (start+5), getDate, (start+5), (start+5), uniqueID, (start+6), (start+6), getDate, (start+6), (start+6), uniqueID, (start+7), (start+7), getDate, (start+7), (start+7), uniqueID, (start+8), (start+8), getDate, (start+8), (start+8), uniqueID, (start+9), (start+9), getDate, (start+9), (start+9), uniqueID,  (start+10), (start+10), getDate, (start+10), (start+10), uniqueID,  (start+11), (start+11), getDate, (start+11), (start+11), uniqueID,  (start+12), (start+12), getDate, (start+12), (start+12), uniqueID,  (start+13), (start+13), getDate, (start+13), (start+13), uniqueID,  (start+14), (start+14), getDate, (start+14), (start+14), uniqueID,  (start+15), (start+15), getDate, (start+15), (start+15), uniqueID,  (month+1),(month+1), 2,owner_name, day], function(error, results, fields){
                  if(error) throw error;
                  console.log("slots updated");
                  
        
                 });

                }
              if(range == 16){
                

                    mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), percentage? = percentage? + ? WHERE type = "Comp" AND name = ? AND day = ?', 
          [start, start, getDate, start, start, uniqueID, (start+1), (start+1), getDate, (start+1), (start+1), uniqueID, (start+2), (start+2), getDate, (start+2), (start+2), uniqueID,  (start+3), (start+3), getDate, (start+3), (start+3), uniqueID,(start+4), (start+4), getDate, (start+4), (start+4), uniqueID,(start+5), (start+5), getDate, (start+5), (start+5), uniqueID, (start+6), (start+6), getDate, (start+6), (start+6), uniqueID, (start+7), (start+7), getDate, (start+7), (start+7), uniqueID, (start+8), (start+8), getDate, (start+8), (start+8), uniqueID, (start+9), (start+9), getDate, (start+9), (start+9), uniqueID,  (start+10), (start+10), getDate, (start+10), (start+10), uniqueID,  (start+11), (start+11), getDate, (start+11), (start+11), uniqueID,  (start+12), (start+12), getDate, (start+12), (start+12), uniqueID,  (start+13), (start+13), getDate, (start+13), (start+13), uniqueID,  (start+14), (start+14), getDate, (start+14), (start+14), uniqueID, (start+15), (start+15), getDate, (start+15), (start+15), uniqueID,  (start+16), (start+16), getDate, (start+16), (start+16), uniqueID,  (month+1),(month+1), 2,owner_name, day], function(error, results, fields){
                  if(error) throw error;
                  console.log("slots updated");
                  
        
                 });

                }   

              if(range == 17){
                
                    mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),percentage? = percentage? + ? WHERE type = "Comp" AND name = ? AND day = ?', 
          [start, start, getDate, start, start, uniqueID, (start+1), (start+1), getDate, (start+1), (start+1), uniqueID, (start+2), (start+2), getDate, (start+2), (start+2), uniqueID,  (start+3), (start+3), getDate, (start+3), (start+3), uniqueID,(start+4), (start+4), getDate, (start+4), (start+4), uniqueID,(start+5), (start+5), getDate, (start+5), (start+5), uniqueID, (start+6), (start+6), getDate, (start+6), (start+6), uniqueID, (start+7), (start+7), getDate, (start+7), (start+7), uniqueID, (start+8), (start+8), getDate, (start+8), (start+8), uniqueID, (start+9), (start+9), getDate, (start+9), (start+9), uniqueID,  (start+10), (start+10), getDate, (start+10), (start+10), uniqueID,  (start+11), (start+11), getDate, (start+11), (start+11), uniqueID,  (start+12), (start+12), getDate, (start+12), (start+12), uniqueID,  (start+13), (start+13), getDate, (start+13), (start+13), uniqueID,  (start+14), (start+14), getDate, (start+14), (start+14), uniqueID, (start+15), (start+15), getDate, (start+15), (start+15), uniqueID, (start+16), (start+16), getDate, (start+16), (start+16), uniqueID, (start+17), (start+17), getDate, (start+17), (start+17), uniqueID,  (month+1),(month+1), 2,owner_name, day], function(error, results, fields){
                  if(error) throw error;
                  console.log("slots updated");
                  
        
                 });

                } 

              if(range == 18){
                
                    mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), percentage? = percentage? + ? WHERE type = "Comp" AND name = ? AND day = ?', 
          [start, start, getDate, start, start, uniqueID, (start+1), (start+1), getDate, (start+1), (start+1), uniqueID, (start+2), (start+2), getDate, (start+2), (start+2), uniqueID,  (start+3), (start+3), getDate, (start+3), (start+3), uniqueID,(start+4), (start+4), getDate, (start+4), (start+4), uniqueID,(start+5), (start+5), getDate, (start+5), (start+5), uniqueID, (start+6), (start+6), getDate, (start+6), (start+6), uniqueID, (start+7), (start+7), getDate, (start+7), (start+7), uniqueID, (start+8), (start+8), getDate, (start+8), (start+8), uniqueID, (start+9), (start+9), getDate, (start+9), (start+9), uniqueID,  (start+10), (start+10), getDate, (start+10), (start+10), uniqueID,  (start+11), (start+11), getDate, (start+11), (start+11), uniqueID,  (start+12), (start+12), getDate, (start+12), (start+12), uniqueID,  (start+13), (start+13), getDate, (start+13), (start+13), uniqueID,  (start+14), (start+14), getDate, (start+14), (start+14), uniqueID, (start+15), (start+15), getDate, (start+15), (start+15), uniqueID,  (start+16), (start+16), getDate, (start+16), (start+16), uniqueID,  (start+17), (start+17), getDate, (start+17), (start+17), uniqueID,  (start+18), (start+18), getDate, (start+18), (start+18), uniqueID, (month+1),(month+1), 2,owner_name, day], function(error, results, fields){
                  if(error) throw error;
                  console.log("slots updated");
                  
        
                 });

                }    

              if(range == 19){               

                    mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), percentage? = percentage? + ? WHERE type = "Comp" AND name = ? AND day = ?', 
          [start, start, getDate, start, start, uniqueID, (start+1), (start+1), getDate, (start+1), (start+1), uniqueID, (start+2), (start+2), getDate, (start+2), (start+2), uniqueID,  (start+3), (start+3), getDate, (start+3), (start+3), uniqueID,(start+4), (start+4), getDate, (start+4), (start+4), uniqueID,(start+5), (start+5), getDate, (start+5), (start+5), uniqueID, (start+6), (start+6), getDate, (start+6), (start+6), uniqueID, (start+7), (start+7), getDate, (start+7), (start+7), uniqueID, (start+8), (start+8), getDate, (start+8), (start+8), uniqueID, (start+9), (start+9), getDate, (start+9), (start+9), uniqueID,  (start+10), (start+10), getDate, (start+10), (start+10), uniqueID,  (start+11), (start+11), getDate, (start+11), (start+11), uniqueID,  (start+12), (start+12), getDate, (start+12), (start+12), uniqueID,  (start+13), (start+13), getDate, (start+13), (start+13), uniqueID,  (start+14), (start+14), getDate, (start+14), (start+14), uniqueID, (start+15), (start+15), getDate, (start+15), (start+15), uniqueID,  (start+16), (start+16), getDate, (start+16), (start+16), uniqueID,  (start+17), (start+17), getDate, (start+17), (start+17), uniqueID,  (start+18), (start+18), getDate, (start+18), (start+18), uniqueID,  (start+19), (start+19), getDate, (start+19), (start+19), uniqueID,  (month+1),(month+1), 2,owner_name, day], function(error, results, fields){
                  if(error) throw error;
                  console.log("slots updated");
                  
        
                 });

                } 

              if(range == 20){
                

                    mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), percentage? = percentage? + ? WHERE type = "Comp" AND name = ? AND day = ?', 
          [start, start, getDate, start, start, uniqueID, (start+1), (start+1), getDate, (start+1), (start+1), uniqueID, (start+2), (start+2), getDate, (start+2), (start+2), uniqueID,  (start+3), (start+3), getDate, (start+3), (start+3), uniqueID,(start+4), (start+4), getDate, (start+4), (start+4), uniqueID,(start+5), (start+5), getDate, (start+5), (start+5), uniqueID, (start+6), (start+6), getDate, (start+6), (start+6), uniqueID, (start+7), (start+7), getDate, (start+7), (start+7), uniqueID, (start+8), (start+8), getDate, (start+8), (start+8), uniqueID, (start+9), (start+9), getDate, (start+9), (start+9), uniqueID,  (start+10), (start+10), getDate, (start+10), (start+10), uniqueID,  (start+11), (start+11), getDate, (start+11), (start+11), uniqueID,  (start+12), (start+12), getDate, (start+12), (start+12), uniqueID,  (start+13), (start+13), getDate, (start+13), (start+13), uniqueID,  (start+14), (start+14), getDate, (start+14), (start+14), uniqueID, (start+15), (start+15), getDate, (start+15), (start+15), uniqueID,  (start+16), (start+16), getDate, (start+16), (start+16), uniqueID,  (start+17), (start+17), getDate, (start+17), (start+17), uniqueID,  (start+18), (start+18), getDate, (start+18), (start+18), uniqueID,  (start+19), (start+19), getDate, (start+19), (start+19), uniqueID,  (start+20), (start+20), getDate, (start+20), (start+20), uniqueID,  (month+1),(month+1), 2,owner_name, day], function(error, results, fields){
                  if(error) throw error;
                  console.log("slots updated");
                  
        
                 });

                }  

              if(range == 21){
                

                    mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), percentage? = percentage? + ? WHERE type = "Comp" AND name = ? AND day = ?', 
          [start, start, getDate, start, start, uniqueID, (start+1), (start+1), getDate, (start+1), (start+1), uniqueID, (start+2), (start+2), getDate, (start+2), (start+2), uniqueID,  (start+3), (start+3), getDate, (start+3), (start+3), uniqueID,(start+4), (start+4), getDate, (start+4), (start+4), uniqueID,(start+5), (start+5), getDate, (start+5), (start+5), uniqueID, (start+6), (start+6), getDate, (start+6), (start+6), uniqueID, (start+7), (start+7), getDate, (start+7), (start+7), uniqueID, (start+8), (start+8), getDate, (start+8), (start+8), uniqueID, (start+9), (start+9), getDate, (start+9), (start+9), uniqueID,  (start+10), (start+10), getDate, (start+10), (start+10), uniqueID,  (start+11), (start+11), getDate, (start+11), (start+11), uniqueID,  (start+12), (start+12), getDate, (start+12), (start+12), uniqueID,  (start+13), (start+13), getDate, (start+13), (start+13), uniqueID,  (start+14), (start+14), getDate, (start+14), (start+14), uniqueID, (start+15), (start+15), getDate, (start+15), (start+15), uniqueID,  (start+16), (start+16), getDate, (start+16), (start+16), uniqueID,  (start+17), (start+17), getDate, (start+17), (start+17), uniqueID,  (start+18), (start+18), getDate, (start+18), (start+18), uniqueID,  (start+19), (start+19), getDate, (start+19), (start+19), uniqueID,  (start+20), (start+20), getDate, (start+20), (start+20), uniqueID,  (start+21), (start+21), getDate, (start+21), (start+21), uniqueID,  (month+1),(month+1), 2,owner_name, day], function(error, results, fields){
                  if(error) throw error;
                  console.log("slots updated");
                  
        
                 });

                }     

         
   mysqlConnection.query('INSERT INTO meetingInfo(uniqueID) VALUES(?)', [uniqueID], function(error, results, fields){
      if(error) throw error;
      console.log("meeting info is added");
    });

    mysqlConnection.query('UPDATE taskpoint SET mesyuarat =mesyuarat+2 ,peratus = CASE WHEN peratus < 40 THEN peratus +2 ELSE peratus END,mesyuaratdetail = CONCAT(mesyuaratdetail,",",?),pinperatus=CONCAT(pinperatus,",",peratus),pindate=CONCAT(pindate,",",?) WHERE NAME=? AND MONTH =?', [title,t,owner_name,m], function(error, results, fields){
      if(error) throw error;
      console.log("1 meeting point inserted");
      console.log("1 meeting detail inserted");
      console.log("total points updated");
     });

    mysqlConnection.query('SELECT * FROM meetingInvitation WHERE name LIKE'+mysqlConnection.escape('%'+owner_name+'%')+'OR owner_name LIKE'+mysqlConnection.escape('%'+owner_name+'%')+'ORDER BY date', function(error, results, fields) {
        res.render('senaraiJemputanProgram.ejs', {
                      meetingInvitation : results,
                      owner_name: owner_name
        });
    });

});

app.get('/acceptMeeting/(:id)',urlencodedParser, function(req, res, next) {
    let id = req.params.id; 
    var aftersplit = id.split("_");
    var meeting_id = aftersplit[0];
    var title = aftersplit[1];
    var selectedDate_from = aftersplit[2];
    var selectedtime_from = aftersplit[3];
    var selectedtime_until = aftersplit[4];
    var uniqueID = aftersplit[5];

    var name = req.user.fullname;
        
        var filter1 = selectedtime_from;
        var filter2 = selectedtime_until;

              var start = 0;
              var finish = 0;

              var getDate = selectedDate_from.replace('"', ''); //last change
              var monthToday = new Date(selectedDate_from);
              var month = monthToday.getMonth();
              var months = [0,1,2,3,4,5,6,7,8,9,10,11];
              var unselectedMonth = [];

              var d = new Date()
              var months = new Array(7);
              months[0] = "January";
              months[1] = "February";
              months[2] = "March";
              months[3] = "April";
              months[4] = "May";
              months[5] = "June";
              months[6] = "July";
              months[7] = "August";
              months[8] = "September";
              months[9] = "October";
              months[10] = "November";
              months[11] = "December";
         
         
             var m = months[d.getMonth()];
             var bulan = d.getMonth()+1;
         
             var t = JSON.stringify(new Date().getDate());

              for(var j = 0; j<months.length; j++){
                if(months[j] != month){
                  unselectedMonth.push(months[j]);
                }
              }
             
             // convert date to day
              var weekday = new Array(7);
              weekday[0] = "Sunday";
              weekday[1] = "Monday";
              weekday[2] = "Tuesday";
              weekday[3] = "Wednesday";
              weekday[4] = "Thursday";
              weekday[5] = "Friday";
              weekday[6] = "Saturday";

              var day = weekday[monthToday.getDay()];


              var start_ar = ["7:30", "8:00", "8:30", "9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", 
              "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"];

              var finish_ar = ["8:00", "8:30", "9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", 
              "16:00", "16:30", "17:00", "17:30", "18:00", "18:30"];


              for (var i = 0; i < start_ar.length; i++)  { 
                  if((selectedtime_from===start_ar[i]))
                    { start = i+1;} //1
                  }


              for (var i = 0; i < finish_ar.length; i++) {       
                  if((selectedtime_until===finish_ar[i]))
                    { finish = i+1;} //22
                  }

          var range = finish - start;


        if(range == 0){
                   mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), percentage? = percentage? + ? WHERE type = "Comp" AND name = ? AND day = ?',
           [start, start, getDate, start, start, uniqueID, (month+1),(month+1), 2,name, day], function(error, results, fields){
                  if(error) throw error;
                  console.log("slots updated");
                  
        
                 });       
              }

              if(range == 1){
                   mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), percentage? = percentage? + ? WHERE type = "Comp" AND name = ? AND day = ?', 
           [start, start, getDate, start, start, uniqueID, (start+1), (start+1), getDate, (start+1), (start+1), uniqueID, (month+1),(month+1), 2,name, day], function(error, results, fields){
                  if(error) throw error;
                  console.log("slots updated");
        
                 });

                }               

              if(range == 2){
                  mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), percentage? = percentage? + ? WHERE type = "Comp" AND name = ? AND day = ?', 
          [start, start, getDate, start, start, uniqueID, (start+1), (start+1), getDate, (start+1), (start+1), uniqueID, (start+2), (start+2), getDate, (start+2), (start+2), uniqueID, (month+1),(month+1), 2,name, day], function(error, results, fields){
                  if(error) throw error;
                  console.log("slots updated");
        
                 });

                }   

               if(range == 3){
                  mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), percentage? = percentage? + ? WHERE type = "Comp" AND name = ? AND day = ?', 
                    [start, start, getDate, start, start, uniqueID, (start+1), (start+1), getDate, (start+1), (start+1),uniqueID, (start+2), (start+2), getDate, (start+2), (start+2), uniqueID, (start+3), (start+3), getDate, (start+3), (start+3), uniqueID, (month+1),(month+1), 2,name, day], function(error, results, fields){
                  if(error) throw error;
                  console.log("slots updated");
        
                 });                             
              }

              if(range == 4){                
                  mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), percentage? = percentage? + ? WHERE type = "Comp" AND name = ? AND day = ?', 
                    [start, start, getDate, start, start, uniqueID, (start+1), (start+1), getDate, (start+1), (start+1), uniqueID, (start+2), (start+2), getDate, (start+2), (start+2), uniqueID, (start+3), (start+3), getDate, (start+3), (start+3), uniqueID, (start+4), (start+4), getDate, (start+4), (start+4), uniqueID, (month+1),(month+1), 2,name, day], function(error, results, fields){
                  if(error) throw error;
                  console.log("slots updated");
                  
        
                 });
                }               
        
          if(range == 5){
                
                  mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), percentage? = percentage? + ? WHERE type = "Comp" AND name = ? AND day = ?', 
                    [start, start, getDate, start, start, uniqueID, (start+1), (start+1), getDate, (start+1), (start+1), uniqueID, (start+2), (start+2), getDate, (start+2), (start+2), uniqueID,  (start+3), (start+3), getDate, (start+3), (start+3), uniqueID, (start+4), (start+4), getDate, (start+4), (start+4), uniqueID, (start+5), (start+5), getDate, (start+5), (start+5), uniqueID,  (month+1),(month+1), 2,name, day], function(error, results, fields){
                  if(error) throw error;
                  console.log("slots updated");
        
                 });

                }               

               if(range == 6){
                
                    mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), act_? = CONCAT(act_?,",",?), percentage? = percentage? + ? WHERE type = "Comp" AND name = ? AND day = ?', 
          [start, start, getDate, start, start, uniqueID, (start+1), (start+1), getDate, (start+1), (start+1), uniqueID, (start+2), (start+2), getDate, (start+2), (start+2), uniqueID,  (start+3), (start+3), getDate, (start+3), (start+3), uniqueID,(start+4), (start+4), getDate, (start+4), (start+4), uniqueID,(start+5), (start+5), getDate, (start+5), (start+5), uniqueID, (start+6), (start+6), getDate, (start+6), (start+6), uniqueID,  (month+1),(month+1), 2,name, day], function(error, results, fields){
                  if(error) throw error;
                  console.log("slots updated");
        
                 });

                } 

              if(range == 7){
                
                    mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), percentage? = percentage? + ? WHERE type = "Comp" AND name = ? AND day = ?',
          [start, start, getDate, start, start, uniqueID, (start+1), (start+1), getDate, (start+1), (start+1), uniqueID, (start+2), (start+2), getDate, (start+2), (start+2), uniqueID,  (start+3), (start+3), getDate, (start+3), (start+3), uniqueID, (start+4), (start+4), getDate, (start+4), (start+4), uniqueID, (start+5), (start+5), getDate, (start+5), (start+5), uniqueID,  (start+6), (start+6), getDate, (start+6), (start+6), uniqueID,  (start+7), (start+7), getDate, (start+7), (start+7), uniqueID,  (month+1),(month+1), 2,name, day], function(error, results, fields){
                  if(error) throw error;
                  console.log("slots updated");
                  
        
                 });

                }    

              if(range == 8){
                

                    mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), percentage? = percentage? + ? WHERE type = "Comp" AND name = ? AND day = ?',
          [start, start, getDate, start, start, uniqueID, (start+1), (start+1), getDate, (start+1), (start+1), uniqueID, (start+2), (start+2), getDate, (start+2), (start+2), uniqueID,  (start+3), (start+3), getDate, (start+3), (start+3), uniqueID, (start+4), (start+4), getDate, (start+4), (start+4), uniqueID, (start+5), (start+5), getDate, (start+5), (start+5), uniqueID,  (start+6), (start+6), getDate, (start+6), (start+6), uniqueID,  (start+7), (start+7), getDate, (start+7), (start+7), uniqueID,  (start+8), (start+8), getDate, (start+8), (start+8), uniqueID,  (month+1),(month+1), 2,name, day], function(error, results, fields){
                  if(error) throw error;
                  console.log("slots updated");
                  
                 });

                } 

              if(range == 9){
                
                    mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), percentage? = percentage? + ? WHERE type = "Comp" AND name = ? AND day = ?',
          [start, start, getDate, start, start, uniqueID, (start+1), (start+1), getDate, (start+1), (start+1), uniqueID, (start+2), (start+2), getDate, (start+2), (start+2), uniqueID,  (start+3), (start+3), getDate, (start+3), (start+3), uniqueID,(start+4), (start+4), getDate, (start+4), (start+4), uniqueID,(start+5), (start+5), getDate, (start+5), (start+5), uniqueID, (start+6), (start+6), getDate, (start+6), (start+6), uniqueID, (start+7), (start+7), getDate, (start+7), (start+7), uniqueID, (start+8), (start+8), getDate, (start+8), (start+8), uniqueID, (start+9), (start+9), getDate, (start+9), (start+9), uniqueID,  (month+1),(month+1), 2,name, day], function(error, results, fields){
                  if(error) throw error;
                  console.log("slots updated");
                  
        
                 });

                } 

              if(range == 10){
                

                    mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), percentage? = percentage? + ? WHERE type = "Comp" AND name = ? AND day = ?', 
          [start, start, getDate, start, start, uniqueID, (start+1), (start+1), getDate, (start+1), (start+1), uniqueID, (start+2), (start+2), getDate, (start+2), (start+2), uniqueID,  (start+3), (start+3), getDate, (start+3), (start+3), uniqueID,(start+4), (start+4), getDate, (start+4), (start+4), uniqueID,(start+5), (start+5), getDate, (start+5), (start+5), uniqueID, (start+6), (start+6), getDate, (start+6), (start+6), uniqueID, (start+7), (start+7), getDate, (start+7), (start+7), uniqueID, (start+8), (start+8), getDate, (start+8), (start+8), uniqueID, (start+9), (start+9), getDate, (start+9), (start+9), uniqueID,  (start+10), (start+10), getDate, (start+10), (start+10), uniqueID,  (month+1),(month+1), 2,name, day], function(error, results, fields){
                  if(error) throw error;
                  console.log("slots updated");
                  
        
                 });

                }  

              if(range == 11){
                
                    mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), percentage? = percentage? + ? WHERE type = "Comp" AND name = ? AND day = ?', 
          [start, start, getDate, start, start, uniqueID, (start+1), (start+1), getDate, (start+1), (start+1), uniqueID, (start+2), (start+2), getDate, (start+2), (start+2), uniqueID,  (start+3), (start+3), getDate, (start+3), (start+3), uniqueID,(start+4), (start+4), getDate, (start+4), (start+4), uniqueID,(start+5), (start+5), getDate, (start+5), (start+5), uniqueID, (start+6), (start+6), getDate, (start+6), (start+6), uniqueID, (start+7), (start+7), getDate, (start+7), (start+7), uniqueID, (start+8), (start+8), getDate, (start+8), (start+8), uniqueID, (start+9), (start+9), getDate, (start+9), (start+9), uniqueID,  (start+10), (start+10), getDate, (start+10), (start+10), uniqueID,  (start+11), (start+11), getDate, (start+11), (start+11), uniqueID,  (month+1),(month+1), 2,name, day], function(error, results, fields){
                  if(error) throw error;
                  console.log("slots updated");
                  
        
                 });

                } 

              if(range == 12){
                
                    mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), percentage? = percentage? + ? WHERE type = "Comp" AND name = ? AND day = ?', 
          [start, start, getDate, start, start, uniqueID, (start+1), (start+1), getDate, (start+1), (start+1), uniqueID, (start+2), (start+2), getDate, (start+2), (start+2), uniqueID, (start+3), (start+3), getDate, (start+3), (start+3), uniqueID,(start+4), (start+4), getDate, (start+4), (start+4), uniqueID,(start+5), (start+5), getDate, (start+5), (start+5), uniqueID, (start+6), (start+6), getDate, (start+6), (start+6), uniqueID, (start+7), (start+7), getDate, (start+7), (start+7), uniqueID, (start+8), (start+8), getDate, (start+8), (start+8), uniqueID, (start+9), (start+9), getDate, (start+9), (start+9), uniqueID,  (start+10), (start+10), getDate, (start+10), (start+10), uniqueID,  (start+11), (start+11), getDate, (start+11), (start+11), uniqueID,  (start+12), (start+12), getDate, (start+12), (start+12), uniqueID,  (month+1),(month+1), 2,name, day], function(error, results, fields){
                  if(error) throw error;
                  console.log("slots updated");
                  
        
                 });

                }  

              if(range == 13){
                
                    mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), percentage? = percentage? + ? WHERE type = "Comp" AND name = ? AND day = ?', 
          [start, start, getDate, start, start, uniqueID, (start+1), (start+1), getDate, (start+1), (start+1), uniqueID, (start+2), (start+2), getDate, (start+2), (start+2), uniqueID,  (start+3), (start+3), getDate, (start+3), (start+3), uniqueID,(start+4), (start+4), getDate, (start+4), (start+4), uniqueID,(start+5), (start+5), getDate, (start+5), (start+5), uniqueID, (start+6), (start+6), getDate, (start+6), (start+6), uniqueID, (start+7), (start+7), getDate, (start+7), (start+7), uniqueID, (start+8), (start+8), getDate, (start+8), (start+8), uniqueID, (start+9), (start+9), getDate, (start+9), (start+9), uniqueID,  (start+10), (start+10), getDate, (start+10), (start+10), uniqueID,  (start+11), (start+11), getDate, (start+11), (start+11), uniqueID,  (start+12), (start+12), getDate, (start+12), (start+12), uniqueID,  (start+13), (start+13), getDate, (start+13), (start+13), uniqueID,  (month+1),(month+1), 2,name, day], function(error, results, fields){
                  if(error) throw error;
                  console.log("slots updated");
                  
        
                 });

                }  

              if(range == 14){
                
                    mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), percentage? = percentage? + ? WHERE type = "Comp" AND name = ? AND day = ?', 
          [start, start, getDate, start, start, uniqueID, (start+1), (start+1), getDate, (start+1), (start+1), uniqueID, (start+2), (start+2), getDate, (start+2), (start+2), uniqueID,  (start+3), (start+3), getDate, (start+3), (start+3), uniqueID,(start+4), (start+4), getDate, (start+4), (start+4), uniqueID,(start+5), (start+5), getDate, (start+5), (start+5), uniqueID, (start+6), (start+6), getDate, (start+6), (start+6), uniqueID, (start+7), (start+7), getDate, (start+7), (start+7), uniqueID, (start+8), (start+8), getDate, (start+8), (start+8), uniqueID, (start+9), (start+9), getDate, (start+9), (start+9), uniqueID,  (start+10), (start+10), getDate, (start+10), (start+10), uniqueID,  (start+11), (start+11), getDate, (start+11), (start+11), uniqueID,  (start+12), (start+12), getDate, (start+12), (start+12), uniqueID,  (start+13), (start+13), getDate, (start+13), (start+13), uniqueID,  (start+14), (start+14), getDate, (start+14), (start+14), uniqueID,  (month+1),(month+1), 2,name, day], function(error, results, fields){
                  if(error) throw error;
                  console.log("slots updated");
                  
        
                 });

                }  

              if(range == 15){
                
                    mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), percentage? = percentage? + ? WHERE type = "Comp" AND name = ? AND day = ?', 
          [start, start, getDate, start, start, uniqueID, (start+1), (start+1), getDate, (start+1), (start+1),(start+2), (start+2), getDate, (start+2), (start+2), uniqueID,  (start+3), (start+3), getDate, (start+3), (start+3), uniqueID,(start+4), (start+4), getDate, (start+4), (start+4), uniqueID,(start+5), (start+5), getDate, (start+5), (start+5), uniqueID, (start+6), (start+6), getDate, (start+6), (start+6), uniqueID, (start+7), (start+7), getDate, (start+7), (start+7), uniqueID, (start+8), (start+8), getDate, (start+8), (start+8), uniqueID, (start+9), (start+9), getDate, (start+9), (start+9), uniqueID,  (start+10), (start+10), getDate, (start+10), (start+10), uniqueID,  (start+11), (start+11), getDate, (start+11), (start+11), uniqueID,  (start+12), (start+12), getDate, (start+12), (start+12), uniqueID,  (start+13), (start+13), getDate, (start+13), (start+13), uniqueID,  (start+14), (start+14), getDate, (start+14), (start+14), uniqueID,  (start+15), (start+15), getDate, (start+15), (start+15), uniqueID,  (month+1),(month+1), 2,name, day], function(error, results, fields){
                  if(error) throw error;
                  console.log("slots updated");
                  
        
                 });

                }
              if(range == 16){
                

                    mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), percentage? = percentage? + ? WHERE type = "Comp" AND name = ? AND day = ?', 
          [start, start, getDate, start, start, uniqueID, (start+1), (start+1), getDate, (start+1), (start+1), uniqueID, (start+2), (start+2), getDate, (start+2), (start+2), uniqueID,  (start+3), (start+3), getDate, (start+3), (start+3), uniqueID,(start+4), (start+4), getDate, (start+4), (start+4), uniqueID,(start+5), (start+5), getDate, (start+5), (start+5), uniqueID, (start+6), (start+6), getDate, (start+6), (start+6), uniqueID, (start+7), (start+7), getDate, (start+7), (start+7), uniqueID, (start+8), (start+8), getDate, (start+8), (start+8), uniqueID, (start+9), (start+9), getDate, (start+9), (start+9), uniqueID,  (start+10), (start+10), getDate, (start+10), (start+10), uniqueID,  (start+11), (start+11), getDate, (start+11), (start+11), uniqueID,  (start+12), (start+12), getDate, (start+12), (start+12), uniqueID,  (start+13), (start+13), getDate, (start+13), (start+13), uniqueID,  (start+14), (start+14), getDate, (start+14), (start+14), uniqueID, (start+15), (start+15), getDate, (start+15), (start+15), uniqueID,  (start+16), (start+16), getDate, (start+16), (start+16), uniqueID,  (month+1),(month+1), 2,name, day], function(error, results, fields){
                  if(error) throw error;
                  console.log("slots updated");
                  
        
                 });

                }   

              if(range == 17){
                
                    mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),percentage? = percentage? + ? WHERE type = "Comp" AND name = ? AND day = ?', 
          [start, start, getDate, start, start, uniqueID, (start+1), (start+1), getDate, (start+1), (start+1), uniqueID, (start+2), (start+2), getDate, (start+2), (start+2), uniqueID,  (start+3), (start+3), getDate, (start+3), (start+3), uniqueID,(start+4), (start+4), getDate, (start+4), (start+4), uniqueID,(start+5), (start+5), getDate, (start+5), (start+5), uniqueID, (start+6), (start+6), getDate, (start+6), (start+6), uniqueID, (start+7), (start+7), getDate, (start+7), (start+7), uniqueID, (start+8), (start+8), getDate, (start+8), (start+8), uniqueID, (start+9), (start+9), getDate, (start+9), (start+9), uniqueID,  (start+10), (start+10), getDate, (start+10), (start+10), uniqueID,  (start+11), (start+11), getDate, (start+11), (start+11), uniqueID,  (start+12), (start+12), getDate, (start+12), (start+12), uniqueID,  (start+13), (start+13), getDate, (start+13), (start+13), uniqueID,  (start+14), (start+14), getDate, (start+14), (start+14), uniqueID, (start+15), (start+15), getDate, (start+15), (start+15), uniqueID, (start+16), (start+16), getDate, (start+16), (start+16), uniqueID, (start+17), (start+17), getDate, (start+17), (start+17), uniqueID,  (month+1),(month+1), 2,name, day], function(error, results, fields){
                  if(error) throw error;
                  console.log("slots updated");
                  
        
                 });

                } 

              if(range == 18){
                
                    mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), percentage? = percentage? + ? WHERE type = "Comp" AND name = ? AND day = ?', 
          [start, start, getDate, start, start, uniqueID, (start+1), (start+1), getDate, (start+1), (start+1), uniqueID, (start+2), (start+2), getDate, (start+2), (start+2), uniqueID,  (start+3), (start+3), getDate, (start+3), (start+3), uniqueID,(start+4), (start+4), getDate, (start+4), (start+4), uniqueID,(start+5), (start+5), getDate, (start+5), (start+5), uniqueID, (start+6), (start+6), getDate, (start+6), (start+6), uniqueID, (start+7), (start+7), getDate, (start+7), (start+7), uniqueID, (start+8), (start+8), getDate, (start+8), (start+8), uniqueID, (start+9), (start+9), getDate, (start+9), (start+9), uniqueID,  (start+10), (start+10), getDate, (start+10), (start+10), uniqueID,  (start+11), (start+11), getDate, (start+11), (start+11), uniqueID,  (start+12), (start+12), getDate, (start+12), (start+12), uniqueID,  (start+13), (start+13), getDate, (start+13), (start+13), uniqueID,  (start+14), (start+14), getDate, (start+14), (start+14), uniqueID, (start+15), (start+15), getDate, (start+15), (start+15), uniqueID,  (start+16), (start+16), getDate, (start+16), (start+16), uniqueID,  (start+17), (start+17), getDate, (start+17), (start+17), uniqueID,  (start+18), (start+18), getDate, (start+18), (start+18), uniqueID, (month+1),(month+1), 2,name, day], function(error, results, fields){
                  if(error) throw error;
                  console.log("slots updated");
                  
        
                 });

                }    

              if(range == 19){               

                    mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), percentage? = percentage? + ? WHERE type = "Comp" AND name = ? AND day = ?', 
          [start, start, getDate, start, start, uniqueID, (start+1), (start+1), getDate, (start+1), (start+1), uniqueID, (start+2), (start+2), getDate, (start+2), (start+2), uniqueID,  (start+3), (start+3), getDate, (start+3), (start+3), uniqueID,(start+4), (start+4), getDate, (start+4), (start+4), uniqueID,(start+5), (start+5), getDate, (start+5), (start+5), uniqueID, (start+6), (start+6), getDate, (start+6), (start+6), uniqueID, (start+7), (start+7), getDate, (start+7), (start+7), uniqueID, (start+8), (start+8), getDate, (start+8), (start+8), uniqueID, (start+9), (start+9), getDate, (start+9), (start+9), uniqueID,  (start+10), (start+10), getDate, (start+10), (start+10), uniqueID,  (start+11), (start+11), getDate, (start+11), (start+11), uniqueID,  (start+12), (start+12), getDate, (start+12), (start+12), uniqueID,  (start+13), (start+13), getDate, (start+13), (start+13), uniqueID,  (start+14), (start+14), getDate, (start+14), (start+14), uniqueID, (start+15), (start+15), getDate, (start+15), (start+15), uniqueID,  (start+16), (start+16), getDate, (start+16), (start+16), uniqueID,  (start+17), (start+17), getDate, (start+17), (start+17), uniqueID,  (start+18), (start+18), getDate, (start+18), (start+18), uniqueID,  (start+19), (start+19), getDate, (start+19), (start+19), uniqueID,  (month+1),(month+1), 2,name, day], function(error, results, fields){
                  if(error) throw error;
                  console.log("slots updated");
                  
        
                 });

                } 

              if(range == 20){
                

                    mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), percentage? = percentage? + ? WHERE type = "Comp" AND name = ? AND day = ?', 
          [start, start, getDate, start, start, uniqueID, (start+1), (start+1), getDate, (start+1), (start+1), uniqueID, (start+2), (start+2), getDate, (start+2), (start+2), uniqueID,  (start+3), (start+3), getDate, (start+3), (start+3), uniqueID,(start+4), (start+4), getDate, (start+4), (start+4), uniqueID,(start+5), (start+5), getDate, (start+5), (start+5), uniqueID, (start+6), (start+6), getDate, (start+6), (start+6), uniqueID, (start+7), (start+7), getDate, (start+7), (start+7), uniqueID, (start+8), (start+8), getDate, (start+8), (start+8), uniqueID, (start+9), (start+9), getDate, (start+9), (start+9), uniqueID,  (start+10), (start+10), getDate, (start+10), (start+10), uniqueID,  (start+11), (start+11), getDate, (start+11), (start+11), uniqueID,  (start+12), (start+12), getDate, (start+12), (start+12), uniqueID,  (start+13), (start+13), getDate, (start+13), (start+13), uniqueID,  (start+14), (start+14), getDate, (start+14), (start+14), uniqueID, (start+15), (start+15), getDate, (start+15), (start+15), uniqueID,  (start+16), (start+16), getDate, (start+16), (start+16), uniqueID,  (start+17), (start+17), getDate, (start+17), (start+17), uniqueID,  (start+18), (start+18), getDate, (start+18), (start+18), uniqueID,  (start+19), (start+19), getDate, (start+19), (start+19), uniqueID,  (start+20), (start+20), getDate, (start+20), (start+20), uniqueID,  (month+1),(month+1), 2,name, day], function(error, results, fields){
                  if(error) throw error;
                  console.log("slots updated");
                  
        
                 });

                }  

              if(range == 21){
                

                    mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",",?), percentage? = percentage? + ? WHERE type = "Comp" AND name = ? AND day = ?', 
          [start, start, getDate, start, start, uniqueID, (start+1), (start+1), getDate, (start+1), (start+1), uniqueID, (start+2), (start+2), getDate, (start+2), (start+2), uniqueID,  (start+3), (start+3), getDate, (start+3), (start+3), uniqueID,(start+4), (start+4), getDate, (start+4), (start+4), uniqueID,(start+5), (start+5), getDate, (start+5), (start+5), uniqueID, (start+6), (start+6), getDate, (start+6), (start+6), uniqueID, (start+7), (start+7), getDate, (start+7), (start+7), uniqueID, (start+8), (start+8), getDate, (start+8), (start+8), uniqueID, (start+9), (start+9), getDate, (start+9), (start+9), uniqueID,  (start+10), (start+10), getDate, (start+10), (start+10), uniqueID,  (start+11), (start+11), getDate, (start+11), (start+11), uniqueID,  (start+12), (start+12), getDate, (start+12), (start+12), uniqueID,  (start+13), (start+13), getDate, (start+13), (start+13), uniqueID,  (start+14), (start+14), getDate, (start+14), (start+14), uniqueID, (start+15), (start+15), getDate, (start+15), (start+15), uniqueID,  (start+16), (start+16), getDate, (start+16), (start+16), uniqueID,  (start+17), (start+17), getDate, (start+17), (start+17), uniqueID,  (start+18), (start+18), getDate, (start+18), (start+18), uniqueID,  (start+19), (start+19), getDate, (start+19), (start+19), uniqueID,  (start+20), (start+20), getDate, (start+20), (start+20), uniqueID,  (start+21), (start+21), getDate, (start+21), (start+21), uniqueID,  (month+1),(month+1), 2,name, day], function(error, results, fields){
                  if(error) throw error;
                  console.log("slots updated");
                  
        
                 });

                }     

              mysqlConnection.query('UPDATE taskpoint SET mesyuarat =mesyuarat+2 ,peratus = CASE WHEN peratus < 40 THEN peratus +2 ELSE peratus END,mesyuaratdetail = CONCAT(mesyuaratdetail,",",?),pinperatus=CONCAT(pinperatus,",",peratus),pindate=CONCAT(pindate,",",?) WHERE NAME=? AND MONTH =?', [title,t,name,m], function(error, results, fields){
                 if(error) throw error;
                 console.log("1 meeting point inserted");
                 console.log("1 meeting detail inserted");
                 console.log("total points updated");
                });
        // update query
        mysqlConnection.query('UPDATE meetingInvitation SET confirmation_status = "Accept" WHERE meeting_id = ?', [meeting_id], function(err, result) {
          
                res.redirect('/senaraiJemputanProgram');
            
        })
    
})

app.get('/rejectMeeting/:id',urlencodedParser, function(req, res, next) {
    let id = req.params.id; 
 
        var form_data = {        
            confirmation_status: "Reject"}
        // update query
        mysqlConnection.query('UPDATE meetingInvitation SET confirmation_status = "Reject" WHERE meeting_id = ?', [id], function(err, result) {
          
                res.redirect('/senaraiJemputanProgram');
            
        })
    
})


      
      
            

      
 //===============================E KEHADIRAN==========================================================              
 var today = new Date();
 var today2 = today.toISOString().slice(0, 10);
console.log(today2);
 function morningSession(req, res, next) {
  mysqlConnection.query('SELECT * FROM dailyAttendance WHERE date=? AND category="Pagi" '  , [today2],function(error, results, fields) {
      req.morning = results;
      next();
   });
}

function eveningSession(req, res, next) {
  mysqlConnection.query('SELECT * FROM dailyAttendance WHERE date=? AND category="Petang" '  , [today2],function(error, results, fields) {
    req.evening = results;
    next();
 }); }
  
 function administrators(req, res, next) {
  mysqlConnection.query('SELECT * FROM dailyAttendance WHERE date=? AND category="Kakitangan"'  , [today2],function(error, results, fields) {
    req.admin = results;
    next();
 }); }


function renderAttendancePage(req, res) {
  var name = req.user.fullname;
if(req.user.role==='Staff'){
  res.render('keberadaanHarian.ejs', {
      sesipagi: req.morning,
      sesipetang: req.evening,
      kakitangan: req.admin,
      name:name
  });}

  else{
    res.render('head_keberadaanHarian.ejs', {
      sesipagi: req.morning,
      sesipetang: req.evening,
      kakitangan: req.admin,
      name:name
  })

  }
}
var d = new Date()
var months = new Array(7);
months[0] = "January";
months[1] = "February";
months[2] = "March";
months[3] = "April";
months[4] = "May";
months[5] = "June";
months[6] = "July";
months[7] = "August";
months[8] = "September";
months[9] = "October";
months[10] = "November";
months[11] = "December";


var month = months[d.getMonth()];
console.log("bulan"+month)

function sesipagi(req, res, next) {
  mysqlConnection.query('SELECT * FROM taskpoint WHERE Category="Pagi" AND month=?'  , [month],function(error, results, fields) {
    req.pagi = results;
    next();
 }); }

 function sesipetang(req, res, next) {
  mysqlConnection.query('SELECT * FROM taskpoint WHERE Category="Petang" AND month=?'  , [month],function(error, results, fields) {
    req.petang = results;
    next();
 }); }

 function kakitangan(req, res, next) {
  mysqlConnection.query('SELECT * FROM taskpoint WHERE Category="Kakitangan" AND month=?'  , [month],function(error, results, fields) {
    req.kaki = results;
    next();
 }); }


function renderAnalysisPage(req, res) {
  var name = req.user.fullname;
  
    res.render('analisisBebanan.ejs', {
        sesipagi: req.pagi,
        sesipetang: req.petang,
        kakitangan: req.kaki,
        name: name
    });
  
    
  }


app.get('/keberadaanHarian',checkAuthenticated, morningSession, eveningSession, administrators, renderAttendancePage);
app.get('/analisisBebanan',sesipagi,sesipetang,kakitangan,renderAnalysisPage);

          
          
          app.get('/head_pengesahanPermohonanKeluar',checkAuthenticated,authRole('Headmaster'),(req,res)=>{
            var name = req.user.fullname;
            var date = new Date().toISOString().slice(0, 10);
             mysqlConnection.query('SELECT * FROM hourlyleave WHERE leavetime!="default" AND applydate=?'  ,[date] ,function(error, results, fields) {
              res.render('head_pengesahanPermohonanKeluar.ejs', {
                 h : results,
                 name: name
                  });
                 });
                     
                  })

          app.get('/head_pengesahanPermohonanCuti',checkAuthenticated,authRole('Headmaster'),(req,res)=>{
            var name = req.user.fullname;
            mysqlConnection.query('SELECT * FROM leaveApplication WHERE applydate!="default"' , function(error, results, fields) {
           res.render('head_pengesahanPermohonanCuti.ejs', {
                        leaveApplication : results,
                        name:name
                         });
                        });                        
             })
     
          app.get('/permohonanKeluar',checkAuthenticated,authRole('Staff'),(req,res)=>{
         var name = req.user.fullname;
         var email = req.user.email;
          mysqlConnection.query('SELECT * FROM userprofile WHERE role="Headmaster"' , function(error, results, fields) {
            res.render('permohonanKeluar.ejs', {
              userprofile : results,
              name : name,
              email:email
            
            });
           });
                      
                      })
                        
          app.get('/maklumPermohonanCuti',checkAuthenticated,authRole('Staff'),(req,res)=>{
                        var name = req.user.fullname;
                        var category = req.user.category;
                        var email = req.user.email;
                        mysqlConnection.query('SELECT * FROM userprofile WHERE role="Headmaster"' , function(error, results, fields) {
                          res.render('maklumPermohonanCuti.ejs', {
                            userprofile : results,
                            name:name,
                            category:category,
                            email:email
                          });
                         }); 
                                    })

          app.get('/maklumPenglibatan',checkAuthenticated,authRole('Staff'),(req,res)=>{
         var name = req.user.fullname;
         var category = req.user.category;
         mysqlConnection.query('SELECT * FROM userprofile' , function(error, results, fields) {
        res.render('maklumPenglibatan.ejs', {
             userprofile : results,
             name:name,
             category:category                             

             });
            });
                                                  })

// submit Permohonan keluar
          app.post('/hourlyleave', urlencodedParser,function(req,res) {
          console.log(req.body.head_email);
                

         mysqlConnection.query('INSERT INTO hourlyleave(name,email,applydate,leavetime,entertime,reason) VALUES (?,?,?,?,?,?)',
         [req.body.name,req.body.user_email,req.body.applydate,req.body.leavetime,req.body.entertime,req.body.reason], function(error, results) {
          if(error) throw error;
          res.redirect('/permohonanKeluar#berjaya');
          console.log("1 document inserted");
          //alert("berjaya");
         });


 
         const output = `              
         <p>Anda mempunyai 1 permohonan keluar baharu untuk diluluskan. Mohon kelulusan segera dilakukan </p>
                         <p>Terima Kasih</p>
                         
                        `;
   
   // create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
service: 'gmail',
//port: 587,
//secure: false, // true for 465, false for other ports
auth: {
user: 'sksesystem@gmail.com', // generated ethereal user
pass: 'fyp2020#'  // generated ethereal password
},
tls:{
rejectUnauthorized:false
}
});

// setup email data with unicode symbols
let mailOptions = {
from: '"Sistem Pengurusan Aktiviti" <sksesystem@gmail.com>', // sender address
to: req.body.head_email, // list of receivers
subject: 'Permohonan Keluar untuk Diluluskan', // Subject line
text: 'Hello world?', // plain text body
html: output // html body
};

// send mail with defined transport object

transporter.sendMail(mailOptions, (error, info) => {
if (error) {
return console.log(error);
}
console.log('Message sent: %s', info.messageId);   
console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

// res.render('contact', {msg:'Email has been sent'});
}); 

  })
  
//submit maklum permohonan cuti
          app.post('/notifyleave', urlencodedParser,function(req,res) {
     
    var today = new Date().toISOString().slice(0, 10);
 
   mysqlConnection.query('INSERT INTO leaveApplication(name,email,applydate,leaveCategory,leaveType,startDate,endDate,totalday,remark,category) VALUES (?,?,?,?,?,?,?,?,?,?) ',
    [req.body.name,req.body.user_email,req.body.applydate,req.body.category,req.body.type,req.body.startdate,req.body.finishdate,req.body.totalday,req.body.reason,req.body.usercategory], function(error, results) {
    if(error) throw error;
    res.redirect('/maklumPermohonanCuti#berjaya');
    console.log("1 document inserted");
   // INSERT INTO leaveApplication(name,email,applydate,leaveCategory,leaveType,startDate,endDate,totalday,remark) SELECT ?,email from leaveApplication WHERE name=? LIMIT 1,?,?,?,?,?,?,?, [req,body.name,req.body.name,req.body.applydate,req.body.category,req.body.type,req.body.startdate,req.body.finishdate,req.body.totalday,req.body.reason]
    
   });
 
  //  total = total+1;
  //  console.log("here"+total);
   
  console.log("permohonan"+ totalapp[0].length)
 // console.log("jumlah permohonan"+total[0].length)
   
   const output = `              
   <p>Anda mempunyai ${totalapp[0].length+1} permohonan cuti baharu untuk diluluskan melalui HRMIS. Sila semak HRMIS dan kemaskini kelulusan dalam sistem </p>
                   <p>Terima Kasih</p>
                   
                  `;
  
   
   // create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
service: 'gmail',
//port: 587,
//secure: false, // true for 465, false for other ports
auth: {
user: 'sksesystem@gmail.com', // generated ethereal user
pass: 'fyp2020#'  // generated ethereal password
},
tls:{
rejectUnauthorized:false
}
});

// setup email data with unicode symbols
let mailOptions = {
from: '"Sistem Pengurusan Aktiviti" <sksesystem@gmail.com>', // sender address
to: req.body.head_email, // list of receivers
subject: 'Permohonan Cuti untuk Diluluskan Melalui HRMIS', // Subject line
text: 'Hello world?', // plain text body
html: output // html body
};

// send mail with defined transport object
//if(total>0){
cron.schedule('0 8 * * * ', () => {
  console.log('hello hello')
transporter.sendMail(mailOptions, (error, info) => {
if (error) {
return console.log(error);
}
console.log('Message sent: %s', info.messageId);   
console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

// res.render('contact', {msg:'Email has been sent'});
});}, //{
 // scheduled: true,
  //timezone: "America/Sao_Paulo"
//}


);
 // }


})
   
//submit maklum penglibatan aktiviti luar
          app.post('/penglibatan',urlencodedParser,function(req,res){
                         

                           var days = req.body.totalday;
                           console.log(days);
                           var date1 = new Date(req.body.startdate);
                           //var date2 = new Date(req.body.finish);

                          //console.log(date1);
                          //console.log(date1.getDate());
                          var s = JSON.stringify(date1.getDate());
                          var q = JSON.stringify(date1.getMonth());
                          var month = parseInt(q);
                          var num = parseInt(s);
                          var totaldays = parseInt(days);
                          //console.log(num);
                          console.log(totaldays);
              
                   for(var i = num; i<=num+totaldays; i++){
                      //console.log(i);
                    //var tarikh = (date1.getFullYear())"-"date1.getMonth()"-"[i];
                   if(month==0 || month==2 || month==4 || month==6 || month==7 || month==9 || month==11){
                     //jan mac may jul aug oct dec
                    if(i<32){
                  
                    var y = JSON.stringify(date1.getFullYear());
                    var m = JSON.stringify(date1.getMonth()+1);
                    var d = JSON.stringify(i);
                    var str="-";
                    var zero="0";
                    var tarikh="";
                    if(m!=="10" || m!=="11" || m!=="12"){
                    
                     tarikh = y.concat(str).concat(zero).concat(m).concat(str).concat(d);
                    }
                    else{
                    tarikh = y.concat(str).concat(m).concat(str).concat(d);
                    }
                    console.log(tarikh)
                    var a = new Date(tarikh);
                    var weekday = new Array(7);
                    weekday[0] = "Sunday";
                    weekday[1] = "Monday";
                    weekday[2] = "Tuesday";
                    weekday[3] = "Wednesday";
                    weekday[4] = "Thursday";
                    weekday[5] = "Friday";
                    weekday[6] = "Saturday";
                
                    var day = weekday[a.getDay()];
                    mysqlConnection.query('INSERT INTO dailyAttendance (name,date,act_1,category)VALUES (?,?,?,?)',
                    [req.body.name,tarikh,req.body.act,req.body.usercategory], function(error, results, fields){
                     if(error) throw error;
                     console.log("leave inserted");
                    });
                         mysqlConnection.query('UPDATE availabilityStaff SET slot_1 = CONCAT(slot_1,",",?),slot_2 = CONCAT(slot_2,",",?),slot_3 = CONCAT(slot_3,",",?), slot_4 = CONCAT(slot_4,",",?),slot_5 = CONCAT(slot_5,",",?),slot_6 = CONCAT(slot_6,",",?),slot_7 = CONCAT(slot_7,",",?),slot_8 = CONCAT(slot_8,",",?),slot_9 = CONCAT(slot_9,",",?),slot_10 = CONCAT(slot_10,",",?),slot_11 = CONCAT(slot_11,",",?), slot_12 = CONCAT(slot_12,",",?),slot_13 = CONCAT(slot_13,",",?),slot_14 = CONCAT(slot_14,",",?),slot_15 = CONCAT(slot_15,",",?),slot_16 = CONCAT(slot_16,",",?),slot_17 = CONCAT(slot_17,",",?),slot_18 = CONCAT(slot_18,",",?),slot_19 = CONCAT(slot_19,",",?),slot_20 = CONCAT(slot_20,",",?),slot_21 = CONCAT(slot_21,",",?), slot_22 = CONCAT(slot_22,",",?),act_1 = CONCAT(act_1,",","TLS"),act_2= CONCAT(act_2,",","TLS"), act_3= CONCAT(act_3,",","TLS"), act_4= CONCAT(act_4,",","TLS"),act_5= CONCAT(act_5,",","TLS"),act_6 = CONCAT(act_6,",","TLS"),act_7 = CONCAT(act_7,",","TLS"),act_8 = CONCAT(act_8,",","TLS"),act_9 = CONCAT(act_9,",","TLS"),act_10 = CONCAT(act_10,",","TLS"),act_11 = CONCAT(act_11,",","TLS"),act_12 = CONCAT(act_12,",","TLS"),act_13 = CONCAT(act_13,",","TLS"),act_14 = CONCAT(act_14,",","TLS"),act_15 = CONCAT(act_15,",","TLS"), act_16 = CONCAT(act_16,",","TLS") ,act_17 = CONCAT(act_17,",","TLS"),act_18= CONCAT(act_18,",","TLS"),act_19= CONCAT(act_19,",","TLS"),act_20= CONCAT(act_20,",","TLS"),act_21= CONCAT(act_21,",","TLS"),act_22= CONCAT(act_22,",","TLS") WHERE type = "Comp" AND name = ? AND day = ?',
                         [tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh,req.body.name, day], 
                          function(error, results, fields){
                           if(error) throw error;
                          // console.log("slots updated");
                        
                          });

                        
                        
                        
                        }

                    else if(i>=32){
                      var y = JSON.stringify(date1.getFullYear());
                    var m = JSON.stringify(date1.getMonth()+2);
                    var d = JSON.stringify(i-31);
                    var str="-";
                    var zero="0";
                    var tarikh="";
                    if(m!=="10" || m!=="11" || m!=="12"){
                    
                     tarikh = y.concat(str).concat(zero).concat(m).concat(str).concat(d);
                    }
                    else{
                    tarikh = y.concat(str).concat(m).concat(str).concat(d);
                    }
                    var a = new Date(tarikh);
                    var weekday = new Array(7);
                    weekday[0] = "Sunday";
                    weekday[1] = "Monday";
                    weekday[2] = "Tuesday";
                    weekday[3] = "Wednesday";
                    weekday[4] = "Thursday";
                    weekday[5] = "Friday";
                    weekday[6] = "Saturday";
                
                    var day = weekday[a.getDay()];
                    mysqlConnection.query('INSERT INTO dailyAttendance (name,date,act_1,category)VALUES (?,?,?,?)',
                    [req.body.name,tarikh,req.body.act,req.body.usercategory], function(error, results, fields){
                     if(error) throw error;
                     console.log("leave inserted");
                    });
                         mysqlConnection.query('UPDATE availabilityStaff SET slot_1 = CONCAT(slot_1,",",?),slot_2 = CONCAT(slot_2,",",?),slot_3 = CONCAT(slot_3,",",?), slot_4 = CONCAT(slot_4,",",?),slot_5 = CONCAT(slot_5,",",?),slot_6 = CONCAT(slot_6,",",?),slot_7 = CONCAT(slot_7,",",?),slot_8 = CONCAT(slot_8,",",?),slot_9 = CONCAT(slot_9,",",?),slot_10 = CONCAT(slot_10,",",?),slot_11 = CONCAT(slot_11,",",?), slot_12 = CONCAT(slot_12,",",?),slot_13 = CONCAT(slot_13,",",?),slot_14 = CONCAT(slot_14,",",?),slot_15 = CONCAT(slot_15,",",?),slot_16 = CONCAT(slot_16,",",?),slot_17 = CONCAT(slot_17,",",?),slot_18 = CONCAT(slot_18,",",?),slot_19 = CONCAT(slot_19,",",?),slot_20 = CONCAT(slot_20,",",?),slot_21 = CONCAT(slot_21,",",?), slot_22 = CONCAT(slot_22,",",?),act_1 = CONCAT(act_1,",","TLS"),act_2= CONCAT(act_2,",","TLS"), act_3= CONCAT(act_3,",","TLS"), act_4= CONCAT(act_4,",","TLS"),act_5= CONCAT(act_5,",","TLS"),act_6 = CONCAT(act_6,",","TLS"),act_7 = CONCAT(act_7,",","TLS"),act_8 = CONCAT(act_8,",","TLS"),act_9 = CONCAT(act_9,",","TLS"),act_10 = CONCAT(act_10,",","TLS"),act_11 = CONCAT(act_11,",","TLS"),act_12 = CONCAT(act_12,",","TLS"),act_13 = CONCAT(act_13,",","TLS"),act_14 = CONCAT(act_14,",","TLS"),act_15 = CONCAT(act_15,",","TLS"), act_16 = CONCAT(act_16,",","TLS") ,act_17 = CONCAT(act_17,",","TLS"),act_18= CONCAT(act_18,",","TLS"),act_19= CONCAT(act_19,",","TLS"),act_20= CONCAT(act_20,",","TLS"),act_21= CONCAT(act_21,",","TLS"),act_22= CONCAT(act_22,",","TLS") WHERE type = "Comp" AND name = ? AND day = ?',
                                                  [tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh,req.body.name, day], 
                                                   function(error, results, fields){
                                                    if(error) throw error;
                                                    console.log("slots updated");
                                                 
                                                   });
                                                 

                    }}

                    else if(month==3 || month==5 || month==8 || month==10 ){
                     //april june sep nov
                     if(i<31){
                     
                    var y = JSON.stringify(date1.getFullYear());
                    var m = JSON.stringify(date1.getMonth()+1);
                    var d = JSON.stringify(i);
                    var str="-";
                    var zero="0";
                    var tarikh="";
                    if(m!=="10" || m!=="11" || m!=="12"){
                    
                     tarikh = y.concat(str).concat(zero).concat(m).concat(str).concat(d);
                    }
                    else{
                    tarikh = y.concat(str).concat(m).concat(str).concat(d);
                    }
                    var a = new Date(tarikh);
                    var weekday = new Array(7);
                    weekday[0] = "Sunday";
                    weekday[1] = "Monday";
                    weekday[2] = "Tuesday";
                    weekday[3] = "Wednesday";
                    weekday[4] = "Thursday";
                    weekday[5] = "Friday";
                    weekday[6] = "Saturday";
                
                    var day = weekday[a.getDay()];
                    mysqlConnection.query('INSERT INTO dailyAttendance (name,date,act_1,category)VALUES (?,?,?,?)',
                    [req.body.name,tarikh,req.body.act,req.body.usercategory], function(error, results, fields){
                     if(error) throw error;
                     console.log("leave inserted");
                    });
                    mysqlConnection.query('UPDATE availabilityStaff SET slot_1 = CONCAT(slot_1,",",?),slot_2 = CONCAT(slot_2,",",?),slot_3 = CONCAT(slot_3,",",?), slot_4 = CONCAT(slot_4,",",?),slot_5 = CONCAT(slot_5,",",?),slot_6 = CONCAT(slot_6,",",?),slot_7 = CONCAT(slot_7,",",?),slot_8 = CONCAT(slot_8,",",?),slot_9 = CONCAT(slot_9,",",?),slot_10 = CONCAT(slot_10,",",?),slot_11 = CONCAT(slot_11,",",?), slot_12 = CONCAT(slot_12,",",?),slot_13 = CONCAT(slot_13,",",?),slot_14 = CONCAT(slot_14,",",?),slot_15 = CONCAT(slot_15,",",?),slot_16 = CONCAT(slot_16,",",?),slot_17 = CONCAT(slot_17,",",?),slot_18 = CONCAT(slot_18,",",?),slot_19 = CONCAT(slot_19,",",?),slot_20 = CONCAT(slot_20,",",?),slot_21 = CONCAT(slot_21,",",?), slot_22 = CONCAT(slot_22,",",?),act_1 = CONCAT(act_1,",","TLS"),act_2= CONCAT(act_2,",","TLS"), act_3= CONCAT(act_3,",","TLS"), act_4= CONCAT(act_4,",","TLS"),act_5= CONCAT(act_5,",","TLS"),act_6 = CONCAT(act_6,",","TLS"),act_7 = CONCAT(act_7,",","TLS"),act_8 = CONCAT(act_8,",","TLS"),act_9 = CONCAT(act_9,",","TLS"),act_10 = CONCAT(act_10,",","TLS"),act_11 = CONCAT(act_11,",","TLS"),act_12 = CONCAT(act_12,",","TLS"),act_13 = CONCAT(act_13,",","TLS"),act_14 = CONCAT(act_14,",","TLS"),act_15 = CONCAT(act_15,",","TLS"), act_16 = CONCAT(act_16,",","TLS") ,act_17 = CONCAT(act_17,",","TLS"),act_18= CONCAT(act_18,",","TLS"),act_19= CONCAT(act_19,",","TLS"),act_20= CONCAT(act_20,",","TLS"),act_21= CONCAT(act_21,",","TLS"),act_22= CONCAT(act_22,",","TLS") WHERE type = "Comp" AND name = ? AND day = ?',
                    [tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh,req.body.name, day], 
                     function(error, results, fields){
                      if(error) throw error;
                      console.log("slots updated");
                   
                     });
                    
                  
                  }

                    else if(i>=31){
                      var y = JSON.stringify(date1.getFullYear());
                    var m = JSON.stringify(date1.getMonth()+2);
                    var d = JSON.stringify(i-30);
                    var str="-";
                    var zero="0";
                    var tarikh="";
                    if(m!=="10" || m!=="11" || m!=="12"){
                    
                     tarikh = y.concat(str).concat(zero).concat(m).concat(str).concat(d);
                    }
                    else{
                    tarikh = y.concat(str).concat(m).concat(str).concat(d);
                    }
                    var a = new Date(tarikh);
                    var weekday = new Array(7);
                    weekday[0] = "Sunday";
                    weekday[1] = "Monday";
                    weekday[2] = "Tuesday";
                    weekday[3] = "Wednesday";
                    weekday[4] = "Thursday";
                    weekday[5] = "Friday";
                    weekday[6] = "Saturday";
                
                    var day = weekday[a.getDay()];
                    mysqlConnection.query('INSERT INTO dailyAttendance (name,date,act_1,category)VALUES (?,?,?,?)',
                    [req.body.name,tarikh,req.body.act,req.body.usercategory], function(error, results, fields){
                     if(error) throw error;
                     console.log("leave inserted");
                    });
                    mysqlConnection.query('UPDATE availabilityStaff SET slot_1 = CONCAT(slot_1,",",?),slot_2 = CONCAT(slot_2,",",?),slot_3 = CONCAT(slot_3,",",?), slot_4 = CONCAT(slot_4,",",?),slot_5 = CONCAT(slot_5,",",?),slot_6 = CONCAT(slot_6,",",?),slot_7 = CONCAT(slot_7,",",?),slot_8 = CONCAT(slot_8,",",?),slot_9 = CONCAT(slot_9,",",?),slot_10 = CONCAT(slot_10,",",?),slot_11 = CONCAT(slot_11,",",?), slot_12 = CONCAT(slot_12,",",?),slot_13 = CONCAT(slot_13,",",?),slot_14 = CONCAT(slot_14,",",?),slot_15 = CONCAT(slot_15,",",?),slot_16 = CONCAT(slot_16,",",?),slot_17 = CONCAT(slot_17,",",?),slot_18 = CONCAT(slot_18,",",?),slot_19 = CONCAT(slot_19,",",?),slot_20 = CONCAT(slot_20,",",?),slot_21 = CONCAT(slot_21,",",?), slot_22 = CONCAT(slot_22,",",?),act_1 = CONCAT(act_1,",","TLS"),act_2= CONCAT(act_2,",","TLS"), act_3= CONCAT(act_3,",","TLS"), act_4= CONCAT(act_4,",","TLS"),act_5= CONCAT(act_5,",","TLS"),act_6 = CONCAT(act_6,",","TLS"),act_7 = CONCAT(act_7,",","TLS"),act_8 = CONCAT(act_8,",","TLS"),act_9 = CONCAT(act_9,",","TLS"),act_10 = CONCAT(act_10,",","TLS"),act_11 = CONCAT(act_11,",","TLS"),act_12 = CONCAT(act_12,",","TLS"),act_13 = CONCAT(act_13,",","TLS"),act_14 = CONCAT(act_14,",","TLS"),act_15 = CONCAT(act_15,",","TLS"), act_16 = CONCAT(act_16,",","TLS") ,act_17 = CONCAT(act_17,",","TLS"),act_18= CONCAT(act_18,",","TLS"),act_19= CONCAT(act_19,",","TLS"),act_20= CONCAT(act_20,",","TLS"),act_21= CONCAT(act_21,",","TLS"),act_22= CONCAT(act_22,",","TLS") WHERE type = "Comp" AND name = ? AND day = ?',
                                                  [tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh,req.body.name, day], 
                                                   function(error, results, fields){
                                                    if(error) throw error;
                                                    console.log("slots updated");
                                                 
                                                   });
                                                 
                    }


                    }
                    else{//feb
                      if(i<30){
                     
                        var y = JSON.stringify(date1.getFullYear());
                        var m = JSON.stringify(date1.getMonth()+1);
                        var d = JSON.stringify(i);
                        var str="-";
                        var zero="0";
                        var tarikh="";
                        if(m!=="10" || m!=="11" || m!=="12"){
                        
                         tarikh = y.concat(str).concat(zero).concat(m).concat(str).concat(d);
                        }
                        else{
                        tarikh = y.concat(str).concat(m).concat(str).concat(d);
                        }
                        var a = new Date(tarikh);
                        var weekday = new Array(7);
                        weekday[0] = "Sunday";
                        weekday[1] = "Monday";
                        weekday[2] = "Tuesday";
                        weekday[3] = "Wednesday";
                        weekday[4] = "Thursday";
                        weekday[5] = "Friday";
                        weekday[6] = "Saturday";
                    
                        var day = weekday[a.getDay()];
                        mysqlConnection.query('INSERT INTO dailyAttendance (name,date,act_1,category)VALUES (?,?,?,?)',
                        [req.body.name,tarikh,req.body.act,req.body.usercategory], function(error, results, fields){
                         if(error) throw error;
                         console.log("leave inserted");
                        });
                        mysqlConnection.query('UPDATE availabilityStaff SET slot_1 = CONCAT(slot_1,",",?),slot_2 = CONCAT(slot_2,",",?),slot_3 = CONCAT(slot_3,",",?), slot_4 = CONCAT(slot_4,",",?),slot_5 = CONCAT(slot_5,",",?),slot_6 = CONCAT(slot_6,",",?),slot_7 = CONCAT(slot_7,",",?),slot_8 = CONCAT(slot_8,",",?),slot_9 = CONCAT(slot_9,",",?),slot_10 = CONCAT(slot_10,",",?),slot_11 = CONCAT(slot_11,",",?), slot_12 = CONCAT(slot_12,",",?),slot_13 = CONCAT(slot_13,",",?),slot_14 = CONCAT(slot_14,",",?),slot_15 = CONCAT(slot_15,",",?),slot_16 = CONCAT(slot_16,",",?),slot_17 = CONCAT(slot_17,",",?),slot_18 = CONCAT(slot_18,",",?),slot_19 = CONCAT(slot_19,",",?),slot_20 = CONCAT(slot_20,",",?),slot_21 = CONCAT(slot_21,",",?), slot_22 = CONCAT(slot_22,",",?),act_1 = CONCAT(act_1,",","TLS"),act_2= CONCAT(act_2,",","TLS"), act_3= CONCAT(act_3,",","TLS"), act_4= CONCAT(act_4,",","TLS"),act_5= CONCAT(act_5,",","TLS"),act_6 = CONCAT(act_6,",","TLS"),act_7 = CONCAT(act_7,",","TLS"),act_8 = CONCAT(act_8,",","TLS"),act_9 = CONCAT(act_9,",","TLS"),act_10 = CONCAT(act_10,",","TLS"),act_11 = CONCAT(act_11,",","TLS"),act_12 = CONCAT(act_12,",","TLS"),act_13 = CONCAT(act_13,",","TLS"),act_14 = CONCAT(act_14,",","TLS"),act_15 = CONCAT(act_15,",","TLS"), act_16 = CONCAT(act_16,",","TLS") ,act_17 = CONCAT(act_17,",","TLS"),act_18= CONCAT(act_18,",","TLS"),act_19= CONCAT(act_19,",","TLS"),act_20= CONCAT(act_20,",","TLS"),act_21= CONCAT(act_21,",","TLS"),act_22= CONCAT(act_22,",","TLS") WHERE type = "Comp" AND name = ? AND day = ?',
                        [tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh,req.body.name, day], 
                         function(error, results, fields){
                          if(error) throw error;
                          console.log("slots updated");
                       
                         });

                        
                      }
    
                        else if(i>=30){
                          var y = JSON.stringify(date1.getFullYear());
                        var m = JSON.stringify(date1.getMonth()+2);
                        var d = JSON.stringify(i-29);
                        var str="-";
                        var zero="0";
                        var tarikh="";
                        if(m!=="10" || m!=="11" || m!=="12"){
                        
                         tarikh = y.concat(str).concat(zero).concat(m).concat(str).concat(d);
                        }
                        else{
                        tarikh = y.concat(str).concat(m).concat(str).concat(d);
                        }
                        var a = new Date(tarikh);
                        var weekday = new Array(7);
                        weekday[0] = "Sunday";
                        weekday[1] = "Monday";
                        weekday[2] = "Tuesday";
                        weekday[3] = "Wednesday";
                        weekday[4] = "Thursday";
                        weekday[5] = "Friday";
                        weekday[6] = "Saturday";
                    
                        var day = weekday[a.getDay()];
                        mysqlConnection.query('INSERT INTO dailyAttendance (name,date,act_1,category)VALUES (?,?,?,?)',
                        [req.body.name,tarikh,req.body.act,req.body.usercategory], function(error, results, fields){
                         if(error) throw error;
                         console.log("leave inserted");
                        });
                        mysqlConnection.query('UPDATE availabilityStaff SET slot_1 = CONCAT(slot_1,",",?),slot_2 = CONCAT(slot_2,",",?),slot_3 = CONCAT(slot_3,",",?), slot_4 = CONCAT(slot_4,",",?),slot_5 = CONCAT(slot_5,",",?),slot_6 = CONCAT(slot_6,",",?),slot_7 = CONCAT(slot_7,",",?),slot_8 = CONCAT(slot_8,",",?),slot_9 = CONCAT(slot_9,",",?),slot_10 = CONCAT(slot_10,",",?),slot_11 = CONCAT(slot_11,",",?), slot_12 = CONCAT(slot_12,",",?),slot_13 = CONCAT(slot_13,",",?),slot_14 = CONCAT(slot_14,",",?),slot_15 = CONCAT(slot_15,",",?),slot_16 = CONCAT(slot_16,",",?),slot_17 = CONCAT(slot_17,",",?),slot_18 = CONCAT(slot_18,",",?),slot_19 = CONCAT(slot_19,",",?),slot_20 = CONCAT(slot_20,",",?),slot_21 = CONCAT(slot_21,",",?), slot_22 = CONCAT(slot_22,",",?),act_1 = CONCAT(act_1,",","TLS"),act_2= CONCAT(act_2,",","TLS"), act_3= CONCAT(act_3,",","TLS"), act_4= CONCAT(act_4,",","TLS"),act_5= CONCAT(act_5,",","TLS"),act_6 = CONCAT(act_6,",","TLS"),act_7 = CONCAT(act_7,",","TLS"),act_8 = CONCAT(act_8,",","TLS"),act_9 = CONCAT(act_9,",","TLS"),act_10 = CONCAT(act_10,",","TLS"),act_11 = CONCAT(act_11,",","TLS"),act_12 = CONCAT(act_12,",","TLS"),act_13 = CONCAT(act_13,",","TLS"),act_14 = CONCAT(act_14,",","TLS"),act_15 = CONCAT(act_15,",","TLS"), act_16 = CONCAT(act_16,",","TLS") ,act_17 = CONCAT(act_17,",","TLS"),act_18= CONCAT(act_18,",","TLS"),act_19= CONCAT(act_19,",","TLS"),act_20= CONCAT(act_20,",","TLS"),act_21= CONCAT(act_21,",","TLS"),act_22= CONCAT(act_22,",","TLS") WHERE type = "Comp" AND name = ? AND day = ?',
                                                  [tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh,req.body.name, day], 
                                                   function(error, results, fields){
                                                    if(error) throw error;
                                                    console.log("slots updated");
                                                 
                                                   });
                                              
    
                        }



                    }
                     
                   }

                   res.redirect('/maklumPenglibatan#berjaya')
                           
              
              
                        })

//pengesahan permohonan cuti(telah ditolak melalui HRMIS)
          app.post('/updateapproval_reject',urlencodedParser,function(req,res){
                         console.log(req.body.name);
                          mysqlConnection.query('DELETE FROM leaveApplication WHERE applydate= ? AND name=? AND leaveCategory=? AND leaveType=? AND startDate=? AND endDate=?', [req.body.date,req.body.name,req.body.category,req.body.type,req.body.start,req.body.end], function(error, results, fields){
                            if(error) throw error;
                            // res.redirect('/head_pengesahanPermohonanCuti#berjayatolak');
                            console.log("leave deleted");
                  
                           });
                        
                          const output = `
                          <p>${req.body.name},</p><br>               
                          <p>Permohonan cuti anda telah ditolak melalui HRMIS</p>
                                          <h4>Butiran Permohonan:</h4>
                                         <ul>  
                                       <li>Tarikh Permohonan: ${req.body.date}</li>
                                     <li>Jenis Cuti: ${req.body.type}</li>
                                            <li>Tarikh Mula: ${req.body.start}</li>
                                          <li>Tarikh Akhir: ${req.body.end}</li>
                                          
                                          </ul>
                                          <p>Sila semak HRMIS untuk keterangan lanjut</p>
                                         `;
                          
                          // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    //port: 587,
    //secure: false, // true for 465, false for other ports
    auth: {
        user: 'sksesystem@gmail.com', // generated ethereal user
        pass: 'fyp2020#'  // generated ethereal password
    },
    tls:{
      rejectUnauthorized:false
    }
  });

  //setup email data with unicode symbols
  let mailOptions = {
      from: '"Sistem Pengurusan Aktiviti" <sksesystem@gmail.com>', // sender address
      to: req.body.email, // list of receivers
      subject: 'Permohonan Cuti Tidak Diluluskan', // Subject line
      text: 'Hello world?', // plain text body
      html: output // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);   
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

     // res.render('contact', {msg:'Email has been sent'});
  });
 res.redirect('/head_pengesahanPermohonanCuti#berjayatolak')


                          
                         })

//pengesahan permohonan cuti(telah diluluskan melalui HRMIS)
          app.post('/updateapproval',urlencodedParser,function(req,res){

                           
                          const output = `
                          <p>${req.body.name},</p><br>               
                          <p>Permohonan cuti anda telah diluluskan melalui HRMIS</p>
                                          <h4>Butiran Permohonan:</h4>
                                         <ul>  
                                       <li>Tarikh Permohonan: ${req.body.date}</li>
                                     <li>Jenis Cuti: ${req.body.type}</li>
                                            <li>Tarikh Mula: ${req.body.start}</li>
                                          <li>Tarikh Akhir: ${req.body.end}</li>
                                          </ul>
                                          <p>Sila semak HRMIS untuk keterangan lanjut</p>
                                         `;
                          
                          // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    //port: 587,
    //secure: false, // true for 465, false for other ports
    auth: {
        user: 'sksesystem@gmail.com', // generated ethereal user
        pass: 'fyp2020#'  // generated ethereal password
    },
    tls:{
      rejectUnauthorized:false
    }
  });

  // setup email data with unicode symbols
  let mailOptions = {
      from: '"Sistem Pengurusan Aktiviti" <sksesystem@gmail.com>', // sender address
      to: req.body.email, // list of receivers
      subject: 'Permohonan Cuti Diluluskan', // Subject line
      text: 'Hello world?', // plain text body
      html: output // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);   
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

     res.render('contact', {msg:'Email has been sent'});
  });


                         
            
                          mysqlConnection.query('DELETE FROM leaveApplication WHERE applydate= ? AND name=? AND leaveCategory=? AND leaveType=? AND startDate=? AND endDate=?', [req.body.date,req.body.name,req.body.category,req.body.type,req.body.start,req.body.end], function(error, results, fields){
                            if(error) throw error;
                            res.redirect('/head_pengesahanPermohonanCuti#berjayalulus');
                            console.log("leave deleted");
                  
                           });
                           
                           
                           var days = req.body.totalday;
                           console.log(days);
                           var date1 = new Date(req.body.start);
                           //var date2 = new Date(req.body.finish);

                          //console.log(date1);
                          //console.log(date1.getDate());
                          var s = JSON.stringify(date1.getDate());
                          var q = JSON.stringify(date1.getMonth());
                          var month = parseInt(q);
                          var num = parseInt(s);
                          var totaldays = parseInt(days);
                          //console.log(num);
                          console.log(totaldays);
                       
              
                   for(var i = num; i<=num+totaldays; i++){
                      //console.log(i);
                    //var tarikh = (date1.getFullYear())"-"date1.getMonth()"-"[i];
                   if(month==0 || month==2 || month==4 || month==6 || month==7 || month==9 || month==11){
                     //jan mac may jul aug oct dec
                    if(i<32){
                     
                    var y = JSON.stringify(date1.getFullYear());
                    var m = JSON.stringify(date1.getMonth()+1);
                    var d = JSON.stringify(i);
                    var str="-";
                    var zero="0";
                    var tarikh="";

                    if(d<10){
                      if(m!=="10" || m!=="11" || m!=="12"){
                    
                        tarikh = y.concat(str).concat(zero).concat(m).concat(str).concat(zero).concat(d);
                       }
                       else{
                       tarikh = y.concat(str).concat(m).concat(str).concat(zero).concat(d);
                       }


                    }
                    else{
                      if(m!=="10" || m!=="11" || m!=="12"){
                    
                     tarikh = y.concat(str).concat(zero).concat(m).concat(str).concat(d);
                    }
                    else{
                    tarikh = y.concat(str).concat(m).concat(str).concat(d);
                    }
                    }
                    
                    var t = new Date(tarikh);
                    var weekday = new Array(7);
                    weekday[0] = "Sunday";
                    weekday[1] = "Monday";
                    weekday[2] = "Tuesday";
                    weekday[3] = "Wednesday";
                    weekday[4] = "Thursday";
                    weekday[5] = "Friday";
                    weekday[6] = "Saturday";
                   
                    var day = weekday[t.getDay()];

                    mysqlConnection.query('INSERT INTO dailyAttendance (name,date,act_1,category)VALUES (?,?,?,?)',
                    [req.body.name,tarikh,req.body.type,req.body.usercategory], function(error, results, fields){
                     if(error) throw error;
                     console.log("leave inserted");
                    });
                         mysqlConnection.query('UPDATE availabilityStaff SET slot_1 = CONCAT(slot_1,",",?),slot_2 = CONCAT(slot_2,",",?),slot_3 = CONCAT(slot_3,",",?), slot_4 = CONCAT(slot_4,",",?),slot_5 = CONCAT(slot_5,",",?),slot_6 = CONCAT(slot_6,",",?),slot_7 = CONCAT(slot_7,",",?),slot_8 = CONCAT(slot_8,",",?),slot_9 = CONCAT(slot_9,",",?),slot_10 = CONCAT(slot_10,",",?),slot_11 = CONCAT(slot_11,",",?), slot_12 = CONCAT(slot_12,",",?),slot_13 = CONCAT(slot_13,",",?),slot_14 = CONCAT(slot_14,",",?),slot_15 = CONCAT(slot_15,",",?),slot_16 = CONCAT(slot_16,",",?),slot_17 = CONCAT(slot_17,",",?),slot_18 = CONCAT(slot_18,",",?),slot_19 = CONCAT(slot_19,",",?),slot_20 = CONCAT(slot_20,",",?),slot_21 = CONCAT(slot_21,",",?), slot_22 = CONCAT(slot_22,",",?),act_1 = CONCAT(act_1,",","OL"),act_2= CONCAT(act_2,",","OL"), act_3= CONCAT(act_3,",","OL"), act_4= CONCAT(act_4,",","OL"),act_5= CONCAT(act_5,",","OL"),act_6 = CONCAT(act_6,",","OL"),act_7 = CONCAT(act_7,",","OL"),act_8 = CONCAT(act_8,",","OL"),act_9 = CONCAT(act_9,",","OL"),act_10 = CONCAT(act_10,",","OL"),act_11 = CONCAT(act_11,",","OL"),act_12 = CONCAT(act_12,",","OL"),act_13 = CONCAT(act_13,",","OL"),act_14 = CONCAT(act_14,",","OL"),act_15 = CONCAT(act_15,",","OL"), act_16 = CONCAT(act_16,",","OL") ,act_17 = CONCAT(act_17,",","OL"),act_18= CONCAT(act_18,",","OL"),act_19= CONCAT(act_19,",","OL"),act_20= CONCAT(act_20,",","OL"),act_21= CONCAT(act_21,",","OL"),act_22= CONCAT(act_22,",","OL") WHERE type = "Comp" AND name = ? AND day = ?',
                         [tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh,req.body.name, day], 
                          function(error, results, fields){
                           if(error) throw error;
                           console.log("slots updated");
                        
                          });
              
                        
                        
                        
                        
                        }

                    else if(i>=32){
                      var y = JSON.stringify(date1.getFullYear());
                    var m = JSON.stringify(date1.getMonth()+2);
                    var d = JSON.stringify(i-31);
                    var str="-";
                    var zero="0";
                    var tarikh="";
                    if(d<10){
                      if(m!=="10" || m!=="11" || m!=="12"){
                    
                        tarikh = y.concat(str).concat(zero).concat(m).concat(str).concat(zero).concat(d);
                       }
                       else{
                       tarikh = y.concat(str).concat(m).concat(str).concat(zero).concat(d);
                       }


                    }
                    else{
                      if(m!=="10" || m!=="11" || m!=="12"){
                    
                     tarikh = y.concat(str).concat(zero).concat(m).concat(str).concat(d);
                    }
                    else{
                    tarikh = y.concat(str).concat(m).concat(str).concat(d);
                    }
                    }
                    var t = new Date(tarikh);
                    var weekday = new Array(7);
                    weekday[0] = "Sunday";
                    weekday[1] = "Monday";
                    weekday[2] = "Tuesday";
                    weekday[3] = "Wednesday";
                    weekday[4] = "Thursday";
                    weekday[5] = "Friday";
                    weekday[6] = "Saturday";
                   
                    var day = weekday[t.getDay()];
                   mysqlConnection.query('INSERT INTO dailyAttendance (name,date,act_1,category)VALUES (?,?,?,?)',
                    [req.body.name,tarikh,req.body.type,req.body.usercategory], function(error, results, fields){
                     if(error) throw error;
                     console.log("leave inserted");
                    });
                    mysqlConnection.query('UPDATE availabilityStaff SET slot_1 = CONCAT(slot_1,",",?),slot_2 = CONCAT(slot_2,",",?),slot_3 = CONCAT(slot_3,",",?), slot_4 = CONCAT(slot_4,",",?),slot_5 = CONCAT(slot_5,",",?),slot_6 = CONCAT(slot_6,",",?),slot_7 = CONCAT(slot_7,",",?),slot_8 = CONCAT(slot_8,",",?),slot_9 = CONCAT(slot_9,",",?),slot_10 = CONCAT(slot_10,",",?),slot_11 = CONCAT(slot_11,",",?), slot_12 = CONCAT(slot_12,",",?),slot_13 = CONCAT(slot_13,",",?),slot_14 = CONCAT(slot_14,",",?),slot_15 = CONCAT(slot_15,",",?),slot_16 = CONCAT(slot_16,",",?),slot_17 = CONCAT(slot_17,",",?),slot_18 = CONCAT(slot_18,",",?),slot_19 = CONCAT(slot_19,",",?),slot_20 = CONCAT(slot_20,",",?),slot_21 = CONCAT(slot_21,",",?), slot_22 = CONCAT(slot_22,",",?),act_1 = CONCAT(act_1,",","OL"),act_2= CONCAT(act_2,",","OL"), act_3= CONCAT(act_3,",","OL"), act_4= CONCAT(act_4,",","OL"),act_5= CONCAT(act_5,",","OL"),act_6 = CONCAT(act_6,",","OL"),act_7 = CONCAT(act_7,",","OL"),act_8 = CONCAT(act_8,",","OL"),act_9 = CONCAT(act_9,",","OL"),act_10 = CONCAT(act_10,",","OL"),act_11 = CONCAT(act_11,",","OL"),act_12 = CONCAT(act_12,",","OL"),act_13 = CONCAT(act_13,",","OL"),act_14 = CONCAT(act_14,",","OL"),act_15 = CONCAT(act_15,",","OL"), act_16 = CONCAT(act_16,",","OL") ,act_17 = CONCAT(act_17,",","OL"),act_18= CONCAT(act_18,",","OL"),act_19= CONCAT(act_19,",","OL"),act_20= CONCAT(act_20,",","OL"),act_21= CONCAT(act_21,",","OL"),act_22= CONCAT(act_22,",","OL") WHERE type = "Comp" AND name = ? AND day = ?',
           [tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh,req.body.name, day], 
function(error, results, fields){
             if(error) throw error;
             console.log("slots updated");
          
            });


                    }}

                    else if(month==3 || month==5 || month==8 || month==10 ){
                     //april june sep nov
                     if(i<31){
                     
                    var y = JSON.stringify(date1.getFullYear());
                    var m = JSON.stringify(date1.getMonth()+1);
                    var d = JSON.stringify(i);
                    var str="-";
                    var zero="0";
                    var tarikh="";
                    if(d<10){
                      if(m!=="10" || m!=="11" || m!=="12"){
                    
                        tarikh = y.concat(str).concat(zero).concat(m).concat(str).concat(zero).concat(d);
                       }
                       else{
                       tarikh = y.concat(str).concat(m).concat(str).concat(zero).concat(d);
                       }


                    }
                    else{
                      if(m!=="10" || m!=="11" || m!=="12"){
                    
                     tarikh = y.concat(str).concat(zero).concat(m).concat(str).concat(d);
                    }
                    else{
                    tarikh = y.concat(str).concat(m).concat(str).concat(d);
                    }
                    }
                    var t = new Date(tarikh);
                    var weekday = new Array(7);
                    weekday[0] = "Sunday";
                    weekday[1] = "Monday";
                    weekday[2] = "Tuesday";
                    weekday[3] = "Wednesday";
                    weekday[4] = "Thursday";
                    weekday[5] = "Friday";
                    weekday[6] = "Saturday";
                   
                    var day = weekday[t.getDay()];
                   mysqlConnection.query('INSERT INTO dailyAttendance (name,date,act_1,category)VALUES (?,?,?,?)',
                    [req.body.name,tarikh,req.body.type,req.body.usercategory], function(error, results, fields){
                     if(error) throw error;
                     console.log("leave inserted");
                    });
                        
                         mysqlConnection.query('UPDATE availabilityStaff SET slot_1 = CONCAT(slot_1,",",?),slot_2 = CONCAT(slot_2,",",?),slot_3 = CONCAT(slot_3,",",?), slot_4 = CONCAT(slot_4,",",?),slot_5 = CONCAT(slot_5,",",?),slot_6 = CONCAT(slot_6,",",?),slot_7 = CONCAT(slot_7,",",?),slot_8 = CONCAT(slot_8,",",?),slot_9 = CONCAT(slot_9,",",?),slot_10 = CONCAT(slot_10,",",?),slot_11 = CONCAT(slot_11,",",?), slot_12 = CONCAT(slot_12,",",?),slot_13 = CONCAT(slot_13,",",?),slot_14 = CONCAT(slot_14,",",?),slot_15 = CONCAT(slot_15,",",?),slot_16 = CONCAT(slot_16,",",?),slot_17 = CONCAT(slot_17,",",?),slot_18 = CONCAT(slot_18,",",?),slot_19 = CONCAT(slot_19,",",?),slot_20 = CONCAT(slot_20,",",?),slot_21 = CONCAT(slot_21,",",?), slot_22 = CONCAT(slot_22,",",?),act_1 = CONCAT(act_1,",","OL"),act_2= CONCAT(act_2,",","OL"), act_3= CONCAT(act_3,",","OL"), act_4= CONCAT(act_4,",","OL"),act_5= CONCAT(act_5,",","OL"),act_6 = CONCAT(act_6,",","OL"),act_7 = CONCAT(act_7,",","OL"),act_8 = CONCAT(act_8,",","OL"),act_9 = CONCAT(act_9,",","OL"),act_10 = CONCAT(act_10,",","OL"),act_11 = CONCAT(act_11,",","OL"),act_12 = CONCAT(act_12,",","OL"),act_13 = CONCAT(act_13,",","OL"),act_14 = CONCAT(act_14,",","OL"),act_15 = CONCAT(act_15,",","OL"), act_16 = CONCAT(act_16,",","OL") ,act_17 = CONCAT(act_17,",","OL"),act_18= CONCAT(act_18,",","OL"),act_19= CONCAT(act_19,",","OL"),act_20= CONCAT(act_20,",","OL"),act_21= CONCAT(act_21,",","OL"),act_22= CONCAT(act_22,",","OL") WHERE type = "Comp" AND name = ? AND day = ?',
                         [tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh,req.body.name, day], 
              function(error, results, fields){
                           if(error) throw error;
                           console.log("slots updated");
                        
                          });
              
                        
                        
                        }

                    else if(i>=31){
                      var y = JSON.stringify(date1.getFullYear());
                    var m = JSON.stringify(date1.getMonth()+2);
                    var d = JSON.stringify(i-30);
                    var str="-";
                    var zero="0";
                    var tarikh="";
                    if(d<10){
                      if(m!=="10" || m!=="11" || m!=="12"){
                    
                        tarikh = y.concat(str).concat(zero).concat(m).concat(str).concat(zero).concat(d);
                       }
                       else{
                       tarikh = y.concat(str).concat(m).concat(str).concat(zero).concat(d);
                       }


                    }
                    else{
                      if(m!=="10" || m!=="11" || m!=="12"){
                    
                     tarikh = y.concat(str).concat(zero).concat(m).concat(str).concat(d);
                    }
                    else{
                    tarikh = y.concat(str).concat(m).concat(str).concat(d);
                    }
                    }
                    var t = new Date(tarikh);
                    var weekday = new Array(7);
                    weekday[0] = "Sunday";
                    weekday[1] = "Monday";
                    weekday[2] = "Tuesday";
                    weekday[3] = "Wednesday";
                    weekday[4] = "Thursday";
                    weekday[5] = "Friday";
                    weekday[6] = "Saturday";
                   
                    var day = weekday[t.getDay()];
                   mysqlConnection.query('INSERT INTO dailyAttendance (name,date,act_1,category)VALUES (?,?,?,?)',
                    [req.body.name,tarikh,req.body.type,req.body.usercategory], function(error, results, fields){
                     if(error) throw error;
                     console.log("leave inserted");
                    });
                    mysqlConnection.query('UPDATE availabilityStaff SET slot_1 = CONCAT(slot_1,",",?),slot_2 = CONCAT(slot_2,",",?),slot_3 = CONCAT(slot_3,",",?), slot_4 = CONCAT(slot_4,",",?),slot_5 = CONCAT(slot_5,",",?),slot_6 = CONCAT(slot_6,",",?),slot_7 = CONCAT(slot_7,",",?),slot_8 = CONCAT(slot_8,",",?),slot_9 = CONCAT(slot_9,",",?),slot_10 = CONCAT(slot_10,",",?),slot_11 = CONCAT(slot_11,",",?), slot_12 = CONCAT(slot_12,",",?),slot_13 = CONCAT(slot_13,",",?),slot_14 = CONCAT(slot_14,",",?),slot_15 = CONCAT(slot_15,",",?),slot_16 = CONCAT(slot_16,",",?),slot_17 = CONCAT(slot_17,",",?),slot_18 = CONCAT(slot_18,",",?),slot_19 = CONCAT(slot_19,",",?),slot_20 = CONCAT(slot_20,",",?),slot_21 = CONCAT(slot_21,",",?), slot_22 = CONCAT(slot_22,",",?),act_1 = CONCAT(act_1,",","OL"),act_2= CONCAT(act_2,",","OL"), act_3= CONCAT(act_3,",","OL"), act_4= CONCAT(act_4,",","OL"),act_5= CONCAT(act_5,",","OL"),act_6 = CONCAT(act_6,",","OL"),act_7 = CONCAT(act_7,",","OL"),act_8 = CONCAT(act_8,",","OL"),act_9 = CONCAT(act_9,",","OL"),act_10 = CONCAT(act_10,",","OL"),act_11 = CONCAT(act_11,",","OL"),act_12 = CONCAT(act_12,",","OL"),act_13 = CONCAT(act_13,",","OL"),act_14 = CONCAT(act_14,",","OL"),act_15 = CONCAT(act_15,",","OL"), act_16 = CONCAT(act_16,",","OL") ,act_17 = CONCAT(act_17,",","OL"),act_18= CONCAT(act_18,",","OL"),act_19= CONCAT(act_19,",","OL"),act_20= CONCAT(act_20,",","OL"),act_21= CONCAT(act_21,",","OL"),act_22= CONCAT(act_22,",","OL") WHERE type = "Comp" AND name = ? AND day = ?',
           [tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh,req.body.name, day], 
function(error, results, fields){
             if(error) throw error;
             console.log("slots updated");
          
            });


                    }


                    }
                    else{//feb
                      if(i<30){
                     
                        var y = JSON.stringify(date1.getFullYear());
                        var m = JSON.stringify(date1.getMonth()+1);
                        var d = JSON.stringify(i);
                        var str="-";
                        var zero="0";
                        var tarikh="";
                        if(d<10){
                          if(m!=="10" || m!=="11" || m!=="12"){
                        
                            tarikh = y.concat(str).concat(zero).concat(m).concat(str).concat(zero).concat(d);
                           }
                           else{
                           tarikh = y.concat(str).concat(m).concat(str).concat(zero).concat(d);
                           }
    
    
                        }
                        else{
                          if(m!=="10" || m!=="11" || m!=="12"){
                        
                         tarikh = y.concat(str).concat(zero).concat(m).concat(str).concat(d);
                        }
                        else{
                        tarikh = y.concat(str).concat(m).concat(str).concat(d);
                        }
                        }
                        var t = new Date(tarikh);
                    var weekday = new Array(7);
                    weekday[0] = "Sunday";
                    weekday[1] = "Monday";
                    weekday[2] = "Tuesday";
                    weekday[3] = "Wednesday";
                    weekday[4] = "Thursday";
                    weekday[5] = "Friday";
                    weekday[6] = "Saturday";
                   
                    var day = weekday[t.getDay()];
                   mysqlConnection.query('INSERT INTO dailyAttendance (name,date,act_1,category)VALUES (?,?,?,?)',
                    [req.body.name,tarikh,req.body.type,req.body.usercategory], function(error, results, fields){
                     if(error) throw error;
                     console.log("leave inserted");
                    });
                             mysqlConnection.query('UPDATE availabilityStaff SET slot_1 = CONCAT(slot_1,",",?),slot_2 = CONCAT(slot_2,",",?),slot_3 = CONCAT(slot_3,",",?), slot_4 = CONCAT(slot_4,",",?),slot_5 = CONCAT(slot_5,",",?),slot_6 = CONCAT(slot_6,",",?),slot_7 = CONCAT(slot_7,",",?),slot_8 = CONCAT(slot_8,",",?),slot_9 = CONCAT(slot_9,",",?),slot_10 = CONCAT(slot_10,",",?),slot_11 = CONCAT(slot_11,",",?), slot_12 = CONCAT(slot_12,",",?),slot_13 = CONCAT(slot_13,",",?),slot_14 = CONCAT(slot_14,",",?),slot_15 = CONCAT(slot_15,",",?),slot_16 = CONCAT(slot_16,",",?),slot_17 = CONCAT(slot_17,",",?),slot_18 = CONCAT(slot_18,",",?),slot_19 = CONCAT(slot_19,",",?),slot_20 = CONCAT(slot_20,",",?),slot_21 = CONCAT(slot_21,",",?), slot_22 = CONCAT(slot_22,",",?),act_1 = CONCAT(act_1,",","OL"),act_2= CONCAT(act_2,",","OL"), act_3= CONCAT(act_3,",","OL"), act_4= CONCAT(act_4,",","OL"),act_5= CONCAT(act_5,",","OL"),act_6 = CONCAT(act_6,",","OL"),act_7 = CONCAT(act_7,",","OL"),act_8 = CONCAT(act_8,",","OL"),act_9 = CONCAT(act_9,",","OL"),act_10 = CONCAT(act_10,",","OL"),act_11 = CONCAT(act_11,",","OL"),act_12 = CONCAT(act_12,",","OL"),act_13 = CONCAT(act_13,",","OL"),act_14 = CONCAT(act_14,",","OL"),act_15 = CONCAT(act_15,",","OL"), act_16 = CONCAT(act_16,",","OL") ,act_17 = CONCAT(act_17,",","OL"),act_18= CONCAT(act_18,",","OL"),act_19= CONCAT(act_19,",","OL"),act_20= CONCAT(act_20,",","OL"),act_21= CONCAT(act_21,",","OL"),act_22= CONCAT(act_22,",","OL") WHERE type = "Comp" AND name = ? AND day = ?',
                             [tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh,req.body.name, day], 
                  function(error, results, fields){
                               if(error) throw error;
                               console.log("slots updated");
                            
                              });
                  
                            
                            
                            }
    
                        else if(i>=30){
                          var y = JSON.stringify(date1.getFullYear());
                        var m = JSON.stringify(date1.getMonth()+2);
                        var d = JSON.stringify(i-29);
                        var str="-";
                        var zero="0";
                        var tarikh="";
                        if(d<10){
                          if(m!=="10" || m!=="11" || m!=="12"){
                        
                            tarikh = y.concat(str).concat(zero).concat(m).concat(str).concat(zero).concat(d);
                           }
                           else{
                           tarikh = y.concat(str).concat(m).concat(str).concat(zero).concat(d);
                           }
    
    
                        }
                        else{
                          if(m!=="10" || m!=="11" || m!=="12"){
                        
                         tarikh = y.concat(str).concat(zero).concat(m).concat(str).concat(d);
                        }
                        else{
                        tarikh = y.concat(str).concat(m).concat(str).concat(d);
                        }
                        }
                        var t = new Date(tarikh);
                    var weekday = new Array(7);
                    weekday[0] = "Sunday";
                    weekday[1] = "Monday";
                    weekday[2] = "Tuesday";
                    weekday[3] = "Wednesday";
                    weekday[4] = "Thursday";
                    weekday[5] = "Friday";
                    weekday[6] = "Saturday";
                   
                    var day = weekday[t.getDay()];
                    mysqlConnection.query('INSERT INTO dailyAttendance (name,date,act_1,category)VALUES (?,?,?,?)',
                    [req.body.name,tarikh,req.body.type,req.body.usercategory], function(error, results, fields){
                     if(error) throw error;
                     console.log("leave inserted");
                    });
                        mysqlConnection.query('UPDATE availabilityStaff SET slot_1 = CONCAT(slot_1,",",?),slot_2 = CONCAT(slot_2,",",?),slot_3 = CONCAT(slot_3,",",?), slot_4 = CONCAT(slot_4,",",?),slot_5 = CONCAT(slot_5,",",?),slot_6 = CONCAT(slot_6,",",?),slot_7 = CONCAT(slot_7,",",?),slot_8 = CONCAT(slot_8,",",?),slot_9 = CONCAT(slot_9,",",?),slot_10 = CONCAT(slot_10,",",?),slot_11 = CONCAT(slot_11,",",?), slot_12 = CONCAT(slot_12,",",?),slot_13 = CONCAT(slot_13,",",?),slot_14 = CONCAT(slot_14,",",?),slot_15 = CONCAT(slot_15,",",?),slot_16 = CONCAT(slot_16,",",?),slot_17 = CONCAT(slot_17,",",?),slot_18 = CONCAT(slot_18,",",?),slot_19 = CONCAT(slot_19,",",?),slot_20 = CONCAT(slot_20,",",?),slot_21 = CONCAT(slot_21,",",?), slot_22 = CONCAT(slot_22,",",?),act_1 = CONCAT(act_1,",","OL"),act_2= CONCAT(act_2,",","OL"), act_3= CONCAT(act_3,",","OL"), act_4= CONCAT(act_4,",","OL"),act_5= CONCAT(act_5,",","OL"),act_6 = CONCAT(act_6,",","OL"),act_7 = CONCAT(act_7,",","OL"),act_8 = CONCAT(act_8,",","OL"),act_9 = CONCAT(act_9,",","OL"),act_10 = CONCAT(act_10,",","OL"),act_11 = CONCAT(act_11,",","OL"),act_12 = CONCAT(act_12,",","OL"),act_13 = CONCAT(act_13,",","OL"),act_14 = CONCAT(act_14,",","OL"),act_15 = CONCAT(act_15,",","OL"), act_16 = CONCAT(act_16,",","OL") ,act_17 = CONCAT(act_17,",","OL"),act_18= CONCAT(act_18,",","OL"),act_19= CONCAT(act_19,",","OL"),act_20= CONCAT(act_20,",","OL"),act_21= CONCAT(act_21,",","OL"),act_22= CONCAT(act_22,",","OL") WHERE type = "Comp" AND name = ? AND day = ?',
           [tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh,req.body.name, day], 
function(error, results, fields){
             if(error) throw error;
             console.log("slots updated");
          
            });

    
                        }



                    }
                     
                   }

              
                           
                  
              
                        })

//pengesahan permohonan keluar-approve
          app.post('/permohonankeluar_lulus',urlencodedParser,function(req,res){

           console.log(req.body.name);
           console.log(req.body.reason);
            
             mysqlConnection.query('DELETE FROM hourlyleave WHERE applydate= ? AND name=? AND leavetime=? AND entertime=? AND reason=? ', [req.body.date,req.body.name,req.body.start,req.body.finish,req.body.reason], function(error, results, fields){
              if(error) throw error;
              res.redirect('/head_pengesahanPermohonanKeluar#berjayalulus');
              console.log("leave deleted");
    
             });

             const output = `
             <p>${req.body.name},</p><br>               
             <p>Permohonan keluar anda telah diluluskan </p>
                             <h4>Butiran Permohonan:</h4>
                            <ul>  
                          <li>Tarikh Permohonan: ${req.body.date}</li>
                         <li>Masa keluar: ${req.body.start}</li>
                         <li>Masa masuk: ${req.body.finish}</li>
                         <li>Perkara: ${req.body.reason}</li>
                              
                             
                            `;
             
             // create reusable transporter object using the default SMTP transport
          let transporter = nodemailer.createTransport({
          service: 'gmail',
          //port: 587,
          //secure: false, // true for 465, false for other ports
          auth: {
          user: 'sksesystem@gmail.com', // generated ethereal user
          pass: 'fyp2020#'  // generated ethereal password
          },
          tls:{
          rejectUnauthorized:false
          }
          });
          
          // setup email data with unicode symbols
          let mailOptions = {
          from: '"Sistem Pengurusan Aktiviti" <sksesystem@gmail.com>', // sender address
          to: req.body.email, // list of receivers
          subject: 'Permohonan Keluar Telah Diluluskan', // Subject line
          text: 'Hello world?', // plain text body
          html: output // html body
          };
          
          // send mail with defined transport object
          transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
          return console.log(error);
          }
          console.log('Message sent: %s', info.messageId);   
          console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
          
          // res.render('contact', {msg:'Email has been sent'});
          });
 


             var start_ar = ["7:30", "8:00", "8:30", "9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", 
     "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"];

	 var finish_ar = ["8:00", "8:30", "9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", 
	 "16:00", "16:30", "17:00", "17:30", "18:00", "18:30"];

     var tarikh= new Date(req.body.date).toISOString().slice(0, 10);
     var tarikh2= new Date(req.body.date);
     var month = tarikh2.getMonth();
     var weekday = new Array(7);
	weekday[0] = "Sunday";
	weekday[1] = "Monday";
	weekday[2] = "Tuesday";
	weekday[3] = "Wednesday";
	weekday[4] = "Thursday";
	weekday[5] = "Friday";
	weekday[6] = "Saturday";
 
  var day = weekday[tarikh2.getDay()];
  var start=0,finish;
  
	  for (var i = 0; i < start_ar.length; i++)  { 
	      if((req.body.start===start_ar[i]))
          {  start = i+1;
          console.log(start);
          
          } //1
	      }

	  for (var i = 0; i < finish_ar.length; i++) {       
	      if((req.body.finish===finish_ar[i]))
	        { finish = i+1;} //22
        }
        console.log(req.body.start);
        console.log(start);
        console.log(finish);
       
        var range= finish-start;
        console.log(range);


        if(range==0){//0
     
           mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","HL") WHERE type = "Comp" AND name = ? AND day = ?',
          [start, start, tarikh, start,start, req.body.name, day], function(error, results, fields){
            if(error) throw error;
            console.log("slots updated");
  
           });

        }

        if(range==1){//1
       
           mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","HL"), act_? = CONCAT(act_?,",","HL") WHERE type = "Comp" AND name = ? AND day = ?',
           [start, start,tarikh,finish,finish, tarikh, start, start,finish,finish, req.body.name, day], function(error, results, fields){
             if(error) throw error;
             console.log("slots updated");
          
            });

        }
        if(range==2){//2
         
           mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?), slot_? = CONCAT(slot_?,",",?),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"), act_? = CONCAT(act_?,",","HL") WHERE type = "Comp" AND name = ? AND day = ?',
           [start, start,tarikh,start+1,start+1,tarikh,finish,finish, tarikh, start, start,start+1,start+1,finish,finish,req.body.name, day], function(error, results, fields){
             if(error) throw error;
             console.log("slots updated");
          
            });

        }
        if(range==3){//3
     
           mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?), slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"), act_? = CONCAT(act_?,",","HL")  WHERE type = "Comp" AND name = ? AND day = ?',
           [start, start,tarikh,start+1,start+1,tarikh,start+2,start+2,tarikh,finish,finish, tarikh, start,start,start+1,start+1,start+2,start+2, finish,finish, req.body.name, day], function(error, results, fields){
             if(error) throw error;
             console.log("slots updated");
          
            });

        }
        if(range==4){//4
      
           mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?), slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"), act_? = CONCAT(act_?,",","HL") WHERE type = "Comp" AND name = ? AND day = ?',
           [start, start,tarikh,start+1,start+1,tarikh,start+2,start+2,tarikh,start+3,start+3,tarikh,finish,finish, tarikh, start,start,start+1,start+1,start+2,start+2,start+3,start+3, finish,finish, req.body.name, day], function(error, results, fields){
             if(error) throw error;
             console.log("slots updated");
          
            });

        }

        if(range==5){//5
      
           mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?), slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"), act_? = CONCAT(act_?,",","HL") WHERE type = "Comp" AND name = ? AND day = ?',
           [start, start,tarikh,start+1,start+1,tarikh,start+2,start+2,tarikh,start+3,start+3,tarikh,start+4,start+4,tarikh,finish,finish, tarikh, start,start,start+1,start+1,start+2,start+2,start+3,start+3,start+4,start+4, finish,finish, req.body.name, day], function(error, results, fields){
             if(error) throw error;
             console.log("slots updated");
          
            });

        }
        if(range==6){//6
       
           mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?), slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"), act_? = CONCAT(act_?,",","HL") WHERE type = "Comp" AND name = ? AND day = ?',
           [start, start,tarikh,start+1,start+1,tarikh,start+2,start+2,tarikh,start+3,start+3,tarikh,start+4,start+4,tarikh,start+5,start+5,tarikh,finish,finish, tarikh, start,start,start+1,start+1,start+2,start+2,start+3,start+3,start+4,start+4,start+5,start+5,finish,finish, req.body.name, day], function(error, results, fields){
             if(error) throw error;
             console.log("slots updated");
          
            });

        }
        if(range==7){//7
      
           mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?), slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"), act_? = CONCAT(act_?,",","HL") WHERE type = "Comp" AND name = ? AND day = ?',
           [start, start,tarikh,start+1,start+1,tarikh,start+2,start+2,tarikh,start+3,start+3,tarikh,start+4,start+4,tarikh,start+5,start+5,tarikh,start+6,start+6,tarikh,finish,finish, tarikh, start,start,start+1,start+1,start+2,start+2,start+3,start+3,start+4,start+4,start+5,start+5,start+6,start+6, finish,finish, req.body.name, day], function(error, results, fields){
             if(error) throw error;
             console.log("slots updated");
          
            });

        }
        if(range==8){//8
    
           mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?), slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"), act_? = CONCAT(act_?,",","HL") WHERE type = "Comp" AND name = ? AND day = ?',
           [start,start,tarikh,start+1,start+1,tarikh,start+2,start+2,tarikh,start+3,start+3,tarikh,start+4,start+4,tarikh,start+5,start+5,tarikh,start+6,start+6,tarikh,start+7,start+7,tarikh,finish,finish, tarikh, start,start,start+1,start+1,start+2,start+2,start+3,start+3,start+4,start+4,start+5,start+5,start+6,start+6,start+7,start+7,finish,finish, req.body.name, day], function(error, results, fields){
             if(error) throw error;
             console.log("slots updated");
          
            });

        }
        if(range==9){//9
   
           mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?), slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"), act_? = CONCAT(act_?,",","HL")  WHERE type = "Comp" AND name = ? AND day = ?',
           [start, start,tarikh,start+1,start+1,tarikh,start+2,start+2,tarikh,start+3,start+3,tarikh,start+4,start+4,tarikh,start+5,start+5,tarikh,start+6,start+6,tarikh,start+7,start+7,tarikh,start+8,start+8,tarikh,finish,finish, tarikh, start,start,start+1,start+1,start+2,start+2,start+3,start+3,start+4,start+4,start+5,start+5,start+6,start+6,start+7,start+7,start+8,start+8, finish,finish, req.body.name, day], function(error, results, fields){
             if(error) throw error;
             console.log("slots updated");
          
            });

        }
        if(range==10){//10
     
           mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?), slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"), act_? = CONCAT(act_?,",","HL") , WHERE type = "Comp" AND name = ? AND day = ?',
           [start, start,tarikh,start+1,start+1,tarikh,start+2,start+2,tarikh,start+3,start+3,tarikh,start+4,start+4,tarikh,start+5,start+5,tarikh,start+6,start+6,tarikh,start+7,start+7,tarikh,start+8,start+8,tarikh,start+9,start+9,tarikh,finish,finish, tarikh, start,start,start+1,start+1,start+2,start+2,start+3,start+3,start+4,start+4,start+5,start+5,start+6,start+6,start+7,start+7,start+8,start+8,start+9,start+9, finish,finish,req.body.name, day], function(error, results, fields){
             if(error) throw error;
             console.log("slots updated");
          
            });

        }
        if(range==11){//11
      
           mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?), slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"), act_? = CONCAT(act_?,",","HL") , WHERE type = "Comp" AND name = ? AND day = ?',
           [start, start,tarikh,start+1,start+1,tarikh,start+2,start+2,tarikh,start+3,start+3,tarikh,start+4,start+4,tarikh,start+5,start+5,tarikh,start+6,start+6,tarikh,start+7,start+7,tarikh,start+8,start+8,tarikh,start+9,start+9,tarikh,start+10,start+10,tarikh,finish,finish, tarikh, start,start,start+1,start+1,start+2,start+2,start+3,start+3,start+4,start+4,start+5,start+5,start+6,start+6,start+7,start+7,start+8,start+8,start+9,start+9,start+10,start+10,finish,finish, req.body.name, day], function(error, results, fields){
             if(error) throw error;
             console.log("slots updated");
          
            });

        }
        if(range==12){//12 ooo
     
           mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?), slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"), act_? = CONCAT(act_?,",","HL") ,act_? = CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"), WHERE type = "Comp" AND name = ? AND day = ?',
           [start, start,tarikh,start+1,start+1,tarikh,start+2,start+2,tarikh,start+3,start+3,tarikh,start+4,start+4,tarikh,start+5,start+5,tarikh,start+6,start+6,tarikh,start+7,start+7,tarikh,start+8,start+8,tarikh,start+9,start+9,tarikh,start+10,start+10,tarikh,start+11,start+11,tarikh,finish,finish, tarikh, start,start,start+1,start+1,start+2,start+2,start+3,start+3,start+4,start+4,start+5,start+5,start+6,start+6,start+7,start+7,start+8,start+8,start+9,start+9,start+10,start+10,start+11,start+11,finish,finish, req.body.name, day], function(error, results, fields){
             if(error) throw error;
             console.log("slots updated");
          
            });

        }

        if(range==13){//13
    
           mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?), slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"), act_? = CONCAT(act_?,",","HL") ,act_? = CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"), WHERE type = "Comp" AND name = ? AND day = ?',
           [start, start,tarikh,start+1,start+1,tarikh,start+2,start+2,tarikh,start+3,start+3,tarikh,start+4,start+4,tarikh,start+5,start+5,tarikh,start+6,start+6,tarikh,start+7,start+7,tarikh,start+8,start+8,tarikh,start+9,start+9,tarikh,start+10,start+10,tarikh,start+11,start+11,tarikh,start+12,start+12,tarikh,finish,finish, tarikh, start,start,start+1,start+1,start+2,start+2,start+3,start+3,start+4,start+4,start+5,start+5,start+6,start+6,start+7,start+7,start+8,start+8,start+9,start+9,start+10,start+10,start+11,start+11,start+12,start+12, finish,finish, req.body.name, day], function(error, results, fields){
             if(error) throw error;
             console.log("slots updated");
          
            });

        }
        if(range==14){//14
       
           mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?), slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),act_? = CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"), act_? = CONCAT(act_?,",","HL") ,act_? = CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL") WHERE type = "Comp" AND name = ? AND day = ?',
           [start, start,tarikh,start+1,start+1,tarikh,start+2,start+2,tarikh,start+3,start+3,tarikh,start+4,start+4,tarikh,start+5,start+5,tarikh,start+6,start+6,tarikh,start+7,start+7,tarikh,start+8,start+8,tarikh,start+9,start+9,tarikh,start+10,start+10,tarikh,start+11,start+11,tarikh,start+12,start+12,tarikh,start+13,start+13,tarikh,finish,finish, tarikh, start,start,start+1,start+1,start+2,start+2,start+3,start+3,start+4,start+4,start+5,start+5,start+6,start+6,start+7,start+7,start+8,start+8,start+9,start+9,start+10,start+10,start+11,start+11,start+12,start+12,start+13,start+13,finish,finish, req.body.name, day], function(error, results, fields){
             if(error) throw error;
             console.log("slots updated");
          
            });

        }
        if(range==15){//15
       
           mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?), slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),act_? = CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"), act_? = CONCAT(act_?,",","HL") ,act_? = CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL")WHERE type = "Comp" AND name = ? AND day = ?',
           [start, start,tarikh,start+1,start+1,tarikh,start+2,start+2,tarikh,start+3,start+3,tarikh,start+4,start+4,tarikh,start+5,start+5,tarikh,start+6,start+6,tarikh,start+7,start+7,tarikh,start+8,start+8,tarikh,start+9,start+9,tarikh,start+10,start+10,tarikh,start+11,start+11,tarikh,start+12,start+12,tarikh,start+13,start+13,tarikh,start+14,start+14,tarikh,finish,finish, tarikh, start,start,start+1,start+1,start+2,start+2,start+3,start+3,start+4,start+4,start+5,start+5,start+6,start+6,start+7,start+7,start+8,start+8,start+9,start+9,start+10,start+10,start+11,start+11,start+12,start+12,start+13,start+13,start+14,start+14,finish,finish, req.body.name, day], function(error, results, fields){
             if(error) throw error;
             console.log("slots updated");
          
            });

        }
        if(range==16){//16
   
           mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?), slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"), act_? = CONCAT(act_?,",","HL") ,act_? = CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL") WHERE type = "Comp" AND name = ? AND day = ?',
           [start, start,tarikh,start+1,start+1,tarikh,start+2,start+2,tarikh,start+3,start+3,tarikh,start+4,start+4,tarikh,start+5,start+5,tarikh,start+6,start+6,tarikh,start+7,start+7,tarikh,start+8,start+8,tarikh,start+9,start+9,tarikh,start+10,start+10,tarikh,start+11,start+11,tarikh,start+12,start+12,tarikh,start+13,start+13,tarikh,start+14,start+14,tarikh,start+15,start+15,tarikh,finish,finish, tarikh, start,start,start+1,start+1,start+2,start+2,start+3,start+3,start+4,start+4,start+5,start+5,start+6,start+6,start+7,start+7,start+8,start+8,start+9,start+9,start+10,start+10,start+11,start+11,start+12,start+12,start+13,start+13,start+14,start+14,start+15,start+15,finish,finish, req.body.name, day], function(error, results, fields){
             if(error) throw error;
             console.log("slots updated");
          
            });

        }
        if(range==17){//17
       
           mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?), slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),act_? = CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"), act_? = CONCAT(act_?,",","HL") ,act_? = CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL") ,act_?= CONCAT(act_?,",","HL")  WHERE type = "Comp" AND name = ? AND day = ?',
           [start, start,tarikh,start+1,start+1,tarikh,start+2,start+2,tarikh,start+3,start+3,tarikh,start+4,start+4,tarikh,start+5,start+5,tarikh,start+6,start+6,tarikh,start+7,start+7,tarikh,start+8,start+8,tarikh,start+9,start+9,tarikh,start+10,start+10,tarikh,start+11,start+11,tarikh,start+12,start+12,tarikh,start+13,start+13,tarikh,start+14,start+14,tarikh,start+15,start+15,tarikh,start+16,start+16,tarikh,finish,finish, tarikh, start,start,start+1,start+1,start+2,start+2,start+3,start+3,start+4,start+4,start+5,start+5,start+6,start+6,start+7,start+7,start+8,start+8,start+9,start+9,start+10,start+10,start+11,start+11,start+12,start+12,start+13,start+13,start+14,start+14,start+15,start+15,start+16,start+16,finish,finish, req.body.name, day], function(error, results, fields){
             if(error) throw error;
             console.log("slots updated");
          
            });

        }
        if(range==18){//18
        
           mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?), slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),act_? = CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"), act_? = CONCAT(act_?,",","HL") ,act_? = CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL") ,act_?= CONCAT(act_?,",","HL")  WHERE type = "Comp" AND name = ? AND day = ?',
           [start, start,tarikh,start+1,start+1,tarikh,start+2,start+2,tarikh,start+3,start+3,tarikh,start+4,start+4,tarikh,start+5,start+5,tarikh,start+6,start+6,tarikh,start+7,start+7,tarikh,start+8,start+8,tarikh,start+9,start+9,tarikh,start+10,start+10,tarikh,start+11,start+11,tarikh,start+12,start+12,tarikh,start+13,start+13,tarikh,start+14,start+14,tarikh,start+15,start+15,tarikh,start+16,start+16,tarikh,start+17,start+17,tarikh,finish,finish, tarikh, start,start,start+1,start+1,start+2,start+2,start+3,start+3,start+4,start+4,start+5,start+5,start+6,start+6,start+7,start+7,start+8,start+8,start+9,start+9,start+10,start+10,start+11,start+11,start+12,start+12,start+13,start+13,start+14,start+14,start+15,start+15,start+16,start+16,start+17,start+17,finish,finish, req.body.name, day], function(error, results, fields){
             if(error) throw error;
             console.log("slots updated");
          
            });

        }
        if(range==19){//19
        
           mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?), slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),act_? = CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"), act_?= CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"), act_? = CONCAT(act_?,",","HL") ,act_? = CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"),,act_?= CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL")  WHERE type = "Comp" AND name = ? AND day = ?',
           [start, start,tarikh,start+1,start+1,tarikh,start+2,start+2,tarikh,start+3,start+3,tarikh,start+4,start+4,tarikh,start+5,start+5,tarikh,start+6,start+6,tarikh,start+7,start+7,tarikh,start+8,start+8,tarikh,start+9,start+9,tarikh,start+10,start+10,tarikh,start+11,start+11,tarikh,start+12,start+12,tarikh,start+13,start+13,tarikh,start+14,start+14,tarikh,start+15,start+15,tarikh,start+16,start+16,tarikh,start+17,start+17,tarikh,start+18,start+18,tarikh,finish,finish, tarikh, start,start,start+1,start+1,start+2,start+2,start+3,start+3,start+4,start+4,start+5,start+5,start+6,start+6,start+7,start+7,start+8,start+8,start+9,start+9,start+10,start+10,start+11,start+11,start+12,start+12,start+13,start+13,start+14,start+14,start+15,start+15,start+16,start+16,start+17,start+17,start+18,start+18,finish,finish, req.body.name, day], function(error, results, fields){
             if(error) throw error;
             console.log("slots updated");
          
            });

        }
        if(range==20){//20
     
           mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?), slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),act_? = CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"), act_?= CONCAT(act_?,",","HL"), act_?= CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"), act_? = CONCAT(act_?,",","HL") ,act_? = CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"),,act_?= CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL")  WHERE type = "Comp" AND name = ? AND day = ?',
           [start, start,tarikh,start+1,start+1,tarikh,start+2,start+2,tarikh,start+3,start+3,tarikh,start+4,start+4,tarikh,start+5,start+5,tarikh,start+6,start+6,tarikh,start+7,start+7,tarikh,start+8,start+8,tarikh,start+9,start+9,tarikh,start+10,start+10,tarikh,start+11,start+11,tarikh,start+12,start+12,tarikh,start+13,start+13,tarikh,start+14,start+14,tarikh,start+15,start+15,tarikh,start+16,start+16,tarikh,start+17,start+17,tarikh,start+18,start+18,tarikh,start+19,start+19,tarikh,finish,finish, tarikh, start,start,start+1,start+1,start+2,start+2,start+3,start+3,start+4,start+4,start+5,start+5,start+6,start+6,start+7,start+7,start+8,start+8,start+9,start+9,start+10,start+10,start+11,start+11,start+12,start+12,start+13,start+13,start+14,start+14,start+15,start+15,start+16,start+16,start+17,start+17,start+18,start+18,start+19,start+19,finish,finish, req.body.name, day], function(error, results, fields){
             if(error) throw error;
             console.log("slots updated");
          
            });

        }
        if(range==21){//21
      
           mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?), slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),act_? = CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"), act_?= CONCAT(act_?,",","HL"), act_?= CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"), act_? = CONCAT(act_?,",","HL") ,act_? = CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"),,act_?= CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL") act_?= CONCAT(act_?,",","HL"), WHERE type = "Comp" AND name = ? AND day = ?',
           [start, start,tarikh,start+1,start+1,tarikh,start+2,start+2,tarikh,start+3,start+3,tarikh,start+4,start+4,tarikh,start+5,start+5,tarikh,start+6,start+6,tarikh,start+7,start+7,tarikh,start+8,start+8,tarikh,start+9,start+9,tarikh,start+10,start+10,tarikh,start+11,start+11,tarikh,start+12,start+12,tarikh,start+13,start+13,tarikh,start+14,start+14,tarikh,start+15,start+15,tarikh,start+16,start+16,tarikh,start+17,start+17,tarikh,start+18,start+18,tarikh,start+19,start+19,tarikh,start+20,start+20,tarikh,finish,finish, tarikh, start,start,start+1,start+1,start+2,start+2,start+3,start+3,start+4,start+4,start+5,start+5,start+6,start+6,start+7,start+7,start+8,start+8,start+9,start+9,start+10,start+10,start+11,start+11,start+12,start+12,start+13,start+13,start+14,start+14,start+15,start+15,start+16,start+16,start+17,start+17,start+18,start+18,start+19,start+19,start+20,start+20,finish,finish, req.body.name, day], function(error, results, fields){
             if(error) throw error;
             console.log("slots updated");
          
            });

        }

             


          })

//pengesahan permohonan keluar-reject
          app.post('/permohonankeluar_tolak/(:id)',urlencodedParser,function(req,res){
            let id = req.params.id;
            console.log(id);
            console.log(req.body.name);
            console.log(req.body.email);
            console.log(req.body.reason);
            console.log(req.body.rejectreason);
            mysqlConnection.query('DELETE FROM hourlyleave WHERE  name=? AND leavetime=? AND entertime=? AND reason=? ', [req.body.name,req.body.start,req.body.finish,req.body.reason], function(error, results, fields){
     if(error) throw error;
     res.redirect('/head_pengesahanPermohonanKeluar#berjayatolak');
     console.log("leave deleted");

    });
 
   const output = `
   <p>${req.body.name},</p><br>               
   <p>Permohonan keluar anda telah ditolak </p>
                   <h4>Butiran Permohonan:</h4>
                  <ul>  
                <li>Tarikh Permohonan: ${req.body.date}</li>
              <li>Perkara: ${req.body.reason}</li>
                     <li>Sebab Ditolak: ${req.body.rejectreason}</li>
                   
                  `;
   
   // create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
service: 'gmail',
//port: 587,
//secure: false, // true for 465, false for other ports
auth: {
user: 'sksesystem@gmail.com', // generated ethereal user
pass: 'fyp2020#'  // generated ethereal password
},
tls:{
rejectUnauthorized:false
}
});

// setup email data with unicode symbols
let mailOptions = {
from: '"Sistem Pengurusan Aktiviti" <sksesystem@gmail.com>', // sender address
to: req.body.email, // list of receivers
subject: 'Permohonan Keluar Tidak Diluluskan', // Subject line
text: 'Hello world?', // plain text body
html: output // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, (error, info) => {
if (error) {
return console.log(error);
}
console.log('Message sent: %s', info.messageId);   
console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

// res.render('contact', {msg:'Email has been sent'});
});
 


   
  })


                    


                                



 



           

      
//});