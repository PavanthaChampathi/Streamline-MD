function _0x5dd4(_0x19135d,_0x50dfb7){const _0x58f91b=_0x58f9();return _0x5dd4=function(_0x5dd462,_0x2cd9b3){_0x5dd462=_0x5dd462-0x117;let _0x99c524=_0x58f91b[_0x5dd462];return _0x99c524;},_0x5dd4(_0x19135d,_0x50dfb7);}const _0xb66666=_0x5dd4;(function(_0x3302e0,_0x1a07dc){const _0x18cf74=_0x5dd4,_0x5bf1ab=_0x3302e0();while(!![]){try{const _0x1223f1=-parseInt(_0x18cf74(0x11f))/0x1+-parseInt(_0x18cf74(0x12a))/0x2+-parseInt(_0x18cf74(0x128))/0x3+-parseInt(_0x18cf74(0x129))/0x4+parseInt(_0x18cf74(0x125))/0x5+-parseInt(_0x18cf74(0x126))/0x6*(parseInt(_0x18cf74(0x12d))/0x7)+parseInt(_0x18cf74(0x119))/0x8;if(_0x1223f1===_0x1a07dc)break;else _0x5bf1ab['push'](_0x5bf1ab['shift']());}catch(_0x395ab2){_0x5bf1ab['push'](_0x5bf1ab['shift']());}}}(_0x58f9,0xc8d75));function _0x58f9(){const _0x518e68=['../config','Please\x20provide\x20a\x20search\x20term.','toUpperCase','title','_*\x0a\x0a📖\x20Here’s\x20what\x20I\x20found:\x20\x0a\x0a*','🌐\x20Streamline-MD\x20🌟\x0a🔍\x20WIKIPIDIA\x20SEARCH\x20📖\x0a\x0a\x0a🔗\x20Searching\x20for:\x20\x20*_','31616728hUOkDm','search','No\x20definitions\x20found\x20for\x20*${qu}*.','log','results','../lib/keywordFilter','969904GFqhuS','*\x0a\x0a🔗\x20Read\x20more:\x20','react','BOTTOM_FOOTER','wikipedia','🚫\x20Access\x20Denied:\x20Your\x20request\x20contains\x20restricted\x20keywords.','5856975qJBOfr','1525518IqTWKj','Search\x20and\x20retrieve\x20information\x20from\x20Wikipedia.','3821412BfaYpV','484516tZQLjB','2854996FpIeki','page','fullurl','14yzDylQ','😔\x20No\x20summary\x20available\x20for\x20this\x20article.\x0a🔗\x20You\x20can\x20view\x20the\x20full\x20page\x20here:\x20'];_0x58f9=function(){return _0x518e68;};return _0x58f9();}const wiki=require(_0xb66666(0x123))['default'],{cmd,commands}=require('../command'),{filterKeywords}=require(_0xb66666(0x11e)),config=require(_0xb66666(0x12f));cmd({'pattern':'wiki','desc':_0xb66666(0x127),'category':'search','filename':__filename},async(_0x4e4671,_0xcf77bc,_0x47878,{from:_0x4be1ff,quoted:_0xe0eb5d,body:_0x37fe1e,isCmd:_0xe0ff92,command:_0x2decb5,args:_0x51bb26,q:_0xdae240,isGroup:_0x20dfaa,sender:_0x9f1617,senderNumber:_0x4d7ed5,botNumber2:_0xdd211f,botNumber:_0x399c45,pushname:_0x5daae1,isMe:_0x4542df,isOwner:_0xc424f5,groupMetadata:_0x377086,groupName:_0x2dd2f7,participants:_0x41ea38,groupAdmins:_0x3351fa,isBotAdmins:_0x5bf862,isAdmins:_0x41e2ae,reply:_0x59972f})=>{const _0x3fd5af=_0xb66666;try{if(filterKeywords(_0xdae240))return await _0x47878[_0x3fd5af(0x121)]('🚫'),_0x59972f(_0x3fd5af(0x124));if(!_0xdae240)return await _0x47878[_0x3fd5af(0x121)]('❓'),_0x59972f(_0x3fd5af(0x130));const _0x2e041f=await wiki[_0x3fd5af(0x11a)](_0xdae240);if(!_0x2e041f||_0x2e041f[_0x3fd5af(0x11d)]['length']===0x0)return await _0x47878['react']('😕'),_0x59972f(_0x3fd5af(0x11b));const _0x5b8c1c=_0x2e041f[_0x3fd5af(0x11d)][0x0][_0x3fd5af(0x132)],_0x3b445c=await wiki[_0x3fd5af(0x12b)](_0x5b8c1c),_0x48ec3e=await _0x3b445c['summary'](),_0x503256=_0x3b445c[_0x3fd5af(0x12c)];if(!_0x48ec3e)return await _0x47878[_0x3fd5af(0x121)]('😔'),_0x59972f(_0x3fd5af(0x12e)+_0x503256);await _0x47878[_0x3fd5af(0x121)]('📖');const _0x54b01e=_0xdae240[_0x3fd5af(0x131)]();let _0x3a994a=_0x3fd5af(0x118)+_0x54b01e+_0x3fd5af(0x117)+_0x48ec3e['extract']+_0x3fd5af(0x120)+_0x503256+'\x0a\x0a'+config[_0x3fd5af(0x122)];_0x59972f(_0x3a994a);}catch(_0x199064){await _0x47878[_0x3fd5af(0x121)]('⚠️'),console[_0x3fd5af(0x11c)](_0x199064),_0x59972f(''+_0x199064);}});