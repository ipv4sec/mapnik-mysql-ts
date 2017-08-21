# mapnik-mysql-ts

在Mysql中存储geometry , 使用mapnik渲染pbf的TypeScript方案


### Use

```bash
npm install ipv4sec/mapnik-mysql-ts --save
```

1,在`Mysql`数据库表中插入 `sql/spatial_ref_sys.sql`

2,将`geojson`文件导入Mysql

2.1.安装 [conda](https://conda.io/miniconda.html)

2.2,安装`gdal` , `conda install gdal`

2.3,转换`geojson`文件为`csv` , 其中`geometry`字段为`WKT`格式

```bash
ogr2ogr -f "CSV" -lco GEOMETRY=AS_WKT -overwrite {输出的 csv 文件路径} {输入的 geojson 文件路径}
```

2.4,csv导入数据库,推荐 `navicat` 可视化导入,`csv`中的`WKT`字段以`text`格式导入

2.5,按照需求建`geometry`字段(刚刚导入的`WKT`字段是`text`格式,算是临时字段)

2.6,在mysql中执行
```mysql-sql
UPDATE { 表名 } SET { 新建的 geometry 字段 } = ST_GeomFromText(WKT) WHERE 1=1;
```
2.7,删除临时字段

2.8,更新srid

```mysql-sql
UPDATE { 表名 } SET { 刚才的 geometry 字段 } = GeomFromWKB(aswkb({ 刚才的 geometry 字段 }),{ srid的值 });
```

//TODO mapnik只能转换3857,所以数据库存储的可以是任何坐标系. 现在存储的是4326坐标系

2.9,查询当前的srid
```mysql-sql
SELECT srid({ 刚才的 geometry 字段 }) from {表名} LIMIT 1;
```


3,代码
```typescript

import { MapService , MapOptions , MysqlOptions } from 'mapnik-mysql-ts'
let mapService: MapService = new MapService()
let mysqlOptions: MysqlOptions = {
  host: 'localhost',
  user: 'root',
  password: 'passwd',
  database: 'mapnik'
}
let mapOptions: MapOptions = {
  table: 'land',
  layer: 'anivia',
  geom: 'geom',
  fields: ['serials_id AS serialsId','id']
}

mapService.initMysql(mysqlOptions).initMap(mapOptions)
mapService.start()

let pbf: Buffer = await mapService.getTile(Number(req.params.z),Number(req.params.x),Number(req.params.y))
```


### lint

`sh ./bin/tslint.sh` or  `gulp tslint`

### test

`sh ./bin/test.sh` or  `npm test`


### build

`sh ./bin/build.sh` or  `gulp build` or  `gulp watch-build`


致敬： [https://github.com/DaYeSquad/gago-mapnik-mysql](https://github.com/DaYeSquad/gago-mapnik-mysql)
