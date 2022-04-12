const headers = require('./headers');

function errorHandler(res, statusCode = 400) {
  if(statusCode === 400){
    res.writeHead(statusCode, headers);
    res.write(JSON.stringify({
      "status": "error",
      "message": "欄位空白、格是不正確，或是 id 不存在",
    }));
    res.end();
  } else if(statusCode === 404) {
    res.writeHead(statusCode, headers);
    res.write(JSON.stringify({
      "status": "error",
      "message": "網址不存在",
    }));
    res.end();
  }
}

module.exports = errorHandler;