$( document ).ready(function() {
	/* Sidebar height set */
	$('.sidebar').css('min-height',$(document).height());

    // 给文章标题节点设置id
    var num = 0;
    var TitleNodes = $('#article_body').find('h1,h2,h3,h4,h5,h6');
    $.each(TitleNodes, function(i, item) {
        var $this = $(this);
        $this.attr("id", "toc" + num)
        num++;
    })

    // 启动侧边目录栏
    $("#catalog").toc({
        'container': '#article_body',
        'selectors': 'h1,h2,h3,h4,h5,h6',
        'anchorName': function(i, heading, prefix) { //custom function for anchor name
            return prefix+i;
        }
    });

    var $catalog = $('#catalog_wrap');
    $( window ).scroll(function(evt) {
        var height = $( window ).scrollTop();
        if(height > 100) {
            $catalog.css("position") === "absolute" ? $catalog.css({position: "fixed"}) : '';
        }else {
            $catalog.css('position') === "fixed" ? $catalog.css({position: "absolute"}) : '';
        }
    });
	/* Secondary contact links */
	// var scontacts = $('#contact-list-secondary');
	// var contact_list = $('#contact-list');

	// scontacts.hide();

	// contact_list.mouseenter(function(){ scontacts.fadeIn(); });

	// contact_list.mouseleave(function(){ scontacts.fadeOut(); });

});
