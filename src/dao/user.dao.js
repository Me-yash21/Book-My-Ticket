import pool  from '../config/db.js'
import ApiError from '../utils/api-error.js'

const createUser = async (name,email,password) =>{

    const conn = await pool.connect(); // pick a connection from the pool ,
    const sqlQurey = 'INSERT INTO TABLE users(name,email,password) VALUES ($1,$2,$3)';
    const userResult = await conn.query(sqlQurey,[name,email,password])

    const user = await conn.query('select * from user where email = $1',[email])
    conn.release();
    return user.rows[0];
}

const findUserById = async(userId,selectOption = {})=>{
    const conn = await pool.connect();
    const sqlQurey = 'select * from users where id = $1';
    const user = await conn.query(sqlQurey,[userId]);
    
    conn.release();

    if(user.rowCount === 0){
        return null;
    }
    const userObj = user.rows[0];
    // delete the values from userObject,if selectOption key is false .
    // *for Example : if selectOption = {password: 0 }, then 
    // * delete the object.password.
    for(const property in selectOption){
        if(!selectOption[property]){
            delete userObj.property
        }
    }

    return userObj
}

const findOne = async(filter = {} ,selectOption = {})=>{
    const conn = await pool.connect();

    // return null if no key-value in filter.
    if(Object.keys(filter).length === 0){
        return null
    }
    
    const filterKeyValues = Object.entries(filter);
    const filterQurey = filterKeyValues.map((keyValue)=>{
        return `${keyValue[0]} = ${keyValue[1]}` //e.g. email = 'example@test.com'
    }).join(" AND ");
    const sqlQurey = `select * from users where ${filterQurey}`;
    const user = await conn.query(sqlQurey);

    conn.release();

    if(user.rowCount === 0){
        return null;
    }
    const userObj = user.rows[0];
    
    // delete the values from userObject,if selectOption key is false .
    // *for Example : if selectOption = {password: 0 }, then 
    // * delete the object.password.
    for(const property in selectOption){
        if(!selectOption[property]){
            delete userObj.property
        }
    }

    return userObj
}


const setRefreshToken = async(userId,refreshToken)=>{
    const conn = await pool.connect();
    const sqlQurey = 'update users set refresh_token = $2 where id = $1';

    const result = await conn.query(sqlQurey,[userId,refreshToken])
    conn.release();
}

const setVerificationToken = async(userId,verification_token)=>{
    const conn = await pool.connect();
    const sqlQurey = 'update users set verification_token = $2 where id = $1';

    const result = await conn.query(sqlQurey,[userId,verification_token])
    conn.release();
}

const setResetPasswordToken = async (userId,resetPasswordToken) =>{
    const conn = await pool.connect();
    const sqlQurey = `
    update users 
    set reset_password_token = $2,
        reset_password_expiry = ${new Date(Date.now() + 15 * 60 * 1000 )}
    where id = $1`;

    const result = await conn.query(sqlQurey,[userId,resetPasswordToken])
    conn.release();
}

const changePassword = async (userId, newPassword)=>{
    const conn = await pool.connect();
    const sqlQurey = 'update users set password = $2 where id = $1';

    const result = await conn.query(sqlQurey,[userId,newPassword])
    conn.release();
}

export {
    createUser,
    findUserById,
    findOne,
    setRefreshToken,
    setVerificationToken,
    setResetPasswordToken,
    changePassword

}