/**
 * control the view of scholar page
 */
$(document).ready(function () {
    // search paper by author
    $(".auTD a[id]").click(function () {
        var para = "content=" + $(this).attr("id") + "&group=author";
        search_content = $(this).attr("id");
        search_type = "author";
        $("#wait").show();
        $("#main_list").hide();
        $.ajax({
            url: "action/author_info",
            type: "post",
            dataType: "json",
            data: para,
            success: prepareAuthor
        });
        $.ajax({
            url: "action/query",
            type: "post",
            dataType: "json",
            data: para,
            success: showSearchResult
        });
    });
    // search paper by affiliation
    $(".afTD a[id]").click(function () {
        var para = "content=" + escape($(this).attr("id")) + "&group=institution";
        search_content = $(this).attr("id");
        search_type = "institution";
        $("#wait").show();
        $("#main_list").hide();
        $.ajax({
            url: "action/query",
            type: "post",
            dataType: "json",
            data: para,
            success: showSearchResult
        });
    });
    // search paper by country
    $(".coTD a[id]").click(function () {
        var para = "content=" + $(this).attr("id") + "&group=country";
        search_content = $(this).attr("id");
        search_type = "country";
        $("#wait").show();
        $("#main_list").hide();
        $.ajax({
            url: "action/query",
            type: "post",
            dataType: "json",
            data: para,
            success: showSearchResult
        });
    });
});

/*
 *	dealing with author's affiliation and country
 */
function prepareAuthor(data) {
    var ja = eval( data.basicInfo );
    var jb = eval( data.focusField );

    // basicInfo
    var s1 = ja[0].institution == null ? "" : ja[0].institution ;
    var s2 = ja[0].country == null ? "" : ", " + ja[0].country ;
    var full = s1 + s2 ;

    var email = ja[0].email == null ? "" : ja[0].email ;
    var homepage = ja[0].homepage == null ? "" : ja[0].homepage ;

    var jaStr = "";
    if( email != "" )
        jaStr += '<i class="fa fa-envelope-o fa-fw"></i> ' + email ;
    if( homepage != "" )
        jaStr += '&nbsp; | &nbsp;<a href="' + homepage + '" target = "_blank">homepage</a>';

    // focusField
    $("#author_field").children().attr("class","label label-default");
    jb.forEach( function(each) {
        $("#af_"+each.field).attr("class", "label label-warning");
    });

    $("#author_aff").html("<p>" + full + "</p>");
    $("#author_contact").html("<p class='pull-right'>" + jaStr + "</p>");
    $("#author_info").show();
}