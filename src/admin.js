function get(url, cb) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            cb(this.responseText);
        }
    };
    xhttp.open('GET', url, true);
    xhttp.send();
    return false;
}

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
            bd = '<span class="link" onclick="if (confirm(\'Delete dir < ' + k + ' > ?\')) { get(\'/rmdir?dir=\' + encodeURIComponent(\'' + k + '\'), list); }">del</span>';
            bk = '<span class="link" onclick="keys(\'' + k + '\', 0, 5)">keys</span>';
            doc.innerHTML += '<div>[ ' + bd + ' | ' + bk + ' ] <b>' + k + '</b> ' + JSON.stringify(r.r[k]) + '</div>';
        }
    } else if (r.k && r.d && typeof r.start === 'number' && typeof r.end === 'number') {
        var bd, count = 0, doc = document.getElementById('list');
        doc.innerHTML = '<div>Dir: <b>' + r.d + '</b></div><div>Range: ' + r.start + ' - ' + r.end + '</div>'; // reset
        for (var uid in r.k) {
            count++;
            bd = '<span class="link" onclick="if (confirm(\'Delete key < ' + uid + ' > ?\')) { get(\'/del?dir=\' + encodeURIComponent(\'' + r.d + '\') + \'&uid=\' + encodeURIComponent(\'' + uid + '\') + \'&hash=\' + encodeURIComponent(\'' + r.k[uid] + '\'), range); }">del</span>';
            doc.innerHTML += '<div>[ ' + bd + ' ] <span id="' + uid + '"></span>' + uid + ' <span style="color: green">||</span> ' + r.k[uid] + '</div>';
            get('/val?dir=' + encodeURIComponent(r.d) + '&uid=' + encodeURIComponent(uid) + '&hash=' + encodeURIComponent(r.k[uid]), val);
        }
        doc.innerHTML += '<div>';
        if (r.start >= 5) {
            doc.innerHTML += '<span class="link" onclick="keys(\'' + r.d + '\', ' + (r.start - 5) + ', ' + (r.end - 5) + ')">< Back</span>';
        }
        if (count === 5) {
            if (r.start >= 5) { doc.innerHTML += ' | '; }
            doc.innerHTML += '<span class="link" onclick="keys(\'' + r.d + '\', ' + (r.start + 5) + ', ' + (r.end + 5) + ')">Next ></span>';
        }
        doc.innerHTML += '</div>';
        doc.innerHTML += '<div><form style="display: inline" onsubmit="return keysub(\'' + r.d + '\')">Key: <input id="key" type="text"> Value: <input id="val" type="text"> <input type="submit" value="Put"></form></div>';
    } else {
        console.error(r);
    }
}
function keysub(dir) {
    get('/put?dir=' + encodeURIComponent(dir) + '&key=' + encodeURIComponent(document.getElementById('key').value) + '&val=' + encodeURIComponent(document.getElementById('val').value), range);
    document.getElementById('key').value = '';
    document.getElementById('val').value = '';
    return false;
}

function range(txt) {
    try {
        var r = JSON.parse(txt);
    } catch (e) {
        return console.error(e);
    }
    if (r.e) {
        alert(r.e);
    } else if (r.d) {
        keys(r.d, 0, 5);
    }
}

function keys(dir, start, end) {
    get('/keys?dir=' + encodeURIComponent(dir) + '&start=' + start + '&end=' + end, list);
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
        document.getElementById(r.uid).innerHTML = r.k + (r.k.length === 20 ? '<span style="color: red">...</span>' : '') + ' <span style="color: green">||</span> ' + r.v + (r.v.length === 20 ? '<span style="color: red">...</span>' : '') + ' <span style="color: green">||</span> ';
    }
}
