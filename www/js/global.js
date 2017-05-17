/**
 * 全局变量模块
 */
angular.module('global', [])
  .constant("GlobalVariable", {
    // 'SERVER_PATH': 'http://localhost/PhonePos/',  // 后台地址
    'SERVER_PATH': 'http://123.206.23.41/PhonePos/',
    // 'SERVER_PATH': 'http://192.168.191.1/PhonePos/',
    'LOGIN': 'user.php',
    'TRADE': 'trade.php',
    'QUERY': 'query.php',
    'RETURNS': 'returns.php',
    'DAYOVER': 'dayover.php',
    'MONTHOVER': 'monthover.php',
    'SETTING_PERSON': 'user.php',
    'SETTING_SYSTEM': 'system.php',
    'FEEDBACK': 'feedback.php',

    // 'AIP_PATH': 'http://localhost:8080/hiaip/gateway.action',  // 中台地址
    // 'AIP_PATH': 'http://123.206.208.83:8080/hiaip/gateway.action',
    'AIP_PATH': 'http://192.168.191.1:8080/hiaip/gateway.action',
    'APP_ID': '*',
    'MD5_KEY': 'Hs*^$@)Aip&^,.{]<.78oP',
    'FORMAT': 'JSON',
    'CHARSET': 'utf-8',
    'VERSION': "1.0",

    'AIP_PAY':'aippay.pay',
    'AIP_QUERY':'aippay.query',
    'AIP_CANCEL':'aippay.cancel',
    'AIP_REFUND':'aippay.refund',

    'FM_PARTNER_ID': '1498',
    'FM_METHOD': 'aippay.coupon.pay',
    'FM_PAY_TYPE': 'FMPAY'
  });
