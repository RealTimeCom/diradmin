get('/rootdir', function(txt) {
    document.getElementById('root').innerHTML = txt;
});

get('/list', list);

function list(txt) {
    try {
        var r = JSON.parse(txt);
    } catch (e) {
        return console.error(e);
    }
    if (r.e) {
        alert(r.e);
    } else if (r.r) {
        var bd, bk, doc = document.getElementById('list');
        doc.innerHTML = ''; // reset
        for (var k in r.r) {
            bd = '<span class="link" onclick="if (confirm(\'Are you sure?\')) { get(\'/rmdir?dir=\' + encodeURIComponent(\'' + k + '\'), list); }">del</span>';
            bk = '<span class="link" onclick="keys(\'' + k + '\')">keys</span>';
            doc.innerHTML += '<div>[ ' + bd + ' | ' + bk + ' ] <b>' + k + '</b> ' + JSON.stringify(r.r[k]) + '</div>';
        }
    } else if (r.k && r.d) {
        var doc = document.getElementById('list');
        doc.innerHTML = '<div>Dir: <b>' + r.d + '</b></div>'; // reset
        for (var uid in r.k) {
            doc.innerHTML += '<div><span id="' + uid + '"></span>' + uid + ' <span color="green">||</span> ' + r.k[uid] + '</div>';
            get('/val?dir=' + encodeURIComponent(r.d) + '&uid=' + encodeURIComponent(uid) + '&hash=' + encodeURIComponent(r.k[uid]), val);
        }
        doc.innerHTML += '<div>Insert into <b>' + r.d  + '</b> <form style="display: inline" onsubmit="return keysub(\'' + r.d + '\')">Key: <input id="key" type="text"> Value: <input id="val" type="text"> <input type="submit" value="Set"></form></div>';
    } else {
        console.error(r);
    }
}
function keysub(dir) {
    get('/put?dir=' + encodeURIComponent(dir) + '&key=' + encodeURIComponent(document.getElementById('key').value) + '&val=' + encodeURIComponent(document.getElementById('val').value), put);
    document.getElementById('key').value = '';
    document.getElementById('val').value = '';
    return false;
}

function put(txt) {
    try {
        var r = JSON.parse(txt);
    } catch (e) {
        return console.error(e);
    }
    if (r.e) {
        alert(r.e);
    } else if (r.d) {
        keys(r.d);
    }
}

function keys(dir) {
    get('/keys?dir=' + encodeURIComponent(dir), list);
}

function val(txt) {
    try {
        var r = JSON.parse(txt);
    } catch (e) {
        return console.error(e);
    }
    if (r.e) {
        alert(r.e);
    } else if (r.uid && r.k && r.v) {
        document.getElementById(r.uid).innerHTML = r.k + ' <span color="green">||</span> ' + r.v + ' <span color="green">||</span> ';
    }
}
