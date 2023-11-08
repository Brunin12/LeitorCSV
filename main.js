const fs = require("fs");
const http = require("http");
const csv = require('csv-parser');

const csvSaida = fs.createWriteStream("saida.csv");

fs.createReadStream("movies_metadata.csv")
  .pipe(csv())
  .on("data", (row) => {
    if (row.adult == "False") {
      const result = {
        Nome: row.title,
        Categoria: row.name,
        Duração: row.runtime + " min",
        Descrição: row.overview,
      };
      csvSaida.write(JSON.stringify(result) + "\n");
    }
  })
  .on("end", () => {
    console.log("Leitura do CSV concluída");
  });

const server = http.createServer(async (request, response) => {
  const headers = {
    "Content-Type": "text/csv",
    "Content-Disposition": 'attachment; filename="saida.csv"'
  };

  response.writeHead(200, headers);

  fs.createReadStream("saida.csv")
    .pipe(response)
    .on("finish", () => {
      console.log("Arquivo enviado com sucesso!");
    });
});

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
