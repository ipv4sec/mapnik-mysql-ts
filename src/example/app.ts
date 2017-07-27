
import { MapService , MapOptions , MysqlOptions } from '../'
import { app , express , handler4xxError , handler5xxError } from 'express-core-ts'

let mapService: MapService = new MapService()
let mysqlOptions: MysqlOptions = {
  host: 'localhost',
  user: 'root',
  password: 'passwd',
  database: 'mapnik'
}
let mapOptions: MapOptions = {
  table: 'land',
  layer: 'loli',
  geom: 'geom',
  srid: 4326,
  fields: ['serials_id AS serialsId','id']
}
mapService.initMysql(mysqlOptions).initMap(mapOptions)
//
