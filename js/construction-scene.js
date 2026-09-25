/* A one-shot, exterior construction sequence. No shared scene or model with About. */
(() => {
  const host=document.getElementById('constructionScene'),section=document.getElementById('statement');
  if(!host || typeof THREE==='undefined' || typeof gsap==='undefined')return;
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  let renderer;
  try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});}
  catch(_){host.style.background='url("assets/images/residential-entrance.jpg") center / cover';section.querySelectorAll('li').forEach((li,i)=>li.classList.toggle('is-current',i===3));return;}
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.outputEncoding=THREE.sRGBEncoding;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.88;
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.localClippingEnabled=true;
  host.appendChild(renderer.domElement);
  const scene=new THREE.Scene();scene.background=new THREE.Color(0xbfc5be);scene.fog=new THREE.Fog(0xbfc5be,35,85);
  const camera=new THREE.PerspectiveCamera(36,1,.1,120);
  const target=new THREE.Vector3(0,2.65,0);
  const building=new THREE.Group();scene.add(building);
  scene.add(new THREE.HemisphereLight(0xe9f2f4,0x797961,.72));
  const sun=new THREE.DirectionalLight(0xffe3b7,1.65);sun.position.set(-10,17,11);sun.castShadow=true;
  Object.assign(sun.shadow.camera,{left:-18,right:18,top:16,bottom:-16,near:.5,far:55});sun.shadow.mapSize.set(2048,2048);sun.shadow.bias=-.00025;sun.shadow.normalBias=.03;sun.shadow.radius=3;scene.add(sun);
  const bounce=new THREE.DirectionalLight(0xbacdd7,.3);bounce.position.set(8,6,-8);scene.add(bounce);
  // Soft procedural sky/reflections: no external or invented project photography.
  const sky=document.createElement('canvas');sky.width=1024;sky.height=512;const ctx=sky.getContext('2d');
  const skyGradient=ctx.createLinearGradient(0,0,0,512);skyGradient.addColorStop(0,'#627e91');skyGradient.addColorStop(.42,'#dce4df');skyGradient.addColorStop(.53,'#ece6d2');skyGradient.addColorStop(.56,'#777d67');skyGradient.addColorStop(1,'#303a31');ctx.fillStyle=skyGradient;ctx.fillRect(0,0,1024,512);
  for(let i=0;i<13;i++){ctx.fillStyle=i%2?'#46554b':'#697769';ctx.fillRect(i*83,273-(i%4)*10,25+(i%3)*12,100);}
  const skyTexture=new THREE.CanvasTexture(sky);skyTexture.mapping=THREE.EquirectangularReflectionMapping;skyTexture.encoding=THREE.sRGBEncoding;
  const pmrem=new THREE.PMREMGenerator(renderer);const environment=pmrem.fromEquirectangular(skyTexture);scene.environment=environment.texture;pmrem.dispose();skyTexture.dispose();
  let seed=9471;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  const stone=document.createElement('canvas');stone.width=256;stone.height=256;const sc=stone.getContext('2d');
  sc.fillStyle='#b7b09f';sc.fillRect(0,0,256,256);
  for(let i=0;i<19000;i++){const n=Math.floor(145+random()*55);sc.fillStyle=`rgba(${n+12},${n+8},${n},.18)`;sc.fillRect(random()*256,random()*256,1+random()*4,1);}
  sc.strokeStyle='#8f8a7b';sc.lineWidth=.6;for(let y=0;y<257;y+=64){sc.beginPath();sc.moveTo(0,y);sc.lineTo(256,y);sc.stroke();}
  const stoneTexture=new THREE.CanvasTexture(stone);stoneTexture.wrapS=stoneTexture.wrapT=THREE.RepeatWrapping;stoneTexture.repeat.set(2,3);stoneTexture.encoding=THREE.sRGBEncoding;
  const stageMaterials={foundation:[],columns:[],floors:[],facade:[],glass:[],details:[],landscape:[]};
  const make=(color,stage,opts={})=>{
    const plane=new THREE.Plane(new THREE.Vector3(0,-1,0),-.2);
    const mat=new THREE.MeshStandardMaterial({color,roughness:.78,...opts,clippingPlanes:stage?[plane]:[],clipShadows:true});
    mat.color.convertSRGBToLinear();if(stage)stageMaterials[stage].push(mat);return mat;
  };
  const concrete=make(0xb8b09b,'floors'),foundation=make(0xada998,'foundation'),column=make(0xb8b5a8,'columns');
  const cladding=make(0xa49a80,'facade',{map:stoneTexture}),charcoal=make(0x262d2c,'details',{roughness:.45,metalness:.5});
  const glass=make(0x304a4d,'glass',{roughness:.13,metalness:.78,envMapIntensity:.9});
  const railing=make(0x748b85,'details',{transparent:true,opacity:.42,roughness:.1,metalness:.55,depthWrite:false});
  const timber=make(0x695342,'details',{roughness:.8}),soil=make(0x4c5140,'landscape');
  const leafMat=make(0x3f552b,'landscape',{roughness:1});const trunkMat=make(0x645d48,'landscape');
  function box(w,h,d,x,y,z,mat,parent=building){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
  const ground=box(180,.12,180,0,-.32,0,make(0x787f6c,null),scene);
  box(18,.07,13,0,-.21,0,make(0x98988b,null),scene);
  // Site plane, then structural members, continuous slabs and recessed facade bays.
  box(10.6,.25,6.6,0,-.03,0,foundation);
  box(11.4,.08,2.0,0,-.1,3.6,foundation);
  for(const x of [-4.5,-1.5,1.5,4.5])for(const z of [-2.4,2.4])box(.24,6.45,.24,x,3.22,z,column);
  for(const y of [.24,2.38,4.52,6.66])box(10,.18,6.05,0,y,0,concrete);
  box(.44,6.36,5.5,-4.7,3.39,-.12,cladding);
  box(9.5,6.36,.24,0,3.39,-2.58,cladding);
  box(1.32,6.36,.3,3.92,3.39,2.42,cladding);
  // Reveal glass by floor. The recessed glazing makes the balconies read as depth.
  for(let floor=0;floor<3;floor++){
    const y=.34+floor*2.14;
    for(let bay=0;bay<4;bay++){
      const x=-3.58+bay*2.15;
      box(1.99,1.94,.04,x,y+.99,2.28,glass);
      for(const dx of [-1.01,0,1.01])box(.035,1.96,.075,x+dx,y+.99,2.32,charcoal);
      for(const dy of [.04,1.94])box(2.04,.035,.075,x,y+dy,2.32,charcoal);
    }
    // Exposed side glazing and fine railings on two projecting terraces.
    box(.04,1.94,4.7,4.62,y+.99,-.12,glass);
    for(const z of [-2.4,-1.2,0,1.2,2.28])box(.065,1.96,.035,4.66,y+.99,z,charcoal);
    if(floor>0){
      box(8.9,.83,.025,-.15,y+.43,2.95,railing);
      box(8.9,.03,.045,-.15,y+.86,2.95,charcoal);
      for(let x=-4.6;x<4.5;x+=1.48)box(.028,.85,.05,x,y+.43,2.95,charcoal);
    }
    // Slender vertical shading at the stone end pier.
    for(let x=3.35;x<4.65;x+=.16)box(.045,1.94,.34,x,y+.99,2.65,timber);
  }
  box(10.35,.12,6.4,0,6.84,0,concrete);
  for(let i=0;i<3;i++)box(3.1,.08,1.2-i*.27,-1.0,-.08+i*.08,3.48-i*.18,foundation);
  // Warm entrance canopy and two deeply recessed doors.
  box(3.7,.10,1.35,-1.0,2.12,3.04,charcoal);
  box(2.7,.018,.06,-1,2.058,3.51,make(0xffe5b0,'details',{emissive:0xffc574,emissiveIntensity:.5}));
  for(const x of [-1.52,-.48])box(.028,.66,.065,x,1.05,2.38,charcoal);
  // Landscape arrives last: planted edges and two sculptural olive trees.
  const plants=new THREE.Group();scene.add(plants);
  for(const x of [-6.5,6.3]){box(1.7,.48,7.5,x,.03,.4,cladding,plants);box(1.5,.04,7.3,x,.30,.4,soil,plants);}
  box(7.2,.18,1.2,2,.05,5.1,foundation,plants);box(7,.05,1,2,.17,5.1,soil,plants);
  const leafGeometry=new THREE.IcosahedronGeometry(1,2);const foliage=new THREE.InstancedMesh(leafGeometry,leafMat,245);foliage.castShadow=true;foliage.receiveShadow=true;plants.add(foliage);
  const dummy=new THREE.Object3D();let leafIndex=0;
  function tree(x,z,size){
    const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.065,.12,2.8*size,7),trunkMat);trunk.position.set(x,1.4*size,z);trunk.castShadow=true;plants.add(trunk);
    for(let i=0;i<100;i++){
      const angle=random()*Math.PI*2,r=Math.sqrt(random())*1.25*size;
      dummy.position.set(x+Math.cos(angle)*r,2.55*size+(random()-.3)*1.45*size,z+Math.sin(angle)*r*.75);
      dummy.scale.setScalar((.14+random()*.22)*size);dummy.scale.y*=.7;dummy.updateMatrix();foliage.setMatrixAt(leafIndex++,dummy.matrix);
    }
  }
  tree(-6.5,2.4,1.15);tree(6.3,-.2,1.3);
  for(let i=0;i<45;i++){
    const x=i<25?-1.4+random()*6.8:(i%2?6.3:-6.5),z=i<25?5.1+(random()-.5)*.55:-2.6+random()*6.4;
    dummy.position.set(x,.45+random()*.18,z);dummy.scale.set(.25+random()*.22,.28+random()*.15,.26+random()*.2);dummy.updateMatrix();foliage.setMatrixAt(leafIndex++,dummy.matrix);
  }foliage.instanceMatrix.needsUpdate=true;
  // Quiet paving joints, no blueprint grid in this scene.
  const pavement=[];for(let x=-9;x<=9;x+=1.5)pavement.push(x,-.16,3.5,x,-.16,7);
  for(let z=3.5;z<=7;z+=1.2)pavement.push(-9,-.16,z,9,-.16,z);
  const pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.Float32BufferAttribute(pavement,3));scene.add(new THREE.LineSegments(pg,new THREE.LineBasicMaterial({color:0x7c8076,transparent:true,opacity:.4})));
  // Ground footprint is the opening image, then recedes beneath the finished work.
  const outline=new THREE.EdgesGeometry(new THREE.BoxGeometry(10.6,.02,6.6));const footprint=new THREE.LineSegments(outline,new THREE.LineBasicMaterial({color:0xe1d4b7,transparent:true,opacity:.7}));footprint.position.y=-.01;scene.add(footprint);
  const stages=[...section.querySelectorAll('.construction-progress li')];
  function mark(index){stages.forEach((li,i)=>{li.classList.toggle('is-current',i===index);if(i===index)li.setAttribute('aria-current','step');else li.removeAttribute('aria-current');});section.dataset.stage=String(index+1);}
  const state={camera:0};let inView=false;
  function frame(){
    const mobile=host.clientWidth<650;
    camera.position.set(mobile?25:15.7-state.camera*.8,mobile?18.5:9.6-state.camera*.45,mobile?43:20.5-state.camera);
    camera.lookAt(target);renderer.render(scene,camera);
  }
  function resize(){const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;
    camera.setViewOffset(w,h,w<650?0:-w*.22,w<650?-h*.19:0,w,h);camera.updateProjectionMatrix();frame();}
  new ResizeObserver(resize).observe(host);resize();
  const tl=gsap.timeline({paused:true,onUpdate:()=>{if(inView)frame();},onComplete:frame});
  function reveal(name,start,duration,height=8){stageMaterials[name].forEach(m=>tl.to(m.clippingPlanes[0],{constant:height,duration,ease:'power1.inOut'},start));}
  mark(0);reveal('foundation',0,.85,1);reveal('columns',.75,1.8);reveal('floors',1.5,1.95);
  reveal('facade',3.05,1.75);reveal('glass',4.15,1.4);reveal('details',4.75,1.35);reveal('landscape',5.8,1.5);
  tl.to(footprint.material,{opacity:0,duration:.6},.6)
    .call(()=>mark(1),null,.85).call(()=>mark(2),null,3.1).call(()=>mark(3),null,7.35)
    .to(state,{camera:1,duration:7.5,ease:'sine.inOut'},0)
    .fromTo(section.querySelectorAll('h2 span'),{clipPath:'inset(100% 0 0 0)',y:12,opacity:0},{clipPath:'inset(0% 0 0 0)',y:0,opacity:1,duration:.65,stagger:.13,ease:'power2.out'},.2);
  const observer=new IntersectionObserver(entries=>{
    inView=entries[0].isIntersecting;
    if(inView){if(motion.matches)tl.progress(1).pause();else if(tl.progress()<1)tl.play();frame();}else tl.pause();
  },{threshold:.18});observer.observe(section);
  motion.addEventListener('change',()=>{if(motion.matches){tl.progress(1).pause();frame();}});
  host.addEventListener('webglcontextlost',e=>{e.preventDefault();tl.pause();});
  host.addEventListener('webglcontextrestored',()=>{tl.progress(1).pause();frame();});
})();


