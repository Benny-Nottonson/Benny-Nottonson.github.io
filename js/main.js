var client_id = 'b6bc56d7dc814e90b19c99b4249bcf86';
var redirect_uri = 'http://localhost:8080/html/callback.html';
var scope = 'user-read-private user-read-email playlist-read-private playlist-read-collaborative playlist-modify-public playlist-modify-private';

function login() {
    var loginWindow = window.open('https://accounts.spotify.com/authorize?client_id=' + client_id + '&scope=' + scope + '&response_type=token&redirect_uri=' + redirect_uri, 'Spotify', 'width=400,height=500');
    loginWindow.onbeforeunload = function() {
        checkLogin();
    }
}

function checkLogin() {
    if (window.location.hash) {
        var access_token = window.location.hash.substring(14);
        localStorage.setItem('access_token', access_token);
        window.location = 'index.html';
    }
}

$(document).ready(function() {
    $('#login').click(function() {
        login();
    });
});

function getUserPlaylistNames(access_token) {
    var playlists = [];
    Request.get = function(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
        xhr.onload = function() {
            callback(xhr.responseText);
        };
        xhr.send();
    };
    Request.get('https://api.spotify.com/v1/me/playlists', function(response) {
        var data = JSON.parse(response);
        for (var i = 0; i < data.items.length; i++) {
            playlists.push(data.items[i].name);
        }
    });
    return playlists;
}

function getUserPlaylistIDs(access_token) {
    var playlists = [];
    Request.get = function(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
        xhr.onload = function() {
            callback(xhr.responseText);
        };
        xhr.send();
    };
    Request.get('https://api.spotify.com/v1/me/playlists', function(response) {
        var data = JSON.parse(response);
        for (var i = 0; i < data.items.length; i++) {
            playlists.push(data.items[i].id);
        }
    });
    return playlists;
}

function getPlaylistItems(access_token, playlist_id) {
    var playlistItems = [];
    Request.get = function(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
        xhr.onload = function() {
            callback(xhr.responseText);
        }
        xhr.send();
    };
    Request.get('https://api.spotify.com/v1/playlists/' + playlist_id + '/tracks', function(response) {
        var data = JSON.parse(response);
        for (var i = 0; i < data.items.length; i++) {
            playlistItems.push([data.items[i].track.id, data.items[i].track.album.images[2].url]);
        }
    });
    return playlistItems;
}
