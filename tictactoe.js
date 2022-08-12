const cells = document.querySelectorAll('.cell');

// 1. Kezdőjátékos megadása, aktuális jel
let currentPlayer = 'cross'

let logThis = () => { console.log(this) }

// 2. Aktuális jel elhelyezése cellában - kattintásra cella class módosítása, de csak egyszer
(addListener = () => {
    cells.forEach(item => 
        item.addEventListener('click', placeMarker, { once: true }));
})();

// 3. Van-e győztes? - győztes események meghatározása, aktuális táblában van-e olyan ami valamelyikkel egyezik?

// 4. Döntetlen? - minden cella tele és nincs győztes

// 5. Forduló átadása, jel módosítása

function placeMarker() {
    this.classList.add(currentPlayer); switchPlayers();
};

const switchPlayers = () => {
    if (currentPlayer == 'cross') {
        currentPlayer = 'circle';
    } else { currentPlayer = 'cross'; }
}

// 6. Végeredmény kiírása (modalban?) -

// 7. Játék újraindítása, gombhoz rendelése
resetListener = () => {
    cells.forEach(item => item.removeEventListener('click', placeMarker))}

const clearBoard = () => {cells.forEach(item => 
    item.classList.remove('cross', 'circle')); 
    resetListener(); 
    addListener();
    currentPlayer = 'cross';
}

const button = document.getElementsByClassName('button__restart')[0];
button.addEventListener('click', clearBoard);
