import mysql from "mysql2";

export type LockDatum = {
    objectName: string;
    lockType: string;
    lockMode: string;
    lockData: string;
}
export type Table = {
    tableName: string;
    tableHead: string[];
    tableData: string[][];
}

type dbConfig = {
    host: string;
    port: number;
    database: string;
    user: string;
    password: string;
};

export default class DB {
    private connection: mysql.Connection;
    private database = '';
    constructor(host: string, port: number, database: string, user: string, password: string) {
        const config:dbConfig = {
            host: host,
            port: port,
            database: database,
            user: user,
            password: password,
        };
        this.connection = mysql.createConnection(config);
        this.database = database;
    }

    public getLockData(): Promise<LockDatum[]> {
        return new Promise((resolve, reject) => {
            this.connection.query('use performance_schema');
            this.connection.query(
                'SELECT * FROM `data_locks`',
                function(err, results) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    const lockData: LockDatum[] = [];
                    if (results instanceof Array) {
                        results.map((result: any) => {
                            const lockDatum = {
                                objectName: result.OBJECT_NAME,
                                lockType: result.LOCK_TYPE,
                                lockMode: result.LOCK_MODE,
                                lockData: result.LOCK_DATA,
                            };
                            lockData.push(lockDatum);
                        });
                    }
                    resolve(lockData);
                }
            );
        });
    }
    // @ts-ignore
    public getTable(tableName :string): Promise<Table>{
        return new Promise((resolve, reject) => {
            this.connection.query('use ' + this.database);
                this.connection.query(
                    'SELECT * FROM' +  '`' + tableName + '`',
                    function (err, results) {
                        if (results instanceof Array) {
                            const tableHead: string[] = [];
                            const tableData: string[][] = [];
                            results.map((result: any) => {
                                const tableDatum: string[] = [];
                                for (const key in result) {
                                    if (result.hasOwnProperty(key)) {
                                        const element = result[key];
                                        if (tableHead.indexOf(key) === -1) {
                                            tableHead.push(key);
                                        }
                                        tableDatum.push(element);
                                    }
                                }
                                tableData.push(tableDatum);
                            });
                            const table: Table = {
                                tableName: tableName,
                                tableHead: tableHead,
                                tableData: tableData,
                            };
                            resolve(table);
                        }
                    })
            }
        )
    }
}

