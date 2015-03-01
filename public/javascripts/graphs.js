var lineChartData = {
		labels : ["February","March","April","May","June","July","August","September","October","November","December","January"],
		datasets : [
			{
				label: "My First dataset",
				fillColor : "rgba(255,165,0,0.2)",
				strokeColor : "rgba(220,220,220,1)",
				pointColor : "rgba(220,220,220,1)",
				pointStrokeColor : "#fff",
				pointHighlightFill : "#fff",
				pointHighlightStroke : "rgba(220,220,220,1)",
				multiTooltipTemplate: "<%= datasetLabel %> - <%= value %>",
				data : []
			}
		]
}

window.onload = function(){

	$.get('/bloombergData', function(data) {
		//console.log(data);

		bloombergDataInput(data);

		var ctx = document.getElementById("canvas").getContext("2d");
		window.myLine = new Chart(ctx).Line(lineChartData, {
			responsive: true
		});
	
	
	});
}

function bloombergDataInput (data){
	for (i = 0; i < 50; i++) { 
		
    	lineChartData.datasets[0].data[i] = data[i];
	};
	console.log(data);
}