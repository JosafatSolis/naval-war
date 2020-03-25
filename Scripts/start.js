start = document.getElementById("start");
instructions = document.getElementById("instructions");

function hideInstructions() {
  //   instructions.style.visibility = "collapse";
  instructions.style.display = "none";
  var script = document.createElement("script");
  script.setAttribute("type", "text/javascript");
  script.setAttribute("src", "./Scripts/script.js");
  document.getElementsByTagName("head")[0].appendChild(script);
}

start.onclick = hideInstructions;
