/**
 *  main script for combinatorial testing repository
 */

/*
 * global parameters to control pagination
 * they will be used in search, all, scholar, field, and venue pages
 */

var json ;           // interpreted json data
var pageSize = 15 ;  // the maximum items in each page
var page ;           // the number of pages
var count = 5 ;      // page interval in pagination
var current ;        // current page
var search_type = "" ;    // type = all | index (search button) | author | field | subfield | booktitle
var search_content = "" ; // content to be searched

/*
 * basic layout of content part:
 * | main list
 * | wait
 * | result_list
 *      | result_info
 *          | bread nav: #result_info_type / #result_info_name
 *          | author_info (only in author page)
 *          | result_sta
 *      | result_paper: paper list is shown in #rstable
 *      | result_page: previous and next button #result_page_pre and #search_page_net
 *
 * basic css classes:
 * .added : the new added elements of table
 * .page_added : the new added elements of pagination
 */

/*
 *  ajax
 */
$(document).ready(function() {
    /*
     *  click the bread nav to go back to the main list
     *  #result_info_type / #result_info_name
     */
	$("#result_info_type").click(function () {
        // clear result table for author, field and booktitle
        $("#result_info").hide();
        $(".added").empty();
        $(".page_added").empty();
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
	 *  click a particular page
	 */
	$(document).on("click", ".page_added", function() {
		//alert(current);
		if( parseInt($(this).attr("id")) == current ) {
			event.preventDefault();
		}
		else {
            current = $(this).attr("id") ;
            showPageCount() ;
		}
	});
});

/*
 *  pagination controller
 *  parameter:
 *      current - current page number
 *      count - the maximum page number to show
 */
function showPageCount() {
    // condition 1
    if( parseInt(current) < count-1 || page <= count - 1 ) {
        $(".page_added").empty();
		if( parseInt(current) == 1 ) {
			$("#result_page_pre").after("<li id='1' class='active page_added'><a href='#'>1 <span class='sr-only'>(current)</span></a></li>")
                                 .addClass("disabled");
		}
		else {
			$("#result_page_pre").after("<li id='1' class='page_added'><a href='#'>1</a></li>")
                                 .removeClass("disabled");
		}
		for( var k1=2 ; k1<=page && k1<=count ; k1++ ) {
			if( k1 == parseInt(current) )
                $("#result_page_next").before("<li id='"+k1+"' class='active page_added'><a href='#'>"+k1+" <span class='sr-only'>(current)</span></a></li>");
			else
				$("#result_page_next").before("<li id='"+k1+"' class='page_added'><a href='#'>"+k1+"</a></li>");
		}
		if( page > count )
			$("#result_page_next").before("<li id='"+page+"' class='page_added'><a href='#'>Last</a></li>");
		if( current == page )
			$("#result_page_next").addClass("disabled");
		else
			$("#result_page_next").removeClass("disabled");
		showPage(json,current);
	}
    // condition 2
	else if( parseInt(current) >= count-1 && parseInt(current) <= page-parseInt(count/2)-1 ){
        $(".page_added").empty();
		$("#result_page_pre").after("<li id='1' class='page_added'><a href='#'>First</a></li>");
		for( var k2=parseInt(current)-parseInt(count/2) ; k2<=parseInt(current)+parseInt(count/2) ; k2++ ) {
			if( k2 == parseInt(current) )
				$("#result_page_next").before("<li id='"+k2+"' class='active page_added'><a href='#'>"+k2+" <span class='sr-only'>(current)</span></a></li>");
			else	
			    $("#result_page_next").before("<li id='"+k2+"' class='page_added'><a href='#'>"+k2+"</a></li>");
		}
		$("#result_page_next").before("<li id='"+page+"' class='page_added'><a href='#'>Last</a></li>")
                              .removeClass("disabled");
		showPage(json,current);
	}
    // condition 3
	else {
		$(".page_added").empty();
		$("#result_page_pre").after("<li id='1' class='page_added'><a href='#'>First</a></li>");
		for( var k3=parseInt(page-count)+1 ; k3<=parseInt(page) ; k3++ ) {
			if( k3 == parseInt(current) )
				$("#result_page_next").before("<li id='"+k3+"' class='active page_added'><a href='#'>"+k3+" <span class='sr-only'>(current)</span></a></li>");
			else
			    $("#result_page_next").before("<li id='"+k3+"' class='page_added'><a href='#'>"+k3+"</a></li>");
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
function showSearchResult(data) {
    json = eval( data );

    // wait can be ended
	$("#wait").hide();

    // if return nothing (only when search_type == index)
    if ( search_type == "index" && json == "" ) {
        $("#search_none").fadeIn("slow");
        return;
    }

    // compute total number of pages
	page = parseInt(( json.length + pageSize - 1 ) / pageSize) ;
	current = 1 ;

    // show current page
	showPage(json, current);

    // show pagination
	if( page > 1 ) {
		$("#result_page_pre").addClass("disabled");
        $("#result_page_pre").after("<li id='1' class='active page_added'><a href='#'>1 <span class='sr-only'>(current)</span></a></li>");
		for( var i=2 ; i<=page && i<=count ; i++ ) {
			$("#result_page_next").before("<li id='"+i+"' class='page_added'><a href='#'>"+i+"</a></li>");
		}
		if( page > count ) {
			$("#result_page_next").before("<li id='"+page+"' class='page_added'><a href='#'>Last</a></li>");
		}
		$("#result_page").show("slow");
	}
}

/*
 *  show a particular page
 */
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
    // search whole paper and index will not run the followings
	if( search_type != "all" || search_type != "index") {
		$("#result_info_type").html("<a href='#'>" + search_type + "</a>");
		$("#result_info_name").html(search_content);
	}
	
	$("#result_info").fadeIn("slow");
    // if searching index, the sta will show the search content
    // for the others, the content has been shown in bread nav
    if( search_type == "index" ) {
        $("#result_sta").html("<p>searching <strong class='text-success'>" + search_content +
        "</strong>, <span class='label label-success'>" + json.length + "</span> papers found</p>");
    }
    else {
        $("#result_sta").html("<p><span class='label label-success'>" + json.length + "</span> papers found</p>");
    }
    $("#result_paper").fadeIn("slow");
}

/*
 *  get the complete booktitle as a string
 */
function getFullPublication( jn ) {
	var type = jn.type ;
	var booktitle = jn.booktitle ;
	var abbr = jn.abbr ;
	var vol = jn.vol ;
	var no = jn.no ;
	var pages = jn.pages ? jn.pages.replace('--', '-') : null;
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
                suffix += vol + "(" + no + "): " + pages ;
            else
                suffix += "vol." + vol + ", " + "pp." + pages ;
        }
        return booktitle + suffix + ", " + year ;
	}
	else if( type == "inproceedings" ) {
		return booktitle + ", pp." + pages + ", " + year ;
	}
    else if( type == "incollection" ) {
        return booktitle + ", vol." + vol + ", pp." + pages + ", " + year ;
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

/*
 *  get bib entry as html code
 */
function getBibEntry( jn ) {
	var re = "" ;

    // author should be joined by "and"
    var bibAuthor = jn.author.split(',').join(' and');
    // the "_" in doi should be replaced by "\_" (jn.doi may be null)
    var bibDOI = jn.doi ? jn.doi.replace('_', '\\_') : null;
    // the "--" in page should be replaced by "-" (jn.pages may be null)
    var bibPages = jn.pages ? jn.pages.replace('--', '-') : null;
    // create bib
    var tp = (jn.author.split(',')[0]).split(' ');
    var bib = tp[tp.length-1] + ':' + jn.year + "." + jn.id ;

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
		re += "@article{" + bib + ",<br/>" +
            "&nbsp;&nbsp;&nbsp;&nbsp;author = {" + bibAuthor + "},<br/>" +
            "&nbsp;&nbsp;&nbsp;&nbsp;title = {" + jn.title + "},<br/>" +
            "&nbsp;&nbsp;&nbsp;&nbsp;journal = {" + jn.booktitle + "},<br/>" +
            "&nbsp;&nbsp;&nbsp;&nbsp;volume = {" + jn.vol + "},<br/>" +
            "&nbsp;&nbsp;&nbsp;&nbsp;number = {" + jn.no + "},<br/>" +
            "&nbsp;&nbsp;&nbsp;&nbsp;pages = {" + bibPages + "},<br/>" +
            "&nbsp;&nbsp;&nbsp;&nbsp;year = {" + jn.year + "},<br/>" +
            "&nbsp;&nbsp;&nbsp;&nbsp;doi = {" + bibDOI + "}<br/>" +
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
		re += "@inproceedings{" + bib + ",<br/>" +
            "&nbsp;&nbsp;&nbsp;&nbsp;author = {" + bibAuthor + "},<br/>" +
            "&nbsp;&nbsp;&nbsp;&nbsp;title = {" + jn.title + "},<br/>" +
            "&nbsp;&nbsp;&nbsp;&nbsp;booktitle = {" + jn.booktitle + "},<br/>" +
            "&nbsp;&nbsp;&nbsp;&nbsp;pages = {" + bibPages + "},<br/>" +
            "&nbsp;&nbsp;&nbsp;&nbsp;year = {" + jn.year + "},<br/>" +
            "&nbsp;&nbsp;&nbsp;&nbsp;doi = {" + bibDOI + "}<br/>" +
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
        re += "@inproceedings{" + bib + ",<br/>" +
            "&nbsp;&nbsp;&nbsp;&nbsp;author = {" + bibAuthor + "},<br/>" +
            "&nbsp;&nbsp;&nbsp;&nbsp;title = {" + jn.title + "},<br/>" +
            "&nbsp;&nbsp;&nbsp;&nbsp;booktitle = {" + jn.booktitle + "},<br/>" +
            "&nbsp;&nbsp;&nbsp;&nbsp;publisher = {" + jn.publisher + "},<br/>" +
            "&nbsp;&nbsp;&nbsp;&nbsp;volume = {" + jn.vol + "},<br/>" +
            "&nbsp;&nbsp;&nbsp;&nbsp;pages = {" + bibPages + "},<br/>" +
            "&nbsp;&nbsp;&nbsp;&nbsp;year = {" + jn.year + "},<br/>" +
            "&nbsp;&nbsp;&nbsp;&nbsp;doi = {" + bibDOI + "}<br/>" +
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
		re += "@phdthesis{" + bib + ",<br/>" +
            "&nbsp;&nbsp;&nbsp;&nbsp;author = {" + bibAuthor + "},<br/>" +
            "&nbsp;&nbsp;&nbsp;&nbsp;title = {" + jn.title + "},<br/>" +
            "&nbsp;&nbsp;&nbsp;&nbsp;school = {" + jn.booktitle + "},<br/>" +
            "&nbsp;&nbsp;&nbsp;&nbsp;year = {" + jn.year + "}<br/>" +
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
		re += "@techreport{" + bib + ",<br/>" +
            "&nbsp;&nbsp;&nbsp;&nbsp;author = {" + bibAuthor + "},<br/>" +
            "&nbsp;&nbsp;&nbsp;&nbsp;title = {" + jn.title + "},<br/>" +
            "&nbsp;&nbsp;&nbsp;&nbsp;institution = {" + jn.booktitle + "},<br/>" +
            "&nbsp;&nbsp;&nbsp;&nbsp;number = {" + jn.no + "},<br/>" +
            "&nbsp;&nbsp;&nbsp;&nbsp;year = {" + jn.year + "}<br/>" +
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
        re += "@book{" + bib + ",<br/>" +
            "&nbsp;&nbsp;&nbsp;&nbsp;author = {" + bibAuthor + "},<br/>" +
            "&nbsp;&nbsp;&nbsp;&nbsp;title = {" + jn.title + "},<br/>" +
            "&nbsp;&nbsp;&nbsp;&nbsp;publisher = {" + jn.publisher + "},<br/>" +
            "&nbsp;&nbsp;&nbsp;&nbsp;year = {" + jn.year + "}<br/>" +
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
        re += "@inbook{" + bib + ",<br/>" +
            "&nbsp;&nbsp;&nbsp;&nbsp;author = {" + bibAuthor + "},<br/>" +
            "&nbsp;&nbsp;&nbsp;&nbsp;title = {" + jn.title + "},<br/>" +
            "&nbsp;&nbsp;&nbsp;&nbsp;chapter = {" + jn.booktitle + "},<br/>" +
            "&nbsp;&nbsp;&nbsp;&nbsp;publisher = {" + jn.publisher + "},<br/>" +
            "&nbsp;&nbsp;&nbsp;&nbsp;year = {" + jn.year + "}<br/>" +
            "}";
    }
	else {
        re = "not available";
    }
	return re ;
}
