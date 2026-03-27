fetch("https://the-trivia-api.com/v2/questions")
  .then(res => res.json())
  .then(data => console.log(data));