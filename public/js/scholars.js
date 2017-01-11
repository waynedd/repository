/**
 *  Control the view of scholar page
 */
$(document).ready(function () {
    // search paper by author
    $('.auTD a[id]').click(function () {
        start = 0;
        ct_url = 'action/query';
        ct_para = {start: start, step: step, content: $(this).attr('id'), group: 'scholar'};
        search_content = $(this).attr('id');
        search_type = 'scholar';
        $('#main_list').hide();
        $.ajax({
            url: 'action/scholar_info',
            type: 'post',
            dataType: 'json',
            data: {start: start, step: step, content: $(this).attr('id'), group: 'scholar'},
            success: prepareAuthor
        });
        makeRequest();
    });

    // search paper by affiliation
    $('.afTD a[id]').click(function () {
        start = 0;
        ct_url = 'action/query';
        ct_para = {start: start, step: step, content: $(this).attr('id'), group: 'institution'};
        search_content = $(this).attr('id');
        search_type = 'institution';
        $('#main_list').hide();
        makeRequest();
    });

    // search paper by country
    $('.coTD a[id]').click(function () {
        start = 0;
        ct_url = 'action/query';
        ct_para = {start: start, step: step, content: $(this).attr('id'), group: 'country'};
        search_content = $(this).attr('id');
        search_type = 'country';
        $('#main_list').hide();
        makeRequest();
    });
});

/*
 *	Deal with author's institution and country
 */
function prepareAuthor(data) {
    var ja = eval( data.basicInfo );
    var jb = eval( data.focusField );

    // basic information
    var s1 = ja[0].institution == null ? '' : ja[0].institution ;
    var s2 = ja[0].country == null ? '' : ', ' + ja[0].country ;
    var full = s1 + s2 ;

    var email = ja[0].email == null ? '' : ja[0].email ;
    var homepage = ja[0].homepage == null ? '' : ja[0].homepage ;

    var jaStr = '';
    if( email != '' )
        jaStr += '<i class="fa fa-envelope-o fa-fw"></i> ' + email ;
    if( homepage != '' )
        jaStr += '&nbsp; | &nbsp;<a href="' + homepage + '" target = "_blank">homepage</a>';

    // the focus field
    $('#author_field').children().attr('class','label label-default');
    jb.forEach( function(each) {
        $('#af_'+each.field).attr('class', 'label label-warning');
    });

    $('#author_aff').html('<p>' + full + '</p>');
    $('#author_contact').html('<p class="pull-right">' + jaStr + '</p>');
    $('#author_info').show();
}