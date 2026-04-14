import crypto from 'crypto'

function generateResetToken(){
    const rawToken = crypto.randomBytes(24).toString('hex');

    const hashToken = crypto.createHash('sha256').update(rawToken).digest('hex')

    return {rawToken,hashToken}
}

export {generateResetToken}