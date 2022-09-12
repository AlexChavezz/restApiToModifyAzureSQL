const config = {
    server: process.env.SERVER, 
    authentication: {
        type: "default",
        options: {
            userName: process.env.USER, 
            password: process.env.PASSWORD
        }
    }, 
    options: {
        encrypt: true, 
        database: process.env.DBNAME
    }
}

module.exports = config;