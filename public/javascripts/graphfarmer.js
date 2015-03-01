//Data that creates the chart

var lineChartData = {
	//Y AXIS
	labels : ["January","February","March","April","May","June","July"],
	datasets : [
		{
			label: "My First dataset",
			fillColor : "rgba(220,220,220,0.2)",
			strokeColor : "rgba(220,220,220,1)",
			pointColor : "rgba(220,220,220,1)",
			pointStrokeColor : "#fff",
			pointHighlightFill : "#fff",
			pointHighlightStroke : "rgba(220,220,220,1)",

		//X AXIS
			data : [1,2,3,4,5]
		}
	]
}



window.onload = function(){
	var ctx = document.getElementById("canvasFarmer").getContext("2d");
	window.myLine = new Chart(ctx).Line(lineChartData, {
		responsive: true
	});
}



function addFarmerPoint(){
	window.myLine.addData([10], "June");
}