{\rtf1\ansi\ansicpg1252\cocoartf2761
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 ArialMT;}
{\colortbl;\red255\green255\blue255;\red26\green26\blue26;\red255\green255\blue255;\red16\green60\blue192;
}
{\*\expandedcolortbl;;\cssrgb\c13333\c13333\c13333;\cssrgb\c100000\c100000\c100000;\cssrgb\c6667\c33333\c80000;
}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\deftab720
\pard\pardeftab720\partightenfactor0

\f0\fs26 \cf2 \cb3 \expnd0\expndtw0\kerning0
const CSV_PATH = './data/schedule.csv';\cb1 \
\cb3 let presetData = \{\};\cb1 \
\cb3 let selectedDay = new Date().getDate(); // Automatically set to today\cb1 \
\
\cb3 async function init() \{\cb1 \
\cb3 \'a0 \'a0 await loadCSVData();\cb1 \
\cb3 \'a0 \'a0 document.getElementById('dayTitle').textContent = `Day $\{selectedDay\} Schedule`;\cb1 \
\cb3 \'a0 \'a0 createBars();\cb1 \
\cb3 \'a0 \'a0 setInterval(updateClock, 1000);\cb1 \
\cb3 \}\cb1 \
\
\cb3 async function loadCSVData() \{\cb1 \
\cb3 \'a0 \'a0 try \{\cb1 \
\cb3 \'a0 \'a0 \'a0 \'a0 const response = await fetch(CSV_PATH);\cb1 \
\cb3 \'a0 \'a0 \'a0 \'a0 const text = await response.text();\cb1 \
\cb3 \'a0 \'a0 \'a0 \'a0 presetData = parseCSV(text);\cb1 \
\cb3 \'a0 \'a0 \} catch (e) \{\cb1 \
\cb3 \'a0 \'a0 \'a0 \'a0 console.error("Could not load CSV, check if file exists in /data/schedule.csv");\cb1 \
\cb3 \'a0 \'a0 \}\cb1 \
\cb3 \}\cb1 \
\
\cb3 function parseCSV(text) \{\cb1 \
\cb3 \'a0 \'a0 const lines = text.trim().split('\\n');\cb1 \
\cb3 \'a0 \'a0 const data = \{\};\cb1 \
\cb3 \'a0 \'a0 for (let i = 1; i < lines.length; i++) \{\cb1 \
\cb3 \'a0 \'a0 \'a0 \'a0 const [day, bar, h, m, s] = lines[i].split(',').map(item => parseInt(item.trim()));\cb1 \
\cb3 \'a0 \'a0 \'a0 \'a0 if (!data[day]) data[day] = \{\};\cb1 \
\cb3 \'a0 \'a0 \'a0 \'a0 const key = `bar$\{bar\}`;\cb1 \
\cb3 \'a0 \'a0 \'a0 \'a0 if (!data[day][key]) data[day][key] = [];\cb1 \
\cb3 \'a0 \'a0 \'a0 \'a0 data[day][key].push(\{ h, m, s \});\cb1 \
\cb3 \'a0 \'a0 \}\cb1 \
\cb3 \'a0 \'a0 return data;\cb1 \
\cb3 \}\cb1 \
\
\cb3 function updateClock() \{\cb1 \
\cb3 \'a0 \'a0 const now = new Date();\cb1 \
\cb3 \'a0 \'a0 const timeString = [now.getHours(), now.getMinutes(), now.getSeconds()]\cb1 \
\cb3 \'a0 \'a0 \'a0 \'a0 .map(v => String(v).padStart(2, '0')).join(':');\cb1 \
\cb3 \'a0 \'a0 document.getElementById('clock').textContent = timeString;\cb1 \
\cb3 \'a0 \'a0 updateBars(now);\cb1 \
\cb3 \}\cb1 \
\
\cb3 function updateBars(now) \{\cb1 \
\cb3 \'a0 \'a0 const dayData = presetData[selectedDay] || \{\};\cb1 \
\cb3 \'a0 \'a0 for (let i = 1; i <= 6; i++) \{\cb1 \
\cb3 \'a0 \'a0 \'a0 \'a0 const barDiv = document.getElementById(`bar$\{i\}`);\cb1 \
\cb3 \'a0 \'a0 \'a0 \'a0 if (!barDiv) continue;\cb1 \
\
\cb3 \'a0 \'a0 \'a0 \'a0 const times = dayData[`bar$\{i\}`] || [];\cb1 \
\cb3 \'a0 \'a0 \'a0 \'a0 const isActive = times.some(t => t.h === now.getHours() && t.m === now.getMinutes() && t.s === now.getSeconds());\cb1 \
\
\cb3 \'a0 \'a0 \'a0 \'a0 if (isActive) \{\cb1 \
\cb3 \'a0 \'a0 \'a0 \'a0 \'a0 \'a0 barDiv.classList.add('active');\cb1 \
\cb3 \'a0 \'a0 \'a0 \'a0 \'a0 \'a0 barDiv.querySelector('.bar-status').textContent = '\uc0\u9679  ACTIVE';\cb1 \
\cb3 \'a0 \'a0 \'a0 \'a0 \} else \{\cb1 \
\cb3 \'a0 \'a0 \'a0 \'a0 \'a0 \'a0 barDiv.classList.remove('active');\cb1 \
\cb3 \'a0 \'a0 \'a0 \'a0 \'a0 \'a0 barDiv.querySelector('.bar-status').textContent = '\uc0\u9675  IDLE';\cb1 \
\cb3 \'a0 \'a0 \'a0 \'a0 \}\cb1 \
\cb3 \'a0 \'a0 \}\cb1 \
\cb3 \}\cb1 \
\
\cb3 function createBars() \{\cb1 \
\cb3 \'a0 \'a0 const container = document.getElementById('barsContainer');\cb1 \
\cb3 \'a0 \'a0 container.innerHTML = '';\cb1 \
\cb3 \'a0 \'a0 for (let i = 6; i >= 1; i--) \{\cb1 \
\cb3 \'a0 \'a0 \'a0 \'a0 const div = document.createElement('div');\cb1 \
\cb3 \'a0 \'a0 \'a0 \'a0 div.className = 'bar';\cb1 \
\cb3 \'a0 \'a0 \'a0 \'a0 {\field{\*\fldinst{HYPERLINK "http://div.id/"}}{\fldrslt \cf4 \ul \ulc4 div.id}} = `bar$\{i\}`;\cb1 \
\cb3 \'a0 \'a0 \'a0 \'a0 div.innerHTML = `\cb1 \
\cb3 \'a0 \'a0 \'a0 \'a0 \'a0 \'a0 <div class="bar-left"><span class="bar-number">$\{i\}</span><div class="bar-divider"></div></div>\cb1 \
\cb3 \'a0 \'a0 \'a0 \'a0 \'a0 \'a0 <div class="bar-center"><span class="bar-time">--:--:--</span></div>\cb1 \
\cb3 \'a0 \'a0 \'a0 \'a0 \'a0 \'a0 <div class="bar-status">\uc0\u9675  IDLE</div>`;\cb1 \
\cb3 \'a0 \'a0 \'a0 \'a0 container.appendChild(div);\cb1 \
\cb3 \'a0 \'a0 \}\cb1 \
\cb3 \}\cb1 \
\
\cb3 init();}