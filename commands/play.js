const _0x506a43=_0x19ab;(function(_0x113ae4,_0x2514e8){const _0x43f57e=_0x19ab,_0x381cab=_0x113ae4();while(!![]){try{const _0x5b3780=-parseInt(_0x43f57e(0x12e))/0x1*(-parseInt(_0x43f57e(0x138))/0x2)+-parseInt(_0x43f57e(0x136))/0x3+-parseInt(_0x43f57e(0x137))/0x4+-parseInt(_0x43f57e(0x13f))/0x5*(parseInt(_0x43f57e(0x142))/0x6)+-parseInt(_0x43f57e(0x129))/0x7*(-parseInt(_0x43f57e(0x14d))/0x8)+parseInt(_0x43f57e(0x130))/0x9*(parseInt(_0x43f57e(0x140))/0xa)+parseInt(_0x43f57e(0x149))/0xb*(parseInt(_0x43f57e(0x147))/0xc);if(_0x5b3780===_0x2514e8)break;else _0x381cab['push'](_0x381cab['shift']());}catch(_0x18b36a){_0x381cab['push'](_0x381cab['shift']());}}}(_0x416e,0xd0023));function _0x416e(){const _0xee4253=['69167tPQfPS','No\x20download\x20data\x20available.','process','❌\x20*Error:*\x20No\x20results\x20found.\x0a🔗\x20*Hint:*\x20Please\x20provide\x20a\x20valid\x20URL\x20or\x20title.','ago','68JNtuFW','🎥𝗦𝗧𝗥𝗘𝗔𝗠𝗟𝗜𝗡𝗘\x20𝗦𝗢𝗡𝗚\x20&\x20𝗩𝗜𝗗𝗘𝗢\x20𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗥🎥\x0a\x20\x20\x20\x20\x0a🔎\x20Searching\x20for:\x20','1071DtVIik','yt-search','audio/mpeg','🎵\x20Preparing\x20Audio\x20Doc...','\x0aTime\x20\x20\x20\x20\x20\x20\x20\x20:\x20','Error:\x20','735486YjKDiz','5162292tMuaxf','16264YRytDS','🎶\x20Downloading\x20Audio...','https://','error','\x0a\x0aTo\x20Get\x20The\x20Files\x20Send:\x0a1\x20🎶\x20For\x20Audio\x0a2\x20🎬\x20For\x20Video\x0a3\x20🎵\x20For\x20Audio\x20Doc\x0a4\x20📹\x20For\x20Video\x20Doc\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x0a','Failed\x20to\x20download\x20video.','react','10cBGxAa','74320JOvYav','timestamp','2174280qeXqab','video/mp4','toFixed','ytv','startsWith','109092jIaDdC','m\x0aAgo\x20\x20\x20\x20\x20\x20\x20\x20\x20:\x20','1991XTydod','yta','Here\x27s\x20your\x20video\x20file!','../command','24nPgWUI','thumbnail','get','path','play','then','🔍\x20*Please\x20provide\x20a\x20URL\x20or\x20title.*\x0a🌐\x20*Example:*\x20https://example.com\x20or\x20\x22Sample\x20Title\x22','📹\x20Preparing\x20Video\x20Doc...','quoted','title','BOTTOM_FOOTER','api-dylux','sendMessage','../config','Please\x20enter\x20a\x20valid\x20number\x20between\x201\x20and\x204.','toString','set','dl_url'];_0x416e=function(){return _0xee4253;};return _0x416e();}const fs=require('fs'),path=require(_0x506a43(0x150)),{cmd,commands}=require(_0x506a43(0x14c)),config=require(_0x506a43(0x124)),yts=require(_0x506a43(0x131)),fg=require(_0x506a43(0x158)),{emit}=require(_0x506a43(0x12b)),menuMessageIds=new Map(),downloadUrls=new Map(),formatNumber=_0x49c32a=>{const _0x2255af=_0x506a43;if(_0x49c32a>=0xf4240)return(_0x49c32a/0xf4240)[_0x2255af(0x144)](0x1)+'M';if(_0x49c32a>=0x3e8)return(_0x49c32a/0x3e8)[_0x2255af(0x144)](0x1)+'K';return _0x49c32a[_0x2255af(0x126)]();};function _0x19ab(_0x19853d,_0x1b4b03){const _0x416e62=_0x416e();return _0x19ab=function(_0x19abc2,_0x7c57d9){_0x19abc2=_0x19abc2-0x123;let _0x181edb=_0x416e62[_0x19abc2];return _0x181edb;},_0x19ab(_0x19853d,_0x1b4b03);}cmd({'pattern':_0x506a43(0x151),'desc':'Play\x20or\x20download\x20a\x20song\x20or\x20a\x20video','category':'download','filename':__filename},async(_0x542be5,_0x352e56,_0x1129af,{from:_0x3b768f,quoted:_0x39ad34,body:_0x411212,args:_0x5a92c5,q:_0x394be8,reply:_0xea0de0})=>{const _0x289a0e=_0x506a43;try{if(!_0x394be8){_0x1129af[_0x289a0e(0x13e)]('❓')[_0x289a0e(0x152)](()=>{const _0x1e1037=_0x289a0e;_0xea0de0(_0x1e1037(0x153));});return;}const _0x1d5ecd=await yts(_0x394be8),_0x47bbdd=_0x1d5ecd['videos'][0x0];if(!_0x47bbdd){_0x1129af[_0x289a0e(0x13e)]('❓')[_0x289a0e(0x152)](()=>{const _0x3985bd=_0x289a0e;_0xea0de0(_0x3985bd(0x12c));});return;}_0x1129af['react']('📺');const _0x5dedcb=_0x47bbdd['url'],_0x3ed385=formatNumber(_0x47bbdd['views']),_0x49f0ea=_0x394be8[_0x289a0e(0x146)](_0x289a0e(0x13a))?_0x394be8:'*_'+_0x394be8['toUpperCase']()+'_*',_0x772a3f=_0x289a0e(0x12f)+_0x49f0ea+'\x0a🎥\x20Here’s\x20what\x20I\x20found:\x0a\x20\x20\x20\x20\x0aTitle\x20\x20\x20\x20\x20\x20\x20:\x20'+_0x47bbdd[_0x289a0e(0x156)]+_0x289a0e(0x134)+_0x47bbdd[_0x289a0e(0x141)]+_0x289a0e(0x148)+_0x47bbdd[_0x289a0e(0x12d)]+'\x0aViews\x20\x20\x20\x20\x20\x20\x20:\x20'+_0x3ed385+'\x0a\x0a🔗\x20Watch\x20it\x20here:\x20'+_0x5dedcb+_0x289a0e(0x13c)+config[_0x289a0e(0x157)],_0x5dfd6f=await _0x542be5[_0x289a0e(0x123)](_0x3b768f,{'image':{'url':_0x47bbdd[_0x289a0e(0x14e)]},'caption':_0x772a3f},{'quoted':_0x352e56});downloadUrls['set'](_0x3b768f,_0x5dedcb),menuMessageIds[_0x289a0e(0x127)](_0x3b768f,_0x5dfd6f['key']['id']);}catch(_0x4ce514){console[_0x289a0e(0x13b)](_0x4ce514),_0xea0de0(_0x289a0e(0x135)+_0x4ce514);}}),cmd({'on':'body'},async(_0x7dd56c,_0x4af5eb,_0xb9d364,{from:_0x18fa12,body:_0x178656,reply:_0x5254a5})=>{const _0x5099a1=_0x506a43;try{const _0x3c0713=menuMessageIds[_0x5099a1(0x14f)](_0x18fa12);if(!_0xb9d364[_0x5099a1(0x155)]||_0xb9d364[_0x5099a1(0x155)]['id']!==_0x3c0713)return;const _0x3f61bf=parseInt(_0x178656);if(isNaN(_0x3f61bf)||_0x3f61bf<0x1||_0x3f61bf>0x4)return _0x5254a5(_0x5099a1(0x125));const _0x483027=downloadUrls[_0x5099a1(0x14f)](_0x18fa12);if(!_0x483027)return _0x5254a5(_0x5099a1(0x12a));let _0x5f3e97=await fg[_0x5099a1(0x14a)](_0x483027);if(!_0x5f3e97||!_0x5f3e97[_0x5099a1(0x128)])return _0x5254a5('Failed\x20to\x20download\x20audio.');let _0x7a7597=await fg[_0x5099a1(0x145)](_0x483027);if(!_0x7a7597||!_0x7a7597[_0x5099a1(0x128)])return _0x5254a5(_0x5099a1(0x13d));switch(_0x3f61bf){case 0x1:_0x5254a5(_0x5099a1(0x139)),await _0x7dd56c[_0x5099a1(0x123)](_0x18fa12,{'audio':{'url':_0x5f3e97['dl_url']},'mimetype':_0x5099a1(0x132)},{'quoted':_0xb9d364});break;case 0x2:_0x5254a5('🎬\x20Downloading\x20Video...'),await _0x7dd56c['sendMessage'](_0x18fa12,{'video':{'url':_0x7a7597['dl_url']},'mimetype':_0x5099a1(0x143),'caption':_0x5099a1(0x14b)},{'quoted':_0xb9d364});break;case 0x3:_0x5254a5(_0x5099a1(0x133)),await _0x7dd56c[_0x5099a1(0x123)](_0x18fa12,{'document':{'url':_0x5f3e97[_0x5099a1(0x128)]},'mimetype':_0x5099a1(0x132),'fileName':_0x5f3e97[_0x5099a1(0x156)]+'.mp3'},{'quoted':_0x4af5eb});break;case 0x4:_0x5254a5(_0x5099a1(0x154)),await _0x7dd56c[_0x5099a1(0x123)](_0x18fa12,{'document':{'url':_0x7a7597[_0x5099a1(0x128)]},'mimetype':'video/mp4','fileName':_0x7a7597[_0x5099a1(0x156)]+'.mp4'},{'quoted':_0x4af5eb});break;default:_0x5254a5('Please\x20enter\x20a\x20valid\x20option.');break;}}catch(_0xb513db){console[_0x5099a1(0x13b)](_0xb513db),_0x5254a5(_0x5099a1(0x135)+_0xb513db);}});