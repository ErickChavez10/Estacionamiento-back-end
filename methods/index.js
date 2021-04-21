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

module.exports = SelPlace;
