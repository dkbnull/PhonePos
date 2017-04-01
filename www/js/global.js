/**
 * 全局变量模块
 */
angular.module('global', [])
  .constant("GlobalVariable", {
    'SERVER_PATH': 'http://localhost/PhonePos/',
    // 'SERVER_PATH': 'http://123.206.23.41/PhonePos/',
    'LOGIN': 'user.php',
    'TRADE': 'trade.php',
    'QUERY': 'query.php',
    'RETURNS': 'returns.php',
    'DAYOVER': 'dayover.php',
    'SETTING_PERSON': 'user.php',
    'SETTING_SYSTEM': 'system.php',
    'FEEDBACK': 'feedback.php',
    'VERSION': "1.0.0"
  });
