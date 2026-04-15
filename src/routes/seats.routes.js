import {Router} from 'express';
import pool from '../config/db.js'
import authenticate from '../middlewares/authenticate.middleware.js';
import ApiResponse from '../utils/api-response.js'
import ApiError from '../utils/api-error.js';

const router = Router();

//get all seats
router.get("/all", async (req, res) => {
    const sqlQurey = `
    select 
    s.*,u.name 
    from seats as s
    left join users as u
    on s.user_id = u.id
    `
    const result = await pool.query(sqlQurey); // equivalent to Seats.find() in mongoose
    ApiResponse.ok(res,"fetched all seats.",{seats:result.rows})
});

//book a seat give the seatId and your name

router.put("/book/:id",authenticate, async (req, res) => {
    try {
        const id = req.params.id;
        const user_id = req.user.id;
        // payment integration should be here
        // verify payment
        const conn = await pool.connect(); // pick a connection from the pool
        //begin transaction
        // KEEP THE TRANSACTION AS SMALL AS POSSIBLE
        await conn.query("BEGIN");
        //getting the row to make sure it is not booked
        /// $1 is a variable which we are passing in the array as the second parameter of query function,
        // Why do we use $1? -> this is to avoid SQL INJECTION
        // (If you do ${id} directly in the query string,
        // then it can be manipulated by the user to execute malicious SQL code)
        const sql = "SELECT * FROM seats where id = $1 and isbooked = 0 FOR UPDATE";
        const result = await conn.query(sql, [id]);

        //if no rows found then the operation should fail can't book
        // This shows we Do not have the current seat available for booking
        if (result.rowCount === 0) {
            ApiError.conflict("Seat already booked")
            return;
        }
        //if we get the row, we are safe to update
        const sqlU = "update seats set isbooked = 1, user_id = $2 where id = $1";
        const updateResult = await conn.query(sqlU, [id, user_id]); // Again to avoid SQL INJECTION we are using $1 and $2 as placeholders

        //end transaction by committing
        await conn.query("COMMIT");
        conn.release(); // release the connection back to the pool (so we do not keep the connection open unnecessarily)
        ApiResponse.ok(res,"seat booked successfully.",{user: req.user,seat:result.rows[0]});
    } catch (ex) {
        console.log(ex);
        res.status(500).send("Internal Server Error");
    }
});


export default router;