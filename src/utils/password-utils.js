import bcrypt from 'bcryptjs'

const hashPassword = async(password)=>{
    return await bcrypt.hash(password,8)
}

const comparePassword = async(clearTextPassword,hashedPassword)=>{
    return await bcrypt.compare(clearTextPassword,hashedPassword);
}

export {hashPassword,comparePassword}