/**
 *  the main javascript file of combinatorial testing repository
 */

/* parameters for ajax post */
var start           = 0  ;      // the start position of each page
var step            = 25 ;      // the maximum items of each page
var ct_url          = '' ;      // the action url
var ct_para  ;                  // the parameters to be posted
/* parameters for pagination control */
var pageCurrent     = 0 ;       // the current page number
var pageNum         = 0 ;       // the total number of pages
var pageCount       = 5 ;       // the page interval
/* parameters for information display */
var matchNum        = 0 ;       // the number of all matches
var currentJSON ;               // the publication list of current page
var search_type     = '' ;      // all | index (search button) | author | field | tag | booktitle
var search_content  = '' ;      // the text to be searched
/* wait state */
var should_wait = true ;

/**
 * Basic layout of content in each web page:
 * | main list
 * | wait
 * | result_list
 *      | result_info
 *          | bread nav: #result_info_type / #result_info_name
 *          | author_info (only in author page)
 *          | result_sta
 *      | result_paper: paper list is shown in #rstable
 *      | result_page: previous (#result_page_pre) and next (#search_page_net) button
 *
 * Basic CSS classes:
 *  .added      : the new added elements of table
 *  .page_added : the new added elements of pagination
 */

$(document).ready(function() {
    // when clicking the bread nav to go back to the main list
	$('#result_info_type').click(function () {
        // clear result table for scholar, field and venue pages
        $('.added').empty();
        $('.page_added').empty();
        // result_list
        $('#result_info').hide();
        $('#result_paper').hide();
        $('#result_page').hide();
        // main_list
        $('#main_list').show();
    });

	// when clicking the previous page
	$('#result_page_pre').click(function() {
		if( $(this).hasClass('disabled') )
			event.preventDefault();
		else {
            start = (parseInt(pageCurrent) - 2) * step;
            ct_para.start = start;
            makeRequest();
		}
	});

    // when clicking the next page
	$('#result_page_next').click(function() {
		if( $(this).hasClass('disabled') )
			event.preventDefault();
		else {
            start = parseInt(pageCurrent) * step;
            ct_para.start = start;
            makeRequest();
		}
	});

	// when clicking a particular page
	$(document).on('click', '.page_added', function() {
		if( parseInt($(this).attr('id')) == pageCurrent )
			event.preventDefault();
		else {
            start = ($(this).attr('id') - 1) * step ;
            ct_para.start = start;
            makeRequest();
		}
	});
});

/*
 *  This method is used to invoke request to get paper list
 *  and then show corresponding results.
 */
function makeRequest() {
    if( ct_url != '' ) {
        $('.added').empty();
        $('#result_page').hide();
        should_wait = true;
        $.ajax({
            url       : ct_url,
            type      : 'post',
            data      : ct_para,
            dataType  : 'json',
            success   : showResult
        });
        // if it costs too much time to response
        setTimeout(function(){
            if( should_wait )
                $('#wait').show();
        }, 200);
    }
}

/*
 *  Show the paper list.
 */
function showResult(data) {
    currentJSON = eval( data.result );
    matchNum = eval( data.totalNum[0].num );

    // disable the waiting icon
    should_wait = false;
    $('#wait').hide();

    // if nothing is returned (only when search_type == index)
    if ( search_type == 'index' && currentJSON == '' ) {
        $('#search_none').fadeIn('slow');
        return;
    }

    // compute the total number of pages and the current page number
    pageCurrent = (start/step) + 1;
    pageNum = parseInt(( matchNum + step - 1 ) / step);

    // show result_info
    if( search_type != 'all' || search_type != 'index') {
        // if WEB_PAGE = all | index, the followings will not be shown
        $('#result_info_type').html('<a href="#">' + search_type + '</a>');
        $('#result_info_name').html(search_content);
    }
    if( search_type == 'index' ) {
        // if WEB_PAGE = index, the sta will be the search content
        $('#result_sta').html('<p>searching <strong class="text-success">' + search_content +
        '</strong>, <span class="label label-success">' + matchNum + '</span> papers found</p>');
    }
    else {
        // for other WEB_PAGE, the information has been shown in bread nav
        $('#result_sta').html('<p><span class="label label-success">' + matchNum + '</span> papers found</p>');
    }
    $('#result_info').fadeIn('slow');

    // show result_paper
    showCurrentPage(currentJSON, data.timeStamp);

    // show result_page
    if( pageNum > 1 )
        showPagination(pageCurrent, pageNum, pageCount);
}

/*
 *  Show current paper list (i.e. current page).
 *  Here the timeStamp is used to determine whether the "new" label is displayed.
 */
function showCurrentPage(data, timeStamp) {
    var doi_text = '' ;
    var new_label = '' ;

    for(var i = 0 ; i < data.length ; i++ ) {
        // set doi
        if( data[i].doi != null && data[i].doi.length != 0 )
            doi_text = '<a class="red_link" href="http://dx.doi.org/' + data[i].doi + '" target="_blank">DOI</a>' ;
        else
            doi_text = 'DOI' ;

        // set new label
        if( data[i].time_stamp == timeStamp )
            new_label = '<span class="label label-info pull-right">new</span>' ;
        else
            new_label = '' ;

        // insert a new row in result table
        $('#rstable').append('<tr class="added"><td>' + (i+start+1) + '</td><td>' +
            '<div class="row">' +
                '<div class="col-md-12">' +
                    '<p>' + data[i].author + new_label + '</p>' +
                    '<p><strong>' + data[i].title + '</strong></p>' +
                    '<p><em>' + getFullPublication( data[i] ) + '</em></p>' +
                '</div>' +
            '</div>' +
            '<div class="row">' +
                '<div class="col-md-12">' +
                    '<p class="pull-right" id="accordion">' +
                    '<a class="red_link" data-toggle="collapse" data-parent="#accordion" ' +
                    'href="#b_collapse' + i + '">BibTex</a>&nbsp;&nbsp;|&nbsp;&nbsp;' + doi_text + '</p>' +
                '</div>' +
            '</div>' +
            '<div class="row">' +
                '<div id="b_collapse' + i + '" class="col-md-12 panel panel-default collapse">' +
                '<div class="panel-body">' + getBibEntry(data[i]) +'</div>' +
            '</div>' +
        '</div>' +
        '</td></tr>') ;
    }
    $('#result_paper').fadeIn('slow');
}

/*
 *  Show pagination.
 *      current - current page number
 *      page    - the total number of pages
 *      count   - the maximum page number to show
 */
function showPagination(current, page, count) {
    // condition 1
    if( parseInt(current) < count-1 || page <= count - 1 ) {
        $('.page_added').empty();
        if( parseInt(current) == 1 ) {
            $('#result_page_pre').after('<li id="1" class="active page_added"><a href="#">1 <span class="sr-only">(current)</span></a></li>')
                .addClass('disabled');
        }
        else {
            $('#result_page_pre').after('<li id="1" class="page_added"><a href="#">1</a></li>')
                .removeClass('disabled');
        }
        for( var k1=2 ; k1<=page && k1<=count ; k1++ ) {
            if( k1 == parseInt(current) )
                $('#result_page_next').before('<li id="'+k1+'" class="active page_added"><a href="#">'+k1+' <span class="sr-only">(current)</span></a></li>');
            else
                $('#result_page_next').before('<li id="'+k1+'" class="page_added"><a href="#">'+k1+'</a></li>');
        }
        if( page > count )
            $('#result_page_next').before('<li id="'+page+'" class="page_added"><a href="#">Last</a></li>');
        if( current == page )
            $('#result_page_next').addClass('disabled');
        else
            $('#result_page_next').removeClass('disabled');
    }
    // condition 2
    else if( parseInt(current) >= count-1 && parseInt(current) <= page-parseInt(count/2)-1 ) {
        $('.page_added').empty();
        $('#result_page_pre').after('<li id="1" class="page_added"><a href="#">First</a></li>')
            .removeClass('disabled');
        for( var k2=parseInt(current)-parseInt(count/2) ; k2<=parseInt(current)+parseInt(count/2) ; k2++ ) {
            if( k2 == parseInt(current) )
                $('#result_page_next').before('<li id="'+k2+'" class="active page_added"><a href="#">'+k2+' <span class="sr-only">(current)</span></a></li>');
            else
                $('#result_page_next').before('<li id="'+k2+'" class="page_added"><a href="#">'+k2+'</a></li>');
        }
        $('#result_page_next').before('<li id="'+page+'" class="page_added"><a href="#">Last</a></li>')
            .removeClass('disabled');
    }
    // condition 3
    else {
        $('.page_added').empty();
        $('#result_page_pre').after('<li id="1" class="page_added"><a href="#">First</a></li>')
            .removeClass('disabled');
        for( var k3=parseInt(page-count)+1 ; k3<=parseInt(page) ; k3++ ) {
            if( k3 == parseInt(current) )
                $('#result_page_next').before('<li id="'+k3+'" class="active page_added"><a href="#">'+k3+' <span class="sr-only">(current)</span></a></li>');
            else
                $('#result_page_next').before('<li id="'+k3+'" class="page_added"><a href="#">'+k3+'</a></li>');
        }
        if( current == page )
            $('#result_page_next').addClass('disabled');
        else
            $('#result_page_next').removeClass('disabled');
    }
    $('#result_page').show();
}

/*
 *  Get the complete booktitle as a string.
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
	if (abbr != null && abbr != 'Phd' && abbr != 'Book' && abbr != 'Tech' && abbr != 'Computer' && abbr != 'Software')
        booktitle += ' (' +  abbr + ')' ;

    // deal with different cases
    if (type == 'article') {
        var suffix = ', ' ;
        if ( vol != null ) {
            if( no != null )
                suffix += vol + '(' + no + '): ' + pages ;
            else
                suffix += 'vol.' + vol + ', ' + 'pp.' + pages ;
        }
        return booktitle + suffix + ', ' + year ;
	}
	else if( type == 'inproceedings' ) {
		return booktitle + ', pp.' + pages + ', ' + year ;
	}
    else if( type == 'incollection' ) {
        return booktitle + ', vol.' + vol + ', pp.' + pages + ', ' + year ;
    }
	else if( type == 'phdthesis' || type == 'masterthesis' ) {
		return booktitle + ', ' + year ;
	}
    else if( type == 'book' ) {
        return publisher + ', ' + year ;
    }
    else if( type == 'inbook' ) {
        return booktitle + ', ' + publisher + ', ' + year ;
    }
	else if( type == 'techreport' ) {
        if( no != null )
		    return booktitle + ', ' + no + ', ' + year ;
        else
            return booktitle + ', ' + year ;
	}
}

/*
 *  Get the bib entry as a segment of html code
 */
function getBibEntry( jn ) {
	var re = '' ;

    // author should be joined by 'and'
    var bibAuthor = jn.author.split(',').join(' and');
    // the '_' in doi should be replaced by '\_' (jn.doi may be null)
    var bibDOI = jn.doi ? jn.doi.replace('_', '\\_') : null;
    // the '--' in page should be replaced by '-' (jn.pages may be null)
    var bibPages = jn.pages ? jn.pages.replace('--', '-') : null;
    // create bib
    var tp = (jn.author.split(',')[0]).split(' ');
    var bib = tp[tp.length-1] + ':' + jn.year + '.' + jn.id ;

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
	if( jn.type == 'article' ) {
		re += '@article{' + bib + ',<br/>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;author = {' + bibAuthor + '},<br/>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;title = {' + jn.title + '},<br/>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;journal = {' + jn.booktitle + '},<br/>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;volume = {' + jn.vol + '},<br/>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;number = {' + jn.no + '},<br/>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;pages = {' + bibPages + '},<br/>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;year = {' + jn.year + '},<br/>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;doi = {' + bibDOI + '}<br/>' +
            '}';
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
	else if( jn.type == 'inproceedings' ) {
		re += '@inproceedings{' + bib + ',<br/>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;author = {' + bibAuthor + '},<br/>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;title = {' + jn.title + '},<br/>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;booktitle = {' + jn.booktitle + '},<br/>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;pages = {' + bibPages + '},<br/>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;year = {' + jn.year + '},<br/>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;doi = {' + bibDOI + '}<br/>' +
            '}';
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
    else if( jn.type == 'incollection' ) {
        re += '@incollection{' + bib + ',<br/>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;author = {' + bibAuthor + '},<br/>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;title = {' + jn.title + '},<br/>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;booktitle = {' + jn.booktitle + '},<br/>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;publisher = {' + jn.publisher + '},<br/>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;volume = {' + jn.vol + '},<br/>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;pages = {' + bibPages + '},<br/>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;year = {' + jn.year + '},<br/>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;doi = {' + bibDOI + '}<br/>' +
            '}';
    }
	/*
	@phdthesis{$bib,
		author = {$author},
		title = {$title},
		school = {$booktitle},
		year = {$year}
	}
	*/
	else if( jn.type == 'phdthesis' || jn.type == 'masterthesis' ) {
		re += '@' + jn.type + '{' + bib + ',<br/>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;author = {' + bibAuthor + '},<br/>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;title = {' + jn.title + '},<br/>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;school = {' + jn.booktitle + '},<br/>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;year = {' + jn.year + '}<br/>' +
            '}';
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
	else if( jn.type == 'techreport' ) {
		re += '@techreport{' + bib + ',<br/>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;author = {' + bibAuthor + '},<br/>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;title = {' + jn.title + '},<br/>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;institution = {' + jn.booktitle + '},<br/>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;number = {' + jn.no + '},<br/>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;year = {' + jn.year + '}<br/>' +
            '}';
	}
    /*
     @book{$bib,
        author = {$author},
        title = {$title},
        publisher = {$publisher},
        year = {$year}
     }
     */
    else if( jn.type == 'book' ) {
        re += '@book{' + bib + ',<br/>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;author = {' + bibAuthor + '},<br/>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;title = {' + jn.title + '},<br/>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;publisher = {' + jn.publisher + '},<br/>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;year = {' + jn.year + '}<br/>' +
            '}';
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
    else if( jn.type == 'inbook' ) {
        re += '@inbook{' + bib + ',<br/>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;author = {' + bibAuthor + '},<br/>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;title = {' + jn.title + '},<br/>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;chapter = {' + jn.booktitle + '},<br/>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;publisher = {' + jn.publisher + '},<br/>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;year = {' + jn.year + '}<br/>' +
            '}';
    }
	else {
        re = 'not available';
    }
	return re ;
}
