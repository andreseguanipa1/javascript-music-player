

const wrapper = document.querySelector(".wrapper");
const musicImg = wrapper.querySelector(".img-area img");
const musicName = wrapper.querySelector(".song-details .name");
const musicArtist = wrapper.querySelector(".song-details .artist");
const playPauseBtn = wrapper.querySelector(".play-pause");
const prevBtn = wrapper.querySelector("#prev");
const nextBtn = wrapper.querySelector("#next");
const mainAudio = wrapper.querySelector("#main-audio");
const progressArea = wrapper.querySelector(".progress-area");
const progressBar = progressArea.querySelector(".progress-bar");
const musicList = wrapper.querySelector(".music-list");

let musicIndex = Math.floor((Math.random() * allMusic.length) + 1);
isMusicPaused = true;

window.addEventListener("load", () => {
  loadMusic(musicIndex);
});

function loadMusic(indexNumb) {
  musicName.innerText = allMusic[indexNumb - 1].name;
  musicArtist.innerText = allMusic[indexNumb - 1].artist;
  musicImg.src = `images/${allMusic[indexNumb - 1].src}.jpg`;
  mainAudio.src = `songs/${allMusic[indexNumb - 1].src}.mp3`;
  loadComments(allMusic[indexNumb - 1].src);

}

function playMusic() {
  wrapper.classList.add("paused");
  playPauseBtn.querySelector("i").innerText = "pause";
  mainAudio.play();
}

function pauseMusic() {
  wrapper.classList.remove("paused");
  playPauseBtn.querySelector("i").innerText = "play_arrow";
  mainAudio.pause();
}

function prevMusic() {
  musicIndex--;

  musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
  loadMusic(musicIndex);
  playMusic();

}


function nextMusic() {
  musicIndex++;

  musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
  loadMusic(musicIndex);
  playMusic();

}

function playThisSong(index) {
  loadMusic(index);
  playMusic();

}


playPauseBtn.addEventListener("click", () => {
  const isMusicPlay = wrapper.classList.contains("paused");

  isMusicPlay ? pauseMusic() : playMusic();

});


prevBtn.addEventListener("click", () => {
  prevMusic();
});


nextBtn.addEventListener("click", () => {
  nextMusic();
});


mainAudio.addEventListener("timeupdate", (e) => {
  const currentTime = e.target.currentTime;
  const duration = e.target.duration;
  let progressWidth = (currentTime / duration) * 100;
  progressBar.style.width = `${progressWidth}%`;

  let musicCurrentTime = wrapper.querySelector(".current-time"),
    musicDuartion = wrapper.querySelector(".max-duration");
  mainAudio.addEventListener("loadeddata", () => {

    let mainAdDuration = mainAudio.duration;
    let totalMin = Math.floor(mainAdDuration / 60);
    let totalSec = Math.floor(mainAdDuration % 60);
    if (totalSec < 10) {
      totalSec = `0${totalSec}`;
    }
    musicDuartion.innerText = `${totalMin}:${totalSec}`;
  });

  let currentMin = Math.floor(currentTime / 60);
  let currentSec = Math.floor(currentTime % 60);
  if (currentSec < 10) {
    currentSec = `0${currentSec}`;
  }
  musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});


progressArea.addEventListener("click", (e) => {
  let progressWidth = progressArea.clientWidth;
  let clickedOffsetX = e.offsetX;
  let songDuration = mainAudio.duration;

  mainAudio.currentTime = (clickedOffsetX / progressWidth) * songDuration;
  playMusic();

});


const repeatBtn = wrapper.querySelector("#repeat-plist");

repeatBtn.addEventListener("click", () => {
  let getText = repeatBtn.innerText;
  switch (getText) {
    case "repeat":
      repeatBtn.innerText = "repeat_one";
      break;

    case "repeat_one":
      repeatBtn.innerText = "repeat";
      break;
      
  }
});


mainAudio.addEventListener("ended", () => {

  let getText = repeatBtn.innerText;

  switch (getText) {
    case "repeat":
      nextMusic();

      break;

    case "repeat_one":
      mainAudio.currentTime = 0;
      loadMusic(musicIndex);
      playMusic();

      break;

  }
});

function list() {

  let music = '';
  let modal = '';
  let writters = '';

  for (let i = 0; i < (allMusic).length; i++) {

    music += `
      <div class="song-detail">
      
        <div class="song" onclick="playThisSong(${i + 1})">
          <div>
            <label class="name-song">${allMusic[i].name}</label><br />
            <label class="artist-song">${allMusic[i].artist}</label>
          </div>
          <img class="image-song" src="images/${allMusic[i].img}.jpg" ></img>
        </div>

        <div class="detail">
        <i id="detail-list" data-bs-toggle="modal" data-bs-target="#${allMusic[i].src}" class="material-icons">list</i>
        </div>
      
      </div>
`;

    writters = allMusic[i].writters.join(', ');

    modal += `
      <div class="modal fade" id="${allMusic[i].src}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">${allMusic[i].name}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              
              <b>Artist: </b>${allMusic[i].artist} <br /><br />
              <b>Writers: </b>${writters} <br /><br />
              <b>Lyrics: </b> <br /><br /> <center>${allMusic[i].lyrics}<center /> <br />

            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    `;


  }

  document.getElementById("modals").innerHTML = modal;
  document.getElementById("list").innerHTML = music;

}

function comment() {

  let song = mainAudio.getAttribute("src").substring(6);
  song = song.substring(0, song.length - 4);
  let valor = document.getElementById("text").value;

  if (valor != '') {

    for (let i = 0; i < allMusic.length; i++) {
      if (allMusic[i].src == song) {

        allMusic[i].comments.push(valor);
        document.getElementById("text").value = "";
        loadComments(song);
        return;

      }
    }

  }

}

function loadComments(name) {

  let music = allMusic.filter(music => music.src == name);
  let comments = music[0].comments;
  let commentsHTML = '';

  for (let i = 0; i < comments.length; i++) {

    commentsHTML += `
      <div class="comment">
        ${comments[i]}
      </div>
    `

  }

  document.getElementById("comments-space").innerHTML = commentsHTML;

}

list();
