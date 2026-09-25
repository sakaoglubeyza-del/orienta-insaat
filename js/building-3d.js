/* Architectural study: drafted lines resolve into a quiet courtyard pavilion. */
(() => {
  const panel = document.getElementById('build3d');
  if (!panel || typeof THREE === 'undefined' || typeof gsap === 'undefined') return;
  let renderer;
  try { renderer = new THREE.WebGLRenderer({antialias:true,alpha:false}); }
  catch (_) { document.getElementById('b3dStage').textContent = 'MİMARİ ÇALIŞMA'; return; }
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  renderer.setClearColor(0x111111);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = .85;
  panel.prepend(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32,1,.1,80);
  camera.position.set(9.5,6.2,10.8);camera.lookAt(0,1,0);
  scene.add(new THREE.HemisphereLight(0xf6f1e4,0x34332f,.95));
  const key = new THREE.DirectionalLight(0xfff5e5,1.4);key.position.set(-3,8,5);scene.add(key);
  const fill = new THREE.DirectionalLight(0xffffff,.55);fill.position.set(5,3,-5);scene.add(fill);
  const model = new THREE.Group();scene.add(model);
  const solids=[],glass=[],frames=[];
  const material = (color,roughness=.8,opacity=1) => new THREE.MeshStandardMaterial({color,roughness,metalness:roughness<.3?.25:0,transparent:true,opacity:0,side:THREE.DoubleSide,userData:{finalOpacity:opacity}});
  const concrete=material(0xded8cb),metal=material(0x171916,.42),glazing=material(0x202925,.28,.9),wood=material(0x8a7b65,.9);
  const box=(w,h,d,x,y,z,mat,collection=solids)=>{
    const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);mesh.position.set(x,y,z);model.add(mesh);collection.push(mesh);return mesh;
  };
  // Thin continuous planes and recessed glazing, rather than stacked blocks.
  box(6.4,.10,4.1,0,0,0,concrete);
  box(5.9,.13,3.35,0,1.46,0,concrete);
  box(6.35,.16,3.8,0,2.94,0,concrete);
  box(.20,2.82,3.3,-2.83,1.49,0,concrete);
  box(1.10,2.82,.18,-2.35,1.49,-1.55,concrete);
  box(1.5,1.25,.14,1.98,2.19,-1.5,concrete);
  // Deep facade: smoked glazing behind an exterior metal rhythm.
  box(5.38,2.70,.025,.04,1.51,1.38,glazing,glass);
  box(.025,2.70,2.85,2.70,1.51,-.03,glazing,glass);
  box(4.4,2.70,.025,.35,1.51,-1.45,glazing,glass);
  for(let x=-2.65;x<=2.75;x+=.9) box(.035,2.74,.065,x,1.5,1.45,metal,frames);
  for(const z of [-1.4,-.46,.48,1.42]) box(.065,2.74,.035,2.75,1.5,z,metal,frames);
  for(const y of [.16,1.47,2.85]) {box(5.46,.035,.065,.05,y,1.45,metal,frames);box(.065,.035,2.9,2.75,y,0,metal,frames);}
  // Slender timber screen gives the entrance a human scale.
  for(let x=-2.5;x<-1.5;x+=.13) box(.035,1.22,.08,x,.79,1.56,wood,frames);
  box(2.0,.05,.85,.9,.13,2.05,concrete);
  box(2.25,.035,.35,.9,.055,2.57,concrete);
  // Drafting plane with measured extents and axis ticks.
  const segments=[];
  const line=(a,b)=>segments.push(...a,...b);
  for(let x=-4;x<=4;x+=.8)line([x,-.07,-3],[x,-.07,3]);
  for(let z=-3;z<=3;z+=.75)line([-4,-.07,z],[4,-.07,z]);
  const gridGeometry=new THREE.BufferGeometry();gridGeometry.setAttribute('position',new THREE.Float32BufferAttribute(segments,3));
  const grid=new THREE.LineSegments(gridGeometry,new THREE.LineBasicMaterial({color:0x787467,transparent:true,opacity:0}));scene.add(grid);
  const contourPoints=[];
  const segment=(a,b)=>contourPoints.push(...a,...b);
  for(const y of [.08,1.46,2.94]){
    const corners=[[-3,y,-1.8],[3,y,-1.8],[3,y,1.8],[-3,y,1.8]];
    corners.forEach((c,i)=>segment(c,corners[(i+1)%4]));
  }
  for(const x of [-2.8,-.95,.95,2.8])for(const z of [-1.6,1.6])segment([x,.08,z],[x,2.94,z]);
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(contourPoints,3));geo.setDrawRange(0,0);
  const outline=new THREE.LineSegments(geo,new THREE.LineBasicMaterial({color:0xe3dece,transparent:true,opacity:.75}));scene.add(outline);
  const dimensions=[];
  dimensions.push(-3.5,0,2.8,3.5,0,2.8);
  for(const x of [-3.5,3.5]) dimensions.push(x,0,2.65,x,0,2.95);
  const dg=new THREE.BufferGeometry();dg.setAttribute('position',new THREE.Float32BufferAttribute(dimensions,3));
  const dims=new THREE.LineSegments(dg,new THREE.LineBasicMaterial({color:0xb0a996,transparent:true,opacity:0}));scene.add(dims);
  const stage=document.getElementById('b3dStage'),bar=document.getElementById('b3dFill');
  const progress={vertices:0};let visible=false;
  const render=()=>renderer.render(scene,camera);
  const resize=()=>{renderer.setSize(panel.clientWidth,panel.clientHeight);camera.aspect=panel.clientWidth/panel.clientHeight;camera.updateProjectionMatrix();render();};
  new ResizeObserver(resize).observe(panel);resize();
  const label=(n,text)=>{stage.textContent=`0${n} / ${text}`;};
  const tl=gsap.timeline({paused:true,onUpdate:()=>{if(visible)render();}});
  tl.call(()=>label(1,'PLAN'),null,0)
    .to(grid.material,{opacity:.16,duration:.8},0)
    .to(dims.material,{opacity:.4,duration:1},.2)
    .call(()=>label(2,'ÇİZGİ'),null,.8)
    .to(progress,{vertices:contourPoints.length/3,duration:1.9,ease:'power1.inOut',onUpdate:()=>geo.setDrawRange(0,Math.floor(progress.vertices/2)*2)},.5)
    .call(()=>label(3,'FORM'),null,2.2)
    .to(concrete,{opacity:1,duration:1.25},2.2)
    .call(()=>label(4,'CEPHE'),null,3.2)
    .to(glazing,{opacity:.9,duration:1.3},3.1)
    .to(metal,{opacity:1,duration:1.2},3.4)
    .to(wood,{opacity:1,duration:1},3.6)
    .to(outline.material,{opacity:.10,duration:1.5},3.4)
    .to(camera.position,{x:8.7,y:5.7,z:10,duration:5.4,ease:'sine.inOut',onUpdate:()=>camera.lookAt(0,1.2,0)},0)
    .to(bar,{width:'100%',duration:5.4,ease:'none'},0)
    .call(()=>label(5,'YAPI'),null,5.1);
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const observer=new IntersectionObserver(entries=>{
    visible=entries[0].isIntersecting;
    if(visible){if(reduced.matches)tl.progress(1);else if(tl.progress()<1)tl.play();render();}
    else tl.pause();
  },{threshold:.2});observer.observe(panel);
  reduced.addEventListener('change',()=>{if(reduced.matches){tl.progress(1).pause();render();}});
})();

