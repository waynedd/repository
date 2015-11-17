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
        var para = "content=" + escape($(this).attr("id")) + "&group=affiliation";
        search_content = $(this).attr("id");
        search_type = "affiliation";
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
    // search in page
    $("#searchScholarButton").click(function () {
        var c = $("#searchText").val();
        alert(c);
        $("td").each( function(index) {
            //alert($(this).text());
            if( $(this).text() == c ) {
                alert("find " + c);
            }
        });
    });
});

/*
 *	dealing with author's affiliation and country
 */
function prepareAuthor(author) {
    var ja = eval( author );

    var s1 = ja[0].affiliation == null ? "" : ja[0].affiliation ;
    var s2 = ja[0].country == null ? "" : ", " + ja[0].country ;
    var full = s1 + s2 ;

    var email = ja[0].email == null ? "" : ja[0].email ;
    var homepage = ja[0].homepage == null ? "" : ja[0].homepage ;

    var str = "";
    if( email != "" )
        str += "<i class='fa fa-envelope-o fa-fw'></i> " + email ;
    if( homepage != "" )
        str += "&nbsp; | &nbsp;<a href='" + homepage + "' target = '_blank'>homepage</a>";
    $("#author_aff").html("<p>" + full + "</p>");
    $("#author_contact").html("<p class='pull-right'>" + str + "</p>");
    $("#author_aff").show();
    $("#author_contact").show();

}