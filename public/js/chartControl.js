/**
 *  control the display of statistic charts
 */
$(document).ready(function () {
    $("#show_c1").click(function () {
        $.ajax({
            url: "action/chart",
            type: "post",
            dataType: "json",
            data: "no=1",
            success: showChart1
        });
    });
    $("#show_c2").click(function () {
        $.ajax({
            url: "action/chart",
            type: "post",
            dataType: "json",
            data: "no=2",
            success: showChart2
        });
    });
    $("#show_c3").click(function () {
        $.ajax({
            url: "action/chart",
            type: "post",
            dataType: "json",
            data: "no=3",
            success: showChart3
        });
    });
    $("#show_c4").click(function () {
        showChart4();
    });
    $("#show_c5").click(function () {
        $.ajax({
            url: "action/chart",
            type: "post",
            dataType: "json",
            data: "no=5",
            success: showChart5
        });
    });
});

function chartToggle( text ) {
    $("#btn_group").hide();
    $("#back_home").html("<a href='statistic'>statistic</a>");
    $("#current").html("<span class='divider'></span>" + text );
    $("#chart_info").fadeIn("slow");
    $("#container_chart").fadeIn("slow");
}

// show chart 1
function showChart1( results ) {
    var data = eval( results );
    chartToggle("number of publication");

    $('#container_chart').highcharts({
        title: {
            text: 'The Number of Publications from 1926 to 2015',
            x: -20 //center
        },
        xAxis: {
            title: {
                text: 'year'
            },
            categories: data.yearIndex
        },
        yAxis: {
            title: {
                text: '# of publications'
            },
            plotLines: [
                {
                    value: 0,
                    width: 1,
                    color: '#808080'
                }
            ],
            min: 0
        },
        tooltip: {
            formatter: function () {
                return '<b>' + this.series.name + '</b><br/>' +
                    this.x + ' num: ' + this.y;
            }
        },
        series: [
            {
                name: 'Annual',
                data: data.annual
            },
            {
                name: 'Cumulative',
                data: data.cumulative
            }
        ]
    });
}

// show chart 2
function showChart2( results ) {
    var data = eval( results );
    chartToggle("distribution of field");

    // Make monochrome colors and set them as default for all pies
    Highcharts.getOptions().plotOptions.pie.colors = (function () {
        var colors = [],
            base = Highcharts.getOptions().colors[0],
            i ;
        for (i = 0; i < 8; i++) {
            // Start out with a darkened base color (negative brighten), and end
            // up with a much brighter color
            colors.push(Highcharts.Color(base).brighten((i - 3) / 7).get());
        }
        return colors;
    }());

    $('#container_chart').highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        },
        title: {
            text: 'The Distribution of Combinatorial Testing Research Fields'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        },
        series: [
            {
                type: 'pie',
                name: 'Field ratio',
                data: data.category
            }
        ]
    });
}

// show chart 3
function showChart3( results ) {
    var data = eval( results );
    chartToggle("changging ratio of field");

    $('#container_chart').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: 'The Changing Ratio of Combinatorial Testing Research Fields'
        },
        xAxis: {
            categories: data.yearIndex
        },
        yAxis: {
            min: 0,
            title: {
                text: 'ratio of publications'
            }
        },
        tooltip: {
            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
            shared: true
        },
        plotOptions: {
            column: {
                stacking: 'percent'
            }
        },
        series: [{
            name: 'Generation',
            data: data.generation
        }, {
            name: 'Application',
            data: data.application
        }, {
            name: 'Model',
            data: data.model
        }, {
            name: 'Evaluation',
            data: data.evaluation
        }, {
            name: 'Optimization',
            data: data.optimization
        }, {
            name: 'Diagnosis',
            data: data.diagnosis
        }, {
            name: 'Other',
            data: data.other
        }]
    });

}

// show chart 4
function showChart4() {
    var data = [
        {"code": "AU", "value": 2, "name": "Australia"},
        {"code": "AT", "value": 1, "name": "Austria"},
        {"code": "BR", "value": 1, "name": "Brazil"},
        {"code": "CA", "value": 9, "name": "Canada"},
        {"code": "CN", "value": 31, "name": "China"},
        {"code": "HR", "value": 1, "name": "Croatia"},
        {"code": "DK", "value": 2, "name": "Denmark"},
        {"code": "FI", "value": 2, "name": "Finland"},
        {"code": "DE", "value": 3, "name": "Germany"},
        {"code": "IN", "value": 5, "name": "India"},
        {"code": "IE", "value": 1, "name": "Ireland"},
        {"code": "IL", "value": 4, "name": "Israel"},
        {"code": "IT", "value": 4, "name": "Italy"},
        {"code": "JP", "value": 6, "name": "Japan"},
        {"code": "JO", "value": 1, "name": "Jordan"},
        {"code": "LU", "value": 2, "name": "Luxembourg"},
        {"code": "MY", "value": 8, "name": "Malaysia"},
        {"code": "MX", "value": 7, "name": "Mexico"},
        {"code": "NO", "value": 2, "name": "Norway"},
        {"code": "RO", "value": 1, "name": "Romania"},
        {"code": "SA", "value": 1, "name": "Saudi Arabia"},
        {"code": "RS", "value": 1, "name": "Serbia"},
        {"code": "ES", "value": 3, "name": "Spain"},
        {"code": "SE", "value": 2, "name": "Sweden"},
        {"code": "TR", "value": 3, "name": "Turkey"},
        {"code": "GB", "value": 2, "name": "United Kingdom"},
        {"code": "US", "value": 65, "name": "United States of America"},
        {"code": "VN", "value": 1, "name": "Vietnam"}
    ];
    chartToggle("people in the world");

    $('#container_chart').highcharts('Map', {
        title : {
            text : 'The Distribution of Researchers across the World'
        },
        mapNavigation: {
            enabled: true,
            enableDoubleClickZoomTo: true
        },
        colorAxis: {
            min: 0,
            max: 75,
            type: 'linear'
        },
        series : [{
            data : data,
            mapData: Highcharts.maps['custom/world'],
            joinBy: ['iso-a2', 'code'],
            name: 'The number of authors',
            states: {
                hover: {
                    color: '#BADA55'
                }
            },
            tooltip: {
                valueSuffix: ''
            }
        }]
    });
}

// show chart 5
function showChart5( results ) {
    var data = eval( results );
    chartToggle("number of new affiliation");

    $('#container_chart').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: 'Number of New Affiliations'
        },
        xAxis: {
            categories: data.yearIndex,
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: '# of affiliations'
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">new affiliation: </td>' +
            '<td style="padding:0"><b>{point.y}</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: 'Annual',
            data: data.annual
        }]
    });
}
