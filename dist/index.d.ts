/// <reference types="node" />
import * as mysql from 'mysql';
interface MysqlOptions {
    host: string;
    user: string;
    password: string;
    database: string;
}
interface MapOptions {
    table: string;
    layer: string;
    geom: string;
    fields: string[];
}
declare class MapService {
    mysqlPool: mysql.IPool;
    private conn;
    private table;
    private layer;
    private geom;
    private fields;
    initMysql(mysqlOption: MysqlOptions): MapService;
    initMap(serviceOption: MapOptions): void;
    start(): Promise<void>;
    getTile(z: number, x: number, y: number): Promise<Buffer>;
    private getMysqlConnection();
    private query(sql);
}
export { MysqlOptions, MapOptions, MapService };
