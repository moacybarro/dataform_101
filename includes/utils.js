
function generateQuery(tableName) {
  const tb_name = tableName.split('.').pop().replace('`', '')
  const constants = require("includes/constants.js");
  var json = require('includes/schemas/'+tb_name+'.json');
  const jsonMetadata = json

  const columns = Object.keys(jsonMetadata);

  const selectClause = columns.map(column => {
    const { name, dataType, is_pii, pii_op } = jsonMetadata[column];
    var statement = ""
    if (is_pii) {
        if(pii_op == null) {
            throw "PII_OP is mandatory for PII fields!!!";
        } else {
            statement =  `${pii_op}(CAST(${name} AS STRING)) AS ${column}`;
        }
    } else {
        statement = `CAST(${name} AS ${dataType}) AS ${column}`;
    }
    return statement
  }).join(", ");

  var selectClausePluMeta = selectClause.concat(", GENERATE_UUID() AS uuid")
  selectClausePluMeta = selectClausePluMeta.concat(", CURRENT_TIMESTAMP() AS created_at")
  selectClausePluMeta = selectClausePluMeta.concat(", SESSION_USER() AS created_by")
  selectClausePluMeta = selectClausePluMeta.concat(", CURRENT_DATE() AS updated_at")
  selectClausePluMeta = selectClausePluMeta.concat(", SESSION_USER() AS updated_by")
  

  // const query = `SELECT ${selectClause} FROM ${tableName}`;
  const query = `SELECT ${selectClausePluMeta} FROM ${tableName}`;

  return query;
}

module.exports = { generateQuery };









