
import { MapService , MapOptions , MysqlOptions } from '../'
import { app , express } from 'express-core-ts'

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

app.use(express.static('res'))
app.use('/map/service/v1/:z/:x/:y' , async function (req,res) {
  let pbf: any
  try {
    pbf = await mapService.getTile(Number(req.params.z),Number(req.params.x),Number(req.params.y))
  } catch (err) {
    pbf = new Buffer('')
  }
  res.end(pbf)
})
app.listen(3000)

