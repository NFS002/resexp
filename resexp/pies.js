
var birthYears = ["<1922","1923-1932", "1933-1942", "1943-1952", "1953-1962", "1963-1972", "1973-1982", "1983-1992", "1993-2002", "2003-2012",">2013"];
birthYears = birthYears.reverse();

var ages = ["90+","80-89","70-79","60-69","50-59","40-49","30-39","20-29","10-19","0-9","Unborn"]
ages = ages.reverse();

var animState = false;

var animate;

var height = 500;

var width = 460;

var svg = d3.select('.chart').append('svg').attr('width',width * 2 + 'px').attr('height',height + 'px');

svg.append("g").attr("id","resourcePie").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

svg.append("g").attr("id","expensePie").attr("transform", "translate(" + width * 1.5 + "," + height / 2 + ")");

radius = Math.min(width,height)/2;

var radius;

var playbt = $('#playbt');

var year = 0;

var birthyearvalue = birthYears[year];

var agevalue = ages[year];

var speed = 1000;

var yeartxt = $( "#yeartxt" );

var agetxt = $( '#agetxt' );




var gradColors=[
	{res:"rgb(56,86,151)", exp:"rgb(101,146,150)"},
	{res:"rgb(101,101,101)", exp:"rgb(56,86,151)"},
	{res:"rgb(0,0,60)", exp:"rgb(180,180,180)"},
	{res:"rgb(34,91,106)", exp:"rgb(70,70,90)"},
	{res:"rgb(134, 205, 220)", exp:"rgb(150,180,60)"}
];

$( function() {
    createRangeButtons();
    playbt.on('click',function() {
            toggleAnimate();
    });
    agetxt.text("Age: " + agevalue);
    yeartxt.text("Year of Birth: " + birthyearvalue);
  });


function createRangeButtons() {
 for (var i = 0;i < birthYears.length ;i++) {
         yeartext = birthYears[i].substring(birthYears[i].length - 4,birthYears[i].length);
         agetext = ages[i]
         button = d3.select('#rangebuttons').append('button')
                                        .attr('id','rangebt-' + i)
                                        .attr('class','range-button')
                                        .html(agetext + ' <br> ' + yeartext);

         button.on('click',function() {
                  $(this).addClass("button-active").siblings().removeClass("button-active");
                  id = $(this).attr('id');
                  id = id.replace('rangebt-', '');
                  year = +id;
                  birthyearvalue = birthYears[year]
                  agevalue = ages[year]
                  agetxt.text("Age: " + agevalue);
                  yeartxt.text("Year of Birth: " + birthyearvalue);
                  drawPies();
                  })
                  $('#rangebt-0').click();
     }
}



function toggleAnimate() {
   animState = !animState;
   animState ? startAnimate() : stopAnimate()
  }

function startAnimate() {
     $("#playbt").attr('src','pause.jpg');
  	 animate = setInterval(nextPies, speed);
 }

function stopAnimate() {
  	 $("#playbt").attr('src','play.jpg');
  	 clearInterval(animate);
 }


function nextPies() {
        year += 1;
        $('#rangebt-' + year).click();
		if (year > birthYears.length - 2) {
		    stopAnimate();
		    $('.chart').fadeOut(function() {
		      $('.chart').fadeIn(function() {
		    $('#rangebt-0').click();
		    year = 0;
		        });
		    });
	}

  }


function drawPies() {

drawInputChart(birthyearvalue);
drawOutputChart(birthyearvalue);

}

createResGradients = function(defs, colors, r){

	var gradient = defs.selectAll('.gradient')
		.data(colors).enter().append("radialGradient")
		.attr("id", function(d,i){return "resGradient" + i;})
		.attr("gradientUnits", "userSpaceOnUse")
		.attr("cx", "0").attr("cy", "0").attr("r", r).attr("spreadMethod", "pad");

		gradient.append("stop").attr("offset", "0%").attr("stop-color", function(d){ return d;});

		gradient.append("stop").attr("offset", "30%")
			.attr("stop-color",function(d){ return d;})
			.attr("stop-opacity", 1);

		gradient.append("stop").attr("offset", "70%")
			.attr("stop-color",function(d){ return "black";})
			.attr("stop-opacity", 1);
	}

createExpGradients = function(defs, colors, r){

	var gradient = defs.selectAll('.gradient')
		.data(colors).enter().append("radialGradient")
		.attr("id", function(d,i){return "expGradient" + i;})
		.attr("gradientUnits", "userSpaceOnUse")
		.attr("cx", "0").attr("cy", "0").attr("r", r).attr("spreadMethod", "pad");

		gradient.append("stop").attr("offset", "0%").attr("stop-color", function(d){ return d;});

		gradient.append("stop").attr("offset", "30%")
			.attr("stop-color",function(d){ return d;})
			.attr("stop-opacity", 1);

		gradient.append("stop").attr("offset", "70%")
			.attr("stop-color",function(d){ return "black";})
			.attr("stop-opacity", 1);
	}


function drawInputChart(year) {

var inputG = d3.select("#resourcePie").append('g').attr('width',width / 2 + 'px').attr('height',height + 'px');


d3.csv("resource-data.csv", function(csv) {
  csv.resourceAmount = +csv.resourceAmount;
  return csv;
}, function(error, data) {
  if (error) throw error;
  inputData = data.filter(function (d) {return d.birthYear === year });

  var totalResources = 0;
  capitalData = inputData.filter(function (d) {return d.resourceType === "Human Capital"});
  d3.select('#human-capital-amount').text(capitalData[0].resourceAmount);
  totalResources += capitalData[0].resourceAmount

  assetData = inputData.filter(function (d) {return d.resourceType === "Assets"});
  d3.select('#assets-amount').text(assetData[0].resourceAmount);
  totalResources += assetData[0].resourceAmount

  putrData = inputData.filter(function (d) {return d.resourceType === "Public Transfers"});
  d3.select('#public-transfers-amount').text(putrData[0].resourceAmount);
  totalResources += putrData[0].resourceAmount

  prtrData = inputData.filter(function (d) {return d.resourceType === "Private Transfers"});
  d3.select('#private-transfers-amount').text(prtrData[0].resourceAmount);
  totalResources += prtrData[0].resourceAmount

  bqrData = inputData.filter(function (d) {return d.resourceType === "Bequests Received"});
  d3.select('#bequests-received-amount').text(bqrData[0].resourceAmount);
  totalResources += bqrData[0].resourceAmount
  d3.select('#total-resources-amount').text('£' + totalResources + 'K' );




createResGradients(inputG.append("defs"),gradColors.map(function(d){ return d.res; }),radius * 2.2)

var inputPie = d3.pie()
    .sort(null)
    .value(function(d) {
    return d.resourceAmount; });

var  inputPath = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

var inputArc = inputG.selectAll(".arc")
    .data(inputPie(inputData))
    .enter().append("g")
      .attr("class", "arc");

  inputArc.append("path")
      .attr("d", inputPath)
      .attr("fill",function(d,i){ return "url(#resGradient"+ i+")" ; });

    });


 }


function drawOutputChart(year){

var outputG = d3.select("#expensePie").append('g').attr('width',width * 1.5 + 'px').attr('height',height + 'px');

d3.csv("expense-data.csv", function(csv) {
  csv.expenseAmount = +csv.expenseAmount;
  return csv;
}, function(error, data) {
  if (error) throw error;

  outputData = data.filter(function (d) {return d.birthYear === year });

  var totalExpenses = 0;

  pucData = outputData.filter(function (d) {return d.expenseType === "Public Consumption"});
  d3.select('#public-consumption-amount').text(pucData[0].expenseAmount);
  totalExpenses += pucData[0].expenseAmount

  prcData = outputData.filter(function (d) {return d.expenseType === "Private Consumption"});
  d3.select('#private-consumption-amount').text(prcData[0].expenseAmount);
  totalExpenses += prcData[0].expenseAmount

  putrmData = outputData.filter(function (d) {return d.expenseType === "Public Transfers"});
  d3.select('#public-transfers-made-amount').text(putrmData[0].expenseAmount);
  totalExpenses += putrmData[0].expenseAmount

  prtrmData = outputData.filter(function (d) {return d.expenseType === "Private Transfers"});
  d3.select('#private-transfers-made-amount').text(prtrmData[0].expenseAmount);
  totalExpenses += prtrmData[0].expenseAmount

  bqmData = outputData.filter(function (d) {return d.expenseType === "Bequests Made"});
  d3.select('#bequests-made-amount').text(bqmData[0].expenseAmount);
  totalExpenses += bqmData[0].expenseAmount





d3.select('#total-expenses-amount').text('£' + totalExpenses + 'K');
expGradC = Math.round(2.5 * totalExpenses/50)


createExpGradients(outputG.append("defs"),gradColors.map(function(d){ return d.exp; }),radius * 2.2)

var outputPie = d3.pie()
    .sort(null)
    .value(function(d) {
    return d.expenseAmount; });

var outputPath = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);


  var outputArc = outputG.selectAll(".arc")
    .data(outputPie(outputData))
    .enter().append("g")
      .attr("class", "arc");

  outputArc.append("path")
      .attr("d", outputPath)
      .attr("fill", function(d,i){ return "url(#expGradient"+ i+")" ; });

    });
}

