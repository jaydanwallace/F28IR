let name = "";

async function post(url, data) {
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  }).then(r => r.json());
}

async function join() {
  name = document.getElementById("name").value;
  if (!name) return;
  await post("/join", { name });
  document.getElementById("join").style.display = "none";
  document.getElementById("game").style.display = "block";
  update();
}

async function send() {
  const answer = document.getElementById("answer").value;
  if (!answer) return;

  const res = await post("/answer", { name, answer });
  document.getElementById("msg").innerText = res.correct ? "well done!" : "nice try";
  document.getElementById("answer").value = "";
  update();
}

async function resetGame() {
  await post("/reset", {});
  location.reload();
}

async function update() {
  const s = await fetch("/state").then(r => r.json());

  document.getElementById("scores").innerText =
    Object.entries(s.players).map(p => p[0] + ":" + p[1]).join(" | ");

  if (s.gameOver) {
    document.getElementById("question").innerText = "Game Over";
    return;
  }

  document.getElementById("question").innerText = s.question.question;

  document.getElementById("log").innerHTML =
    s.log.map(l => `${l.who}: ${l.answer} (${l.correct ? "ok" : "fail"})`).join("<br>");
}

setInterval(update, 1000);