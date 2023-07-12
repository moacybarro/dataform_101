
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

function doc_table(tableName) {
  const tb_name = tableName.split('.').pop().replace('`', '')
  var json = require('includes/schemas/'+tb_name+'.json');
  const jsonMetadata = json

  const columns = Object.keys(jsonMetadata);

  const result = {};
  result = columns.forEach(column => {
      result[column.name] = column.description;
    });
   
  columns = {
    user_id: `A unique identifier for a user`,
    age: `The age of a user`,
    creation_date: `The date this user signed up`,
    user_tenure: `The number of years since the user's creation date`,
    badge_count: `The all-time number of badges the user has received`,
    questions_and_answer_count: `The all-time number of questions and answers the user has created`,
    question_count: `The all-time number of questions the user has created`,
    answer_count: `The all-time number of answers the user has created`,
    last_badge_received_at: `The time the user received their most recent badge`,
    last_posted_at: `The time the user last posted a question or answer`,
    last_question_posted_at: `The time the user last posted an answer`,
    last_answer_posted_at: `The time the user last posted a question`,
}
  
  // return result
  return columns
}


module.exports = { generateQuery, doc_table };









