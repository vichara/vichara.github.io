$(document).ready(function () {
  $("#jb-navbar-collapse ul > li").each(function () {
	  var href = $("a",this).attr("href");
	   if (location.pathname == href) {
		   $(this).addClass("active");
		   return false;
	   }
  });
});