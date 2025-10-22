const anaMenu = document.getElementById("anaMenu");
const oynaBtn = document.getElementById("oynaBtn");
const hazirlayanlarBtn = document.getElementById("hazirlayanlarBtn");
const oyun = document.getElementById("oyun");
const karakter = document.getElementById("karakter");
const puanYazi = document.getElementById("puan");
const puanBox = document.getElementById("puanBox");
const tekrarBtn = document.getElementById("tekrar");
const anaMenuBtn = document.getElementById("anaMenuBtn");
const kalpKirilma = new Audio("assets/kalpkirilma.flac");

// Meyve toplama sesleri
const meyveSesleri = [
  new Audio("assets/iya1.flac"),
  new Audio("assets/iya2.flac"),
  new Audio("assets/iya3.flac")
];

// Kaybetme sesleri
const kaybetSes1 = new Audio("assets/ahh1.flac");
const kaybetSes2 = new Audio("assets/ahh2.flac");
const nadirKaybet = new Audio("assets/hevalessedinleme.flac");

// Buton tıklama sesi
const tiklama = new Audio("assets/tiklama.mp3");


const meyveListesi = [
  "assets/kabak.png",
  "assets/patates.png",
  "assets/domates.png",
  "assets/patates.png",
  "assets/sogan.png"
];

let puan = 0;
let kacirilan = 0;
let oyunBitti = false;
let karakterX = window.innerWidth / 2 - 50;
let can = 3; // toplam can
const kalpler = document.querySelectorAll("#canKutusu .kalp");

// Can azaltma fonksiyonu
function canAzalt() {
  if (can > 0) {
    can--;
    kalpler[can].src = "assets/kirikkalp.png";
    kalpKirilma.play();
  }

  
  if (can === 0) {
    if (Math.random() < 0.001) { // %0.1 ihtimal
      nadirKaybet.play();
    } else {
      const kaybetSes = Math.random() < 0.5 ? kaybetSes1 : kaybetSes2;
      kaybetSes.play();
    }

    oyunBitir();
  }
}



// ===== Ana Menü Oyna Butonu =====
oynaBtn.addEventListener("click", () => {
  tiklama.play();
  anaMenu.style.display = "none";
  oyun.style.display = "block";
  resetOyun();
});

// ===== Hazırlayanlar =====
hazirlayanlarBtn.addEventListener("click", () => {
  window.location.href = "credits.html";
});

// ===== Ana Menü Butonu =====
anaMenuBtn.addEventListener("click", () => {
  tiklama.play();
  oyun.style.display = "none";
  anaMenu.style.display = "block";
});

// ===== Karakter Hareketi =====
document.addEventListener("keydown", (e) => {
  if (oyunBitti) return;
  if (e.key === "a" || e.key === "ArrowLeft") karakterX -= 30;
  if (e.key === "d" || e.key === "ArrowRight") karakterX += 30;
  karakterX = Math.max(0, Math.min(window.innerWidth - 100, karakterX));
  karakter.style.left = karakterX + "px";
  karakter.style.background = "url('assets/Karakter.png') no-repeat center/contain";
});

// --- Meyve oluşturma ---
function yeniMeyve() {
  if (oyunBitti) return;

  const meyve = document.createElement("div");
  meyve.classList.add("meyve");
  const randomMeyve = meyveListesi[Math.floor(Math.random() * meyveListesi.length)];
  meyve.style.backgroundImage = `url(${randomMeyve})`;
  meyve.style.left = Math.random() * (window.innerWidth - 60) + "px";
  oyun.appendChild(meyve);

  let y = 0;

  // Hızı puana göre ayarlıyoruz
  let baseHiz = 4 + Math.random() * 3;
  if (puan >= 10 && puan < 20) baseHiz += 2;
  if (puan >= 20 && puan < 30) baseHiz += 4;
  if (puan >= 30) baseHiz += 6; // 30+ puanda taşşak yakalama

  const dusme = setInterval(() => {
    if (oyunBitti) {
      clearInterval(dusme);
      meyve.remove();
      return;
    }

    y += baseHiz;
    meyve.style.top = y + "px";

    const meyveRect = meyve.getBoundingClientRect();
    const karakterRect = karakter.getBoundingClientRect();

    // Çarpışma toleransı 30 puan sonrası azalıyor
    let yakalaAlan = (puan >= 30) ? 20 : 50;

  if (y > window.innerHeight - 50) {
    meyve.remove();
    clearInterval(dusme);
    canAzalt(); // <- burayı ekledik
  if (kacirilan >= 3) oyunBitir(); // puan tabanlı kayıp sistemi de devam ediyor
}


    // Çarpışma kontrolü
    if (
      meyveRect.bottom >= karakterRect.top &&
      meyveRect.left < karakterRect.right &&
      meyveRect.right > karakterRect.left &&
      meyveRect.bottom <= karakterRect.bottom + 50
    ) {
      puan++;
      puanYazi.textContent = "Puan: " + puan;
      meyve.remove();
      clearInterval(dusme);

      const randomIndex = Math.floor(Math.random() * meyveSesleri.length);
      meyveSesleri[randomIndex].play();
    }

    // Yere düşerse
    if (y > window.innerHeight - 50) {
      kacirilan++;
      meyve.remove();
      clearInterval(dusme);
      if (kacirilan >= 3) oyunBitir();
    }
  }, 20);
}

// ===== Oyun Döngüsü =====
const meyveAralik = setInterval(() => {
  if (!oyunBitti && oyun.style.display === "block") yeniMeyve();
}, 1000);

// ===== Oyun Bitince =====
function oyunBitir() {
  oyunBitti = true;
  tekrarBtn.style.display = "block";
  anaMenuBtn.style.display = "block";
  bitisEkrani.style.display = "flex"; // karartılı ekran açılıyor
tekrarBtn.addEventListener("click", () => {
  tiklama.play();
  resetOyun();
});
}

const bitisEkrani = document.getElementById("bitisEkrani");

function resetOyun() {
  document.querySelectorAll(".meyve").forEach(m => m.remove());
  oyunBitti = false;
  puan = 0;
  kacirilan = 0;
  can = 3;
  kalpler.forEach(kalp => kalp.src = "assets/kalp.png");
  puanYazi.textContent = "Puan: 0";
  tekrarBtn.style.display = "none";
  anaMenuBtn.style.display = "none";
  bitisEkrani.style.display = "none";
}


