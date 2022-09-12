const { Connection, Request, TYPES } = require("tedious");
const config = require("../db/dbSettings");

function getAllTable(req, res) {
    const connection = new Connection(config);
    connection.on("connect", (error) => {
        if (error) {
            console.log("500 error")
            res.status(500).json({
                ok: false,
                msg: "Internal server error"
            });
            connection.close();
        }
        const request = new Request("SELECT * FROM users", (error, rowCount, rows) => {
            if (error) {
                console.log("request error")
                res.status(400).json({
                    ok: true,
                    status: "bad request"
                });
            }
        });
        let users = [];
        let currentUser = {};
        request.on("row", (columns) => {
            columns.forEach((column, index) => {
                currentUser[column.metadata.colName] = column.value;
            });
            users = [...users, currentUser];
            currentUser = {};
        });
        request.on("requestCompleted", () => {
            res.status(200).json(users);
            console.log(users);
            connection.close();
        })
        connection.execSql(request);

    });
    connection.connect();
}


function pushNewUser(req, res) {
    const { name, email, isMarried } = req.body;
    console.log(isMarried);
    const connection = new Connection(config);
    connection.on("connect", (error) => {
        if (error) {
            res.status(500).json({
                ok: true,
                status: "Internal server Error"
            });
        }
        const request = new Request("INSERT INTO users (name, email, isMarried) VALUES (@name, @email, @isMarried);", (error) => {
            if (error) {
                console.log(error)
                res.status(400).json({
                    ok: true,
                    status: "bad request"
                });
            }
        });
        request.addParameter("isMarried", TYPES.Bit, isMarried);
        request.addParameter("name", TYPES.NVarChar, name);
        request.addParameter("email", TYPES.NVarChar, email);
        let id;
        request.on("row", (columns) => {
            columns.forEach(column => {
                if (column.value === NULL) {
                    res.status(200).json({
                        ok: true,
                        status: "empty"
                    })
                }
                else {
                    id = column.value;
                }
            })
        });
        request.on("requestCompleted", () => {
            res.status(200).json({
                ok: true,
                id,
                status: "record insert correctly",
            })
            connection.close();
        })
        connection.execSql(request);
    });
    connection.connect();
}

module.exports = {
    getAllTable,
    pushNewUser
}