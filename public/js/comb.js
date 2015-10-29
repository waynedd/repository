/*
 * 控制分页
 * 用于search, author, field , pub
 *
 * #top_main : 头部导航返回
 * #left_back : 左侧导航返回
 * #pa : 头部导航条
 * 
 * .added : 表格加入项
 * .pagecadd : 分页数加入项
 * 
 * #main_list : 主要显示列表
 * #result_list : 结果列表
 * #rstable : 显示结果的表格
 * 
 * #search_page : 分页列表
 * #search_page_pre, #search_page_net : 上一页，下一页
 */
var json ;
var json_data ;
var pagesize = 15 ;  // the size of each page
var page ;           // the number of pages
var count = 5 ;      // page interval
var current ;        // current page

$(document).ready(function() {
	/*
	 * clear result table for author, field and publication
	 */
	$("#pa_main").click(function() { 
		$("#pa").hide();
		$(".added").empty();
		$(".pagecadd").empty();
		$("#result_list").hide();
		$("#search_page").hide();
		$("#main_list").show();
	});
	
	$("#left_back").click(function() {
		$("#pa").hide();
		$(".added").empty();
		$(".pagecadd").empty();
		$("#result_list").hide();
		$("#search_page").hide();
		$("#main_list").show();
	});
	
	/*
	 * previous and next page
	 */
	$("#search_page_pre").click(function() {
		if( $(this).hasClass("disabled") ) {
			event.preventDefault();
		}
		else {
			current = parseInt(current) - 1 ;
			showpagecount();
		}
	});
	
	$("#search_page_nxt").click(function() {
		if( $(this).hasClass("disabled") ) {
			event.preventDefault();
		}
		else {
			current = parseInt(current) + 1 ;
			showpagecount();
		}
	});
	
	/*
	 * page click
	 */
	$(document).on("click", ".pagecadd", function() {
		//alert(current);
		if( parseInt($(this).attr("id")) == current ) {
			//alert('User clicked on "foo ' + $(this).attr("id") );
			event.preventDefault();
		}
		else {
			current = $(this).attr("id") ;
			showpagecount();
		}
	});
	
	/*
	 * Cite Download
	$("#downbtn").click(function() { 
		//alert(json_data);
		json_data = json_data.replace(/\&/g,"%26"); 
		$.ajax({
			url : "citeAction.action",
			type : "post",
			data: "jsda=" + json_data ,
			success : function() {
				//location.href = "CiteList.txt";
				location.href = "downAction.action" ; 
			}
		}); 	
	});*/
});

/*
 * current - 当前页码
 * count - 最大显示页码数
 * pagecadd - 分页显示Class属性
 * search_page_pre ， search_page_nxt - 上一页，下一页
 */
function showpagecount() {
	if( parseInt(current) < count-1 || page <= count - 1 ) {
		$(".pagecadd").empty();
		if( parseInt(current) == 1 ) {
			$("#search_page_pre").after("<li id='1' class='active pagecadd'><a href='#'>1 <span class='sr-only'>(current)</span></a></li>");
			$("#search_page_pre").addClass("disabled");
		}
		else {
			$("#search_page_pre").after("<li id='1' class='pagecadd'><a href='#'>1</a></li>");
			$("#search_page_pre").removeClass("disabled");
		}	
		for( var i=2 ; i<=page && i<=count ; i++ ) {
			if( i == parseInt(current) ) 
				$("#search_page_nxt").before("<li id='"+i+"' class='active pagecadd'><a href='#'>"+i+" <span class='sr-only'>(current)</span></a></li>");
			else
				$("#search_page_nxt").before("<li id='"+i+"' class='pagecadd'><a href='#'>"+i+"</a></li>");
		}
		if( page > count ) {
			$("#search_page_nxt").before("<li id='"+page+"' class='pagecadd'><a href='#'>Last</a></li>");
		}
		if( current == page )
			$("#search_page_nxt").addClass("disabled");
		else
			$("#search_page_nxt").removeClass("disabled");
		showpage(json,current);
	}
	else if( parseInt(current) >= count-1 && parseInt(current) <= page-parseInt(count/2)-1 ){		
		$(".pagecadd").empty();
		$("#search_page_pre").after("<li id='1' class='pagecadd'><a href='#'>First</a></li>");
		for( var i=parseInt(current)-parseInt(count/2) ; i<=parseInt(current)+parseInt(count/2) ; i++ ) {
			if( i == parseInt(current) ) 
				$("#search_page_nxt").before("<li id='"+i+"' class='active pagecadd'><a href='#'>"+i+" <span class='sr-only'>(current)</span></a></li>");
			else	
			    $("#search_page_nxt").before("<li id='"+i+"' class='pagecadd'><a href='#'>"+i+"</a></li>");
		}
		$("#search_page_nxt").before("<li id='"+page+"' class='pagecadd'><a href='#'>Last</a></li>");
		$("#search_page_nxt").removeClass("disabled");
		showpage(json,current);
	}
	else {
		$(".pagecadd").empty();
		$("#search_page_pre").after("<li id='1' class='pagecadd'><a href='#'>First</a></li>");
		for( var i=parseInt(page-count)+1 ; i<=parseInt(page) ; i++ ) {
			if( i == parseInt(current) ) 
				$("#search_page_nxt").before("<li id='"+i+"' class='active pagecadd'><a href='#'>"+i+" <span class='sr-only'>(current)</span></a></li>");
			else	
			    $("#search_page_nxt").before("<li id='"+i+"' class='pagecadd'><a href='#'>"+i+"</a></li>");
		}
		if( current == page )
			$("#search_page_nxt").addClass("disabled");
		else
			$("#search_page_nxt").removeClass("disabled");
		showpage(json,current);
	}
}

/*
 *	dealing with authors
 */
function prepareauthor(author) {
	var ja = eval( author );

    var full = ja[0].affiliation + ", " + ja[0].country ;
    var email = ja[0].email == null ? "" : ja[0].email ;
    var homepage = ja[0].homepage == null ? "" : ja[0].homepage ;

	$("#author_aff").html("<p>" + full + "</p>");
	var str = "";
	if( email != "" ) {
		str += "<i class='fa fa-envelope-o fa-fw'></i> " + email ;
	}
	if( homepage != "" ) {
		str += "&nbsp; | &nbsp;<a href='" + homepage + "' target = '_blank'>homepage</a>";
	}
	$("#author_contact").html("<p class='pull-right'>" + str + "</p>");
}

/*
 * make the result show
 * for all | index | author | field | publication
 */
var search_now = "" ;   // search content
var search_type = "" ;  // all | index | author | field | publication

function showsearh(data) {

    json = eval( data );
	json_data = data ;

    // waiting end
	$("#wait").hide();

    // when searching index, it may return nothing
    if (search_type == "index" ) {
        if (json == "") {
            $("#sh1").hide();
            $("#sh2").hide();
            $("#search_none").fadeIn("slow");
            return;
        }
    }

	page = parseInt(( json.length + pagesize - 1 ) / pagesize) ;
	current = 1 ;

	showpage(json, current);
	
	if( page > 1 ) {
		$("#search_page_pre").addClass("disabled");	
		$("#search_page_pre").after("<li id='1' class='active pagecadd'><a href='#'>1 <span class='sr-only'>(current)</span></a></li>");
		for( var i=2 ; i<=page && i<=count ; i++ ) {
			$("#search_page_nxt").before("<li id='"+i+"' class='pagecadd'><a href='#'>"+i+"</a></li>");
		}
		if( page > count ) {
			$("#search_page_nxt").before("<li id='"+page+"' class='pagecadd'><a href='#'>Last</a></li>");
		}
		$("#search_page").show("slow");	
	}
}

function showpage(json, num) {
	$(".added").empty();
	var start = ( num - 1 ) *  pagesize ;
    var doi_text = "" ;

	for(var i = start ; i < start + pagesize && i < json.length ; i++ ) {
        if( json[i].doi != "" ) {
			doi_text = "<a class='red_link' href='http://dx.doi.org/" + json[i].doi + "' target='_blank'>DOI</a>" ;
		}
        else {
			doi_text = "DOI" ;
        }
        // new row in table
        $("#rstable").append("<tr class='added'><td>" + (i+1) + "</td><td>" +
            "<div class='row'>" +
                "<div class='col-md-12'>" +
                    "<p>" + json[i].author + "</p>" +
                    "<p><strong>" + json[i].title + "</strong></p>" +
                    "<p><em>" + getFullPublication( json[i] ) + "</em></p>" +
                "</div>" +
            "</div>" +
            "<div class='row'>" +
                "<div class='col-md-12'>" +
                    "<p class='pull-right' id='accordion'>" +
                    "<a class='red_link' data-toggle='collapse' data-parent='#accordion' href='#b_collapse" + i + "'>BibTex</a>&nbsp;&nbsp;|&nbsp;&nbsp;" +
                    doi_text + "</p>" +
                "</div>" +
            "</div>" +
            "<div class='row'>" +
                "<div id='b_collapse" + i + "' class='col-md-12 panel panel-default collapse'>" +
                    "<div class='panel-body'>" + getBibEntry(json[i]) +"</div>" +
                "</div>" +
            "</div>" +
            "</td></tr>") ;
    }

	// show result
    // search whole paper and index will not run followings
	if( search_type != "all" || search_type != "index") {
		$("#pa_main").html("<a href='#'>" + search_type + "</a>");
		$("#pa_name").html(search_now);
	}
	
	$("#pa").fadeIn("slow");
    // if searching index, the sta will show the search content, else, the content has been shown in main_list
    if( search_type == "index" ) {
        $("#sta").html("<p>searching for <strong class='text-success'>" + search_now +
        "</strong>, and <span class='label label-success'>" + json.length + "</span> papers included</p>");
    }
    else {
        $("#sta").html("<p><span class='label label-success'>" + json.length + "</span> papers included</p>");
    }
    $("#result_list").fadeIn("slow") ;
}

// get full publication text
function getFullPublication( jn ) {
	var type = jn.type ;
	var publication = jn.publication ;
	var abbr = jn.abbr ;
	var vol = jn.vol ;
	var no = jn.no ;
	var pages = jn.pages ;
	var year = jn.year ;

	if( abbr != null && abbr != "Phd" && abbr != "Book" && abbr != "Tech" && abbr != "Computer" && abbr != "Software")
		publication += " (" +  abbr + ")" ;

	if( type == "article" ) {
		return publication + ", " + vol + "(" + no + "): " + pages + ", " + year ;
	}
	else if( type == "inproceedings" ) {
		return publication + ", pp." + pages + ", " + year ;
	}
	else if( type == "phdthesis" || type == "book" ) {
		return publication + ", " + year ;
	}
	else if( type == "techreport" ) {
		return publication + ", " + no + ", " + year ;
	}
	else {
		return publication + ", " + year ;
	}
}

// get bib entry for html
function getBibEntry( jn ) {
	var re = "" ;
	/*
	@article{$bib,
		author = {$author},
		title = {$title},
		journal = {$publication},
		volume = {$vol},
		number = {$no},
		pages = {$pages},
		year = {$year},
		doi = {$doi}
	}
	*/
	if( jn.type == "article" ) {
		re += "@article{" + jn.bib + ",<br/>" +
		"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;author = {" + jn.author + "},<br/>" +
		"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;title = {" + jn.title + "},<br/>" +
		"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;journal = {" + jn.publication + "},<br/>" +
		"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;volume = {" + jn.vol + "},<br/>" +
		"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;number = {" + jn.no + "},<br/>" +
		"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;pages = {" + jn.pages + "},<br/>" +
		"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;year = {" + jn.year + "},<br/>" +
		"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;doi = {" + jn.doi + "}<br/>" +
		"}";
	}
	/*
	@inproceedings{$bib,
		author = {$author},
		title = {$title},
		booktitle = {$publication},
		pages = {$pages},
		year = {$year},
		doi = {$doi}
	}
	*/
	else if( jn.type == "inproceedings" ) {
		re += "@inproceedings{" + jn.bib + ",<br/>" +
		"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;author = {" + jn.author + "},<br/>" +
		"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;title = {" + jn.title + "},<br/>" +
		"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;booktitle = {" + jn.publication + "},<br/>" +
		"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;pages = {" + jn.pages + "},<br/>" +
		"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;year = {" + jn.year + "},<br/>" +
		"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;doi = {" + jn.doi + "}<br/>" +
		"}";
	}
	/*
	@inproceedings{$bib,
		author = {$author},
		title = {$title},
		school = {$publication},
		year = {$year}
	}
	*/
	else if( jn.type == "phdthesis" ) {
		re += "@phdthesis{" + jn.bib + ",<br/>" +
		"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;author = {" + jn.author + "},<br/>" +
		"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;title = {" + jn.title + "},<br/>" +
		"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;school = {" + jn.publication + "},<br/>" +
		"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;year = {" + jn.year + "}<br/>" +
		"}";
	}
	/*
	@techreport{$bib,
		author = {$author},
		title = {$title},
		institution = {$publication},
		number = {$no},
		year = {$year}
	}
	*/
	else if( jn.type == "techreport" ) {
		re += "@techreport{" + jn.bib + ",<br/>" +
		"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;author = {" + jn.author + "},<br/>" +
		"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;title = {" + jn.title + "},<br/>" +
		"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;institution = {" + jn.publication + "},<br/>" +
		"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;number = {" + jn.no + "},<br/>" +
		"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;year = {" + jn.year + "}<br/>" +
		"}";
	}
	else {
		re = "no bib citation" ;
	}
	return re ;
}




