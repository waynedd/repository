/**
 *  Control the display of statistic charts
 */
$(document).ready(function () {
    // return to main list
    $('#chart_info_type').click(function () {
        $('#chart_info').hide();
        $('#container_chart').hide();
        $('#btn_group').fadeIn('slow');
    });
    // show charts
    $('#show_c1').click(function () {
        $.ajax({
            url: 'action/chart',
            type: 'post',
            dataType: 'json',
            data: 'no=1',
            success: showChart1
        });
    });
    $('#show_c2').click(function () {
        $.ajax({
            url: 'action/chart',
            type: 'post',
            dataType: 'json',
            data: 'no=2',
            success: showChart2
        });
    });
    $('#show_c3').click(function () {
        $.ajax({
            url: 'action/chart',
            type: 'post',
            dataType: 'json',
            data: 'no=3',
            success: showChart3
        });
    });
    $('#show_c4').click(function () {
        $.ajax({
            url: 'action/chart',
            type: 'post',
            dataType: 'json',
            data: 'no=4',
            success: showChart4
        });
    });
    $('#show_c5').click(function () {
        $.ajax({
            url: 'action/chart',
            type: 'post',
            dataType: 'json',
            data: 'no=5',
            success: showChart5
        });
    });
});

// make the chart DOM display
function chartToggle( text ) {
    $('#btn_group').hide();
    $('#chart_info_type').html('<a href="#">statistic</a>');
    $('#chart_info_name').html('<span class="divider"></span>' + text );
    $('#chart_info').fadeIn('slow');
    $('#container_chart').fadeIn('slow');
}

// check whether there exits an error message
function validateData( data ) {
    if( data.error != null ) {
        alert('The service is temporarily unavailable: ' + data.error);
        return false;
    }
    return true;
}

// show chart 1
function showChart1( results ) {
    var data = eval( results );
    if( !validateData(data) )
        return;

    chartToggle('number of publication');
    $('#container_chart').highcharts({
        title: {
            text: 'The Number of Combinatorial Testing Publications from '
                + data.yearIndex[0] + ' to ' + data.yearIndex[data.yearIndex.length-1],
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
                text: 'number of publications'
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
        ],
        exporting: {
            sourceWidth: 800
        }
    });
}

// show chart 2
function showChart2( results ) {
    var data = eval( results );
    if( !validateData(data) )
        return;

    chartToggle('distribution of field');
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
                name: 'ratio',
                data: data.category
            }
        ],
        exporting: {
            sourceWidth: 800
        }
    });
}

// show chart 3
function showChart3( results ) {
    var data = eval( results );
    if( !validateData(data) )
        return;

    chartToggle('relative proportion of field');
    $('#container_chart').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: 'The Relative Proportions of each Combinatorial Testing Research Field'
        },
        xAxis: {
            categories: data.yearIndex,
            title: {
                text: 'year'
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: 'ratio of publications'
            }
        },
        tooltip: {
            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ' +
            '({point.percentage:.0f}%)<br/>',
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
        }],
        exporting: {
            sourceWidth: 800
        }
    });

}

// show chart 4
function showChart4( results ) {
    /*
    DATA EXAMPLE:
        data = [
            {"code": "AU", "value": 2, "name": "Australia"},
            {"code": "AT", "value": 1, "name": "Austria"},
            {"code": "BR", "value": 1, "name": "Brazil"},
            ...
        ];
    */
    var data = eval( results );
    if( !validateData(data) )
        return;

    chartToggle('scholar in the world');
    $('#container_chart').highcharts('Map', {
        title : {
            text : 'The Distribution of Scholars in the World'
        },
        mapNavigation: {
            enabled: true,
            enableDoubleClickZoomTo: true
        },
        colorAxis: {
            min: 0,
            max: 180,
            type: 'linear'
        },
        series : [{
            data : data,
            mapData: Highcharts.maps['custom/world'],
            joinBy: ['iso-a2', 'code'],
            name: 'number of scholars',
            states: {
                hover: {
                    color: '#BADA55'
                }
            },
            tooltip: {
                valueSuffix: ''
            }
        }],
        exporting: {
            sourceWidth: 800
        }
    });
}

// show chart 5
function showChart5( results ) {
    var data = eval( results );
    if( !validateData(data) )
        return;

    chartToggle('number of new institutions');
    $('#container_chart').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: 'The Number of New Institutions that Contribute to Combinatorial Testing'
        },
        xAxis: {
            categories: data.yearIndex,
            crosshair: true,
            title: {
                text: 'year'
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: 'number of institutions'
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">new institution: </td>' +
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
        }],
        legend: {
            enabled: false
        },
        exporting: {
            sourceWidth: 800
        }
    });
}
