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

(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var NodeSquare = require('./node-square'),
    NodeHexagonal = require('./node-hexagonal');

var defaultOptions = {
    fields: 3,
    randomizer: Math.random,
    distance: squareEuclidean,
    iterations: 10,
    learningRate: 0.1,
    gridType: 'rect',
    torus: true,
    method: 'random'
};
    class SOM {
        constructor(x, y, options, reload) {
            if (!(this instanceof SOM)) {
                return new SOM(x, y, options, reload);
            }
            this.x = x;
            this.y = y;
            options = options || {};
            this.options = {};
            for (var i in defaultOptions) {
                if (options.hasOwnProperty(i)) {
                    this.options[i] = options[i];
                } else {
                    this.options[i] = defaultOptions[i];
                }
            }
            if (typeof this.options.fields === 'number') {
                this.numWeights = this.options.fields;
            } else if (Array.isArray(this.options.fields)) {
                this.numWeights = this.options.fields.length;
                var converters = getConverters(this.options.fields);
                this.extractor = converters.extractor;
                this.creator = converters.creator;
            } else {
                throw new Error('Invalid fields definition');
            }

            if (this.options.gridType === 'rect') {
                this.nodeType = NodeSquare;
                this.gridDim = {
                    x: x,
                    y: y
                };
            } else {
                this.nodeType = NodeHexagonal;
                var hx = this.x - Math.floor(this.y / 2);
                this.gridDim = {
                    x: hx,
                    y: this.y,
                    z: -(0 - hx - this.y)
                };
            }
            this.torus = this.options.torus;
            this.distanceMethod = this.torus ? 'getDistanceTorus' : 'getDistance';
            this.distance = this.options.distance;
            this.maxDistance = getMaxDistance(this.distance, this.numWeights);
            if (reload === true) {
                this.done = true;
                return;
            }
            if (!(x > 0 && y > 0)) {
                throw new Error('x and y must be positive');
            }
            this.times = {
                findBMU: 0,
                adjust: 0
            };
            this.randomizer = this.options.randomizer;
            this.iterationCount = 0;
            this.iterations = this.options.iterations;
            this.startLearningRate = this.learningRate = this.options.learningRate;
            this.mapRadius = Math.floor(Math.max(x, y) / 2);
            this.algorithmMethod = this.options.method;
            this._initNodes();
            this.done = false;
        }
        static load(model, distance) {
            if (model.name === 'SOM') {
                var x = model.data.length, y = model.data[0].length;
                if (distance) {
                    model.options.distance = distance;
                } else if (model.options.distance) {
                    model.options.distance = eval('(' + model.options.distance + ')');
                }
                var som = new SOM(x, y, model.options, true);
                som.nodes = new Array(x);
                for (var i = 0; i < x; i++) {
                    som.nodes[i] = new Array(y);
                    for (var j = 0; j < y; j++) {
                        som.nodes[i][j] = new som.nodeType(i, j, model.data[i][j], som);
                    }
                }
                return som;
            } else {
                throw new Error('expecting a SOM model');
            }
        }
        export(includeDistance) {
            if (!this.done) {
                throw new Error('model is not ready yet');
            }
            var model = {
                name: 'SOM'
            };
            model.options = {
                fields: this.options.fields,
                gridType: this.options.gridType,
                torus: this.options.torus
            };
            model.data = new Array(this.x);
            for (var i = 0; i < this.x; i++) {
                model.data[i] = new Array(this.y);
                for (var j = 0; j < this.y; j++) {
                    model.data[i][j] = this.nodes[i][j].weights;
                }
            }
            if (includeDistance) {
                model.options.distance = this.distance.toString();
            }
            return model;
        }
        _initNodes() {
            var now = Date.now(), i, j, k;
            this.nodes = new Array(this.x);
            for (i = 0; i < this.x; i++) {
                this.nodes[i] = new Array(this.y);
                for (j = 0; j < this.y; j++) {
                    var weights = new Array(this.numWeights);
                    for (k = 0; k < this.numWeights; k++) {
                        weights[k] = this.randomizer();
                    }
                    this.nodes[i][j] = new this.nodeType(i, j, weights, this);
                }
            }
            this.times.initNodes = Date.now() - now;
        }
        setTraining(trainingSet) {
            if (this.trainingSet) {
                throw new Error('training set has already been set');
            }
            var now = Date.now();
            var convertedSet = trainingSet;
            var i, l = trainingSet.length;
            if (this.extractor) {
                convertedSet = new Array(l);
                for (i = 0; i < l; i++) {
                    convertedSet[i] = this.extractor(trainingSet[i]);
                }
            }
            this.numIterations = this.iterations * l;

            if (this.algorithmMethod === 'random') {
                this.timeConstant = this.numIterations / Math.log(this.mapRadius);
            } else {
                this.timeConstant = l / Math.log(this.mapRadius);
            }
            this.trainingSet = convertedSet;
            this.times.setTraining = Date.now() - now;
        }
        trainOne() {
            if (this.done) {
                return false;
            } else if (this.numIterations-- > 0) {
                var percentDone = Math.round(100 * (1 - this.numIterations / this.iterations / this.trainingSet.length));
                document.getElementById("progress-bar").style.width = percentDone + "%";
                var neighbourhoodRadius, trainingValue, trainingSetFactor;

                if (this.algorithmMethod === 'random') { // Pick a random value of the training set at each step
                    neighbourhoodRadius = this.mapRadius * Math.exp(-this.iterationCount / this.timeConstant);
                    trainingValue = getRandomValue(this.trainingSet, this.randomizer);
                    this._adjust(trainingValue, neighbourhoodRadius);
                    this.learningRate = this.startLearningRate * Math.exp(-this.iterationCount / this.numIterations);
                } else { // Get next input vector
                    trainingSetFactor = -Math.floor(this.iterationCount / this.trainingSet.length);
                    neighbourhoodRadius = this.mapRadius * Math.exp(trainingSetFactor / this.timeConstant);
                    trainingValue = this.trainingSet[this.iterationCount % this.trainingSet.length];
                    this._adjust(trainingValue, neighbourhoodRadius);
                    if (((this.iterationCount + 1) % this.trainingSet.length) === 0) {
                        this.learningRate = this.startLearningRate * Math.exp(trainingSetFactor / Math.floor(this.numIterations / this.trainingSet.length));
                    }
                }

                this.iterationCount++;

                return true;

            } else {

                this.done = true;
                return false;

            }
        }
        _adjust(trainingValue, neighbourhoodRadius) {
            var now = Date.now(), x, y, dist, influence;

            var bmu = this._findBestMatchingUnit(trainingValue);

            var now2 = Date.now();
            this.times.findBMU += now2 - now;

            var radiusLimit = Math.floor(neighbourhoodRadius);
            var xMin = bmu.x - radiusLimit, xMax = bmu.x + radiusLimit, yMin = bmu.y - radiusLimit, yMax = bmu.y + radiusLimit;

            for (x = xMin; x <= xMax; x++) {
                var theX = x;
                if (x < 0) {
                    theX += this.x;
                } else if (x >= this.x) {
                    theX -= this.x;
                }
                for (y = yMin; y <= yMax; y++) {
                    var theY = y;
                    if (y < 0) {
                        theY += this.y;
                    } else if (y >= this.y) {
                        theY -= this.y;
                    }

                    dist = bmu[this.distanceMethod](this.nodes[theX][theY]);

                    if (dist < neighbourhoodRadius) {
                        influence = Math.exp(-dist / (2 * neighbourhoodRadius));
                        this.nodes[theX][theY].adjustWeights(trainingValue, this.learningRate, influence);
                    }

                }
            }

            this.times.adjust += (Date.now() - now2);

        }
        train(trainingSet) {
            if (!this.done) {
                this.setTraining(trainingSet);
                while (this.trainOne()) {
                }
            }
        }
        getConvertedNodes() {
            var result = new Array(this.x);
            for (var i = 0; i < this.x; i++) {
                result[i] = new Array(this.y);
                for (var j = 0; j < this.y; j++) {
                    var node = this.nodes[i][j];
                    result[i][j] = this.creator ? this.creator(node.weights) : node.weights;
                }
            }
            return result;
        }
        _findBestMatchingUnit(candidate) {

            var bmu, lowest = Infinity, dist;

            for (var i = 0; i < this.x; i++) {
                for (var j = 0; j < this.y; j++) {
                    dist = this.distance(this.nodes[i][j].weights, candidate);
                    if (dist < lowest) {
                        lowest = dist;
                        bmu = this.nodes[i][j];
                    }
                }
            }

            return bmu;

        }
        predict(data, computePosition) {
            if (typeof data === 'boolean') {
                computePosition = data;
                data = null;
            }
            if (!data) {
                data = this.trainingSet;
            }
            if (Array.isArray(data) && (Array.isArray(data[0]) || (typeof data[0] === 'object'))) { // predict a dataset
                var self = this;
                return data.map(function (element) {
                    return self._predict(element, computePosition);
                });
            } else { // predict a single element
                return this._predict(data, computePosition);
            }
        }
        _predict(element, computePosition) {
            if (!Array.isArray(element)) {
                element = this.extractor(element);
            }
            var bmu = this._findBestMatchingUnit(element);
            var result = [bmu.x, bmu.y];
            if (computePosition) {
                result[2] = bmu.getPosition(element);
            }
            return result;
        }
        // As seen in http://www.scholarpedia.org/article/Kohonen_network
        getQuantizationError() {
            var fit = this.getFit(), l = fit.length, sum = 0;
            for (var i = 0; i < l; i++) {
                sum += fit[i];
            }
            return sum / l;
        }
        getFit(dataset) {
            if (!dataset) {
                dataset = this.trainingSet;
            }
            var l = dataset.length, bmu, result = new Array(l);
            for (var i = 0; i < l; i++) {
                bmu = this._findBestMatchingUnit(dataset[i]);
                result[i] = Math.sqrt(this.distance(dataset[i], bmu.weights));
            }
            return result;
        }
    }
    som = new SOM(x, y, options);










function getConverters(fields) {
    var l = fields.length,
        normalizers = new Array(l),
        denormalizers = new Array(l);
    for (var i = 0; i < l; i++) {
        normalizers[i] = getNormalizer(fields[i].range);
        denormalizers[i] = getDenormalizer(fields[i].range);
    }
    return {
        extractor: function extractor(value) {
            var result = new Array(l);
            for (var i = 0; i < l; i++) {
                result[i] = normalizers[i](value[fields[i].name]);
            }
            return result;
        },
        creator: function creator(value) {
            var result = {};
            for (var i = 0; i < l; i++) {
                result[fields[i].name] = denormalizers[i](value[i]);
            }
            return result;
        }
    };
}

function getNormalizer(minMax) {
    return function normalizer(value) {
        return (value - minMax[0]) / (minMax[1] - minMax[0]);
    };
}

function getDenormalizer(minMax) {
    return function denormalizer(value) {
        return (minMax[0] + value * (minMax[1] - minMax[0]));
    };
}

function squareEuclidean(a, b) {
    var d = 0;
    for (var i = 0, ii = a.length; i < ii; i++) {
        d += (a[i] - b[i]) * (a[i] - b[i]);
    }
    return d;
}

function getRandomValue(arr, randomizer) {
    return arr[Math.floor(randomizer() * arr.length)];
}

function getMaxDistance(distance, numWeights) {
    var zero = new Array(numWeights),
        one = new Array(numWeights);
    for (var i = 0; i < numWeights; i++) {
        zero[i] = 0;
        one[i] = 1;
    }
    return distance(zero, one);
}

module.exports = SOM;
},{"./node-hexagonal":2,"./node-square":3}],2:[function(require,module,exports){
var NodeSquare = require('./node-square');

    class NodeHexagonal {
        constructor(x, y, weights, som) {

            NodeSquare.call(this, x, y, weights, som);

            this.hX = x - Math.floor(y / 2);
            this.z = 0 - this.hX - y;

        }
        getDistance(otherNode) {
            return Math.max(Math.abs(this.hX - otherNode.hX), Math.abs(this.y - otherNode.y), Math.abs(this.z - otherNode.z));
        }
        getDistanceTorus(otherNode) {
            var distX = Math.abs(this.hX - otherNode.hX), distY = Math.abs(this.y - otherNode.y), distZ = Math.abs(this.z - otherNode.z);
            return Math.max(Math.min(distX, this.som.gridDim.x - distX), Math.min(distY, this.som.gridDim.y - distY), Math.min(distZ, this.som.gridDim.z - distZ));
        }
        getPosition() {
            throw new Error('Unimplemented : cannot get position of the points for hexagonal grid');
        }
    }

NodeHexagonal.prototype = new NodeSquare;
;




module.exports = NodeHexagonal;
},{"./node-square":3}],3:[function(require,module,exports){
    class NodeSquare {
        constructor(x, y, weights, som) {
            this.x = x;
            this.y = y;
            this.weights = weights;
            this.som = som;
            this.neighbors = {};
        }
        adjustWeights(target, learningRate, influence) {
            for (var i = 0, ii = this.weights.length; i < ii; i++) {
                this.weights[i] += learningRate * influence * (target[i] - this.weights[i]);
            }
        }
        getDistance(otherNode) {
            return Math.max(Math.abs(this.x - otherNode.x), Math.abs(this.y - otherNode.y));
        }
        getDistanceTorus(otherNode) {
            var distX = Math.abs(this.x - otherNode.x), distY = Math.abs(this.y - otherNode.y);
            return Math.max(Math.min(distX, this.som.gridDim.x - distX), Math.min(distY, this.som.gridDim.y - distY));
        }
        getNeighbors(xy) {
            if (!this.neighbors[xy]) {
                this.neighbors[xy] = new Array(2);

                // left or bottom neighbor
                var v;
                if (this[xy] > 0) {
                    v = this[xy] - 1;
                } else if (this.som.torus) {
                    v = this.som.gridDim[xy] - 1;
                }
                if (typeof v !== 'undefined') {
                    var x, y;
                    if (xy === 'x') {
                        x = v;
                        y = this.y;
                    } else {
                        x = this.x;
                        y = v;
                    }
                    this.neighbors[xy][0] = this.som.nodes[x][y];
                }

                // top or right neighbor
                var w;
                if (this[xy] < (this.som.gridDim[xy] - 1)) {
                    w = this[xy] + 1;
                } else if (this.som.torus) {
                    w = 0;
                }
                if (typeof w !== 'undefined') {
                    if (xy === 'x') {
                        x = w;
                        y = this.y;
                    } else {
                        x = this.x;
                        y = w;
                    }
                    this.neighbors[xy][1] = this.som.nodes[x][y];
                }
            }
            return this.neighbors[xy];
        }
        getPos(xy, element) {
            var neighbors = this.getNeighbors(xy), distance = this.som.distance, bestNeighbor, direction;
            if (neighbors[0]) {
                if (neighbors[1]) {
                    var dist1 = distance(element, neighbors[0].weights), dist2 = distance(element, neighbors[1].weights);
                    if (dist1 < dist2) {
                        bestNeighbor = neighbors[0];
                        direction = -1;
                    } else {
                        bestNeighbor = neighbors[1];
                        direction = 1;
                    }
                } else {
                    bestNeighbor = neighbors[0];
                    direction = -1;
                }
            } else {
                bestNeighbor = neighbors[1];
                direction = 1;
            }
            var simA = 1 - distance(element, this.weights), simB = 1 - distance(element, bestNeighbor.weights);
            var factor = ((simA - simB) / (2 - simA - simB));
            return 0.5 + 0.5 * factor * direction;
        }
        getPosition(element) {
            return [
                this.getPos('x', element),
                this.getPos('y', element)
            ];
        }
    }







module.exports = NodeSquare;
},{}]},{},[1]);

function createSOMPublic(x, y, options) {
    return som;
}