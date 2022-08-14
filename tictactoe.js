const cells = document.querySelectorAll('.cell');

// 1. Kezdőjátékos megadása, aktuális jel
let currentPlayer = 'cross'
let crossMarks = []
let circleMarks = []

const infoPanel = document.querySelector('.information');
const startingInfo = () => infoPanel.innerHTML = "Az X játékos kezd.";

// 2. Aktuális jel elhelyezése cellában - kattintásra cella class módosítása, de csak egyszer
(addListener = () => {
    cells.forEach(item =>
        item.addEventListener('click', placeMarker, { once: true }));
})();

// 3. Lépés utáni teendők: Van-e győztes? Forduló léptetése.

let checker = () => {
    if (fullBoard() && !isThereAWinner()) {
        infoPanel.innerHTML = "Döntetlen.";
    } else if (isThereAWinner()) {
        announceWinner();
        resetListener();
    } else {
        switchPlayers();
        whoseTurnIsIt();
    }
};

let winConditions = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7],
];

const fullBoard = () => {
    if ((crossMarks.length + circleMarks.length) == 9) {
        return true
    }
};

const isThereAWinner = () =>
    winConditions.some(combination =>
        combination.every(n => marksForChecking(n)));

const announceWinner = () => {
    if (currentPlayer == 'cross') {
        infoPanel.innerHTML = "Az X nyert."
    } else {
        infoPanel.innerHTML = "A O nyert.";
    }
};

const marksForChecking = (n) => (currentPlayer == 'cross')
    ? crossMarks.includes(n)
    : circleMarks.includes(n);

const switchPlayers = () => (currentPlayer == 'cross')
    ? currentPlayer = 'circle'
    : currentPlayer = 'cross';

const whoseTurnIsIt = () => {
    if (currentPlayer == 'cross') {
        infoPanel.innerHTML = "Az X játékos lépése jön."
    } else {
        infoPanel.innerHTML = "A O játékos lépése jön.";
    }
};

// Egy forduló
function placeMarker() {
    this.classList.add(currentPlayer);
    if (currentPlayer == 'cross') {
        crossMarks.push(parseInt(this.getAttribute('id')));
    } else {
        circleMarks.push(parseInt(this.getAttribute('id')));
    }
    checker();
};

// Játék vége, tábla törlése

const resetGame = () => {
    clearBoard();
    clearMarkCollectors();
    resetListener();
    addListener();
    startingInfo();
    currentPlayer = 'cross';
}

const clearBoard = () => {
    cells.forEach(item =>
        item.classList.remove('cross', 'circle'))
}

const clearMarkCollectors = () => { crossMarks = []; circleMarks = [] };

const resetListener = () => {
    cells.forEach(item => item.removeEventListener('click', placeMarker))
}

const button = document.getElementsByClassName('button__restart')[0];
button.addEventListener('click', resetGame);


/* ----------------------------------------------------------------------------

Ötletelés algoritmusra nagyobb tábla esetére:

vizsgálóPoz - hol, melyik cellánál jár a vizsgálat
sorHossz - milyen hosszú a táblázat tetszőlegesen megadott sora
egyezésSzám - hány elemnek kell egyeznie a győzelemhez.


I. MEGOLDÁS - összes cella vizsgálata sorjában

1. Tegyük fel az utolsó lépés X

2. Induljon el a tábla elejéről. Ha talál egy X-elemet, ellenőrízze, hogy

2A. Oszlop: vizsgálóPoz + sorHossz*1 pozícióban lévő elem X? igen: vizsgálóPoz+sorHossz*2 helyen lévő elem x?--- stb

2B. Átló1: vizsgálóPoz + sorHossz+1 pozícióban lévő elem X? igen: vizsgálóPoz+sorhossz*2 + 2... stb

2C. Átló2: vizsgálóPoz-sorhossz+1 pozícióban lévő elem x? igen vizsgálóPoz-sorhossz*2 +2... stb

2D. Sor: 'A következő elem X?' igen: A következő elem X? igen: ... stb Ismétlés egyezésSzám-1-szer. 

Ha bármelyik esetben nem, vagy hibába fut (pl: tábla széleinél) akkor folytassa a következő vizsgálattal, 
az utolsó vizsgálat esetén pedig állítsa át a vizsgálóPoz-t a következő cellára. Repat. 
(Ismétlésszámot illetően lásd a következő megoldást.)


II. MEGOLDÁS
Nem az összes cellán megy végig, hanem csak az utolsó elhelyezett elem környezetét vizsgálja
példa: 5 egyezzzen

Feltételezés: Ez egy oszlopos szekvencia () - for loop - 
léptetés addig, amíg az iterátor = egyezésSzám - 1 
iterátor = 0;

Kérdés: Lefelé 4 másik egyezik? - 
vizsgálatok száma lefelé: egyezésSzám(5) - i(0) - 1, 
felfelé: i(0) = 0

Kérdés: Lefelé 3 másik és 1 felfelé egyezik? - 
lefelé: egyezésSzám(5) - i(1) - 1), 
felfelé: i(1)

Kérdés: Lefelé 2 másik és 2 felfelé? - 
lefelé: egyezésSzám(5) - i(2) - 1, 
felfelé: i(2)

Kérdés: Lefelé 1 másik és 3 felfelé? - 
lefelé: egyezésSzám(5) - i(3) - 1 =
felfelé: i(3)

Kérdés: Felfelé 4 másik egyezik?: 
lefelé:egyezésSzám(5) - i(4) - 1 = 0
felfelé: i(4)

Ugyanezeket végigzongorázni Átló1, Átló2 és Sor esetekre is.


még kiszűrendő hiba: táblázat széleinél pl. sor végén a következő sor elejét figyelné.
Előtte feltételes vizsgálat ezekre az esetekre?


III. MEGOLDÁS
Utolsó elhelyezett elemtől függően módosuljanak a megoldásTömb számai (legenerálás relatív viszonyok alapján) 
majd gyűjtse össze, hogy az utolsó elhelyezett elem mikrokörnyezetében hol vannak az aktuális játékos elemei.
Hasonlítsa össze a kettőt és ha talál egyezést: győzelem!

pl.: 3 egyező elem kell, egy 10es sorhosszú táblában

készítünk egy megoldásSegédTömb-öt is még, amiben:
-1*egyezésSzám-1-tól egyezésSzám-1-ig legenerálunk egy számsort (3 esetén [-2,-1,0,1,2])


utána ennek segítségével létrehozunk újabb tömböket:

sor: vizsgálóPoz + megoldásSegédTömb[0], vizsgálóPoz + megoldásSegédTömb[1]... stb.

oszlop: vizsgálóPoz + sorHossz * megoldásSegédTömb[0], vizsgálóPoz+sorHossz * megoldásSegédTömb[1]... stb.

átló1: vizsgálóPoz + (sorHossz+1) * megoldásSegédTömb[0], vizsgálóPoz + (sorHossz+1) * megoldásSegédTömb[1]... stb 

átló2: vizsgálóPoz + (sorHossz-1) * megoldásSegédTömb[0], vizsgálóPoz + (sorHossz-1) * megoldásSegédTömb[1]... stb 


hiba: a táblázat széleinél itt is átfut a vizsgálat a következő sorba, a táblázat túloldalára...


Ezeken belül meghatározzuk a győztes kombinációkat:
pl: ha vizsgálóPoz = 58

sorTömb = [56, 57, 58, 59, 60]
megoldásTömb = [
    [56,57,58],
    [57,58,59],
    [58,59,60],
]

loop: Lépkedjen előre a sorTömb-ben és készítsen egy új tömböt egyezésSzám-nyi elemmel (itt most pl. 3).
Addig csinálja, amíg az (iterátor - egyezésSzám - 1) elemhez nem ér. (itt most pl. 58)
vizsgálat végeztével törölje a megoldásTömb tartalmát.


. . . hmm......

IV. MEGOLDÁS
Játék elején egy HATALMAS megoldásTömb legenerálása a megadott változók alapján (sorHossz és egyezésSzám) 
és a játékosok jeleinek folyamatos gyűjtése két másik tömbben. Ha egyezést talál a kettő között = győzelem.

... persze továbbra is megoldást kell még találni a táblázat szélein átfutó szekvenciákra...

*/