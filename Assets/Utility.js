"use strict";
exports.__esModule = true;
exports.Utility = void 0;
var Vec3 = /** @class */ (function () {
    function Vec3(x, y, z) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (z === void 0) { z = 0; }
        this.x = x;
        this.y = y;
        this.z = z;
    }
    Vec3.prototype.clone = function () {
        return new Vec3(this.x, this.y, this.z);
    };
    Vec3.prototype.multiplyScalar = function (value) {
        this.x *= value;
        this.y *= value;
        this.z *= value;
        return this;
    };
    Vec3.prototype.add = function (other) {
        this.x += other.x;
        this.y += other.y;
        this.z += other.z;
        return this;
    };
    return Vec3;
}());
var Utility = /** @class */ (function () {
    function Utility() {
    }
    /**
     * @param points 控制点，点的个数代表贝塞尔曲线的阶数
     * @param t 0到1的时间值
     */
    // https://en.wikipedia.org/wiki/B%C3%A9zier_curve
    // https://www.jasondavies.com/animated-bezier/
    Utility.getBezierLerpPoint = function (points, t) {
        var array = points;
        points = [];
        for (var i = 0; i < array.Length; i++) {
            points.push(new Vec3(array[i].x, array[i].y, array[i].z));
        }
        var n = points.length;
        var factors = [1];
        for (var i = 2; i < n + 1; i++) {
            var last = factors.slice(0);
            factors[0] = 1;
            factors[i - 1] = 1;
            for (var i_1 = 0; i_1 < last.length - 1; i_1++) {
                factors[i_1 + 1] = last[i_1] + last[i_1 + 1];
            }
        }
        var p = new Vec3();
        for (var i = 0; i < n; i++) {
            var value = factors[i] * Math.pow(1 - t, n - 1 - i) * Math.pow(t, i);
            p.add(points[i].clone().multiplyScalar(value));
        }
        return p;
    };
    /**
     * @param points 控制点，点的个数代表贝塞尔曲线的阶数
     * @param amount 曲线的点数量，数值越大，得到的曲线越平滑
     */
    Utility.getBezierPoints = function (points, amount) {
        var curve = [];
        for (var i = 0; i < amount; i++) {
            curve.push(Utility.getBezierLerpPoint(points, i / (amount - 1)));
        }
        return curve;
    };
    return Utility;
}());
exports.Utility = Utility;
