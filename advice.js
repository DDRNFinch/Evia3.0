(function(){'use strict';
const app=document.getElementById('eviaApp');
const anchor=document.getElementById('eviaAnchor');
if(!app||!anchor)return;
const style=document.createElement('style');
style.textContent='.evia-advice{position:absolute;z-index:19;left:50%;top:calc(50% + clamp(88px,24vw,108px));transform:translateX(-50%);width:min(88vw,430px);padding:11px 14px;border:1px solid rgba(218,181,40,.18);border-radius:15px;background:rgba(255,249,218,.96);box-shadow:0 7px 20px rgba(30,45,50,.06);text-align:center;opacity:0;pointer-events:none;transition:top 500ms cubic-bezier(.22,1,.36,1),transform 500ms cubic-bezier(.22,1,.36,1),opacity .25s ease}.evia-advice.visible{opacity:1}.evia-advice b{display:block;margin-bottom:3px;font-size:.76rem;color:#806a16}.evia-advice span{display:block;color:#625d42;font-size:.81rem;line-height:1.38;min-height:1.38em}.evia-advice .letter{display:inline-block;opacity:0;transform:translateX(-7px);animation:eviaLetter .035s ease-out forwards}.evia-app.is-open .evia-advice{top:calc(max(18px,env(safe-area-inset-top)) + 105px)}@keyframes eviaLetter{to{opacity:1;transform:translateX(0)}}@media(max-width:420px){.evia-advice{width:calc(100vw - 28px);padding:10px 12px}.evia-advice span{font-size:.78rem}}';
document.head.appendChild(style);
const advice=document.createElement('div');
advice.id='eviaAdvice';advice.className='evia-advice';advice.setAttribute('aria-live','polite');
advice.innerHTML='<b>Evia’s advice</b><span></span>';anchor.insertAdjacentElement('afterend',advice);
const label=advice.querySelector('b'),text=advice.querySelector('span');
let timer=0;
function tipFor(value){const t=String(value||'').toLowerCase();if(/wall tie|wall ties|cavity/.test(t))return 'For wall ties, take the photo down a clean cavity so I can clearly see the tie position and how it connects the two leaves.';if(/measure|set out|measurement|dimension/.test(t))return 'For measuring, use your tape measure and make sure the numbers are clearly visible. Show exactly what you are measuring.';if(/ppe|personal protective|safety|hazard|control/.test(t))return 'Before you take the photo, make sure you are wearing all of the required PPE and that the work area is safe.';if(/mortar|mix/.test(t))return 'For mortar, show the materials, mixing method and finished consistency clearly. Include the gauge or ratio where you can.';if(/joint|pointing/.test(t))return 'For joint finishes, get close enough for me to see the profile and finish clearly. A close-up is better than a distant photo.';if(/lintel|opening/.test(t))return 'For an opening or lintel, show the full opening and then a closer view of the bearing and surrounding masonry.';if(/insulation|dpc|tray|weep|fire stopping|firestop/.test(t))return 'For hidden cavity details, take the photo before they are covered. Make sure the full detail is visible and in focus.';if(/cut|cutting/.test(t))return 'For cutting, show the measurement or mark, the tool you selected and the safe cutting setup.';if(/repair|defect/.test(t))return 'Take a clear before photo of the defect, then show the repair and the finished result.';if(/solid wall|bond/.test(t))return 'Stand square to the wall so the bond and workmanship are easy to see. Include enough of the wall to show the pattern.';if(/pier|decorative|feature/.test(t))return 'Take a clear photo showing the whole feature, then a closer view of the important bond or detail.';if(/protect|waste|complete|quality/.test(t))return 'Take a clear final photo showing the completed work, the quality checks and that the area has been left safe and tidy.';return 'Take a clear, well-lit photo showing the work itself and the important detail Evia is asking you to evidence.'}
function hide(){clearTimeout(timer);advice.classList.remove('visible');}
function show(newLabel,value){clearTimeout(timer);advice.classList.remove('visible');text.innerHTML='';label.textContent=newLabel;const chars=[...String(value||'')];chars.forEach((ch,i)=>{const s=document.createElement('span');s.className='letter';s.textContent=ch===' '?'\u00a0':ch;s.style.animationDelay=(i*0.035)+'s';text.appendChild(s)});requestAnimationFrame(()=>advice.classList.add('visible'));}
function update(){
 const content=document.getElementById('content');if(!content)return;
 if(!app.classList.contains('is-open')){hide();return;}
 const body=content.textContent||'';
 const intro=content.querySelector('.guide-card');
 const dutyStart=/What do you want to work on today\?|What are you working on\?/.test(body);
 const activityStart=!!intro||/Let’s work on/.test(body);
 if(activityStart){show('Evia’s advice',tipFor(body));return;}
 if(dutyStart){show('Evia’s advice','Choose a duty and I’ll guide you through the evidence one step at a time.');return;}
 hide();
}
const observer=new MutationObserver(()=>requestAnimationFrame(update));
observer.observe(document.getElementById('content'),{childList:true,subtree:true,characterData:true});
anchor.addEventListener('click',()=>setTimeout(update,30));
update();
})();