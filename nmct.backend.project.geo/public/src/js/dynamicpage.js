/*
 * Created by Arne on 11/2/15.*/
(function () {

    var pages = {
        index: {
            title: "Home Page",
            url: "pages/index.html",
            content: ""
        },
        login: {
            title: "Login",
            url: "pages/login.html",
            content: ""
        },
        register: {
            title: "Register",
            url: "pages/register.html",
            content: ""
        }
    };

    var navLinks = document.querySelectorAll('.load-content');
    var contentElements = document.getElementById('content');

    var updateContent = function(stateObj){
        if(stateObj){
            contentElements.innerHTML = stateObj.content;
        }
    };

    //load the page via AJAX
    var loadContent = function(url, callback){
        var request = new XMLHttpRequest();

        request.onload = function(response){
            //save html in pages object -> don't need to load again
            pages[url.split('.')[0]].content = response.target.response;

            var pageData = pages[url.split('.')[0]];

            //update content
            updateContent(pageData);
            //execute callback
            callback();
        };
        request.open('get','pages/'+url, true);
        request.send();
    };
    // Attach click listeners for each of the nav links.
    for(var i= 0, l=navLinks.length; i<l; i++){
        navLinks[i].addEventListener('click', function (e) {
            e.preventDefault();

            //fetch page data using the url in the link
            var pageURL = this.attributes['href'].value;

            loadContent(pageURL, function () {
                var pageData = pages[pageURL.split('.')[0]];

                //create new history item
                history.pushState(pageData, pageData.title, pageURL);
            });
        });
    }

    window.addEventListener('popstate', function(event){
        updateContent(event.state);
    });


    //load initial content
    loadContent('index.html', function () {
        history.replaceState(pages.index, pages.index.title, '');
    });
})();