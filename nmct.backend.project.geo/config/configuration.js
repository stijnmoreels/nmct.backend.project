/* =============================================================================
 * @project: GEOFEELINGS
 * @author: Stijn Moreels
 * @language: Node.js
 * @purpose: Configuration file 
 =============================================================================*/

"use-strict";
var config = {};
config.host = "https://geofeelings.documents.azure.com:443/";
//config.masterKey = "KN59B/+tRdJ6ahgwfr90Pmh35dz1BIjVb6q3gvxxkvIzLNQPRJMo2ZR0g/4pSH2x5aNVMyEEFyJKdqApOLUW4g==";
config.masterKey = "zrwiP6w8FE9t8rgfx38sRlWq6J0EQwkl+gdNEt140f2kLnVkxp7Z0g5+58E9rKN0l0l/7JbLq0aVjW1ozY5zeA==";
config.collectionId = "dbs/geofeelings/colls/";

module.exports = config;