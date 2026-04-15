import pg from "pg";

// Equivalent to mongoose connection
// Pool is nothing but group of connections
// If you pick one connection out of the pool and release it
// the pooler will keep that connection open for sometime to other clients to reuse
const pool = new pg.Pool({
    host: "localhost",
    port: 5432,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASS,
    database: "postgres",
    max: 20,
    connectionTimeoutMillis: 0,
    idleTimeoutMillis: 0,
});


export default pool;
