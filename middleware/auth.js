const jwt = require('jsonwebtoken')


module.exports = function (req, res, next) {
    const token = req.header('auth-token')
    if (!token) return res.status(401).send('Unauthorized!')

    try {
        const decoded = jwt.verify(token, '12345me')
        req.user = decoded
        // console.log(req.user);
        
        next()
    } catch (error) {
        res.status(400).send('Invalid token')
    }
}