const jwt = require('jsonwebtoken')
function crearToken(user, secreta, expiresIn){
	return jwt.sign(
		{ user },
		secreta,
		{expiresIn}
	);
};
module.exports = crearToken;