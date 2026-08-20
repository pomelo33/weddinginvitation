const state = { photo: null, photoUrl: null, photoLoadId: 0, audience: 'friends', signoffAuto: true, messageAuto: true };
const defaults = { recipient:'', groom:'新郎', bride:'新娘', date:'2026年10月02日', lunar:'农历X月XX', location:'XXXXXXXX', message:'良辰已定，幸福将至。诚邀你来参加我们的婚礼，与我们分享喜悦，共同见证人生中珍贵而美好的时刻。', signoff:'新郎、新娘 敬邀' };
const profiles = {
  friends: { recipient:'', greeting:'诚邀好友相聚', welcome:'一起见证幸福时刻', message:(g,b)=>`良辰已定，幸福将至。诚邀你来参加${g}与${b}的婚礼，与我们分享喜悦，共同见证人生中珍贵而美好的时刻。`, signoff:(g,b)=>`${g}、${b} 敬邀` },
  parents: { recipient:'', greeting:'谨邀亲朋莅临', welcome:'共贺儿女新婚之喜', message:(g,b)=>`承蒙亲友多年关爱，今逢${g}与${b}喜结良缘。谨备喜宴，诚邀您携家人莅临，共贺新婚之喜，同享幸福良辰。`, signoff:()=>`双方父母 谨邀` },
  elders: { recipient:'', greeting:'恭请尊长光临', welcome:'敬候您见证幸福良辰', message:(g,b)=>`${g}与${b}谨定良辰举行结婚典礼。承蒙您一直以来的关爱与教诲，恭请拨冗莅临，见证佳缘并赐予祝福。`, signoff:(g,b)=>`${g}、${b} 敬邀` },
  colleagues: { recipient:'', greeting:'诚邀同仁相聚', welcome:'共度我们的幸福时刻', message:(g,b)=>`我们即将步入婚姻的幸福旅程。诚挚邀请您参加${g}与${b}的婚礼，感谢一路以来的支持与陪伴，期待与您共享喜悦。`, signoff:(g,b)=>`${g}、${b} 敬邀` },
  custom: { recipient:'', greeting:'诚邀您携家人', welcome:'一起见证幸福时刻', message:()=>defaults.message, signoff:()=>`敬邀` }
};
const $ = id => document.getElementById(id);
const canvas = $('inviteCanvas'); const ctx = canvas.getContext('2d');
try { localStorage.removeItem('wedding_api_key'); } catch {}
function val(id){ return $(id).value.trim(); }
function fitCover(image, x, y, w, h){ const scale=Math.max(w/image.width,h/image.height); const sw=w/scale, sh=h/scale; const sx=(image.width-sw)/2, sy=(image.height-sh)/2; ctx.drawImage(image,sx,sy,sw,sh,x,y,w,h); }
function text(t,x,y,size,color,opts={}){ ctx.save(); ctx.fillStyle=color; ctx.font=`${opts.italic?'italic ':''}${opts.weight||500} ${size}px ${opts.family||'Arial, sans-serif'}`; ctx.textAlign=opts.align||'left'; ctx.textBaseline=opts.baseline||'alphabetic'; ctx.fillText(t,x,y); ctx.restore(); }
function fitText(t,x,y,maxWidth,size,color,opts={}){ let s=size; ctx.save(); while(s>10){ctx.font=`${opts.italic?'italic ':''}${opts.weight||500} ${s}px ${opts.family||'Arial, sans-serif'}`; if(ctx.measureText(t).width<=maxWidth)break; s-=1;} ctx.restore(); text(t,x,y,s,color,opts); }
function wrapText(t,maxWidth,size,opts={}){ const chars=[...t]; const lines=[]; let current=''; ctx.save(); ctx.font=`${opts.weight||500} ${size}px ${opts.family||'Arial, sans-serif'}`; chars.forEach(char=>{ const next=current+char; if(current && ctx.measureText(next).width>maxWidth){lines.push(current); current=char;}else current=next; }); if(current) lines.push(current); ctx.restore(); return lines; }
function profile(){ return profiles[state.audience] || profiles.custom; }
function line(x1,y1,x2,y2,color,width=2){ctx.save();ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();ctx.restore();}
function firework(cx,cy,r,color){ctx.save();ctx.strokeStyle=color;ctx.lineWidth=3;for(let i=0;i<12;i++){const a=i*Math.PI/6;const r1=r*.25,r2=r*(.72+(i%2)*.18);ctx.beginPath();ctx.moveTo(cx+Math.cos(a)*r1,cy+Math.sin(a)*r1);ctx.lineTo(cx+Math.cos(a)*r2,cy+Math.sin(a)*r2);ctx.stroke();}ctx.restore();}
function balloon(cx,cy,scale,color){ctx.save();ctx.strokeStyle=color;ctx.lineWidth=3;ctx.fillStyle='transparent';ctx.beginPath();ctx.ellipse(cx,cy,30*scale,40*scale,0,0,Math.PI*2);ctx.stroke();line(cx,cy+40*scale,cx-8*scale,cy+95*scale,color,2);ctx.restore();}
function weddingPattern(){
  const family='KaiTi, STKaiti, serif';
  const stepX=165, stepY=145;
  ctx.save();
  for(let row=0,y=72;y<canvas.height;y+=stepY,row++){
    const offset=row%2 ? 82 : 0;
    for(let x=36-offset;x<canvas.width;x+=stepX){
      const onLeft=x<640;
      text('囍',x,y,50,onLeft?'#d0a84f':'#3f1118',{align:'center',weight:700,family});
    }
  }
  ctx.restore();
}
function drawOriginalArtwork(){
  const wine='#762d30', gold='#c99b2d', cream='#f7dfac', dark='#6f2227';
  ctx.fillStyle=wine; ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.save(); ctx.globalAlpha=.07; weddingPattern(); ctx.restore();
  ctx.strokeStyle=gold; ctx.lineWidth=4; ctx.strokeRect(643,33,584,1013);
  ctx.strokeStyle='#a77824'; ctx.lineWidth=2; ctx.strokeRect(650,40,570,999);
  ctx.fillStyle='#faf8f3'; ctx.fillRect(61,145,532,790);
  if(state.photo){
    ctx.save();
    ctx.beginPath(); ctx.rect(61,145,532,790); ctx.clip();
    fitCover(state.photo,61,145,532,790);
    ctx.restore();
  } else {
    text('放照片',327,560,30,'#252025',{align:'center',weight:500,family:'KaiTi, STKaiti, serif'});
  }
  ctx.strokeStyle='#e6c56d'; ctx.lineWidth=3; ctx.strokeRect(61,145,532,790);
  ctx.save(); ctx.globalAlpha=.16;
  firework(715,520,55,dark); firework(1170,500,48,dark);
  ctx.restore();
  ctx.save(); ctx.globalAlpha=.28; balloon(1170,950,.65,gold); balloon(1200,930,.5,gold); ctx.restore();
  text('✦',685,540,15,gold,{align:'center'}); text('✦',1180,525,15,gold,{align:'center'});
}
function draw(){
  drawOriginalArtwork();
  const cream='#fff0c7', gold='#e2bd61', center=935, family='KaiTi, STKaiti, serif';
  const groom=val('groom') || '新郎';
  const bride=val('bride') || '新娘';
  text('婚礼邀请函',330,82,36,cream,{weight:700,align:'center',family}); text('WEDDING INVITATION',330,119,25,cream,{weight:600,align:'center',family:'Georgia, serif'});
  const greeting=val('inviteGreeting') || profile().greeting; const welcome=val('welcomeLine') || profile().welcome; const recipient=val('recipient');
  fitText(recipient ? `致 ${recipient}` : '诚 挚 邀 请',center,78,470,23,gold,{align:'center',weight:600,family});
  fitText(greeting,center,127,480,34,cream,{align:'center',weight:700,family});
  fitText(welcome,center,169,470,24,cream,{align:'center',weight:600,family});
  line(735,200,1135,200,gold,2);
  text('新郎',805,244,21,gold,{align:'center',weight:600,family});
  text('♥',center,276,44,gold,{align:'center',family:'Georgia, serif'});
  text('新娘',1065,244,21,gold,{align:'center',weight:600,family});
  fitText(groom,805,286,185,36,cream,{align:'center',weight:700,family});
  fitText(bride,1065,286,185,36,cream,{align:'center',weight:700,family});
  text('结 婚 典 礼',center,326,24,gold,{align:'center',weight:600,family});
  line(790,345,1080,345,'#bd8734',1);
  text('时间',center,395,28,cream,{align:'center',weight:600,family});
  const weddingTime=[val('date'),val('lunar')].filter(Boolean).join('  ·  ') || '时间待定';
  fitText(weddingTime,center,438,480,24,cream,{align:'center',weight:600,family});
  text('地点',center,504,28,cream,{align:'center',weight:600,family});
  fitText(val('location') || '地点待定',center,548,470,25,cream,{align:'center',weight:700,family});
  line(735,584,1135,584,gold,2);
  text('良 辰 之 约',center,635,24,gold,{align:'center',weight:700,family});
  let messageSize=22; let msgLines=wrapText(val('message'),470,messageSize,{family});
  while(msgLines.length>4 && messageSize>17){messageSize-=1; msgLines=wrapText(val('message'),470,messageSize,{family});}
  const lineHeight=messageSize+10, messageTop=682;
  msgLines.slice(0,4).forEach((lineText,i)=>text(lineText,center,messageTop+i*lineHeight,messageSize,cream,{align:'center',weight:500,family}));
  const signoff=val('signoff') || profile().signoff(groom,bride);
  line(820,875,1050,875,'#bd8734',1);
  fitText(signoff,center,921,400,22,cream,{align:'center',weight:600,family});
  text('敬 候 光 临',center,966,18,gold,{align:'center',weight:600,family});
}
draw();
['recipient','inviteGreeting','welcomeLine','date','lunar','location'].forEach(id=>$(id).addEventListener('input',draw));
$('message').addEventListener('input',()=>{state.messageAuto=false; draw();});
['groom','bride'].forEach(id=>$(id).addEventListener('input',()=>{
  const groom=val('groom') || '新郎';
  const bride=val('bride') || '新娘';
  if(state.signoffAuto)$('signoff').value=profile().signoff(groom,bride);
  if(state.messageAuto)$('message').value=profile().message(groom,bride);
  draw();
}));
$('signoff').addEventListener('input',()=>{state.signoffAuto=false; draw();});
$('audienceProfile').addEventListener('change',e=>{ const groom=val('groom') || '新郎'; const bride=val('bride') || '新娘'; state.audience=e.target.value; state.signoffAuto=true; state.messageAuto=true; const p=profile(); $('inviteGreeting').value=p.greeting; $('welcomeLine').value=p.welcome; $('message').value=p.message(groom,bride); $('signoff').value=p.signoff(groom,bride); draw(); });
$('photoInput').addEventListener('change',e=>{
  const file=e.target.files?.[0]; if(!file)return;
  const allowed=['image/jpeg','image/png','image/webp'];
  if(!allowed.includes(file.type) || file.size>20*1024*1024){ $('photoStatus').textContent='请选择 20MB 以内的 JPG、PNG 或 WebP'; e.target.value=''; return; }
  const loadId=++state.photoLoadId;
  const url=URL.createObjectURL(file); const img=new Image();
  img.onload=()=>{
    if(loadId!==state.photoLoadId){ URL.revokeObjectURL(url); return; }
    if(state.photoUrl) URL.revokeObjectURL(state.photoUrl);
    state.photo=img; state.photoUrl=url; $('photoStatus').textContent=`已载入：${file.name}`; draw();
  };
  img.onerror=()=>{ URL.revokeObjectURL(url); if(loadId===state.photoLoadId)$('photoStatus').textContent='照片读取失败，请换一张 JPG、PNG 或 WebP'; };
  img.src=url;
});
$('clearPhoto').addEventListener('click',()=>{state.photoLoadId++; if(state.photoUrl)URL.revokeObjectURL(state.photoUrl); state.photo=null; state.photoUrl=null; $('photoInput').value=''; $('photoStatus').textContent='未上传照片'; draw();});
$('resetBtn').addEventListener('click',()=>{Object.entries(defaults).forEach(([k,v])=>$(k).value=v); $('audienceProfile').value='friends'; state.audience='friends'; state.signoffAuto=true; state.messageAuto=true; $('inviteGreeting').value=profiles.friends.greeting; $('welcomeLine').value=profiles.friends.welcome; $('message').value=profiles.friends.message(val('groom'),val('bride')); $('signoff').value=profiles.friends.signoff(val('groom'),val('bride')); draw();});
const formatLabels = {'image/webp':'WebP','image/jpeg':'JPEG','image/png':'PNG'};
const extension = {'image/webp':'webp','image/jpeg':'jpg','image/png':'png'};
function updateExportInfo(){
  const format=$('exportFormat').value; const quality=Number($('exportQuality').value); const label=formatLabels[format];
  $('resolutionText').textContent=`导出：${canvas.width} × ${canvas.height} ${label}`;
  $('exportQuality').disabled=format==='image/png';
  $('qualityField').classList.toggle('is-disabled',format==='image/png');
  $('exportInfo').textContent = format==='image/png'
    ? `PNG 按 ${canvas.width} × ${canvas.height} 无损导出，质量选项不生效；有照片时通常约 2–6MB，适合留档。`
    : `${label} ${Math.round(quality*100)}%，按实时预览的 ${canvas.width} × ${canvas.height} 直接导出；通常约 300KB–2MB，适合微信和手机分享。`;
}
$('exportFormat').addEventListener('change',updateExportInfo);
$('exportQuality').addEventListener('change',updateExportInfo);
updateExportInfo();
$('exportBtn').addEventListener('click',()=>{
  const format=$('exportFormat').value; const quality=Number($('exportQuality').value);
  $('exportBtn').disabled=true; $('exportBtn').textContent='正在导出...';
  canvas.toBlob(blob=>{
    if(!blob){ $('exportBtn').disabled=false; $('exportBtn').textContent='⇩ 导出请柬'; $('exportInfo').textContent='当前浏览器不支持该图片格式，请更换 WebP、JPEG 或 PNG。'; return; }
    const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.download=`wedding-invitation.${extension[format]}`; a.href=url; a.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000); $('exportBtn').disabled=false; $('exportBtn').textContent='⇩ 导出请柬';
  },format,format==='image/png'?undefined:quality);
});
