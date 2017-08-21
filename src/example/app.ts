
import { MapService , MapOptions , MysqlOptions } from '../'
import { app , express } from 'express-core-ts'

let mapService: MapService = new MapService()
let mysqlOptions: MysqlOptions = {
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USERNAME || 'root',
  password: process.env.MYSQL_PASSWORD || 'passwd',
  database: process.env.MYSQL_DATABASE_NAME || 'mapnik'
}
let mapOptions: MapOptions = {
  table: 'land',
  layer: 'anivia',
  geom: 'geom',
  fields: ['serials_id AS serialsId','id']
}

mapService.initMysql(mysqlOptions).initMap(mapOptions)
mapService.start()

app.use(express.static('res'))
app.use('/map/service/v1/:z/:x/:y' , async function (req,res) {
  try {
    let pbf: Buffer = await mapService.getTile(Number(req.params.z),Number(req.params.x),Number(req.params.y))
    res.end(pbf)
  } catch (err) {
    res.sendStatus(204)
  }

})
app.listen(3000)

