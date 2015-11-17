/*
 * 控制分页
 * 用于search, author, field , pub
 *
 * #top_main : 头部导航返回
 * #left_back : 左侧导航返回
 * #pa : 头部导航条
 * 
 * .added : 表格加入项
 * .page_add : 分页数加入项
 * 
 * #main_list : 主要显示列表
 * #result_paper : 结果列表
 * #rstable : 显示结果的表格
 * 
 * #result_page : 分页列表
 * #result_page_pre, #search_page_net : 上一页，下一页
 */
var json ;
var jsonData ;
var pageSize = 15 ;  // the size of each page
var page ;           // the number of pages
var count = 5 ;      // page interval
var current ;        // current page

$(document).ready(function() {
	/*
	 * clear result table for author, field and booktitle
	 */
	$("#result_info_type").click(function () {
        $("#result_info").hide();
        $(".added").empty();
        $(".page_add").empty();
        $("#result_paper").hide();
        $("#result_page").hide();
        $("#main_list").show();
    });
	
	$("#left_back").click(function() {
		$("#result_info").hide();
		$(".added").empty();
		$(".page_add").empty();
		$("#result_paper").hide();
		$("#result_page").hide();
		$("#main_list").show();
	});
	
	/*
	 *  click previous and next page
	 */
	$("#result_page_pre").click(function() {
		if( $(this).hasClass("disabled") ) {
			event.preventDefault();
		}
		else {
			current = parseInt(current) - 1 ;
			showPageCount();
		}
	});
	
	$("#result_page_next").click(function() {
		if( $(this).hasClass("disabled") ) {
			event.preventDefault();
		}
		else {
			current = parseInt(current) + 1 ;
			showPageCount();
		}
	});
	
	/*
	 *  click page
	 */
	$(document).on("click", ".page_add", function() {
		//alert(current);
		if( parseInt($(this).attr("id")) == current ) {
			//alert('User clicked on "foo ' + $(this).attr("id") );
			event.preventDefault();
		}
		else {
			current = $(this).attr("id") ;
			showPageCount();
		}
	});
});

/*
 *  current: current page number
 *  count: the maximum page number to show
 *  page_add: (class) the new items that have been added
 *  result_page_pre
 *  result_page_next
 */
function showPageCount() {
    // condition 1
    if( parseInt(current) < count-1 || page <= count - 1 ) {
        $(".page_add").empty();
		if( parseInt(current) == 1 ) {
			$("#result_page_pre").after("<li id='1' class='active page_add'><a href='#'>1 <span class='sr-only'>(current)</span></a></li>")
                                 .addClass("disabled");
		}
		else {
			$("#result_page_pre").after("<li id='1' class='page_add'><a href='#'>1</a></li>")
                                 .removeClass("disabled");
		}
		for( var k1=2 ; k1<=page && k1<=count ; k1++ ) {
			if( k1 == parseInt(current) )
                $("#result_page_next").before("<li id='"+k1+"' class='active page_add'><a href='#'>"+k1+" <span class='sr-only'>(current)</span></a></li>");
			else
				$("#result_page_next").before("<li id='"+k1+"' class='page_add'><a href='#'>"+k1+"</a></li>");
		}
		if( page > count )
			$("#result_page_next").before("<li id='"+page+"' class='page_add'><a href='#'>Last</a></li>");
		if( current == page )
			$("#result_page_next").addClass("disabled");
		else
			$("#result_page_next").removeClass("disabled");
		showPage(json,current);
	}
    // condition 2
	else if( parseInt(current) >= count-1 && parseInt(current) <= page-parseInt(count/2)-1 ){
        $(".page_add").empty();
		$("#result_page_pre").after("<li id='1' class='page_add'><a href='#'>First</a></li>");
		for( var k2=parseInt(current)-parseInt(count/2) ; k2<=parseInt(current)+parseInt(count/2) ; k2++ ) {
			if( k2 == parseInt(current) )
				$("#result_page_next").before("<li id='"+k2+"' class='active page_add'><a href='#'>"+k2+" <span class='sr-only'>(current)</span></a></li>");
			else	
			    $("#result_page_next").before("<li id='"+k2+"' class='page_add'><a href='#'>"+k2+"</a></li>");
		}
		$("#result_page_next").before("<li id='"+page+"' class='page_add'><a href='#'>Last</a></li>")
                              .removeClass("disabled");
		showPage(json,current);
	}
    // condition 3
	else {
		$(".page_add").empty();
		$("#result_page_pre").after("<li id='1' class='page_add'><a href='#'>First</a></li>");
		for( var k3=parseInt(page-count)+1 ; k3<=parseInt(page) ; k3++ ) {
			if( k3 == parseInt(current) )
				$("#result_page_next").before("<li id='"+k3+"' class='active page_add'><a href='#'>"+k3+" <span class='sr-only'>(current)</span></a></li>");
			else
			    $("#result_page_next").before("<li id='"+k3+"' class='page_add'><a href='#'>"+k3+"</a></li>");
		}
		if( current == page )
			$("#result_page_next").addClass("disabled");
		else
			$("#result_page_next").removeClass("disabled");
		showPage(json,current);
	}
}

/*
 *  make the result show
 */
var search_type = "" ;  // all | index | author | field | booktitle
var search_content = "" ;   // search content

function showSearchResult(data) {

    json = eval( data );
	jsonData = data ;

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

	page = parseInt(( json.length + pageSize - 1 ) / pageSize) ;
	current = 1 ;

	showPage(json, current);
	
	if( page > 1 ) {
		$("#result_page_pre").addClass("disabled");
        $("#result_page_pre").after("<li id='1' class='active page_add'><a href='#'>1 <span class='sr-only'>(current)</span></a></li>");
		for( var i=2 ; i<=page && i<=count ; i++ ) {
			$("#result_page_next").before("<li id='"+i+"' class='page_add'><a href='#'>"+i+"</a></li>");
		}
		if( page > count ) {
			$("#result_page_next").before("<li id='"+page+"' class='page_add'><a href='#'>Last</a></li>");
		}
		$("#result_page").show("slow");
	}
}

function showPage(json, num) {
	$(".added").empty();
	var start = ( num - 1 ) *  pageSize ;
    var doi_text = "" ;

	for(var i = start ; i < start + pageSize && i < json.length ; i++ ) {
        if( json[i].doi != null ) {
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
                    "<a class='red_link' data-toggle='collapse' data-parent='#accordion' href='#b_collapse"
                    + i + "'>BibTex</a>&nbsp;&nbsp;|&nbsp;&nbsp;" + doi_text + "</p>" +
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
		$("#result_info_type").html("<a href='#'>" + search_type + "</a>");
		$("#result_info_name").html(search_content);
	}
	
	$("#result_info").fadeIn("slow");
    // if searching index, the sta will show the search content,
    // else, the content has been shown in main_list
    if( search_type == "index" ) {
        $("#result_sta").html("<p>searching for <strong class='text-success'>" + search_content +
        "</strong>, and <span class='label label-success'>" + json.length + "</span> papers included</p>");
    }
    else {
        $("#result_sta").html("<p><span class='label label-success'>" + json.length + "</span> papers included</p>");
    }
    $("#result_paper").fadeIn("slow") ;
}

//
// get full booktitle text
//
function getFullPublication( jn ) {
	var type = jn.type ;
	var booktitle = jn.booktitle ;
	var abbr = jn.abbr ;
	var vol = jn.vol ;
	var no = jn.no ;
	var pages = jn.pages ;
	var year = jn.year ;
    var publisher = jn.publisher ;

    // add the abbreviation of journal or conference
	if (abbr != null && abbr != "Phd" && abbr != "Book" && abbr != "Tech" && abbr != "Computer" && abbr != "Software")
        booktitle += " (" +  abbr + ")" ;

    // different cases
    if (type == "article") {
        var suffix = ", " ;
        if ( vol != null ) {
            if( no != null )
                suffix += vol + " (" + no + "), "
            else
                suffix += "vol. " + vol + ", ";
        }
        return booktitle + suffix + "pp." + pages + ", " + year ;
	}
	else if( type == "inproceedings" || type == "incollection" ) {
		return booktitle + ", pp." + pages + ", " + year ;
	}
	else if( type == "phdthesis" ) {
		return booktitle + ", " + year ;
	}
    else if( type == "book" ) {
        return publisher + ", " + year ;
    }
    else if( type == "inbook" ) {
        return booktitle + ", " + publisher + ", " + year ;
    }
	else if( type == "techreport" ) {
        if( no != null )
		    return booktitle + ", " + no + ", " + year ;
        else
            return booktitle + ", " + year ;
	}
}

//
// get bib entry as html code
//
function getBibEntry( jn ) {
	var re = "" ;
    /*
	@article{$bib,
		author = {$author},
		title = {$title},
		journal = {$booktitle},
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
		"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;journal = {" + jn.booktitle + "},<br/>" +
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
		booktitle = {$booktitle},
		pages = {$pages},
		year = {$year},
		doi = {$doi}
	}
	*/
	else if( jn.type == "inproceedings" ) {
		re += "@inproceedings{" + jn.bib + ",<br/>" +
		"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;author = {" + jn.author + "},<br/>" +
		"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;title = {" + jn.title + "},<br/>" +
		"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;booktitle = {" + jn.booktitle + "},<br/>" +
		"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;pages = {" + jn.pages + "},<br/>" +
		"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;year = {" + jn.year + "},<br/>" +
		"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;doi = {" + jn.doi + "}<br/>" +
		"}";
	}
    /*
     @incollection{$bib,
        author = {$author},
        title = {$title},
        booktitle = {$booktitle},
        publisher = {$publisher},
        pages = {$pages},
        year = {$year},
        doi = {$doi}
     }
     */
    else if( jn.type == "incollection" ) {
        re += "@inproceedings{" + jn.bib + ",<br/>" +
        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;author = {" + jn.author + "},<br/>" +
        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;title = {" + jn.title + "},<br/>" +
        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;booktitle = {" + jn.booktitle + "},<br/>" +
        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;publisher = {" + jn.publisher + "},<br/>" +
        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;pages = {" + jn.pages + "},<br/>" +
        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;year = {" + jn.year + "},<br/>" +
        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;doi = {" + jn.doi + "}<br/>" +
        "}";
    }
	/*
	@phdthesis{$bib,
		author = {$author},
		title = {$title},
		school = {$booktitle},
		year = {$year}
	}
	*/
	else if( jn.type == "phdthesis" ) {
		re += "@phdthesis{" + jn.bib + ",<br/>" +
		"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;author = {" + jn.author + "},<br/>" +
		"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;title = {" + jn.title + "},<br/>" +
		"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;school = {" + jn.booktitle + "},<br/>" +
		"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;year = {" + jn.year + "}<br/>" +
		"}";
	}
	/*
	@techreport{$bib,
		author = {$author},
		title = {$title},
		institution = {$booktitle},
		number = {$no},
		year = {$year}
	}
	*/
	else if( jn.type == "techreport" ) {
		re += "@techreport{" + jn.bib + ",<br/>" +
		"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;author = {" + jn.author + "},<br/>" +
		"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;title = {" + jn.title + "},<br/>" +
		"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;institution = {" + jn.booktitle + "},<br/>" +
		"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;number = {" + jn.no + "},<br/>" +
		"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;year = {" + jn.year + "}<br/>" +
		"}";
	}
    /*
     @book{$bib,
        author = {$author},
        title = {$title},
        publisher = {$publisher},
        year = {$year}
     }
     */
    else if( jn.type == "book" ) {
        re += "@book{" + jn.bib + ",<br/>" +
        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;author = {" + jn.author + "},<br/>" +
        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;title = {" + jn.title + "},<br/>" +
        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;publisher = {" + jn.publisher + "},<br/>" +
        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;year = {" + jn.year + "}<br/>" +
        "}";
    }
    /*
     @inbook{$bib,
        author = {$author},
        title = {$title},
        chapter = {$booktitle}
        publisher = {$publisher},
        year = {$year}
     }
     */
    else if( jn.type == "inbook" ) {
        re += "@inbook{" + jn.bib + ",<br/>" +
        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;author = {" + jn.author + "},<br/>" +
        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;title = {" + jn.title + "},<br/>" +
        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;chapter = {" + jn.booktitle + "},<br/>" +
        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;publisher = {" + jn.publisher + "},<br/>" +
        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;year = {" + jn.year + "}<br/>" +
        "}";
    }
	else {
		re = "no bib citation" ;
	}
	return re ;
}




