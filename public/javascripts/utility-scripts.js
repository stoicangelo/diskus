function makeAjaxPost(url, data, successCallback){
    var datastring = "";
    for(var key in data){
        datastring = datastring + key + '=' + data[key] + '&';
    }
    datastring = datastring.substring(0, datastring.length-1);  
    var xreq = new XMLHttpRequest();
    xreq.open('POST', url, true);
    xreq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xreq.onreadystatechange = function(){
        if(xreq.readyState == 4 ){
            if(xreq.status == 200){
                successCallback(xreq.responseText);
            }
            else {
                alert('something other thatn 200 responsecode came. sorry');
            }
        }
    };
    xreq.send(datastring);
}

var fetchById = function(idee){
    return document.getElementById(idee);
}

var fetchByClass = function(cl){
    var elementCollection = document.getElementsByClassName(cl);
    if(elementCollection.length == 1){
        return elementCollection[0]
    }
    else { return elementCollection; }
}

function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}