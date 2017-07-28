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
var _1 = require("../");
var express_core_ts_1 = require("express-core-ts");
var mapService = new _1.MapService();
var mysqlOptions = {
    host: 'localhost',
    user: 'root',
    password: 'passwd',
    database: 'mapnik'
};
var mapOptions = {
    table: 'land',
    layer: 'anivia',
    geom: 'geom',
    fields: ['serials_id AS serialsId', 'id']
};
mapService.initMysql(mysqlOptions).initMap(mapOptions);
mapService.start();
express_core_ts_1.app.use(express_core_ts_1.express.static('res'));
express_core_ts_1.app.use('/map/service/v1/:z/:x/:y', function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var pbf, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, mapService.getTile(Number(req.params.z), Number(req.params.x), Number(req.params.y))];
                case 1:
                    pbf = _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    pbf = new Buffer('');
                    return [3 /*break*/, 3];
                case 3:
                    res.end(pbf);
                    return [2 /*return*/];
            }
        });
    });
});
express_core_ts_1.app.listen(3000);

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9leGFtcGxlL2FwcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0Esd0JBQTREO0FBQzVELG1EQUErQztBQUUvQyxJQUFJLFVBQVUsR0FBZSxJQUFJLGFBQVUsRUFBRSxDQUFBO0FBQzdDLElBQUksWUFBWSxHQUFpQjtJQUMvQixJQUFJLEVBQUUsV0FBVztJQUNqQixJQUFJLEVBQUUsTUFBTTtJQUNaLFFBQVEsRUFBRSxRQUFRO0lBQ2xCLFFBQVEsRUFBRSxRQUFRO0NBQ25CLENBQUE7QUFDRCxJQUFJLFVBQVUsR0FBZTtJQUMzQixLQUFLLEVBQUUsTUFBTTtJQUNiLEtBQUssRUFBRSxRQUFRO0lBQ2YsSUFBSSxFQUFFLE1BQU07SUFDWixNQUFNLEVBQUUsQ0FBQyx5QkFBeUIsRUFBQyxJQUFJLENBQUM7Q0FDekMsQ0FBQTtBQUVELFVBQVUsQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFBO0FBQ3RELFVBQVUsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtBQUVsQixxQkFBRyxDQUFDLEdBQUcsQ0FBQyx5QkFBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFBO0FBQzlCLHFCQUFHLENBQUMsR0FBRyxDQUFDLDBCQUEwQixFQUFHLFVBQWdCLEdBQUcsRUFBQyxHQUFHOzs7Ozs7O29CQUdsRCxxQkFBTSxVQUFVLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUE7O29CQUE5RixHQUFHLEdBQUcsU0FBd0YsQ0FBQTs7OztvQkFFOUYsR0FBRyxHQUFHLElBQUksTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFBOzs7b0JBRXRCLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUE7Ozs7O0NBQ2IsQ0FBQyxDQUFBO0FBQ0YscUJBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUEiLCJmaWxlIjoiZXhhbXBsZS9hcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuaW1wb3J0IHsgTWFwU2VydmljZSAsIE1hcE9wdGlvbnMgLCBNeXNxbE9wdGlvbnMgfSBmcm9tICcuLi8nXHJcbmltcG9ydCB7IGFwcCAsIGV4cHJlc3MgfSBmcm9tICdleHByZXNzLWNvcmUtdHMnXHJcblxyXG5sZXQgbWFwU2VydmljZTogTWFwU2VydmljZSA9IG5ldyBNYXBTZXJ2aWNlKClcclxubGV0IG15c3FsT3B0aW9uczogTXlzcWxPcHRpb25zID0ge1xyXG4gIGhvc3Q6ICdsb2NhbGhvc3QnLFxyXG4gIHVzZXI6ICdyb290JyxcclxuICBwYXNzd29yZDogJ3Bhc3N3ZCcsXHJcbiAgZGF0YWJhc2U6ICdtYXBuaWsnXHJcbn1cclxubGV0IG1hcE9wdGlvbnM6IE1hcE9wdGlvbnMgPSB7XHJcbiAgdGFibGU6ICdsYW5kJyxcclxuICBsYXllcjogJ2FuaXZpYScsXHJcbiAgZ2VvbTogJ2dlb20nLFxyXG4gIGZpZWxkczogWydzZXJpYWxzX2lkIEFTIHNlcmlhbHNJZCcsJ2lkJ11cclxufVxyXG5cclxubWFwU2VydmljZS5pbml0TXlzcWwobXlzcWxPcHRpb25zKS5pbml0TWFwKG1hcE9wdGlvbnMpXHJcbm1hcFNlcnZpY2Uuc3RhcnQoKVxyXG5cclxuYXBwLnVzZShleHByZXNzLnN0YXRpYygncmVzJykpXHJcbmFwcC51c2UoJy9tYXAvc2VydmljZS92MS86ei86eC86eScgLCBhc3luYyBmdW5jdGlvbiAocmVxLHJlcykge1xyXG4gIGxldCBwYmY6IGFueVxyXG4gIHRyeSB7XHJcbiAgICBwYmYgPSBhd2FpdCBtYXBTZXJ2aWNlLmdldFRpbGUoTnVtYmVyKHJlcS5wYXJhbXMueiksTnVtYmVyKHJlcS5wYXJhbXMueCksTnVtYmVyKHJlcS5wYXJhbXMueSkpXHJcbiAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICBwYmYgPSBuZXcgQnVmZmVyKCcnKVxyXG4gIH1cclxuICByZXMuZW5kKHBiZilcclxufSlcclxuYXBwLmxpc3RlbigzMDAwKVxyXG5cclxuIl19
