const https = require("https");
const url = "https://api.citybik.es/v2/networks/decobike-miami-beach";

module.exports = async socket => https.get(url, res => {
  res.setEncoding("utf8");
  let body = "";
  res.on("data", data => {
    body += data;
  });
  res.on("end", () => {
    body = JSON.parse(body);
    socket.emit("FromAPI", body); // Emitting a new message. It will be consumed by the client
    console.log(body);
  });
});