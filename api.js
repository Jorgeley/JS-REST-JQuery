(function(){
	"use strict";

	$(document).ready(init);

	function init(){
		getDrivers();
		saveDriver();
	}	

	//an auxiliar function to add the drivers to the table
	function addDriver(driver){
		$("#drivers tbody").append("<tr id='driver" +driver.id+ "'>"
				+"<td>" +driver.id+ "</td>"
				+"<td>" +driver.name+ "</td>"
				+"<td>" +driver.team+ "</td>"
				+"<td><a class='delete' cod='"+driver.id+"' href='#'>X</a></td>"
				+"<td><a class='view' cod='"+driver.id+"' href='#'>view</a></td>"
		+"</tr>");
	}	

	//show a specific driver into the form
	function view(id){
		$.ajax({
			url: "http://localhost:8890/view/"+id
		}).done(function(data){
			$("#id").val(data.driver.id);
			$("#name").val(data.driver.name);
			$("#team").val(data.driver.team);
		});		
	}

	//delete a Driver
	function del(id){
		if (confirm("Are you really sure?")){
			$.ajax({
				url: "http://localhost:8890/del/"+id
			}).then(function(data){
				if(data.del)
					$("#drivers tbody tr#driver"+id).remove();
			});
		}
	}

	//loading the drivers into the table
	function getDrivers(){
		$.ajax({
			url: "http://localhost:8890"
   	    }).then(function(drivers){
   	    	$.each(drivers, function(id, driver){
				addDriver(driver);
   	    	});
   	    	listeners();   	    	
   	    });
	}
	
	//add the Lannisters, ops! I mean listeners :)
	function listeners(){
	    	$('a.view').click(function(e){
	    		var id =  e.target.getAttribute('cod');
	    		view(id);
	    	});	    	
	    	$('a.delete').click(function(e){
	    		var id =  e.target.getAttribute('cod');
	    		del(id);
	    	});
	}

	//add or update a Driver
	function saveDriver(){
		$("#save").click(function(){
			if ( $("#name").val()=="" || $("#team").val()=="" )
				alert("Please, fill the form!");
			else{
				$.ajax({
					type: "POST",
					url: "http://localhost:8890/save/"+$("#id").val(),
					data:{
						name: $("#name").val(),
						team: $("#team").val()
					}
				}).done(function(data){
					if ($("#id").val())
						$("tr#driver"+$("#id").val()).html(
								"<td>" +data.driver.id+ "</td>"
								+"<td>" +data.driver.name+ "</td>"
								+"<td>" +data.driver.team+ "</td>"
								+"<td><a class='delete' cod='"+data.driver.id+"' href='#'>X</a></td>"
								+"<td><a class='view' cod='"+data.driver.id+"' href='#'>view</a></td>"
								);
					else
						addDriver(data.driver);
					$("form")[0].reset();
					$("#id").val(null);
					listeners();
				});
			}
		});
	}
	
})();