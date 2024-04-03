//circle start
let progressBar = document.querySelector('.e-c-progress');
let pointer = document.getElementById('e-pointer');
let length = Math.PI * 2 * 100;
progressBar.style.strokeDasharray = length;

function update(value, timePercent, clockwise = true) {
  var offset = length - length * value / (timePercent);
  progressBar.style.strokeDashoffset = offset; 
  pointer.style.transform = `rotate(${clockwise ? 360 - (360 * value / (timePercent)) : 360 * value / (timePercent)}deg)`; 
}

//circle ends

const displayOutput = document.querySelector('.display-remain-time')
const pauseBtn = document.getElementById('pause');
const restartBtn = document.getElementById('restart');
const setterBtns = document.querySelectorAll('button[data-setter]');
let intervalTimer;
let timeLeft;
let wholeTime = 0.0 * 60; // the default time (00:00) 
let isPaused = false;
let isStarted = false;

update(wholeTime, wholeTime); //refreshes progress bar
displayTimeLeft(wholeTime);

function changeWholeTime(seconds){
  if ((wholeTime + seconds) > 0){
    wholeTime += seconds;
    update(wholeTime, wholeTime);
  }
}

for (var i = 0; i < setterBtns.length; i++) {
  setterBtns[i].addEventListener("click", function(event) {
    var param = this.dataset.setter;
    switch (param) {
      case 'minutes-plus':
        changeWholeTime(1 * 60);
        break;
      case 'minutes-minus':
        changeWholeTime(-1 * 60);
        break;
      case 'seconds-plus':
        changeWholeTime(1);
        break;
      case 'seconds-minus':
        changeWholeTime(-1);
        break;
    }
    displayTimeLeft(wholeTime);
  });
}

function timer(seconds){ //counts time, takes seconds
  let remainTime = Date.now() + (seconds * 1000);
  displayTimeLeft(seconds);
  
  intervalTimer = setInterval(function(){
    timeLeft = Math.round((remainTime - Date.now()) / 1000);
    if(timeLeft < 0){
      clearInterval(intervalTimer);
      isStarted = false;
      setterBtns.forEach(function(btn){
        btn.disabled = false;
        btn.style.opacity = 1;
      });
      displayTimeLeft(wholeTime);
      pauseBtn.classList.remove('pause');
      pauseBtn.classList.add('play');
      
      // Play beep sound
      const beepSound = document.getElementById('beepSound');
      beepSound.play();
      
      return ;
    }
    displayTimeLeft(timeLeft);
  }, 1000);
}

function pauseTimer(event){
  if(isStarted === false){
    timer(wholeTime);
    isStarted = true;
    this.classList.remove('play');
    this.classList.add('pause');
    
    setterBtns.forEach(function(btn){
      btn.disabled = true;
      btn.style.opacity = 0.5;
    });
  }else if(isPaused){
    this.classList.remove('play');
    this.classList.add('pause');
    timer(timeLeft);
    isPaused = isPaused ? false : true;
    update(timeLeft, wholeTime, false); // Progress bar moves counterclockwise
  }else{
    this.classList.remove('pause');
    this.classList.add('play');
    clearInterval(intervalTimer);
    isPaused = isPaused ? false : true ;
  }
}

function restartTimer(){
  clearInterval(intervalTimer);
  isStarted = false;
  setterBtns.forEach(function(btn){
    btn.disabled = false;
    btn.style.opacity = 1;
  });
  wholeTime = 0.0 * 60;
  update(wholeTime, wholeTime, true); // Reset progress bar clockwise
  displayTimeLeft(wholeTime);
  progressBar.style.strokeDashoffset = length; // Reset progress bar offset
  pointer.style.transform = 'rotate(0deg)'; // Reset pointer rotation
  pauseBtn.classList.remove('pause'); // Reset pause button to play
  pauseBtn.classList.add('play');
}

function displayTimeLeft (timeLeft){ //displays time on the input
  let minutes = Math.floor(timeLeft / 60);
  let seconds = timeLeft % 60;
  let displayString = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  displayOutput.textContent = displayString;
  update(timeLeft, wholeTime, false); // Progress bar moves counterclockwise
}

pauseBtn.addEventListener('click',pauseTimer);
restartBtn.addEventListener('click',restartTimer);
