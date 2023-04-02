function handleButtonClick(event) {
    const buttonId = event.target.id;
  
    switch (buttonId) {
      case 'sort':
        sort();
        break;
      case 'backarrow':
        cardPrev();
        break;
      case 'forwardarrow':
        cardNext();
        break;
      case 'logout':
        logout();
        break;
      default:
        break;
    }
  }
  
  document.addEventListener('click', function(event) {
    if (event.target.matches('button')) {
      handleButtonClick(event);
    }
  });


const spot = new SpotifyWebApi();
spot.setAccessToken(localStorage.getItem('accessToken'));

const topCard = document.getElementById('topcard');
const bottomCard = document.getElementById('bottomcard');

const distanceCache = new Map();
const bgr2labCache = new Map();
const ccvCache = new Map();
const minCache = new Map();

let data;
let playlistIDs = [];
var i = 0;
var playlists = initialize();

async function initialize() {
    data = await spot.getUserPlaylists();
    for (let i = 0; i < data.items.length; i++) {
        playlistIDs.push({
            title: data.items[i].name,
            id: data.items[i].id
        });
    }

    const playlistOne = data.items[0];
    const playlistTwo = data.items[1];

    topCard.getElementsByClassName('card-image')[0].src = playlistOne.images[0].url;
    bottomCard.getElementsByClassName('card-image')[0].src = playlistTwo.images[0].url;
    topCard.getElementsByClassName('card-title')[0].innerHTML = playlistOne.name;
    bottomCard.getElementsByClassName('card-title')[0].innerHTML = playlistTwo.name;
    topCard.getElementsByClassName('card-subtitle')[0].innerHTML = playlistOne.tracks.total + ' songs';
    bottomCard.getElementsByClassName('card-subtitle')[0].innerHTML = playlistTwo.tracks.total + ' songs';

    const [topTracks, bottomTracks] = await Promise.all([
        getPlaylistTracksWrapper(spot, playlistOne.id),
        getPlaylistTracksWrapper(spot, playlistTwo.id)
    ]);

    let topCardText = '';
    let bottomCardText = '';

    for (let i = 0; i < 5; i++) {
        topCardText += `${topTracks[i].track.name} - ${topTracks[i].track.artists[0].name} <br> `;
        bottomCardText += `${bottomTracks[i].track.name} - ${bottomTracks[i].track.artists[0].name} <br> `;
    }

    topCard.getElementsByClassName('card-text')[0].innerHTML = topCardText;
    bottomCard.getElementsByClassName('card-text')[0].innerHTML = bottomCardText;

    return data.items;
}

async function getPlaylistTracksWrapper(spot, playlistID) {
    const limit = 100;
    let tracks = [];
    const storedTracks = localStorage.getItem(`tracks_${playlistID}`);
    if (storedTracks) {
        tracks = JSON.parse(storedTracks);
    } else {
        let offset = 0;
        let total = 1;

        const firstResponse = await spot.getPlaylistTracks(playlistID);
        total = firstResponse.total;
        tracks = firstResponse.items;

        while (offset < total) {
            offset += limit;
            const response = await spot.getPlaylistTracks(playlistID, {
                offset,
                limit,
            });
            tracks = tracks.concat(response.items);
        }
        localStorage.setItem(`tracks_${playlistID}`, JSON.stringify(tracks));
    }
    return tracks;
}

async function removePlaylistItems(spot, playlistID, tracks) {
    const limit = 100;
    const total = tracks.length;
    for (let offset = 0; offset <= total; offset += limit) {
        await spot.removeTracksFromPlaylist(playlistID, tracks.slice(offset, offset + limit));
    }
}

async function addPlaylistItems(spot, playlistID, tracks) {
    const limit = 100;
    const total = tracks.length;
    for (let offset = 0; offset <= total; offset += limit) {
        await spot.addTracksToPlaylist(playlistID, tracks.slice(offset, offset + limit));
    }
}

async function loadCards(playlists, index) {
    const value = await Promise.resolve(playlists);
    const length = value.length;
    const offset = index % length >= 0 ? index % length : length + (index % length);
    const secondOffset = (index + 1) % length >= 0 ? (index + 1) % length : length + ((index + 1) % length);

    const [topCard, bottomCard] = document.querySelectorAll('.card');

    topCard.querySelector('.card-image').src = value[offset].images[0].url;
    bottomCard.querySelector('.card-image').src = value[secondOffset].images[0].url;
    topCard.querySelector('.card-title').innerHTML = value[offset].name;
    bottomCard.querySelector('.card-title').innerHTML = value[secondOffset].name;
    topCard.querySelector('.card-subtitle').innerHTML = value[offset].tracks.total + ' songs';
    bottomCard.querySelector('.card-subtitle').innerHTML = value[secondOffset].tracks.total + ' songs';

    let topCardText = '';
    let bottomCardText = '';

    topCard.querySelector('.card-text').innerHTML = topCardText;
    bottomCard.querySelector('.card-text').innerHTML = bottomCardText;

    const [topTracks, bottomTracks] = await Promise.all([
        getPlaylistTracksWrapper(spot, value[offset].id),
        getPlaylistTracksWrapper(spot, value[secondOffset].id)
    ]);

    const sliceTracks = (tracks) => tracks.length > 5 ? tracks.slice(0, 5) : tracks;

    const topTracksSlice = sliceTracks(topTracks);
    const bottomTracksSlice = sliceTracks(bottomTracks);

    for (let i = 0; i < topTracksSlice.length; i++) {
        topCardText += topTracksSlice[i].track.name + ' - ' + topTracksSlice[i].track.artists[0].name + ' <br> ';
    }

    for (let i = 0; i < bottomTracksSlice.length; i++) {
        bottomCardText += bottomTracksSlice[i].track.name + ' - ' + bottomTracksSlice[i].track.artists[0].name + ' <br> ';
    }

    topCard.querySelector('.card-text').innerHTML = topCardText;
    bottomCard.querySelector('.card-text').innerHTML = bottomCardText;
}

function cardNext() {
    i++;
    loadCards(playlists, i);
}

function cardPrev() {
    i--;
    loadCards(playlists, i);
}

function logout() {
    localStorage.removeItem('accessToken');
    window.location.href = 'index.html';
}

async function sort() {
    var topCard = document.getElementById('topcard');
    var topCardTitle = topCard.getElementsByClassName('card-title')[0].innerHTML;
    var playlistID = '';
    for (var i = 0; i < playlistIDs.length; i++) {
        var playlist = playlistIDs[i];
        if (playlist.title == topCardTitle) {
            playlistID = playlist.id;
            break;
        }
    }
    var tracks = await getPlaylistTracksWrapper(spot, playlistID);
    var idAndCCV = await Promise.all(tracks.map(async (track) => {
        var id = track.track.id;
        var url = track.track.album.images[0].url;
        var ccvVar = await ccv(url);
        return [id, ccvVar];
    }));
    sorted = await loop_sort(idAndCCV, ccv_distance);
    var sortedTracks = [];
    for (var i = 0; i < sorted.length; i++) {
        var element = sorted[i];
        var uri = 'spotify:track:' + element[0];
        sortedTracks.push(uri);
    }
    await removePlaylistItems(spot, playlistID, sortedTracks);
    await addPlaylistItems(spot, playlistID, sortedTracks);
    loadCards(playlists, 0);
}

async function bgr2lab(v) {
    const cacheKey = v.toString();
    if (bgr2labCache.has(cacheKey)) {
        return bgr2labCache.get(cacheKey);
    }

    v = v.reverse();
    const RGB = math.matrix();
    for (let i = 0; i < v.length; i++) {
        const element = v[i];
        if (element > 10) {
            RGB.subset(math.index(i), 100 * math.pow((element + 0.055) / 255.0, 2.4));
        } else {
            RGB.subset(math.index(i), 100 * element / 255.0 / 12.92);
        }
    }
    const XYZ = math.round(math.multiply(math.matrix([
        [0.4124, 0.3576, 0.1805],
        [0.2126, 0.7152, 0.0722],
        [0.0193, 0.1192, 0.9505]
    ]), RGB), 4);
    const fXYZ = math.matrix();
    for (let i = 0; i < XYZ.size()[0]; i++) {
        fXYZ.subset(math.index(i), XYZ.subset(math.index(i)) > 0.008856 ? math.pow(XYZ.subset(math.index(i)), 0.33333) : 7.787 * XYZ.subset(math.index(i)) + 16.0 / 116);
    }
    const result = math.round(math.add(math.multiply(math.matrix([
        [0, 116, 0],
        [500, -500, 0],
        [0, 200, -200]
    ]), fXYZ), math.matrix([-16, 0, 0])), 4);

    bgr2labCache.set(cacheKey, result);
    return result;
}

async function labDistance3D(v1, v2) {
    const [A, B] = await Promise.all([bgr2lab(v1), bgr2lab(v2)]);
    const deltaL = A.get([0]) - B.get([0]);
    const deltaA = A.get([1]) - B.get([1]);
    const deltaB = A.get([2]) - B.get([2]);
    return deltaL * deltaL + deltaA * deltaA + deltaB * deltaB;
}

async function findMinimum(p_entry, func, q_entries = null) {
    let entries;
    if (!q_entries) {
        entries = [
            ['dark skin', [115, 82, 68]],
            ['light skin', [194, 150, 130]],
            ['blue sky', [98, 122, 157]],
            ['foliage', [87, 108, 67]],
            ['blue flower', [133, 128, 177]],
            ['bluish green', [103, 189, 170]],
            ['orange', [214, 126, 44]],
            ['purplish blue', [80, 91, 166]],
            ['moderate red', [193, 90, 99]],
            ['purple', [94, 60, 108]],
            ['yellow green', [157, 188, 64]],
            ['orange yellow', [224, 163, 46]],
            ['blue', [56, 61, 150]],
            ['green', [70, 148, 73]],
            ['red', [175, 54, 60]],
            ['yellow', [231, 199, 31]],
            ['magenta', [187, 86, 149]],
            ['cyan', [8, 133, 161]],
            ['white 9.5', [243, 243, 242]],
            ['neutral 8', [200, 200, 200]],
            ['neutral 6.5', [160, 160, 160]],
            ['neutral 5', [122, 122, 121]],
            ['neutral 3.5', [85, 85, 85]],
            ['black 2', [52, 52, 52]],
        ];
    } else {
        entries = q_entries;
    }

    const cacheKey = JSON.stringify([p_entry, entries]);
    if (minCache.has(cacheKey)) {
        return minCache.get(cacheKey);
    }

    const p = q_entries ? p_entry[1] : p_entry;
    let val = -1;
    let minIndex = -1;

    const promises = entries.map(async ([name, q]) => {
        const f = await func(p, q);
        return [name, f];
    });

    const results = await Promise.all(promises);
    results.forEach(([name, f], i) => {
        if (val === -1 || f < val) {
            minIndex = i;
            val = f;
        }
    });

    minCache.set(cacheKey, minIndex);

    return minIndex;
}

async function rgb2mac(img) {
    var mac = [];
    for (var i = 0; i < img.length; i++) {
        var row = await Promise.all(img[i].map(async (pixel) => {
            var f = await findMinimum(pixel, labDistance3D);
            return f;
        }));
        mac.push(row);
    }
    return mac;
}

async function processImage(url) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const image = await loadImage(url);
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);
    const mat = cv.imread(canvas);
    const resizedMat = new cv.Mat();
    cv.resize(mat, resizedMat, new cv.Size(16, 16), 0, 0, cv.INTER_AREA);
    const bgrMat = new cv.Mat();
    cv.cvtColor(resizedMat, bgrMat, cv.COLOR_RGB2BGR);
    const data = new Uint8ClampedArray(bgrMat.data);
    const array = [];
    for (let i = 0; i < bgrMat.rows; i++) {
        const offset = i * bgrMat.cols * 3;
        const row = new Array(bgrMat.cols);
        for (let j = 0; j < bgrMat.cols; j++) {
            const index = offset + j * 3;
            row[j] = [data[index], data[index + 1], data[index + 2]];
        }
        array.push(row);
    }
    mat.delete();
    resizedMat.delete();
    bgrMat.delete();
    return array;
}

function loadImage(url) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.crossOrigin = 'anonymous';
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', reject);
        image.src = url;
    });
}

async function blob_extract(img) {
    const blob = Array.from(Array(16), () => Array(16).fill(0));
    let n_blobs = 0;
    const promises = [];
    for (let index = 0; index < 24; index++) {
        promises.push(findConnectedComponents(img, index));
    }
    const results = await Promise.all(promises);
    results.forEach(({
        count,
        labels
    }) => {
        for (let i = 0; i < blob.length; i++) {
            for (let j = 0; j < blob[i].length; j++) {
                blob[i][j] += labels[i][j];
            }
        }
        n_blobs += Math.max(0, count - 1);
    });
    return [n_blobs, blob];
}

async function findConnectedComponents(img, index) {
    const binaryImg = math.map(img, value => value === index ? 1 : 0);
    const uint8Img = math.multiply(binaryImg, 255);
    const mat = cv.matFromArray(uint8Img.length, uint8Img[0].length, cv.CV_8UC1, uint8Img.flat());
    const dst = new cv.Mat();
    const numComponents = await cv.connectedComponents(mat, dst);
    const labels = await Promise.all([...Array(dst.rows)].map(async (_, i) => {
        const row = await Promise.all([...Array(dst.cols)].map(async (_, j) => {
            return dst.ucharAt(i, j);
        }));
        return row;
    }));

    mat.delete();
    dst.delete();
    return {
        count: numComponents,
        labels: labels
    };
}

async function macToArray(mac) {
    return mac.map(row => row.slice());
}

async function ccv(url) {
    if (ccvCache.has(url)) {
        return ccvCache.get(url);
    }

    var img = await processImage(url);
    var threshold = Math.round(0.01 * img.length * img[0].length);
    var mac = await rgb2mac(img);
    var [n_blobs, blob] = await blob_extract(mac);
    var table = [];
    for (var i = 0; i < n_blobs; i++) {
        table.push([0, 0]);
    }
    for (var i = 0; i < blob.length; i++) {
        for (var j = 0; j < blob[i].length; j++) {
            if (blob[i][j] != 0) {
                table[blob[i][j] - 1][0] = mac[i][j];
                table[blob[i][j] - 1][1] += 1;
            }
        }
    }
    var CCV = [];
    for (var i = 0; i < 24; i++) {
        CCV.push([0, 0]);
    }
    for (var i = 0; i < table.length; i++) {
        var color_index = table[i][0];
        var size = table[i][1];
        if (size >= threshold) {
            CCV[color_index][0] += size;
        } else {
            CCV[color_index][1] += size;
        }
    }

    ccvCache.set(url, CCV);
    return CCV;
}

async function loop_sort(entries, func) {
    entries = entries.slice();
    var loop = [];
    var length = entries.length;
    for (var i = 0; i < length; i++) {
        if (i == 0) {
            loop.push(entries.shift());
        } else {
            var a1 = loop[i - 1];
            var b1 = entries.slice();
            loop.push(entries.splice(await findMinimum(a1, func, b1), 1)[0]);
        }
    }
    return loop;
}

async function ccv_distance(v1, v2) {
    const cacheKey = `${JSON.stringify(v1)}-${JSON.stringify(v2)}`;
    if (distanceCache.has(cacheKey)) {
        return distanceCache.get(cacheKey);
    }
    const distances = await Promise.all(
        v1.map(async (v, i) => {
            const d1 = Math.abs(v[0] - v2[i][0]);
            const d2 = Math.abs(v[1] - v2[i][1]);
            return 3 * d1 + d2;
        })
    );
    const distance = distances.reduce((acc, d) => acc + d, 0);
    distanceCache.set(cacheKey, distance);
    return distance;
}