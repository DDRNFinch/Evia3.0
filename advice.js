(function(){'use strict';
const app=document.getElementById('eviaApp');
const anchor=document.getElementById('eviaAnchor');
if(!app||!anchor)return;
const advice=document.createElement('div');
advice.id='eviaAdvice';
advice.className='evia-advice';
advice.setAttribute('aria-live','polite');
advice.innerHTML='<b>Evia’s advice</b><span></span>';
anchor.insertAdjacentElement('afterend',advice);
const text=advice.querySelector('span');
function tipFor(value){
 const t=String(value||'').toLowerCase();
 if(/wall tie|wall ties|cavity/.test(t))return 'For wall ties, take the photo down a clean cavity so I can clearly see the tie position and how it connects the two leaves.';
 if(/measure|set out|measurement|dimension/.test(t))return 'For measuring, use your tape measure and make sure the numbers are clearly visible. Show exactly what you are measuring.';
 if(/ppe|personal protective|safety|hazard|control/.test(t))return 'Before you take the photo, make sure you are wearing all of the required PPE and that the work area is safe.';
 if(/mortar|mix/.test(t))return 'For mortar, show the materials, mixing method and finished consistency clearly. Include the gauge or ratio where you can.';
 if(/joint|pointing/.test(t))return 'For joint finishes, get close enough for me to see the profile and finish clearly. A close-up is better than a distant photo.';
 if(/lintel|opening/.test(t))return 'For an opening or lintel, show the full opening and then a closer view of the bearing and surrounding masonry.';
 if(/insulation|dpc|tray|weep|fire stopping|firestop/.test(t))return 'For hidden cavity details, take the photo before they are covered. Make sure the full detail is visible and in focus.';
 if(/cut|cutting/.test(t))return 'For cutting, show the measurement or mark, the tool you selected and the safe cutting setup.';
 if(/repair|defect/.test(t))return 'Take a clear before photo of the defect, then show the repair and the finished result.';
 if(/solid wall|bond/.test(t))return 'Stand square to the wall so the bond and workmanship are easy to see. Include enough of the wall to show the pattern.';
 if(/pier|decorative|feature/.test(t))return 'Take a clear photo showing the whole feature, then a closer view of the important bond or detail.';
 if(/protect|waste|complete|quality/.test(t))return 'Take a clear final photo showing the completed work, the quality checks and that the area has been left safe and tidy.';
 return 'Take a clear, well-lit photo showing the work itself and the important detail Evia is asking you to evidence.';
}
function set(label,value){text.textContent=value;advice.querySelector('b').textContent=label;}
function update(){
 const content=document.getElementById('content');
 if(!content)return;
 const speech=content.querySelector('.evia-speech');
 const photoPrompt=speech?.querySelector('strong')?.textContent||'';
 const question=content.querySelector('.question-card h2')?.textContent||'';
 const body=content.textContent||'';
 if(!app.classList.contains('is-open')){set('Evia’s advice','Tap me and I’ll guide you through your evidence one step at a time.');return;}
 if(photoPrompt){set('Evia’s advice',tipFor(photoPrompt));return;}
 if(question){set('Evia’s advice', 'Answer in your own words. Explain what you did, how you did it and why, using the question to guide you.');return;}
 if(/This duty is complete/.test(body)){set('Evia’s advice','This duty is complete. Choose another duty when you are ready.');return;}
 if(/All done\./.test(body)){set('Evia’s advice','That evidence is saved on your device. I’ll remember the KSBs you have already covered.');return;}
 if(/What do you want to work on today\?/.test(body)){set('Evia’s advice','Choose a duty and I’ll guide you through the evidence one step at a time.');return;}
 if(/Let’s work on/.test(body)){set('Evia’s advice',tipFor(body));return;}
 if(/What are you working on\?/.test(body)){set('Evia’s advice','Choose the activity you are doing. I’ll show you exactly what evidence to capture.');return;}
 set('Evia’s advice','I’ll guide you through each step. Take your time and make sure the evidence clearly shows the work.');
}
const observer=new MutationObserver(()=>requestAnimationFrame(update));
observer.observe(document.getElementById('content'),{childList:true,subtree:true,characterData:true});
anchor.addEventListener('click',()=>setTimeout(update,30));
update();
})();