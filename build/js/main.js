/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _Settings = __webpack_require__(2);

	var _shuffle = __webpack_require__(3);

	var _shuffle2 = _interopRequireDefault(_shuffle);

	var _Grid = __webpack_require__(4);

	var _Display3DVR = __webpack_require__(5);

	var _Display3DVR2 = _interopRequireDefault(_Display3DVR);

	var _Walker = __webpack_require__(9);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var ready = __webpack_require__(11);

	// GRID

	// DISPLAY

	// WALKER

	// INIT

	var walkers = void 0;

	var init = function init(e) {
		console.log('main.init');

		_Grid.Grid.init(_Settings.Settings.MAZE_SIZE, _Settings.Settings.MAZE_SIZE, _Settings.Settings.MAZE_SIZE);
		_Grid.Grid.setDisplay(_Display3DVR2.default);

		_Display3DVR2.default.init();

		walkers = [new _Walker.Walker(Math.floor(.5 * _Grid.Grid.WIDTH), Math.floor(.5 * _Grid.Grid.HEIGHT), Math.floor(.5 * _Grid.Grid.DEPTH), Math.floor(360 * Math.random()))];
	};

	var process = function process(e) {
		if (walkers.length > 0) {
			(function () {
				var new_walkers = [];

				walkers.forEach(function (w) {
					new_walkers = new_walkers.concat(w.process());
				});

				walkers = (0, _shuffle2.default)(new_walkers).slice(0, 2);
			})();
		}

		_Display3DVR2.default.render();
		window.requestAnimationFrame(process);
	};

	ready(function (_) {
		init();
		process();

		document.querySelector('.reset').addEventListener('click', function (_) {
			init();
		});
	});

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var Settings = exports.Settings = {
		ZOOM: 30,
		MAZE_SIZE: 20,
		WALKER_SPLIT: 2
	};

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	exports.default = function (a) {
		for (var j, x, i = a.length; i; j = parseInt(Math.random() * i), x = a[--i], a[i] = a[j], a[j] = x) {}
		return a;
	};

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var voxels = void 0;

	var Grid = exports.Grid = {
		WIDTH: 0,
		HEIGHT: 0,
		DEPTH: 0,

		init: function init(width, height, depth) {
			var _ref = [width, height, depth];
			this.WIDTH = _ref[0];
			this.HEIGHT = _ref[1];
			this.DEPTH = _ref[2];


			voxels = new Uint8Array(new ArrayBuffer(width * height * depth));
		},
		setDisplay: function setDisplay(display) {
			this.display = display;
		},
		setVoxel: function setVoxel(x, y, z, color) {
			voxels[z * this.HEIGHT * this.WIDTH + y * this.WIDTH + x] = color >> 1;

			this.display.addVoxel(x, y, z, color);
		},
		getVoxel: function getVoxel(x, y, z) {
			return voxels[z * this.HEIGHT * this.WIDTH + y * this.WIDTH + x] << 1;
		}
	};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _Settings = __webpack_require__(2);

	var _Grid = __webpack_require__(4);

	var _fullscreen = __webpack_require__(6);

	var _fullscreen2 = _interopRequireDefault(_fullscreen);

	var _hsl = __webpack_require__(7);

	var _hsl2 = _interopRequireDefault(_hsl);

	var _viewport = __webpack_require__(8);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var scene = void 0;
	var mesh = void 0;
	var camera = void 0;
	var controls = void 0;
	var effect = void 0;

	var renderer = new THREE.WebGLRenderer({
		antialias: true
	});

	// UI

	var vrUI = document.createElement('div');
	vrUI.className = "ui";
	vrUI.innerHTML = " \n    <button class=\"fullscreen\">Fullscreen</button>\n    <button class=\"vr\">VR (WebVR/Mobile only)</button>\n    <button class=\"reset\">Reset</button>\n";

	// Resize

	var resize = function resize() {
		var s = (0, _viewport.size)();

		if (!!renderer) {
			renderer.setSize(s.width, s.height);
		}

		if (!!camera) {
			camera.aspect = s.width / s.height;
			camera.updateProjectionMatrix();
		}
	};

	window.addEventListener('resize', resize, false);

	var Display = {
		init: function init() {
			window.WebVRConfig = {
				BUFFER_SCALE: 1.0
			};
			document.addEventListener('touchmove', function (e) {
				e.preventDefault();
			});

			document.body.appendChild(renderer.domElement);
			document.body.appendChild(vrUI);

			vrUI.querySelector('.fullscreen').addEventListener('click', function () {
				(0, _fullscreen2.default)(renderer.domElement);
			});

			vrUI.querySelector('.vr').addEventListener('click', function () {
				vrDisplay.requestPresent([{ source: renderer.domElement }]);
			});

			// Scene

			scene = new THREE.Scene();

			// Mesh

			mesh = new THREE.Object3D();
			scene.add(mesh);

			// Camera

			var s = (0, _viewport.size)();

			var aspectRatio = s.width / s.height;
			var fieldOfView = 60;
			var nearPlane = 1;
			var farPlane = 10000;
			camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);

			mesh.position.z = -2 * _Settings.Settings.MAZE_SIZE;

			// Controls

			controls = new THREE.VRControls(camera);

			effect = new THREE.VREffect(renderer);
			effect.setSize(s.width, s.height);

			var vrDisplay = null;
			navigator.getVRDisplays().then(function (displays) {
				if (displays.length > 0) {
					vrDisplay = displays[0];
				}
			});

			// Lights

			var lights = [];
			lights[0] = new THREE.PointLight(0xffffff, 1, 0);
			lights[1] = new THREE.PointLight(0xffffff, 1, 0);
			lights[2] = new THREE.PointLight(0xffffff, 1, 0);

			var d = 2 * _Settings.Settings.MAZE_SIZE;
			lights[0].position.set(0, 2 * d, 0);
			lights[1].position.set(d, 2 * d, 2 * d);
			lights[2].position.set(-d, -2 * d, -d);

			scene.add(lights[0]);
			scene.add(lights[1]);
			scene.add(lights[2]);

			// Resize

			resize();
		},

		addVoxel: function addVoxel(x, y, z, color) {
			var rgb = (0, _hsl2.default)(2 * color % 360 / 360, .8, .5);

			var geometry = new THREE.BoxGeometry(1, 1, 1);
			var material = new THREE.MeshPhongMaterial({ color: (rgb[0] << 16) + (rgb[1] << 8) + rgb[2], shading: THREE.FlatShading });
			var cube = new THREE.Mesh(geometry, material);
			cube.position.x = x - (_Grid.Grid.WIDTH >> 1);
			cube.position.y = y - (_Grid.Grid.HEIGHT >> 1);
			cube.position.z = z - (_Grid.Grid.DEPTH >> 1);
			cube.castShadow = true;
			cube.receiveShadow = true;
			mesh.add(cube);
		},

		render: function render() {
			controls.update();

			mesh.rotation.x += 0.002;
			mesh.rotation.y += 0.005;

			effect.render(scene, camera);
		}
	};

	exports.default = Display;

/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	exports.default = function (element) {
		if (element.requestFullscreen) {
			element.requestFullscreen();
		} else if (element.mozRequestFullScreen) {
			element.mozRequestFullScreen();
		} else if (element.webkitRequestFullscreen) {
			element.webkitRequestFullscreen();
		} else if (element.msRequestFullscreen) {
			element.msRequestFullscreen();
		}
	};

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	function hue2rgb(p, q, t) {
		if (t < 0) {
			t += 1;
		}
		if (t > 1) {
			t -= 1;
		}
		if (t < 1 / 6) {
			return p + (q - p) * 6 * t;
		}
		if (t < 1 / 2) {
			return q;
		}
		if (t < 2 / 3) {
			return p + (q - p) * (2 / 3 - t) * 6;
		}
		return p;
	}

	/**
	 * Converts an HSL color value to RGB. Conversion formula
	 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
	 * Assumes h, s, and l are contained in the set [0, 1] and
	 * returns r, g, and b in the set [0, 255].
	 *
	 * @param   Number  h       The hue
	 * @param   Number  s       The saturation
	 * @param   Number  l       The lightness
	 * @return  Array           The RGB representation
	 */
	function hslToRgb(h, s, l) {
		var r, g, b;

		if (s == 0) {
			r = g = b = l; // achromatic
		} else {

			var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
			var p = 2 * l - q;

			r = hue2rgb(p, q, h + 1 / 3);
			g = hue2rgb(p, q, h);
			b = hue2rgb(p, q, h - 1 / 3);
		}

		return [r * 255, g * 255, b * 255];
	}

	exports.default = hslToRgb;

/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var size = exports.size = function size() {
		return {
			width: window.innerWidth || document.documentElement.clientWidth,
			height: window.innerHeight || document.documentElement.clientHeight
		};
	};

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.Walker = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Settings = __webpack_require__(2);

	var _r = __webpack_require__(10);

	var _r2 = _interopRequireDefault(_r);

	var _shuffle = __webpack_require__(3);

	var _shuffle2 = _interopRequireDefault(_shuffle);

	var _Grid = __webpack_require__(4);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Walker = exports.Walker = function () {
		function Walker(x, y, z, color) {
			_classCallCheck(this, Walker);

			this.x = Math.round(x);
			this.y = Math.round(y);
			this.z = Math.round(z);

			this.color = Math.round(color + 3 * (0, _r2.default)()) % 360;

			_Grid.Grid.setVoxel(this.x, this.y, this.z, this.color);
		}

		_createClass(Walker, [{
			key: "process",
			value: function process() {
				var _this = this;

				var candidates = [];

				var positions = (0, _shuffle2.default)([[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]]);

				positions.forEach(function (p) {
					if (!p) {
						return;
					}

					if (candidates.length >= _Settings.Settings.WALKER_SPLIT) {
						return;
					}

					var dx = p[0];
					var dy = p[1];
					var dz = p[2];

					if (_this.x + 3 * dx >= 0 && _this.x + 3 * dx < _Grid.Grid.WIDTH && _this.y + 3 * dy >= 0 && _this.y + 3 * dy < _Grid.Grid.HEIGHT && _this.z + 3 * dz >= 0 && _this.z + 3 * dz < _Grid.Grid.DEPTH && !_Grid.Grid.getVoxel(_this.x + dx, _this.y + dy, _this.z + dz)) {

						if (dx != 0 && !_Grid.Grid.getVoxel(_this.x + dx, _this.y - 1, _this.z - 1) && !_Grid.Grid.getVoxel(_this.x + dx, _this.y - 1, _this.z + 0) && !_Grid.Grid.getVoxel(_this.x + dx, _this.y - 1, _this.z + 1) && !_Grid.Grid.getVoxel(_this.x + dx, _this.y + 0, _this.z - 1) && !_Grid.Grid.getVoxel(_this.x + dx, _this.y + 0, _this.z + 1) && !_Grid.Grid.getVoxel(_this.x + dx, _this.y + 1, _this.z - 1) && !_Grid.Grid.getVoxel(_this.x + dx, _this.y + 1, _this.z + 0) && !_Grid.Grid.getVoxel(_this.x + dx, _this.y + 1, _this.z + 1) && !_Grid.Grid.getVoxel(_this.x + 2 * dx, _this.y - 1, _this.z - 1) && !_Grid.Grid.getVoxel(_this.x + 2 * dx, _this.y - 1, _this.z + 0) && !_Grid.Grid.getVoxel(_this.x + 2 * dx, _this.y - 1, _this.z + 1) && !_Grid.Grid.getVoxel(_this.x + 2 * dx, _this.y + 0, _this.z - 1) && !_Grid.Grid.getVoxel(_this.x + 2 * dx, _this.y + 0, _this.z + 1) && !_Grid.Grid.getVoxel(_this.x + 2 * dx, _this.y + 1, _this.z - 1) && !_Grid.Grid.getVoxel(_this.x + 2 * dx, _this.y + 1, _this.z + 0) && !_Grid.Grid.getVoxel(_this.x + 2 * dx, _this.y + 1, _this.z + 1) && !_Grid.Grid.getVoxel(_this.x + 3 * dx, _this.y, _this.z)) {
							_Grid.Grid.setVoxel(_this.x + dx, _this.y, _this.z, _this.color);
							_Grid.Grid.setVoxel(_this.x + 2 * dx, _this.y, _this.z, _this.color);
							candidates.push(new Walker(_this.x + 3 * dx, _this.y, _this.z, _this.color));
						}
						if (dy != 0 && !_Grid.Grid.getVoxel(_this.x - 1, _this.y + dy, _this.z - 1) && !_Grid.Grid.getVoxel(_this.x - 1, _this.y + dy, _this.z + 0) && !_Grid.Grid.getVoxel(_this.x - 1, _this.y + dy, _this.z + 1) && !_Grid.Grid.getVoxel(_this.x + 0, _this.y + dy, _this.z - 1) && !_Grid.Grid.getVoxel(_this.x + 0, _this.y + dy, _this.z + 1) && !_Grid.Grid.getVoxel(_this.x + 1, _this.y + dy, _this.z - 1) && !_Grid.Grid.getVoxel(_this.x + 1, _this.y + dy, _this.z + 0) && !_Grid.Grid.getVoxel(_this.x + 1, _this.y + dy, _this.z + 1) && !_Grid.Grid.getVoxel(_this.x - 1, _this.y + 2 * dy, _this.z - 1) && !_Grid.Grid.getVoxel(_this.x - 1, _this.y + 2 * dy, _this.z + 0) && !_Grid.Grid.getVoxel(_this.x - 1, _this.y + 2 * dy, _this.z + 1) && !_Grid.Grid.getVoxel(_this.x + 0, _this.y + 2 * dy, _this.z - 1) && !_Grid.Grid.getVoxel(_this.x + 0, _this.y + 2 * dy, _this.z + 1) && !_Grid.Grid.getVoxel(_this.x + 1, _this.y + 2 * dy, _this.z - 1) && !_Grid.Grid.getVoxel(_this.x + 1, _this.y + 2 * dy, _this.z + 0) && !_Grid.Grid.getVoxel(_this.x + 1, _this.y + 2 * dy, _this.z + 1) && !_Grid.Grid.getVoxel(_this.x, _this.y + 3 * dy, _this.z)) {

							_Grid.Grid.setVoxel(_this.x, _this.y + dy, _this.z, _this.color);
							_Grid.Grid.setVoxel(_this.x, _this.y + 2 * dy, _this.z, _this.color);
							candidates.push(new Walker(_this.x, _this.y + 3 * dy, _this.z, _this.color));
						}
						if (dz != 0 && !_Grid.Grid.getVoxel(_this.x - 1, _this.y - 1, _this.z + dz) && !_Grid.Grid.getVoxel(_this.x - 1, _this.y + 0, _this.z + dz) && !_Grid.Grid.getVoxel(_this.x - 1, _this.y + 1, _this.z + dz) && !_Grid.Grid.getVoxel(_this.x + 0, _this.y - 1, _this.z + dz) && !_Grid.Grid.getVoxel(_this.x + 0, _this.y + 1, _this.z + dz) && !_Grid.Grid.getVoxel(_this.x + 1, _this.y - 1, _this.z + dz) && !_Grid.Grid.getVoxel(_this.x + 1, _this.y + 0, _this.z + dz) && !_Grid.Grid.getVoxel(_this.x + 1, _this.y + 1, _this.z + dz) && !_Grid.Grid.getVoxel(_this.x - 1, _this.y - 1, _this.z + 2 * dz) && !_Grid.Grid.getVoxel(_this.x - 1, _this.y + 0, _this.z + 2 * dz) && !_Grid.Grid.getVoxel(_this.x - 1, _this.y + 1, _this.z + 2 * dz) && !_Grid.Grid.getVoxel(_this.x + 0, _this.y - 1, _this.z + 2 * dz) && !_Grid.Grid.getVoxel(_this.x + 0, _this.y + 1, _this.z + 2 * dz) && !_Grid.Grid.getVoxel(_this.x + 1, _this.y - 1, _this.z + 2 * dz) && !_Grid.Grid.getVoxel(_this.x + 1, _this.y + 0, _this.z + 2 * dz) && !_Grid.Grid.getVoxel(_this.x + 1, _this.y + 1, _this.z + 2 * dz) && !_Grid.Grid.getVoxel(_this.x, _this.y, _this.z + 3 * dz)) {
							_Grid.Grid.setVoxel(_this.x, _this.y, _this.z + dz, _this.color);
							_Grid.Grid.setVoxel(_this.x, _this.y, _this.z + 2 * dz, _this.color);
							candidates.push(new Walker(_this.x, _this.y, _this.z + 3 * dz, _this.color));
						}
					}
				});

				return candidates;
			}
		}]);

		return Walker;
	}();

/***/ },
/* 10 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function (_) {
	  return 2 * Math.floor(2 * Math.random()) - 1;
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	(function (root, factory) {
		if ( true ) {
			module.exports = factory();
		} else {
			root.domready = factory();
		}
	}(this, function () {
		'use strict';

		var ready = false,
			stack = [];

		function completed() {
			if ( document.addEventListener || event.type === "load" || document.readyState === "complete" ) {
				if ( document.addEventListener ) {
					document.removeEventListener('DOMContentLoaded', completed, false);
					window.removeEventListener('load', completed, false);
				} else {
					document.detachEvent("onreadystatechange", completed);
					window.detachEvent("onload", completed);
				}

				var f;
				while ( f = stack.shift() ) {
					setTimeout(f, 0);
				}

				ready = true;
			}
		}

		function domready(f) {
			if ( typeof f != 'function' ) {
				return;
			}

			if ( ready || (document.readyState === 'complete' ) ) {
				setTimeout(f, 0);
				return;
			}

			if ( stack.length <= 0 ) {
				if ( document.addEventListener ) {
					document.addEventListener('DOMContentLoaded', completed, false);
					window.addEventListener('load', completed, false);
				}
				else {
					document.attachEvent("onreadystatechange", completed);
					window.attachEvent("onload", completed);
				}
			}

			stack.push(f);
		}

		return domready;
	}));


/***/ }
/******/ ]);