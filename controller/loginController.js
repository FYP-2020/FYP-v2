var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended:false});
var mysql = require('mysql');
var nodemailer = require('nodemailer');
var cron = require('node-cron');
const session = require('express-session');
const passport = require('passport');
//var LocalStrategy = require('passport-local').Strategy;
var MySQLStore = require('express-mysql-session')(session);

var mysqlConnection = mysql.createConnection({
host : 'db4free.net',
 user: 'amirahfatin',
 password: 'kyochonpedas',
  database: 'fyp2020',

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
 
mysqlConnection.query("select * from userprofile", function(err, rows){
  if(err) {
    throw err;
  } else {
    setValue(rows);
  }
});

function setValue(value) {
  users.push(value);
  console.log(users);
}

initializePassport(
  passport,
  name => users.find(user => user.name === name),
  id => users.find(user => user.user_id === id)
)


function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/keseluruhanProgresTugasan ')
  }
  next()
}

// passport.serializeUser(function (user,done) {
//   done(null.user.id);
// })

// passport.deserializeUser(function(id, done){
  
//     done(err,user);
// })
// passport.use(new LocalStrategy(//{
//   // usernameField: 'name',
//   //   passwordField: 'pass',
//   // passReqToCallback:true
//   // },
//  function (username,password,done) {
//    console.log("eeeeeee")
//    console.log(username);
//    console.log(password);
//   mysqlConnection.query('SELECT * FROM userprofile WHERE name = ? AND pass = ?', [username,password], function(error, results, fields) {
//     if (results.length > 0) {   
//         return done(null,{
//           user_id: results[0].user_id 

//         });  
        			
//     }else {
//         return done(null,false);  
//     }	
//     res.end();
//   });
   
//  })

// );


module.exports = (function(app){
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  store: sessionStore,
  saveUninitialized: true,
 // cookie: { secure: true }
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'))


  
  
  




  
//   var person = [];
  

//   function setUser(name) {
//     const userId = name
//   // console.log(name);
//    for(var i = 0; i<1; i++){
//       for(var j = 0; j<user_profile[i].length; j++){
//     if(user_profile[i][j].name === name){
//       person.push(user_profile[i][j]);
//      // console.log(user_profile[i][j].name);
//     }
//     }
//   }

//   console.log(person);
//    // console.log(person);
//     //next()
// }

  // function authUser(req, res, next) {
  //   // console.log(person);
  // if (person[0] == null) {
  // res.status(403)
  // return res.send('You need to sign in')
  // }
  
  //  next()
  // }

  // function authenticationMiddleware(){
  //   return (req, res, next) => {
  //     console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);
  
  //       if (req.isAuthenticated()) return next();
  //       res.redirect('/')
  //   }
  // }
  
  function authRole(role) {
  // console.log(person);

  return (req, res, next) => {
    console.log(person[0].role);
  if (req.user.role !== role) {
  res.status(401)
  return res.send('Not allowed')
  }
  
   next()
  }
  }


  
 

  // function setUser(name) {
  //   const user_fullname = mysqlConnection.query('SELECT fullname FROM userprofile WHERE name = ?', [name])
  //   req.user.fullname
  //   return user_fullname;
  //   }
  
  
  
  function canViewProject(user, project) {
  return (
  user.role === ROLE.ADMIN ||
  project.userId === user.id
  )
  }
  
  function scopedProjects(user, projects) {
  if (user.role === ROLE.ADMIN) return projects
  return projects.filter(project => project.userId === user.id) //return user project only
  }
  
  function canDeleteProject(user, project) {
  return project.userId === user.id
  }
  
  function setProject(req, res, next) {
  const projectId = parseInt(req.params.projectId)
  req.project = projects.find(project => project.id === projectId)
  if (req.project == null) {
  res.status(404)
  return res.send('Project not found')
  }
  next()
  }
  
  function authGetProject(req, res, next) {
  if (!canViewProject(req.user, req.project)) {
  res.status(401)
  return res.send('Not Allowed')
  }
  
   next()
  }
  
  function authDeleteProject(req, res, next) {
  if (!canDeleteProject(req.user, req.project)) {
  res.status(401)
  return res.send('Not Allowed')
  }
  
   next()
  }




  app.get('/logout', (req, res) => {
    person = [];
    res.render('login.ejs');
    })
   
  
app.get('/', (req, res) => {
  res.render('login.ejs');
  })
  app.get('/error', (req, res) => {
    res.render('error.ejs');
    })
//====================== E TUGASAN=========================================================================
  app.get('/keseluruhanProgresTugasan',checkAuthenticated,(req,res)=>{
    mysqlConnection.query('SELECT * FROM taskpoint ORDER BY peratus DESC' , function(error, results, fields) {
      res.render('keseluruhanProgresTugasan.ejs', {
        taskpoint : results
      });
     });
    
})

app.get('/agihanTugasanKeseluruhan',(req,res)=>{

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


  mysqlConnection.query('SELECT name,peratus,mesyuaratdetail,tinggidetail,sederhanadetail,rendahdetail FROM taskpoint WHERE month=? ORDER BY peratus DESC' , [bulan],function(error, results, fields) {
    res.render('agihanTugasanKeseluruhan.ejs', {
      taskpoint : results
    });
   });
  
})

app.get('/cuba',(req,res)=>{
 


  mysqlConnection.query('SELECT * FROM availabilityStaff' , function(error, results, fields) {
    res.render('backup.ejs', {
      availabilityStaff : results
    });
   });

  
  
})
 
  // app.post('/keseluruhanProgresTugasan',urlencodedParser,function(req,res) {
    
  //     mysqlConnection.query('SELECT * FROM userprofile WHERE name = ? AND pass = ?', [req.body.name,req.body.pass], function(error, results, fields) {
  //       if (results.length > 0) { 
  //         user_name = req.body.name;


  //         setUser(req.body.name); 
  //           res.redirect('keseluruhanProgresTugasan');      			
  //       }else {
  //         res.render('error');
  //       }	
  //       res.end();
  //     });
  // });

  app.post('/keseluruhanProgresTugasan',passport.authenticate('local',{
    successRedirect: '/keseluruhanProgresTugasan',
    failureRedirect:'/error'
  }));

  app.get('/admin_aturTugasan', function(req,res){
   
    mysqlConnection.query('SELECT * FROM userprofile  '  , function(error, results, fields) {
     res.render('completeprofile.ejs', {
       userprofile : results
     });
    }); });

    

      //save tasks to db=====================================================================
       app.post('/pengurusanTugas',urlencodedParser,function(req,res){
        
         var name = JSON.stringify(req.body.names);
         var name2 = name.replace("[",""); 
         var name3 = name2.replace("]","");
         var search = '"';
         var replaceWith ='';
         var name4 = name3.split(search).join(replaceWith);
         var arr= name4.split(",");
          
         //save to task details and points (analyse workload)=================================
         for(var i=0; i < arr.length ; i++ ){
       
          var obj = JSON.stringify(req.body);
          var jsonObj = JSON.parse(obj);
         // console.log(jsonObj.task);
         // console.log(jsonObj.peranan);

          var date= JSON.stringify(req.body.tarikh);
          var date2= date.split("-");
          var tarikh = date2[1];
         // console.log(tarikh);
         
          var d = new Date(jsonObj.tarikh)
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
            
          if(jsonObj.peranan==="Penganjur" || jsonObj.peranan==="Pencatat Minit Mesyuarat" ){// meeting

           

            mysqlConnection.query('UPDATE taskpoint SET mesyuarat = CASE WHEN mesyuarat < 10 THEN mesyuarat +2 ELSE mesyuarat END,peratus = CASE WHEN mesyuarat < 10 THEN peratus +2 ELSE peratus END,mesyuaratdetail = CONCAT(mesyuaratdetail,",",?)WHERE NAME=? AND MONTH =?', [req.body.Tajuk,arr[i],month], function(error, results, fields){
              if(error) throw error;
              console.log("1 meeting point inserted");
              console.log("1 meeting detail inserted");
              console.log("total points updated");
             });
           
              mysqlConnection.query('UPDATE availabilityStaff INNER JOIN taskpoint ON availabilityStaff.name = taskpoint.name SET availabilityStaff.percentage? = taskpoint.peratus WHERE taskpoint.name = ? AND taskpoint.month=?', [bulan,arr[i],bulan], function(error, results, fields){
               if(error) throw error;
               console.log("total points updated");
     
              });
           }

           else if (jsonObj.peranan==="Penyerah Tugas"){ // tasks
         
            if(jsonObj.tahap==="Tinggi"){
            

              mysqlConnection.query('UPDATE taskpoint SET tinggi = CASE WHEN tinggi < 15 THEN tinggi +3 ELSE tinggi END,tinggidetail = CONCAT(tinggidetail, "," ,?), peratus = CASE WHEN tinggi < 15 THEN peratus +3 ELSE peratus END WHERE NAME=? AND MONTH =? ', [req.body.Tajuk,arr[i],month], function(error, results, fields){
                 if(error) throw error;
                 console.log("1 hard point inserted");
                 console.log("1 hard detail inserted");
                 console.log("total points updated");
                });
              
                 mysqlConnection.query('UPDATE availabilityStaff INNER JOIN taskpoint ON availabilityStaff.name = taskpoint.name SET availabilityStaff.percentage? = taskpoint.peratus WHERE taskpoint.name = ? AND taskpoint.month=? ', [bulan,arr[i],bulan], function(error, results, fields){
                  if(error) throw error;
                  console.log("total points updated");
        
                 });
             }
  
            else if(jsonObj.tahap==="Sederhana"){
              
              mysqlConnection.query('UPDATE taskpoint SET sederhana = CASE WHEN sederhana < 10 THEN sederhana+2 ELSE sederhana END,sederhanadetail = CONCAT(sederhanadetail, "," ,?), peratus = CASE WHEN sederhana < 15 THEN peratus +2 ELSE peratus END WHERE NAME=? AND MONTH =?  ', [req.body.Tajuk,arr[i],month], function(error, results, fields){
                 if(error) throw error;
                 console.log("1 medium point inserted");
                 console.log("1 medium detail inserted");
                 console.log("total points updated");
                });
               
                 mysqlConnection.query('UPDATE availabilityStaff INNER JOIN taskpoint ON availabilityStaff.name = taskpoint.name SET availabilityStaff.percentage? = taskpoint.peratus WHERE taskpoint.name = ? AND taskpoint.month=? ', [bulan,arr[i],bulan], function(error, results, fields){
                  if(error) throw error;
                  console.log("total points updated");
        
                 });
             }
  
             else{
              
              mysqlConnection.query('UPDATE taskpoint SET rendah = CASE WHEN rendah <5 THEN rendah+1 ELSE rendah END,rendahdetail = CONCAT(rendahdetail, "," ,?), peratus = CASE WHEN rendah <5 THEN peratus +1 ELSE peratus END WHERE NAME=? AND MONTH =?  ', [req.body.Tajuk,arr[i],month], function(error, results, fields){
                 if(error) throw error;
                 console.log("1 easy point inserted");
                 console.log("1 easy detail inserted");
                 console.log("total points updated");
                });
                
                 mysqlConnection.query('UPDATE availabilityStaff INNER JOIN taskpoint ON availabilityStaff.name = taskpoint.name SET availabilityStaff.percentage? = taskpoint.peratus WHERE taskpoint.name = ? AND taskpoint.month=?', [bulan,arr[i],bulan], function(error, results, fields){
                  if(error) throw error;
                  console.log("total points updated");
        
                 });
             
            }}

           
         }   });

        //save tasks to task mgmt (pengurusan tugas)======================================================
        //  let data = {task: req.body.task, tarikh:req.body.tarikh, from:req.body.from, to: req.body.to, Lokasi:req.body.Lokasi, Tajuk:req.body.Tajuk, Nota:req.body.Nota, tarikhakhir:req.body.tarikhakhir, tahap:req.body.tahap,Agenda:req.body.Agenda, names:name};
        
        //  let sql = "INSERT INTO tasksMgmt SET ?";
        //  mysqlConnection.query(sql , data, function(error, results) {
        //   if(error) throw error;
        //   console.log("1 document inserted");
        //   res.redirect('/pengurusanTugas');
        //  });
         
      
            

            

  app.get('/pengurusanTugas', function(req,res){
    mysqlConnection.query('SELECT * FROM tasksMgmt' , function(error, results, fields) {
    res.render('pengurusanTugas.ejs', {
   tasksMgmt : results
    });
       });
  });

  
  

  app.delete('/pengurusanTugas', (req, res) => {
    db.collection('tasksMgmt').deleteOne()
      .then(result => {
        console.log('Task deleted')
        res.json('Task deleted')
        res.render('pengurusanTugas.ejs', { tasksMgmt: results })
      })
      .catch(error => console.error(error))
  })

  app.get('/manageMeetingInvitation', function(req,res){
    mysqlConnection.query('SELECT * FROM userprofile' , function(error, results, fields) {
      res.render('manageMeetingInvitation.ejs', {
        userprofile : results
      });
     });
       });

   app.get('/viewMeetingInfo', function(req,res){
        mysqlConnection.query('SELECT * FROM meetingInfo' , function(error, results, fields) {
          res.render('viewMeetingInfo.ejs', {
            meetingInfo : results
          });
         });
           });
        
    app.get('/meetingInfo', function(req,res){
          mysqlConnection.query('SELECT * FROM tasksMgmt' , function(error, results, fields) {
            res.render('meetingInfo.ejs', {
              tasksMgmt : results
            });
           });
          });

          app.get('/getdetails',(req,res)=>{
            mysqlConnection.query('SELECT * FROM userprofile' , function(error, results, fields) {
              res.render('completeprofile.ejs', {
                userprofile : results
              });
             });
              })
              app.get('/getInvitation',(req,res)=>{
                mysqlConnection.query('SELECT * FROM userprofile' , function(error, results, fields) {
                  res.render('manageMeetingInvitation.ejs', {
                    userprofile : results
                  });
                 });
              })
              app.get('/getMeetingInfo',(req,res)=>{
                mysqlConnection.query('SELECT * FROM tasksMgmt' , function(error, results, fields) {
                  res.render('meetingInfo.ejs', {
                 tasksMgmt : results
                  });
                     });
              })
              app.get('/getUserDetail',(req,res)=>{
                mysqlConnection.query('SELECT * FROM userprofile' , function(error, results, fields) {
                  res.render('meetingInfo.ejs', {
                    userprofile : results
                  });
                 });
              })
            
 //===============================E KEHADIRAN==========================================================              

          app.get('/keberadaanHarian',(req,res)=>{
           var today = new Date().toISOString().slice(0, 10);
           
           if(person[0].role==='Staff'){
            mysqlConnection.query('SELECT * FROM availabilityStaff'  , function(error, results, fields) {
              res.render('keberadaanHarian.ejs', {
                availabilityStaff : results
              });
             });
          }
          else{
            mysqlConnection.query('SELECT * FROM availabilityStaff'  , function(error, results, fields) {
              res.render('head_keberadaanHarian.ejs', {
                availabilityStaff : results
              });
             });

          }      
              })
          
          app.get('/head_pengesahanPermohonanKeluar',(req,res)=>{
         
            var date = new Date().toISOString().slice(0, 10);
             mysqlConnection.query('SELECT * FROM hourlyleave WHERE leavetime!="default" AND applydate=?'  ,[date] ,function(error, results, fields) {
              res.render('head_pengesahanPermohonanKeluar.ejs', {
                 h : results
                  });
                 });
                     
                  })

          app.get('/head_pengesahanPermohonanCuti',(req,res)=>{
            mysqlConnection.query('SELECT * FROM leaveApplication WHERE applydate!="default"' , function(error, results, fields) {
           res.render('head_pengesahanPermohonanCuti.ejs', {
                        leaveApplication : results
                         });
                        });                        
             })
     
          app.get('/permohonanKeluar',(req,res)=>{
         var name = person[0].fullname;
          mysqlConnection.query('SELECT * FROM userprofile WHERE Field="Headmaster"' , function(error, results, fields) {
            res.render('permohonanKeluar.ejs', {
              userprofile : results,
              name : name
            
            });
           });
                      
                      })
                        
          app.get('/maklumPermohonanCuti',(req,res)=>{
                        var name = person[0].fullname;
                        mysqlConnection.query('SELECT * FROM userprofile WHERE Field="Headmaster"' , function(error, results, fields) {
                          res.render('maklumPermohonanCuti.ejs', {
                            userprofile : results,
                            name:name
                          });
                         }); 
                                    })

          app.get('/maklumPenglibatan',(req,res)=>{
         var name = person[0].fullname;
         mysqlConnection.query('SELECT * FROM userprofile' , function(error, results, fields) {
        res.render('maklumPenglibatan.ejs', {
             userprofile : results,
             name:name                             

             });
            });
                                                  })


          app.post('/hourlyleave', urlencodedParser,function(req,res) {
          
                

         mysqlConnection.query('INSERT INTO hourlyleave(name,email,applydate,leavetime,entertime,reason) SELECT ?,email,?,?,?,? from hourlyleave WHERE name=? LIMIT 1',
         [req.body.name,req.body.applydate,req.body.leavetime,req.body.entertime,req.body.reason,req.body.name], function(error, results) {
          if(error) throw error;
          res.redirect('/hourlyleave#berjaya');
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
 
          app.post('/notifyleave', urlencodedParser,function(req,res) {
    
    var today = new Date().toISOString().slice(0, 10);
  //   var date = new Date(req.body.applydate);
  //   date.setDate(date.getDate() + 1);
  //  console.log(req.body.totalday);

  //  var hari = date.getDate();
  //  var bulan = date.getMonth()+1;
    // let data = {name:req.body.name,applydate:req.body.applydate,leaveCategory:req.body.category, leaveType:req.body.type, startDate:req.body.startdate,endDate:req.body.finishdate,totalday:req.body.totalday,remark:req.body.reason};
    // let sql = "INSERT INTO leaveApplication SET ?";
   mysqlConnection.query('INSERT INTO leaveApplication(name,email,applydate,leaveCategory,leaveType,startDate,endDate,totalday,remark) SELECT ?,email,?,?,?,?,?,?,?from leaveApplication WHERE name=? LIMIT 1',
    [req.body.name,req.body.applydate,req.body.category,req.body.type,req.body.startdate,req.body.finishdate,req.body.totalday,req.body.reason,req.body.name], function(error, results) {
    if(error) throw error;
    res.redirect('/maklumPermohonanCuti#berjaya');
    console.log("1 document inserted");
   // INSERT INTO leaveApplication(name,email,applydate,leaveCategory,leaveType,startDate,endDate,totalday,remark) SELECT ?,email from leaveApplication WHERE name=? LIMIT 1,?,?,?,?,?,?,?, [req,body.name,req.body.name,req.body.applydate,req.body.category,req.body.type,req.body.startdate,req.body.finishdate,req.body.totalday,req.body.reason]
    
   });
   var total=0;

   if (today===req.body.applydate){
     total = total+1;
   }
    const output = `              
   <p>Anda mempunyai ${total} permohonan cuti baharu untuk diluluskan melalui HRMIS. Sila semak HRMIS dan kemaskini kelulusan dalam sistem </p>
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
if(total>0){
cron.schedule('0 8 * * * ', () => {
transporter.sendMail(mailOptions, (error, info) => {
if (error) {
return console.log(error);
}
console.log('Message sent: %s', info.messageId);   
console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

// res.render('contact', {msg:'Email has been sent'});
});});
  }


})
   
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

                      //feb
                     
                    var y = JSON.stringify(date1.getFullYear());
                    var m = JSON.stringify(date1.getMonth()+1);
                    var d = JSON.stringify(i);
                    var str="-";
                    var tarikh = y.concat(str).concat(m).concat(str).concat(d);
                    mysqlConnection.query('INSERT INTO availabilityStaff (name,type,date,slot_1,act_1,slot_2,slot_3,slot_4,slot_5,slot_6,slot_7,slot_8,slot_9,slot_10,slot_11,slot_12,slot_13,slot_14,slot_15,slot_16,slot_17,slot_18,slot_19,slot_20,slot_21,slot_22,percentage1,percentage2,percentage3,percentage4,percentage5,percentage6,percentage7,percentage8,percentage9,percentage10,percentage11,percentage12) SELECT ?,"TLS",?,"TLS",?,"TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS",percentage1,percentage2,percentage3,percentage4,percentage5,percentage6,percentage7,percentage8,percentage9,percentage10,percentage11,percentage12 FROM availabilityStaff WHERE name=? LIMIT 1',
                         [req.body.name,tarikh,req.body.act,req.body.name], function(error, results, fields){
                          if(error) throw error;
                          console.log("leave inserted");
                
                         });
                         mysqlConnection.query('UPDATE availabilityStaff SET slot_1 = CONCAT(slot_1,",",?),slot_2 = CONCAT(slot_2,",",?),slot_3 = CONCAT(slot_3,",",?), slot_4 = CONCAT(slot_4,",",?),slot_5 = CONCAT(slot_5,",",?),slot_6 = CONCAT(slot_6,",",?),slot_7 = CONCAT(slot_7,",",?),slot_8 = CONCAT(slot_8,",",?),slot_9 = CONCAT(slot_9,",",?),slot_10 = CONCAT(slot_10,",",?),slot_11 = CONCAT(slot_11,",",?), slot_12 = CONCAT(slot_12,",",?),slot_13 = CONCAT(slot_13,",",?),slot_14 = CONCAT(slot_14,",",?),slot_15 = CONCAT(slot_15,",",?),slot_16 = CONCAT(slot_16,",",?),slot_17 = CONCAT(slot_17,",",?),slot_18 = CONCAT(slot_18,",",?),slot_19 = CONCAT(slot_19,",",?),slot_20 = CONCAT(slot_20,",",?),slot_21 = CONCAT(slot_21,",",?), slot_22 = CONCAT(slot_22,",",?),act_1 = CONCAT(act_1,",","TLS"),act_2= CONCAT(act_2,",","TLS"), act_3= CONCAT(act_3,",","TLS"), act_4= CONCAT(act_4,",","TLS"),act_5= CONCAT(act_5,",","TLS"),act_6 = CONCAT(act_6,",","TLS"),act_7 = CONCAT(act_7,",","TLS"),act_8 = CONCAT(act_8,",","TLS"),act_9 = CONCAT(act_9,",","TLS"),act_10 = CONCAT(act_10,",","TLS"),act_11 = CONCAT(act_11,",","TLS"),act_12 = CONCAT(act_12,",","TLS"),act_13 = CONCAT(act_13,",","TLS"),act_14 = CONCAT(act_14,",","TLS"),act_15 = CONCAT(act_15,",","TLS"), act_16 = CONCAT(act_16,",","TLS") ,act_17 = CONCAT(act_17,",","TLS"),act_18= CONCAT(act_18,",","TLS"),act_19= CONCAT(act_19,",","TLS"),act_20= CONCAT(act_20,",","TLS"),act_21= CONCAT(act_21,",","TLS"),act_22= CONCAT(act_22,",","TLS") WHERE type = "Comp" AND name = ? AND day = ?',
                         [tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh,req.body.name, day], 
                          function(error, results, fields){
                           if(error) throw error;
                          // consTLSe.log("slots updated");
                        
                          });

                        
                        res.redirect('/maklumPenglibatan#berjaya')
                        
                        }

                    else if(i>=32){
                      var y = JSON.stringify(date1.getFullYear());
                    var m = JSON.stringify(date1.getMonth()+2);
                    var d = JSON.stringify(i-31);
                    var str="-";
                    var tarikh = y.concat(str).concat(m).concat(str).concat(d);
                    mysqlConnection.query('INSERT INTO availabilityStaff (name,type,date,slot_1,act_1,slot_2,slot_3,slot_4,slot_5,slot_6,slot_7,slot_8,slot_9,slot_10,slot_11,slot_12,slot_13,slot_14,slot_15,slot_16,slot_17,slot_18,slot_19,slot_20,slot_21,slot_22,percentage1,percentage2,percentage3,percentage4,percentage5,percentage6,percentage7,percentage8,percentage9,percentage10,percentage11,percentage12) SELECT ?,"TLS",?,"TLS",?,"TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS",percentage1,percentage2,percentage3,percentage4,percentage5,percentage6,percentage7,percentage8,percentage9,percentage10,percentage11,percentage12 FROM availabilityStaff WHERE name=? LIMIT 1',
                         [req.body.name,tarikh,req.body.act,req.body.name], function(error, results, fields){
                          if(error) throw error;
                          console.log("leave inserted");
                
                         });
                         mysqlConnection.query('UPDATE availabilityStaff SET slot_1 = CONCAT(slot_1,",",?),slot_2 = CONCAT(slot_2,",",?),slot_3 = CONCAT(slot_3,",",?), slot_4 = CONCAT(slot_4,",",?),slot_5 = CONCAT(slot_5,",",?),slot_6 = CONCAT(slot_6,",",?),slot_7 = CONCAT(slot_7,",",?),slot_8 = CONCAT(slot_8,",",?),slot_9 = CONCAT(slot_9,",",?),slot_10 = CONCAT(slot_10,",",?),slot_11 = CONCAT(slot_11,",",?), slot_12 = CONCAT(slot_12,",",?),slot_13 = CONCAT(slot_13,",",?),slot_14 = CONCAT(slot_14,",",?),slot_15 = CONCAT(slot_15,",",?),slot_16 = CONCAT(slot_16,",",?),slot_17 = CONCAT(slot_17,",",?),slot_18 = CONCAT(slot_18,",",?),slot_19 = CONCAT(slot_19,",",?),slot_20 = CONCAT(slot_20,",",?),slot_21 = CONCAT(slot_21,",",?), slot_22 = CONCAT(slot_22,",",?),act_1 = CONCAT(act_1,",","TLS"),act_2= CONCAT(act_2,",","TLS"), act_3= CONCAT(act_3,",","TLS"), act_4= CONCAT(act_4,",","TLS"),act_5= CONCAT(act_5,",","TLS"),act_6 = CONCAT(act_6,",","TLS"),act_7 = CONCAT(act_7,",","TLS"),act_8 = CONCAT(act_8,",","TLS"),act_9 = CONCAT(act_9,",","TLS"),act_10 = CONCAT(act_10,",","TLS"),act_11 = CONCAT(act_11,",","TLS"),act_12 = CONCAT(act_12,",","TLS"),act_13 = CONCAT(act_13,",","TLS"),act_14 = CONCAT(act_14,",","TLS"),act_15 = CONCAT(act_15,",","TLS"), act_16 = CONCAT(act_16,",","TLS") ,act_17 = CONCAT(act_17,",","TLS"),act_18= CONCAT(act_18,",","TLS"),act_19= CONCAT(act_19,",","TLS"),act_20= CONCAT(act_20,",","TLS"),act_21= CONCAT(act_21,",","TLS"),act_22= CONCAT(act_22,",","TLS") WHERE type = "Comp" AND name = ? AND day = ?',
                                                  [tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh,req.body.name, day], 
                                                   function(error, results, fields){
                                                    if(error) throw error;
                                                    consTLSe.log("slots updated");
                                                 
                                                   });
                                                   res.redirect('/maklumPenglibatan#berjaya')

                    }}

                    else if(month==3 || month==5 || month==8 || month==10 ){
                     //april june sep nov
                     if(i<31){
                     
                    var y = JSON.stringify(date1.getFullYear());
                    var m = JSON.stringify(date1.getMonth()+1);
                    var d = JSON.stringify(i);
                    var str="-";
                    var tarikh = y.concat(str).concat(m).concat(str).concat(d);
                    mysqlConnection.query('INSERT INTO availabilityStaff (name,type,date,slot_1,act_1,slot_2,slot_3,slot_4,slot_5,slot_6,slot_7,slot_8,slot_9,slot_10,slot_11,slot_12,slot_13,slot_14,slot_15,slot_16,slot_17,slot_18,slot_19,slot_20,slot_21,slot_22,percentage1,percentage2,percentage3,percentage4,percentage5,percentage6,percentage7,percentage8,percentage9,percentage10,percentage11,percentage12) SELECT ?,"TLS",?,"TLS",?,"TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS",percentage1,percentage2,percentage3,percentage4,percentage5,percentage6,percentage7,percentage8,percentage9,percentage10,percentage11,percentage12 FROM availabilityStaff WHERE name=? LIMIT 1',
                    [req.body.name,tarikh,req.body.act,req.body.name], function(error, results, fields){
                     if(error) throw error;
                     console.log("leave inserted");
           
                    });
                    mysqlConnection.query('UPDATE availabilityStaff SET slot_1 = CONCAT(slot_1,",",?),slot_2 = CONCAT(slot_2,",",?),slot_3 = CONCAT(slot_3,",",?), slot_4 = CONCAT(slot_4,",",?),slot_5 = CONCAT(slot_5,",",?),slot_6 = CONCAT(slot_6,",",?),slot_7 = CONCAT(slot_7,",",?),slot_8 = CONCAT(slot_8,",",?),slot_9 = CONCAT(slot_9,",",?),slot_10 = CONCAT(slot_10,",",?),slot_11 = CONCAT(slot_11,",",?), slot_12 = CONCAT(slot_12,",",?),slot_13 = CONCAT(slot_13,",",?),slot_14 = CONCAT(slot_14,",",?),slot_15 = CONCAT(slot_15,",",?),slot_16 = CONCAT(slot_16,",",?),slot_17 = CONCAT(slot_17,",",?),slot_18 = CONCAT(slot_18,",",?),slot_19 = CONCAT(slot_19,",",?),slot_20 = CONCAT(slot_20,",",?),slot_21 = CONCAT(slot_21,",",?), slot_22 = CONCAT(slot_22,",",?),act_1 = CONCAT(act_1,",","TLS"),act_2= CONCAT(act_2,",","TLS"), act_3= CONCAT(act_3,",","TLS"), act_4= CONCAT(act_4,",","TLS"),act_5= CONCAT(act_5,",","TLS"),act_6 = CONCAT(act_6,",","TLS"),act_7 = CONCAT(act_7,",","TLS"),act_8 = CONCAT(act_8,",","TLS"),act_9 = CONCAT(act_9,",","TLS"),act_10 = CONCAT(act_10,",","TLS"),act_11 = CONCAT(act_11,",","TLS"),act_12 = CONCAT(act_12,",","TLS"),act_13 = CONCAT(act_13,",","TLS"),act_14 = CONCAT(act_14,",","TLS"),act_15 = CONCAT(act_15,",","TLS"), act_16 = CONCAT(act_16,",","TLS") ,act_17 = CONCAT(act_17,",","TLS"),act_18= CONCAT(act_18,",","TLS"),act_19= CONCAT(act_19,",","TLS"),act_20= CONCAT(act_20,",","TLS"),act_21= CONCAT(act_21,",","TLS"),act_22= CONCAT(act_22,",","TLS") WHERE type = "Comp" AND name = ? AND day = ?',
                    [tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh,req.body.name, day], 
                     function(error, results, fields){
                      if(error) throw error;
                      consTLSe.log("slots updated");
                   
                     });
                     res.redirect('/maklumPenglibatan#berjaya')
                  
                  }

                    else if(i>=31){
                      var y = JSON.stringify(date1.getFullYear());
                    var m = JSON.stringify(date1.getMonth()+2);
                    var d = JSON.stringify(i-30);
                    var str="-";
                    var tarikh = y.concat(str).concat(m).concat(str).concat(d);
                    mysqlConnection.query('INSERT INTO availabilityStaff (name,type,date,slot_1,act_1,slot_2,slot_3,slot_4,slot_5,slot_6,slot_7,slot_8,slot_9,slot_10,slot_11,slot_12,slot_13,slot_14,slot_15,slot_16,slot_17,slot_18,slot_19,slot_20,slot_21,slot_22,percentage1,percentage2,percentage3,percentage4,percentage5,percentage6,percentage7,percentage8,percentage9,percentage10,percentage11,percentage12) SELECT ?,"TLS",?,"TLS",?,"TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS",percentage1,percentage2,percentage3,percentage4,percentage5,percentage6,percentage7,percentage8,percentage9,percentage10,percentage11,percentage12 FROM availabilityStaff WHERE name=? LIMIT 1',
                    [req.body.name,tarikh,req.body.act,req.body.name], function(error, results, fields){
                     if(error) throw error;
                     console.log("leave inserted");
           
                    });
                    mysqlConnection.query('UPDATE availabilityStaff SET slot_1 = CONCAT(slot_1,",",?),slot_2 = CONCAT(slot_2,",",?),slot_3 = CONCAT(slot_3,",",?), slot_4 = CONCAT(slot_4,",",?),slot_5 = CONCAT(slot_5,",",?),slot_6 = CONCAT(slot_6,",",?),slot_7 = CONCAT(slot_7,",",?),slot_8 = CONCAT(slot_8,",",?),slot_9 = CONCAT(slot_9,",",?),slot_10 = CONCAT(slot_10,",",?),slot_11 = CONCAT(slot_11,",",?), slot_12 = CONCAT(slot_12,",",?),slot_13 = CONCAT(slot_13,",",?),slot_14 = CONCAT(slot_14,",",?),slot_15 = CONCAT(slot_15,",",?),slot_16 = CONCAT(slot_16,",",?),slot_17 = CONCAT(slot_17,",",?),slot_18 = CONCAT(slot_18,",",?),slot_19 = CONCAT(slot_19,",",?),slot_20 = CONCAT(slot_20,",",?),slot_21 = CONCAT(slot_21,",",?), slot_22 = CONCAT(slot_22,",",?),act_1 = CONCAT(act_1,",","TLS"),act_2= CONCAT(act_2,",","TLS"), act_3= CONCAT(act_3,",","TLS"), act_4= CONCAT(act_4,",","TLS"),act_5= CONCAT(act_5,",","TLS"),act_6 = CONCAT(act_6,",","TLS"),act_7 = CONCAT(act_7,",","TLS"),act_8 = CONCAT(act_8,",","TLS"),act_9 = CONCAT(act_9,",","TLS"),act_10 = CONCAT(act_10,",","TLS"),act_11 = CONCAT(act_11,",","TLS"),act_12 = CONCAT(act_12,",","TLS"),act_13 = CONCAT(act_13,",","TLS"),act_14 = CONCAT(act_14,",","TLS"),act_15 = CONCAT(act_15,",","TLS"), act_16 = CONCAT(act_16,",","TLS") ,act_17 = CONCAT(act_17,",","TLS"),act_18= CONCAT(act_18,",","TLS"),act_19= CONCAT(act_19,",","TLS"),act_20= CONCAT(act_20,",","TLS"),act_21= CONCAT(act_21,",","TLS"),act_22= CONCAT(act_22,",","TLS") WHERE type = "Comp" AND name = ? AND day = ?',
                                                  [tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh,req.body.name, day], 
                                                   function(error, results, fields){
                                                    if(error) throw error;
                                                    consTLSe.log("slots updated");
                                                 
                                                   });
                                                   res.redirect('/maklumPenglibatan#berjaya')

                    }


                    }
                    else{//feb
                      if(i<30){
                     
                        var y = JSON.stringify(date1.getFullYear());
                        var m = JSON.stringify(date1.getMonth()+1);
                        var d = JSON.stringify(i);
                        var str="-";
                        var tarikh = y.concat(str).concat(m).concat(str).concat(d);
                        mysqlConnection.query('INSERT INTO availabilityStaff (name,type,date,slot_1,act_1,slot_2,slot_3,slot_4,slot_5,slot_6,slot_7,slot_8,slot_9,slot_10,slot_11,slot_12,slot_13,slot_14,slot_15,slot_16,slot_17,slot_18,slot_19,slot_20,slot_21,slot_22,percentage1,percentage2,percentage3,percentage4,percentage5,percentage6,percentage7,percentage8,percentage9,percentage10,percentage11,percentage12) SELECT ?,"TLS",?,"TLS",?,"TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS",percentage1,percentage2,percentage3,percentage4,percentage5,percentage6,percentage7,percentage8,percentage9,percentage10,percentage11,percentage12 FROM availabilityStaff WHERE name=? LIMIT 1',
                        [req.body.name,tarikh,req.body.act,req.body.name], function(error, results, fields){
                         if(error) throw error;
                         console.log("leave inserted");
               
                        });
                        mysqlConnection.query('UPDATE availabilityStaff SET slot_1 = CONCAT(slot_1,",",?),slot_2 = CONCAT(slot_2,",",?),slot_3 = CONCAT(slot_3,",",?), slot_4 = CONCAT(slot_4,",",?),slot_5 = CONCAT(slot_5,",",?),slot_6 = CONCAT(slot_6,",",?),slot_7 = CONCAT(slot_7,",",?),slot_8 = CONCAT(slot_8,",",?),slot_9 = CONCAT(slot_9,",",?),slot_10 = CONCAT(slot_10,",",?),slot_11 = CONCAT(slot_11,",",?), slot_12 = CONCAT(slot_12,",",?),slot_13 = CONCAT(slot_13,",",?),slot_14 = CONCAT(slot_14,",",?),slot_15 = CONCAT(slot_15,",",?),slot_16 = CONCAT(slot_16,",",?),slot_17 = CONCAT(slot_17,",",?),slot_18 = CONCAT(slot_18,",",?),slot_19 = CONCAT(slot_19,",",?),slot_20 = CONCAT(slot_20,",",?),slot_21 = CONCAT(slot_21,",",?), slot_22 = CONCAT(slot_22,",",?),act_1 = CONCAT(act_1,",","TLS"),act_2= CONCAT(act_2,",","TLS"), act_3= CONCAT(act_3,",","TLS"), act_4= CONCAT(act_4,",","TLS"),act_5= CONCAT(act_5,",","TLS"),act_6 = CONCAT(act_6,",","TLS"),act_7 = CONCAT(act_7,",","TLS"),act_8 = CONCAT(act_8,",","TLS"),act_9 = CONCAT(act_9,",","TLS"),act_10 = CONCAT(act_10,",","TLS"),act_11 = CONCAT(act_11,",","TLS"),act_12 = CONCAT(act_12,",","TLS"),act_13 = CONCAT(act_13,",","TLS"),act_14 = CONCAT(act_14,",","TLS"),act_15 = CONCAT(act_15,",","TLS"), act_16 = CONCAT(act_16,",","TLS") ,act_17 = CONCAT(act_17,",","TLS"),act_18= CONCAT(act_18,",","TLS"),act_19= CONCAT(act_19,",","TLS"),act_20= CONCAT(act_20,",","TLS"),act_21= CONCAT(act_21,",","TLS"),act_22= CONCAT(act_22,",","TLS") WHERE type = "Comp" AND name = ? AND day = ?',
                        [tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh,req.body.name, day], 
                         function(error, results, fields){
                          if(error) throw error;
                          consTLSe.log("slots updated");
                       
                         });

                         res.redirect('/maklumPenglibatan#berjaya')
                      }
    
                        else if(i>=30){
                          var y = JSON.stringify(date1.getFullYear());
                        var m = JSON.stringify(date1.getMonth()+2);
                        var d = JSON.stringify(i-29);
                        var str="-";
                        var tarikh = y.concat(str).concat(m).concat(str).concat(d);
                        mysqlConnection.query('INSERT INTO availabilityStaff (name,type,date,slot_1,act_1,slot_2,slot_3,slot_4,slot_5,slot_6,slot_7,slot_8,slot_9,slot_10,slot_11,slot_12,slot_13,slot_14,slot_15,slot_16,slot_17,slot_18,slot_19,slot_20,slot_21,slot_22,percentage1,percentage2,percentage3,percentage4,percentage5,percentage6,percentage7,percentage8,percentage9,percentage10,percentage11,percentage12) SELECT ?,"TLS",?,"TLS",?,"TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS","TLS",percentage1,percentage2,percentage3,percentage4,percentage5,percentage6,percentage7,percentage8,percentage9,percentage10,percentage11,percentage12 FROM availabilityStaff WHERE name=? LIMIT 1',
                        [req.body.name,tarikh,req.body.act,req.body.name], function(error, results, fields){
                         if(error) throw error;
                         console.log("leave inserted");
               
                        });
                        mysqlConnection.query('UPDATE availabilityStaff SET slot_1 = CONCAT(slot_1,",",?),slot_2 = CONCAT(slot_2,",",?),slot_3 = CONCAT(slot_3,",",?), slot_4 = CONCAT(slot_4,",",?),slot_5 = CONCAT(slot_5,",",?),slot_6 = CONCAT(slot_6,",",?),slot_7 = CONCAT(slot_7,",",?),slot_8 = CONCAT(slot_8,",",?),slot_9 = CONCAT(slot_9,",",?),slot_10 = CONCAT(slot_10,",",?),slot_11 = CONCAT(slot_11,",",?), slot_12 = CONCAT(slot_12,",",?),slot_13 = CONCAT(slot_13,",",?),slot_14 = CONCAT(slot_14,",",?),slot_15 = CONCAT(slot_15,",",?),slot_16 = CONCAT(slot_16,",",?),slot_17 = CONCAT(slot_17,",",?),slot_18 = CONCAT(slot_18,",",?),slot_19 = CONCAT(slot_19,",",?),slot_20 = CONCAT(slot_20,",",?),slot_21 = CONCAT(slot_21,",",?), slot_22 = CONCAT(slot_22,",",?),act_1 = CONCAT(act_1,",","TLS"),act_2= CONCAT(act_2,",","TLS"), act_3= CONCAT(act_3,",","TLS"), act_4= CONCAT(act_4,",","TLS"),act_5= CONCAT(act_5,",","TLS"),act_6 = CONCAT(act_6,",","TLS"),act_7 = CONCAT(act_7,",","TLS"),act_8 = CONCAT(act_8,",","TLS"),act_9 = CONCAT(act_9,",","TLS"),act_10 = CONCAT(act_10,",","TLS"),act_11 = CONCAT(act_11,",","TLS"),act_12 = CONCAT(act_12,",","TLS"),act_13 = CONCAT(act_13,",","TLS"),act_14 = CONCAT(act_14,",","TLS"),act_15 = CONCAT(act_15,",","TLS"), act_16 = CONCAT(act_16,",","TLS") ,act_17 = CONCAT(act_17,",","TLS"),act_18= CONCAT(act_18,",","TLS"),act_19= CONCAT(act_19,",","TLS"),act_20= CONCAT(act_20,",","TLS"),act_21= CONCAT(act_21,",","TLS"),act_22= CONCAT(act_22,",","TLS") WHERE type = "Comp" AND name = ? AND day = ?',
                                                  [tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh,req.body.name, day], 
                                                   function(error, results, fields){
                                                    if(error) throw error;
                                                    consTLSe.log("slots updated");
                                                 
                                                   });
                                                   res.redirect('/maklumPenglibatan#berjaya')
    
                        }



                    }
                     
                   }

              
                           
              
              
                        })

          app.post('/updateapproval_reject',urlencodedParser,function(req,res){
                         console.log(req.body.name);
  //                         mysqlConnection.query('DELETE FROM leaveApplication WHERE applydate= ? AND name=? AND leaveCategory=? AND leaveType=? AND startDate=? AND endDate=?', [req.body.date,req.body.name,req.body.category,req.body.type,req.body.start,req.body.end], function(error, results, fields){
  //                           if(error) throw error;
  //                           res.redirect('/head_pengesahanPermohonanCuti#berjayatolak');
  //                           console.log("leave deleted");
                  
  //                          });
                        
  //                         const output = `
  //                         <p>${req.body.name},</p><br>               
  //                         <p>Permohonan cuti anda telah ditolak melalui HRMIS</p>
  //                                         <h4>Butiran Permohonan:</h4>
  //                                        <ul>  
  //                                      <li>Tarikh Permohonan: ${req.body.date}</li>
  //                                    <li>Jenis Cuti: ${req.body.type}</li>
  //                                           <li>Tarikh Mula: ${req.body.start}</li>
  //                                         <li>Tarikh Akhir: ${req.body.end}</li>
                                          
  //                                         </ul>
  //                                         <p>Sila semak HRMIS untuk keterangan lanjut</p>
  //                                        `;
                          
  //                         // create reusable transporter object using the default SMTP transport
  // let transporter = nodemailer.createTransport({
  //   service: 'gmail',
  //   //port: 587,
  //   //secure: false, // true for 465, false for other ports
  //   auth: {
  //       user: 'sksesystem@gmail.com', // generated ethereal user
  //       pass: 'fyp2020#'  // generated ethereal password
  //   },
  //   tls:{
  //     rejectUnauthorized:false
  //   }
  // });

  // //setup email data with unicode symbols
  // let mailOptions = {
  //     from: '"Sistem Pengurusan Aktiviti" <sksesystem@gmail.com>', // sender address
  //     to: req.body.email, // list of receivers
  //     subject: 'Permohonan Cuti Tidak Diluluskan', // Subject line
  //     text: 'Hello world?', // plain text body
  //     html: output // html body
  // };

  // // send mail with defined transport object
  // transporter.sendMail(mailOptions, (error, info) => {
  //     if (error) {
  //         return console.log(error);
  //     }
  //     console.log('Message sent: %s', info.messageId);   
  //     console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

  //    // res.render('contact', {msg:'Email has been sent'});
  // });
 //res.redirect('/head_pengesahanPermohonanCuti#berjayatolak')


                          
                         })

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
                       
              
//                    for(var i = num; i<=num+totaldays; i++){
//                       //console.log(i);
//                     //var tarikh = (date1.getFullYear())"-"date1.getMonth()"-"[i];
//                    if(month==0 || month==2 || month==4 || month==6 || month==7 || month==9 || month==11){
//                      //jan mac may jul aug oct dec
//                     if(i<32){

//                       //feb
                     
//                     var y = JSON.stringify(date1.getFullYear());
//                     var m = JSON.stringify(date1.getMonth()+1);
//                     var d = JSON.stringify(i);
//                     var str="-";
//                     var tarikh = y.concat(str).concat(m).concat(str).concat(d);
//                     var t = new Date(tarikh);
//                     var weekday = new Array(7);
//                     weekday[0] = "Sunday";
//                     weekday[1] = "Monday";
//                     weekday[2] = "Tuesday";
//                     weekday[3] = "Wednesday";
//                     weekday[4] = "Thursday";
//                     weekday[5] = "Friday";
//                     weekday[6] = "Saturday";
                   
//                     var day = weekday[t.getDay()];
//                     mysqlConnection.query('INSERT INTO availabilityStaff (name,type,date,slot_1,act_1,slot_2,slot_3,slot_4,slot_5,slot_6,slot_7,slot_8,slot_9,slot_10,slot_11,slot_12,slot_13,slot_14,slot_15,slot_16,slot_17,slot_18,slot_19,slot_20,slot_21,slot_22,percentage1,percentage2,percentage3,percentage4,percentage5,percentage6,percentage7,percentage8,percentage9,percentage10,percentage11,percentage12) SELECT ?,"OL",?,"OL",?,"OL","OL","OL","OL","OL","OL","OL","OL","OL","OL","OL","OL","OL","OL","OL","OL","OL","OL","OL","OL","OL",percentage1,percentage2,percentage3,percentage4,percentage5,percentage6,percentage7,percentage8,percentage9,percentage10,percentage11,percentage12 FROM availabilityStaff WHERE name=? LIMIT 1',
//                          [req.body.name,tarikh,req.body.type,req.body.name], function(error, results, fields){
//                           if(error) throw error;
//                           console.log("leave inserted");
                
//                          });
//                          mysqlConnection.query('UPDATE availabilityStaff SET slot_1 = CONCAT(slot_1,",",?),slot_2 = CONCAT(slot_2,",",?),slot_3 = CONCAT(slot_3,",",?), slot_4 = CONCAT(slot_4,",",?),slot_5 = CONCAT(slot_5,",",?),slot_6 = CONCAT(slot_6,",",?),slot_7 = CONCAT(slot_7,",",?),slot_8 = CONCAT(slot_8,",",?),slot_9 = CONCAT(slot_9,",",?),slot_10 = CONCAT(slot_10,",",?),slot_11 = CONCAT(slot_11,",",?), slot_12 = CONCAT(slot_12,",",?),slot_13 = CONCAT(slot_13,",",?),slot_14 = CONCAT(slot_14,",",?),slot_15 = CONCAT(slot_15,",",?),slot_16 = CONCAT(slot_16,",",?),slot_17 = CONCAT(slot_17,",",?),slot_18 = CONCAT(slot_18,",",?),slot_19 = CONCAT(slot_19,",",?),slot_20 = CONCAT(slot_20,",",?),slot_21 = CONCAT(slot_21,",",?), slot_22 = CONCAT(slot_22,",",?),act_1 = CONCAT(act_1,",","OL"),act_2= CONCAT(act_2,",","OL"), act_3= CONCAT(act_3,",","OL"), act_4= CONCAT(act_4,",","OL"),act_5= CONCAT(act_5,",","OL"),act_6 = CONCAT(act_6,",","OL"),act_7 = CONCAT(act_7,",","OL"),act_8 = CONCAT(act_8,",","OL"),act_9 = CONCAT(act_9,",","OL"),act_10 = CONCAT(act_10,",","OL"),act_11 = CONCAT(act_11,",","OL"),act_12 = CONCAT(act_12,",","OL"),act_13 = CONCAT(act_13,",","OL"),act_14 = CONCAT(act_14,",","OL"),act_15 = CONCAT(act_15,",","OL"), act_16 = CONCAT(act_16,",","OL") ,act_17 = CONCAT(act_17,",","OL"),act_18= CONCAT(act_18,",","OL"),act_19= CONCAT(act_19,",","OL"),act_20= CONCAT(act_20,",","OL"),act_21= CONCAT(act_21,",","OL"),act_22= CONCAT(act_22,",","OL") WHERE type = "Comp" AND name = ? AND day = ?',
//                          [tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh,req.body.name, day], 
//                           function(error, results, fields){
//                            if(error) throw error;
//                            console.log("slots updated");
                        
//                           });
              
                        
                        
                        
                        
//                         }

//                     else if(i>=32){
//                       var y = JSON.stringify(date1.getFullYear());
//                     var m = JSON.stringify(date1.getMonth()+2);
//                     var d = JSON.stringify(i-31);
//                     var str="-";
//                     var tarikh = y.concat(str).concat(m).concat(str).concat(d);
//                     var t = new Date(tarikh);
//                     var weekday = new Array(7);
//                     weekday[0] = "Sunday";
//                     weekday[1] = "Monday";
//                     weekday[2] = "Tuesday";
//                     weekday[3] = "Wednesday";
//                     weekday[4] = "Thursday";
//                     weekday[5] = "Friday";
//                     weekday[6] = "Saturday";
                   
//                     var day = weekday[t.getDay()];
//                     mysqlConnection.query('INSERT INTO availabilityStaff (name,type,date,slot_1,act_1,slot_2,slot_3,slot_4,slot_5,slot_6,slot_7,slot_8,slot_9,slot_10,slot_11,slot_12,slot_13,slot_14,slot_15,slot_16,slot_17,slot_18,slot_19,slot_20,slot_21,slot_22,percentage1,percentage2,percentage3,percentage4,percentage5,percentage6,percentage7,percentage8,percentage9,percentage10,percentage11,percentage12) SELECT ?,"OL",?,"OL",?,"OL","OL","OL","OL","OL","OL","OL","OL","OL","OL","OL","OL","OL","OL","OL","OL","OL","OL","OL","OL","OL",percentage1,percentage2,percentage3,percentage4,percentage5,percentage6,percentage7,percentage8,percentage9,percentage10,percentage11,percentage12 FROM availabilityStaff WHERE name=? LIMIT 1',
//                     [req.body.name,tarikh,req.body.type,req.body.name], function(error, results, fields){
//                      if(error) throw error;
//                      console.log("leave inserted");
           
//                     });
//                     mysqlConnection.query('UPDATE availabilityStaff SET slot_1 = CONCAT(slot_1,",",?),slot_2 = CONCAT(slot_2,",",?),slot_3 = CONCAT(slot_3,",",?), slot_4 = CONCAT(slot_4,",",?),slot_5 = CONCAT(slot_5,",",?),slot_6 = CONCAT(slot_6,",",?),slot_7 = CONCAT(slot_7,",",?),slot_8 = CONCAT(slot_8,",",?),slot_9 = CONCAT(slot_9,",",?),slot_10 = CONCAT(slot_10,",",?),slot_11 = CONCAT(slot_11,",",?), slot_12 = CONCAT(slot_12,",",?),slot_13 = CONCAT(slot_13,",",?),slot_14 = CONCAT(slot_14,",",?),slot_15 = CONCAT(slot_15,",",?),slot_16 = CONCAT(slot_16,",",?),slot_17 = CONCAT(slot_17,",",?),slot_18 = CONCAT(slot_18,",",?),slot_19 = CONCAT(slot_19,",",?),slot_20 = CONCAT(slot_20,",",?),slot_21 = CONCAT(slot_21,",",?), slot_22 = CONCAT(slot_22,",",?),act_1 = CONCAT(act_1,",","OL"),act_2= CONCAT(act_2,",","OL"), act_3= CONCAT(act_3,",","OL"), act_4= CONCAT(act_4,",","OL"),act_5= CONCAT(act_5,",","OL"),act_6 = CONCAT(act_6,",","OL"),act_7 = CONCAT(act_7,",","OL"),act_8 = CONCAT(act_8,",","OL"),act_9 = CONCAT(act_9,",","OL"),act_10 = CONCAT(act_10,",","OL"),act_11 = CONCAT(act_11,",","OL"),act_12 = CONCAT(act_12,",","OL"),act_13 = CONCAT(act_13,",","OL"),act_14 = CONCAT(act_14,",","OL"),act_15 = CONCAT(act_15,",","OL"), act_16 = CONCAT(act_16,",","OL") ,act_17 = CONCAT(act_17,",","OL"),act_18= CONCAT(act_18,",","OL"),act_19= CONCAT(act_19,",","OL"),act_20= CONCAT(act_20,",","OL"),act_21= CONCAT(act_21,",","OL"),act_22= CONCAT(act_22,",","OL") WHERE type = "Comp" AND name = ? AND day = ?',
//            [tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh,req.body.name, day], 
// function(error, results, fields){
//              if(error) throw error;
//              console.log("slots updated");
          
//             });


//                     }}

//                     else if(month==3 || month==5 || month==8 || month==10 ){
//                      //april june sep nov
//                      if(i<31){
                     
//                     var y = JSON.stringify(date1.getFullYear());
//                     var m = JSON.stringify(date1.getMonth()+1);
//                     var d = JSON.stringify(i);
//                     var str="-";
//                     var tarikh = y.concat(str).concat(m).concat(str).concat(d);
//                     var t = new Date(tarikh);
//                     var weekday = new Array(7);
//                     weekday[0] = "Sunday";
//                     weekday[1] = "Monday";
//                     weekday[2] = "Tuesday";
//                     weekday[3] = "Wednesday";
//                     weekday[4] = "Thursday";
//                     weekday[5] = "Friday";
//                     weekday[6] = "Saturday";
                   
//                     var day = weekday[t.getDay()];
//                     mysqlConnection.query('INSERT INTO availabilityStaff (name,type,date,slot_1,act_1,slot_2,slot_3,slot_4,slot_5,slot_6,slot_7,slot_8,slot_9,slot_10,slot_11,slot_12,slot_13,slot_14,slot_15,slot_16,slot_17,slot_18,slot_19,slot_20,slot_21,slot_22,percentage1,percentage2,percentage3,percentage4,percentage5,percentage6,percentage7,percentage8,percentage9,percentage10,percentage11,percentage12) SELECT ?,"OL",?,"OL",?,"OL","OL","OL","OL","OL","OL","OL","OL","OL","OL","OL","OL","OL","OL","OL","OL","OL","OL","OL","OL","OL",percentage1,percentage2,percentage3,percentage4,percentage5,percentage6,percentage7,percentage8,percentage9,percentage10,percentage11,percentage12 FROM availabilityStaff WHERE name=? LIMIT 1',
//                          [req.body.name,tarikh,req.body.type,req.body.name], function(error, results, fields){
//                           if(error) throw error;
//                           console.log("leave inserted");
                
//                          });
                        
//                          mysqlConnection.query('UPDATE availabilityStaff SET slot_1 = CONCAT(slot_1,",",?),slot_2 = CONCAT(slot_2,",",?),slot_3 = CONCAT(slot_3,",",?), slot_4 = CONCAT(slot_4,",",?),slot_5 = CONCAT(slot_5,",",?),slot_6 = CONCAT(slot_6,",",?),slot_7 = CONCAT(slot_7,",",?),slot_8 = CONCAT(slot_8,",",?),slot_9 = CONCAT(slot_9,",",?),slot_10 = CONCAT(slot_10,",",?),slot_11 = CONCAT(slot_11,",",?), slot_12 = CONCAT(slot_12,",",?),slot_13 = CONCAT(slot_13,",",?),slot_14 = CONCAT(slot_14,",",?),slot_15 = CONCAT(slot_15,",",?),slot_16 = CONCAT(slot_16,",",?),slot_17 = CONCAT(slot_17,",",?),slot_18 = CONCAT(slot_18,",",?),slot_19 = CONCAT(slot_19,",",?),slot_20 = CONCAT(slot_20,",",?),slot_21 = CONCAT(slot_21,",",?), slot_22 = CONCAT(slot_22,",",?),act_1 = CONCAT(act_1,",","OL"),act_2= CONCAT(act_2,",","OL"), act_3= CONCAT(act_3,",","OL"), act_4= CONCAT(act_4,",","OL"),act_5= CONCAT(act_5,",","OL"),act_6 = CONCAT(act_6,",","OL"),act_7 = CONCAT(act_7,",","OL"),act_8 = CONCAT(act_8,",","OL"),act_9 = CONCAT(act_9,",","OL"),act_10 = CONCAT(act_10,",","OL"),act_11 = CONCAT(act_11,",","OL"),act_12 = CONCAT(act_12,",","OL"),act_13 = CONCAT(act_13,",","OL"),act_14 = CONCAT(act_14,",","OL"),act_15 = CONCAT(act_15,",","OL"), act_16 = CONCAT(act_16,",","OL") ,act_17 = CONCAT(act_17,",","OL"),act_18= CONCAT(act_18,",","OL"),act_19= CONCAT(act_19,",","OL"),act_20= CONCAT(act_20,",","OL"),act_21= CONCAT(act_21,",","OL"),act_22= CONCAT(act_22,",","OL") WHERE type = "Comp" AND name = ? AND day = ?',
//                          [tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh,req.body.name, day], 
//               function(error, results, fields){
//                            if(error) throw error;
//                            console.log("slots updated");
                        
//                           });
              
                        
                        
//                         }

//                     else if(i>=31){
//                       var y = JSON.stringify(date1.getFullYear());
//                     var m = JSON.stringify(date1.getMonth()+2);
//                     var d = JSON.stringify(i-30);
//                     var str="-";
//                     var tarikh = y.concat(str).concat(m).concat(str).concat(d);
//                     var t = new Date(tarikh);
//                     var weekday = new Array(7);
//                     weekday[0] = "Sunday";
//                     weekday[1] = "Monday";
//                     weekday[2] = "Tuesday";
//                     weekday[3] = "Wednesday";
//                     weekday[4] = "Thursday";
//                     weekday[5] = "Friday";
//                     weekday[6] = "Saturday";
                   
//                     var day = weekday[t.getDay()];
//                     mysqlConnection.query('INSERT INTO availabilityStaff (name,type,date,slot_1,act_1,slot_2,slot_3,slot_4,slot_5,slot_6,slot_7,slot_8,slot_9,slot_10,slot_11,slot_12,slot_13,slot_14,slot_15,slot_16,slot_17,slot_18,slot_19,slot_20,slot_21,slot_22,percentage1,percentage2,percentage3,percentage4,percentage5,percentage6,percentage7,percentage8,percentage9,percentage10,percentage11,percentage12) SELECT ?,"OL",?,"OL",?,"OL","OL","OL","OL","OL","OL","OL","OL","OL","OL","OL","OL","OL","OL","OL","OL","OL","OL","OL","OL","OL",percentage1,percentage2,percentage3,percentage4,percentage5,percentage6,percentage7,percentage8,percentage9,percentage10,percentage11,percentage12 FROM availabilityStaff WHERE name=? LIMIT 1',
//                     [req.body.name,tarikh,req.body.type,req.body.name], function(error, results, fields){
//                      if(error) throw error;
//                      console.log("leave inserted");
           
//                     });
//                     mysqlConnection.query('UPDATE availabilityStaff SET slot_1 = CONCAT(slot_1,",",?),slot_2 = CONCAT(slot_2,",",?),slot_3 = CONCAT(slot_3,",",?), slot_4 = CONCAT(slot_4,",",?),slot_5 = CONCAT(slot_5,",",?),slot_6 = CONCAT(slot_6,",",?),slot_7 = CONCAT(slot_7,",",?),slot_8 = CONCAT(slot_8,",",?),slot_9 = CONCAT(slot_9,",",?),slot_10 = CONCAT(slot_10,",",?),slot_11 = CONCAT(slot_11,",",?), slot_12 = CONCAT(slot_12,",",?),slot_13 = CONCAT(slot_13,",",?),slot_14 = CONCAT(slot_14,",",?),slot_15 = CONCAT(slot_15,",",?),slot_16 = CONCAT(slot_16,",",?),slot_17 = CONCAT(slot_17,",",?),slot_18 = CONCAT(slot_18,",",?),slot_19 = CONCAT(slot_19,",",?),slot_20 = CONCAT(slot_20,",",?),slot_21 = CONCAT(slot_21,",",?), slot_22 = CONCAT(slot_22,",",?),act_1 = CONCAT(act_1,",","OL"),act_2= CONCAT(act_2,",","OL"), act_3= CONCAT(act_3,",","OL"), act_4= CONCAT(act_4,",","OL"),act_5= CONCAT(act_5,",","OL"),act_6 = CONCAT(act_6,",","OL"),act_7 = CONCAT(act_7,",","OL"),act_8 = CONCAT(act_8,",","OL"),act_9 = CONCAT(act_9,",","OL"),act_10 = CONCAT(act_10,",","OL"),act_11 = CONCAT(act_11,",","OL"),act_12 = CONCAT(act_12,",","OL"),act_13 = CONCAT(act_13,",","OL"),act_14 = CONCAT(act_14,",","OL"),act_15 = CONCAT(act_15,",","OL"), act_16 = CONCAT(act_16,",","OL") ,act_17 = CONCAT(act_17,",","OL"),act_18= CONCAT(act_18,",","OL"),act_19= CONCAT(act_19,",","OL"),act_20= CONCAT(act_20,",","OL"),act_21= CONCAT(act_21,",","OL"),act_22= CONCAT(act_22,",","OL") WHERE type = "Comp" AND name = ? AND day = ?',
//            [tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh,req.body.name, day], 
// function(error, results, fields){
//              if(error) throw error;
//              console.log("slots updated");
          
//             });


//                     }


//                     }
//                     else{//feb
//                       if(i<30){
                     
//                         var y = JSON.stringify(date1.getFullYear());
//                         var m = JSON.stringify(date1.getMonth()+1);
//                         var d = JSON.stringify(i);
//                         var str="-";
//                         var tarikh = y.concat(str).concat(m).concat(str).concat(d);
//                         var t = new Date(tarikh);
//                     var weekday = new Array(7);
//                     weekday[0] = "Sunday";
//                     weekday[1] = "Monday";
//                     weekday[2] = "Tuesday";
//                     weekday[3] = "Wednesday";
//                     weekday[4] = "Thursday";
//                     weekday[5] = "Friday";
//                     weekday[6] = "Saturday";
                   
//                     var day = weekday[t.getDay()];
//                         mysqlConnection.query('INSERT INTO availabilityStaff (name,type,date,slot_1,act_1,slot_2,slot_3,slot_4,slot_5,slot_6,slot_7,slot_8,slot_9,slot_10,slot_11,slot_12,slot_13,slot_14,slot_15,slot_16,slot_17,slot_18,slot_19,slot_20,slot_21,slot_22,percentage1,percentage2,percentage3,percentage4,percentage5,percentage6,percentage7,percentage8,percentage9,percentage10,percentage11,percentage12) SELECT ?,"OL",?,"OL",?,"OL","OL","OL","OL","OL","OL","OL","OL","OL","OL","OL","OL","OL","OL","OL","OL","OL","OL","OL","OL","OL",percentage1,percentage2,percentage3,percentage4,percentage5,percentage6,percentage7,percentage8,percentage9,percentage10,percentage11,percentage12 FROM availabilityStaff WHERE name=? LIMIT 1',
//                              [req.body.name,tarikh,req.body.type,req.body.name], function(error, results, fields){
//                               if(error) throw error;
//                               console.log("leave inserted");
                    
//                              });
//                              mysqlConnection.query('UPDATE availabilityStaff SET slot_1 = CONCAT(slot_1,",",?),slot_2 = CONCAT(slot_2,",",?),slot_3 = CONCAT(slot_3,",",?), slot_4 = CONCAT(slot_4,",",?),slot_5 = CONCAT(slot_5,",",?),slot_6 = CONCAT(slot_6,",",?),slot_7 = CONCAT(slot_7,",",?),slot_8 = CONCAT(slot_8,",",?),slot_9 = CONCAT(slot_9,",",?),slot_10 = CONCAT(slot_10,",",?),slot_11 = CONCAT(slot_11,",",?), slot_12 = CONCAT(slot_12,",",?),slot_13 = CONCAT(slot_13,",",?),slot_14 = CONCAT(slot_14,",",?),slot_15 = CONCAT(slot_15,",",?),slot_16 = CONCAT(slot_16,",",?),slot_17 = CONCAT(slot_17,",",?),slot_18 = CONCAT(slot_18,",",?),slot_19 = CONCAT(slot_19,",",?),slot_20 = CONCAT(slot_20,",",?),slot_21 = CONCAT(slot_21,",",?), slot_22 = CONCAT(slot_22,",",?),act_1 = CONCAT(act_1,",","OL"),act_2= CONCAT(act_2,",","OL"), act_3= CONCAT(act_3,",","OL"), act_4= CONCAT(act_4,",","OL"),act_5= CONCAT(act_5,",","OL"),act_6 = CONCAT(act_6,",","OL"),act_7 = CONCAT(act_7,",","OL"),act_8 = CONCAT(act_8,",","OL"),act_9 = CONCAT(act_9,",","OL"),act_10 = CONCAT(act_10,",","OL"),act_11 = CONCAT(act_11,",","OL"),act_12 = CONCAT(act_12,",","OL"),act_13 = CONCAT(act_13,",","OL"),act_14 = CONCAT(act_14,",","OL"),act_15 = CONCAT(act_15,",","OL"), act_16 = CONCAT(act_16,",","OL") ,act_17 = CONCAT(act_17,",","OL"),act_18= CONCAT(act_18,",","OL"),act_19= CONCAT(act_19,",","OL"),act_20= CONCAT(act_20,",","OL"),act_21= CONCAT(act_21,",","OL"),act_22= CONCAT(act_22,",","OL") WHERE type = "Comp" AND name = ? AND day = ?',
//                              [tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh,req.body.name, day], 
//                   function(error, results, fields){
//                                if(error) throw error;
//                                console.log("slots updated");
                            
//                               });
                  
                            
                            
//                             }
    
//                         else if(i>=30){
//                           var y = JSON.stringify(date1.getFullYear());
//                         var m = JSON.stringify(date1.getMonth()+2);
//                         var d = JSON.stringify(i-29);
//                         var str="-";
//                         var tarikh = y.concat(str).concat(m).concat(str).concat(d);
//                         var t = new Date(tarikh);
//                     var weekday = new Array(7);
//                     weekday[0] = "Sunday";
//                     weekday[1] = "Monday";
//                     weekday[2] = "Tuesday";
//                     weekday[3] = "Wednesday";
//                     weekday[4] = "Thursday";
//                     weekday[5] = "Friday";
//                     weekday[6] = "Saturday";
                   
//                     var day = weekday[t.getDay()];
//                         mysqlConnection.query('INSERT INTO availabilityStaff (name,type,date,slot_1,act_1,slot_2,slot_3,slot_4,slot_5,slot_6,slot_7,slot_8,slot_9,slot_10,slot_11,slot_12,slot_13,slot_14,slot_15,slot_16,slot_17,slot_18,slot_19,slot_20,slot_21,slot_22,percentage1,percentage2,percentage3,percentage4,percentage5,percentage6,percentage7,percentage8,percentage9,percentage10,percentage11,percentage12) SELECT ?,"OL",?,"OL",?,"OL","OL","OL","OL","OL","OL","OL","OL","OL","OL","OL","OL","OL","OL","OL","OL","OL","OL","OL","OL","OL",percentage1,percentage2,percentage3,percentage4,percentage5,percentage6,percentage7,percentage8,percentage9,percentage10,percentage11,percentage12 FROM availabilityStaff WHERE name=? LIMIT 1',
//                         [req.body.name,tarikh,req.body.type,req.body.name], function(error, results, fields){
//                          if(error) throw error;
//                          console.log("leave inserted");
               
//                         });
//                         mysqlConnection.query('UPDATE availabilityStaff SET slot_1 = CONCAT(slot_1,",",?),slot_2 = CONCAT(slot_2,",",?),slot_3 = CONCAT(slot_3,",",?), slot_4 = CONCAT(slot_4,",",?),slot_5 = CONCAT(slot_5,",",?),slot_6 = CONCAT(slot_6,",",?),slot_7 = CONCAT(slot_7,",",?),slot_8 = CONCAT(slot_8,",",?),slot_9 = CONCAT(slot_9,",",?),slot_10 = CONCAT(slot_10,",",?),slot_11 = CONCAT(slot_11,",",?), slot_12 = CONCAT(slot_12,",",?),slot_13 = CONCAT(slot_13,",",?),slot_14 = CONCAT(slot_14,",",?),slot_15 = CONCAT(slot_15,",",?),slot_16 = CONCAT(slot_16,",",?),slot_17 = CONCAT(slot_17,",",?),slot_18 = CONCAT(slot_18,",",?),slot_19 = CONCAT(slot_19,",",?),slot_20 = CONCAT(slot_20,",",?),slot_21 = CONCAT(slot_21,",",?), slot_22 = CONCAT(slot_22,",",?),act_1 = CONCAT(act_1,",","OL"),act_2= CONCAT(act_2,",","OL"), act_3= CONCAT(act_3,",","OL"), act_4= CONCAT(act_4,",","OL"),act_5= CONCAT(act_5,",","OL"),act_6 = CONCAT(act_6,",","OL"),act_7 = CONCAT(act_7,",","OL"),act_8 = CONCAT(act_8,",","OL"),act_9 = CONCAT(act_9,",","OL"),act_10 = CONCAT(act_10,",","OL"),act_11 = CONCAT(act_11,",","OL"),act_12 = CONCAT(act_12,",","OL"),act_13 = CONCAT(act_13,",","OL"),act_14 = CONCAT(act_14,",","OL"),act_15 = CONCAT(act_15,",","OL"), act_16 = CONCAT(act_16,",","OL") ,act_17 = CONCAT(act_17,",","OL"),act_18= CONCAT(act_18,",","OL"),act_19= CONCAT(act_19,",","OL"),act_20= CONCAT(act_20,",","OL"),act_21= CONCAT(act_21,",","OL"),act_22= CONCAT(act_22,",","OL") WHERE type = "Comp" AND name = ? AND day = ?',
//            [tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh, tarikh,req.body.name, day], 
// function(error, results, fields){
//              if(error) throw error;
//              console.log("slots updated");
          
//             });

    
//                         }



//                     }
                     
//                    }

              
                           
                  
              
                        })


          app.post('/permohonankeluar_lulus',urlencodedParser,function(req,res){

           console.log(req.body.name);
           console.log(req.body.reason);
            
          //   mysqlConnection.query('DELETE FROM hourlyleave WHERE applydate= ? AND name=? AND leavetime=? AND entertime=? AND reason=? ', [req.body.date,req.body.name,req.body.start,req.body.finish,req.body.reason], function(error, results, fields){
          //     if(error) throw error;
          //     res.redirect('/approve#berjayalulus');
          //     console.log("leave deleted");
    
          //    });

          //    const output = `
          //    <p>${req.body.name},</p><br>               
          //    <p>Permohonan keluar anda telah diluluskan </p>
          //                    <h4>Butiran Permohonan:</h4>
          //                   <ul>  
          //                 <li>Tarikh Permohonan: ${req.body.date}</li>
          //                <li>Masa keluar: ${req.body.start}</li>
          //                <li>Masa masuk: ${req.body.finish}</li>
          //                <li>Perkara: ${req.body.reason}</li>
                              
                             
          //                   `;
             
          //    // create reusable transporter object using the default SMTP transport
          // let transporter = nodemailer.createTransport({
          // service: 'gmail',
          // //port: 587,
          // //secure: false, // true for 465, false for other ports
          // auth: {
          // user: 'sksesystem@gmail.com', // generated ethereal user
          // pass: 'fyp2020#'  // generated ethereal password
          // },
          // tls:{
          // rejectUnauthorized:false
          // }
          // });
          
          // // setup email data with unicode symbols
          // let mailOptions = {
          // from: '"Sistem Pengurusan Aktiviti" <sksesystem@gmail.com>', // sender address
          // to: req.body.email, // list of receivers
          // subject: 'Permohonan Cuti Tidak Diluluskan', // Subject line
          // text: 'Hello world?', // plain text body
          // html: output // html body
          // };
          
          // // send mail with defined transport object
          // transporter.sendMail(mailOptions, (error, info) => {
          // if (error) {
          // return console.log(error);
          // }
          // console.log('Message sent: %s', info.messageId);   
          // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
          
          // // res.render('contact', {msg:'Email has been sent'});
          // });
 


  //            var start_ar = ["07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", 
  //    "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"];

	//  var finish_ar = ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", 
	//  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30"];

  //    var tarikh= new Date(req.body.date);
  //    var month = tarikh.getMonth();
  //    var weekday = new Array(7);
	// weekday[0] = "Sunday";
	// weekday[1] = "Monday";
	// weekday[2] = "Tuesday";
	// weekday[3] = "Wednesday";
	// weekday[4] = "Thursday";
	// weekday[5] = "Friday";
	// weekday[6] = "Saturday";
 
  // var day = weekday[tarikh.getDay()];
  // var start=0,finish;
  
	//   for (var i = 0; i < start_ar.length; i++)  { 
	//       if((req.body.start===start_ar[i]))
  //         {  start = i+1;
  //         console.log(start);
          
  //         } //1
	//       }

	//   for (var i = 0; i < finish_ar.length; i++) {       
	//       if((req.body.finish===finish_ar[i]))
	//         { finish = i+1;} //22
  //       }
  //       console.log(req.body.start);
  //       console.log(start);
  //       console.log(finish);
       
  //       var range= finish-start;
  //       console.log(range);


  //       var y = JSON.stringify(tarikh.getFullYear());
  //                   var m = JSON.stringify(tarikh.getMonth()+1);
  //                   var d = JSON.stringify(tarikh.getDate());
  //                   var str="-";
  //                   var tarikhstr = y.concat(str).concat(m).concat(str).concat(d);

  //       if(range==0){//0
  //         mysqlConnection.query('INSERT INTO availabilityStaff (id,name,type,date,slot_?,percentage1,percentage2,percentage3,percentage4,percentage5,percentage6,percentage7,percentage8,percentage9,percentage10,percentage11,percentage12) SELECT 0,?,"HL",?,"HL",percentage1,percentage2,percentage3,percentage4,percentage5,percentage6,percentage7,percentage8,percentage9,percentage10,percentage11,percentage12 FROM availabilityStaff WHERE name=? LIMIT 1',
  //          [start,req.body.name,req.body.date,req.body.name], function(error, results, fields){
  //           if(error) throw error;
  //           console.log("leave inserted");
  
  //          });
  //          mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","HL") WHERE type = "Comp" AND name = ? AND day = ?',
  //         [start, start, tarikhstr, start,start, req.body.name, day], function(error, results, fields){
  //           if(error) throw error;
  //           console.log("slots updated");
  
  //          });

  //       }

  //       if(range==1){//1
  //         mysqlConnection.query('INSERT INTO availabilityStaff (id,name,type,date,slot_?,slot_?,percentage1,percentage2,percentage3,percentage4,percentage5,percentage6,percentage7,percentage8,percentage9,percentage10,percentage11,percentage12) SELECT 0,?,"HL",?,"HL","HL",percentage1,percentage2,percentage3,percentage4,percentage5,percentage6,percentage7,percentage8,percentage9,percentage10,percentage11,percentage12 FROM availabilityStaff WHERE name=? LIMIT 1',
  //          [start,finish,req.body.name,req.body.date,req.body.name], function(error, results, fields){
  //           if(error) throw error;
  //           console.log("leave inserted");
  
  //          });
  //          mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?), act_? = CONCAT(act_?,",","HL"), act_? = CONCAT(act_?,",","HL") WHERE type = "Comp" AND name = ? AND day = ?',
  //          [start, start,tarikhstr,finish,finish, tarikhstr, start, start,finish,finish, req.body.name, day], function(error, results, fields){
  //            if(error) throw error;
  //            console.log("slots updated");
          
  //           });

  //       }
  //       if(range==2){//2
  //         mysqlConnection.query('INSERT INTO availabilityStaff (id,name,type,date,slot_?,slot_?,slot_?,percentage1,percentage2,percentage3,percentage4,percentage5,percentage6,percentage7,percentage8,percentage9,percentage10,percentage11,percentage12) SELECT 0,?,"HL",?,"HL","HL","HL",percentage1,percentage2,percentage3,percentage4,percentage5,percentage6,percentage7,percentage8,percentage9,percentage10,percentage11,percentage12 FROM availabilityStaff WHERE name=? LIMIT 1', 
  //         [start,start+1,finish,req.body.name,req.body.date,req.body.name], function(error, results, fields){
  //           if(error) throw error;
  //           console.log("leave inserted");
  
  //          });
  //          mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?), slot_? = CONCAT(slot_?,",",?),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"), act_? = CONCAT(act_?,",","HL") ,act_? = CONCAT(act_?,",","HL")  WHERE type = "Comp" AND name = ? AND day = ?',
  //          [start, start,tarikhstr,start+1,start+1,tarikhstr,finish,finish, tarikhstr, start, start,start+1,start+1,finish,finish,req.body.name, day], function(error, results, fields){
  //            if(error) throw error;
  //            console.log("slots updated");
          
  //           });

  //       }
  //       if(range==3){//3
  //         mysqlConnection.query('INSERT INTO availabilityStaff (id,name,type,date,slot_?,slot_?,slot_?,slot_?,percentage1,percentage2,percentage3,percentage4,percentage5,percentage6,percentage7,percentage8,percentage9,percentage10,percentage11,percentage12) SELECT 0,?,"HL",?,"HL","HL","HL","HL",percentage1,percentage2,percentage3,percentage4,percentage5,percentage6,percentage7,percentage8,percentage9,percentage10,percentage11,percentage12 FROM availabilityStaff WHERE name=? LIMIT 1',
  //          [start,start+1,start+2,finish,req.body.name,req.body.date,req.body.name], function(error, results, fields){
  //           if(error) throw error;
  //           console.log("leave inserted");
  
  //          });
  //          mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?), slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"), act_? = CONCAT(act_?,",","HL") ,act_? = CONCAT(act_?,",","HL")  WHERE type = "Comp" AND name = ? AND day = ?',
  //          [start, start,tarikhstr,start+1,start+1,tarikhstr,start+2,start+2,tarikhstr,finish,finish, tarikhstr, start,start,start+1,start+1,start+2,start+2, finish,finish, req.body.name, day], function(error, results, fields){
  //            if(error) throw error;
  //            console.log("slots updated");
          
  //           });

  //       }
  //       if(range==4){//4
  //         mysqlConnection.query('INSERT INTO availabilityStaff (id,name,type,date,slot_?,slot_?,slot_?,slot_?,slot_?,percentage1,percentage2,percentage3,percentage4,percentage5,percentage6,percentage7,percentage8,percentage9,percentage10,percentage11,percentage12) SELECT 0,?,"HL",?,"HL","HL","HL","HL","HL",percentage1,percentage2,percentage3,percentage4,percentage5,percentage6,percentage7,percentage8,percentage9,percentage10,percentage11,percentage12 FROM availabilityStaff WHERE name=? LIMIT 1', 
  //         [start,start+1,start+2,start+3,finish,req.body.name,req.body.date,req.body.name], function(error, results, fields){
  //           if(error) throw error;
  //           console.log("leave inserted");
  
  //          });
  //          mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?), slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"), act_? = CONCAT(act_?,",","HL") ,act_? = CONCAT(act_?,",","HL")WHERE type = "Comp" AND name = ? AND day = ?',
  //          [start, start,tarikhstr,start+1,start+1,tarikhstr,start+2,start+2,tarikhstr,start+3,start+3,tarikhstr,finish,finish, tarikhstr, start,start,start+1,start+1,start+2,start+2,start+3,start+3, finish,finish, req.body.name, day], function(error, results, fields){
  //            if(error) throw error;
  //            console.log("slots updated");
          
  //           });

  //       }

  //       if(range==5){//5
  //         mysqlConnection.query('INSERT INTO availabilityStaff (id,name,type,date,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,percentage1,percentage2,percentage3,percentage4,percentage5,percentage6,percentage7,percentage8,percentage9,percentage10,percentage11,percentage12) SELECT 0,?,"HL",?,"HL","HL","HL","HL","HL","HL",percentage1,percentage2,percentage3,percentage4,percentage5,percentage6,percentage7,percentage8,percentage9,percentage10,percentage11,percentage12 FROM availabilityStaff WHERE name=? LIMIT 1', [start,start+1,start+2,start+3,start+4,finish,req.body.name,req.body.date,req.body.name], function(error, results, fields){
  //           if(error) throw error;
  //           console.log("leave inserted");
  
  //          });
  //          mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?), slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"), act_? = CONCAT(act_?,",","HL") ,act_? = CONCAT(act_?,",","HL") WHERE type = "Comp" AND name = ? AND day = ?',
  //          [start, start,tarikhstr,start+1,start+1,tarikhstr,start+2,start+2,tarikhstr,start+3,start+3,tarikhstr,start+4,start+4,tarikhstr,finish,finish, tarikhstr, start,start,start+1,start+1,start+2,start+2,start+3,start+3,start+4,start+4, finish,finish, req.body.name, day], function(error, results, fields){
  //            if(error) throw error;
  //            console.log("slots updated");
          
  //           });

  //       }
  //       if(range==6){//6
  //         mysqlConnection.query('INSERT INTO availabilityStaff (id,name,type,date,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,percentage1,percentage2,percentage3,percentage4,percentage5,percentage6,percentage7,percentage8,percentage9,percentage10,percentage11,percentage12) SELECT 0,?,"HL",?,"HL","HL","HL","HL","HL","HL","HL",percentage1,percentage2,percentage3,percentage4,percentage5,percentage6,percentage7,percentage8,percentage9,percentage10,percentage11,percentage12 FROM availabilityStaff WHERE name=? LIMIT 1', [start,start+1,start+2,start+3,start+4,start+5,finish,req.body.name,req.body.date,req.body.name], function(error, results, fields){
  //           if(error) throw error;
  //           console.log("leave inserted");
  
  //          });
  //          mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?), slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"), act_? = CONCAT(act_?,",","HL") ,act_? = CONCAT(act_?,",","HL") WHERE type = "Comp" AND name = ? AND day = ?',
  //          [start, start,tarikhstr,start+1,start+1,tarikhstr,start+2,start+2,tarikhstr,start+3,start+3,tarikhstr,start+4,start+4,tarikhstr,start+5,start+5,tarikhstr,finish,finish, tarikhstr, start,start,start+1,start+1,start+2,start+2,start+3,start+3,start+4,start+4,start+5,start+5,finish,finish, req.body.name, day], function(error, results, fields){
  //            if(error) throw error;
  //            console.log("slots updated");
          
  //           });

  //       }
  //       if(range==7){//7
  //         mysqlConnection.query('INSERT INTO availabilityStaff (id,name,type,date,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,percentage1,percentage2,percentage3,percentage4,percentage5,percentage6,percentage7,percentage8,percentage9,percentage10,percentage11,percentage12) SELECT 0,?,"HL",?,"HL","HL","HL","HL","HL","HL","HL","HL",percentage1,percentage2,percentage3,percentage4,percentage5,percentage6,percentage7,percentage8,percentage9,percentage10,percentage11,percentage12 FROM availabilityStaff WHERE name=? LIMIT 1', [start,start+1,start+2,start+3,start+4,start+5,start+6,finish,req.body.name,req.body.date,req.body.name], function(error, results, fields){
  //           if(error) throw error;
  //           console.log("leave inserted");
  
  //          });
  //          mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?), slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"), act_? = CONCAT(act_?,",","HL") ,act_? = CONCAT(act_?,",","HL") WHERE type = "Comp" AND name = ? AND day = ?',
  //          [start, start,tarikhstr,start+1,start+1,tarikhstr,start+2,start+2,tarikhstr,start+3,start+3,tarikhstr,start+4,start+4,tarikhstr,start+5,start+5,tarikhstr,start+6,start+6,tarikhstr,finish,finish, tarikhstr, start,start,start+1,start+1,start+2,start+2,start+3,start+3,start+4,start+4,start+5,start+5,start+6,start+6, finish,finish, req.body.name, day], function(error, results, fields){
  //            if(error) throw error;
  //            console.log("slots updated");
          
  //           });

  //       }
  //       if(range==8){//8
  //         mysqlConnection.query('INSERT INTO availabilityStaff (id,name,type,date,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,percentage1,percentage2,percentage3,percentage4,percentage5,percentage6,percentage7,percentage8,percentage9,percentage10,percentage11,percentage12) SELECT 0,?,"HL",?,"HL","HL","HL","HL","HL","HL","HL","HL","HL",percentage1,percentage2,percentage3,percentage4,percentage5,percentage6,percentage7,percentage8,percentage9,percentage10,percentage11,percentage12 FROM availabilityStaff WHERE name=? LIMIT 1', [start,start+1,start+2,start+3,start+4,start+5,start+6,start+7,finish,req.body.name,req.body.date,req.body.name], function(error, results, fields){
  //           if(error) throw error;
  //           console.log("leave inserted");
  
  //          });
  //          mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?), slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"), act_? = CONCAT(act_?,",","HL") ,act_? = CONCAT(act_?,",","HL") WHERE type = "Comp" AND name = ? AND day = ?',
  //          [start, start,tarikhstr,start+1,start+1,tarikhstr,start+2,start+2,tarikhstr,start+3,start+3,tarikhstr,start+4,start+4,tarikhstr,start+5,start+5,tarikhstr,start+6,start+6,tarikhstr,start+7,start+7,tarikhstr,finish,finish, tarikhstr, start,start,start+1,start+1,start+2,start+2,start+3,start+3,start+4,start+4,start+5,start+5,start+6,start+6,start+7,start+7,finish,finish, req.body.name, day], function(error, results, fields){
  //            if(error) throw error;
  //            console.log("slots updated");
          
  //           });

  //       }
  //       if(range==9){//9
  //         mysqlConnection.query('INSERT INTO availabilityStaff (id,name,type,date,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,percentage1,percentage2,percentage3,percentage4,percentage5,percentage6,percentage7,percentage8,percentage9,percentage10,percentage11,percentage12) SELECT 0,?,"HL",?,"HL","HL","HL","HL","HL","HL","HL","HL","HL","HL",percentage1,percentage2,percentage3,percentage4,percentage5,percentage6,percentage7,percentage8,percentage9,percentage10,percentage11,percentage12 FROM availabilityStaff WHERE name=? LIMIT 1', [start,start+1,start+2,start+3,start+4,start+5,start+6,start+7,start+8,finish,req.body.name,req.body.date,req.body.name], function(error, results, fields){
  //           if(error) throw error;
  //           console.log("leave inserted");
  
  //          });
  //          mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?), slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"), act_? = CONCAT(act_?,",","HL") ,act_? = CONCAT(act_?,",","HL") WHERE type = "Comp" AND name = ? AND day = ?',
  //          [start, start,tarikhstr,start+1,start+1,tarikhstr,start+2,start+2,tarikhstr,start+3,start+3,tarikhstr,start+4,start+4,tarikhstr,start+5,start+5,tarikhstr,start+6,start+6,tarikhstr,start+7,start+7,tarikhstr,start+8,start+8,tarikhstr,finish,finish, tarikhstr, start,start,start+1,start+1,start+2,start+2,start+3,start+3,start+4,start+4,start+5,start+5,start+6,start+6,start+7,start+7,start+8,start+8, finish,finish, req.body.name, day], function(error, results, fields){
  //            if(error) throw error;
  //            console.log("slots updated");
          
  //           });

  //       }
  //       if(range==10){//10
  //         mysqlConnection.query('INSERT INTO availabilityStaff (id,name,type,date,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,percentage1,percentage2,percentage3,percentage4,percentage5,percentage6,percentage7,percentage8,percentage9,percentage10,percentage11,percentage12) SELECT 0,?,"HL",?,"HL","HL","HL","HL","HL","HL","HL","HL","HL","HL","HL",percentage1,percentage2,percentage3,percentage4,percentage5,percentage6,percentage7,percentage8,percentage9,percentage10,percentage11,percentage12 FROM availabilityStaff WHERE name=? LIMIT 1', [start,start+1,start+2,start+3,start+4,start+5,start+6,start+7,start+8,start+9,finish,req.body.name,req.body.date,req.body.name], function(error, results, fields){
  //           if(error) throw error;
  //           console.log("leave inserted");
  
  //          });
  //          mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?), slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"), act_? = CONCAT(act_?,",","HL") ,act_? = CONCAT(act_?,",","HL") WHERE type = "Comp" AND name = ? AND day = ?',
  //          [start, start,tarikhstr,start+1,start+1,tarikhstr,start+2,start+2,tarikhstr,start+3,start+3,tarikhstr,start+4,start+4,tarikhstr,start+5,start+5,tarikhstr,start+6,start+6,tarikhstr,start+7,start+7,tarikhstr,start+8,start+8,tarikhstr,start+9,start+9,tarikhstr,finish,finish, tarikhstr, start,start,start+1,start+1,start+2,start+2,start+3,start+3,start+4,start+4,start+5,start+5,start+6,start+6,start+7,start+7,start+8,start+8,start+9,start+9, finish,finish,req.body.name, day], function(error, results, fields){
  //            if(error) throw error;
  //            console.log("slots updated");
          
  //           });

  //       }
  //       if(range==11){//11
  //         mysqlConnection.query('INSERT INTO availabilityStaff (id,name,type,date,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,percentage1,percentage2,percentage3,percentage4,percentage5,percentage6,percentage7,percentage8,percentage9,percentage10,percentage11,percentage12) SELECT 0,?,"HL",?,"HL","HL","HL","HL","HL","HL","HL","HL","HL","HL","HL","HL",percentage1,percentage2,percentage3,percentage4,percentage5,percentage6,percentage7,percentage8,percentage9,percentage10,percentage11,percentage12 FROM availabilityStaff WHERE name=? LIMIT 1',
  //          [start,start+1,start+2,start+3,start+4,start+5,start+6,start+7,start+8,start+9,start+10,finish,req.body.name,req.body.date,req.body.name], function(error, results, fields){
  //           if(error) throw error;
  //           console.log("leave inserted");
  
  //          });
  //          mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?), slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"), act_? = CONCAT(act_?,",","HL") ,act_? = CONCAT(act_?,",","HL") WHERE type = "Comp" AND name = ? AND day = ?',
  //          [start, start,tarikhstr,start+1,start+1,tarikhstr,start+2,start+2,tarikhstr,start+3,start+3,tarikhstr,start+4,start+4,tarikhstr,start+5,start+5,tarikhstr,start+6,start+6,tarikhstr,start+7,start+7,tarikhstr,start+8,start+8,tarikhstr,start+9,start+9,tarikhstr,start+10,start+10,tarikhstr,finish,finish, tarikhstr, start,start,start+1,start+1,start+2,start+2,start+3,start+3,start+4,start+4,start+5,start+5,start+6,start+6,start+7,start+7,start+8,start+8,start+9,start+9,start+10,start+10,finish,finish, req.body.name, day], function(error, results, fields){
  //            if(error) throw error;
  //            console.log("slots updated");
          
  //           });

  //       }
  //       if(range==12){//12 ooo
  //         mysqlConnection.query('INSERT INTO availabilityStaff (id,name,type,date,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,percentage1,percentage2,percentage3,percentage4,percentage5,percentage6,percentage7,percentage8,percentage9,percentage10,percentage11,percentage12) SELECT 0,?,"HL",?,"HL","HL","HL","HL","HL","HL","HL","HL","HL","HL","HL","HL","HL",percentage1,percentage2,percentage3,percentage4,percentage5,percentage6,percentage7,percentage8,percentage9,percentage10,percentage11,percentage12 FROM availabilityStaff WHERE name=? LIMIT 1',
  //          [start,start+1,start+2,start+3,start+4,start+5,start+6,start+7,start+8,start+9,start+10,start+11,finish,req.body.name,req.body.date,req.body.name], function(error, results, fields){
  //           if(error) throw error;
  //           console.log("leave inserted");
  
  //          });
  //          mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?), slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"), act_? = CONCAT(act_?,",","HL") ,act_? = CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL") WHERE type = "Comp" AND name = ? AND day = ?',
  //          [start, start,tarikhstr,start+1,start+1,tarikhstr,start+2,start+2,tarikhstr,start+3,start+3,tarikhstr,start+4,start+4,tarikhstr,start+5,start+5,tarikhstr,start+6,start+6,tarikhstr,start+7,start+7,tarikhstr,start+8,start+8,tarikhstr,start+9,start+9,tarikhstr,start+10,start+10,tarikhstr,start+11,start+11,tarikhstr,finish,finish, tarikhstr, start,start,start+1,start+1,start+2,start+2,start+3,start+3,start+4,start+4,start+5,start+5,start+6,start+6,start+7,start+7,start+8,start+8,start+9,start+9,start+10,start+10,start+11,start+11,finish,finish, req.body.name, day], function(error, results, fields){
  //            if(error) throw error;
  //            console.log("slots updated");
          
  //           });

  //       }

  //       if(range==13){//13
  //         mysqlConnection.query('INSERT INTO availabilityStaff (id,name,type,date,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,percentage1,percentage2,percentage3,percentage4,percentage5,percentage6,percentage7,percentage8,percentage9,percentage10,percentage11,percentage12) SELECT 0,?,"HL",?,"HL","HL","HL","HL","HL","HL","HL","HL","HL","HL","HL","HL","HL","HL",percentage1,percentage2,percentage3,percentage4,percentage5,percentage6,percentage7,percentage8,percentage9,percentage10,percentage11,percentage12 FROM availabilityStaff WHERE name=? LIMIT 1',
  //          [start,start+1,start+2,start+3,start+4,start+5,start+6,start+7,start+8,start+9,start+10,start+11,start+12,finish,req.body.name,req.body.date,req.body.name], function(error, results, fields){
  //           if(error) throw error;
  //           console.log("leave inserted");
  
  //          });
  //          mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?), slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"), act_? = CONCAT(act_?,",","HL") ,act_? = CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL") WHERE type = "Comp" AND name = ? AND day = ?',
  //          [start, start,tarikhstr,start+1,start+1,tarikhstr,start+2,start+2,tarikhstr,start+3,start+3,tarikhstr,start+4,start+4,tarikhstr,start+5,start+5,tarikhstr,start+6,start+6,tarikhstr,start+7,start+7,tarikhstr,start+8,start+8,tarikhstr,start+9,start+9,tarikhstr,start+10,start+10,tarikhstr,start+11,start+11,tarikhstr,start+12,start+12,tarikhstr,finish,finish, tarikhstr, start,start,start+1,start+1,start+2,start+2,start+3,start+3,start+4,start+4,start+5,start+5,start+6,start+6,start+7,start+7,start+8,start+8,start+9,start+9,start+10,start+10,start+11,start+11,start+12,start+12, finish,finish, req.body.name, day], function(error, results, fields){
  //            if(error) throw error;
  //            console.log("slots updated");
          
  //           });

  //       }
  //       if(range==14){//14
  //         mysqlConnection.query('INSERT INTO availabilityStaff (id,name,type,date,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,percentage1,percentage2,percentage3,percentage4,percentage5,percentage6,percentage7,percentage8,percentage9,percentage10,percentage11,percentage12) SELECT 0,?,"HL",?,"HL","HL","HL","HL","HL","HL","HL","HL","HL","HL","HL","HL","HL","HL","HL",percentage1,percentage2,percentage3,percentage4,percentage5,percentage6,percentage7,percentage8,percentage9,percentage10,percentage11,percentage12 FROM availabilityStaff WHERE name=? LIMIT 1',
  //          [start,start+1,start+2,start+3,start+4,start+5,start+6,start+7,start+8,start+9,start+10,start+11,start+12,start+13,finish,req.body.name,req.body.date,req.body.name], function(error, results, fields){
  //           if(error) throw error;
  //           console.log("leave inserted");
  
  //          });
  //          mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?), slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),act_? = CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"), act_? = CONCAT(act_?,",","HL") ,act_? = CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL") WHERE type = "Comp" AND name = ? AND day = ?',
  //          [start, start,tarikhstr,start+1,start+1,tarikhstr,start+2,start+2,tarikhstr,start+3,start+3,tarikhstr,start+4,start+4,tarikhstr,start+5,start+5,tarikhstr,start+6,start+6,tarikhstr,start+7,start+7,tarikhstr,start+8,start+8,tarikhstr,start+9,start+9,tarikhstr,start+10,start+10,tarikhstr,start+11,start+11,tarikhstr,start+12,start+12,tarikhstr,start+13,start+13,tarikhstr,finish,finish, tarikhstr, start,start,start+1,start+1,start+2,start+2,start+3,start+3,start+4,start+4,start+5,start+5,start+6,start+6,start+7,start+7,start+8,start+8,start+9,start+9,start+10,start+10,start+11,start+11,start+12,start+12,start+13,start+13,finish,finish, req.body.name, day], function(error, results, fields){
  //            if(error) throw error;
  //            console.log("slots updated");
          
  //           });

  //       }
  //       if(range==15){//15
  //         mysqlConnection.query('INSERT INTO availabilityStaff (id,name,type,date,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,percentage1,percentage2,percentage3,percentage4,percentage5,percentage6,percentage7,percentage8,percentage9,percentage10,percentage11,percentage12) SELECT 0,?,"HL",?,"HL","HL","HL","HL","HL","HL","HL","HL","HL","HL","HL","HL","HL","HL","HL","HL",percentage1,percentage2,percentage3,percentage4,percentage5,percentage6,percentage7,percentage8,percentage9,percentage10,percentage11,percentage12 FROM availabilityStaff WHERE name=? LIMIT 1',
  //          [start,start+1,start+2,start+3,start+4,start+5,start+6,start+7,start+8,start+9,start+10,start+11,start+12,start+13,start+14,finish,req.body.name,req.body.date,req.body.name], function(error, results, fields){
  //           if(error) throw error;
  //           console.log("leave inserted");
  
  //          });
  //          mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?), slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),act_? = CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"), act_? = CONCAT(act_?,",","HL") ,act_? = CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL")WHERE type = "Comp" AND name = ? AND day = ?',
  //          [start, start,tarikhstr,start+1,start+1,tarikhstr,start+2,start+2,tarikhstr,start+3,start+3,tarikhstr,start+4,start+4,tarikhstr,start+5,start+5,tarikhstr,start+6,start+6,tarikhstr,start+7,start+7,tarikhstr,start+8,start+8,tarikhstr,start+9,start+9,tarikhstr,start+10,start+10,tarikhstr,start+11,start+11,tarikhstr,start+12,start+12,tarikhstr,start+13,start+13,tarikhstr,start+14,start+14,tarikhstr,finish,finish, tarikhstr, start,start,start+1,start+1,start+2,start+2,start+3,start+3,start+4,start+4,start+5,start+5,start+6,start+6,start+7,start+7,start+8,start+8,start+9,start+9,start+10,start+10,start+11,start+11,start+12,start+12,start+13,start+13,start+14,start+14,finish,finish, req.body.name, day], function(error, results, fields){
  //            if(error) throw error;
  //            console.log("slots updated");
          
  //           });

  //       }
  //       if(range==16){//16
  //         mysqlConnection.query('INSERT INTO availabilityStaff (id,name,type,date,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,percentage1,percentage2,percentage3,percentage4,percentage5,percentage6,percentage7,percentage8,percentage9,percentage10,percentage11,percentage12) SELECT 0,?,"HL",?,"HL","HL",?,"HL","HL","HL","HL","HL","HL","HL","HL","HL","HL","HL","HL","HL","HL","HL","HL",percentage1,percentage2,percentage3,percentage4,percentage5,percentage6,percentage7,percentage8,percentage9,percentage10,percentage11,percentage12 FROM availabilityStaff WHERE name=? LIMIT 1',
  //          [start,start+1,start+2,start+3,start+4,start+5,start+6,start+7,start+8,start+9,start+10,start+11,start+12,start+13,start+14,start+15,finish,req.body.name,req.body.date,req.body.name], function(error, results, fields){
  //           if(error) throw error;
  //           console.log("leave inserted");
  
  //          });
  //          mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?), slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),act_? = CONCAT(act_?,",","HL") WHERE type = "Comp" AND name = ? AND day = ?',
  //          [start, start,tarikhstr,start+1,start+1,tarikhstr,start+2,start+2,tarikhstr,start+3,start+3,tarikhstr,start+4,start+4,tarikhstr,start+5,start+5,tarikhstr,start+6,start+6,tarikhstr,start+7,start+7,tarikhstr,start+8,start+8,tarikhstr,start+9,start+9,tarikhstr,start+10,start+10,tarikhstr,start+11,start+11,tarikhstr,start+12,start+12,tarikhstr,start+13,start+13,tarikhstr,start+14,start+14,tarikhstr,start+15,start+15,tarikhstr,finish,finish, tarikhstr, start,start,start+1,start+1,start+2,start+2,start+3,start+3,start+4,start+4,start+5,start+5,start+6,start+6,start+7,start+7,start+8,start+8,start+9,start+9,start+10,start+10,start+11,start+11,start+12,start+12,start+13,start+13,start+14,start+14,start+15,start+15,finish,finish, req.body.name, day], function(error, results, fields){
  //            if(error) throw error;
  //            console.log("slots updated");
          
  //           });

  //       }
  //       if(range==17){//17
  //         mysqlConnection.query('INSERT INTO availabilityStaff (id,name,type,date,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,percentage1,percentage2,percentage3,percentage4,percentage5,percentage6,percentage7,percentage8,percentage9,percentage10,percentage11,percentage12) SELECT 0,?,"HL",?,"HL","HL","HL",?,"HL","HL","HL","HL","HL","HL","HL","HL","HL","HL","HL","HL","HL","HL","HL","HL",percentage1,percentage2,percentage3,percentage4,percentage5,percentage6,percentage7,percentage8,percentage9,percentage10,percentage11,percentage12 FROM availabilityStaff WHERE name=? LIMIT 1', 
  //         [start,start+1,start+2,start+3,start+4,start+5,start+6,start+7,start+8,start+9,start+10,start+11,start+12,start+13,start+14,start+15,start+16,finish,req.body.name,req.body.date,req.body.name], function(error, results, fields){
  //           if(error) throw error;
  //           console.log("leave inserted");
  
  //          });
  //          mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?), slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),act_? = CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"), act_? = CONCAT(act_?,",","HL") ,act_? = CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL") WHERE type = "Comp" AND name = ? AND day = ?',
  //          [start, start,tarikhstr,start+1,start+1,tarikhstr,start+2,start+2,tarikhstr,start+3,start+3,tarikhstr,start+4,start+4,tarikhstr,start+5,start+5,tarikhstr,start+6,start+6,tarikhstr,start+7,start+7,tarikhstr,start+8,start+8,tarikhstr,start+9,start+9,tarikhstr,start+10,start+10,tarikhstr,start+11,start+11,tarikhstr,start+12,start+12,tarikhstr,start+13,start+13,tarikhstr,start+14,start+14,tarikhstr,start+15,start+15,tarikhstr,start+16,start+16,tarikhstr,finish,finish, tarikhstr, start,start,start+1,start+1,start+2,start+2,start+3,start+3,start+4,start+4,start+5,start+5,start+6,start+6,start+7,start+7,start+8,start+8,start+9,start+9,start+10,start+10,start+11,start+11,start+12,start+12,start+13,start+13,start+14,start+14,start+15,start+15,start+16,start+16,finish,finish, req.body.name, day], function(error, results, fields){
  //            if(error) throw error;
  //            console.log("slots updated");
          
  //           });

  //       }
  //       if(range==18){//18
  //         mysqlConnection.query('INSERT INTO availabilityStaff (id,name,type,date,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,percentage1,percentage2,percentage3,percentage4,percentage5,percentage6,percentage7,percentage8,percentage9,percentage10,percentage11,percentage12) SELECT 0,?,"HL",?,"HL","HL","HL","HL",?,"HL","HL","HL","HL","HL","HL","HL","HL","HL","HL","HL","HL","HL","HL","HL","HL",percentage1,percentage2,percentage3,percentage4,percentage5,percentage6,percentage7,percentage8,percentage9,percentage10,percentage11,percentage12 FROM availabilityStaff WHERE name=? LIMIT 1', 
  //         [start,start+1,start+2,start+3,start+4,start+5,start+6,start+7,start+8,start+9,start+10,start+11,start+12,start+13,start+14,start+15,start+16,start+17,finish,req.body.name,req.body.date,req.body.name], function(error, results, fields){
  //           if(error) throw error;
  //           console.log("leave inserted");
  
  //          });
  //          mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?), slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),act_? = CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"), act_? = CONCAT(act_?,",","HL") ,act_? = CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"),,act_?= CONCAT(act_?,",","HL") WHERE type = "Comp" AND name = ? AND day = ?',
  //          [start, start,tarikhstr,start+1,start+1,tarikhstr,start+2,start+2,tarikhstr,start+3,start+3,tarikhstr,start+4,start+4,tarikhstr,start+5,start+5,tarikhstr,start+6,start+6,tarikhstr,start+7,start+7,tarikhstr,start+8,start+8,tarikhstr,start+9,start+9,tarikhstr,start+10,start+10,tarikhstr,start+11,start+11,tarikhstr,start+12,start+12,tarikhstr,start+13,start+13,tarikhstr,start+14,start+14,tarikhstr,start+15,start+15,tarikhstr,start+16,start+16,tarikhstr,start+17,start+17,tarikhstr,finish,finish, tarikhstr, start,start,start+1,start+1,start+2,start+2,start+3,start+3,start+4,start+4,start+5,start+5,start+6,start+6,start+7,start+7,start+8,start+8,start+9,start+9,start+10,start+10,start+11,start+11,start+12,start+12,start+13,start+13,start+14,start+14,start+15,start+15,start+16,start+16,start+17,start+17,finish,finish, req.body.name, day], function(error, results, fields){
  //            if(error) throw error;
  //            console.log("slots updated");
          
  //           });

  //       }
  //       if(range==19){//19
  //         mysqlConnection.query('INSERT INTO availabilityStaff (id,name,type,date,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,percentage1,percentage2,percentage3,percentage4,percentage5,percentage6,percentage7,percentage8,percentage9,percentage10,percentage11,percentage12) SELECT 0,?,"HL",?,"HL","HL","HL","HL","HL",?,"HL","HL","HL","HL","HL","HL","HL","HL","HL","HL","HL","HL","HL","HL","HL","HL",percentage1,percentage2,percentage3,percentage4,percentage5,percentage6,percentage7,percentage8,percentage9,percentage10,percentage11,percentage12 FROM availabilityStaff WHERE name=? LIMIT 1',
  //          [start,start+1,start+2,start+3,start+4,start+5,start+6,start+7,start+8,start+9,start+10,start+11,start+12,start+13,start+14,start+15,start+16,start+17,start+18,finish,req.body.name,req.body.date,req.body.name], function(error, results, fields){
  //           if(error) throw error;
  //           console.log("leave inserted");
  
  //          });
  //          mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?), slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),act_? = CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"), act_?= CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"), act_? = CONCAT(act_?,",","HL") ,act_? = CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"),,act_?= CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL") WHERE type = "Comp" AND name = ? AND day = ?',
  //          [start, start,tarikhstr,start+1,start+1,tarikhstr,start+2,start+2,tarikhstr,start+3,start+3,tarikhstr,start+4,start+4,tarikhstr,start+5,start+5,tarikhstr,start+6,start+6,tarikhstr,start+7,start+7,tarikhstr,start+8,start+8,tarikhstr,start+9,start+9,tarikhstr,start+10,start+10,tarikhstr,start+11,start+11,tarikhstr,start+12,start+12,tarikhstr,start+13,start+13,tarikhstr,start+14,start+14,tarikhstr,start+15,start+15,tarikhstr,start+16,start+16,tarikhstr,start+17,start+17,tarikhstr,start+18,start+18,tarikhstr,finish,finish, tarikhstr, start,start,start+1,start+1,start+2,start+2,start+3,start+3,start+4,start+4,start+5,start+5,start+6,start+6,start+7,start+7,start+8,start+8,start+9,start+9,start+10,start+10,start+11,start+11,start+12,start+12,start+13,start+13,start+14,start+14,start+15,start+15,start+16,start+16,start+17,start+17,start+18,start+18,finish,finish, req.body.name, day], function(error, results, fields){
  //            if(error) throw error;
  //            console.log("slots updated");
          
  //           });

  //       }
  //       if(range==20){//20
  //         mysqlConnection.query('INSERT INTO availabilityStaff (id,name,type,date,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,percentage1,percentage2,percentage3,percentage4,percentage5,percentage6,percentage7,percentage8,percentage9,percentage10,percentage11,percentage12) SELECT 0,?,"HL",?,"HL","HL","HL","HL","HL","HL",?,"HL","HL","HL","HL","HL","HL","HL","HL","HL","HL","HL","HL","HL","HL","HL","HL",percentage1,percentage2,percentage3,percentage4,percentage5,percentage6,percentage7,percentage8,percentage9,percentage10,percentage11,percentage12 FROM availabilityStaff WHERE name=? LIMIT 1',
  //          [start,start+1,start+2,start+3,start+4,start+5,start+6,start+7,start+8,start+9,start+10,start+11,start+12,start+13,start+14,start+15,start+16,start+17,start+18,start+19,finish,req.body.name,req.body.date,req.body.name], function(error, results, fields){
  //           if(error) throw error;
  //           console.log("leave inserted");
  
  //          });
  //          mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?), slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),act_? = CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"), act_?= CONCAT(act_?,",","HL"), act_?= CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"), act_? = CONCAT(act_?,",","HL") ,act_? = CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"),,act_?= CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL") WHERE type = "Comp" AND name = ? AND day = ?',
  //          [start, start,tarikhstr,start+1,start+1,tarikhstr,start+2,start+2,tarikhstr,start+3,start+3,tarikhstr,start+4,start+4,tarikhstr,start+5,start+5,tarikhstr,start+6,start+6,tarikhstr,start+7,start+7,tarikhstr,start+8,start+8,tarikhstr,start+9,start+9,tarikhstr,start+10,start+10,tarikhstr,start+11,start+11,tarikhstr,start+12,start+12,tarikhstr,start+13,start+13,tarikhstr,start+14,start+14,tarikhstr,start+15,start+15,tarikhstr,start+16,start+16,tarikhstr,start+17,start+17,tarikhstr,start+18,start+18,tarikhstr,start+19,start+19,tarikhstr,finish,finish, tarikhstr, start,start,start+1,start+1,start+2,start+2,start+3,start+3,start+4,start+4,start+5,start+5,start+6,start+6,start+7,start+7,start+8,start+8,start+9,start+9,start+10,start+10,start+11,start+11,start+12,start+12,start+13,start+13,start+14,start+14,start+15,start+15,start+16,start+16,start+17,start+17,start+18,start+18,start+19,start+19,finish,finish, req.body.name, day], function(error, results, fields){
  //            if(error) throw error;
  //            console.log("slots updated");
          
  //           });

  //       }
  //       if(range==21){//21
  //         mysqlConnection.query('INSERT INTO availabilityStaff (id,name,type,date,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,slot_?,percentage1,percentage2,percentage3,percentage4,percentage5,percentage6,percentage7,percentage8,percentage9,percentage10,percentage11,percentage12) SELECT 0,?,"HL",?,"HL","HL",?,"HL","HL","HL","HL","HL","HL",?,"HL","HL","HL","HL","HL","HL","HL","HL","HL","HL","HL","HL","HL","HL","HL","HL",percentage1,percentage2,percentage3,percentage4,percentage5,percentage6,percentage7,percentage8,percentage9,percentage10,percentage11,percentage12 FROM availabilityStaff WHERE name=? LIMIT 1',
  //          [start,start+1,start+2,start+3,start+4,start+5,start+6,start+7,start+8,start+9,start+10,start+11,start+12,start+13,start+14,start+15,start+16,start+17,start+18,start+19,start+20,finish,req.body.name,req.body.date,req.body.name], function(error, results, fields){
  //           if(error) throw error;
  //           console.log("leave inserted");
  
  //          });
  //          mysqlConnection.query('UPDATE availabilityStaff SET slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?), slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),slot_? = CONCAT(slot_?,",",?),act_? = CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"), act_?= CONCAT(act_?,",","HL"), act_?= CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"),act_? = CONCAT(act_?,",","HL"), act_? = CONCAT(act_?,",","HL") ,act_? = CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"),,act_?= CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL"),act_?= CONCAT(act_?,",","HL") WHERE type = "Comp" AND name = ? AND day = ?',
  //          [start, start,tarikhstr,start+1,start+1,tarikhstr,start+2,start+2,tarikhstr,start+3,start+3,tarikhstr,start+4,start+4,tarikhstr,start+5,start+5,tarikhstr,start+6,start+6,tarikhstr,start+7,start+7,tarikhstr,start+8,start+8,tarikhstr,start+9,start+9,tarikhstr,start+10,start+10,tarikhstr,start+11,start+11,tarikhstr,start+12,start+12,tarikhstr,start+13,start+13,tarikhstr,start+14,start+14,tarikhstr,start+15,start+15,tarikhstr,start+16,start+16,tarikhstr,start+17,start+17,tarikhstr,start+18,start+18,tarikhstr,start+19,start+19,tarikhstr,start+20,start+20,tarikhstr,finish,finish, tarikhstr, start,start,start+1,start+1,start+2,start+2,start+3,start+3,start+4,start+4,start+5,start+5,start+6,start+6,start+7,start+7,start+8,start+8,start+9,start+9,start+10,start+10,start+11,start+11,start+12,start+12,start+13,start+13,start+14,start+14,start+15,start+15,start+16,start+16,start+17,start+17,start+18,start+18,start+19,start+19,start+20,start+20,finish,finish, req.body.name, day], function(error, results, fields){
  //            if(error) throw error;
  //            console.log("slots updated");
          
  //           });

  //       }

             


          })


          app.post('/permohonankeluar_tolak/(:id)',urlencodedParser,function(req,res){
            let id = req.params.id;
            console.log(id);
            // console.log(req.body.name);
            // console.log(req.body.email);
            // console.log(req.body.reason);
            // console.log(req.body.rejectreason);
//             mysqlConnection.query('DELETE FROM hourlyleave WHERE  name=? AND leavetime=? AND entertime=? AND reason=? ', [req.body.name,req.body.start,req.body.finish,req.body.reason], function(error, results, fields){
//      if(error) throw error;
//      res.redirect('/approve#berjayatolak');
//      console.log("leave deleted");

//     });
 
//    const output = `
//    <p>${req.body.name},</p><br>               
//    <p>Permohonan keluar anda telah ditolak </p>
//                    <h4>Butiran Permohonan:</h4>
//                   <ul>  
//                 <li>Tarikh Permohonan: ${req.body.date}</li>
//               <li>Perkara: ${req.body.reason}</li>
//                      <li>Sebab Ditolak: ${req.body.rejectreason}</li>
                   
//                   `;
   
//    // create reusable transporter object using the default SMTP transport
// let transporter = nodemailer.createTransport({
// service: 'gmail',
// //port: 587,
// //secure: false, // true for 465, false for other ports
// auth: {
// user: 'sksesystem@gmail.com', // generated ethereal user
// pass: 'fyp2020#'  // generated ethereal password
// },
// tls:{
// rejectUnauthorized:false
// }
// });

// // setup email data with unicode symbols
// let mailOptions = {
// from: '"Sistem Pengurusan Aktiviti" <sksesystem@gmail.com>', // sender address
// to: req.body.email, // list of receivers
// subject: 'Permohonan Cuti Tidak Diluluskan', // Subject line
// text: 'Hello world?', // plain text body
// html: output // html body
// };

// // send mail with defined transport object
// transporter.sendMail(mailOptions, (error, info) => {
// if (error) {
// return console.log(error);
// }
// console.log('Message sent: %s', info.messageId);   
// console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

// // res.render('contact', {msg:'Email has been sent'});
// });
 


   
  })


                    


                                



 



           

      
});