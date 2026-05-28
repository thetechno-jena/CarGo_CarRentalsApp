const baseURL = 'http://localhost:';

const port ="3000";

$(document).ready(function() {

     // alert("This is the JQuery Init Event."); 

     $('#downloadData').click( () => {
        
        $("body").pagecontainer("change", "#showDataPage", { "transition":"flip"});
        
     });


     $(document).on("pagebeforeshow", "#showDataPage", function() {

        $.get(baseURL + port + "/getData", function(data, status){
      
            alert( "Status : " + status + "\nData: " + JSON.stringify(data));  
            tmpData = data; 

            $("table#cloudTable tbody").empty();
   
            if (data.length == 0 ) {
               $("table#cloudTable tbody").append("<tr><td>No data to display</td></tr>").closest("table#cloudTable").table("refresh").trigger("create");
            
            }
            else {
                var html = '';

                for(var count = 0; count < data.length; count++)
                {
                    html = html + '<tr>' +
                    `<td> ${tmpData[count].ID} </td>` +
                    `<td> ${tmpData[count].Name} </td>` +
                    `<td> ${tmpData[count].Age} </td>` +
                    '</tr>';
                } 

                $("table#cloudTable tbody").append(html).closest("table#cloudTable").table("refresh").trigger("create");
            }  
        }); 

    });

    
    $('#uploadData').click( () => {

        $("body").pagecontainer("change", "#inputDataPage", { "transition":"slideup"});  
     });


     $("#uploadButton").click( () => {  

        let dataName =  $('#name').val();
        let dataAge = $('#age').val();
        let id = Math.trunc(Math.random()*900000 + 100000);

        $('#name').val('');
        $('#age').val('');

        var obj = {Name: dataName, Age: dataAge, ID: id}

        $.post(baseURL + port + "/postData", obj, function(data, status) {

           alert("Status: " + status + "\nData: " + JSON.stringify(data));

           $("body").pagecontainer("change", "#home", { "transition":"turn" });
        }); 
            
     });


     $('#deleteData').click( () => {

        $("body").pagecontainer("change", "#deleteDataPage", { "transition":"turn"});  
     });


     $(document).on("pagebeforeshow", "#deleteDataPage", function() {

        let tmpData = []; // simple way to make global - there are other approaches

        $.get(baseURL + port + "/getData", function(data, status){
      
            alert( "Status : " + status + "\nData: " + JSON.stringify(data));  
            tmpData = data; 

            $("table#deleteTable tbody").empty();

            if (tmpData.length == 0 ) {
                $("table#deleteTable tbody").append("<tr><td>No data to delete</td></tr>").closest("table#deleteTable").table("refresh").trigger("create");
            
            }
            else {
                var html = ``;

                for(var count = 0; count < tmpData.length; count++)
                {
                    html = html + `<tr>` +
                    `<td> ${tmpData[count].ID} </td>` +
                    `<td> ${tmpData[count].Name} </td>` +
                    `<td> ${tmpData[count].Age} </td>` +
                    `<td> <input type=\"checkbox\" id=\"${tmpData[count].ID}\"> </td>` +
                    `</tr>`;
                } 
    
                $("table#deleteTable tbody").append(html).closest("table#deleteTable").table("refresh").trigger("create");
            }
   
        });
        
   });


   $("#deleteButton").click( () => {  

        var IDNos = [];
        
        var checkboxes = $("#deleteTable").find("input[type=checkbox]");

        checkboxes.each(function() {
            if ($(this).prop('checked')==true) { 
                IDNos.push(parseInt(this.id));
            }
        });

        if (IDNos.length == 0) {
            alert("No record selected for deletion");
        }
        else {
            $.ajax({
            method: "DELETE",
            dataType : "json",
            url:  baseURL+ port +"/deleteData", 
            data: {ID: {$in:IDNos}},
            }).done(function( data, status) {
                alert("Status: " + status + "\nData: " + JSON.stringify(data));
            }).error (function(xhr) {
                alert( "Error: " + JSON.stringify(xhr) );
            }) // end ajax
        } 
        
        $("body").pagecontainer("change", "#home", { "transition":"slidedown" }); 

    });
        
}); 


                


