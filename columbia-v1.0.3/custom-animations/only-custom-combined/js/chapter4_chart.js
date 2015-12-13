$(document).ready(function() {
    var chapter4_chart;
    var groups = [
        {
            disable: false,
            color: '#1BABE2',
            key: "Women paid work",
            values: []
        },
        {
            disable: false,
            color: '#F1AF00',
            key: "Women unpaid work",
            values: []
        },
        {
            disable: false,
            color: '#1BABE2',
            key: 'Men paid work',
            values: []
        },
        {
            disable: false,
            color: '#F1AF00',
            key: 'Men unpaid work',
            values: []
        }
    ];

    function redraw() {
        var selected = [];
        $('#chapter4_selector option:selected').each(function() {
            selected.push($(this).val());
        });

        if (selected.length == 0) d3.selectAll("#chapter4_wrapper svg > g, #chapter4_wrapper svg > text").remove();
        // remove old data
        groups[0].values.length = 0; groups[1].values.length = 0;
        groups[2].values.length = 0; groups[3].values.length = 0;

        for (var i=0; i<selected.length; i++) {
            groups[0].values.push(data[selected[i]][0]) // women_paid_work
            groups[1].values.push(data[selected[i]][1]) // women_unpaid_work
            groups[2].values.push(data[selected[i]][2]) // men_paid_work
            groups[3].values.push(data[selected[i]][3]) // men_unpaid_work
        }
        // update chart
        d3.select('#chapter4_wrapper svg')
            .datum(groups)
            .transition()
            .duration(1000)
            .call(chapter4_chart);

        nv.utils.windowResize(chapter4_chart.update);
    };

    // set margins, space between groups, transition time, tooltip text
    chapter4_chart = nv.models.multiBarChart()
        .transitionDuration(1000)
        .showControls(false)   //Allow user to switch between 'Grouped' and 'Stacked' mode.
        .groupSpacing(0.2)    //Distance between each group of bars.
        .showLegend(false)
        .margin({top: 5, right: 10, bottom: 125, left: 75})
        .tooltipContent(function (key, label, value, graph) {
            // tooltip text
            return "<h3>" + label + " " + graph.point.survey_year + "</h3>" + "<p>" + value + " min/day for " + graph.point.gender + "</p>";
        });

    chapter4_chart.yAxis
        .axisLabel('Minutes per day')
        .tickFormat(function (d) {
            return d < 0 ? d.toFixed(0) * -1 : d.toFixed(0);
        })
        .axisLabelDistance(40);

    nv.addGraph(function() {
        return chapter4_chart;
    });
    
    // call Bootstrap Multiselect plugin
    $('#chapter4_selector').multiselect({
        nonSelectedText: 'Countries',
        maxHeight: 235,
        onInitialized: function(select, container) {
            var limit = window.outerWidth >= 768 ? 5: 3;
            is_max_counties(limit);
            redraw();
        },
        // Limit the number of selected options
        onChange: function(option, checked) {
            var limit = window.outerWidth >= 768 ? 5: 3;
            is_max_counties(limit);
            redraw();
        }
    });

    // reset btn handler
    $('#chapter4_reset_btn').on('click', function() {
        $('#chapter4_selector option:selected').each(function() {
            $(this).prop('selected', false);
        })

        $('#chapter4_selector').multiselect('refresh');
        redraw();
    });
});


function is_max_counties(limit) {
    // Get selected options.
    var selectedOptions = $('#chapter4_selector option:selected');

    if (selectedOptions.length >= limit) {
        // Disable all other checkboxes.
        var nonSelectedOptions = $('#chapter4_selector option').filter(function() {
            return !$(this).is(':selected');
        });

        var dropdown = $('#chapter4_selector').siblings('.multiselect-container');
        nonSelectedOptions.each(function() {
            var input = $('input[value="' + $(this).val() + '"]');
            input.prop('disabled', true);
            input.parent('li').addClass('disabled');
        });
    } else {
        // Enable all checkboxes.
        var dropdown = $('#chapter4_selector').siblings('.multiselect-container');
        $('#chapter4_selector option').each(function() {
            var input = $('input[value="' + $(this).val() + '"]');
            input.prop('disabled', false);
            input.parent('li').addClass('disabled');
        });
    }
}

// format - { country: [women_paid_work, women_unpaid_work, men_paid_work, men_unpaid_work] }
var data = {'Canada': [{'y': 180, 'x': 'Canada', 'gender': 'women', 'survey_year': '(2010)'}, {'y': -257, 'x': 'Canada', 'gender': 'women', 'survey_year': '(2010)'}, {'y': 255, 'x': 'Canada', 'gender': 'men', 'survey_year': '(2010)'}, {'y': -170, 'x': 'Canada', 'gender': 'men', 'survey_year': '(2010)'}], 'Turkey': [{'y': 68, 'x': 'Turkey', 'gender': 'women', 'survey_year': '(2006)'}, {'y': -371, 'x': 'Turkey', 'gender': 'women', 'survey_year': '(2006)'}, {'y': 267, 'x': 'Turkey', 'gender': 'men', 'survey_year': '(2006)'}, {'y': -88, 'x': 'Turkey', 'gender': 'men', 'survey_year': '(2006)'}], 'Madagascar': [{'y': 233.79999999999998, 'x': 'Madagascar', 'gender': 'women', 'survey_year': '(2001)'}, {'y': -222.1, 'x': 'Madagascar', 'gender': 'women', 'survey_year': '(2001)'}, {'y': 350.1, 'x': 'Madagascar', 'gender': 'men', 'survey_year': '(2001)'}, {'y': -50.3, 'x': 'Madagascar', 'gender': 'men', 'survey_year': '(2001)'}], 'Italy': [{'y': 103, 'x': 'Italy', 'gender': 'women', 'survey_year': '(2008-09)'}, {'y': -305, 'x': 'Italy', 'gender': 'women', 'survey_year': '(2008-09)'}, {'y': 223, 'x': 'Italy', 'gender': 'men', 'survey_year': '(2008-09)'}, {'y': -108, 'x': 'Italy', 'gender': 'men', 'survey_year': '(2008-09)'}], 'Peru': [{'y': 183, 'x': 'Peru', 'gender': 'women', 'survey_year': '(2010)'}, {'y': -339, 'x': 'Peru', 'gender': 'women', 'survey_year': '(2010)'}, {'y': 361, 'x': 'Peru', 'gender': 'men', 'survey_year': '(2010)'}, {'y': -136, 'x': 'Peru', 'gender': 'men', 'survey_year': '(2010)'}], 'USA': [{'y': 166, 'x': 'USA', 'gender': 'women', 'survey_year': '(2013)'}, {'y': -252, 'x': 'USA', 'gender': 'women', 'survey_year': '(2013)'}, {'y': 252, 'x': 'USA', 'gender': 'men', 'survey_year': '(2013)'}, {'y': -163, 'x': 'USA', 'gender': 'men', 'survey_year': '(2013)'}], 'Serbia': [{'y': 129, 'x': 'Serbia', 'gender': 'women', 'survey_year': '(2010-11)'}, {'y': -301, 'x': 'Serbia', 'gender': 'women', 'survey_year': '(2010-11)'}, {'y': 227, 'x': 'Serbia', 'gender': 'men', 'survey_year': '(2010-11)'}, {'y': -148, 'x': 'Serbia', 'gender': 'men', 'survey_year': '(2010-11)'}], 'Panama': [{'y': 201, 'x': 'Panama', 'gender': 'women', 'survey_year': '(2011)'}, {'y': -301, 'x': 'Panama', 'gender': 'women', 'survey_year': '(2011)'}, {'y': 359, 'x': 'Panama', 'gender': 'men', 'survey_year': '(2011)'}, {'y': -128, 'x': 'Panama', 'gender': 'men', 'survey_year': '(2011)'}], 'Mali': [{'y': 217.36, 'x': 'Mali', 'gender': 'women', 'survey_year': '(2008)'}, {'y': -241.4, 'x': 'Mali', 'gender': 'women', 'survey_year': '(2008)'}, {'y': 307.6, 'x': 'Mali', 'gender': 'men', 'survey_year': '(2008)'}, {'y': -21.24, 'x': 'Mali', 'gender': 'men', 'survey_year': '(2008)'}], 'Lithuania': [{'y': 231, 'x': 'Lithuania', 'gender': 'women', 'survey_year': '(2003)'}, {'y': -308, 'x': 'Lithuania', 'gender': 'women', 'survey_year': '(2003)'}, {'y': 313, 'x': 'Lithuania', 'gender': 'men', 'survey_year': '(2003)'}, {'y': -166, 'x': 'Lithuania', 'gender': 'men', 'survey_year': '(2003)'}], 'Costa Rica': [{'y': 122, 'x': 'Costa Rica', 'gender': 'women', 'survey_year': '(2004)'}, {'y': -385, 'x': 'Costa Rica', 'gender': 'women', 'survey_year': '(2004)'}, {'y': 352, 'x': 'Costa Rica', 'gender': 'men', 'survey_year': '(2004)'}, {'y': -105, 'x': 'Costa Rica', 'gender': 'men', 'survey_year': '(2004)'}], 'Cambodia': [{'y': 270, 'x': 'Cambodia', 'gender': 'women', 'survey_year': '(2004)'}, {'y': -188, 'x': 'Cambodia', 'gender': 'women', 'survey_year': '(2004)'}, {'y': 390, 'x': 'Cambodia', 'gender': 'men', 'survey_year': '(2004)'}, {'y': -18, 'x': 'Cambodia', 'gender': 'men', 'survey_year': '(2004)'}], 'France': [{'y': 126, 'x': 'France', 'gender': 'women', 'survey_year': '(2010)'}, {'y': -234, 'x': 'France', 'gender': 'women', 'survey_year': '(2010)'}, {'y': 199, 'x': 'France', 'gender': 'men', 'survey_year': '(2010)'}, {'y': -148, 'x': 'France', 'gender': 'men', 'survey_year': '(2010)'}], 'Ethiopia': [{'y': 200, 'x': 'Ethiopia', 'gender': 'women', 'survey_year': '(2013)'}, {'y': -291, 'x': 'Ethiopia', 'gender': 'women', 'survey_year': '(2013)'}, {'y': 301, 'x': 'Ethiopia', 'gender': 'men', 'survey_year': '(2013)'}, {'y': -125, 'x': 'Ethiopia', 'gender': 'men', 'survey_year': '(2013)'}], 'Ireland': [{'y': 142, 'x': 'Ireland', 'gender': 'women', 'survey_year': '(2005)'}, {'y': -296, 'x': 'Ireland', 'gender': 'women', 'survey_year': '(2005)'}, {'y': 280, 'x': 'Ireland', 'gender': 'men', 'survey_year': '(2005)'}, {'y': -129, 'x': 'Ireland', 'gender': 'men', 'survey_year': '(2005)'}], 'Palestine': [{'y': 36, 'x': 'Palestine', 'gender': 'women', 'survey_year': '(2012-13)'}, {'y': -293, 'x': 'Palestine', 'gender': 'women', 'survey_year': '(2012-13)'}, {'y': 249, 'x': 'Palestine', 'gender': 'men', 'survey_year': '(2012-13)'}, {'y': -55, 'x': 'Palestine', 'gender': 'men', 'survey_year': '(2012-13)'}], 'Norway': [{'y': 181, 'x': 'Norway', 'gender': 'women', 'survey_year': '(2010)'}, {'y': -230, 'x': 'Norway', 'gender': 'women', 'survey_year': '(2010)'}, {'y': 250, 'x': 'Norway', 'gender': 'men', 'survey_year': '(2010)'}, {'y': -180, 'x': 'Norway', 'gender': 'men', 'survey_year': '(2010)'}], 'Thailand': [{'y': 268, 'x': 'Thailand', 'gender': 'women', 'survey_year': '(2009)'}, {'y': -188, 'x': 'Thailand', 'gender': 'women', 'survey_year': '(2009)'}, {'y': 360, 'x': 'Thailand', 'gender': 'men', 'survey_year': '(2009)'}, {'y': -55, 'x': 'Thailand', 'gender': 'men', 'survey_year': '(2009)'}], 'Ecuador': [{'y': 150, 'x': 'Ecuador', 'gender': 'women', 'survey_year': '(2012)'}, {'y': -273, 'x': 'Ecuador', 'gender': 'women', 'survey_year': '(2012)'}, {'y': 306, 'x': 'Ecuador', 'gender': 'men', 'survey_year': '(2012)'}, {'y': -78, 'x': 'Ecuador', 'gender': 'men', 'survey_year': '(2012)'}], 'Benin': [{'y': 283.52, 'x': 'Benin', 'gender': 'women', 'survey_year': '(1998)'}, {'y': -206.04, 'x': 'Benin', 'gender': 'women', 'survey_year': '(1998)'}, {'y': 267.71999999999997, 'x': 'Benin', 'gender': 'men', 'survey_year': '(1998)'}, {'y': -64.92, 'x': 'Benin', 'gender': 'men', 'survey_year': '(1998)'}], 'Ghana': [{'y': 230, 'x': 'Ghana', 'gender': 'women', 'survey_year': '(2009)'}, {'y': -220, 'x': 'Ghana', 'gender': 'women', 'survey_year': '(2009)'}, {'y': 288, 'x': 'Ghana', 'gender': 'men', 'survey_year': '(2009)'}, {'y': -68, 'x': 'Ghana', 'gender': 'men', 'survey_year': '(2009)'}], 'Australia': [{'y': 128, 'x': 'Australia', 'gender': 'women', 'survey_year': '(2006)'}, {'y': -311, 'x': 'Australia', 'gender': 'women', 'survey_year': '(2006)'}, {'y': 248, 'x': 'Australia', 'gender': 'men', 'survey_year': '(2006)'}, {'y': -172, 'x': 'Australia', 'gender': 'men', 'survey_year': '(2006)'}], 'Algeria': [{'y': 30, 'x': 'Algeria', 'gender': 'women', 'survey_year': '(2012)'}, {'y': -312, 'x': 'Algeria', 'gender': 'women', 'survey_year': '(2012)'}, {'y': 198, 'x': 'Algeria', 'gender': 'men', 'survey_year': '(2012)'}, {'y': -54, 'x': 'Algeria', 'gender': 'men', 'survey_year': '(2012)'}], 'El Salvador': [{'y': 192, 'x': 'El Salvador', 'gender': 'women', 'survey_year': '(2010)'}, {'y': -228, 'x': 'El Salvador', 'gender': 'women', 'survey_year': '(2010)'}, {'y': 346, 'x': 'El Salvador', 'gender': 'men', 'survey_year': '(2010)'}, {'y': -43, 'x': 'El Salvador', 'gender': 'men', 'survey_year': '(2010)'}], 'Slovenia': [{'y': 169, 'x': 'Slovenia', 'gender': 'women', 'survey_year': '(2000-01)'}, {'y': -286, 'x': 'Slovenia', 'gender': 'women', 'survey_year': '(2000-01)'}, {'y': 236, 'x': 'Slovenia', 'gender': 'men', 'survey_year': '(2000-01)'}, {'y': -166, 'x': 'Slovenia', 'gender': 'men', 'survey_year': '(2000-01)'}], 'China': [{'y': 263, 'x': 'China', 'gender': 'women', 'survey_year': '(2008)'}, {'y': -237, 'x': 'China', 'gender': 'women', 'survey_year': '(2008)'}, {'y': 360, 'x': 'China', 'gender': 'men', 'survey_year': '(2008)'}, {'y': -94, 'x': 'China', 'gender': 'men', 'survey_year': '(2008)'}], 'Armenia': [{'y': 101, 'x': 'Armenia', 'gender': 'women', 'survey_year': '(2004)'}, {'y': -312, 'x': 'Armenia', 'gender': 'women', 'survey_year': '(2004)'}, {'y': 291, 'x': 'Armenia', 'gender': 'men', 'survey_year': '(2004)'}, {'y': -63, 'x': 'Armenia', 'gender': 'men', 'survey_year': '(2004)'}], 'Oman': [{'y': 58, 'x': 'Oman', 'gender': 'women', 'survey_year': '(2007-08)'}, {'y': -274, 'x': 'Oman', 'gender': 'women', 'survey_year': '(2007-08)'}, {'y': 187, 'x': 'Oman', 'gender': 'men', 'survey_year': '(2007-08)'}, {'y': -115, 'x': 'Oman', 'gender': 'men', 'survey_year': '(2007-08)'}], 'Belgium': [{'y': 94, 'x': 'Belgium', 'gender': 'women', 'survey_year': '(2005)'}, {'y': -214, 'x': 'Belgium', 'gender': 'women', 'survey_year': '(2005)'}, {'y': 155, 'x': 'Belgium', 'gender': 'men', 'survey_year': '(2005)'}, {'y': -128, 'x': 'Belgium', 'gender': 'men', 'survey_year': '(2005)'}], 'Germany': [{'y': 134, 'x': 'Germany', 'gender': 'women', 'survey_year': '(2001-02)'}, {'y': -269, 'x': 'Germany', 'gender': 'women', 'survey_year': '(2001-02)'}, {'y': 222, 'x': 'Germany', 'gender': 'men', 'survey_year': '(2001-02)'}, {'y': -164, 'x': 'Germany', 'gender': 'men', 'survey_year': '(2001-02)'}], 'Iraq': [{'y': 31, 'x': 'Iraq', 'gender': 'women', 'survey_year': '(2007)'}, {'y': -345, 'x': 'Iraq', 'gender': 'women', 'survey_year': '(2007)'}, {'y': 246, 'x': 'Iraq', 'gender': 'men', 'survey_year': '(2007)'}, {'y': -56, 'x': 'Iraq', 'gender': 'men', 'survey_year': '(2007)'}], 'Tanzania': [{'y': 205, 'x': 'Tanzania', 'gender': 'women', 'survey_year': '(2006)'}, {'y': -212, 'x': 'Tanzania', 'gender': 'women', 'survey_year': '(2006)'}, {'y': 276, 'x': 'Tanzania', 'gender': 'men', 'survey_year': '(2006)'}, {'y': -73, 'x': 'Tanzania', 'gender': 'men', 'survey_year': '(2006)'}], 'Spain': [{'y': 128, 'x': 'Spain', 'gender': 'women', 'survey_year': '(2009-10)'}, {'y': -263, 'x': 'Spain', 'gender': 'women', 'survey_year': '(2009-10)'}, {'y': 205, 'x': 'Spain', 'gender': 'men', 'survey_year': '(2009-10)'}, {'y': -126, 'x': 'Spain', 'gender': 'men', 'survey_year': '(2009-10)'}], 'Iran (urban)': [{'y': 39.666666666666664, 'x': 'Iran (urban)', 'gender': 'women', 'survey_year': '(Average of three surveys)'}, {'y': -307.3333333333333, 'x': 'Iran (urban)', 'gender': 'women', 'survey_year': '(Average of three surveys)'}, {'y': 282.6666666666667, 'x': 'Iran (urban)', 'gender': 'men', 'survey_year': '(Average of three surveys)'}, {'y': -77.66666666666666, 'x': 'Iran (urban)', 'gender': 'men', 'survey_year': '(Average of three surveys)'}], 'Kyrgyzstan': [{'y': 163, 'x': 'Kyrgyzstan', 'gender': 'women', 'survey_year': '(2010)'}, {'y': -275, 'x': 'Kyrgyzstan', 'gender': 'women', 'survey_year': '(2010)'}, {'y': 267, 'x': 'Kyrgyzstan', 'gender': 'men', 'survey_year': '(2010)'}, {'y': -100, 'x': 'Kyrgyzstan', 'gender': 'men', 'survey_year': '(2010)'}], 'Netherlands': [{'y': 146, 'x': 'Netherlands', 'gender': 'women', 'survey_year': '(2005-06)'}, {'y': -254, 'x': 'Netherlands', 'gender': 'women', 'survey_year': '(2005-06)'}, {'y': 279, 'x': 'Netherlands', 'gender': 'men', 'survey_year': '(2005-06)'}, {'y': -133, 'x': 'Netherlands', 'gender': 'men', 'survey_year': '(2005-06)'}], 'UK': [{'y': 145, 'x': 'UK', 'gender': 'women', 'survey_year': '(2005)'}, {'y': -232, 'x': 'UK', 'gender': 'women', 'survey_year': '(2005)'}, {'y': 233, 'x': 'UK', 'gender': 'men', 'survey_year': '(2005)'}, {'y': -131, 'x': 'UK', 'gender': 'men', 'survey_year': '(2005)'}], 'Denmark': [{'y': 147, 'x': 'Denmark', 'gender': 'women', 'survey_year': '(2001)'}, {'y': -243, 'x': 'Denmark', 'gender': 'women', 'survey_year': '(2001)'}, {'y': 211, 'x': 'Denmark', 'gender': 'men', 'survey_year': '(2001)'}, {'y': -186, 'x': 'Denmark', 'gender': 'men', 'survey_year': '(2001)'}], 'Poland': [{'y': 136, 'x': 'Poland', 'gender': 'women', 'survey_year': '(2003-04)'}, {'y': -295, 'x': 'Poland', 'gender': 'women', 'survey_year': '(2003-04)'}, {'y': 234, 'x': 'Poland', 'gender': 'men', 'survey_year': '(2003-04)'}, {'y': -157, 'x': 'Poland', 'gender': 'men', 'survey_year': '(2003-04)'}], 'Finland': [{'y': 162, 'x': 'Finland', 'gender': 'women', 'survey_year': '(2009)'}, {'y': -211, 'x': 'Finland', 'gender': 'women', 'survey_year': '(2009)'}, {'y': 202, 'x': 'Finland', 'gender': 'men', 'survey_year': '(2009)'}, {'y': -139, 'x': 'Finland', 'gender': 'men', 'survey_year': '(2009)'}], 'Mauritius': [{'y': 116, 'x': 'Mauritius', 'gender': 'women', 'survey_year': '(2003)'}, {'y': -277, 'x': 'Mauritius', 'gender': 'women', 'survey_year': '(2003)'}, {'y': 296, 'x': 'Mauritius', 'gender': 'men', 'survey_year': '(2003)'}, {'y': -73, 'x': 'Mauritius', 'gender': 'men', 'survey_year': '(2003)'}], 'Morocco': [{'y': 81, 'x': 'Morocco', 'gender': 'women', 'survey_year': '(2011-12)'}, {'y': -300, 'x': 'Morocco', 'gender': 'women', 'survey_year': '(2011-12)'}, {'y': 325, 'x': 'Morocco', 'gender': 'men', 'survey_year': '(2011-12)'}, {'y': -43, 'x': 'Morocco', 'gender': 'men', 'survey_year': '(2011-12)'}], 'Sweden': [{'y': 201, 'x': 'Sweden', 'gender': 'women', 'survey_year': '(2010-11)'}, {'y': -240, 'x': 'Sweden', 'gender': 'women', 'survey_year': '(2010-11)'}, {'y': 245, 'x': 'Sweden', 'gender': 'men', 'survey_year': '(2010-11)'}, {'y': -194, 'x': 'Sweden', 'gender': 'men', 'survey_year': '(2010-11)'}], 'Korea': [{'y': 145, 'x': 'Korea', 'gender': 'women', 'survey_year': '(2009)'}, {'y': -188, 'x': 'Korea', 'gender': 'women', 'survey_year': '(2009)'}, {'y': 246, 'x': 'Korea', 'gender': 'men', 'survey_year': '(2009)'}, {'y': -39, 'x': 'Korea', 'gender': 'men', 'survey_year': '(2009)'}], 'Mongolia': [{'y': 238, 'x': 'Mongolia', 'gender': 'women', 'survey_year': '(2011)'}, {'y': -286, 'x': 'Mongolia', 'gender': 'women', 'survey_year': '(2011)'}, {'y': 348, 'x': 'Mongolia', 'gender': 'men', 'survey_year': '(2011)'}, {'y': -131, 'x': 'Mongolia', 'gender': 'men', 'survey_year': '(2011)'}], 'Japan': [{'y': 165, 'x': 'Japan', 'gender': 'women', 'survey_year': '(2011)'}, {'y': -254, 'x': 'Japan', 'gender': 'women', 'survey_year': '(2011)'}, {'y': 330, 'x': 'Japan', 'gender': 'men', 'survey_year': '(2011)'}, {'y': -77, 'x': 'Japan', 'gender': 'men', 'survey_year': '(2011)'}], 'Uruguay': [{'y': 0, 'x': 'Uruguay', 'gender': 'women', 'survey_year': '(2013)'}, {'y': -309, 'x': 'Uruguay', 'gender': 'women', 'survey_year': '(2013)'}, {'y': 0, 'x': 'Uruguay', 'gender': 'men', 'survey_year': '(2013)'}, {'y': -133, 'x': 'Uruguay', 'gender': 'men', 'survey_year': '(2013)'}], 'New Zealand': [{'y': 143, 'x': 'New Zealand', 'gender': 'women', 'survey_year': '(2009-2010)'}, {'y': -247, 'x': 'New Zealand', 'gender': 'women', 'survey_year': '(2009-2010)'}, {'y': 254, 'x': 'New Zealand', 'gender': 'men', 'survey_year': '(2009-2010)'}, {'y': -141, 'x': 'New Zealand', 'gender': 'men', 'survey_year': '(2009-2010)'}], 'Bulgaria': [{'y': 137, 'x': 'Bulgaria', 'gender': 'women', 'survey_year': '(2009-10)'}, {'y': -298, 'x': 'Bulgaria', 'gender': 'women', 'survey_year': '(2009-10)'}, {'y': 190, 'x': 'Bulgaria', 'gender': 'men', 'survey_year': '(2009-10)'}, {'y': -164, 'x': 'Bulgaria', 'gender': 'men', 'survey_year': '(2009-10)'}], 'Pakistan': [{'y': 78, 'x': 'Pakistan', 'gender': 'women', 'survey_year': '(2007)'}, {'y': -287, 'x': 'Pakistan', 'gender': 'women', 'survey_year': '(2007)'}, {'y': 322, 'x': 'Pakistan', 'gender': 'men', 'survey_year': '(2007)'}, {'y': -28, 'x': 'Pakistan', 'gender': 'men', 'survey_year': '(2007)'}], 'Romania': [{'y': 100, 'x': 'Romania', 'gender': 'women', 'survey_year': '(2011-12)'}, {'y': -264, 'x': 'Romania', 'gender': 'women', 'survey_year': '(2011-12)'}, {'y': 163, 'x': 'Romania', 'gender': 'men', 'survey_year': '(2011-12)'}, {'y': -125, 'x': 'Romania', 'gender': 'men', 'survey_year': '(2011-12)'}], 'Albania': [{'y': 117, 'x': 'Albania', 'gender': 'women', 'survey_year': '(2010-11)'}, {'y': -314, 'x': 'Albania', 'gender': 'women', 'survey_year': '(2010-11)'}, {'y': 257, 'x': 'Albania', 'gender': 'men', 'survey_year': '(2010-11)'}, {'y': -52, 'x': 'Albania', 'gender': 'men', 'survey_year': '(2010-11)'}], 'Portugal': [{'y': 178, 'x': 'Portugal', 'gender': 'women', 'survey_year': '(1999)'}, {'y': -302, 'x': 'Portugal', 'gender': 'women', 'survey_year': '(1999)'}, {'y': 298, 'x': 'Portugal', 'gender': 'men', 'survey_year': '(1999)'}, {'y': -77, 'x': 'Portugal', 'gender': 'men', 'survey_year': '(1999)'}], 'Estonia': [{'y': 161, 'x': 'Estonia', 'gender': 'women', 'survey_year': '(2009-10)'}, {'y': -261, 'x': 'Estonia', 'gender': 'women', 'survey_year': '(2009-10)'}, {'y': 197, 'x': 'Estonia', 'gender': 'men', 'survey_year': '(2009-10)'}, {'y': -169, 'x': 'Estonia', 'gender': 'men', 'survey_year': '(2009-10)'}], 'Mexico': [{'y': 172, 'x': 'Mexico', 'gender': 'women', 'survey_year': '(2009)'}, {'y': -442, 'x': 'Mexico', 'gender': 'women', 'survey_year': '(2009)'}, {'y': 381, 'x': 'Mexico', 'gender': 'men', 'survey_year': '(2009)'}, {'y': -155, 'x': 'Mexico', 'gender': 'men', 'survey_year': '(2009)'}], 'Tunisia': [{'y': 108, 'x': 'Tunisia', 'gender': 'women', 'survey_year': '(2005-06)'}, {'y': -326, 'x': 'Tunisia', 'gender': 'women', 'survey_year': '(2005-06)'}, {'y': 298, 'x': 'Tunisia', 'gender': 'men', 'survey_year': '(2005-06)'}, {'y': -54, 'x': 'Tunisia', 'gender': 'men', 'survey_year': '(2005-06)'}], 'South Africa': [{'y': 129, 'x': 'South Africa', 'gender': 'women', 'survey_year': '(2010)'}, {'y': -229, 'x': 'South Africa', 'gender': 'women', 'survey_year': '(2010)'}, {'y': 214, 'x': 'South Africa', 'gender': 'men', 'survey_year': '(2010)'}, {'y': -98, 'x': 'South Africa', 'gender': 'men', 'survey_year': '(2010)'}], 'India': [{'y': 160, 'x': 'India', 'gender': 'women', 'survey_year': '(1998-99)'}, {'y': -297, 'x': 'India', 'gender': 'women', 'survey_year': '(1998-99)'}, {'y': 360, 'x': 'India', 'gender': 'men', 'survey_year': '(1998-99)'}, {'y': -31, 'x': 'India', 'gender': 'men', 'survey_year': '(1998-99)'}], 'Qatar': [{'y': 120, 'x': 'Qatar', 'gender': 'women', 'survey_year': '(2012-13)'}, {'y': -199, 'x': 'Qatar', 'gender': 'women', 'survey_year': '(2012-13)'}, {'y': 229, 'x': 'Qatar', 'gender': 'men', 'survey_year': '(2012-13)'}, {'y': -110, 'x': 'Qatar', 'gender': 'men', 'survey_year': '(2012-13)'}], 'Austria': [{'y': 160, 'x': 'Austria', 'gender': 'women', 'survey_year': '(2008-09)'}, {'y': -269, 'x': 'Austria', 'gender': 'women', 'survey_year': '(2008-09)'}, {'y': 264, 'x': 'Austria', 'gender': 'men', 'survey_year': '(2008-09)'}, {'y': -146, 'x': 'Austria', 'gender': 'men', 'survey_year': '(2008-09)'}], 'Latvia': [{'y': 234, 'x': 'Latvia', 'gender': 'women', 'survey_year': '(2003)'}, {'y': -277, 'x': 'Latvia', 'gender': 'women', 'survey_year': '(2003)'}, {'y': 337, 'x': 'Latvia', 'gender': 'men', 'survey_year': '(2003)'}, {'y': -143, 'x': 'Latvia', 'gender': 'men', 'survey_year': '(2003)'}], 'Colombia': [{'y': 151, 'x': 'Colombia', 'gender': 'women', 'survey_year': '(2012-13)'}, {'y': -239, 'x': 'Colombia', 'gender': 'women', 'survey_year': '(2012-13)'}, {'y': 311, 'x': 'Colombia', 'gender': 'men', 'survey_year': '(2012-13)'}, {'y': -67, 'x': 'Colombia', 'gender': 'men', 'survey_year': '(2012-13)'}], 'Greece': [{'y': 78, 'x': 'Greece', 'gender': 'women', 'survey_year': '(2013-14)'}, {'y': -277, 'x': 'Greece', 'gender': 'women', 'survey_year': '(2013-14)'}, {'y': 152, 'x': 'Greece', 'gender': 'men', 'survey_year': '(2013-14)'}, {'y': -107, 'x': 'Greece', 'gender': 'men', 'survey_year': '(2013-14)'}], 'Hungary': [{'y': 171, 'x': 'Hungary', 'gender': 'women', 'survey_year': '(1999-2000)'}, {'y': -268, 'x': 'Hungary', 'gender': 'women', 'survey_year': '(1999-2000)'}, {'y': 261, 'x': 'Hungary', 'gender': 'men', 'survey_year': '(1999-2000)'}, {'y': -127, 'x': 'Hungary', 'gender': 'men', 'survey_year': '(1999-2000)'}]};
