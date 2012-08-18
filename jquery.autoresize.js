// Copyright 2012, Артём Курбатов [tenorok.ru] | MIT License

jQuery.fn.autoResize = function(options) {

    var settings = $.extend({
        onResize: function() {},
        animate: true,
        animateDuration: 150,
        animateCallback: function() {},
        paddingBottom: 20,
        maxHeight: 1000,
        handResizing: true
    }, options);
    
    this.filter('textarea').each(function() {

        var curObj = this,

        textarea = (function() {

            if(settings.handResizing == true)
                return $(curObj).css({'overflow-y': 'hidden'});
            else
                return $(curObj).css({resize:'none', 'overflow-y': 'hidden'});

        })(),

        // Сохранение оригинальной высоты
        origHeight = textarea.height(),

        // Клон текстового поля
        clone = (function() {

            var props  = ['height', 'width', 'lineHeight', 'textDecoration', 'letterSpacing'],
                propOb = {};

            $.each(props, function(i, prop){
                propOb[prop] = textarea.css(prop);
            });
            
            // Создание дубликата текстового поля с удалением его атрибутов
            return textarea.clone().removeAttr('id').removeAttr('name').css({
                position: 'absolute',
                top: 0,
                left: -9999
            }).css(propOb).attr('tabIndex', '-1').insertAfter('body');
        })(),

        updateSize = function() {
            
            // Подготовка клона
            clone.height(0).val($(this).val()).scrollTop(10000);

            // Вычисление высоты текста
            var scrollTop = Math.max(clone.scrollTop(), origHeight) + settings.paddingBottom,
                toChange  = $(this).add(clone);

            // Проверка лимита
            if(scrollTop >= settings.maxHeight) {
                
                $(this).css('overflow-y', '');
                return;
            }
            
            settings.onResize.call(this);

            settings.animate && textarea.css('display') === 'block' ?
                toChange.stop().animate({height:scrollTop}, settings.animateDuration, settings.animateCallback):
                toChange.height(scrollTop);
        };

        textarea.bind('change keyup keydown',   updateSize);
    });
    
    return this;
};