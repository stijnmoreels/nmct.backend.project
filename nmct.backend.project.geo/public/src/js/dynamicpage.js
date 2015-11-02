/*
 * Created by Arne on 11/2/15.*/

function ChangeUrl(title, url) {
    if (typeof (history.pushState) != "undefined") {
        var obj = {Title: title, Url: url};
        history.pushState(obj, obj.Title, obj.Url);
    } else {
        alert("Browser does not support HTML5.");
    }
}


/*


(function dynamicpage() {
    //check if browser supports history
    if (Modernizr.history) {
        //alert('ok');
        var newHash = "",
            mainContent = document.getElementById("main-content"),
            pagewrapper = document.getElementById("sidebar-wrapper"),
            btnHome = document.getElementById("home"),
            btnLogin = document.getElementById("login"),
            baseheight = 0,
            el;
        baseheight = pagewrapper.offsetHeight - mainContent.offsetHeight;
        //console.log(baseheight);

        btnHome.addEventListener('click', function () {
            _link = this.getAttribute("href");
            history.pushState(null, null, _link);
            loadContent(_link);
            return false;
        });

        btnLogin.addEventListener('click', function () {
            _link = this.getAttribute("href");
            history.pushState(null, null, _link);
            loadContent(_link);
            return false;
        });

        function loadContent(href) {
            mainContent
                .find("#content")
                .fadeOut(200, function () {
                    mainContent.hide().load(href + "#content", function () {
                        mainContent.fadeIn(200, function () {
                            pagewrapper.animate({
                                height: baseheight + mainContent.height() + "px"
                            });
                        });
                        window.onpopstate = function () {
                            _link = location.pathname.replace(/^.*[\\\/]/, '');
                            loadContent(_link);
                        }
                    });
                })
        }
    }
})();
*/



