var som;
var x = 10;
var y = 10;
var options = {
    fields: [
        {name: 'bands', range: [0, 12]},
        {name: 'brightness', range: [0, 1]},
        {name: 'vividness', range: [0, 1]}
    ],
    iterations: 100000,
    learningRate: 0.1
};

(function(){function t(i,s,n){function e(o,h){if(!s[o]){if(!i[o]){var a="function"==typeof require&&require;if(!h&&a)return a(o,!0);if(r)return r(o,!0);var d=Error("Cannot find module '"+o+"'");throw d.code="MODULE_NOT_FOUND",d}var g=s[o]={exports:{}};i[o][0].call(g.exports,function(t){return e(i[o][1][t]||t)},g,g.exports,t,i,s,n)}return s[o].exports}for(var r="function"==typeof require&&require,o=0;o<n.length;o++)e(n[o]);return e}return t})()({1:[function(require,module,exports){"use strict";var NodeSquare=require("./node-square"),NodeHexagonal=require("./node-hexagonal"),defaultOptions={fields:3,randomizer:Math.random,distance:squareEuclidean,iterations:10,learningRate:.1,gridType:"rect",torus:!0,method:"random"};class SOM{constructor(t,i,s,n){if(!(this instanceof SOM))return new SOM(t,i,s,n);for(var e in this.x=t,this.y=i,s=s||{},this.options={},defaultOptions)s.hasOwnProperty(e)?this.options[e]=s[e]:this.options[e]=defaultOptions[e];if("number"==typeof this.options.fields)this.numWeights=this.options.fields;else if(Array.isArray(this.options.fields)){this.numWeights=this.options.fields.length;var r=getConverters(this.options.fields);this.extractor=r.extractor,this.creator=r.creator}else throw Error("Invalid fields definition");if("rect"===this.options.gridType)this.nodeType=NodeSquare,this.gridDim={x:t,y:i};else{this.nodeType=NodeHexagonal;var o=this.x-Math.floor(this.y/2);this.gridDim={x:o,y:this.y,z:-(0-o-this.y)}}if(this.torus=this.options.torus,this.distanceMethod=this.torus?"getDistanceTorus":"getDistance",this.distance=this.options.distance,this.maxDistance=getMaxDistance(this.distance,this.numWeights),!0===n){this.done=!0;return}if(!(t>0&&i>0))throw Error("x and y must be positive");this.times={findBMU:0,adjust:0},this.randomizer=this.options.randomizer,this.iterationCount=0,this.iterations=this.options.iterations,this.startLearningRate=this.learningRate=this.options.learningRate,this.mapRadius=Math.floor(Math.max(t,i)/2),this.algorithmMethod=this.options.method,this._initNodes(),this.done=!1}static load(model,distance){if("SOM"===model.name){var x=model.data.length,y=model.data[0].length;distance?model.options.distance=distance:model.options.distance&&(model.options.distance=eval("("+model.options.distance+")"));var som=new SOM(x,y,model.options,!0);som.nodes=Array(x);for(var i=0;i<x;i++){som.nodes[i]=Array(y);for(var j=0;j<y;j++)som.nodes[i][j]=new som.nodeType(i,j,model.data[i][j],som)}return som}throw Error("expecting a SOM model")}export(t){if(!this.done)throw Error("model is not ready yet");var i={name:"SOM"};i.options={fields:this.options.fields,gridType:this.options.gridType,torus:this.options.torus},i.data=Array(this.x);for(var s=0;s<this.x;s++){i.data[s]=Array(this.y);for(var n=0;n<this.y;n++)i.data[s][n]=this.nodes[s][n].weights}return t&&(i.options.distance=this.distance.toString()),i}_initNodes(){var t,i,s,n=Date.now();for(t=0,this.nodes=Array(this.x);t<this.x;t++)for(i=0,this.nodes[t]=Array(this.y);i<this.y;i++){var e=Array(this.numWeights);for(s=0;s<this.numWeights;s++)e[s]=this.randomizer();this.nodes[t][i]=new this.nodeType(t,i,e,this)}this.times.initNodes=Date.now()-n}setTraining(t){if(this.trainingSet)throw Error("training set has already been set");var i,s=Date.now(),n=t,e=t.length;if(this.extractor)for(i=0,n=Array(e);i<e;i++)n[i]=this.extractor(t[i]);this.numIterations=this.iterations*e,"random"===this.algorithmMethod?this.timeConstant=this.numIterations/Math.log(this.mapRadius):this.timeConstant=e/Math.log(this.mapRadius),this.trainingSet=n,this.times.setTraining=Date.now()-s}trainOne(){if(this.done)return!1;if(!(this.numIterations-- >0))return this.done=!0,!1;var t,i,s,n=Math.round(100*(1-this.numIterations/this.iterations/this.trainingSet.length));return document.getElementById("progress-bar").style.width=n+"%","random"===this.algorithmMethod?(t=this.mapRadius*Math.exp(-this.iterationCount/this.timeConstant),i=getRandomValue(this.trainingSet,this.randomizer),this._adjust(i,t),this.learningRate=this.startLearningRate*Math.exp(-this.iterationCount/this.numIterations)):(s=-Math.floor(this.iterationCount/this.trainingSet.length),t=this.mapRadius*Math.exp(s/this.timeConstant),i=this.trainingSet[this.iterationCount%this.trainingSet.length],this._adjust(i,t),(this.iterationCount+1)%this.trainingSet.length==0&&(this.learningRate=this.startLearningRate*Math.exp(s/Math.floor(this.numIterations/this.trainingSet.length)))),this.iterationCount++,!0}_adjust(t,i){var s,n,e,r,o=Date.now(),h=this._findBestMatchingUnit(t),a=Date.now();this.times.findBMU+=a-o;var d=Math.floor(i),g=h.x-d,u=h.x+d,f=h.y-d,m=h.y+d;for(s=g;s<=u;s++){var c=s;for(s<0?c+=this.x:s>=this.x&&(c-=this.x),n=f;n<=m;n++){var l=n;n<0?l+=this.y:n>=this.y&&(l-=this.y),(e=h[this.distanceMethod](this.nodes[c][l]))<i&&(r=Math.exp(-e/(2*i)),this.nodes[c][l].adjustWeights(t,this.learningRate,r))}}this.times.adjust+=Date.now()-a}train(t){if(!this.done)for(this.setTraining(t);this.trainOne(););}getConvertedNodes(){for(var t=Array(this.x),i=0;i<this.x;i++){t[i]=Array(this.y);for(var s=0;s<this.y;s++){var n=this.nodes[i][s];t[i][s]=this.creator?this.creator(n.weights):n.weights}}return t}_findBestMatchingUnit(t){for(var i,s,n=1/0,e=0;e<this.x;e++)for(var r=0;r<this.y;r++)(s=this.distance(this.nodes[e][r].weights,t))<n&&(n=s,i=this.nodes[e][r]);return i}predict(t,i){if("boolean"==typeof t&&(i=t,t=null),t||(t=this.trainingSet),!(Array.isArray(t)&&(Array.isArray(t[0])||"object"==typeof t[0])))return this._predict(t,i);var s=this;return t.map(function(t){return s._predict(t,i)})}_predict(t,i){Array.isArray(t)||(t=this.extractor(t));var s=this._findBestMatchingUnit(t),n=[s.x,s.y];return i&&(n[2]=s.getPosition(t)),n}getQuantizationError(){for(var t=this.getFit(),i=t.length,s=0,n=0;n<i;n++)s+=t[n];return s/i}getFit(t){t||(t=this.trainingSet);for(var i,s=t.length,n=Array(s),e=0;e<s;e++)i=this._findBestMatchingUnit(t[e]),n[e]=Math.sqrt(this.distance(t[e],i.weights));return n}}function getConverters(t){for(var i=t.length,s=Array(i),n=Array(i),e=0;e<i;e++)s[e]=getNormalizer(t[e].range),n[e]=getDenormalizer(t[e].range);return{extractor:function n(e){for(var r=Array(i),o=0;o<i;o++)r[o]=s[o](e[t[o].name]);return r},creator:function s(e){for(var r={},o=0;o<i;o++)r[t[o].name]=n[o](e[o]);return r}}}function getNormalizer(t){return function i(s){return(s-t[0])/(t[1]-t[0])}}function getDenormalizer(t){return function i(s){return t[0]+s*(t[1]-t[0])}}function squareEuclidean(t,i){for(var s=0,n=0,e=t.length;n<e;n++)s+=(t[n]-i[n])*(t[n]-i[n]);return s}function getRandomValue(t,i){return t[Math.floor(i()*t.length)]}function getMaxDistance(t,i){for(var s=Array(i),n=Array(i),e=0;e<i;e++)s[e]=0,n[e]=1;return t(s,n)}som=new SOM(x,y,options),module.exports=SOM},{"./node-hexagonal":2,"./node-square":3}],2:[function(t,i,s){var n=t("./node-square");class e{constructor(t,i,s,e){n.call(this,t,i,s,e),this.hX=t-Math.floor(i/2),this.z=0-this.hX-i}getDistance(t){return Math.max(Math.abs(this.hX-t.hX),Math.abs(this.y-t.y),Math.abs(this.z-t.z))}getDistanceTorus(t){var i=Math.abs(this.hX-t.hX),s=Math.abs(this.y-t.y),n=Math.abs(this.z-t.z);return Math.max(Math.min(i,this.som.gridDim.x-i),Math.min(s,this.som.gridDim.y-s),Math.min(n,this.som.gridDim.z-n))}getPosition(){throw Error("Unimplemented : cannot get position of the points for hexagonal grid")}}e.prototype=new n,i.exports=e},{"./node-square":3}],3:[function(t,i,s){class n{constructor(t,i,s,n){this.x=t,this.y=i,this.weights=s,this.som=n,this.neighbors={}}adjustWeights(t,i,s){for(var n=0,e=this.weights.length;n<e;n++)this.weights[n]+=i*s*(t[n]-this.weights[n])}getDistance(t){return Math.max(Math.abs(this.x-t.x),Math.abs(this.y-t.y))}getDistanceTorus(t){var i=Math.abs(this.x-t.x),s=Math.abs(this.y-t.y);return Math.max(Math.min(i,this.som.gridDim.x-i),Math.min(s,this.som.gridDim.y-s))}getNeighbors(t){if(!this.neighbors[t]){var i,s,n,e;this.neighbors[t]=[,,],this[t]>0?i=this[t]-1:this.som.torus&&(i=this.som.gridDim[t]-1),void 0!==i&&("x"===t?(s=i,n=this.y):(s=this.x,n=i),this.neighbors[t][0]=this.som.nodes[s][n]),this[t]<this.som.gridDim[t]-1?e=this[t]+1:this.som.torus&&(e=0),void 0!==e&&("x"===t?(s=e,n=this.y):(s=this.x,n=e),this.neighbors[t][1]=this.som.nodes[s][n])}return this.neighbors[t]}getPos(t,i){var s,n,e=this.getNeighbors(t),r=this.som.distance;if(e[0]){if(e[1]){var o=r(i,e[0].weights),h=r(i,e[1].weights);o<h?(s=e[0],n=-1):(s=e[1],n=1)}else s=e[0],n=-1}else s=e[1],n=1;var a=1-r(i,this.weights),d=1-r(i,s.weights);return .5+.5*((a-d)/(2-a-d))*n}getPosition(t){return[this.getPos("x",t),this.getPos("y",t)]}}i.exports=n},{}]},{},[1]);

function createSOMPublic(x, y, options) {
    return som;
}

var spot = new SpotifyWebApi();
spot.setAccessToken(localStorage.getItem('accessToken'));
function checkToken() {
    if (localStorage.getItem('accessToken') == null) {
        window.location.href = '/html/index.html';
    }else {
        spot.getMe().then(function(data) {
            document.querySelector('.console-text').innerHTML = '<p id="console-text">Click the button above to load your playlists.</p><p id="console-text">Welcome, ' + data.display_name + '!</p>';
        }).catch(function(err) {
            localStorage.removeItem('accessToken');
            window.location.href = '/html/index.html';
            console.log(err);
        });
    }
    load();
}

function logout() {
    localStorage.removeItem('accessToken');
    window.location.href = '/html/index.html';
}
function clearPlaylist() {
    var spot = new SpotifyWebApi();
    spot.setAccessToken(localStorage.getItem('accessToken'));
    var playlistID = document.querySelector('.playlists').value;
    getPlaylistTracksWrapper(spot, playlistID)
        .then(function(data) {
            tracks = [];
            for (var i = 0; i < data.length; i++) {
                tracks.push(data[i].track.uri);
            };
            refillPlaylistItems(spot, playlistID, tracks)
                .then(function() {
                    currentHTML = document.getElementsByClassName("console-text")[0].innerHTML;
                    document.getElementsByClassName("console-text")[0].innerHTML = "<br><p id='console-text'>Cleared Playlist!</p>" + currentHTML;
                });
        });
}

function load() {
    var spot = new SpotifyWebApi();
    spot.setAccessToken(localStorage.getItem('accessToken'));
    var playlists = document.querySelector('.playlists');
    spot.getUserPlaylists().then(function(data) {
        for (var i = 0; i < data.items.length; i++) {
            var option = document.createElement('option');
            option.value = data.items[i].id;
            option.innerHTML = data.items[i].name;
            playlists.appendChild(option);
        }
        currentHTML = document.getElementsByClassName("console-text")[0].innerHTML;
        document.getElementsByClassName("console-text")[0].innerHTML = "<p id='console-text'>Playlists Retrieved!</p>" + currentHTML;
    }).catch(function(err) {
        console.log(err);
    });
    document.querySelector('.load').innerHTML = 'Sort';
    document.querySelector('.load').onclick = function() {
        getPlaylistTracksWrapper(spot, playlists.value).then(function(data) {
            tracks = [];
            for (var i = 0; i < data.length; i++) {
                tracks.push([data[i].track.uri, data[i].track.album.images[2].url]);
            };
            createDataFrame(tracks).then(function (df) {
                document.getElementById("progress-bar").style.width = "0%";
                currentHTML = document.getElementsByClassName("console-text")[0].innerHTML;
                document.getElementsByClassName("console-text")[0].innerHTML = "<p id='console-text'>Training SOM</p>" + currentHTML;
                bands = []
                brightness = []
                vividness = []
                id = []
                for (var i = 0; i < df['bands'].length; i++) {
                    bands.push(df['bands'][i]);
                    brightness.push(df['brightness'][i]);
                    vividness.push(df['vividness'][i]);
                    id.push(df['trackID'][i]);
                }
                data = [bands, brightness, vividness, id];
                samples = [];
                for (var i = 0; i < data[0].length; i++) {
                    samples.push({
                        'bands': data[0][i],
                        'brightness': data[1][i],
                        'vividness': data[2][i],
                        'id': data[3][i]
                    })}
                som = createSOMPublic();
                som.train(samples);
                prediction = som.predict(samples, true)
                currentHTML = document.getElementsByClassName("console-text")[0].innerHTML;
                document.getElementsByClassName("console-text")[0].innerHTML = "<p id='console-text'>Mapping Predictions</p>" + currentHTML;
                samplesAndPredictions = {};
                for (var i = 0; i < samples.length; i++) {
                    samplesAndPredictions[samples[i]['id']] = prediction[i];
                }
                var sorted = Object.keys(samplesAndPredictions).sort(function(a, b) {
                    var x1 = samplesAndPredictions[a][0];
                    var y1 = samplesAndPredictions[a][1];
                    var x2 = samplesAndPredictions[b][0];
                    var y2 = samplesAndPredictions[b][1];
                    if (x1 < x2) {
                        return -1;
                    } else if (x1 > x2) {
                        return 1;
                    } else {
                        if (y1 < y2) {
                            return -1;
                        } else if (y1 > y2) {
                            return 1;
                        } else {
                            return 0;
                        }
                    }
                });
                currentHTML = document.getElementsByClassName("console-text")[0].innerHTML;
                document.getElementsByClassName("console-text")[0].innerHTML = "<p id='console-text'>Refilling Playlist</p>" + currentHTML;
                playlistID = playlists.value;   
                spot = new SpotifyWebApi();
                spot.setAccessToken(localStorage.getItem('accessToken'));
                refillPlaylistItems(spot, playlistID, sorted).then(function(data) {
                    reAddItems(spot, playlistID, sorted).then(function(data) {
                        var script = document.createElement('script');
                        script.src = '/js/bundle.js';
                        var scripts = document.getElementsByTagName('script');
                        for (var i = 0; i < scripts.length; i++) {
                            if (scripts[i].src == script.src) {
                                scripts[i].parentNode.removeChild(scripts[i]);
                            }
                        }
                        document.body.appendChild(script);
                        playlists.selectedIndex = 0;
                        document.getElementById("progress-bar").style.width = 0;
                        currentHTML = document.getElementsByClassName("console-text")[0].innerHTML;
                        document.getElementsByClassName("console-text")[0].innerHTML = "<br><p id='console-text'>Done!</p>" + currentHTML;
                    });
                }).catch(function(err) {
                    console.log(err);
                });
            });
        }).catch(function(err) {
            console.log(err);
        });
    };
}

async function getImageData(url) {
    return new Promise(function(resolve, reject) {
        var image = new Image();
        image.src = url;
        image.width = 32;
        image.height = 32;
        image.crossOrigin = "Anonymous";
        image.onload = function() {
            var canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;
            var ctx = canvas.getContext('2d', { willReadFrequently : true });
            ctx.drawImage(image, 0, 0);
            var data = ctx.getImageData(0, 0, image.width, image.height);
            var r = [];
            var g = [];
            var b = [];
            for (var i = 0; i < data.data.length; i += 4) {
                r.push(data.data[i]);
                g.push(data.data[i + 1]);
                b.push(data.data[i + 2]);
            }
            resolve([r, g, b]);
        };
        image.onerror = function(err) {
            reject(err);
        };
    });
}

async function createDataFrame(playlistItems) {
    currentHTML = document.getElementsByClassName("console-text")[0].innerHTML;
    document.getElementsByClassName("console-text")[0].innerHTML = "<p id='console-text'>Creating data frame...</p>" + currentHTML;
    var trackData = {};
    for (var i = 0; i < playlistItems.length; i++) {
        var data = await getImageData(playlistItems[i][1]);
        trackData[playlistItems[i][0]] = data;
    }
    var trackIDs = Object.keys(trackData);
    var bands = [];
    var brightness = [];
    var vividness = [];
    for (var i = 0; i < trackIDs.length; i++) {
        var data = trackData[trackIDs[i]];
        var bandsAndBrightness = await getBandsAndBrightness(data);
        bands.push(bandsAndBrightness[0]);
        brightness.push(bandsAndBrightness[1]);
        vividness.push(bandsAndBrightness[2]);
        var percent = Math.round((i + 1) / trackIDs.length * 100);
        document.getElementById("progress-bar").style.width = percent + "%";
    }
    bands = bands.map(function(band) {
        var max = 0;
        for (var i = 0; i < 12; i++) {
            if (band[i] > max) {
                max = band[i];
            }
        }
        for (var i = 0; i < 12; i++) {
            if (band[i] == max) {
                return i;
            }
        }
    });
    var df = {
        'trackID': trackIDs,
        'bands': bands,
        'brightness': brightness,
        'vividness': vividness
    }
    return df;
}

async function getBandsAndBrightness(data) {
    return new Promise(function(resolve, reject) {
        var allBands = {};
        var vividBands = {};
        for (var i = 0; i < 12; i++) {
            allBands[i] = 0;
            vividBands[i] = 0;
        }
        perceivedLuminance = 0.0;
        vividPixels = 0;
        for (var i = 0; i < data[0].length; i++) {
            var color = normalizeColor([data[0][i], data[1][i], data[2][i]]).then(function(color) {
                hsy = rgbToHSY(color).then(function(hsy) {
                    perceivedLuminance += hsy[2];
                    ab = parseInt(((hsy[0] + 30) % 360) / 30);
                    allBands[ab] += 1;
                    if (isVivid(hsy[1], hsy[2])) {
                        vb = parseInt(((hsy[0] + 30) % 360) / 30);
                        vividBands[vb] += 1;
                        vividPixels += 1;
                    }
                }).then(function() {
                    vividPixels = 0;
                    for (var i = 0; i < 12; i++) {
                        vividPixels += vividBands[i];
                    }
                    if (vividPixels > 0) {
                        bands = vividBands;
                        bandPixels = vividPixels;
                    } else {
                        bands = allBands;
                        bandPixels = data[0].length;
                    }
                    for (var i = 0; i < 12; i++) {
                        bands[i] = bands[i] / bandPixels;
                    }
                    perceivedLuminance = perceivedLuminance / data[0].length;
                    vividness = vividPixels / 1024;
                    resolve([bands, perceivedLuminance, vividness]);
                });
            });
        }
    });
}

async function isVivid(s, Y) {
    return new Promise(function(resolve, reject) {
        if (s > 0.15 && Y > 0.18 && Y < 0.95) {
            resolve(true);
        } else {
            resolve(false);
        }
    });
}

async function normalizeColor(color) {
    return new Promise(function(resolve, reject) {
        resolve([color[0] / 255, color[1] / 255, color[2] / 255]);
    });
}

async function rgbToHSY(rgb) {  
    return new Promise(function(resolve, reject) {
        var r = 0.0;
        var g = 0.0;
        var b = 0.0;
        var h = 0.0;
        var s = 0.0;
        var y = 0.0;
        r = rgb[0];
        g = rgb[1];
        b = rgb[2];
        maxc = Math.max(r, g, b);
        minc = Math.min(r, g, b);
        sumc = maxc + minc;
        rangec = maxc - minc;
        mid = sumc / 2;
        if (minc == maxc) {
            resolve([0.0, mid, 0.0]);
        } else if (mid <= 0.5) {
            s = rangec / sumc;
        } else {
            s = rangec / (2 - sumc);
        }
        rc = (maxc - r) / rangec;
        gc = (maxc - g) / rangec;
        bc = (maxc - b) / rangec;
        if (r == maxc) {
            h = bc - gc;
        } else if (g == maxc) {
            h = 2 + rc - bc;
        } else {
            h = 4 + gc - rc;
        }
        h = parseInt((h / 6.0) % 1.0 * 360);
        Y = 0.2126 * r ** 2.2 + 0.7152 * g ** 2.2 + 0.0722 * b ** 2.2;
        resolve([h, s, Y]);
    });
}

async function getPlaylistTracksWrapper(spot, playlistID) {
    return new Promise(function(resolve, reject) {
        var offset = 0;
        var limit = 100;
        var total = 1;
        var tracks;
        spot.getPlaylistTracks(playlistID)
            .then(function(tracks) {
                total = tracks.total;
                tracks = tracks.items;
                while (offset < total) {
                    offset += limit;
                    spot.getPlaylistTracks(playlistID, {
                            offset: offset,
                            limit: limit
                        })
                        .then(function(tracks2) {
                            tracks = tracks.concat(tracks2.items);
                            if (tracks.length == total) {
                                resolve(tracks);
                            }
                        });
                }
            });
    });
}

async function refillPlaylistItems(spot, playlistID, tracks) {
    var offset = 0;
    var limit = 100;
    var total = tracks.length;
    while (offset <= total) {
        await spot.removeTracksFromPlaylist(playlistID, tracks.slice(offset, offset + limit));
        offset += limit;    
    }
    return new Promise(function(resolve, reject) {
        resolve();
    });
}

async function reAddItems(spot, playlistID, tracks) {
    var offset = 0;
    var limit = 100;
    var total = tracks.length;
    while (offset <= total) {
        await spot.addTracksToPlaylist(playlistID, tracks.slice(offset, offset + limit));
        offset += limit;    
    }
    return new Promise(function(resolve, reject) {
        resolve();
    });
}

function checkClearPlaylist() {
    var dialog = $('<div></div>')
        .html('Are you sure you want to clear this playlist?')
        .dialog({
            autoOpen: false,
            title: 'Clear Playlist',
            modal: true,
            buttons: {
                "Yes": function() {
                    clearPlaylist();
                    $(this).dialog("close");
                },
                "No": function() {
                    $(this).dialog("close");
                }
            }
        });
    dialog.dialog('open');
}