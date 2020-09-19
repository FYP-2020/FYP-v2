var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended:false});
var mysql = require('mysql');
var mysqlConnection = mysql.createConnection({
host : 'db4free.net',
 user: 'amirahfatin',
 password: 'kyochonpedas',
  database: 'fyp2020',

});
////
//
mysqlConnection.connect((err) => {
  if (!err)
      console.log('DB connection succeeded.');
  else
      console.log('DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2));
});

module.exports = (function(app){
app.get('/', (req, res) => {
  res.render('login.ejs');
  })
//====================== E TUGASAN=========================================================================
  app.get('/test',(req,res)=>{
    mysqlConnection.query('SELECT * FROM taskpoint ORDER BY peratus DESC' , function(error, results, fields) {
      res.render('test.ejs', {
        taskpoint : results
      });
     });
    
})
 
  app.post('/test',urlencodedParser,function(req,res) {
    
      mysqlConnection.query('SELECT * FROM userprofile WHERE name = ? AND pass = ?', [req.body.name,req.body.pass], function(error, results, fields) {
        if (results.length > 0) {  
            res.redirect('test');      			
        }else {
          res.render('error');
        }	
        res.end();
      });
  });

  app.get('/completeprofile', function(req,res){
    mysqlConnection.query('SELECT * FROM userprofile' , function(error, results, fields) {
     res.render('completeprofile.ejs', {
       userprofile : results
     });
    });
       });

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
          console.log(jsonObj.task);
          console.log(jsonObj.peranan);

          if(jsonObj.peranan==="Penganjur" || jsonObj.peranan==="Pencatat Minit Mesyuarat" ){
            
            mysqlConnection.query('UPDATE taskdetail SET mesyuarat = CONCAT(mesyuarat, "," ,?) WHERE name = ? ', [req.body.Tajuk,arr[i]], function(error, results, fields){
             
             if(error) throw error;
             console.log("1 meeting detail inserted");
            });
            mysqlConnection.query('UPDATE taskpoint SET mesyuarat = mesyuarat+1 WHERE name = ? ', [arr[i]], function(error, results, fields){
               if(error) throw error;
               console.log("1 meeting point inserted");
     
              });
              mysqlConnection.query('UPDATE taskpoint SET peratus = peratus+1 WHERE name = ? ', [arr[i]], function(error, results, fields){
                if(error) throw error;
                console.log("total points updated");
      
               });
           }

           else if (jsonObj.peranan==="Penyerah Tugas"){

           if(jsonObj.task==="Luar Sekolah"){
            
            mysqlConnection.query('UPDATE taskdetail SET luar = CONCAT(luar, "," ,?) WHERE name = ? ', [req.body.Tajuk,arr[i]], function(error, results, fields){
             
             if(error) throw error;
             console.log("1 out school detail inserted");
            });
            mysqlConnection.query('UPDATE taskpoint SET luar = luar+1 WHERE name = ? ', [arr[i]], function(error, results, fields){
               if(error) throw error;
               console.log("1 out school point inserted");
     
     
              });
              mysqlConnection.query('UPDATE taskpoint SET peratus = peratus+3 WHERE name = ? ', [arr[i]], function(error, results, fields){
                if(error) throw error;
                console.log("total points updated");
      
               });
           }

           else if(jsonObj.task==="Tugasan Sekolah" || jsonObj.task=== "Tugasan Umum"){
            if(jsonObj.tahap==="Tinggi"){
            
              mysqlConnection.query('UPDATE taskdetail SET tinggi = CONCAT(tinggi, "," ,?) WHERE name = ? ', [req.body.Tajuk,arr[i]], function(error, results, fields){
               
               if(error) throw error;
               console.log("1 hard detail inserted");
              });
              mysqlConnection.query('UPDATE taskpoint SET tinggi = tinggi+1 WHERE name = ? ', [arr[i]], function(error, results, fields){
                 if(error) throw error;
                 console.log("1 hard point inserted");
       
       
                });
                mysqlConnection.query('UPDATE taskpoint SET peratus = peratus+3 WHERE name = ? ', [arr[i]], function(error, results, fields){
                  if(error) throw error;
                  console.log("total points updated");
        
                 });
             }
  
            else if(jsonObj.tahap==="Sederhana"){
              
              mysqlConnection.query('UPDATE taskdetail SET sederhana = CONCAT(sederhana, "," ,?) WHERE name = ? ', [req.body.Tajuk,arr[i]], function(error, results, fields){
               
               if(error) throw error;
               console.log("1 medium detail inserted");
              });
              mysqlConnection.query('UPDATE taskpoint SET sederhana = sederhana+1 WHERE name = ? ', [arr[i]], function(error, results, fields){
                 if(error) throw error;
                 console.log("1 medium point inserted");
       
       
                });
                mysqlConnection.query('UPDATE taskpoint SET peratus = peratus+2 WHERE name = ? ', [arr[i]], function(error, results, fields){
                  if(error) throw error;
                  console.log("total points updated");
        
                 });
             }
  
             else{
              
              mysqlConnection.query('UPDATE taskdetail SET rendah = CONCAT(rendah, "," ,?) WHERE name = ? ', [req.body.Tajuk,arr[i]], function(error, results, fields){
               
               if(error) throw error;
               console.log("1 easy detail inserted");
              });
              mysqlConnection.query('UPDATE taskpoint SET rendah = rendah+1 WHERE name = ? ', [arr[i]], function(error, results, fields){
                 if(error) throw error;
                 console.log("1 easy point inserted");
       
       
                });
                mysqlConnection.query('UPDATE taskpoint SET peratus = peratus+1 WHERE name = ? ', [arr[i]], function(error, results, fields){
                  if(error) throw error;
                  console.log("total points updated");
        
                 });
             }
            }

           }

         }

        //save tasks to task mgmt (pengurusan tugas)======================================================
         let data = {task: req.body.task, tarikh:req.body.tarikh, from:req.body.from, to: req.body.to, Lokasi:req.body.Lokasi, Tajuk:req.body.Tajuk, Nota:req.body.Nota, tarikhakhir:req.body.tarikhakhir, tahap:req.body.tahap,Agenda:req.body.Agenda, names:name};
        
         let sql = "INSERT INTO tasksMgmt SET ?";
         mysqlConnection.query(sql , data, function(error, results) {
          if(error) throw error;
          console.log("1 document inserted");
          res.redirect('/pengurusanTugas');
         });
         
      
               });

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

          app.get('/attendance',(req,res)=>{
            mysqlConnection.query('SELECT * FROM attendance' , function(error, results, fields) {
              res.render('attendance.ejs', {
                attendance : results
              });
             });
                 
              })
          
          app.get('/approve',(req,res)=>{
             mysqlConnection.query('SELECT * FROM hourlyleave' , function(error, results, fields) {
              res.render('approve.ejs', {
                 hourlyleave : results
                  });
                 });
                     
                  })

         app.get('/hourlyleave',(req,res)=>{
                        
             res.render('hourly.ejs')
                      })
// kena modify
          app.post('/hourlyleave', (req, res) => {
            //console.log(req.body.applydate);
            console.log(req.body.name);
        //   let data = {applydate: req.body.applydate, name:req.body.name,leavetime:req.body.leavetime, entertime:req.body.entertime, reason:req.body.reason};
        //   let sql = "INSERT INTO hourlyleave SET ?";
        //  mysqlConnection.query(sql , data, function(error, results) {
        //   if(error) throw error;
        //   console.log("1 document inserted");
        //   alert("berjaya");
        //  });
  })

             //   app.delete('/approved', (req,res)=>{
      
//       leaveCollection.deleteOne(

//       )
//       .then(result=>{
//           res.json('deleted')
//       })
//       .catch(error => console.error(error))

     
//   })

      
});



