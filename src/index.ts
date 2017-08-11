const mysqlp = require('promise-mysql')
const mapnik = require('mapnik')
import * as mysql from 'mysql'
import * as proj4 from 'proj4'
import * as path from 'path'

interface MysqlOptions {
  host: string,
  user: string,
  password: string,
  database: string
}
interface MapOptions {
  table: string,
  layer: string,
  geom: string,
  fields: string[]
}

class MapService {
  public mysqlPool: mysql.IPool
  private conn: any
  private table: string
  private layer: string
  private geom: string
  private fields: string[]
  public initMysql (mysqlOption: MysqlOptions): MapService {
    this.mysqlPool = mysqlp.createPool(mysqlOption)
    return this
  }
  public initMap (serviceOption: MapOptions): void {
    this.table = serviceOption.table
    this.layer = serviceOption.layer
    this.geom = serviceOption.geom
    this.fields = serviceOption.fields
  }
  public async start () {
    let self = this
    // // 查询出 srtext
    this.conn = await this.getMysqlConnection()
    // let result: any = await this.query(`SELECT srtext FROM spatial_ref_sys WHERE srid = 4326`)
    // // GEOGCS["WGS 84",DATUM["WGS_1984",SPHEROID["WGS 84",6378137,298.257223563,AUTHORITY["EPSG","7030"]],AUTHORITY["EPSG","6326"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4326"]]
    // let srtext: string = result[0]['srtext']
    // 根据数据库里面的srid转换为

    mapnik.register_datasource((path.join(mapnik.settings.paths.input_plugins, 'geojson.input')))
  }
  public async getTile (z: number, x: number , y: number ): Promise<Buffer> {
    let vt: any = new mapnik.VectorTile(z, x, y)
    let extent: number[] = vt.extent()
    let firstProjection = `+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs`
    let secondProjection = `+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs`
    let leftDown: any = proj4(firstProjection, secondProjection, [extent[0], extent[1]])
    let rightUp: any = proj4(firstProjection, secondProjection, [extent[2], extent[3]])
    let leftUp: any = proj4(firstProjection, secondProjection, [extent[0], extent[3]])
    let rightDown: any = proj4(firstProjection, secondProjection, [extent[2], extent[1]])
    const coordinates: any = [...leftDown, ...leftUp, ...rightUp, ...rightDown, ...leftDown]
    let polygon = `'POLYGON((
    ${coordinates[0]} ${coordinates[1]},
    ${coordinates[2]} ${coordinates[3]},
    ${coordinates[4]} ${coordinates[5]},
    ${coordinates[6]} ${coordinates[7]},
    ${coordinates[8]} ${coordinates[9]}))'`
    let where = `st_Contains(GeomFromText(${ polygon },4326), ${ this.geom }) or st_overlaps(GeomFromText(${polygon},4326), ${ this.geom })`
    let sql: string = `select ST_AsGeoJSON(${ this.geom }) AS geojson , ${ this.fields.join(',') } FROM ${ this.table }  WHERE ${ where }`
    let result: any = await this.query(sql)

    // 转换结果为 FeatureCollection
    let features: any[] = []
    for (let row of result) {
      let geoJson: any = JSON.parse(row['geojson'])
      let columnGeoInfo: any = {
        'type': 'Feature',
        'properties': row,
        'geometry': geoJson
      }
      features.push(columnGeoInfo)
    }
    let featureCollection: any = {
      'crs': {'type': 'name', 'properties': {'name': 'urn:ogc:def:crs:OGC:1.3:CRS84'}},
      'type': 'FeatureCollection',
      'features': features
    }
    // 现在使用mapnik转换pbf
    return new Promise<Buffer>((resolve, reject) => {

      let vt: any = new mapnik.VectorTile(z, x, y)
      vt.addGeoJSON(JSON.stringify(featureCollection), this.layer , {})
      vt.toGeoJSONSync(0)
      vt.getData({
        compression: 'none',
        level: 9,
        strategy: 'FILTERED'
      }, (err: any, data: Buffer) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }
  private async getMysqlConnection () {
    let self = this
    return new Promise(function (resolve, reject) {
      self.mysqlPool.getConnection(function (err: any, connection: mysql.IConnection) {
        if ( err ) {
          reject(err)
        }else {
          resolve(connection)
        }
      })
    })
  }
  private async query (sql: string) {
    let self = this
    return new Promise(function (resolve, reject) {
      self.conn.query(sql, function (error: any, results: any, fields: any) {
        if ( error ) {
          console.log(error)
          reject(error)
        }else {
          resolve(results)
        }
      })
    })
  }
}

export { MysqlOptions , MapOptions , MapService }
