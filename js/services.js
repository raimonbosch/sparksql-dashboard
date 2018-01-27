
/**
 * Encapsulates all the logic about SQL querying towards the data warehouse.
 */
var QueryService = {

    executeQuery: function (sql, divId, params) {
        var that = this;

        $.ajax({
            url: "/queries",
            type: "POST",
            data: { sql: sql, params: params },
            timeout: 1800000
        }).done(function (response) {
            var queryResponse = jQuery.parseJSON(response);
            that.doAfterQueryResponse(queryResponse, divId, params);
        });
    }
};

/**
 * The TableService is used to display regular tables without any graph.
 */
var TableService = {

    doAfterQueryResponse: function (queryResponse, divId, params) {
        for (index = 0; index < queryResponse.results.length; index++) {
            this.printTable(queryResponse.results[index], index, divId, params);
        }
    },

    printTable: function(queryResponse, index, divId, params) {
        var htmlFinal = "<table class='table-bordered mytable' style='width:95%'>";

        htmlFinal += '<th>id</th>';
        for(var field in queryResponse[0]){
            htmlFinal += '<th>' + field.replace(/^[0-9]{2}\_/, '') + '</th>';
        }

        $.each(queryResponse, function(index, row) {
            htmlFinal += '<tr>';
            htmlFinal += '<td>' + index + '</td>';
            for(var field in row){
                if (field.indexOf('site') != -1) {
                    htmlFinal += '<td><a href="?site=' + row[field] + '">' + row[field] + '</a></td>';
                }
                else if (field.indexOf('diff') != -1 && row[field] >= 0) {
                    htmlFinal += '<td style="color:green;">(&uarr;)&nbsp;&nbsp;+' + row[field] + '</td>';
                }
                else if (field.indexOf('diff') != -1 && row[field] < 0) {
                    htmlFinal += '<td style="color:red;">(&darr;)&nbsp;&nbsp;' + row[field] + '</td>';
                }
                else {
                    htmlFinal += '<td>' + row[field] + '</td>';
                }
            }
            htmlFinal += '</tr>';

        });

        $("#" + divId + "_" + index).html(htmlFinal);
    },

    create: function(divId, query, params = {}) {
        this.executeQuery(query, divId, params);
        return $('#' + divId);
    }
};

$.extend(TableService, QueryService);


/**
 * The HighChartsService has all the logic about highchartsJS library.
 */
var HighChartsService = {

    chart: {},

    queryResponses: [],

    doAfterQueryResponse: function (queryResponse, divId, params) {
        this.chart[divId] = this.reloadChart(
            queryResponse.ui.type,
            queryResponse.ui.shared,
            divId
        );

        this.chart[divId].queryResponses = [];
        for (index = 0; index < queryResponse.results.length; index++) {
            result = queryResponse.results[index];
            this.addSeries(result, divId);
            this.printTable(result, index);
            this.queryResponses[index] = result;
            this.chart[divId].queryResponses[index] = result;
        }
    },

    printTable: function (queryResponse, index) {
        var htmlFinal = "<table class='table-bordered mytable' style='width:100%'>";

        htmlFinal += '<th>id</th>';
        for(var field in queryResponse[0]){
            htmlFinal += '<th>' + field + '</th>';
        }

        $.each(queryResponse, function(index, row) {
            htmlFinal += '<tr>';
            htmlFinal += '<td>' + index + '</td>';
            for(var field in row){
                htmlFinal += '<td>' + row[field] + '</td>';
            }
            htmlFinal += '</tr>';

        });

        $("#results_" + index).html(htmlFinal);
    },

    addSeries: function (queryResponse, divId) {
        if (!this.chart[divId].xAxis[0].categories) {
            categories = $.map(queryResponse, function(row, i){
                return row.x;
            });

            this.chart[divId].xAxis[0].setCategories(categories);
        }


        for (property in queryResponse[0]) {
            if (property != 'x') {
                series = $.map(queryResponse, function(row, i){
                    return row[property];
                });

                this.chart[divId].addSeries({
                    name: property,
                    data: series
                });
            }
        }
    },

    reloadChart: function (type, shared, divId) {
        Highcharts.setOptions({
            colors: ['#0698CE', '#EF8A17', '#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9',
       '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1']
        });

        chartConf = {
            chart: {
                type: type,
            },
            title: {
                text: ''
            },
            yAxis: {
                min: 0
            }
        };


        if (shared) {
            chartConf.tooltip = {
                shared: true,
                formatter: function () {
                    if(this.points[1]) {
                        return '<b>' + this.points[0].key + '</b><br>' +
                            this.points[0].y + ' vs. ' + this.points[1].y + ' (' +
                            (100*((this.points[0].y - this.points[1].y)/this.points[1].y)).toFixed(2) + '%)';
                    }
                    else {
                        return '<b>' + this.points[0].key + '</b><br>' + this.points[0].y ;
                    }
                }
            }
        }

        return Highcharts.chart(divId, chartConf);
    },

    create: function (divId, query, params = {}) {
        this.executeQuery(query, divId, params);
        return this.chart[divId];
    }
};

$.extend(HighChartsService, QueryService);

/* MENU JS */
$(document).ready(function () {
    var trigger = $('.hamburger'),
        overlay = $('.overlay'),
        isClosed = false;

    trigger.click(function () {
        hamburger_cross();
    });

    function hamburger_cross() {

        if (isClosed == true) {
            overlay.hide();
            trigger.removeClass('is-open');
            trigger.addClass('is-closed');
            isClosed = false;
        } else {
            overlay.show();
            trigger.removeClass('is-closed');
            trigger.addClass('is-open');
            isClosed = true;
        }
    }

    $('[data-toggle="offcanvas"]').click(function () {
        $('#wrapper').toggleClass('toggled');
    });

    $('#sidebar-wrapper').html(
      '<ul class="nav sidebar-nav">' +
        '<li class="sidebar-brand">' +
            '<a href="#">SparkSQL/Dash</a>' +
        '</li>' +
        '<li>' +
        '<a href="/">Summary</a>' +
        '</li>' +
        '<li>' +
        '<a href="/year">Year Summary</a>' +
        '</li>' +
        '<li>' +
            '<a href="/graph">Admin</a>' +
        '</li>' +
      '</ul>'
    );
})
