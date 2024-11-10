const DatauriParser = require("datauri/parser");
const path = require("path");

const parser = new DatauriParser();

exports.getDataUri = (file) => {
  const extName = String(path.extname(file.originalname));

  return parser.format(extName, file.buffer).content;
};
