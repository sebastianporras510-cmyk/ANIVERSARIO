/* ============================================================
   LÓGICA DEL JUEGO
   (la personalización va en config.js, no aquí)
   ============================================================ */

/* ---------- utilidades de pantalla ---------- */
function showScreen(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}
function openModal(id){ document.getElementById(id).classList.add('active'); }
function closeModal(id){ document.getElementById(id).classList.remove('active'); }

/* ---------- helper: dibuja un avatar (emoji o foto) dentro de un contenedor ---------- */
function renderAvatar(container, avatarConfig, extraClass){
  container.innerHTML = '';
  if(avatarConfig && avatarConfig.type === 'image' && avatarConfig.value){
    const img = document.createElement('img');
    img.className = 'avatar-photo' + (extraClass ? ' ' + extraClass : '');
    img.src = avatarConfig.value;
    img.alt = 'Avatar';
    img.onerror = function(){
      // si la foto no carga, cae de vuelta a un emoji por defecto
      container.innerHTML = '';
      const span = document.createElement('span');
      span.className = 'avatar-emoji';
      span.textContent = '💗';
      container.appendChild(span);
    };
    container.appendChild(img);
  } else {
    const span = document.createElement('span');
    span.className = 'avatar-emoji';
    span.textContent = (avatarConfig && avatarConfig.value) ? avatarConfig.value : '💗';
    container.appendChild(span);
  }
}

/* ---------- partículas flotantes de fondo ---------- */
(function initParticles(){
  const container = document.getElementById('particles');
  const symbols = ['💗','🌸','✨','💮','🤍'];
  const count = 18;
  for(let i=0;i<count;i++){
    const el = document.createElement('span');
    el.textContent = symbols[Math.floor(Math.random()*symbols.length)];
    el.style.left = Math.random()*100 + 'vw';
    el.style.animationDuration = (10 + Math.random()*12) + 's';
    el.style.animationDelay = (Math.random()*12) + 's';
    el.style.fontSize = (0.9 + Math.random()*0.9) + 'rem';
    container.appendChild(el);
  }
})();

/* ============================================================
   PANTALLA 1 — Bienvenida
   ============================================================ */
const btnYes = document.getElementById('btnYes');
const btnNo = document.getElementById('btnNo');
let noScale = 1;

btnYes.addEventListener('click', ()=> showScreen('screen-test'));

btnNo.addEventListener('click', ()=>{
  noScale *= 0.75;
  btnNo.style.transform = `scale(${noScale})`;
  btnNo.style.opacity = Math.max(noScale, 0.05);
  if(noScale < 0.08){
    btnNo.style.pointerEvents = 'none';
  }
});

/* ============================================================
   PANTALLA 2 — La prueba de fuego
   ============================================================ */
const dateInput = document.getElementById('dateInput');
const dateHint = document.getElementById('dateHint');
const btnSend = document.getElementById('btnSend');

dateInput.addEventListener('input', ()=>{
  let digits = dateInput.value.replace(/\D/g,'').slice(0,6);
  let formatted = digits;
  if(digits.length > 4) formatted = digits.slice(0,2) + '/' + digits.slice(2,4) + '/' + digits.slice(4);
  else if(digits.length > 2) formatted = digits.slice(0,2) + '/' + digits.slice(2);
  dateInput.value = formatted;
});

btnSend.addEventListener('click', ()=>{
  const value = dateInput.value.trim();
  if(value === CONFIG.anniversaryDate){
    dateHint.textContent = '';
    showScreen('screen-maze');
    initMazeIfNeeded();
  } else {
    dateHint.textContent = '¡Ups! Inténtalo de nuevo ❤️';
    dateInput.style.borderColor = 'var(--red-dark)';
    setTimeout(()=>{ dateInput.style.borderColor = 'var(--ink)'; }, 900);
  }
});

/* ============================================================
   PANTALLA 3 — El Laberinto (estilo bloques / ladrillos)
   ============================================================ */
const ROOMS = 6;                 // nº de "habitaciones" por lado
const DIM = ROOMS * 2 + 1;       // dimensión total de la cuadrícula (incluye paredes)
let grid = [];                   // 1 = pared, 0 = camino
let roomVisited = [];
let playerRoom = {r:0, c:0};
let goalRoom = {r:ROOMS-1, c:ROOMS-1};
let giftRooms = [];              // posiciones (en coords de habitación) de los 5 obsequios
let giftCollected = [];          // estado de cada obsequio
let mazeInitialized = false;
let cellSize = 30;

function toGrid(room){ return { r: room.r*2+1, c: room.c*2+1 }; }

function shuffle(arr){
  for(let i=arr.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]] = [arr[j],arr[i]];
  }
  return arr;
}

function generateMaze(){
  grid = Array.from({length:DIM}, ()=> Array(DIM).fill(1));
  roomVisited = Array.from({length:ROOMS}, ()=> Array(ROOMS).fill(false));

  function carve(r,c){
    roomVisited[r][c] = true;
    grid[r*2+1][c*2+1] = 0;
    const dirs = shuffle([[0,1],[0,-1],[1,0],[-1,0]]);
    for(const [dr,dc] of dirs){
      const nr = r+dr, nc = c+dc;
      if(nr>=0 && nr<ROOMS && nc>=0 && nc<ROOMS && !roomVisited[nr][nc]){
        grid[r*2+1+dr][c*2+1+dc] = 0; // tumba la pared entre habitaciones
        carve(nr,nc);
      }
    }
  }
  carve(0,0);
}

// BFS sobre habitaciones para hallar el camino solución
function solveRoomPath(){
  const visited = Array.from({length:ROOMS}, ()=> Array(ROOMS).fill(false));
  const prev = Array.from({length:ROOMS}, ()=> Array(ROOMS).fill(null));
  const queue = [{r:0,c:0}];
  visited[0][0] = true;
  while(queue.length){
    const {r,c} = queue.shift();
    if(r===goalRoom.r && c===goalRoom.c) break;
    const options = [[0,1],[0,-1],[1,0],[-1,0]];
    for(const [dr,dc] of options){
      const nr=r+dr, nc=c+dc;
      if(nr<0||nr>=ROOMS||nc<0||nc>=ROOMS) continue;
      if(visited[nr][nc]) continue;
      const wallR = r*2+1 + dr, wallC = c*2+1 + dc;
      if(grid[wallR][wallC] === 1) continue; // hay pared, no se puede pasar
      visited[nr][nc] = true;
      prev[nr][nc] = {r,c};
      queue.push({r:nr,c:nc});
    }
  }
  const path = [];
  let cur = goalRoom;
  while(cur){
    path.push(cur);
    cur = prev[cur.r][cur.c];
  }
  path.reverse();
  return path;
}

function pickGiftRooms(path){
  const count = CONFIG.gifts.length; // 5 obsequios
  const usable = path.slice(1, path.length-1); // sin contar inicio ni meta
  const positions = [];
  if(usable.length >= count){
    for(let i=0;i<count;i++){
      const idx = Math.floor((usable.length * (i+1)) / (count+1));
      positions.push(usable[Math.max(0, Math.min(usable.length-1, idx))]);
    }
  } else {
    // si el camino es muy corto, repartimos lo mejor posible
    for(let i=0;i<count;i++){
      positions.push(usable[i % Math.max(usable.length,1)] || path[0]);
    }
  }
  return positions;
}

function pickDecorativeHearts(path, giftRooms){
  // corazones puramente decorativos sobre algunas celdas de camino libres
  const used = new Set([`${0}-${0}`, `${goalRoom.r}-${goalRoom.c}`]);
  giftRooms.forEach(g => used.add(`${g.r}-${g.c}`));
  const candidates = [];
  for(let r=0;r<ROOMS;r++){
    for(let c=0;c<ROOMS;c++){
      if(grid[r*2+1][c*2+1] === 0 && !used.has(`${r}-${c}`)) candidates.push({r,c});
    }
  }
  shuffle(candidates);
  return candidates.slice(0, Math.min(4, candidates.length));
}

function buildMazeDOM(){
  const gridEl = document.getElementById('mazeGrid');
  gridEl.innerHTML = '';
  const wrapWidth = Math.min(340, window.innerWidth - 56);
  cellSize = Math.floor(wrapWidth / DIM);
  gridEl.style.gridTemplateColumns = `repeat(${DIM}, ${cellSize}px)`;
  gridEl.style.gridTemplateRows = `repeat(${DIM}, ${cellSize}px)`;
  gridEl.style.width = (cellSize*DIM) + 'px';
  gridEl.style.height = (cellSize*DIM) + 'px';

  for(let r=0;r<DIM;r++){
    for(let c=0;c<DIM;c++){
      const div = document.createElement('div');
      div.className = 'cell ' + (grid[r][c] === 1 ? 'wall' : 'path');
      div.id = `cell-${r}-${c}`;
      gridEl.appendChild(div);
    }
  }

  // meta (avatar del novio/a según config)
  const goalGrid = toGrid(goalRoom);
  const goalCell = document.getElementById(`cell-${goalGrid.r}-${goalGrid.c}`);
  const goalIcon = document.createElement('div');
  goalIcon.className = 'icon';
  renderAvatar(goalIcon, CONFIG.groomAvatar);
  goalCell.appendChild(goalIcon);

  // obsequios
  giftRooms.forEach((room, i)=>{
    const g = toGrid(room);
    const cell = document.getElementById(`cell-${g.r}-${g.c}`);
    const icon = document.createElement('div');
    icon.className = 'icon';
    icon.id = `iconGift${i}`;
    icon.textContent = CONFIG.gifts[i].icon || '🎁';
    cell.appendChild(icon);
  });

  // corazones decorativos
  const decoHearts = pickDecorativeHearts(null, giftRooms);
  decoHearts.forEach(room=>{
    const g = toGrid(room);
    const cell = document.getElementById(`cell-${g.r}-${g.c}`);
    const deco = document.createElement('div');
    deco.className = 'deco-heart';
    deco.textContent = Math.random() > 0.5 ? '💕' : '✨';
    cell.appendChild(deco);
  });

  // jugador
  const player = document.createElement('div');
  player.id = 'player';
  player.style.width = cellSize+'px';
  player.style.height = cellSize+'px';
  renderAvatar(player, CONFIG.brideAvatar);
  gridEl.appendChild(player);
  updatePlayerPosition(true);
  updateGiftCounter();
}

function updatePlayerPosition(instant){
  const player = document.getElementById('player');
  const g = toGrid(playerRoom);
  if(instant){ player.style.transition = 'none'; }
  player.style.left = (g.c * cellSize) + 'px';
  player.style.top = (g.r * cellSize) + 'px';
  if(instant){ requestAnimationFrame(()=>{ player.style.transition=''; }); }
}

function updateGiftCounter(){
  const collected = giftCollected.filter(Boolean).length;
  const counterEl = document.getElementById('giftCounter');
  if(counterEl) counterEl.textContent = `${collected}/${CONFIG.gifts.length}`;
}

function canMove(dr,dc){
  const nr = playerRoom.r + dr, nc = playerRoom.c + dc;
  if(nr<0||nr>=ROOMS||nc<0||nc>=ROOMS) return false;
  const g = toGrid(playerRoom);
  const wallR = g.r + dr, wallC = g.c + dc;
  return grid[wallR][wallC] === 0;
}

function movePlayer(dir){
  let dr=0, dc=0;
  if(dir==='top') dr=-1;
  else if(dir==='bottom') dr=1;
  else if(dir==='left') dc=-1;
  else if(dir==='right') dc=1;
  if(!canMove(dr,dc)) return;
  playerRoom = { r: playerRoom.r+dr, c: playerRoom.c+dc };
  updatePlayerPosition(false);
  checkTileEvents();
}

function checkTileEvents(){
  // obsequios
  for(let i=0;i<giftRooms.length;i++){
    const room = giftRooms[i];
    if(!giftCollected[i] && playerRoom.r===room.r && playerRoom.c===room.c){
      giftCollected[i] = true;
      const icon = document.getElementById(`iconGift${i}`);
      if(icon) icon.classList.add('collected');
      updateGiftCounter();
      setTimeout(()=> openGiftModal(i), 180);
      return;
    }
  }
  // meta
  if(playerRoom.r===goalRoom.r && playerRoom.c===goalRoom.c){
    setTimeout(()=> openModal('modalWin'), 180);
  }
}

function openGiftModal(i){
  const gift = CONFIG.gifts[i];
  document.getElementById('giftTitle').textContent = gift.title;
  document.getElementById('giftText').textContent = gift.text;
  const photo = document.getElementById('giftPhoto');
  if(gift.image){
    photo.src = gift.image;
    photo.style.display = '';
  } else {
    photo.style.display = 'none';
  }
  openModal('modalGift');
}

function initMazeIfNeeded(){
  if(mazeInitialized) return;
  mazeInitialized = true;
  generateMaze();
  const path = solveRoomPath();
  giftRooms = pickGiftRooms(path);
  giftCollected = new Array(CONFIG.gifts.length).fill(false);
  playerRoom = {r:0,c:0};
  buildMazeDOM();
}

/* controles: botones en pantalla */
document.getElementById('dUp').addEventListener('click', ()=> movePlayer('top'));
document.getElementById('dDown').addEventListener('click', ()=> movePlayer('bottom'));
document.getElementById('dLeft').addEventListener('click', ()=> movePlayer('left'));
document.getElementById('dRight').addEventListener('click', ()=> movePlayer('right'));

/* controles: teclado */
document.addEventListener('keydown', (e)=>{
  if(!document.getElementById('screen-maze').classList.contains('active')) return;
  if(e.key === 'ArrowUp') movePlayer('top');
  else if(e.key === 'ArrowDown') movePlayer('bottom');
  else if(e.key === 'ArrowLeft') movePlayer('left');
  else if(e.key === 'ArrowRight') movePlayer('right');
});

/* cerrar modal de obsequio */
document.getElementById('closeGift').addEventListener('click', ()=> closeModal('modalGift'));

/* ============================================================
   PANTALLA 4 — Ganaste + Sorpresa final
   ============================================================ */
document.getElementById('btnSeeSurprise').addEventListener('click', ()=>{
  closeModal('modalWin');
  showScreen('screen-final');
  document.getElementById('finalPhoto').src = CONFIG.finalPhotoSrc;
  document.querySelector('#finalVideo source').src = CONFIG.videoSrc;
  document.getElementById('finalVideo').load();
});

/* recalcular tamaño del laberinto si cambia el viewport */
window.addEventListener('resize', ()=>{
  if(mazeInitialized) buildMazeDOM();
});
