let quiz = document.querySelector("#quiz")
let effect = document.querySelector("#effect")
var isans = [false,false,false,false,false,false,false,false,false,false]
let total = 10
let ar = 0
let correct1 = [0,0]   
let wrong = [0,0]     
let totalsec = 15 * 60;
let currentIndex = 0

function gettime(){
  const now = new Date();

const hours = String(now.getHours()).padStart(2, '0');
const minutes = String(now.getMinutes()).padStart(2, '0');
const seconds = String(now.getSeconds()).padStart(2, '0');

const customTime = `${hours}:${minutes}:${seconds}`;
return customTime ;
}

function todayattempts() {
  let today = new Date().toISOString().split('T')[0];

  let data1 = JSON.parse(localStorage.getItem("update")) || {
    date: today,
    attempts: 0,
    currenttime : 0 
  };

  if (data1.date !== today) {
    data1.date = today;
    data1.attempts = 0;
    data1.currenttime = 0
    correct1 = [0,0]
    wrong = [0,0]
  }

  if (data1.attempts >= 2) {
    alert("No attempts left for today");
    ar = 0

    return false;
  }

  localStorage.setItem("update", JSON.stringify(data1));
  return true;
}

let timer = setInterval(function(){

  let timertext = document.querySelector(".timerText")

  let min = Math.floor(totalsec / 60)
  let sec = totalsec % 60
  sec = sec < 10 ? "0" + sec : sec

  if(timertext){
    timertext.innerHTML = `${min}:${sec}`
  }

  totalsec--

  if(totalsec <= 0){
    clearInterval(timer)
  }

},1000)


async function getdata(){ 
  try {
    let res = await fetch("https://the-trivia-api.com/v2/questions")
    let data = await res.json()
    console.log(data)

    function getque(index){

      let item = data[index]

      let options = [...item.incorrectAnswers, item.correctAnswer]
      options.sort(() => 0.5 - Math.random())
  

      quiz.innerHTML= `
      <div class="box">
          <div class="clock">
              <span class="timer-label">TIME LEFT</span>
              <h4 class="timerText"></h4>
          </div>

          <div class="progress-container">
              <div class="progress-fill" style="width: ${(index + 1) / data.length * 100}%;"></div>
          </div>

          <h3>Question ${index + 1} / ${data.length}</h3>
          <h1 class="que">${item.question.text}</h1>

          <div class="options-container">
              ${options.map((opt, i) => `
                <button class="option-3d">
                  <div class="option-base"></div>
                  <div class="option-top">
                    <span class="label">${String.fromCharCode(65 + i)}</span>
                    <span class="text">${opt}</span>
                  </div>
                </button>
              `).join("")}
          </div>

          <div class="nav-container">
            <button class="nav-btn-3d">
              <div class="nav-top prev">❮ PREV</div>
            </button>

            <button class="nav-btn-3d">
              <div class="nav-top next">NEXT ❯</div>
            </button>
          </div>
      </div>
      `

      if(isans[currentIndex]=== true){
        let allOptions = document.querySelectorAll(".option-3d")

        allOptions.forEach((btn) => {
          btn.style.pointerEvents = "none"
          btn.style.opacity = "0.6"
        })
      }
    }

    getque(currentIndex)

    quiz.addEventListener("click", function(e){

      let optionBtn = e.target.closest(".option-3d")

      if(isans[currentIndex] === false){
        if(optionBtn){

          let selected = optionBtn.querySelector(".text").innerText.trim().toLowerCase()
          let correct = data[currentIndex].correctAnswer.trim().toLowerCase()

          let allOptions = document.querySelectorAll(".option-3d")

          allOptions.forEach((btn) => {
            btn.style.pointerEvents = "none"
            btn.style.opacity = "0.6"
          })

          if(selected === correct){
            optionBtn.querySelector(".option-top").style.backgroundColor = "green"

            effect.innerText = "🎉"
            effect.classList.add("show")

            correct1[ar] += 1;   

            isans[currentIndex] = true;

            setTimeout(function(){
              effect.classList.remove("show")
            },3000)

          } else {

            optionBtn.querySelector(".option-top").style.backgroundColor = "red"

            effect.innerText = "💀"
            effect.classList.add("show")

            wrong[ar] += 1;   

            isans[currentIndex] = true;

            setTimeout(function(){
              effect.classList.remove("show")
            },3000)
          }
        }
      }

      if(e.target.classList.contains("next")){
        if(currentIndex < data.length - 1){
          currentIndex++
          getque(currentIndex)
        }
      }

      if(e.target.classList.contains("prev")){
        if(currentIndex > 0){
          currentIndex--
          getque(currentIndex)
        }
      }

    })

  } catch (err) {
    console.log("Error:", err)
  }
}

getdata()

let isSubmitted = false;
let flag = null ;
let main1 = document.querySelector("#main1");
let play = document.querySelector(".home .play-button");

play.addEventListener("click", function() {
let attemptchecker =  todayattempts()

let checki = canplay()
if(checki === false){
  return ;
}
if(attemptchecker === false){
  return ;
}
  // correct1 = [0,0];   
  // wrong = [0,0];      
  currentIndex = 0;
  isans = Array(10).fill(false);
isSubmitted = false

  main1.style.display = "block";
})

let back = document.querySelector(".back")
back.addEventListener("click", function () {
  let today = new Date().toISOString().split('T')[0];
  let time = gettime()

  let data1 = JSON.parse(localStorage.getItem("update")) || {
    date: today,
    attempts: 0
  };

  if (data1.date !== today) {
    data1.date = today;
    data1.attempts = 0;
  }

  data1.attempts++;
data1.currenttime = getTimestamp()
  localStorage.setItem("update", JSON.stringify(data1));

  main1.style.display = "none";
});

function updateStreak(score){
  let streak = JSON.parse(localStorage.getItem('mystreak')) || []

  streak.push(score)

  if(streak.length > 10){
    streak.shift()
  }

  localStorage.setItem('mystreak', JSON.stringify(streak))

  return streak
}

let doughnutChart;
let barChart;

function getanalysis(){

  document.getElementById("total").innerText = total;
  document.getElementById("correct").innerText = correct1[ar]
  document.getElementById("wrong").innerText = wrong[ar]

  let streak;

  if(!isSubmitted){
    streak = updateStreak(Math.max(...correct1))
    isSubmitted = true
  } else {
    streak = JSON.parse(localStorage.getItem('mystreak')) || []
  }

  if(doughnutChart) doughnutChart.destroy()
  if(barChart) barChart.destroy()

  let ctx = document.getElementById("myChart").getContext("2d");

  doughnutChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Correct", "Wrong"],
      datasets: [{
        data: [correct1[ar], wrong[ar]], 
        backgroundColor: ["green", "red"]
      }]
    }
  });

  let barCtx = document.getElementById("barChart").getContext("2d");

  barChart = new Chart(barCtx, {
    type: "bar",
    data: {
      labels: streak.map((_, i) => `Day ${i+1}`),
      datasets: [{
        label: "Daily Score",
        data: streak,
        backgroundColor: "green"
      }]
    }
  });
}

function getTimestamp(){
  return Date.now(); 
}

function canplay(){
  let data1 = JSON.parse(localStorage.getItem("update")) || {}

  let now = getTimestamp()

  if(data1.currenttime && (now - data1.currenttime) < (6 * 60 * 60 * 1000)){
    alert("Wait 6 hours before next attempt")
    return false
  }
  ar = 1
  return true
}

let button = document.querySelector(".button")
let getalys = document.querySelector(".get-alys")

let giveanalysis = document.querySelector("#giveanalysis")
getalys.addEventListener("click",function(){
  
  giveanalysis.style.display = "block"
  getanalysis()
})
button.addEventListener("click",function(){
giveanalysis.style.display = "none"
})