let quiz = document.querySelector("#quiz")
let effect = document.querySelector("#effect")
var isans = [false,false,false,false,false,false,false,false,false,false]
let total = 10



let correct1 = 0
let wrong = 0

let currentIndex = 0
let totalsec = 15 * 60

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
      options.sort(() => 0.5 - Math.random()) // FIXED shuffle
  

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

    // first render
    getque(currentIndex)
  

    // navigation + option click
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
            optionBtn.querySelector(".option-top").style.backgroundColor = "green" // FIXED

            effect.innerText = "🎉"
            effect.classList.add("show") // FIXED
correct1 += 1 ;
            isans[currentIndex] = true;

            setTimeout(function(){
              effect.classList.remove("show")
            },3000)

          } else {

            optionBtn.querySelector(".option-top").style.backgroundColor = "red" // FIXED

            effect.innerText = "💀"
            effect.classList.add("show") // FIXED
wrong += 1
            isans[currentIndex] = true;

            setTimeout(function(){
              effect.classList.remove("show")
            },3000)
          }
        }
      }

      // NEXT
      if(e.target.classList.contains("next")){
        if(currentIndex < data.length - 1){
          currentIndex++
          getque(currentIndex)
        }
      }

      // PREV
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
  correct1 = 0;
  wrong = 0;
  currentIndex = 0;
  isans = Array(10).fill(false);
isSubmitted = false
  main1.style.display = "block";
})

let back = document.querySelector(".back")
back.addEventListener("click",function(){

 
  main1.style.display = "none";
})
function updateStreak(score){
  let streak = JSON.parse(localStorage.getItem('mystreak')) || []

  streak.push(score)   // new day add

  if(streak.length > 10){
    streak.shift()     // oldest remove
  }

  localStorage.setItem('mystreak', JSON.stringify(streak))

  return streak
}

let doughnutChart;
let barChart;

function getanalysis(){

  document.getElementById("total").innerText = total;
  document.getElementById("correct").innerText = correct1;
  document.getElementById("wrong").innerText = wrong;

    let streak;

  if(!isSubmitted){
    streak = updateStreak(correct1)
    isSubmitted = true
  } else {
    streak = JSON.parse(localStorage.getItem('mystreak')) || []
  }

  // destroy old charts
  if(doughnutChart) doughnutChart.destroy()
  if(barChart) barChart.destroy()

  // Doughnut
  let ctx = document.getElementById("myChart").getContext("2d");

  doughnutChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Correct", "Wrong"],
      datasets: [{
        data: [correct1, wrong],
        backgroundColor: ["green", "red"]
      }]
    }
  });

  // Bar Graph (Dynamic labels)
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


