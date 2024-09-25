
export const DBConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER ||'root',
    port: process.env.DB_PORT || 3306,
    password: process.env.DB_PASS || 'Pigrupo022024',
    database: process.env.DB_NAME || 'sistemacaa',
};

