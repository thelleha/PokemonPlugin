(()=>{"use strict";console.log("Gotta Catch 'Em All"),setTimeout((()=>{console.log("Delayed execution"),function(){const t=function(){const t=document.querySelector('p[data-testid="detail-field-name"]');return t?t.textContent.trim():""}(),e=function(){const t=document.querySelector('div[data-testid="detail-field-id"]');if(t){const e=t.querySelectorAll("div > span");return e.length>=2?e[0].innerHTML.trim().split(":")[1].replace(/["\s\n]/g,""):""}return""}(),n=function(){const t=document.querySelector('div[data-testid="details-tournament-info-type"]');if(!t)return"";switch(t.innerHTML.trim()){case"Custom":return"CUSTOM";case"Prerelease":return"PRERELEASE";case"League Challenge":return"LEAGUE_CHALLENGE";case"League Cup":return"LEAGUE_CUP";default:return""}}(),r=function(){const t=document.querySelector('div[data-testid="details-organizer-info-name"]');if(t){const e=t.querySelectorAll("span");if(e.length>=2){const t=e[0].innerHTML.trim();return{name:t.split("(")[0].trim(),id:t.split("(")[1].replace(/\)/g,"")}}}return{name:"",id:""}}(),a=function({gameType:t,tournamentMode:e,tournamentName:n,tournamentID:r,organizerInfo:a,formattedDate:o}){return`\n<?xml version="1.0" encoding="UTF-8"?>\n<tournament type="2" stage="1" version="1.7" gametype="${t}" mode="${e}">\n\t<data>\n\t\t<name>${n}</name>\n\t\t<id>${r}</id>\n\t\t<city>Kristiansand</city>\n\t\t<state></state>\n\t\t<country>Norway</country>\n\t\t<roundtime>0</roundtime>\n\t\t<finalsroundtime>0</finalsroundtime>\n\t\t<organizer popid="${a.id}" name="${a.name}"/>\n\t\t<startdate>${o}</startdate>\n\t\t<lessswiss>false</lessswiss>\n\t\t<autotablenumber>true</autotablenumber>\n\t\t<overflowtablestart>0</overflowtablestart>\n\t</data>\n\t<timeelapsed>0</timeelapsed>\n\t<players>\n\t</players>\n\t<pods>\n\t</pods>\n\t<finalsoptions>\n\t</finalsoptions>\n</tournament>\n`}({gameType:function(){const t=document.querySelector('div[data-testid="details-tournament-info-product"]');if(t){const e=t.innerHTML.trim().toLowerCase();if("trading card game"===e)return"TRADING_CARD_GAME";if("video game"===e)return"VG";if("go"===e)return"GO"}return""}(),tournamentMode:n,tournamentName:t,tournamentID:e,organizerInfo:r,formattedDate:function(){let t=new Date,e=String(t.getDate()).padStart(2,"0");return String(t.getMonth()+1).padStart(2,"0")+"/"+e+"/"+t.getFullYear()}()});console.log(a),function(t,e){const n=new Blob([t],{type:"text/xml;charset=utf-8"}),r=URL.createObjectURL(n),a=document.createElement("a");a.href=r,a.download=e,document.body.appendChild(a),a.click(),document.body.removeChild(a),URL.revokeObjectURL(r)}(a,`${t}_${e}.TDF`)}()}),1e4)})();