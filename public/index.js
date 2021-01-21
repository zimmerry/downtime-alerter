function insertNewSite(url) {
    var context = {
        url: url
    };

    var siteHTML = Handlebars.templates.site(context);

    websiteSection = document.getElementById('websites');
    websiteSection.insertAdjacentHTML('beforeEnd', siteHTML);

    var websiteCheckBoxes = document.getElementsByClassName('website-check');
    for(var i = 0; i < websiteCheckBoxes.length; i++) {
        websiteCheckBoxes[i].addEventListener('click', removeSite);
    }
}


var allSites = [];

function handleNewWebsiteButtonClick() {

    var url = document.getElementById('new-website-text').value.trim();

    if (!url) {
        alert("You must enter a URL!");
    } else {
        var newSiteReq = new XMLHttpRequest();
        newSiteReq.open('POST', '/addSite');

        var reqBody = JSON.stringify({
            url: url
        });

        newSiteReq.setRequestHeader('Content-type', 'application/json');
        newSiteReq.addEventListener('load', function(event) {
            if (event.target.status === 200) {
                insertNewSite(url);
            } else {
                alert("Error storing website in database: " + event.target.response);
            }
        });

        newSiteReq.send(reqBody);

        document.getElementById('new-website-text').value = "";

  }

}

function removeSite() {
    var websites = document.getElementsByClassName('website-check');

    for(var i = 0; i < websites.length; i++) {
        if(websites[i].checked) {
            var urlToRemove = websites[i].parentNode.getAttribute("data-url")
            websites[i].checked = false;
            websites[i].parentNode.remove();
        }
    }

    var removeRequest = new XMLHttpRequest();
    removeRequest.open('POST', '/removeSite');

    var reqBody = JSON.stringify({
        urlToRemove: urlToRemove
    });

    removeRequest.setRequestHeader('Content-type', 'application/json');

    removeRequest.addEventListener('load', function (event) {
        if (event.target.status !== 200) {
            alert("Error removing website from database: " + event.target.response);
        }
    });

    removeRequest.send(reqBody);
}


/*
 * Wait until the DOM content is loaded, and then hook up UI interactions, etc.
 */
window.addEventListener('DOMContentLoaded', function () {

    var newWebsiteButton = document.getElementById('new-website-button');
    if(newWebsiteButton) {
        newWebsiteButton.addEventListener('click', handleNewWebsiteButtonClick)
    }

    var websiteCheckBoxes = document.getElementsByClassName('website-check');
    for(var i = 0; i < websiteCheckBoxes.length; i++) {
        websiteCheckBoxes[i].addEventListener('click', removeSite);
    }

});
