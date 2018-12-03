var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];
			descriptor.enumerable = descriptor.enumerable || false;
			descriptor.configurable = true;
			if ("value" in descriptor) descriptor.writable = true;
			Object.defineProperty(target, descriptor.key, descriptor);
		}
	}
	return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);
		if (staticProps) defineProperties(Constructor, staticProps);
		return Constructor;
	};
}();

function _toArray(arr) {
	return Array.isArray(arr) ? arr : Array.from(arr);
}

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}
var distance = function distance(x0, y0, x1, y1) {
	return Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
};


var settings = {
	speed: .004,
	strokeLine: false,
	opacityLine: .1
};


var stats = new Stats();

var Noise = function () {
	function Noise() {
		_classCallCheck(this, Noise);
		this.p = new Array(512);
		this.permutation = this._shuffle(this._range(1, 500));

		for (var i = 256; i--;) {
			this.p[256 + i] = this.p[i] = this.permutation[i];
		}
	}
	_createClass(Noise, [{
		key: 'do',
		value: function _do(

			x) {
			var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
			var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
			this.X = Math.floor(x) & 255;
			this.Y = Math.floor(y) & 255;
			this.Z = Math.floor(z) & 255;

			x -= Math.floor(x);
			y -= Math.floor(y);
			z -= Math.floor(z);

			this.u = this._fade(x);
			this.v = this._fade(y);
			this.w = this._fade(z);

			this.A = this.p[this.X] + this.Y;
			this.AA = this.p[this.A] + this.Z;
			this.AB = this.p[this.A + 1] + this.Z;

			this.B = this.p[this.X + 1] + this.Y;
			this.BA = this.p[this.B] + this.Z;
			this.BB = this.p[this.B + 1] + this.Z;

			return this._scale(this._lerp(this.w, this._lerp(this.v, this._lerp(this.u, this._grad(this.p[this.AA], x, y, z),
						this._grad(this.p[this.BA], x - 1, y, z)),
					this._lerp(this.u, this._grad(this.p[this.AB], x, y - 1, z),
						this._grad(this.p[this.BB], x - 1, y - 1, z))),
				this._lerp(this.v, this._lerp(this.u, this._grad(this.p[this.AA + 1], x, y, z - 1),
						this._grad(this.p[this.BA + 1], x - 1, y, z - 1)),
					this._lerp(this.u, this._grad(this.p[this.AB + 1], x, y - 1, z - 1),
						this._grad(this.p[this.BB + 1], x - 1, y - 1, z - 1)))));
		}
	}, {
		key: '_scale',
		value: function _scale(

			n) {
			return ( 10 * n)/2 ;
		}
	}, {
		key: '_fade',
		value: function _fade(

			t) {
			return t *t*t*t * (t * (t * 6 - 15) + 10);
		}
	}, {
		key: '_lerp',
		value: function _lerp(

			t, a, b) {
			return a + t * (b - a);
		}
	}, {
		key: '_grad',
		value: function _grad(

			hash, x, y, z) {
			var h = hash & 15;
			var u = h < 8 ? x : y;
			var v = h < 4 ? y : h == 12 || h == 14 ? x : z;

			return ((h & 1) == 0 ? u : -u) + ((h & 2) == 0 ? v : -v);
		}
	}, {
		key: '_range',
		value: function _range(

			a, z) {
			var results = [];

			for (var i = a; i <= z; i++) {
				results.push(i);
			}

			return results;
		}
	}, {
		key: '_shuffle',
		value: function _shuffle(_ref)

		{
			var _ref2 = _toArray(_ref),
				arr = _ref2.slice(0);
			var m = arr.length;

			while (m) {
				var i = Math.floor(Math.random() * m--);
				var _ref3 =

					[arr[i], arr[m]];
				arr[m] = _ref3[0];
				arr[i] = _ref3[1];
			}

			return arr;
		}
	}]);
	return Noise;
}();
var


	Playground = function () {
		function Playground(config) {
			_classCallCheck(this, Playground);
			this.


			_randomInt = function (min, max) {
				return Math.floor(Math.random() * (max - min + 1)) + min;
			};
			this.config = config;
			this.canvas = this.config.canvas;
			this.ctx = this.canvas.getContext('2d');
			this.noise = this.config.noise;
			this.size = this.config.size;
			this.offset = this.config.offset*2;
			this.particles = this.createParticles();
			this.tick = 1;
			window.addEventListener('resize', this._setSize.bind(this), false);
		}
		_createClass(Playground, [{
			key: '_setSize',
			value: function _setSize() {
				this.canvas.width = window.innerWidth;
				this.canvas.height = window.innerHeight;
			}
		}, {
			key: 'createParticles',
			value: function createParticles() {
				var dots = [];
				for (var j = this.size; j--;) {
					for (var i = this.size; i--;) {
						dots.push({
							x: i * this.offset,
							y: j * this.offset,
							k: Math.random()
						});
					}
				}
				return dots;
			}
		}, {
			key: 'drawDot',
			value: function drawDot(

				x, y, r, c) {
				this.ctx.fillStyle = c;
				this.ctx.beginPath();
				this.ctx.arc(x, y, r, 0, Math.PI * 2, false);
				this.ctx.closePath();
				this.ctx.fill();
			}
		}, {
			key: 'drawLine',
			value: function drawLine(

				x1, y1, x2, y2) {
				var alpha = distance(x1, y1, x2, y2);

				if (settings.strokeLine) {
					this.ctx.strokeStyle = 'rgba(0,0,0, ' + settings.opacityLine + ')';
				} else {
					this.ctx.strokeStyle = 'rgba(0,0,0, ' + (1 - alpha / 35) + ')';
				}

				this.ctx.lineWidth = 1.2;
				this.ctx.beginPath();
				this.ctx.moveTo(x1, y1);
				this.ctx.lineTo(x2, y2);
				this.ctx.stroke();
			}
		}, {
			key: 'loop',
			value: function loop()

			{
				var _this = this;
				window.requestAnimationFrame(this.loop.bind(this));
				stats.begin();

				this.tick += settings.speed;

				this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

				var _x = this.canvas.width / 2 - (this.offset * this.size - this.offset) / 2 -50;
				var _y = this.canvas.height / 2 - (this.offset * this.size - this.offset) / 2 -50;

				for (var i = this.particles.length; i--;) {
					for (var j = this.particles.length; j--;) {
						this.drawLine(
							_x + this.particles[i].x + this.noise.do(this.tick + this.particles[i].k, this.particles[i].k * 10, 0) * 100,
							_y + this.particles[i].y + this.noise.do(this.particles[i].k * 10, this.tick + this.particles[i].k, 0) * 100,
							_x + this.particles[j].x + this.noise.do(this.tick + this.particles[j].k, this.particles[j].k * 10, 0) * 100,
							_y + this.particles[j].y + this.noise.do(this.particles[j].k * 10, this.tick + this.particles[j].k, 0) * 100);

					}
				}

				this.particles.forEach(function (item, i) {
					_this.drawDot(
						_x + item.x + _this.noise.do(_this.tick + item.k, item.k * 10, 0) * 100,
						_y + item.y + _this.noise.do(item.k * 10, _this.tick + item.k, 0) * 100,
						2,
						'black');

				});


			}
		}, {
			key: 'start',
			value: function start()

			{
				this._setSize();
				this.loop();
			}
		}]);
		return Playground;
	}();


var pg = new Playground({
	canvas: document.getElementById('playground'),
	noise: new Noise(),
	size: 10,
	offset: 30
});


pg.start();