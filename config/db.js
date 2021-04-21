const mongoose = require('mongoose');

async function connect() {
	try {
		await mongoose.connect(
			`mongodb+srv://ErickChavez:ChavezPass@cluster0.qb8ir.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
			{
				useNewUrlParser: true,
				useUnifiedTopology: true,
				useFindAndModify: false,
				useCreateIndex: true
			}
		);
		console.log('> Database is connected');
	} catch (error) {
		console.log(error);
	}
}

module.exports = connect();


// mongodb+srv://ErickChavez:<password>@cluster0.qb8ir.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
// User: ErickChavez
// Pass: ChavezPass