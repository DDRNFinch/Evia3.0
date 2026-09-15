(function(){
'use strict';
const COURSE_KEY='evia3_naxos_courses_v1';
const QR_SOURCES=[
  {main:'https://cdnjs.cloudflare.com/ajax/libs/qr-scanner/1.4.2/qr-scanner.umd.min.js',worker:'https://cdnjs.cloudflare.com/ajax/libs/qr-scanner/1.4.2/qr-scanner-worker.min.js'},
  {main:'https://cdn.jsdelivr.net/npm/qr-scanner@1.4.2/qr-scanner.umd.min.js',worker:'https://cdn.jsdelivr.net/npm/qr-scanner@1.4.2/qr-scanner-worker.min.js'}
];
const read=()=>{try{return JSON.parse(localStorage.getItem(COURSE_KEY)||'[]')}catch{return[]}};
const write=courses=>localStorage.setItem(COURSE_KEY,JSON.stringify(courses));
window.EVIA_NAXOS={
  getCourses(){return read()},
  getCourse(id){return read().find(c=>c.course?.id===id)||null},
  async addPackage(pkg){
    if(!pkg||pkg.schema!=='naxos4-course-v1'||!pkg.course?.id||!Array.isArray(pkg.course.units))throw new Error('This QR code is not a valid Naxos course.');
    const courses=read();const existing=courses.findIndex(c=>c.course.id===pkg.course.id);
    const record={importedAt:new Date().toISOString(),course:pkg.course};
    if(existing>=0)courses[existing]=record;else courses.push(record);write(courses);window.dispatchEvent(new CustomEvent('EVIA_COURSES_CHANGED'));return record;
  },
  async scanCourse(){
    if(!window.QrScanner)await loadScanner();
    if(!window.QrScanner)throw new Error('QR scanner could not be loaded.');
    return new Promise((resolve,reject)=>{
      const overlay=document.createElement('div');overlay.className='evia-qr-overlay';overlay.innerHTML='<div class="evia-qr-card"><button class="evia-qr-close" type="button" aria-label="Close">×</button><p class="evia-qr-kicker">ADD COURSE</p><h2>Scan the Naxos QR code</h2><p>Point the camera at the course QR code shown in Naxos.</p><div class="evia-qr-video-wrap"><video class="evia-qr-video" playsinline></video></div><p class="evia-qr-status">Starting camera…</p></div>';document.body.appendChild(overlay);
      const video=overlay.querySelector('video'),status=overlay.querySelector('.evia-qr-status');let scanner,closed=false;
      const finish=(err,value)=>{if(closed)return;closed=true;try{scanner?.stop();scanner?.destroy()}catch{}overlay.remove();err?reject(err):resolve(value)};
      overlay.querySelector('.evia-qr-close').onclick=()=>finish(new Error('Scan cancelled.'));
      const onDecode=result=>{const raw=typeof result==='string'?result:result?.data;if(!raw)return;handlePayload(raw).then(pkg=>finish(null,pkg)).catch(e=>{status.textContent=e.message||'That QR code could not be imported.'})};
      try{
        scanner=new window.QrScanner(video,onDecode,{returnDetailedScanResult:true,highlightScanRegion:true,highlightCodeOutline:true,onDecodeError:()=>{}});
        scanner.start().then(()=>status.textContent='Camera ready — scan the QR code.').catch(e=>finish(e));
      }catch(e){finish(e)}
    });
  }
};
async function loadScanner(){
  for(const source of QR_SOURCES){
    try{
      await loadScript(source.main);
      if(window.QrScanner){
        window.QrScanner.WORKER_PATH=source.worker;
        return window.QrScanner;
      }
    }catch(e){}
  }
  throw new Error('QR scanner could not be loaded.');
}
function loadScript(src){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=resolve;s.onerror=()=>reject(new Error('QR scanner could not be loaded.'));document.head.appendChild(s)})}
function injectPackage(url){return new Promise((resolve,reject)=>{const done=e=>{window.removeEventListener('NAXOS4_COURSE_PACKAGE_READY',ready);window.removeEventListener('NAXOS4_COURSE_PACKAGE_ERROR',error);e.type==='ok'?resolve(e.detail):reject(new Error(e.detail?.message||'Course package could not be loaded.'))};const ready=e=>done({type:'ok',detail:e.detail});const error=e=>done({type:'error',detail:e.detail});const s=document.createElement('script');s.src=url;s.onload=()=>{};s.onerror=()=>done({type:'error',detail:{message:'The Naxos course package could not be reached.'}});document.head.appendChild(s)})}
async function handlePayload(raw){let u;try{u=new URL(raw)}catch{throw new Error('That is not a Naxos course QR code.')}if(u.protocol!=='naxos4:'||u.hostname!=='course')throw new Error('That QR code is not a Naxos course.');const packageUrl=u.searchParams.get('package');const courseId=u.searchParams.get('course');if(!packageUrl||!courseId)throw new Error('The Naxos course QR code is incomplete.');const p=new URL(packageUrl);if(p.protocol!=='https:'||!p.pathname.endsWith('/naxos-package.js'))throw new Error('The course package source is not trusted.');const pkg=await injectPackage(packageUrl);if(pkg.course.id!==courseId)throw new Error('The QR code and course package do not match.');return window.EVIA_NAXOS.addPackage(pkg)}
})();
