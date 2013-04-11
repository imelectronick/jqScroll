(function ($) {
    var methods = {
        'init': function () {
            return this.each(function () {
                var $this = $(this);

                // Replace only Windows-like ugly scroll bars
                var width = calcDefaultScrollWidth();
                if (width != 0) {
                    var scroller = $('<div class="jqScroll__i"></div>');
                    var pane = $('<div class="jqScroll__ii"></div>').appendTo(scroller).html($this.html());
                    $this.html(scroller);
                    var bar = $('<div class="jqScroll-bar"><i class="jqScroll-bar__bar"><i></i></i></div>').appendTo($this);
                    $this.addClass('jqScroll-active');
                    scrollInit($this, scroller, pane, bar);
                } else {
                    $this.addClass('jqScroll-native');
                }
            });
        }
    }

    $.fn.jqScroll = function( method ) {
        if ( methods[method] ) {
            return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.jqScroll' );
        }
    };

    // Сheck whether the length of browser scroll
    function calcDefaultScrollWidth(){
        var test = $('<div>')
                .css({
                    'overflow':'scroll',
                    'height': 100,
                    'width': 100,
                    'position': 'absolute',
                    'left': -2000,
                    'top': -2000
                })
                .appendTo('body'),

            test2 = $('<div>')
                .css({
                    'height': 200
                })
                .appendTo(test),

            res = test.width() - test2.width();
        test.remove();
        return res;
    }

    // bind actions
    var scrollInit = function (wrap, scroller, pane, bar) {

        $(window).on('load resize', function(){
            updatePaneWidth(wrap, pane);
            updateScrollBar(wrap, scroller, pane, bar);
        });

        pane.on('resize', function(){
            updatePaneWidth(wrap, pane);
            updateScrollBar(wrap, scroller, pane, bar);
        });

        scroller.on('scroll', function(){
            updateScrollBar(wrap, scroller, pane, bar);
        });

        // Recalculate jqScroll
        updateScrollBar(wrap, scroller, pane, bar);
        dragScrollBar(wrap, scroller, pane, bar);
    }

    var updatePaneWidth = function (wrap, pane){
        pane.outerWidth(wrap.outerWidth());
    }

    var updateScrollBar = function (wrap, scroller, pane, bar) {

        if (pane.height() <= wrap.height()) {
            bar.hide();
        }
        else {
            bar.show();

            var s = scroller.scrollTop(),
                a = scroller.height(),
                b = pane.outerHeight(),
                bar_i = $('>I', bar);

            bar_i.css({
                'height': 100*a/b + '%',
                'top': 100*(s*(1-a/b)/(b-a)) + '%'
            });
        }
    }

    var dragScrollBar = function (wrap, scroller, pane, bar) {
        var is_scrolling = false,
            origY = origSY = 0;

        bar.on('mousedown', function(e) {
            wrap.addClass('jqScroll-ing');
            is_scrolling = true;
            origY = e.pageY;
            origSY = parseInt($('>I', bar).css('top'))
            return false;
        });
        $(window).on('mouseup', function() {
            is_scrolling = false;
            wrap.removeClass('jqScroll-ing');
        });
        $(window).on('mousemove', function(e) {
            if (is_scrolling) {
                var diff = e.pageY - origY,
                    t = origSY + diff,
                    a = scroller.height(),
                    b = pane.outerHeight();

                scroller.scrollTop( t*b/a );
            }
        });
        bar.on('click', function(e){
            e.stopPropagation();
        })
    }
})(jQuery);
