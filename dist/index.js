"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var mysqlp = require('promise-mysql');
var mapnik = require("mapnik");
var MapService = (function () {
    function MapService() {
    }
    MapService.prototype.initMysql = function (mysqlOption) {
        this.mysqlPool = mysqlp.createPool(mysqlOption);
        return this;
    };
    MapService.prototype.initMap = function (serviceOption) {
        this.table = serviceOption.table;
        this.layer = serviceOption.layer;
        this.geom = serviceOption.geom;
        this.fields = serviceOption.fields;
        this.srid = serviceOption.srid;
    };
    MapService.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var self, _a, r;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        self = this;
                        _a = this;
                        return [4 /*yield*/, this.getMysqlConnection()];
                    case 1:
                        _a.conn = _b.sent();
                        return [4 /*yield*/, this.query("SELECT srtext FROM spatial_ref_sys WHERE srid = " + this.srid)];
                    case 2:
                        r = _b.sent();
                        console.log(r);
                        return [2 /*return*/];
                }
            });
        });
    };
    MapService.prototype.getTile = function (z, x, y) {
        return __awaiter(this, void 0, void 0, function () {
            var vt, extent;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vt = new mapnik.VectorTile(z, x, y);
                        extent = vt.extent();
                        return [4 /*yield*/, new Buffer('')];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MapService.prototype.getMysqlConnection = function () {
        return __awaiter(this, void 0, void 0, function () {
            var self;
            return __generator(this, function (_a) {
                self = this;
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        self.mysqlPool.getConnection(function (err, connection) {
                            if (err) {
                                reject(err);
                            }
                            else {
                                resolve(connection);
                            }
                        });
                    })];
            });
        });
    };
    MapService.prototype.query = function (sql) {
        return __awaiter(this, void 0, void 0, function () {
            var self;
            return __generator(this, function (_a) {
                self = this;
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        self.conn.query("SELECT srtext FROM spatial_ref_sys WHERE srid = " + self.srid, function (error, results, fields) {
                            if (error) {
                                reject(error);
                            }
                            else {
                                resolve(results);
                            }
                        });
                    })];
            });
        });
    };
    return MapService;
}());
exports.MapService = MapService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,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LENBQUM7d0JBQ0gsQ0FBQyxDQUFDLENBQUE7b0JBQ0osQ0FBQyxDQUFDLEVBQUE7OztLQUNIO0lBQ0gsaUJBQUM7QUFBRCxDQTFEQSxBQTBEQyxJQUFBO0FBRW9DLGdDQUFVIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgbXlzcWxwID0gcmVxdWlyZSgncHJvbWlzZS1teXNxbCcpXHJcbmltcG9ydCAqIGFzIG15c3FsIGZyb20gJ215c3FsJ1xyXG5pbXBvcnQgKiBhcyBtYXBuaWsgZnJvbSAnbWFwbmlrJ1xyXG5pbXBvcnQgKiBhcyBwcm9qNCBmcm9tICdwcm9qNCdcclxuXHJcbmludGVyZmFjZSBNeXNxbE9wdGlvbnMge1xyXG4gIGhvc3Q6IHN0cmluZyxcclxuICB1c2VyOiBzdHJpbmcsXHJcbiAgcGFzc3dvcmQ6IHN0cmluZyxcclxuICBkYXRhYmFzZTogc3RyaW5nXHJcbn1cclxuaW50ZXJmYWNlIE1hcE9wdGlvbnMge1xyXG4gIHRhYmxlOiBzdHJpbmcsXHJcbiAgbGF5ZXI6IHN0cmluZyxcclxuICBnZW9tOiBzdHJpbmcsXHJcbiAgZmllbGRzOiBzdHJpbmdbXSxcclxuICBzcmlkOiBudW1iZXJcclxufVxyXG5cclxuY2xhc3MgTWFwU2VydmljZSB7XHJcbiAgcHVibGljIG15c3FsUG9vbDogbXlzcWwuSVBvb2xcclxuICBwcml2YXRlIGNvbm46IGFueVxyXG4gIHByaXZhdGUgdGFibGU6IHN0cmluZ1xyXG4gIHByaXZhdGUgbGF5ZXI6IHN0cmluZ1xyXG4gIHByaXZhdGUgZ2VvbTogc3RyaW5nXHJcbiAgcHJpdmF0ZSBmaWVsZHM6IHN0cmluZ1tdXHJcbiAgcHJpdmF0ZSBzcmlkOiBudW1iZXJcclxuICBwdWJsaWMgaW5pdE15c3FsIChteXNxbE9wdGlvbjogTXlzcWxPcHRpb25zKTogTWFwU2VydmljZSB7XHJcbiAgICB0aGlzLm15c3FsUG9vbCA9IG15c3FscC5jcmVhdGVQb29sKG15c3FsT3B0aW9uKVxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgcHVibGljIGluaXRNYXAgKHNlcnZpY2VPcHRpb246IE1hcE9wdGlvbnMpOiB2b2lkIHtcclxuICAgIHRoaXMudGFibGUgPSBzZXJ2aWNlT3B0aW9uLnRhYmxlXHJcbiAgICB0aGlzLmxheWVyID0gc2VydmljZU9wdGlvbi5sYXllclxyXG4gICAgdGhpcy5nZW9tID0gc2VydmljZU9wdGlvbi5nZW9tXHJcbiAgICB0aGlzLmZpZWxkcyA9IHNlcnZpY2VPcHRpb24uZmllbGRzXHJcbiAgICB0aGlzLnNyaWQgPSBzZXJ2aWNlT3B0aW9uLnNyaWRcclxuXHJcbiAgfVxyXG4gIHB1YmxpYyBhc3luYyBzdGFydCAoKSB7XHJcbiAgICBsZXQgc2VsZiA9IHRoaXNcclxuICAgIHRoaXMuY29ubiA9IGF3YWl0IHRoaXMuZ2V0TXlzcWxDb25uZWN0aW9uKClcclxuICAgIGxldCByOiBhbnkgPSBhd2FpdCB0aGlzLnF1ZXJ5KGBTRUxFQ1Qgc3J0ZXh0IEZST00gc3BhdGlhbF9yZWZfc3lzIFdIRVJFIHNyaWQgPSAkeyB0aGlzLnNyaWQgfWApXHJcbiAgICBjb25zb2xlLmxvZyhyKVxyXG5cclxuICB9XHJcbiAgcHVibGljIGFzeW5jIGdldFRpbGUgKHo6IG51bWJlciwgeDogbnVtYmVyICwgeTogbnVtYmVyICk6IFByb21pc2U8QnVmZmVyPiB7XHJcbiAgICAvLyAg5Z2Q5qCH6L2s5o2iXHJcbiAgICBsZXQgdnQ6IGFueSA9IG5ldyBtYXBuaWsuVmVjdG9yVGlsZSh6LCB4LCB5KVxyXG4gICAgbGV0IGV4dGVudDogbnVtYmVyW10gPSB2dC5leHRlbnQoKVxyXG5cclxuICAgIHJldHVybiBhd2FpdCBuZXcgQnVmZmVyKCcnKVxyXG4gIH1cclxuICBwcml2YXRlIGFzeW5jIGdldE15c3FsQ29ubmVjdGlvbiAoKSB7XHJcbiAgICBsZXQgc2VsZiA9IHRoaXNcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgIHNlbGYubXlzcWxQb29sLmdldENvbm5lY3Rpb24oZnVuY3Rpb24gKGVycjogYW55LCBjb25uZWN0aW9uOiBteXNxbC5JQ29ubmVjdGlvbikge1xyXG4gICAgICAgIGlmICggZXJyICkge1xyXG4gICAgICAgICAgcmVqZWN0KGVycilcclxuICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICByZXNvbHZlKGNvbm5lY3Rpb24pXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgfSlcclxuICB9XHJcbiAgcHJpdmF0ZSBhc3luYyBxdWVyeSAoc3FsOiBzdHJpbmcpIHtcclxuICAgIGxldCBzZWxmID0gdGhpc1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgc2VsZi5jb25uLnF1ZXJ5KGBTRUxFQ1Qgc3J0ZXh0IEZST00gc3BhdGlhbF9yZWZfc3lzIFdIRVJFIHNyaWQgPSAkeyBzZWxmLnNyaWQgfWAsIGZ1bmN0aW9uIChlcnJvciwgcmVzdWx0cywgZmllbGRzKSB7XHJcbiAgICAgICAgaWYgKCBlcnJvciApIHtcclxuICAgICAgICAgIHJlamVjdChlcnJvcilcclxuICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICByZXNvbHZlKHJlc3VsdHMpXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgfSlcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCB7IE15c3FsT3B0aW9ucyAsIE1hcE9wdGlvbnMgLCBNYXBTZXJ2aWNlIH1cclxuIl19
