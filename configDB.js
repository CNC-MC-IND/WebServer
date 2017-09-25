module.exports = {
    'host' : '210.125.29.221',
    'port' : 3306,
    'user' : 'admin',
    'password' : 'admin',
    'database' : 'cnc_mc',
    'query_getUserByEmail' : 'SELECT * FROM users where email = ',
    'query_approve' : "UPDATE users SET token = 'ok' WHERE email = ",
    'query_getUserByToken' : 'SELECT * FROM users where token = ',
    'query_data' : 'SELECT * FROM renewed_data',
    'query_toolBox_compToken' : 'SELECT * FROM users WHERE token = ',
    "query_getFcmList" : 'SELECT fcm from registered_fcm'
}