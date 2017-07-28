# mapnik-mysql-ts

在Mysql中存储geometry , 使用mapnik渲染pbf的TypeScript方案

Copy From [https://github.com/DaYeSquad/gago-mapnik-mysql](https://github.com/DaYeSquad/gago-mapnik-mysql)


### Use

```bash
npm install ipv4sec/mapnik-mysql-ts --save
```

1.在`Mysql`数据库表中插入 `sql/spatial_ref_sys.sql`

2.将`geojson`文件导入Mysql

(1)安装 [conda](https://conda.io/miniconda.html)

(2)安装`gdal` , `conda install gdal`

(3)转换`geojson`文件为`csv` , 其中`geometry`字段为`WKT`格式
```bash
ogr2ogr -f "CSV" -lco GEOMETRY=AS_WKT -overwrite {输出的 csv 文件路径} {输入的 geojson 文件路径}
```

(4)csv导入数据库,推荐 `navicat` 可视化导入,`csv`中的`WKT`字段以`text`格式导入

(5)按照需求建`geometry`字段(刚刚导入的`WKT`字段是`text`格式,算是临时字段)

(6)在mysql中执行
```mysql-sql
UPDATE { 表名 } SET { 新建的 geometry 字段 } = ST_GeomFromText(WKT) WHERE 1=1;
```
(7)删除临时字段

(8)更新srid
```mysql-sql
UPDATE { 表名 } SET { 刚才的 geometry 字段 } = GeomFromWKB(aswkb({ 刚才的 geometry 字段 }),{ srid的值 });
```
PS: 假如原来`geojson`中的`srid`是`4326`,经过以上操作之后,数据库存储的`geometry`字段的`srid`展示是0但是实际是`4326`,所以才要更新`srid`
PS: 在一开始的`geojson`中的`srid`就必须是`4326`(现在的方案是从数据库查询出结果然后将查询出的结果转换PBF输出,如果不是`4326`,就需要在内存中转换,考虑到性能因素,现在就必须规定死一开始的geojson中的geometry就是`4326`坐标系,然后转化完之后,数据库存储的必须是`4326`)

查询当前的srid
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


[Express Example Code](src/example/app.ts)


### lint

`sh ./bin/tslint.sh` or  `gulp tslint`

### test

`sh ./bin/test.sh` or  `npm test`


### build

`sh ./bin/build.sh` or  `gulp build` or  `gulp watch-build`