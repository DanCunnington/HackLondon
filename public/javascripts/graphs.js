var lineChartData = {
		labels : ["January","February","March","April","May"],
		datasets : [
			{
				label: "My First dataset",
				fillColor : "rgba(220,220,220,0.2)",
				strokeColor : "rgba(220,220,220,1)",
				pointColor : "rgba(220,220,220,1)",
				pointStrokeColor : "#fff",
				pointHighlightFill : "#fff",
				pointHighlightStroke : "rgba(220,220,220,1)",
				data : [1,2,3,4,5]
			}
		]
}

window.onload = function(){

	$.get('/bloombergData', function(data) {
		console.log(data);

		console.log(data.data[0]);
		bDataLength = data.data.length;

		for (i = 0; i < bDataLength; i++) { 
    		lineChartData.labels[i]= i;
    		lineChartData.datasets[0].data[i] = i+1;
		};

		var ctx = document.getElementById("canvas").getContext("2d");
		window.myLine = new Chart(ctx).Line(lineChartData, {
			responsive: true
		});
	
	
	});
}