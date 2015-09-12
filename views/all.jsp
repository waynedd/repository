<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>
<%@taglib uri="/struts-tags" prefix="s" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="combinatorial testing repository is a web based application to collect works that address the topic of combinatorial testing.">
    <meta name="keywords" content="repository, combinatorial testing, software testing, publication, research, paper">
    <meta name="author" content="huayao">

    <title>All List</title>
    <link rel="shortcut icon" href="./image/favicon.ico" type="image/x-icon">
    <link rel="icon" href="./image/favicon.ico" type="image/x-icon">
    <link rel="stylesheet" href="./css/bootstrap.min.css">
    <link rel="stylesheet" href="./css/font-awesome.min.css">
    <link rel="stylesheet" href="./css/repository.css">

    <script src="./js/jquery.min.js"></script>
    <script src="./js/comb.js"></script>
    <script type="text/javascript">
        // search all content
        $(document).ready(function () {
            var para = "content=all&group=all";
            search_now = "all";
            search_type = "all";
            $("#wait").show();
            $.ajax({
                url: "contentAction.action",
                type: "post",
                dataType: "json",
                data: para,
                success: showsearh
            });
        });
    </script>
</head>

<body>
<!-- Wrap all page content here -->
<div id="wrap">

    <!-- top navigation -->
    <jsp:include page="template_top.jsp"/>

    <div class="container">
        <br/><br/>
        <br/><br/>

        <div class="row">
            <!-- list part -->
            <jsp:include page="template_navlist.jsp">
                <jsp:param name="para" value="all"/>
            </jsp:include>

            <!-- show -->
            <div class="col-md-10">
                <!-- bread crumb -->
                <!-- only display sta -->
                <div id="pa" style="display:none" class="row">
                    <div class="row">
                        <div id="sta" class="col-md-12">
                        </div>
                        <!--<div class="col-md-6">
                        button id="downbtn" class="btn btn-xs btn-info pull-right">Cite Export</button>
                        </div>-->
                    </div>
                </div>

                <!-- waiting -->
                <div id="wait" style="display:none" class="row">
                    <div class="col-md-12 text-center">
                        <h1><i class="fa fa-spinner fa-pulse fa-lg"></i></h1><br>
                        <h4>keep calm and data is loading ...</h4>
                    </div>
                </div>

                <!-- all list -->
                <div id="result_list" style="display:none" class="row">
                    <div class="col-md-12">
                        <table id='rstable' class='table listtable'>
                            <!--<tr><th>author</th><th>title</th><th>pub</th><th>year</th></tr>-->
                        </table>
                    </div>
                </div>

                <!-- pagination -->
                <div id="search_page" style="display:none;text-align:center">
                    <ul class="pagination">
                        <li id="search_page_pre" class="disabled"><a href="#">&laquo;</a></li>
                        <li id="search_page_nxt"><a href="#">&raquo;</a></li>
                    </ul>
                </div>

            </div>
            <!-- span10 -->
        </div>

    </div>
    <!-- /container -->

    <div id="push"></div>
</div>
<!-- /wrap -->

<!-- footer -->
<jsp:include page="template_bottom.jsp"/>

<script src="./js/bootstrap.min.js"></script>
</body>
</html>
