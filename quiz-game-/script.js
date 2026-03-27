let quiz = document.querySelector("#quiz")

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

    function getque(index){

      let item = data[index]

      let options = [...item.incorrectAnswers, item.correctAnswer]
      options.sort(() => Math.random() - 0.5)

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
    }

    // first render
    getque(currentIndex)

    //  navigation
    quiz.addEventListener("click",function(e){

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