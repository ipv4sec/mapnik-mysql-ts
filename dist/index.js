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
var mapnik = require('mapnik');
var proj4 = require("proj4");
var path = require("path");
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
    };
    MapService.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var self, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        self = this;
                        // // 查询出 srtext
                        _a = this;
                        return [4 /*yield*/, this.getMysqlConnection()
                            // let result: any = await this.query(`SELECT srtext FROM spatial_ref_sys WHERE srid = 4326`)
                            // // GEOGCS["WGS 84",DATUM["WGS_1984",SPHEROID["WGS 84",6378137,298.257223563,AUTHORITY["EPSG","7030"]],AUTHORITY["EPSG","6326"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4326"]]
                            // let srtext: string = result[0]['srtext']
                            // 根据数据库里面的srid转换为
                        ];
                    case 1:
                        // // 查询出 srtext
                        _a.conn = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MapService.prototype.getTile = function (z, x, y) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var vt, extent, firstProjection, secondProjection, leftDown, rightUp, leftUp, rightDown, coordinates, polygon, where, sql, result, features, _i, result_1, row, geoJson, columnGeoInfo, featureCollection;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vt = new mapnik.VectorTile(z, x, y);
                        extent = vt.extent();
                        firstProjection = "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs";
                        secondProjection = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";
                        leftDown = proj4(firstProjection, secondProjection, [extent[0], extent[1]]);
                        rightUp = proj4(firstProjection, secondProjection, [extent[2], extent[3]]);
                        leftUp = proj4(firstProjection, secondProjection, [extent[0], extent[3]]);
                        rightDown = proj4(firstProjection, secondProjection, [extent[2], extent[1]]);
                        coordinates = leftDown.concat(leftUp, rightUp, rightDown, leftDown);
                        polygon = "'POLYGON((\n    " + coordinates[0] + " " + coordinates[1] + ",\n    " + coordinates[2] + " " + coordinates[3] + ",\n    " + coordinates[4] + " " + coordinates[5] + ",\n    " + coordinates[6] + " " + coordinates[7] + ",\n    " + coordinates[8] + " " + coordinates[9] + "))'";
                        where = "st_Contains(GeomFromText(" + polygon + ",4326), " + this.geom + ") or st_overlaps(GeomFromText(" + polygon + ",4326), " + this.geom + ")";
                        sql = "select ST_AsGeoJSON(" + this.geom + ") AS geojson , " + this.fields.join(',') + " FROM " + this.table + "  WHERE " + where;
                        return [4 /*yield*/, this.query(sql)
                            // 转换结果为 FeatureCollection
                        ];
                    case 1:
                        result = _a.sent();
                        features = [];
                        for (_i = 0, result_1 = result; _i < result_1.length; _i++) {
                            row = result_1[_i];
                            geoJson = JSON.parse(row['geojson']);
                            columnGeoInfo = {
                                'type': 'Feature',
                                'properties': row,
                                'geometry': geoJson
                            };
                            features.push(columnGeoInfo);
                        }
                        featureCollection = {
                            'crs': { 'type': 'name', 'properties': { 'name': 'urn:ogc:def:crs:OGC:1.3:CRS84' } },
                            'type': 'FeatureCollection',
                            'features': features
                        };
                        // 现在使用mapnik转换pbf
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                mapnik.register_datasource((path.join(mapnik.settings.paths.input_plugins, 'geojson.input')));
                                var vt = new mapnik.VectorTile(z, x, y);
                                vt.addGeoJSON(JSON.stringify(featureCollection), _this.layer, {});
                                vt.toGeoJSONSync(0);
                                vt.getData({
                                    compression: 'none',
                                    level: 9,
                                    strategy: 'FILTERED'
                                }, function (err, data) {
                                    if (err) {
                                        reject(err);
                                    }
                                    else {
                                        resolve(data);
                                    }
                                });
                            })];
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
                        self.conn.query(sql, function (error, results, fields) {
                            if (error) {
                                console.log(error);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,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QSxJQUFJLENBQUMsQ0FBQztnQ0FDTCxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUE7NEJBQ3JCLENBQUM7d0JBQ0gsQ0FBQyxDQUFDLENBQUE7b0JBQ0osQ0FBQyxDQUFDLEVBQUE7OztLQUNIO0lBQ2EsMEJBQUssR0FBbkIsVUFBcUIsR0FBVzs7OztnQkFDMUIsSUFBSSxHQUFHLElBQUksQ0FBQTtnQkFDZixzQkFBTyxJQUFJLE9BQU8sQ0FBQyxVQUFVLE9BQU8sRUFBRSxNQUFNO3dCQUMxQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsVUFBVSxLQUFVLEVBQUUsT0FBWSxFQUFFLE1BQVc7NEJBQ2xFLEVBQUUsQ0FBQyxDQUFFLEtBQU0sQ0FBQyxDQUFDLENBQUM7Z0NBQ1osT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQTtnQ0FDbEIsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFBOzRCQUNmLENBQUM7NEJBQUEsSUFBSSxDQUFDLENBQUM7Z0NBQ0wsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFBOzRCQUNsQixDQUFDO3dCQUNILENBQUMsQ0FBQyxDQUFBO29CQUNKLENBQUMsQ0FBQyxFQUFBOzs7S0FDSDtJQUNILGlCQUFDO0FBQUQsQ0ExR0EsQUEwR0MsSUFBQTtBQUVvQyxnQ0FBVSIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IG15c3FscCA9IHJlcXVpcmUoJ3Byb21pc2UtbXlzcWwnKVxyXG5jb25zdCBtYXBuaWsgPSByZXF1aXJlKCdtYXBuaWsnKVxyXG5pbXBvcnQgKiBhcyBteXNxbCBmcm9tICdteXNxbCdcclxuaW1wb3J0ICogYXMgcHJvajQgZnJvbSAncHJvajQnXHJcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCdcclxuXHJcbmludGVyZmFjZSBNeXNxbE9wdGlvbnMge1xyXG4gIGhvc3Q6IHN0cmluZyxcclxuICB1c2VyOiBzdHJpbmcsXHJcbiAgcGFzc3dvcmQ6IHN0cmluZyxcclxuICBkYXRhYmFzZTogc3RyaW5nXHJcbn1cclxuaW50ZXJmYWNlIE1hcE9wdGlvbnMge1xyXG4gIHRhYmxlOiBzdHJpbmcsXHJcbiAgbGF5ZXI6IHN0cmluZyxcclxuICBnZW9tOiBzdHJpbmcsXHJcbiAgZmllbGRzOiBzdHJpbmdbXVxyXG59XHJcblxyXG5jbGFzcyBNYXBTZXJ2aWNlIHtcclxuICBwdWJsaWMgbXlzcWxQb29sOiBteXNxbC5JUG9vbFxyXG4gIHByaXZhdGUgY29ubjogYW55XHJcbiAgcHJpdmF0ZSB0YWJsZTogc3RyaW5nXHJcbiAgcHJpdmF0ZSBsYXllcjogc3RyaW5nXHJcbiAgcHJpdmF0ZSBnZW9tOiBzdHJpbmdcclxuICBwcml2YXRlIGZpZWxkczogc3RyaW5nW11cclxuICBwdWJsaWMgaW5pdE15c3FsIChteXNxbE9wdGlvbjogTXlzcWxPcHRpb25zKTogTWFwU2VydmljZSB7XHJcbiAgICB0aGlzLm15c3FsUG9vbCA9IG15c3FscC5jcmVhdGVQb29sKG15c3FsT3B0aW9uKVxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgcHVibGljIGluaXRNYXAgKHNlcnZpY2VPcHRpb246IE1hcE9wdGlvbnMpOiB2b2lkIHtcclxuICAgIHRoaXMudGFibGUgPSBzZXJ2aWNlT3B0aW9uLnRhYmxlXHJcbiAgICB0aGlzLmxheWVyID0gc2VydmljZU9wdGlvbi5sYXllclxyXG4gICAgdGhpcy5nZW9tID0gc2VydmljZU9wdGlvbi5nZW9tXHJcbiAgICB0aGlzLmZpZWxkcyA9IHNlcnZpY2VPcHRpb24uZmllbGRzXHJcbiAgfVxyXG4gIHB1YmxpYyBhc3luYyBzdGFydCAoKSB7XHJcbiAgICBsZXQgc2VsZiA9IHRoaXNcclxuICAgIC8vIC8vIOafpeivouWHuiBzcnRleHRcclxuICAgIHRoaXMuY29ubiA9IGF3YWl0IHRoaXMuZ2V0TXlzcWxDb25uZWN0aW9uKClcclxuICAgIC8vIGxldCByZXN1bHQ6IGFueSA9IGF3YWl0IHRoaXMucXVlcnkoYFNFTEVDVCBzcnRleHQgRlJPTSBzcGF0aWFsX3JlZl9zeXMgV0hFUkUgc3JpZCA9IDQzMjZgKVxyXG4gICAgLy8gLy8gR0VPR0NTW1wiV0dTIDg0XCIsREFUVU1bXCJXR1NfMTk4NFwiLFNQSEVST0lEW1wiV0dTIDg0XCIsNjM3ODEzNywyOTguMjU3MjIzNTYzLEFVVEhPUklUWVtcIkVQU0dcIixcIjcwMzBcIl1dLEFVVEhPUklUWVtcIkVQU0dcIixcIjYzMjZcIl1dLFBSSU1FTVtcIkdyZWVud2ljaFwiLDAsQVVUSE9SSVRZW1wiRVBTR1wiLFwiODkwMVwiXV0sVU5JVFtcImRlZ3JlZVwiLDAuMDE3NDUzMjkyNTE5OTQzMyxBVVRIT1JJVFlbXCJFUFNHXCIsXCI5MTIyXCJdXSxBVVRIT1JJVFlbXCJFUFNHXCIsXCI0MzI2XCJdXVxyXG4gICAgLy8gbGV0IHNydGV4dDogc3RyaW5nID0gcmVzdWx0WzBdWydzcnRleHQnXVxyXG4gICAgLy8g5qC55o2u5pWw5o2u5bqT6YeM6Z2i55qEc3JpZOi9rOaNouS4ulxyXG4gIH1cclxuICBwdWJsaWMgYXN5bmMgZ2V0VGlsZSAoejogbnVtYmVyLCB4OiBudW1iZXIgLCB5OiBudW1iZXIgKTogUHJvbWlzZTxCdWZmZXI+IHtcclxuICAgIGxldCB2dDogYW55ID0gbmV3IG1hcG5pay5WZWN0b3JUaWxlKHosIHgsIHkpXHJcbiAgICBsZXQgZXh0ZW50OiBudW1iZXJbXSA9IHZ0LmV4dGVudCgpXHJcbiAgICBsZXQgZmlyc3RQcm9qZWN0aW9uID0gYCtwcm9qPW1lcmMgK2E9NjM3ODEzNyArYj02Mzc4MTM3ICtsYXRfdHM9MC4wICtsb25fMD0wLjAgK3hfMD0wLjAgK3lfMD0wICtrPTEuMCArdW5pdHM9bSArbmFkZ3JpZHM9QG51bGwgK3drdGV4dCAgK25vX2RlZnNgXHJcbiAgICBsZXQgc2Vjb25kUHJvamVjdGlvbiA9IGArcHJvaj1sb25nbGF0ICtlbGxwcz1XR1M4NCArZGF0dW09V0dTODQgK25vX2RlZnNgXHJcbiAgICBsZXQgbGVmdERvd246IGFueSA9IHByb2o0KGZpcnN0UHJvamVjdGlvbiwgc2Vjb25kUHJvamVjdGlvbiwgW2V4dGVudFswXSwgZXh0ZW50WzFdXSlcclxuICAgIGxldCByaWdodFVwOiBhbnkgPSBwcm9qNChmaXJzdFByb2plY3Rpb24sIHNlY29uZFByb2plY3Rpb24sIFtleHRlbnRbMl0sIGV4dGVudFszXV0pXHJcbiAgICBsZXQgbGVmdFVwOiBhbnkgPSBwcm9qNChmaXJzdFByb2plY3Rpb24sIHNlY29uZFByb2plY3Rpb24sIFtleHRlbnRbMF0sIGV4dGVudFszXV0pXHJcbiAgICBsZXQgcmlnaHREb3duOiBhbnkgPSBwcm9qNChmaXJzdFByb2plY3Rpb24sIHNlY29uZFByb2plY3Rpb24sIFtleHRlbnRbMl0sIGV4dGVudFsxXV0pXHJcbiAgICBjb25zdCBjb29yZGluYXRlczogYW55ID0gWy4uLmxlZnREb3duLCAuLi5sZWZ0VXAsIC4uLnJpZ2h0VXAsIC4uLnJpZ2h0RG93biwgLi4ubGVmdERvd25dXHJcbiAgICBsZXQgcG9seWdvbiA9IGAnUE9MWUdPTigoXHJcbiAgICAke2Nvb3JkaW5hdGVzWzBdfSAke2Nvb3JkaW5hdGVzWzFdfSxcclxuICAgICR7Y29vcmRpbmF0ZXNbMl19ICR7Y29vcmRpbmF0ZXNbM119LFxyXG4gICAgJHtjb29yZGluYXRlc1s0XX0gJHtjb29yZGluYXRlc1s1XX0sXHJcbiAgICAke2Nvb3JkaW5hdGVzWzZdfSAke2Nvb3JkaW5hdGVzWzddfSxcclxuICAgICR7Y29vcmRpbmF0ZXNbOF19ICR7Y29vcmRpbmF0ZXNbOV19KSknYFxyXG4gICAgbGV0IHdoZXJlID0gYHN0X0NvbnRhaW5zKEdlb21Gcm9tVGV4dCgkeyBwb2x5Z29uIH0sNDMyNiksICR7IHRoaXMuZ2VvbSB9KSBvciBzdF9vdmVybGFwcyhHZW9tRnJvbVRleHQoJHtwb2x5Z29ufSw0MzI2KSwgJHsgdGhpcy5nZW9tIH0pYFxyXG4gICAgbGV0IHNxbDogc3RyaW5nID0gYHNlbGVjdCBTVF9Bc0dlb0pTT04oJHsgdGhpcy5nZW9tIH0pIEFTIGdlb2pzb24gLCAkeyB0aGlzLmZpZWxkcy5qb2luKCcsJykgfSBGUk9NICR7IHRoaXMudGFibGUgfSAgV0hFUkUgJHsgd2hlcmUgfWBcclxuICAgIGxldCByZXN1bHQ6IGFueSA9IGF3YWl0IHRoaXMucXVlcnkoc3FsKVxyXG5cclxuICAgIC8vIOi9rOaNoue7k+aenOS4uiBGZWF0dXJlQ29sbGVjdGlvblxyXG4gICAgbGV0IGZlYXR1cmVzOiBhbnlbXSA9IFtdXHJcbiAgICBmb3IgKGxldCByb3cgb2YgcmVzdWx0KSB7XHJcbiAgICAgIGxldCBnZW9Kc29uOiBhbnkgPSBKU09OLnBhcnNlKHJvd1snZ2VvanNvbiddKVxyXG4gICAgICBsZXQgY29sdW1uR2VvSW5mbzogYW55ID0ge1xyXG4gICAgICAgICd0eXBlJzogJ0ZlYXR1cmUnLFxyXG4gICAgICAgICdwcm9wZXJ0aWVzJzogcm93LFxyXG4gICAgICAgICdnZW9tZXRyeSc6IGdlb0pzb25cclxuICAgICAgfVxyXG4gICAgICBmZWF0dXJlcy5wdXNoKGNvbHVtbkdlb0luZm8pXHJcbiAgICB9XHJcbiAgICBsZXQgZmVhdHVyZUNvbGxlY3Rpb246IGFueSA9IHtcclxuICAgICAgJ2Nycyc6IHsndHlwZSc6ICduYW1lJywgJ3Byb3BlcnRpZXMnOiB7J25hbWUnOiAndXJuOm9nYzpkZWY6Y3JzOk9HQzoxLjM6Q1JTODQnfX0sXHJcbiAgICAgICd0eXBlJzogJ0ZlYXR1cmVDb2xsZWN0aW9uJyxcclxuICAgICAgJ2ZlYXR1cmVzJzogZmVhdHVyZXNcclxuICAgIH1cclxuICAgIC8vIOeOsOWcqOS9v+eUqG1hcG5pa+i9rOaNonBiZlxyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPEJ1ZmZlcj4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICBtYXBuaWsucmVnaXN0ZXJfZGF0YXNvdXJjZSgocGF0aC5qb2luKG1hcG5pay5zZXR0aW5ncy5wYXRocy5pbnB1dF9wbHVnaW5zLCAnZ2VvanNvbi5pbnB1dCcpKSlcclxuICAgICAgbGV0IHZ0OiBhbnkgPSBuZXcgbWFwbmlrLlZlY3RvclRpbGUoeiwgeCwgeSlcclxuICAgICAgdnQuYWRkR2VvSlNPTihKU09OLnN0cmluZ2lmeShmZWF0dXJlQ29sbGVjdGlvbiksIHRoaXMubGF5ZXIgLCB7fSlcclxuICAgICAgdnQudG9HZW9KU09OU3luYygwKVxyXG4gICAgICB2dC5nZXREYXRhKHtcclxuICAgICAgICBjb21wcmVzc2lvbjogJ25vbmUnLFxyXG4gICAgICAgIGxldmVsOiA5LFxyXG4gICAgICAgIHN0cmF0ZWd5OiAnRklMVEVSRUQnXHJcbiAgICAgIH0sIChlcnI6IGFueSwgZGF0YTogQnVmZmVyKSA9PiB7XHJcbiAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgcmVqZWN0KGVycilcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmVzb2x2ZShkYXRhKVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIH0pXHJcbiAgfVxyXG4gIHByaXZhdGUgYXN5bmMgZ2V0TXlzcWxDb25uZWN0aW9uICgpIHtcclxuICAgIGxldCBzZWxmID0gdGhpc1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgc2VsZi5teXNxbFBvb2wuZ2V0Q29ubmVjdGlvbihmdW5jdGlvbiAoZXJyOiBhbnksIGNvbm5lY3Rpb246IG15c3FsLklDb25uZWN0aW9uKSB7XHJcbiAgICAgICAgaWYgKCBlcnIgKSB7XHJcbiAgICAgICAgICByZWplY3QoZXJyKVxyXG4gICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgIHJlc29sdmUoY29ubmVjdGlvbilcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICB9KVxyXG4gIH1cclxuICBwcml2YXRlIGFzeW5jIHF1ZXJ5IChzcWw6IHN0cmluZykge1xyXG4gICAgbGV0IHNlbGYgPSB0aGlzXHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICBzZWxmLmNvbm4ucXVlcnkoc3FsLCBmdW5jdGlvbiAoZXJyb3I6IGFueSwgcmVzdWx0czogYW55LCBmaWVsZHM6IGFueSkge1xyXG4gICAgICAgIGlmICggZXJyb3IgKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcilcclxuICAgICAgICAgIHJlamVjdChlcnJvcilcclxuICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICByZXNvbHZlKHJlc3VsdHMpXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgfSlcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCB7IE15c3FsT3B0aW9ucyAsIE1hcE9wdGlvbnMgLCBNYXBTZXJ2aWNlIH1cclxuIl19
