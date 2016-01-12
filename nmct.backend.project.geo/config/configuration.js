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
config.masterKey = "z5fS0svnsCpTRlSOZkernBkGQseCyu1dEJ8q4EWRoWKShDcfIa+ueD21cErIx95dwp9Vc+wunsvO3R3IUVizDw==";
config.collectionId = "dbs/geofeelings/colls/";
config.jwt_secret = 'BRZ8gRtRzmNMcEzSfA6wq8zC3ACZGvuFKGHGaNw78DvTtX8azxRCfyWAEZUvwUKkP6sNFZxL5trJSLZ4FKt5Dyc46bRMzt4Z2UjsT4zUKseaN6hAgxQHaTzn';

module.exports = config;