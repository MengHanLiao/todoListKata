function errorHandler(res) {
  const headers = {
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
    'Content-Type': 'application/json'
  }
  res.writeHead(400, headers);
  res.write(JSON.stringify({
    "status": "error",
    "message": "欄位空白、格是不正確，或是 id 不存在",
  }));
  res.end();
}

module.exports = errorHandler;