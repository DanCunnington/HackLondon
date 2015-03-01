//Data that creates the chart

var lineChartProfitData = {
	//Y AXIS
	labels : [],
	datasets : [
		{
			label: "Profit",
			fillColor : "rgba(220,220,220,0.2)",
			strokeColor : "rgba(220,50,42,1)",
			pointColor : "rgba(220,220,220,1)",
			pointStrokeColor : "#fff",
			pointHighlightFill : "#fff",
			pointHighlightStroke : "rgba(220,220,220,1)",

		//X AXIS
			data : []
		}
	]
}

var lineChartJarsData = {
	//Y AXIS
	labels : [],
	datasets : [
		{
			label: "Profit",
			fillColor : "rgba(220,220,220,0.2)",
			strokeColor : "rgba(50,220,42,1)",
			pointColor : "rgba(220,220,220,1)",
			pointStrokeColor : "#fff",
			pointHighlightFill : "#fff",
			pointHighlightStroke : "rgba(220,220,220,1)",

		//X AXIS
			data : []
		}
	]
}

var lineChartCostsData = {
	//Y AXIS
	labels : [],
	datasets : [
		{
			label: "Profit",
			fillColor : "rgba(220,220,220,0.2)",
			strokeColor : "rgba(50,50,220,1)",
			pointColor : "rgba(220,220,220,1)",
			pointStrokeColor : "#fff",
			pointHighlightFill : "#fff",
			pointHighlightStroke : "rgba(220,220,220,1)",

		//X AXIS
			data : []
		}
	]
}

var lineChartHoursData = {
	//Y AXIS
	labels : [],
	datasets : [
		{
			label: "Profit",
			fillColor : "rgba(220,220,220,0.2)",
			strokeColor : "rgba(140,20,150,1)",
			pointColor : "rgba(220,220,220,1)",
			pointStrokeColor : "#fff",
			pointHighlightFill : "#fff",
			pointHighlightStroke : "rgba(220,220,220,1)",

		//X AXIS
			data : []
		}
	]
}

$(document).ready(function() {

	//Listen for updates
	var faye_client = new Faye.Client('http://localhost:8000/faye');

	faye_client.subscribe('/replyReceived', function(message) {   
	    
		updateData(message);
	    
	});

	var ctx = document.getElementById("canvasProfit").getContext("2d");
	window.myProfitsLine = new Chart(ctx).Line(lineChartProfitData, {
		responsive: true
	});

	var ctx = document.getElementById("canvasJars").getContext("2d");
	window.myJarsLine = new Chart(ctx).Line(lineChartJarsData, {
		responsive: true
	});

	var ctx = document.getElementById("canvasCosts").getContext("2d");
	window.myCostsLine = new Chart(ctx).Line(lineChartCostsData, {
		responsive: true
	});

	var ctx = document.getElementById("canvasHours").getContext("2d");
	window.myHoursLine = new Chart(ctx).Line(lineChartHoursData, {
		responsive: true
	});


	populateData();
})


	



function updateData(message) {
	console.log(message);
	//extract message
	message = message.twilioResponse.Body;

	var profitMatch = message.match(/profit/i);
	var noJarsMatch = message.match(/jars/i);
	var costsMatch = message.match(/costs/i);
	var hoursMatch = message.match(/hours/i);

	if (profitMatch) {
		//get latest value from profits

		$.get('/profits', function(data) {
			//Display points on a graph
			var index = data.length -1;
			var date = new Date(data[index].timestamp);
			window.myProfitsLine.addData([data[index].profit], date.toDateString());
			
		});
	}

	if (noJarsMatch) {
		//get latest value from profits

		$.get('/jars', function(data) {
			//Display points on a graph
			var index = data.length -1;
			var date = new Date(data[index].timestamp);
			window.myJarsLine.addData([data[index].noHoneyJarsSold], date.toDateString());
			
		});
	}

	if (costsMatch) {
		//get latest value from profits

		$.get('/costs', function(data) {
			//Display points on a graph
			var index = data.length -1;
			var date = new Date(data[index].timestamp);
			window.myCostsLine.addData([data[index].costs], date.toDateString());
			
		});
	}

	if (hoursMatch) {
		//get latest value from profits

		$.get('/hours', function(data) {
			//Display points on a graph
			var index = data.length -1;
			var date = new Date(data[index].timestamp);
			window.myHoursLine.addData([data[index].hours], date.toDateString());
			
		});
	}

}

function populateData() {

	//get the data from the database
	$.get('/profits', function(data) {

		//Display points on a graph
		for (var i=0; i<data.length; i++) {
			var date = new Date(data[i].timestamp);
			
			window.myProfitsLine.addData([data[i].profit], date.toDateString());
		}

	});


	$.get('/jars', function(data) {

		//Display points on a graph
		for (var i=0; i<data.length; i++) {
			var date = new Date(data[i].timestamp);
			
			window.myJarsLine.addData([data[i].noHoneyJarsSold], date.toDateString());
		}

	});

	$.get('/costs', function(data) {

		//Display points on a graph
		for (var i=0; i<data.length; i++) {
			var date = new Date(data[i].timestamp);
			
			window.myCostsLine.addData([data[i].costs], date.toDateString());
		}

	});

	$.get('/hours', function(data) {

		//Display points on a graph
		for (var i=0; i<data.length; i++) {
			var date = new Date(data[i].timestamp);
			
			window.myHoursLine.addData([data[i].hours], date.toDateString());
		}

	});
}