function showErrorMsg() {
    //----- OPEN
    var targeted_popup_class = jQuery(this).attr('data-popup-open');
    $('[data-popup="popup-1"]').fadeIn(350);
    $("#wrapper").toggleClass("toggled");

    //----- CLOSE
    $('[data-popup-close]').on('click', function (e) {
        var targeted_popup_class = jQuery(this).attr('data-popup-close');
        $('[data-popup="' + targeted_popup_class + '"]').fadeOut(350);
    });
};


