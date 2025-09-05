/*
    @author Gabriele Forner <gabriele.forner@icloud.com>
    @brief This file export a variable representing the connection to a generic
           SQL database server with TypeORM.(By default it will use MySQL, in case
           change SQL_DATABASE_DRIVER env var and install the driver with NPM)

 */
import {DataSource} from "typeorm";
import {User} from "@models/UserModel";
import {
    SQL_DATABASE_DRIVER,
    SQL_DATABASE_HOST, SQL_DATABASE_NAME,
    SQL_DATABASE_PASSWORD,
    SQL_DATABASE_PORT,
    SQL_DATABASE_USERNAME
} from "@utils/CommonStrings";

const sqlDataSource = new DataSource({
    type: SQL_DATABASE_DRIVER as "mysql" | "postgres" | "mssql",
    host: SQL_DATABASE_HOST,
    port: SQL_DATABASE_PORT,
    username: SQL_DATABASE_USERNAME,
    password: SQL_DATABASE_PASSWORD,
    database: SQL_DATABASE_NAME,
    synchronize: true,
    entities: [
        User
    ],
    logging: true,
});

export default sqlDataSource;