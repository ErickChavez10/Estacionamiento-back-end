
let time = new Date();
console.log(time);
setTimeout(() => {
    setInterval(() => {
        let time2 = new Date();
        console.log(time2);
        let timeF = time2.getTime() - time.getTime();
        let diaEnMilisegundos = 1000 * 60 * 60 * 24;
        let res = timeF + diaEnMilisegundos;
        let fecha = new Date(res);
        console.log(fecha.getHours() + ':' + fecha.getMinutes() + '.' + fecha.getSeconds());
    }, 1000);
}, 5000);