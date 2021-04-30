const jwt = require('jsonwebtoken')
function crearToken(user, secreta, expiresIn){
	return jwt.sign(
		{ user },
		secreta,
		{expiresIn}
	);
};


function desifraToken(token) {
	return jwt.decode(token, true);
}

module.exports = {crearToken, desifraToken};