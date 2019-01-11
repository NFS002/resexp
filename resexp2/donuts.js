
var svg = d3.select("svg")

var inPie = svg.append("g").attr('id','inPie')

var outPie = svg.append("g").attr('id','outPie')

inPie.append("g")
	.attr("class", "slices");

inPie.append("text")
	.attr("class", "totals")
    .attr("text-anchor","middle")
    .text("Totals");

outPie.append("g")
	.attr("class", "slices");

outPie.append("text")
	.attr("class", "totals")
    .attr("text-anchor","middle")
    .text("Totals");

var width = 1400,
    height = 750,
    radius = Math.min(width, height) / 3.5;


var pie = d3.layout.pie()
	.sort(null)
	.value(function(d) {
		return d.value;
	});

var arc = d3.svg.arc()
	.outerRadius(radius * 0.8)
	.innerRadius(radius * 0.4);

var outerArc = d3.svg.arc()
	.innerRadius(radius * 0.9)
	.outerRadius(radius * 0.9);


var div = d3.select("body").append("div").attr("class", "toolTip");

inPie.attr("transform", "translate(" + ((width / 4)) + "," + height / 2 + ")");

outPie.attr("transform", "translate(" + ((width / 2) + width/4) + "," + height / 2 + ")");

var data = {};
d3.csv('UK_Resource_Expense.rf.csv',function(csv) {

 data = d3.nest()
    .key(function(d) {return d.age;})
    .key(function(d) {return d.exchange;})
    .map(csv);

    $( "#slider" ).labeledslider({
          orientation: "vertical",
          range: "min",
          min: 0,
          max: 90,
          step: 10,
          tickInterval: 30,
          value: 20,
          create: function( event, ui ) {
            var total = data[20]['Total'][0]
            totals(total)
            total = adjustTotals(+total.value)
            changeInPie(data[20]['in'],total);
            changeOutPie(data[20]['out'],total);
          },
          slide: function( event, ui ) {
          var total = data[ui.value]['Total'][0]
          $('#title').text(ui.value);
          totals(total)
          total = adjustTotals(+total.value)
          changeInPie(data[ui.value]['in'],total);
          changeOutPie(data[ui.value]['out'],total);
          }
        });
})

var inLabels = ["Human Capital", "Assets", "Public Transfers","Private Transfers","Bequests Received"]
var outLabels = ["Public Consumption","Private Consumption","Public Transfers","Private Transfers","Bequests Made"]
var colors = ["rgb(56,86,151)", "rgb(101,101,101)" , "rgb(0,0,60)",'rgb(190,30,30)','rgb(180,180,180)']

//cant allow duplicate values in the  domain, so it is necessary to add '_in'/'_out' just for the color mapping
var color = d3.scale.ordinal()
	.domain(inLabels.map(function(e) { return e + '_in'}).concat(outLabels.map(function(e) { return e + '_out'})))
    .range(colors.concat(colors));

// A label for the current year.
var title = svg.append("text")
   .attr("id", "title")
   .attr("x", width/2 + 5 )
   .attr("y", height/8)
   .attr('text-anchor','middle')
   .text("20");

var subTitle = svg.append("text")
   .attr("id", "sub-title")
   .attr("x", width/2 - 10)
   .attr("y", height/8  + 20)
   .text("(Age)");

// Add labels for the 2 pies

var textPadding = width/5;
var inPieTitle = svg.append("text")
   .attr("id", "inPieTitle")
   .attr('class','pieTitle')
   .attr("x", textPadding)
   .attr("y", height/15)
   .text('Resources');

var outPieTitle = svg.append("text")
   .attr("id", "outPieTitle")
   .attr('class','pieTitle')
   .attr("x", width/2 + textPadding)
   .attr("y", height/15)
   .text('Expenses');




function changeInPie(data,total) {

	/* ------- PIE SLICES -------*/

    var slice = inPie.select(".slices").selectAll("path.slice")
        .data(pie(data), function(d){ return d.data.label});

    slice.enter()
        .insert("path")
        .style("fill", function(d) {
        //cant allow duplicate values in the  domain, so it is necessary to add '_in'/'_out' just for the color mapping
        return color(d.data.label + "_in"); })
    		.style("opacity", 0.7)
        .attr("class", "slice");

    slice
        .transition().duration(1000)
        .attrTween("d", function(d) {
            this._current = this._current || d;
            var i = d3.interpolate(this._current, d);
            var k = d3.interpolate(arc.outerRadius()(), total);
            this._current = i(0);
            return function(t) {
                return arc.outerRadius(k(t))(i(t));
            };
        })

    slice
        .on("mousemove", function(d){
            div.style("left", d3.event.pageX+10+"px");
            div.style("top", d3.event.pageY-25+"px");
            div.style("display", "inline-block");
            div.html((d.data.label)+"<br>"+(d.data.value)+"K");
        });
    slice
        .on("mouseout", function(d){
            div.style("display", "none");
        });

    slice.exit()
        .remove();

};

function changeOutPie(data,total) {


	/* ------- PIE SLICES -------*/

    var slice = outPie.select(".slices").selectAll("path.slice")
        .data(pie(data), function(d){ return d.data.label});


    slice.enter()
        .insert("path")
        //cant allow duplicate values in the  domain, so it is necessary to add '_in'/'_out' just for the color mapping
        .style("fill", function(d) {return color(d.data.label + "_out");})
    		.style("opacity", 0.7)
        .attr("class", "slice");




    slice
        .transition().duration(1000)
        .attrTween("d", function(d) {
            this._current = this._current || d;
            var i = d3.interpolate(this._current, d);
            var k = d3.interpolate(arc.outerRadius()(), total);
            this._current = i(0);
            return function(t) {
                return arc.outerRadius(k(t))(i(t));
            };
        })


    slice
        .on("mousemove", function(d){
            div.style("left", d3.event.pageX+10+"px");
            div.style("top", d3.event.pageY-25+"px");
            div.style("display", "inline-block");
            div.html((d.data.label)+"<br>"+(d.data.value)+"K");
        });


    slice
        .on("mouseout", function(d){
            div.style("display", "none");
        });

    slice.exit()
        .remove();

}

//=====ADD LEGEND =====//

$('#inLegend p').each(function(index) {

    $(this).text(inLabels[index]);
    $(this).css('display','inline-block')

    });

$('#inLegend i').each(function(index) {

    $(this).css('background-color',colors[index]);
    $(this).css('width','20px');
    $(this).css('height','20px');
    $(this).css('display','inline-block')
    $(this).css('border-radius','20%')

    });

$('#outLegend p').each(function(index) {

    $(this).text(outLabels[index]);
    $(this).css('display','inline-block')


  });

$('#outLegend i').each(function(index) {

    $(this).css('background-color',colors[index]);
    $(this).css('width','20px');
    $(this).css('height','20px');
    $(this).css('display','inline-block')
    $(this).css('border-radius','20%')

  });

// move the legends in place

var padding = 230

$('#inLegend').css('left',padding + 'px');
$('#outLegend').css('left',width/2 + padding + 'px');

// write totals

function totals(total) {
  $('.totals').each(function() {
  $(this).text(total.value + ' M')
  });
}

function adjustTotals(t) {
    return 150 + (Math.sqrt(t) + 50)
}