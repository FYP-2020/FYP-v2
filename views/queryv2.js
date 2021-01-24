app.post('/pengurusanTugas',urlencodedParser,function(req,res){
        
    var name = JSON.stringify(req.body.names);
    var name2 = name.replace("[",""); 
    var name3 = name2.replace('\"',"");
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

    var t = JSON.stringify(new Date().getDay());
       
     if(jsonObj.peranan==="Penganjur" || jsonObj.peranan==="Pencatat Minit Mesyuarat" ){// meeting

      

       mysqlConnection.query('UPDATE taskpoint SET mesyuarat =mesyuarat+2 ,peratus = CASE WHEN peratus < 40 THEN peratus +2 ELSE peratus END,mesyuaratdetail = CONCAT(mesyuaratdetail,",",?),pinperatus=CONCAT(pinperatus,",",peratus),pindate=CONCAT(pindate,",",?) WHERE NAME=? AND MONTH =?', [req.body.Tajuk,t,arr[i],,month], function(error, results, fields){
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
       

         mysqlConnection.query('UPDATE taskpoint SET tinggi = tinggi +3 ,tinggidetail = CONCAT(tinggidetail, "," ,?), peratus = CASE WHEN peratus < 40 THEN peratus +3 ELSE peratus END, pinperatus=CONCAT(pinperatus,",",peratus),pindate=CONCAT(pindate,",",?)WHERE NAME=? AND MONTH =? ', [req.body.Tajuk,t,arr[i],month], function(error, results, fields){
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
         
         mysqlConnection.query('UPDATE taskpoint SET sederhana = sederhana+2 ,sederhanadetail = CONCAT(sederhanadetail, "," ,?), peratus = CASE WHEN peratus< 40 THEN peratus +2 ELSE peratus END, pinperatus=CONCAT(pinperatus,",",peratus),pindate=CONCAT(pindate,",",?) WHERE NAME=? AND MONTH =?  ', [req.body.Tajuk,t,arr[i],month], function(error, results, fields){
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
         
         mysqlConnection.query('UPDATE taskpoint SET rendah = rendah+1 ,rendahdetail = CONCAT(rendahdetail, "," ,?), peratus = CASE WHEN peratus <40 THEN peratus +1 ELSE peratus END,pinperatus=CONCAT(pinperatus,",",peratus),pindate=CONCAT(pindate,",",?) WHERE NAME=? AND MONTH =?  ', [req.body.Tajuk,t,arr[i],month], function(error, results, fields){
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