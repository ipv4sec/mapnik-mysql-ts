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
                        // let result: any = await this.query(`SELECT srtext FROM spatial_ref_sys WHERE srid = 4326`)
                        // // GEOGCS["WGS 84",DATUM["WGS_1984",SPHEROID["WGS 84",6378137,298.257223563,AUTHORITY["EPSG","7030"]],AUTHORITY["EPSG","6326"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4326"]]
                        // let srtext: string = result[0]['srtext']
                        // 根据数据库里面的srid转换为
                        mapnik.register_datasource((path.join(mapnik.settings.paths.input_plugins, 'geojson.input')));
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFBO0FBQ3ZDLElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUVoQyw2QkFBOEI7QUFDOUIsMkJBQTRCO0FBZTVCO0lBQUE7SUE0R0EsQ0FBQztJQXJHUSw4QkFBUyxHQUFoQixVQUFrQixXQUF5QjtRQUN6QyxJQUFJLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLENBQUE7UUFDL0MsTUFBTSxDQUFDLElBQUksQ0FBQTtJQUNiLENBQUM7SUFDTSw0QkFBTyxHQUFkLFVBQWdCLGFBQXlCO1FBQ3ZDLElBQUksQ0FBQyxLQUFLLEdBQUcsYUFBYSxDQUFDLEtBQUssQ0FBQTtRQUNoQyxJQUFJLENBQUMsS0FBSyxHQUFHLGFBQWEsQ0FBQyxLQUFLLENBQUE7UUFDaEMsSUFBSSxDQUFDLElBQUksR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFBO1FBQzlCLElBQUksQ0FBQyxNQUFNLEdBQUcsYUFBYSxDQUFDLE1BQU0sQ0FBQTtJQUNwQyxDQUFDO0lBQ1ksMEJBQUssR0FBbEI7Ozs7Ozt3QkFDTSxJQUFJLEdBQUcsSUFBSSxDQUFBO3dCQUNmLGdCQUFnQjt3QkFDaEIsS0FBQSxJQUFJLENBQUE7d0JBQVEscUJBQU0sSUFBSSxDQUFDLGtCQUFrQixFQUFFOzRCQUMzQyw2RkFBNkY7NEJBQzdGLHNRQUFzUTs0QkFDdFEsMkNBQTJDOzRCQUMzQyxrQkFBa0I7MEJBSnlCOzt3QkFEM0MsZ0JBQWdCO3dCQUNoQixHQUFLLElBQUksR0FBRyxTQUErQixDQUFBO3dCQUMzQyw2RkFBNkY7d0JBQzdGLHNRQUFzUTt3QkFDdFEsMkNBQTJDO3dCQUMzQyxrQkFBa0I7d0JBRWxCLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsYUFBYSxFQUFFLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQTs7Ozs7S0FDOUY7SUFDWSw0QkFBTyxHQUFwQixVQUFzQixDQUFTLEVBQUUsQ0FBUyxFQUFHLENBQVM7Ozs7Ozs7d0JBQ2hELEVBQUUsR0FBUSxJQUFJLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTt3QkFDeEMsTUFBTSxHQUFhLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQTt3QkFDOUIsZUFBZSxHQUFHLDJIQUEySCxDQUFBO3dCQUM3SSxnQkFBZ0IsR0FBRyxrREFBa0QsQ0FBQTt3QkFDckUsUUFBUSxHQUFRLEtBQUssQ0FBQyxlQUFlLEVBQUUsZ0JBQWdCLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTt3QkFDaEYsT0FBTyxHQUFRLEtBQUssQ0FBQyxlQUFlLEVBQUUsZ0JBQWdCLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTt3QkFDL0UsTUFBTSxHQUFRLEtBQUssQ0FBQyxlQUFlLEVBQUUsZ0JBQWdCLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTt3QkFDOUUsU0FBUyxHQUFRLEtBQUssQ0FBQyxlQUFlLEVBQUUsZ0JBQWdCLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTt3QkFDL0UsV0FBVyxHQUFZLFFBQVEsUUFBSyxNQUFNLEVBQUssT0FBTyxFQUFLLFNBQVMsRUFBSyxRQUFRLENBQUMsQ0FBQTt3QkFDcEYsT0FBTyxHQUFHLHFCQUNaLFdBQVcsQ0FBQyxDQUFDLENBQUMsU0FBSSxXQUFXLENBQUMsQ0FBQyxDQUFDLGVBQ2hDLFdBQVcsQ0FBQyxDQUFDLENBQUMsU0FBSSxXQUFXLENBQUMsQ0FBQyxDQUFDLGVBQ2hDLFdBQVcsQ0FBQyxDQUFDLENBQUMsU0FBSSxXQUFXLENBQUMsQ0FBQyxDQUFDLGVBQ2hDLFdBQVcsQ0FBQyxDQUFDLENBQUMsU0FBSSxXQUFXLENBQUMsQ0FBQyxDQUFDLGVBQ2hDLFdBQVcsQ0FBQyxDQUFDLENBQUMsU0FBSSxXQUFXLENBQUMsQ0FBQyxDQUFDLFFBQUssQ0FBQTt3QkFDbkMsS0FBSyxHQUFHLDhCQUE2QixPQUFPLGdCQUFhLElBQUksQ0FBQyxJQUFJLHNDQUFrQyxPQUFPLGdCQUFZLElBQUksQ0FBQyxJQUFJLE1BQUksQ0FBQTt3QkFDcEksR0FBRyxHQUFXLHlCQUF3QixJQUFJLENBQUMsSUFBSSx1QkFBb0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLGNBQVcsSUFBSSxDQUFDLEtBQUssZ0JBQWEsS0FBUSxDQUFBO3dCQUNwSCxxQkFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQzs0QkFFdkMsMEJBQTBCOzBCQUZhOzt3QkFBbkMsTUFBTSxHQUFRLFNBQXFCO3dCQUduQyxRQUFRLEdBQVUsRUFBRSxDQUFBO3dCQUN4QixHQUFHLENBQUMsT0FBa0IsRUFBTixpQkFBTSxFQUFOLG9CQUFNLEVBQU4sSUFBTTs0QkFBYixHQUFHOzRCQUNOLE9BQU8sR0FBUSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFBOzRCQUN6QyxhQUFhLEdBQVE7Z0NBQ3ZCLE1BQU0sRUFBRSxTQUFTO2dDQUNqQixZQUFZLEVBQUUsR0FBRztnQ0FDakIsVUFBVSxFQUFFLE9BQU87NkJBQ3BCLENBQUE7NEJBQ0QsUUFBUSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQTt5QkFDN0I7d0JBQ0csaUJBQWlCLEdBQVE7NEJBQzNCLEtBQUssRUFBRSxFQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLEVBQUMsTUFBTSxFQUFFLCtCQUErQixFQUFDLEVBQUM7NEJBQ2hGLE1BQU0sRUFBRSxtQkFBbUI7NEJBQzNCLFVBQVUsRUFBRSxRQUFRO3lCQUNyQixDQUFBO3dCQUNELGtCQUFrQjt3QkFDbEIsc0JBQU8sSUFBSSxPQUFPLENBQVMsVUFBQyxPQUFPLEVBQUUsTUFBTTtnQ0FFekMsSUFBSSxFQUFFLEdBQVEsSUFBSSxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7Z0NBQzVDLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLEtBQUksQ0FBQyxLQUFLLEVBQUcsRUFBRSxDQUFDLENBQUE7Z0NBQ2pFLEVBQUUsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUE7Z0NBQ25CLEVBQUUsQ0FBQyxPQUFPLENBQUM7b0NBQ1QsV0FBVyxFQUFFLE1BQU07b0NBQ25CLEtBQUssRUFBRSxDQUFDO29DQUNSLFFBQVEsRUFBRSxVQUFVO2lDQUNyQixFQUFFLFVBQUMsR0FBUSxFQUFFLElBQVk7b0NBQ3hCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7d0NBQ1IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFBO29DQUNiLENBQUM7b0NBQUMsSUFBSSxDQUFDLENBQUM7d0NBQ04sT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO29DQUNmLENBQUM7Z0NBQ0gsQ0FBQyxDQUFDLENBQUE7NEJBQ0osQ0FBQyxDQUFDLEVBQUE7Ozs7S0FDSDtJQUNhLHVDQUFrQixHQUFoQzs7OztnQkFDTSxJQUFJLEdBQUcsSUFBSSxDQUFBO2dCQUNmLHNCQUFPLElBQUksT0FBTyxDQUFDLFVBQVUsT0FBTyxFQUFFLE1BQU07d0JBQzFDLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLFVBQVUsR0FBUSxFQUFFLFVBQTZCOzRCQUM1RSxFQUFFLENBQUMsQ0FBRSxHQUFJLENBQUMsQ0FBQyxDQUFDO2dDQUNWLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQTs0QkFDYixDQUFDOzRCQUFBLElBQUksQ0FBQyxDQUFDO2dDQUNMLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQTs0QkFDckIsQ0FBQzt3QkFDSCxDQUFDLENBQUMsQ0FBQTtvQkFDSixDQUFDLENBQUMsRUFBQTs7O0tBQ0g7SUFDYSwwQkFBSyxHQUFuQixVQUFxQixHQUFXOzs7O2dCQUMxQixJQUFJLEdBQUcsSUFBSSxDQUFBO2dCQUNmLHNCQUFPLElBQUksT0FBTyxDQUFDLFVBQVUsT0FBTyxFQUFFLE1BQU07d0JBQzFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxVQUFVLEtBQVUsRUFBRSxPQUFZLEVBQUUsTUFBVzs0QkFDbEUsRUFBRSxDQUFDLENBQUUsS0FBTSxDQUFDLENBQUMsQ0FBQztnQ0FDWixPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFBO2dDQUNsQixNQUFNLENBQUMsS0FBSyxDQUFDLENBQUE7NEJBQ2YsQ0FBQzs0QkFBQSxJQUFJLENBQUMsQ0FBQztnQ0FDTCxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUE7NEJBQ2xCLENBQUM7d0JBQ0gsQ0FBQyxDQUFDLENBQUE7b0JBQ0osQ0FBQyxDQUFDLEVBQUE7OztLQUNIO0lBQ0gsaUJBQUM7QUFBRCxDQTVHQSxBQTRHQyxJQUFBO0FBRW9DLGdDQUFVIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgbXlzcWxwID0gcmVxdWlyZSgncHJvbWlzZS1teXNxbCcpXHJcbmNvbnN0IG1hcG5payA9IHJlcXVpcmUoJ21hcG5paycpXHJcbmltcG9ydCAqIGFzIG15c3FsIGZyb20gJ215c3FsJ1xyXG5pbXBvcnQgKiBhcyBwcm9qNCBmcm9tICdwcm9qNCdcclxuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJ1xyXG5cclxuaW50ZXJmYWNlIE15c3FsT3B0aW9ucyB7XHJcbiAgaG9zdDogc3RyaW5nLFxyXG4gIHVzZXI6IHN0cmluZyxcclxuICBwYXNzd29yZDogc3RyaW5nLFxyXG4gIGRhdGFiYXNlOiBzdHJpbmdcclxufVxyXG5pbnRlcmZhY2UgTWFwT3B0aW9ucyB7XHJcbiAgdGFibGU6IHN0cmluZyxcclxuICBsYXllcjogc3RyaW5nLFxyXG4gIGdlb206IHN0cmluZyxcclxuICBmaWVsZHM6IHN0cmluZ1tdXHJcbn1cclxuXHJcbmNsYXNzIE1hcFNlcnZpY2Uge1xyXG4gIHB1YmxpYyBteXNxbFBvb2w6IG15c3FsLklQb29sXHJcbiAgcHJpdmF0ZSBjb25uOiBhbnlcclxuICBwcml2YXRlIHRhYmxlOiBzdHJpbmdcclxuICBwcml2YXRlIGxheWVyOiBzdHJpbmdcclxuICBwcml2YXRlIGdlb206IHN0cmluZ1xyXG4gIHByaXZhdGUgZmllbGRzOiBzdHJpbmdbXVxyXG4gIHB1YmxpYyBpbml0TXlzcWwgKG15c3FsT3B0aW9uOiBNeXNxbE9wdGlvbnMpOiBNYXBTZXJ2aWNlIHtcclxuICAgIHRoaXMubXlzcWxQb29sID0gbXlzcWxwLmNyZWF0ZVBvb2wobXlzcWxPcHRpb24pXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuICBwdWJsaWMgaW5pdE1hcCAoc2VydmljZU9wdGlvbjogTWFwT3B0aW9ucyk6IHZvaWQge1xyXG4gICAgdGhpcy50YWJsZSA9IHNlcnZpY2VPcHRpb24udGFibGVcclxuICAgIHRoaXMubGF5ZXIgPSBzZXJ2aWNlT3B0aW9uLmxheWVyXHJcbiAgICB0aGlzLmdlb20gPSBzZXJ2aWNlT3B0aW9uLmdlb21cclxuICAgIHRoaXMuZmllbGRzID0gc2VydmljZU9wdGlvbi5maWVsZHNcclxuICB9XHJcbiAgcHVibGljIGFzeW5jIHN0YXJ0ICgpIHtcclxuICAgIGxldCBzZWxmID0gdGhpc1xyXG4gICAgLy8gLy8g5p+l6K+i5Ye6IHNydGV4dFxyXG4gICAgdGhpcy5jb25uID0gYXdhaXQgdGhpcy5nZXRNeXNxbENvbm5lY3Rpb24oKVxyXG4gICAgLy8gbGV0IHJlc3VsdDogYW55ID0gYXdhaXQgdGhpcy5xdWVyeShgU0VMRUNUIHNydGV4dCBGUk9NIHNwYXRpYWxfcmVmX3N5cyBXSEVSRSBzcmlkID0gNDMyNmApXHJcbiAgICAvLyAvLyBHRU9HQ1NbXCJXR1MgODRcIixEQVRVTVtcIldHU18xOTg0XCIsU1BIRVJPSURbXCJXR1MgODRcIiw2Mzc4MTM3LDI5OC4yNTcyMjM1NjMsQVVUSE9SSVRZW1wiRVBTR1wiLFwiNzAzMFwiXV0sQVVUSE9SSVRZW1wiRVBTR1wiLFwiNjMyNlwiXV0sUFJJTUVNW1wiR3JlZW53aWNoXCIsMCxBVVRIT1JJVFlbXCJFUFNHXCIsXCI4OTAxXCJdXSxVTklUW1wiZGVncmVlXCIsMC4wMTc0NTMyOTI1MTk5NDMzLEFVVEhPUklUWVtcIkVQU0dcIixcIjkxMjJcIl1dLEFVVEhPUklUWVtcIkVQU0dcIixcIjQzMjZcIl1dXHJcbiAgICAvLyBsZXQgc3J0ZXh0OiBzdHJpbmcgPSByZXN1bHRbMF1bJ3NydGV4dCddXHJcbiAgICAvLyDmoLnmja7mlbDmja7lupPph4zpnaLnmoRzcmlk6L2s5o2i5Li6XHJcblxyXG4gICAgbWFwbmlrLnJlZ2lzdGVyX2RhdGFzb3VyY2UoKHBhdGguam9pbihtYXBuaWsuc2V0dGluZ3MucGF0aHMuaW5wdXRfcGx1Z2lucywgJ2dlb2pzb24uaW5wdXQnKSkpXHJcbiAgfVxyXG4gIHB1YmxpYyBhc3luYyBnZXRUaWxlICh6OiBudW1iZXIsIHg6IG51bWJlciAsIHk6IG51bWJlciApOiBQcm9taXNlPEJ1ZmZlcj4ge1xyXG4gICAgbGV0IHZ0OiBhbnkgPSBuZXcgbWFwbmlrLlZlY3RvclRpbGUoeiwgeCwgeSlcclxuICAgIGxldCBleHRlbnQ6IG51bWJlcltdID0gdnQuZXh0ZW50KClcclxuICAgIGxldCBmaXJzdFByb2plY3Rpb24gPSBgK3Byb2o9bWVyYyArYT02Mzc4MTM3ICtiPTYzNzgxMzcgK2xhdF90cz0wLjAgK2xvbl8wPTAuMCAreF8wPTAuMCAreV8wPTAgK2s9MS4wICt1bml0cz1tICtuYWRncmlkcz1AbnVsbCArd2t0ZXh0ICArbm9fZGVmc2BcclxuICAgIGxldCBzZWNvbmRQcm9qZWN0aW9uID0gYCtwcm9qPWxvbmdsYXQgK2VsbHBzPVdHUzg0ICtkYXR1bT1XR1M4NCArbm9fZGVmc2BcclxuICAgIGxldCBsZWZ0RG93bjogYW55ID0gcHJvajQoZmlyc3RQcm9qZWN0aW9uLCBzZWNvbmRQcm9qZWN0aW9uLCBbZXh0ZW50WzBdLCBleHRlbnRbMV1dKVxyXG4gICAgbGV0IHJpZ2h0VXA6IGFueSA9IHByb2o0KGZpcnN0UHJvamVjdGlvbiwgc2Vjb25kUHJvamVjdGlvbiwgW2V4dGVudFsyXSwgZXh0ZW50WzNdXSlcclxuICAgIGxldCBsZWZ0VXA6IGFueSA9IHByb2o0KGZpcnN0UHJvamVjdGlvbiwgc2Vjb25kUHJvamVjdGlvbiwgW2V4dGVudFswXSwgZXh0ZW50WzNdXSlcclxuICAgIGxldCByaWdodERvd246IGFueSA9IHByb2o0KGZpcnN0UHJvamVjdGlvbiwgc2Vjb25kUHJvamVjdGlvbiwgW2V4dGVudFsyXSwgZXh0ZW50WzFdXSlcclxuICAgIGNvbnN0IGNvb3JkaW5hdGVzOiBhbnkgPSBbLi4ubGVmdERvd24sIC4uLmxlZnRVcCwgLi4ucmlnaHRVcCwgLi4ucmlnaHREb3duLCAuLi5sZWZ0RG93bl1cclxuICAgIGxldCBwb2x5Z29uID0gYCdQT0xZR09OKChcclxuICAgICR7Y29vcmRpbmF0ZXNbMF19ICR7Y29vcmRpbmF0ZXNbMV19LFxyXG4gICAgJHtjb29yZGluYXRlc1syXX0gJHtjb29yZGluYXRlc1szXX0sXHJcbiAgICAke2Nvb3JkaW5hdGVzWzRdfSAke2Nvb3JkaW5hdGVzWzVdfSxcclxuICAgICR7Y29vcmRpbmF0ZXNbNl19ICR7Y29vcmRpbmF0ZXNbN119LFxyXG4gICAgJHtjb29yZGluYXRlc1s4XX0gJHtjb29yZGluYXRlc1s5XX0pKSdgXHJcbiAgICBsZXQgd2hlcmUgPSBgc3RfQ29udGFpbnMoR2VvbUZyb21UZXh0KCR7IHBvbHlnb24gfSw0MzI2KSwgJHsgdGhpcy5nZW9tIH0pIG9yIHN0X292ZXJsYXBzKEdlb21Gcm9tVGV4dCgke3BvbHlnb259LDQzMjYpLCAkeyB0aGlzLmdlb20gfSlgXHJcbiAgICBsZXQgc3FsOiBzdHJpbmcgPSBgc2VsZWN0IFNUX0FzR2VvSlNPTigkeyB0aGlzLmdlb20gfSkgQVMgZ2VvanNvbiAsICR7IHRoaXMuZmllbGRzLmpvaW4oJywnKSB9IEZST00gJHsgdGhpcy50YWJsZSB9ICBXSEVSRSAkeyB3aGVyZSB9YFxyXG4gICAgbGV0IHJlc3VsdDogYW55ID0gYXdhaXQgdGhpcy5xdWVyeShzcWwpXHJcblxyXG4gICAgLy8g6L2s5o2i57uT5p6c5Li6IEZlYXR1cmVDb2xsZWN0aW9uXHJcbiAgICBsZXQgZmVhdHVyZXM6IGFueVtdID0gW11cclxuICAgIGZvciAobGV0IHJvdyBvZiByZXN1bHQpIHtcclxuICAgICAgbGV0IGdlb0pzb246IGFueSA9IEpTT04ucGFyc2Uocm93WydnZW9qc29uJ10pXHJcbiAgICAgIGxldCBjb2x1bW5HZW9JbmZvOiBhbnkgPSB7XHJcbiAgICAgICAgJ3R5cGUnOiAnRmVhdHVyZScsXHJcbiAgICAgICAgJ3Byb3BlcnRpZXMnOiByb3csXHJcbiAgICAgICAgJ2dlb21ldHJ5JzogZ2VvSnNvblxyXG4gICAgICB9XHJcbiAgICAgIGZlYXR1cmVzLnB1c2goY29sdW1uR2VvSW5mbylcclxuICAgIH1cclxuICAgIGxldCBmZWF0dXJlQ29sbGVjdGlvbjogYW55ID0ge1xyXG4gICAgICAnY3JzJzogeyd0eXBlJzogJ25hbWUnLCAncHJvcGVydGllcyc6IHsnbmFtZSc6ICd1cm46b2djOmRlZjpjcnM6T0dDOjEuMzpDUlM4NCd9fSxcclxuICAgICAgJ3R5cGUnOiAnRmVhdHVyZUNvbGxlY3Rpb24nLFxyXG4gICAgICAnZmVhdHVyZXMnOiBmZWF0dXJlc1xyXG4gICAgfVxyXG4gICAgLy8g546w5Zyo5L2/55SobWFwbmlr6L2s5o2icGJmXHJcbiAgICByZXR1cm4gbmV3IFByb21pc2U8QnVmZmVyPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcblxyXG4gICAgICBsZXQgdnQ6IGFueSA9IG5ldyBtYXBuaWsuVmVjdG9yVGlsZSh6LCB4LCB5KVxyXG4gICAgICB2dC5hZGRHZW9KU09OKEpTT04uc3RyaW5naWZ5KGZlYXR1cmVDb2xsZWN0aW9uKSwgdGhpcy5sYXllciAsIHt9KVxyXG4gICAgICB2dC50b0dlb0pTT05TeW5jKDApXHJcbiAgICAgIHZ0LmdldERhdGEoe1xyXG4gICAgICAgIGNvbXByZXNzaW9uOiAnbm9uZScsXHJcbiAgICAgICAgbGV2ZWw6IDksXHJcbiAgICAgICAgc3RyYXRlZ3k6ICdGSUxURVJFRCdcclxuICAgICAgfSwgKGVycjogYW55LCBkYXRhOiBCdWZmZXIpID0+IHtcclxuICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICByZWplY3QoZXJyKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZXNvbHZlKGRhdGEpXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgfSlcclxuICB9XHJcbiAgcHJpdmF0ZSBhc3luYyBnZXRNeXNxbENvbm5lY3Rpb24gKCkge1xyXG4gICAgbGV0IHNlbGYgPSB0aGlzXHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICBzZWxmLm15c3FsUG9vbC5nZXRDb25uZWN0aW9uKGZ1bmN0aW9uIChlcnI6IGFueSwgY29ubmVjdGlvbjogbXlzcWwuSUNvbm5lY3Rpb24pIHtcclxuICAgICAgICBpZiAoIGVyciApIHtcclxuICAgICAgICAgIHJlamVjdChlcnIpXHJcbiAgICAgICAgfWVsc2Uge1xyXG4gICAgICAgICAgcmVzb2x2ZShjb25uZWN0aW9uKVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIH0pXHJcbiAgfVxyXG4gIHByaXZhdGUgYXN5bmMgcXVlcnkgKHNxbDogc3RyaW5nKSB7XHJcbiAgICBsZXQgc2VsZiA9IHRoaXNcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgIHNlbGYuY29ubi5xdWVyeShzcWwsIGZ1bmN0aW9uIChlcnJvcjogYW55LCByZXN1bHRzOiBhbnksIGZpZWxkczogYW55KSB7XHJcbiAgICAgICAgaWYgKCBlcnJvciApIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKVxyXG4gICAgICAgICAgcmVqZWN0KGVycm9yKVxyXG4gICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgIHJlc29sdmUocmVzdWx0cylcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICB9KVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IHsgTXlzcWxPcHRpb25zICwgTWFwT3B0aW9ucyAsIE1hcFNlcnZpY2UgfVxyXG4iXX0=
