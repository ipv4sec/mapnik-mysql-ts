const mysqlp = require('promise-mysql')
const mapnik = require('mapnik')
import * as mysql from 'mysql'
import * as proj4 from 'proj4'

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
  fields: string[],
  srid: number
}

class MapService {
  public mysqlPool: mysql.IPool
  private conn: any
  private table: string
  private layer: string
  private geom: string
  private fields: string[]
  private srid: number
  public initMysql (mysqlOption: MysqlOptions): MapService {
    this.mysqlPool = mysqlp.createPool(mysqlOption)
    return this
  }
  public initMap (serviceOption: MapOptions): void {
    this.table = serviceOption.table
    this.layer = serviceOption.layer
    this.geom = serviceOption.geom
    this.fields = serviceOption.fields
    this.srid = serviceOption.srid

  }
  public async start () {
    let self = this
    // 根据 MapService 的参数查询出 srtext
    this.conn = await this.getMysqlConnection()
    let result: any = await this.query(`SELECT srtext FROM spatial_ref_sys WHERE srid = ${ this.srid }`)
    let srtext: string = result[0]['srtext']

    // 转换

  }
  public async getTile (z: number, x: number , y: number ): Promise<Buffer> {
    //  坐标转换
    let vt: any = new mapnik.VectorTile(z, x, y)
    let extent: number[] = vt.extent()

    return await new Buffer('')
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
      self.conn.query(`SELECT srtext FROM spatial_ref_sys WHERE srid = ${ self.srid }`, function (error: any, results: any, fields: any) {
        if ( error ) {
          reject(error)
        }else {
          resolve(results)
        }
      })
    })
  }
}

export { MysqlOptions , MapOptions , MapService }
