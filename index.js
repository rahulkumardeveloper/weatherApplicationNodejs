const http = require("node:http");
const fs = require("fs");
const request = require("requests");
const port = 3030;
const hostname = "127.0.0.1";

const homeFile = fs.readFileSync("home.html", "utf-8");
const replaceVal = (tempvalue, resValue) => {
  //   console.log("tempvalue", resValue);
  let tempreture = tempvalue.replace("{%temp%}", resValue.main.temp);
  tempreture = tempreture.replace("{%mintemp%}", resValue.main.temp_min);
  tempreture = tempreture.replace("{%maxtemp%}", resValue.main.temp_max);
  tempreture = tempreture.replace("{%location%}", resValue.name);
  tempreture = tempreture.replace("{%countryName%}", resValue.sys.country);
  return tempreture;
};
const server = http.createServer((req, res) => {
  if (req.url == "/") {
    request(
      "https://api.openweathermap.org/data/2.5/weather?lat=17.3850&lon=78.4867&appid=af0281e0af2d51c9e598a51ac32a7b14"
    )
      .on("data", (chunk) => {
        // console.log("Chunckdata", JSON.parse(chunk));
        const parseObj = JSON.parse(chunk);
        const arrayObjRes = [parseObj];
        const updatedHomeFile = arrayObjRes
          .map((resValue) => replaceVal(homeFile, resValue))
          .join("");
        console.log("updatedHomeFile", updatedHomeFile);
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(updatedHomeFile);
        res.end();
      })
      .on("error", (error) => {
        if (error) {
          console.log("Eror is coming", error);
        }
      })
      .on("end", (error) => {
        console.log("Stop server due to data end ");
        res.end();
      });
  }
});

server.listen(port, hostname, () => {
  console.log(`Server is running at ${hostname}:${port}`);
});
