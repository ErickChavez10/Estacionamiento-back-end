function SelPlace(posicion, zona, piso, DATA) {
    const res = DATA.filter((elem) => {
        if (posicion == elem.Posicion && zona == elem.Zona && piso == elem.Piso) {
            elem.sel = !elem.sel;
            return elem;
        }
        return elem;
    });
    return res;
};
//  {Piso: 1, Zona: "A", Posicion: 1, sel: false, user: {_id: '', auto: ''}},
function exist(posicion, zona, piso, DATA, user) {

}
const Parking = require('../models/estacionamiento')
async function liberarEspacio(email, timeStart){
    console.log(email)
    const n = await Parking.findOne({email, timeEnd: null});
    await Parking.findByIdAndUpdate(n._id, {timeEnd: Date.now()})
    console.log(n)
}
module.exports = {SelPlace, exist, liberarEspacio};
