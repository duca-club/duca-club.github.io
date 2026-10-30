// Ported from Claude Design's “DUCA with Dark MODE” export.
// Original layout declarations and animation methods are kept to preserve the design.
import React from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { executives, divisions } from '../data/team';
import BlogArticle from './BlogArticle';

const styleCache = new Map();
function css(declarations) {
  if (styleCache.has(declarations)) return styleCache.get(declarations);
  const result = {};
  for (const declaration of declarations.split(';')) {
    const index = declaration.indexOf(':');
    if (index < 0) continue;
    const property = declaration.slice(0, index).trim();
    const name = property.startsWith('--') ? property : property.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    result[name] = declaration.slice(index + 1).trim();
  }
  styleCache.set(declarations, result);
  return result;
}
const toDesignMember = member => ({ ...member, img: member.image, link: member.linkedIn, fact: member.bio || '' });

export default class DesignSite extends React.Component {

  state = { page: this.props.initialPage || 'home', theme: 'dark', counts: [0, 0, 0, 0], filter: 'All', teamYear: 2026, openEvent: 0, now: this.props.initialNow || 0, pastPage: 0, blogFilter: 'All', blogPage: 0, archiveOpen: false, blogQuery: '', openFaq: 0 };

  TEAM_YEARS = Object.keys(executives).map(Number).sort();

  PAST = [
    { date: '09 OCT 2026', title: 'Logoff: Trimester 2 Social', kind: 'SOCIAL' },
    { date: '25 SEP 2026', title: 'OSINT Challenge Night', kind: 'CTF' },
    { date: '11 SEP 2026', title: 'Industry Night: Red Team', kind: 'INDUSTRY' },
    { date: '28 AUG 2026', title: 'Cloud Security Workshop', kind: 'WORKSHOP' },
    { date: '14 AUG 2026', title: 'O-Week Meet and Greet', kind: 'COMMUNITY' }
  ];

  PAGES = [
    ['home', 'Home'], ['events', 'Events'], ['about', 'About'],
    ['blog', 'Blog'], ['team', 'Team'], ['partners', 'Partners'], ['ctf', 'CTF'], ['join', 'Join']
  ];

  CHANNELS = [
    { name: 'general', meta: '12 new' },
    { name: 'ctf-and-challenges', meta: '5 solving', live: true },
    { name: 'workshop-notes', meta: '3 new' },
    { name: 'jobs-and-internships', meta: '8 new' },
    { name: 'duca-cat', meta: '∞', live: true },
    { name: 'study-help', meta: '2 new' },
    { name: 'certifications', meta: '6 new' },
    { name: 'events', meta: 'pinned' },
    { name: 'tooling', meta: '1 new' },
    { name: 'off-topic', meta: '21 new' }
  ];

  TICKER = ['FREE TO JOIN', 'ALL SKILL LEVELS', 'WORKSHOPS', 'CTF NIGHTS', 'INDUSTRY PANELS', 'PIZZA', 'DEAKIN BURWOOD'];

  STATS = [
    { target: 750, suffix: '+', label: 'Members', note: 'Discord community' },
    { target: 42, suffix: '', label: 'Events', note: 'Run this year' },
    { target: 18, suffix: '', label: 'Workshops', note: 'Hands-on sessions' },
    { target: 100, suffix: '%', label: 'Free', note: 'Always' }
  ];

  EVENTS = [
    { iso: '2026-11-06T17:30:00+11:00', date: '06 NOV', kind: 'WORKSHOP', title: 'Intro to Ethical Hacking', body: 'Set up your lab, scan a target, and get your first shell. Nothing assumed.', time: '5:30 pm', place: 'Burwood, LC2.108', guests: [{ name: 'Sample Guest', role: 'Penetration Tester' }] },
    { iso: '2026-11-13T18:00:00+11:00', date: '13 NOV', kind: 'CTF', title: 'CTF Training Night', body: 'Pair up on retired challenges from the DUCA platform. Beginners get a walkthrough table.', time: '6:00 pm', place: 'Burwood, LC1.003' },
    { iso: '2026-11-20T18:30:00+11:00', date: '20 NOV', kind: 'INDUSTRY', title: 'Industry Night: Blue Team', body: 'SOC analysts from partner organisations on what the job is actually like, plus resume reviews.', time: '6:30 pm', place: 'Burwood, Theatre 3', guests: [{ name: 'Sample Guest', role: 'SOC Analyst, CommBank' }, { name: 'Sample Guest', role: 'Threat Intel Lead, Accenture' }] },
    { iso: '2026-11-27T17:30:00+11:00', date: '27 NOV', kind: 'WORKSHOP', title: 'Digital Forensics Lab', body: 'Pull artefacts off a disk image and reconstruct a timeline. Bring a laptop.', time: '5:30 pm', place: 'Burwood, LC2.108' },
    { iso: '2026-12-04T18:00:00+11:00', date: '04 DEC', kind: 'SOCIAL', title: 'Logoff', body: "DUCA's end-of-trimester social. Pizza, a quiz, and no laptops required.", time: '6:00 pm', place: 'Burwood, LC1.003' },
    { iso: '2027-03-05T17:00:00+11:00', date: '05 MAR', kind: 'CTF', title: 'DownUnderCTF Watch Party', body: 'We field DUCA teams and solve together on the night. Snacks provided.', time: '5:00 pm', place: 'Burwood, LC1.003' }
  ];

  POSTS = [
    { date: '18 JUL 2026', tag: 'EVENTS', title: 'Speedrunning Cyber: The Strategic Route to a Security Role', blurb: 'Navigating a cybersecurity degree does not require 100% completion. Two senior students shared what to study, what to skip, and how to land a job before graduating.', url: 'https://duca.au/blog/2026-07-18-speedrunning-cyber/' },
    { date: '06 SEP 2025', tag: 'EVENTS', title: 'DUCA x DDSC Networking Night', blurb: 'A high-energy night with career insights from Commonwealth Bank, AI and research guidance, plus plenty of community building.', url: 'https://duca.au/blog/2025-09-06-duca-x-ddsc-networking-night/' },
    { date: '12 MAY 2025', tag: 'FIELD NOTES', title: 'DUCA Cat Attends the Inaugural BSides Ballarat 2025', blurb: 'Talks on human-centric cybersecurity, digital footprint awareness, CTI automation, and navigating growth in cyber careers.', url: 'https://duca.au/blog/2025-05-12-duca-cat-attends-the-inaugural-bsides-ballarat-2025/' },
    { date: '25 APR 2025', tag: 'EVENTS', title: 'Exploring ADF Careers and the Role of Cyber Warfare on ANZAC Day', blurb: 'Insights from Colonel Molnar, Captain Lever and Cyber Warfare Officer Elliot Parker on the growing role of cyber warfare.', url: 'https://duca.au/blog/2025-04-25-exploring-adf-careers-and-the-role-of-cyber-warfare-on-anzac-day/' },
    { date: '17 APR 2025', tag: 'CTF', title: 'Cracking Clues and Catching Flags with DUCA', blurb: 'An OSINT-focused CTF where participants uncovered hidden clues using metadata, search techniques and visual analysis.', url: 'https://duca.au/blog/2025-04-17-cracking-clues-and-catching-flags-with-duca/' }
  ];

  TEAM = [];

  PARTNERS = [
    { name: 'Deakin Cyber Research', src: '/partners/deakin-cyber.png', url: 'https://cybercentre.org.au/' },
    { name: 'Deakin University', src: '/partners/deakin.png', url: 'https://www.deakin.edu.au/' },
    { name: 'DUSA', src: '/partners/dusa.png', url: 'https://www.dusa.org.au/clubs/deakin-university-cybersecurity-association-burwood-duca' },
    { name: 'ACUCyS', src: '/partners/acucys.png', url: 'https://acucys.com.au/' },
    { name: 'DownUnderCTF', src: '/global/ductf.png', url: 'https://downunderctf.com/' },
    { name: 'CommBank', src: '/global/commbank.png', url: 'https://www.commbank.com.au/' },
    { name: 'Mastercard', src: '/global/mastercard.png', url: 'https://www.mastercard.com.au/' },
    { name: 'Accenture', src: '/global/Accenture.png', url: 'https://www.accenture.com/au-en' },
    { name: 'Red Bull', src: '/global/redbull.png', url: 'https://www.redbull.com/' },
    { name: 'Hack4G', src: '/global/hck4g.jpeg', url: 'https://acucys.com.au/' }
  ];

  initThree() {
    if (this.state.page !== 'home') return;
    const T = window.THREE, g = window.gsap;
    if (!T || !g) { clearTimeout(this.threeWait); this.threeWait = setTimeout(() => this.initThree(), 140); return; }
    const canvas = document.querySelector('[data-three="hero"]');
    if (!canvas) {
      if (this.state.page !== 'home') return;
      clearTimeout(this.threeWait);
      this.threeWait = setTimeout(() => this.initThree(), 120);
      return;
    }
    if (this.three) this.disposeThree();

    const renderer = new T.WebGLRenderer({ canvas, alpha: true, antialias: true });
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(DPR);
    const scene = new T.Scene();
    const camera = new T.OrthographicCamera(-1, 1, 1, -1, -2000, 2000);

    // ---- headline drawn to a canvas texture, then distorted in a shader ----
    const tex2d = document.createElement('canvas');
    const ctx = tex2d.getContext('2d');
    const texture = new T.CanvasTexture(tex2d);
    texture.anisotropy = 4;

    let textBottom = 0;
    const cssVar = (n, fb) => {
      const v = getComputedStyle(document.body).getPropertyValue(n).trim();
      return v || fb;
    };
    const drawText = (W, H) => {
      const INK = cssVar('--ink', '#0E0E0C');
      const BODY2 = cssVar('--body-2', '#4A4A44');
      tex2d.width = Math.max(2, Math.floor(W * DPR));
      tex2d.height = Math.max(2, Math.floor(H * DPR));
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.textAlign = 'center';
      const cx = W / 2;
      ctx.font = '800 100px Archivo, sans-serif';
      const widest = Math.max(ctx.measureText('LEARN SECURITY').width, ctx.measureText('BY ACTUALLY DOING IT').width);
      const hs = Math.min(104, 100 * (W * 0.78 / widest));
      const lh = hs * 0.92;
      const y1 = hs * 0.95;
      ctx.font = `800 ${hs}px Archivo, sans-serif`;
      ctx.fillStyle = INK;
      ctx.fillText('LEARN SECURITY', cx, y1);
      const pre = 'BY ACTUALLY ';
      const hit = 'DOING IT';
      const preW = ctx.measureText(pre).width;
      const hitW = ctx.measureText(hit).width;
      const total = preW + hitW;
      const startX = cx - total / 2;
      const y2 = y1 + lh;
      ctx.fillStyle = '#C6F24E';
      ctx.fillRect(startX + preW - hs * 0.04, y2 - hs * 0.76, hitW + hs * 0.1, hs * 0.94);
      ctx.textAlign = 'left';
      ctx.fillStyle = INK;
      ctx.fillText(pre, startX, y2);
      ctx.fillStyle = '#0E0E0C';
      ctx.fillText(hit, startX + preW, y2);
      ctx.textAlign = 'center';
      const ls = Math.min(W * 0.019, 20) + 5;
      ctx.font = `600 ${ls}px Archivo, sans-serif`;
      ctx.fillStyle = BODY2;
      ctx.fillText('Deakin University Cybersecurity Club', cx, y2 + hs * 0.62);
      textBottom = y2 + hs * 0.62 + ls * 0.5;
      texture.needsUpdate = true;
    };

    const plane = new T.Mesh(
      new T.PlaneGeometry(1, 1, 1, 1),
      new T.ShaderMaterial({
        transparent: true,
        uniforms: {
          uTex: { value: texture },
          uTime: { value: 0 },
          uOrb: { value: new T.Vector2(1.4, 0.5) },
          uEnter: { value: 0 },
          uAspect: { value: 1 }
        },
        vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
        fragmentShader: [
          'uniform sampler2D uTex; uniform float uTime; uniform vec2 uOrb; uniform float uEnter; uniform float uAspect;',
          'varying vec2 vUv;',
          'void main(){',
          '  vec2 uv = vUv;',
          '  vec2 d = vec2((uv.x - uOrb.x) * uAspect, uv.y - uOrb.y);',
          '  float dist = length(d);',
          '  float wave = sin(dist * 11.0 - uTime * 0.8) * exp(-dist * 2.2) * 0.0045;',
          '  uv += normalize(d + 1e-6) * wave;',
          '  float reveal = smoothstep(uEnter, uEnter + 0.28, uv.y);',
          '  vec4 base = texture2D(uTex, uv);',
          '  vec3 col = mix(base.rgb, vec3(0.17, 0.21, 0.77), exp(-dist * 2.6) * 0.3);',
          '  gl_FragColor = vec4(col, base.a * reveal);',
          '}'
        ].join('\n')
      })
    );
    scene.add(plane);

    // ---- the object ----
    const dark = this.state.theme === 'dark';
    const group = new T.Group();
    const geo = new T.IcosahedronGeometry(1, 3);
    const wire = new T.LineSegments(
      new T.WireframeGeometry(new T.IcosahedronGeometry(1, 2)),
      new T.LineBasicMaterial({ color: dark ? 0xf4f4ee : 0x0e0e0c, transparent: true, opacity: dark ? 0.34 : 0.16 })
    );
    const dots = new T.Points(geo, new T.PointsMaterial({ color: dark ? 0x9db4ff : 0x2b36c4, size: 0.022, transparent: true, opacity: dark ? 1 : 0.9 }));
    const core = new T.Mesh(
      new T.IcosahedronGeometry(0.24, 1),
      new T.MeshBasicMaterial({ color: 0xc6f24e, wireframe: true })
    );
    const inner = new T.LineSegments(
      new T.WireframeGeometry(new T.IcosahedronGeometry(0.44, 1)),
      new T.LineBasicMaterial({ color: dark ? 0x9db4ff : 0x2b36c4, transparent: true, opacity: dark ? 0.55 : 0.3 })
    );
    group.add(wire, dots, core, inner);
    scene.add(group);

    let W = 1, H = 1;
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      if (!r.width || !r.height) return;
      W = r.width; H = r.height;
      renderer.setSize(W, H, false);
      camera.left = -W / 2; camera.right = W / 2; camera.top = H / 2; camera.bottom = -H / 2;
      camera.updateProjectionMatrix();
      plane.geometry.dispose();
      plane.geometry = new T.PlaneGeometry(W, H, 1, 1);
      plane.material.uniforms.uAspect.value = W / H;
      drawText(W, H);
      const R = Math.min(H * 0.78, W * 0.36);
      group.scale.setScalar(R);
      const topY = H / 2 - (textBottom + 34);
      group.position.set(0, Math.min(-H * 0.5 + R * 0.16, topY - R), -50);
    };
    resize();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => drawText(W, H));

    const mouse = { x: 0, y: 0 };
    const onMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('resize', resize);

    const IDX = [0,1,2,3,4,5,6];
    const labelNodes = IDX.map(i => document.querySelector('[data-label-node="' + i + '"]'));
    const labelDots = IDX.map(i => document.querySelector('[data-label-dot="' + i + '"]'));
    const labelLines = IDX.map(i => document.querySelector('[data-label-line="' + i + '"]'));
    const ANCHORS = IDX.map(i => {
      const lon = (i / IDX.length) * Math.PI * 2;
      const lat = 0.52 + (i % 2) * 0.26;
      return new T.Vector3(Math.cos(lon) * Math.cos(lat), Math.sin(lat), Math.sin(lon) * Math.cos(lat)).normalize();
    });

    const clock = new T.Clock();
    const tick = () => {
      const t = clock.getElapsedTime();
      plane.material.uniforms.uTime.value = t;
      group.rotation.y += 0.0024;
      group.rotation.x = -0.12;
      core.rotation.y -= 0.007;
      core.rotation.z += 0.005;
      group.position.z = -50;
      plane.position.x += (mouse.x * -8 - plane.position.x) * 0.04;
      plane.position.y += (mouse.y * 5 - plane.position.y) * 0.04;
      plane.material.uniforms.uOrb.value.set(
        (group.position.x - plane.position.x) / W + 0.5,
        (group.position.y - plane.position.y) / H + 0.5
      );
      const show = W >= 760;
      const safeTop = textBottom + 20;
      const placed = [];
      ANCHORS.forEach((a, i) => {
        const node = labelNodes[i], dot = labelDots[i], line = labelLines[i];
        if (!node || !dot || !line) return;
        if (!show) { node.style.display = 'none'; dot.style.display = 'none'; line.style.display = 'none'; return; }
        node.style.display = 'block'; dot.style.display = 'block'; line.style.display = 'block';
        const v = a.clone().applyMatrix4(group.matrixWorld);
        const px = v.x + W / 2, py = H / 2 - v.y;
        const rel = (v.x - group.position.x) / (group.scale.x * 0.42);
        const s = Math.max(-1, Math.min(1, rel));
        const tw = node.offsetWidth || 90;
        const off = Math.max(24, Math.min(66, group.scale.x * 0.24));
        let lx = px + s * off;
        lx = Math.max(tw * (1 - s) / 2 + 4, Math.min(lx, W - 4 - tw * (1 + s) / 2));
        const ly = py - Math.max(14, off * 0.38);
        const left = lx - tw * (1 - s) / 2;
        const inBand = py > safeTop && py < H - 14;
        placed.push({ i, node, dot, line, px, py, lx, ly, s, tw, left, z: v.z, front: v.z > group.position.z, inBand });
      });
      if (show) {
        placed.sort((a, b) => b.z - a.z);
        const kept = [];
        placed.forEach(p => {
          let clash = false;
          for (const k of kept) {
            if (Math.abs(p.ly - k.ly) < 22 && p.left < k.left + k.tw + 10 && k.left < p.left + p.tw + 10) { clash = true; break; }
          }
          const vis = (!p.inBand || clash) ? 0 : (p.front ? 1 : 0.4);
          if (vis > 0) kept.push(p);
          p.dot.style.left = p.px + 'px'; p.dot.style.top = p.py + 'px';
          p.node.style.left = p.lx + 'px'; p.node.style.top = p.ly + 'px';
          p.node.style.transform = 'translate(' + ((p.s - 1) * 50) + '%,-50%)';
          p.line.setAttribute('x1', p.px); p.line.setAttribute('y1', p.py);
          p.line.setAttribute('x2', p.lx); p.line.setAttribute('y2', p.ly + 4);
          p.node.style.opacity = vis; p.dot.style.opacity = vis; p.line.style.opacity = vis * 0.6;
        });
      }
      renderer.render(scene, camera);
    };
    g.ticker.add(tick);

    g.fromTo(plane.material.uniforms.uEnter, { value: 1.1 }, { value: -0.3, duration: 1.4, ease: 'expo.out', delay: 0.1 });
    g.from(group.scale, { x: 0.2, y: 0.2, z: 0.2, duration: 1.6, ease: 'expo.out', delay: 0.2 });
    if (window.ScrollTrigger) {
      g.to(group.rotation, {
        z: Math.PI * 0.8, ease: 'none',
        scrollTrigger: { trigger: canvas, start: 'top top', end: '+=900', scrub: 1 }
      });
    }

    this.redrawHero = () => drawText(W, H);
    this.three = { renderer, tick, onMove, resize, scene };
  }

  disposeThree() {
    if (!this.three) return;
    const g = window.gsap;
    if (g) g.ticker.remove(this.three.tick);
    window.removeEventListener('pointermove', this.three.onMove);
    window.removeEventListener('resize', this.three.resize);
    this.three.scene.traverse(o => {
      if (o.geometry) o.geometry.dispose();
      if (o.material) o.material.dispose();
    });
    this.three.renderer.dispose();
    this.three = null;
  }

  componentDidMount() {
    window.gsap = gsap;
    window.ScrollTrigger = ScrollTrigger;
    const requestedTag = new URLSearchParams(window.location.search).get('tag');
    const matchingTag = requestedTag && this.POSTS.flatMap(post => [post.tag, ...(post.tags || [])]).find(tag => tag.toLowerCase() === requestedTag.toLowerCase());
    this.setState({ now: Date.now(), ...(matchingTag ? { blogFilter: matchingTag } : {}) });
    let saved = null;
    try { saved = localStorage.getItem('duca-theme'); } catch (e) {}
    const theme = saved === 'light' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', theme);
    if (theme !== this.state.theme) this.setState({ theme });
    document.fonts.ready.then(() => { if (this.redrawHero) this.redrawHero(); });
    this._lastPage = this.state.page;
    this._lastFilter = this.state.filter;
    this.setupAnim();
    if (this.state.page === 'home') import('three').then(three => {
      if (this.unmounted) return;
      window.THREE = three;
      this.initThree();
    });
    if (this.state.page === 'events') this.clockTick = setInterval(() => this.setState({ now: Date.now() }), 1000);
  }

  componentDidUpdate(prevProps, prevState) {
    const prev = prevState || {};
    const pageChanged = this._lastPage !== this.state.page;
    const filterChanged = this._lastFilter !== this.state.filter;
    if (pageChanged || filterChanged) this.setupAnim();
    this._lastFilter = this.state.filter;
    if (pageChanged) {
      this._lastPage = this.state.page;
      if (this.state.page === 'home') this.initThree(); else this.disposeThree();
    }
  }

  componentWillUnmount() {
    this.unmounted = true;
    clearTimeout(this.animWait);
    clearInterval(this.clockTick);
    clearTimeout(this.threeWait);
    this.disposeThree();
    if (this.joinTick && window.gsap) window.gsap.ticker.remove(this.joinTick);
    if (this.joinFit) window.removeEventListener('resize', this.joinFit);
    if (this.joinPointerCleanup) this.joinPointerCleanup();
    if (this.plateTick && window.gsap) window.gsap.ticker.remove(this.plateTick);
    if (this.plateFit) window.removeEventListener('resize', this.plateFit);
    if (this.glowTicks && window.gsap) this.glowTicks.forEach(t => window.gsap.ticker.remove(t));
    if (this.glowFits) this.glowFits.forEach(fn => window.removeEventListener('resize', fn));
    if (this.valuesTick && window.gsap) window.gsap.ticker.remove(this.valuesTick);
    if (this.valuesFit) window.removeEventListener('resize', this.valuesFit);
    if (this.joinRainTick && window.gsap) window.gsap.ticker.remove(this.joinRainTick);
    if (this.joinRainFit) window.removeEventListener('resize', this.joinRainFit);
    if (this.countTween) this.countTween.kill();
    if (this.ctx) this.ctx.revert();
  }

  setupAnim() {
    const g = window.gsap;
    if (!g || !window.ScrollTrigger) { clearTimeout(this.animWait); this.animWait = setTimeout(() => this.setupAnim(), 120); return; }
    g.registerPlugin(window.ScrollTrigger);
    if (this.joinTick) { g.ticker.remove(this.joinTick); this.joinTick = null; }
    if (this.joinFit) { window.removeEventListener('resize', this.joinFit); this.joinFit = null; }
    if (this.joinPointerCleanup) { this.joinPointerCleanup(); this.joinPointerCleanup = null; }
    if (this.plateTick) { g.ticker.remove(this.plateTick); this.plateTick = null; }
    if (this.plateFit) { window.removeEventListener('resize', this.plateFit); this.plateFit = null; }
    if (this.glowTicks) { this.glowTicks.forEach(t => g.ticker.remove(t)); this.glowTicks = null; }
    if (this.glowFits) { this.glowFits.forEach(fn => window.removeEventListener('resize', fn)); this.glowFits = null; }
    if (this.valuesTick) { g.ticker.remove(this.valuesTick); this.valuesTick = null; }
    if (this.valuesFit) { window.removeEventListener('resize', this.valuesFit); this.valuesFit = null; }
    if (this.joinRainTick) { g.ticker.remove(this.joinRainTick); this.joinRainTick = null; }
    if (this.joinRainFit) { window.removeEventListener('resize', this.joinRainFit); this.joinRainFit = null; }
    if (this.ctx) this.ctx.revert();
    this.ctx = g.context(() => {
      g.utils.toArray('[data-anim="line"]').forEach((el, i) => {
        g.from(el.children, { yPercent: 108, duration: 0.95, ease: 'expo.out', delay: 0.05 + i * 0.09 });
      });
      g.utils.toArray('[data-anim="hero"]').forEach(el => {
        g.from(el.children, { y: 26, opacity: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out', clearProps: 'transform,opacity' });
      });
      g.utils.toArray('[data-anim="up"]').forEach(el => {
        g.from(el, { y: 28, opacity: 0, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%' } });
      });
      g.utils.toArray('[data-anim-group]').forEach(grp => {
        g.from(grp.children, { y: 32, opacity: 0, duration: 0.65, stagger: 0.07, ease: 'power3.out', scrollTrigger: { trigger: grp, start: 'top 88%' } });
      });
      const mark = document.querySelector('[data-anim="mark"]');
      if (mark) {
        g.from(mark, { scale: 0.8, rotation: -14, opacity: 0, duration: 1, ease: 'back.out(1.5)', delay: 0.25 });
        g.to(mark, { y: -16, rotation: 4, duration: 3.6, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1.2 });
      }
      this.setupJoin();
      this.setupValues();
      this.setupGlow();
      this.setupPlate();
      const tick = document.querySelector('[data-anim="ticker"]');
      if (tick) g.to(tick, { xPercent: -50, duration: 28, repeat: -1, ease: 'none' });
      const knob0 = document.querySelector('[data-year-knob]');
      if (knob0) g.set(knob0, { xPercent: this.TEAM_YEARS.indexOf(this.state.teamYear) * 100 });
      const chans = document.querySelector('[data-anim="channels"]');
      if (chans) g.to(chans, { yPercent: -50, duration: 24, repeat: -1, ease: 'none' });
      const mq = document.querySelector('[data-anim="marquee"]');
      if (mq) g.to(mq, { xPercent: -50, duration: 46, repeat: -1, ease: 'none' });
      const mq2 = document.querySelector('[data-anim="marquee2"]');
      if (mq2) g.fromTo(mq2, { xPercent: -50 }, { xPercent: 0, duration: 54, repeat: -1, ease: 'none' });
      if (this.state.page === 'home') this.startCounts();
      window.ScrollTrigger.refresh();
    });
  }

  popTheme(next) {
    const g = window.gsap;
    if (!g) return;
    const btn = document.querySelector('[data-theme-toggle]');
    const knob = document.querySelector('[data-theme-knob]');
    const sparkHost = document.querySelector('[data-theme-sparks]');
    const dark = next === 'dark';
    if (knob) {
      g.killTweensOf(knob);
      g.fromTo(knob, { scale: 0.2, rotate: dark ? -140 : 140 }, { scale: 1, rotate: 0, duration: 0.75, ease: 'back.out(2.4)' });
    }
    if (btn) {
      g.killTweensOf(btn);
      g.fromTo(btn, { scale: 0.84 }, { scale: 1, duration: 0.7, ease: 'elastic.out(1,0.45)' });
    }
    if (sparkHost) {
      const r = sparkHost.getBoundingClientRect();
      const cx = r.width / 2;
      const cy = r.height / 2;
      for (let i = 0; i < 8; i++) {
        const s = document.createElement('span');
        s.style.cssText = 'position:absolute;width:5px;height:5px;border-radius:50%;pointer-events:none;left:' +
          cx + 'px;top:' + cy + 'px;background:' + (i % 2 ? 'oklch(0.87 0.2 124)' : 'var(--ink)');
        sparkHost.appendChild(s);
        const ang = (Math.PI * 2 * i) / 8 + Math.random() * 0.4;
        const dist = 16 + Math.random() * 20;
        g.fromTo(s, { scale: 0.5, opacity: 1 }, {
          x: Math.cos(ang) * dist, y: Math.sin(ang) * dist,
          scale: 0, opacity: 0, duration: 0.55 + Math.random() * 0.2,
          ease: 'power2.out', onComplete: () => s.remove()
        });
      }
    }
  }

  stepYear(dir) {
    const idx = this.TEAM_YEARS.indexOf(this.state.teamYear) + dir;
    if (idx < 0 || idx > this.TEAM_YEARS.length - 1) {
      const track = document.querySelector('[data-year-switch]');
      if (track && window.gsap) window.gsap.fromTo(track, { x: dir * 7 }, { x: 0, duration: 0.5, ease: 'elastic.out(1,0.35)' });
      return;
    }
    this.setState({ teamYear: this.TEAM_YEARS[idx] });
    this.popYear(dir);
  }

  popYear(dir) {
    const g = window.gsap;
    if (!g) return;
    const track = document.querySelector('[data-year-switch]');
    const value = document.querySelector('[data-year-value]');
    const sparkHost = document.querySelector('[data-year-sparks]');
    if (value) {
      g.killTweensOf(value);
      g.fromTo(value, { yPercent: dir * 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.55, ease: 'back.out(2)' });
    }
    if (track) {
      g.killTweensOf(track);
      g.fromTo(track, { rotation: dir * -2.2 }, { rotation: 0, duration: 0.8, ease: 'elastic.out(1,0.4)' });
    }
    if (sparkHost) {
      const hostRect = sparkHost.getBoundingClientRect();
      const cx = hostRect.width / 2;
      const cy = hostRect.height / 2;
      for (let i = 0; i < 9; i++) {
        const s = document.createElement('span');
        const lime = i % 2 === 0;
        s.style.cssText = 'position:absolute;width:6px;height:6px;border-radius:50%;pointer-events:none;left:' +
          cx + 'px;top:' + cy + 'px;background:' + (lime ? 'oklch(0.87 0.2 124)' : 'var(--ink)');
        sparkHost.appendChild(s);
        const ang = (Math.PI * 2 * i) / 9 + Math.random() * 0.5;
        const dist = 26 + Math.random() * 30;
        g.fromTo(s, { scale: 0.4, opacity: 1 }, {
          x: Math.cos(ang) * dist, y: Math.sin(ang) * dist - 10,
          scale: 0, opacity: 0, duration: 0.6 + Math.random() * 0.25,
          ease: 'power2.out', onComplete: () => s.remove()
        });
      }
    }
  }

  setupPlate() {
    const g = window.gsap;
    const host = document.querySelector('[data-dc-plate]');
    if (!host) return;
    const canvas = host.querySelector('[data-dc-plate-bg]');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const GLYPHS = '01<>/\\{}[]#$*+=_';
    const CELL = 16;
    let w = 0, h = 0, cols = [];
    const fit = () => {
      const r = host.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = Math.max(2, w * dpr); canvas.height = Math.max(2, h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Array.from({ length: Math.max(1, Math.ceil(w / CELL)) }, () => ({
        y: Math.random() * -h,
        speed: 0.4 + Math.random() * 1.2,
        len: 4 + Math.floor(Math.random() * 9)
      }));
    };
    fit();
    this.plateTick = () => {
      if (!w) return;
      ctx.clearRect(0, 0, w, h);
      ctx.font = "600 11px 'Space Mono', monospace";
      cols.forEach((c, i) => {
        for (let k = 0; k < c.len; k++) {
          const y = c.y - k * CELL;
          if (y < -CELL || y > h + CELL) continue;
          const fade = (1 - k / c.len) * 0.45;
          ctx.fillStyle = k === 0 ? 'rgba(198,242,78,0.85)' : 'rgba(198,242,78,' + fade.toFixed(3) + ')';
          ctx.fillText(GLYPHS[Math.floor(Math.random() * GLYPHS.length)], i * CELL + 2, y);
        }
        c.y += c.speed * 1.5;
        if (c.y - c.len * CELL > h) { c.y = Math.random() * -50; c.speed = 0.4 + Math.random() * 1.2; }
      });
    };
    this.plateFit = fit;
    g.ticker.add(this.plateTick);
    window.addEventListener('resize', fit);
  }

  setupGlow() {
    const g = window.gsap;
    const hosts = Array.from(document.querySelectorAll('[data-glow]'));
    if (!hosts.length) return;
    this.glowTicks = [];
    this.glowFits = [];
    hosts.forEach(host => {
      const canvas = host.querySelector('[data-glow-bg]');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const CELL = 52;
      let w = 0, h = 0, cols = 0, rows = 0, cells = [];
      const fit = () => {
        const r = host.getBoundingClientRect();
        w = r.width; h = r.height;
        canvas.width = Math.max(2, w * dpr); canvas.height = Math.max(2, h * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        cols = Math.ceil(w / CELL); rows = Math.ceil(h / CELL);
        cells = [];
      };
      fit();
      const spawn = () => {
        if (!cols || !rows) return;
        cells.push({
          cx: Math.floor(Math.random() * cols),
          cy: Math.floor(Math.random() * rows),
          life: 0,
          span: 60 + Math.floor(Math.random() * 90),
          lime: Math.random() > 0.45
        });
        if (cells.length > 14) cells.shift();
      };
      const tick = () => {
        if (!w) return;
        ctx.clearRect(0, 0, w, h);
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(255,255,255,0.05)';
        ctx.beginPath();
        for (let x = 0; x <= cols; x++) { ctx.moveTo(x * CELL, 0); ctx.lineTo(x * CELL, h); }
        for (let y = 0; y <= rows; y++) { ctx.moveTo(0, y * CELL); ctx.lineTo(w, y * CELL); }
        ctx.stroke();
        if (Math.random() < 0.05) spawn();
        cells.forEach(c => {
          c.life += 1;
          const p = c.life / c.span;
          if (p > 1) return;
          const a = Math.sin(p * Math.PI);
          const col = c.lime ? '198,242,78' : '110,124,255';
          ctx.fillStyle = 'rgba(' + col + ',' + (0.05 * a).toFixed(3) + ')';
          ctx.fillRect(c.cx * CELL, c.cy * CELL, CELL, CELL);
          ctx.strokeStyle = 'rgba(' + col + ',' + (0.14 * a).toFixed(3) + ')';
          ctx.strokeRect(c.cx * CELL + 0.5, c.cy * CELL + 0.5, CELL - 1, CELL - 1);
        });
        cells = cells.filter(c => c.life <= c.span);
      };
      g.ticker.add(tick);
      window.addEventListener('resize', fit);
      this.glowTicks.push(tick);
      this.glowFits.push(fit);
    });
  }

  setupValues() {
    const g = window.gsap;
    const host = document.querySelector('[data-values]');
    if (!host) return;
    const canvas = host.querySelector('[data-values-bg]');
    if (!canvas) return;
    void 0;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0, nodes = [];
    const fit = () => {
      const r = host.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = Math.max(2, w * dpr); canvas.height = Math.max(2, h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.max(40, Math.min(90, Math.round(w / 15)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.22, vy: (Math.random() - 0.5) * 0.22,
        r: 1 + Math.random() * 1.6
      }));
    };
    fit();
    this.valuesTick = () => {
      if (!w) return;
      ctx.clearRect(0, 0, w, h);
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      });
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d > 130) continue;
          ctx.strokeStyle = 'rgba(198,242,78,' + (0.13 * (1 - d / 130)).toFixed(3) + ')';
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
      nodes.forEach(n => {
        ctx.fillStyle = 'rgba(198,242,78,0.5)';
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill();
      });
    };
    this.valuesFit = fit;
    g.ticker.add(this.valuesTick);
    window.addEventListener('resize', fit);
  }

  setupJoin() {
    const g = window.gsap;
    const panel = document.querySelector('[data-join]');
    if (!panel) return;
    const canvas = panel.querySelector('[data-join-grid]');
    const line = panel.querySelector('[data-join-line]');
    const logo = panel.querySelector('[data-join-logo]');
    const rain = panel.querySelector('[data-join-rain]');
    const markBox = panel.querySelector('[data-join-mark]');

    if (line) {
      g.from(line.children, {
        yPercent: 110, duration: 1, ease: 'expo.out',
        scrollTrigger: { trigger: panel, start: 'top 78%' }
      });
    }
    if (logo) {
      g.from(logo, {
        scale: 0.76, opacity: 0, duration: 1.1, ease: 'back.out(1.5)',
        scrollTrigger: { trigger: panel, start: 'top 78%' }
      });
      g.to(logo, { y: -10, duration: 3.4, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      const glitch = () => {
        const tl = g.timeline({ onComplete: () => g.delayedCall(1.4 + Math.random() * 3.4, glitch) });
        tl.set(logo, { filter: 'drop-shadow(3px 0 rgba(198,242,78,0.9)) drop-shadow(-3px 0 rgba(43,54,196,0.9))', x: 3 })
          .set(logo, { x: -4 }, 0.05)
          .set(logo, { x: 2 }, 0.1)
          .set(logo, { filter: 'none', x: 0 }, 0.16);
      };
      g.delayedCall(1.6, glitch);
    }

    if (rain && markBox) {
      const rctx = rain.getContext('2d');
      const dpr2 = Math.min(window.devicePixelRatio || 1, 2);
      const GLYPHS = 'DUCA01{}<>#$_/\\*+=';
      let cols = [], rw = 0, rh = 0, cell = 15;
      const fitRain = () => {
        const r = markBox.getBoundingClientRect();
        rw = r.width; rh = r.height;
        rain.width = Math.max(2, rw * dpr2); rain.height = Math.max(2, rh * dpr2);
        rctx.setTransform(dpr2, 0, 0, dpr2, 0, 0);
        const n = Math.max(1, Math.floor(rw / cell));
        cols = Array.from({ length: n }, () => ({
          y: Math.random() * -rh,
          speed: 0.5 + Math.random() * 1.5,
          len: 5 + Math.floor(Math.random() * 10)
        }));
      };
      fitRain();
      this.joinRainTick = () => {
        if (!rw) return;
        rctx.clearRect(0, 0, rw, rh);
        rctx.font = "600 12px 'Space Mono', monospace";
        cols.forEach((c, i) => {
          for (let k = 0; k < c.len; k++) {
            const y = c.y - k * cell;
            if (y < -cell || y > rh + cell) continue;
            const fade = (1 - k / c.len) * 0.55;
            rctx.fillStyle = k === 0 ? 'rgba(198,242,78,0.85)' : 'rgba(198,242,78,' + fade.toFixed(3) + ')';
            rctx.fillText(GLYPHS[Math.floor(Math.random() * GLYPHS.length)], i * cell + 2, y);
          }
          c.y += c.speed * 1.6;
          if (c.y - c.len * cell > rh) { c.y = Math.random() * -60; c.speed = 0.5 + Math.random() * 1.5; }
        });
      };
      this.joinRainFit = fitRain;
      g.ticker.add(this.joinRainTick);
      window.addEventListener('resize', fitRain);
    }
    // scanning grid lines drawn on canvas
    if (canvas) {
      const ctx = canvas.getContext('2d');
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      let w = 0, h = 0;
      const fit = () => {
        const r = panel.getBoundingClientRect();
        w = r.width; h = r.height;
        canvas.width = Math.max(2, w * dpr); canvas.height = Math.max(2, h * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      };
      fit();
      const state = { t: 0 };
      const pointer = { x: -999, y: -999, on: 0 };
      const onEnter = () => { g.to(pointer, { on: 1, duration: 0.4, ease: 'power2.out' }); };
      const onLeave = () => { g.to(pointer, { on: 0, duration: 0.6, ease: 'power2.out' }); };
      const onMove = (e) => {
        const r = panel.getBoundingClientRect();
        pointer.x = e.clientX - r.left;
        pointer.y = e.clientY - r.top;
      };
      panel.addEventListener('pointerenter', onEnter);
      panel.addEventListener('pointerleave', onLeave);
      panel.addEventListener('pointermove', onMove);
      this.joinPointerCleanup = () => {
        panel.removeEventListener('pointerenter', onEnter);
        panel.removeEventListener('pointerleave', onLeave);
        panel.removeEventListener('pointermove', onMove);
      };
      const draw = () => {
        if (!w) return;
        ctx.clearRect(0, 0, w, h);
        const step = 46;
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(255,255,255,0.055)';
        ctx.beginPath();
        for (let x = (state.t % step); x < w; x += step) { ctx.moveTo(x, 0); ctx.lineTo(x, h); }
        for (let y = (state.t % step); y < h; y += step) { ctx.moveTo(0, y); ctx.lineTo(w, y); }
        ctx.stroke();
        const sy = ((state.t * 1.6) % (h + 160)) - 80;
        const grad = ctx.createLinearGradient(0, sy - 70, 0, sy + 70);
        grad.addColorStop(0, 'rgba(198,242,78,0)');
        grad.addColorStop(0.5, 'rgba(198,242,78,0.12)');
        grad.addColorStop(1, 'rgba(198,242,78,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, sy - 70, w, 140);
        if (pointer.on > 0.01) {
          const rad = 240;
          const halo = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, rad);
          halo.addColorStop(0, 'rgba(198,242,78,' + (0.2 * pointer.on) + ')');
          halo.addColorStop(0.45, 'rgba(198,242,78,' + (0.07 * pointer.on) + ')');
          halo.addColorStop(1, 'rgba(198,242,78,0)');
          ctx.fillStyle = halo;
          ctx.fillRect(pointer.x - rad, pointer.y - rad, rad * 2, rad * 2);
          ctx.save();
          ctx.beginPath();
          ctx.arc(pointer.x, pointer.y, rad * 0.8, 0, Math.PI * 2);
          ctx.clip();
          ctx.strokeStyle = 'rgba(198,242,78,' + (0.3 * pointer.on) + ')';
          ctx.beginPath();
          for (let x = (state.t % step); x < w; x += step) { ctx.moveTo(x, 0); ctx.lineTo(x, h); }
          for (let y = (state.t % step); y < h; y += step) { ctx.moveTo(0, y); ctx.lineTo(w, y); }
          ctx.stroke();
          ctx.restore();
        }
      };
      this.joinTick = () => { state.t += 0.35; draw(); };
      this.joinFit = fit;
      g.ticker.add(this.joinTick);
      window.addEventListener('resize', fit);
    }
  }

  startCounts() {
    const g = window.gsap;
    const proxy = { a: 0, b: 0, c: 0, d: 0 };
    const keys = ['a', 'b', 'c', 'd'];
    const to = { duration: 1.6, ease: 'power2.out', onUpdate: () => this.setState({ counts: keys.map(k => Math.round(proxy[k])) }) };
    keys.forEach((k, i) => { to[k] = this.STATS[i].target; });
    if (this.countTween) this.countTween.kill();
    this.countTween = g.to(proxy, to);
  }

  go(page) {
    return (ev) => {
      if (ev) ev.preventDefault();
      this.setState({ page });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
  }

  renderVals() {
    const { page, filter } = this.state;
    const kinds = ['All', 'Workshop', 'CTF', 'Industry', 'Social'];
    const visibleEvents = filter === 'All' ? this.EVENTS : this.EVENTS.filter(e => e.kind.toLowerCase().includes(filter.toLowerCase()));
    const LIVE_MS = 2 * 60 * 60 * 1000;
    const next = this.EVENTS.find(e => new Date(e.iso).getTime() + LIVE_MS > this.state.now);
    const liveNow = !!next && new Date(next.iso).getTime() <= this.state.now;

    return {
      isHome: page === 'home', isAbout: page === 'about', isEvents: page === 'events',
      isBlog: page === 'blog', isTeam: page === 'team', isPartners: page === 'partners',
      isCtf: page === 'ctf', isJoin: page === 'join', isPost: page === 'post',
      themeIcon: this.state.theme === 'dark'
        ? React.createElement('svg', { width: 17, height: 17, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2.6, strokeLinecap: 'round', strokeLinejoin: 'round' },
            React.createElement('path', { key: 'm', d: 'M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z', fill: 'currentColor' }))
        : React.createElement('svg', { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2.8, strokeLinecap: 'round' },
            React.createElement('circle', { key: 'c', cx: 12, cy: 12, r: 4.4, fill: 'currentColor' }),
            React.createElement('path', { key: 'r', d: 'M12 2.4v2.1M12 19.5v2.1M21.6 12h-2.1M4.5 12H2.4M18.8 5.2l-1.5 1.5M6.7 17.3l-1.5 1.5M18.8 18.8l-1.5-1.5M6.7 6.7 5.2 5.2' })),
      toggleTheme: () => {
        const next = this.state.theme === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', next);
        document.documentElement.style.colorScheme = next;
        try { localStorage.setItem('duca-theme', next); } catch (e) {}
        this.setState({ theme: next });
        this.popTheme(next);
        if (this.redrawHero) requestAnimationFrame(() => this.redrawHero());
        if (this.state.page === 'home') requestAnimationFrame(() => this.initThree());
      },
      goPost: this.go('post'),
      postAuthors: [
        { name: 'Hirusha Adikari', role: 'Assistant Secretary', link: 'https://www.linkedin.com/in/hirusha-adi/', img: '/team/hirusha-adikari.png' },
        { name: 'Ashley Mathew', role: 'Secretary', link: 'https://www.linkedin.com/in/ashleyymathew/', img: '/team/ashley-mathew.png' }
      ],

      navItems: this.PAGES.map(([id, label]) => {
        const ext = id === 'ctf';
        return {
          label: ext ? label + ' ↗' : label,
          href: ext ? 'https://ctf.duca.au/' : (id === 'home' ? '/' : '/' + id + '/'),
          target: ext ? '_blank' : '_self',
          onClick: undefined,
          color: page === id ? 'var(--on-ink)' : 'var(--ink)',
          bg: page === id ? 'var(--ink)' : 'transparent'
        };
      }),
      goHome: this.go('home'), goJoin: this.go('join'), goEvents: this.go('events'),
      goBlog: this.go('blog'), goTeam: this.go('team'), goCtf: this.go('ctf'), goPartners: this.go('partners'),

      stats: this.STATS.map((s, i) => ({
        ...s,
        shown: this.state.counts[i] + s.suffix,
        edge: i === 0 ? 'none' : '1px solid var(--hair)',
        pad: i === 0 ? '0' : '18px'
      })),
      channelLoop: [...this.CHANNELS, ...this.CHANNELS].map((c, i) => ({
        name: c.name, meta: c.meta, key: i,
        tint: c.live ? 'oklch(0.87 0.2 124)' : 'var(--muted)'
      })),
      tickerLoop: [...this.TICKER, ...this.TICKER, ...this.TICKER].map((t, i) => ({ text: '★ ' + t, key: i })),

      joinPerks: [
        { num: '01', title: 'Every workshop, free', meta: 'no cost' },
        { num: '02', title: 'CTF platform access', meta: 'year-round' },
        { num: '03', title: 'Industry nights', meta: 'resume reviews' },
        { num: '04', title: 'The Discord', meta: '750+ members' }
      ],

      homePosts: this.POSTS.slice(0, 3).map((p, i) => ({
        ...p, slot: 'blog-' + i, slotHint: 'Drop a photo from ' + p.tag.toLowerCase()
      })),
      posts: this.POSTS,
      featuredPost: this.POSTS[0],
      archivePosts: this.POSTS,
      archiveCount: this.POSTS.length + ' posts, newest first',
      archiveOpen: this.state.archiveOpen,
      archiveRot: this.state.archiveOpen ? '135deg' : '0deg',
      toggleArchive: () => this.setState(st => ({ archiveOpen: !st.archiveOpen })),
      ...(() => {
        const tags = ['All', ...Array.from(new Set(this.POSTS.map(p => p.tag)))];
        const bf = this.state.blogFilter;
        if (!tags.some(tag => tag.toLowerCase() === bf.toLowerCase())) tags.push(bf);
        const q = (this.state.blogQuery || '').trim().toLowerCase();
        const rest = bf === 'All' && !q ? this.POSTS.slice(1) : this.POSTS;
        let shown = bf === 'All' ? rest : rest.filter(p => [p.tag, ...(p.tags || [])].some(tag => tag.toLowerCase() === bf.toLowerCase()));
        if (q) shown = shown.filter(p => (p.title + ' ' + p.blurb + ' ' + p.tag).toLowerCase().includes(q));
        const per = 12;
        const pages = Math.max(1, Math.ceil(shown.length / per));
        const page = Math.min(this.state.blogPage, pages - 1);
        const paged = shown.slice(page * per, page * per + per);
        return {
          blogHasPages: true,
          blogQuery: this.state.blogQuery,
          hasBlogQuery: !!q,
          onBlogSearch: (ev) => this.setState({ blogQuery: ev.target.value, blogPage: 0 }),
          clearBlogSearch: () => this.setState({ blogQuery: '', blogPage: 0 }),
          blogPageLabel: 'Page ' + (page + 1) + ' of ' + pages,
          blogPrevColor: page > 0 ? 'var(--ink)' : 'var(--disabled)',
          blogNextColor: page < pages - 1 ? 'var(--ink)' : 'var(--disabled)',
          blogPrev: () => this.setState(st => ({ blogPage: Math.max(0, st.blogPage - 1) })),
          blogNext: () => this.setState(st => ({ blogPage: Math.min(pages - 1, st.blogPage + 1) })),
          blogFilters: tags.map(t => ({
            label: t.toLowerCase(),
            onClick: () => this.setState({ blogFilter: t, blogPage: 0 }),
            bg: bf === t ? 'var(--ink)' : 'transparent',
            fg: bf === t ? 'var(--on-ink)' : 'var(--ink)'
          })),
          blogCount: shown.length + ' of ' + rest.length + ' shown',
          blogPosts: paged.map((p, i) => ({
            ...p, slot: 'blog-' + p.date.replace(/\\s/g, ''), slotHint: 'Photo from ' + p.tag.toLowerCase()
          }))
        };
      })(),
      team: this.TEAM,
      teamYearLabel: String(this.state.teamYear),
      yearPrev: () => this.stepYear(-1),
      yearNext: () => this.stepYear(1),
      yearPrevColor: this.TEAM_YEARS.indexOf(this.state.teamYear) > 0 ? 'var(--ink)' : 'var(--disabled)',
      yearNextColor: this.TEAM_YEARS.indexOf(this.state.teamYear) < this.TEAM_YEARS.length - 1 ? 'var(--ink)' : 'var(--disabled)',
      teamYearNote: this.state.teamYear === 2026
        ? 'Elected each year by members. Tap anyone to open their LinkedIn.'
        : 'The ' + this.state.teamYear + ' committee. Tap anyone to open their LinkedIn.',

      execs: (executives[String(this.state.teamYear)] || []).filter(m => ['President', 'Vice President', 'Secretary', 'Treasurer'].includes(m.role)).map(toDesignMember),
      divisionsTeam: [
        { name: 'Committee', members: (executives[String(this.state.teamYear)] || []).filter(m => !['President', 'Vice President', 'Secretary', 'Treasurer'].includes(m.role)) },
        ...(divisions[String(this.state.teamYear)] || [])
      ].filter(d => d.members.length).map(d => ({ ...d, members: d.members.map(toDesignMember), empty: d.members.length === 0 })),
      partners: this.PARTNERS,
      deakinCyber: [
        { stat: '4', label: 'Major events backed' },
        { stat: '20+', label: 'Researchers in the network' },
        { stat: '2022', label: 'Working with DUCA since' }
      ],

      sponsors: this.PARTNERS.filter(p => ['DUSA', 'Deakin University', 'Red Bull'].includes(p.name)),
      otherPartners: this.PARTNERS.filter(p => !['Deakin Cyber Research', 'DUSA', 'Deakin University', 'Red Bull'].includes(p.name)),
      partnerLoop: [...this.PARTNERS, ...this.PARTNERS].map((p, i) => ({ ...p, key: i })),
      partnerNameLoop: [...this.PARTNERS, ...this.PARTNERS].map((p, i) => ({ name: p.name, key: i })),

      divisions: [
        { num: '01', title: 'Cybersecurity Workshops', body: 'Get hands-on with ethical hacking, network defence, digital forensics, and malware analysis. Our workshops run every trimester and are built for every skill level — whether you have never touched a terminal or you are prepping for OSCP.' },
        { num: '02', title: 'CTF Competitions', body: 'Sharpen your problem-solving in Capture-the-Flag events. Our CTF team trains weekly, competes nationally and internationally, and welcomes new players who want to learn by doing. No experience required — just curiosity.' },
        { num: '03', title: 'Industry Connections', body: 'Meet cybersecurity professionals through networking nights, guest lectures, and career panels. Get resume feedback, discover internship pipelines, and build relationships that last well beyond university.' },
        { num: '04', title: 'Community Building', body: 'Join 900+ students in our Discord who share knowledge, collaborate on side-projects, and support each other through assignments, certifications, and job applications. DUCA is your cybersecurity home at Deakin.' },
        { num: '05', title: 'Development Projects', body: 'Ship real software with our development team. From internal club tools to open-source platforms, you will gain practical coding experience, learn Git workflows, and build portfolio pieces that actually matter.' },
        { num: '06', title: 'Learning Resources', body: 'Access curated study guides, certification prep materials, and hands-on labs. Whether you are chasing CompTIA Security+, diving into cloud security, or exploring red-teaming — we have resources for every stage of your journey.' }
      ],

      aboutStrip: [
        { src: '/design/about-01.jpg', alt: 'The DUCA stall at O-Week, Trimester 1 2026' },
        { src: '/design/about-02.jpg', alt: 'DUCA members at a club event' },
        { src: '/design/about-03.webp', alt: 'DUCA members at a club event' },
        { src: '/design/about-04.webp', alt: 'DUCA members at a club event' }
      ],

      aboutTalks: [
        { src: '/design/about-05.jpg', alt: 'A DUCA member speaking at AISA CyberCon', tag: 'AISA CyberCon' },
        { src: '/design/about-06.jpg', alt: 'A DUCA member speaking at BSides Adelaide', tag: 'BSides Adelaide' },
        { src: '/design/about-07.jpg', alt: 'A DUCA member speaking at BSides Melbourne', tag: 'BSides Melbourne' },
        { src: '/design/about-08.jpg', alt: 'A DUCA member speaking at BSides Adelaide', tag: 'BSides Adelaide' },
        { src: '/design/about-09.webp', alt: 'A DUCA member speaking at a conference', tag: 'BSides Canberra' }
      ],

      aboutEvents: [
        {
          src: '/design/about-10.jpg',
          alt: 'DUCA running the HomeLabs Village at BSides Melbourne',
          tag: 'BSides Melbourne',
          caption: 'Running the HomeLabs Village — our members built and staffed the whole thing.'
        },
        {
          src: '/design/about-11.jpg',
          alt: 'DUCA members at BSides Ballarat',
          tag: 'BSides Ballarat',
          caption: 'A DUCA contingent at BSides Ballarat, one of several conferences we send members to each year.'
        },
        {
          src: '/design/about-12.jpg',
          alt: 'DUCA members at AISA CyberCon 2025',
          tag: 'AISA CyberCon',
          caption: 'Members at CyberCon, the largest security conference in the country.'
        }
      ],

      values: [
        { num: '01', title: 'Inspiration', body: 'Empowering members to explore and grow together.' },
        { num: '02', title: 'Innovation', body: "Driving creative solutions for cybersecurity's future." },
        { num: '03', title: 'Inclusivity', body: 'Building a welcoming and diverse community.' },
        { num: '04', title: 'Collaboration', body: 'Strengthening teamwork to achieve shared goals.' },
        { num: '05', title: 'Leadership', body: "Inspiring tomorrow's cybersecurity leaders." }
      ],

      eventFilters: kinds.map(k => ({
        label: k.toLowerCase(),
        onClick: () => this.setState({ filter: k, openEvent: 0 }),
        bg: filter === k ? 'var(--ink)' : 'transparent',
        fg: filter === k ? 'var(--on-ink)' : 'var(--ink)'
      })),
      eventCount: visibleEvents.length + ' of ' + this.EVENTS.length + ' shown',
      visibleEvents: visibleEvents.map((e, i) => ({
        ...e,
        open: this.state.openEvent === i,
        iconRot: this.state.openEvent === i ? '135deg' : '0deg',
        rowBg: this.state.openEvent === i ? 'var(--surface)' : 'transparent',
        onToggle: () => this.setState(st => ({ openEvent: st.openEvent === i ? -1 : i })),
        guests: (e.guests || []).map(gst => ({
          ...gst,
          initials: gst.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
        })),
        hasGuests: !!(e.guests && e.guests.length),
        guestTag: e.guests && e.guests.length > 1 ? 'Special guests' : 'Special guest',
        metaMargin: e.guests && e.guests.length ? '22px' : '12px'
      })),
      nextEvent: next
        ? { title: next.title, when: next.date + ' · ' + next.time, place: next.place }
        : { title: 'Nothing scheduled', when: 'Check the Discord', place: 'duca.au' },
      ...(() => {
        const per = 25;
        const all = this.PAST;
        const pages = Math.max(1, Math.ceil(all.length / per));
        const page = Math.min(this.state.pastPage, pages - 1);
        return {
          pastPage: all.slice(page * per, page * per + per),
          pastHasPages: true,
          pastPageLabel: 'Page ' + (page + 1) + ' of ' + pages,
          pastPrevColor: page > 0 ? 'var(--ink)' : 'var(--disabled)',
          pastNextColor: page < pages - 1 ? 'var(--ink)' : 'var(--disabled)',
          pastPrev: () => this.setState(st => ({ pastPage: Math.max(0, st.pastPage - 1) })),
          pastNext: () => this.setState(st => ({ pastPage: Math.min(pages - 1, st.pastPage + 1) }))
        };
      })(),

      unusedPastEvents: [
        { date: '09 OCT 2026', title: 'Logoff: Trimester 2 Social', kind: 'SOCIAL' },
        { date: '25 SEP 2026', title: 'OSINT Challenge Night', kind: 'CTF' },
        { date: '11 SEP 2026', title: 'Industry Night: Red Team', kind: 'INDUSTRY' },
        { date: '28 AUG 2026', title: 'Cloud Security Workshop', kind: 'WORKSHOP' },
        { date: '14 AUG 2026', title: 'O-Week Meet and Greet', kind: 'COMMUNITY' }
      ],

      liveNow,
      showCountdown: !!next && !liveNow,
      nextLabel: liveNow ? 'HAPPENING NOW' : 'NEXT UP',
      countdown: (() => {
        const ms = next ? new Date(next.iso).getTime() - this.state.now : 0;
        const t = Math.max(0, ms);
        const pad = n => String(n).padStart(2, '0');
        return [
          { label: 'Days', value: pad(Math.floor(t / 86400000)) },
          { label: 'Hours', value: pad(Math.floor(t / 3600000) % 24) },
          { label: 'Mins', value: pad(Math.floor(t / 60000) % 60) },
          { label: 'Secs', value: pad(Math.floor(t / 1000) % 60) }
        ];
      })(),

      ctfCats: [
        { pts: '50–400 PTS', name: 'Web', body: 'Injection, auth bypass, and the classic broken access control.' },
        { pts: '100–500 PTS', name: 'Crypto', body: 'Weak keys, bad padding, and homemade ciphers that should not exist.' },
        { pts: '50–350 PTS', name: 'Forensics', body: 'Disk images, packet captures, and recovering what someone deleted.' },
        { pts: '150–500 PTS', name: 'Reversing', body: 'Binaries that do not want to be read. Bring a disassembler.' },
        { pts: '50–250 PTS', name: 'OSINT', body: 'Metadata, reverse image search, and being far too good at geography.' }
      ],

      compare: [
        ['Attend any event, free', 1, 1],
        ['Take part in workshops and CTFs', 1, 1],
        ['Full access to the Discord', 1, 1],
        ['Eligible for event prizes', 0, 1],
        ['Counted in club numbers at DUSA', 0, 1],
        ['Eligible to run for committee', 0, 1]
      ].map(([text, o, m]) => ({
        text,
        open: o ? '✓' : '—',
        member: m ? '✓' : '—',
        openColor: o ? 'var(--ink)' : 'var(--muted)',
        memberColor: m ? 'var(--accent)' : 'var(--muted)'
      })),

      tierOpen: [
        { mark: '+', text: 'Attend any event, free' },
        { mark: '+', text: 'Take part in workshops and CTFs' },
        { mark: '+', text: 'Full access to the Discord' },
        { mark: '\u2013', text: 'Not eligible for event prizes' }
      ],

      tierMember: [
        { mark: '+', text: 'Everything above' },
        { mark: '+', text: 'Eligible for all event prizes' },
        { mark: '+', text: 'Counted in club numbers at DUSA' },
        { mark: '+', text: 'Supports our events and running costs' },
        { mark: '+', text: 'Eligible to run for committee' }
      ],

      steps: [
        { num: '1', title: 'Register via DUSA', body: 'Official membership goes through the student association. This is the step that makes you a registered member and prize-eligible.', cta: 'Register', url: 'https://www.dusa.org.au/clubs/deakin-university-cybersecurity-association-burwood-duca' },
        { num: '2', title: 'Join the Discord', body: 'Where events get announced and questions get answered. Open to anyone, member or not.', cta: 'Get the invite', url: 'https://discord.com/invite/duca' },
        { num: '3', title: 'Turn up to anything', body: 'Check the events page for what is next and come as you are. No RSVP needed, nothing to pay.', cta: 'ctf.duca.au', url: 'https://ctf.duca.au/' }
      ],

      faqs: [
        { q: 'Do I have to be a member to attend?', a: 'No. Every event is free and open \u2014 registration only affects prize eligibility.' },
        { q: 'What does registering cost?', a: 'Less than a coffee. It is a quick DUSA signup that takes a few minutes.' },
        { q: 'Where do I find upcoming events?', a: 'The events page here, or the Discord, where everything gets announced first.' },
        { q: 'I have no experience at all.', a: 'Most people start there. Workshops assume nothing and there is always someone at your table who started last trimester.' },
        { q: 'I am not studying cyber.', a: 'Fine. We have members from computer science, engineering, law and commerce.' },
        { q: 'Why does registration matter?', a: 'It keeps the club recognised by DUSA and funds the events, prizes and catering.' },
        { q: 'Who can win prizes?', a: 'Registered members only. Prizes are funded through membership and partner support, so they go to people on the roll — but anyone can still compete and appear on the scoreboard.' }
      ].map((q, i) => ({
        ...q,
        open: this.state.openFaq === i,
        rot: this.state.openFaq === i ? '135deg' : '0deg',
        onToggle: () => this.setState(st => ({ openFaq: st.openFaq === i ? -1 : i }))
      })),

    };
  }

  constructor(props) {
    super(props);
    const exportedPosts = this.POSTS;
    this.POSTS = (props.posts || []).map(post => {
      const design = exportedPosts.find(sample => sample.url.endsWith('/' + post.slug + '/'));
      return design ? { ...post, date: design.date, tag: design.tag, title: design.title, blurb: design.blurb } : post;
    });
    this.TEAM = (executives[String(this.state.teamYear)] || []).map(toDesignMember);
  }

  render() {
    const { aboutEvents, aboutStrip, aboutTalks, archiveCount, archiveOpen, archivePosts, archiveRot, blogFilters, blogHasPages, blogNext, blogNextColor, blogPageLabel, blogPosts, blogPrev, blogPrevColor, blogQuery, channelLoop, clearBlogSearch, compare, countdown, ctfCats, divisions, divisionsTeam, eventCount, eventFilters, execs, faqs, featuredPost, hasBlogQuery, homePosts, isAbout, isBlog, isCtf, isEvents, isHome, isJoin, isPartners, isPost, isTeam, liveNow, navItems, nextEvent, nextLabel, onBlogSearch, otherPartners, partnerLoop, partnerNameLoop, pastHasPages, pastNext, pastNextColor, pastPage, pastPageLabel, pastPrev, pastPrevColor, showCountdown, sponsors, stats, steps, teamYearLabel, teamYearNote, themeIcon, tickerLoop, toggleArchive, toggleTheme, values, visibleEvents, yearNext, yearNextColor, yearPrev, yearPrevColor } = this.renderVals();
    return (
<div style={css("background:var(--bg);color:var(--ink);font-family:'Hanken Grotesk',system-ui,sans-serif;min-height:100vh;overflow-x:hidden;position:relative")}>
<header style={css("position:sticky;top:0;z-index:60;background:var(--bg-t);backdrop-filter:blur(12px)")}>
<div style={css("max-width:1340px;margin:0 auto;padding:16px 24px;display:flex;align-items:center;gap:18px;flex-wrap:wrap")}>
<a href="/" style={css("display:flex;align-items:center;gap:11px;flex:0 0 auto")}>
<img src={"/duca.png"} alt={"DUCA"} style={css("height:36px;width:auto;display:block")} />
<span style={css("font-family:'Archivo',sans-serif;font-weight:800;font-size:22px;letter-spacing:-0.02em")}>{"DUCA"}</span>
</a>
<nav style={css("display:flex;gap:5px;flex-wrap:wrap;flex:1 1 auto;justify-content:center")}>
{navItems.map((item, index) => <React.Fragment key={index}>

<a href={item.href} target={item.target} rel={"noopener"} onClick={item.onClick} style={css(`font-family:'Space Mono',monospace;font-size:12.5px;padding:8px 14px;border-radius:999px;color:${item.color};background:${item.bg}`)} className="design-hover-0">{item.label}</a>

</React.Fragment>)}
</nav>
<div style={css("display:flex;gap:8px;flex:0 0 auto;align-items:center")}>
<button onClick={toggleTheme} aria-label={"Toggle dark mode"} data-theme-toggle={""} style={css("position:relative;width:36px;height:36px;border-radius:999px;border:2px solid var(--ink);background:transparent;cursor:pointer;padding:0;display:flex;align-items:center;justify-content:center;flex:0 0 auto")} className="design-hover-1">
<span data-theme-sparks={""} style={css("position:absolute;inset:0;pointer-events:none;overflow:visible;z-index:2")}></span>
<span data-theme-knob={""} style={css("display:flex;align-items:center;justify-content:center;color:var(--ink);z-index:1")} className="design-hover-2">{themeIcon}</span>
</button>
<a href="/join/" style={css("font-family:'Archivo',sans-serif;font-weight:700;font-size:14px;padding:9px 20px;border:2px solid var(--ink);border-radius:999px;background:var(--panel);color:var(--on-panel)")} className="design-hover-0">{"Join us"}</a>
</div>
</div>
</header>
<main>
{isHome && <>

<div>
<section style={css("max-width:1340px;margin:0 auto;padding:30px 24px 0")}>
<div style={css("position:relative;width:100%;height:clamp(470px,52vw,700px);margin:52px 0 0")}>
<canvas data-three={"hero"} style={css("position:absolute;inset:0;width:100%;height:100%;display:block")}></canvas>
<h1 style={css("position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);margin:0")}>{"Learn security by actually doing it. Workshops, CTFs and industry nights, run by students at Deakin."}</h1>
<div data-hero-labels={""} style={css("position:absolute;inset:0;z-index:2;pointer-events:none")}>
<svg data-label-lines={""} style={css("position:absolute;inset:0;width:100%;height:100%;overflow:visible")}>
<line data-label-line={"0"} x1={"0"} y1={"0"} x2={"0"} y2={"0"} stroke={"var(--ink)"} strokeWidth={"1"}></line>
<line data-label-line={"1"} x1={"0"} y1={"0"} x2={"0"} y2={"0"} stroke={"var(--ink)"} strokeWidth={"1"}></line>
<line data-label-line={"2"} x1={"0"} y1={"0"} x2={"0"} y2={"0"} stroke={"var(--ink)"} strokeWidth={"1"}></line>
<line data-label-line={"3"} x1={"0"} y1={"0"} x2={"0"} y2={"0"} stroke={"var(--ink)"} strokeWidth={"1"}></line>
<line data-label-line={"4"} x1={"0"} y1={"0"} x2={"0"} y2={"0"} stroke={"var(--ink)"} strokeWidth={"1"}></line>
<line data-label-line={"5"} x1={"0"} y1={"0"} x2={"0"} y2={"0"} stroke={"var(--ink)"} strokeWidth={"1"}></line>
<line data-label-line={"6"} x1={"0"} y1={"0"} x2={"0"} y2={"0"} stroke={"var(--ink)"} strokeWidth={"1"}></line>
</svg>
<span data-label-dot={"0"} style={css("position:absolute;width:7px;height:7px;background:var(--panel);transform:translate(-50%,-50%)")}></span>
<span data-label-dot={"1"} style={css("position:absolute;width:7px;height:7px;background:var(--panel);transform:translate(-50%,-50%)")}></span>
<span data-label-dot={"2"} style={css("position:absolute;width:7px;height:7px;background:var(--panel);transform:translate(-50%,-50%)")}></span>
<span data-label-dot={"3"} style={css("position:absolute;width:7px;height:7px;background:var(--panel);transform:translate(-50%,-50%)")}></span>
<span data-label-dot={"4"} style={css("position:absolute;width:7px;height:7px;background:var(--panel);transform:translate(-50%,-50%)")}></span>
<span data-label-dot={"5"} style={css("position:absolute;width:7px;height:7px;background:var(--panel);transform:translate(-50%,-50%)")}></span>
<span data-label-dot={"6"} style={css("position:absolute;width:7px;height:7px;background:var(--panel);transform:translate(-50%,-50%)")}></span>
<span data-label-node={"0"} style={css("position:absolute;font-family:'Space Mono',monospace;font-size:13px;letter-spacing:0.04em;white-space:nowrap;transform:translate(-50%,-50%)")}>{"workshops"}</span>
<span data-label-node={"1"} style={css("position:absolute;font-family:'Space Mono',monospace;font-size:13px;letter-spacing:0.04em;white-space:nowrap;transform:translate(-50%,-50%)")}>{"CTFs"}</span>
<span data-label-node={"2"} style={css("position:absolute;font-family:'Space Mono',monospace;font-size:13px;letter-spacing:0.04em;white-space:nowrap;transform:translate(-50%,-50%)")}>{"industry nights"}</span>
<span data-label-node={"3"} style={css("position:absolute;font-family:'Space Mono',monospace;font-size:13px;letter-spacing:0.04em;white-space:nowrap;transform:translate(-50%,-50%)")}>{"socials"}</span>
<span data-label-node={"4"} style={css("position:absolute;font-family:'Space Mono',monospace;font-size:13px;letter-spacing:0.04em;white-space:nowrap;transform:translate(-50%,-50%)")}>{"study groups"}</span>
<span data-label-node={"5"} style={css("position:absolute;font-family:'Space Mono',monospace;font-size:13px;letter-spacing:0.04em;white-space:nowrap;transform:translate(-50%,-50%)")}>{"dev projects"}</span>
<span data-label-node={"6"} style={css("position:absolute;font-family:'Space Mono',monospace;font-size:13px;letter-spacing:0.04em;white-space:nowrap;transform:translate(-50%,-50%)")}>{"career nights"}</span>
</div>
</div>
<div style={css("display:flex;flex-direction:column;align-items:center;gap:30px;padding:0 0 60px;margin-top:50px;position:relative;z-index:3")}>
<div data-anim-group={""} style={css("width:min(100%,84vw);max-width:940px;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:18px;align-items:start;order:-1")}>
{stats.map((s, index) => <React.Fragment key={index}>

<div style={css("text-align:center")}>
<div style={css("font-family:'Archivo',sans-serif;font-weight:800;font-size:clamp(34px,3.8vw,50px);line-height:1;letter-spacing:-0.02em;color:var(--accent)")}>{s.shown}</div>
<div style={css("font-family:'Space Mono',monospace;font-size:13px;letter-spacing:0.14em;text-transform:uppercase;margin-top:12px;color:var(--ink)")}>{s.label}</div>
<div style={css("font-family:'Space Mono',monospace;font-size:12.5px;color:var(--muted);margin-top:4px")}>{s.note}</div>
</div>

</React.Fragment>)}
</div>
</div>
</section>
<div style={css("overflow:hidden;background:oklch(0.87 0.2 124);color:#0E0E0C;border-top:2px solid var(--ink);border-bottom:2px solid var(--ink);transform:rotate(-1.4deg);width:108%;margin:52px -4% 96px;padding:13px 0")}>
<div data-anim={"ticker"} style={css("display:flex;width:max-content;font-family:'Silkscreen',monospace;font-size:14px;letter-spacing:0.06em")}>
{tickerLoop.map((t, index) => <React.Fragment key={index}>

<span style={css("padding:0 22px;white-space:nowrap")}>{t.text}</span>

</React.Fragment>)}
</div>
</div>
<section style={css("max-width:1340px;margin:0 auto;padding:0 24px 76px")}>
<div data-join={""} style={css("position:relative;overflow:hidden;background:var(--panel);border-radius:30px;padding:clamp(34px,4.8vw,62px);color:var(--on-panel)")}>
<canvas data-join-grid={""} style={css("position:absolute;inset:0;width:100%;height:100%;opacity:0.5")}></canvas>
<div style={css("position:relative;z-index:2;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,290px),1fr));gap:40px;align-items:center")}>
<div>
<h2 style={css("font-family:'Archivo',sans-serif;font-weight:800;font-size:clamp(34px,5.4vw,68px);letter-spacing:-0.018em;margin:0 0 16px;text-transform:uppercase;line-height:0.9")}>
<span data-join-line={""} style={css("display:block;overflow:hidden;padding-bottom:0.03em")}><span style={css("display:block")}>{"Join us"}</span></span>
</h2>
<p style={css("font-size:18px;line-height:1.6;color:#B4B4AA;margin:0 0 16px;max-width:46ch")}>{"Every event is free to attend and take part in. Join the Discord or check the events page to see what is happening soon."}</p>
<p style={css("font-size:18px;line-height:1.6;color:#B4B4AA;margin:0 0 28px;max-width:46ch")}>{"Signing up through DUSA makes you an official member, and helps cover the cost of running the club."}</p>
<div style={css("display:flex;gap:12px;flex-wrap:wrap")}>
<a href="/join/" style={css("font-family:'Archivo',sans-serif;font-weight:700;font-size:17px;padding:16px 30px;background:oklch(0.87 0.2 124);color:#0E0E0C;border-radius:999px;transition:transform 0.15s")} className="design-hover-3">{"How to join"}</a>
<a href={"https://discord.com/invite/duca"} target={"_blank"} rel={"noopener"} style={css("font-family:'Archivo',sans-serif;font-weight:700;font-size:17px;padding:16px 30px;border:2px solid #3A3A34;color:var(--on-panel);border-radius:999px;transition:transform 0.15s")} className="design-hover-4">{"Discord ↗"}</a>
</div>
</div>
<div data-join-mark={""} style={css("position:relative;display:flex;align-items:center;justify-content:center;min-height:clamp(260px,30vw,360px)")}>
<canvas data-join-rain={""} style={css("position:absolute;inset:0;width:100%;height:100%")}></canvas>
<img src={"/duca.png"} alt={"DUCA"} data-join-logo={""} style={css("position:relative;z-index:2;width:min(58%,260px);height:auto;display:block")} />
</div>
</div>
</div>
</section>
<section style={css("max-width:1340px;margin:0 auto;padding:0 24px 76px")}>
<div style={css("display:flex;justify-content:space-between;align-items:baseline;gap:20px;flex-wrap:wrap;margin-bottom:26px")}>
<h2 style={css("font-family:'Archivo',sans-serif;font-weight:800;font-size:clamp(30px,4.4vw,56px);letter-spacing:-0.018em;margin:0;text-transform:uppercase;line-height:0.95")}>{"Next up"}</h2>
<a href="/events/" style={css("font-family:'Space Mono',monospace;font-size:13px;border:2px solid var(--ink);border-radius:999px;padding:8px 16px")} className="design-hover-5">{"all events →"}</a>
</div>
<a href="/events/" data-anim={"up"} style={css("display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr));border-radius:26px;overflow:hidden;background:var(--panel);color:var(--on-panel);transition:transform 0.2s")} className="design-hover-6">
<div style={css("padding:42px 34px;display:flex;flex-direction:column;justify-content:space-between;gap:30px")}>
<span style={css("font-family:'Silkscreen',monospace;font-size:13px;color:oklch(0.87 0.2 124)")}>{"FRI 11 SEPT"}</span>
<div>
<div style={css("font-family:'Archivo',sans-serif;font-weight:800;font-size:clamp(34px,4.4vw,52px);letter-spacing:-0.018em;line-height:0.95;text-transform:uppercase")}>{"Logoff"}</div>
<div style={css("font-family:'Space Mono',monospace;font-size:12px;letter-spacing:0.12em;color:#8E8E84;margin-top:10px")}>{"SOCIAL / COMMUNITY"}</div>
</div>
</div>
<div style={css("padding:42px 34px;display:flex;flex-direction:column;justify-content:space-between;gap:22px;background:var(--accent-deep);color:#FFFFFF")}>
<p style={css("font-size:18px;line-height:1.5;margin:0")}>{"DUCA's end-of-trimester social. Pizza, a quiz, and no laptops required."}</p>
<div style={css("font-family:'Space Mono',monospace;font-size:13px;line-height:1.9")}>{"6:00 pm"}<br />{"Deakin Burwood, Room LC1.003"}</div>
</div>
</a>
</section>
<section style={css("width:100vw;margin-left:calc(50% - 50vw);background:var(--band);padding:30px 0 34px;overflow:hidden")}>
<p style={css("font-family:'Space Mono',monospace;font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:var(--muted);text-align:center;margin:0 0 24px")}>{"We partner with"}</p>
<div data-anim={"marquee"} style={css("display:flex;width:max-content;align-items:center")}>
{partnerLoop.map((p, index) => <React.Fragment key={index}>

<div style={css("flex:0 0 auto;padding:0 40px")}><img src={p.src} alt={p.name} style={css("height:40px;width:auto;max-width:160px;object-fit:contain;opacity:1")} /></div>

</React.Fragment>)}
</div>
<div data-anim={"marquee2"} style={css("display:flex;width:max-content;align-items:center;margin-top:22px;font-family:'Archivo',sans-serif;font-weight:800;font-size:clamp(28px,4vw,52px);letter-spacing:-0.018em;text-transform:uppercase;color:transparent;-webkit-text-stroke:1px var(--hair-strong)")}>
{partnerNameLoop.map((p, index) => <React.Fragment key={index}>

<span style={css("padding:0 26px;white-space:nowrap")}>{p.name}</span>

</React.Fragment>)}
</div>
</section>
<section style={css("max-width:1340px;margin:0 auto;padding:76px 24px")}>
<div style={css("display:flex;justify-content:space-between;align-items:baseline;gap:20px;flex-wrap:wrap;margin-bottom:26px")}>
<h2 style={css("font-family:'Archivo',sans-serif;font-weight:800;font-size:clamp(30px,4.4vw,56px);letter-spacing:-0.018em;margin:0;text-transform:uppercase;line-height:0.95")}>{"From the blog"}</h2>
<a href="/blog/" style={css("font-family:'Space Mono',monospace;font-size:13px;border:2px solid var(--ink);border-radius:999px;padding:8px 16px")} className="design-hover-5">{"all posts →"}</a>
</div>
<div data-anim-group={""} style={css("display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,290px),1fr));gap:16px")}>
{homePosts.map((post, index) => <React.Fragment key={index}>

<a data-blog-card="" href={post.url} style={css("display:flex;flex-direction:column;border:2px solid var(--ink);border-radius:24px;overflow:hidden")} className="design-hover-7">
<div style={css("position:relative;width:100%;aspect-ratio:16/10;border-bottom:2px solid var(--ink);background:var(--surface)")}>
<img src={post.image} alt="" loading="lazy" style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}} />
</div>
<div style={css("display:flex;flex-direction:column;gap:12px;padding:26px 28px 28px")}>
<span style={css("font-family:'Space Mono',monospace;font-size:11.5px;letter-spacing:0.1em;color:var(--muted)")}>{post.date}</span>
<h3 style={css("font-family:'Archivo',sans-serif;font-weight:700;font-size:22px;line-height:1.15;letter-spacing:-0.012em;margin:0")}>{post.title}</h3>
<p style={css("font-size:15.5px;line-height:1.55;color:var(--body-2);margin:0")}>{post.blurb}</p>
</div>
</a>

</React.Fragment>)}
</div>
</section>
<section style={css("max-width:1340px;margin:0 auto;padding:0 24px 90px")}>
<div style={css("background:var(--panel);border-radius:30px;padding:clamp(34px,5vw,64px);display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr));gap:44px;align-items:center")}>
<div>
<h2 style={css("font-family:'Archivo',sans-serif;font-weight:800;font-size:clamp(30px,4.4vw,54px);letter-spacing:-0.018em;line-height:0.95;color:var(--on-panel);margin:0 0 18px;text-transform:uppercase")}>{"The Discord"}<br />{"never sleeps"}</h2>
<p style={css("font-size:18px;line-height:1.6;color:#9E9E94;margin:0 0 28px;max-width:46ch")}>{"750+ students and industry folks. Event pings, assignment panic, CTF writeups, and a steady stream of cat photos."}</p>
<a href={"https://discord.com/invite/duca"} target={"_blank"} rel={"noopener"} style={css("display:inline-block;font-family:'Archivo',sans-serif;font-weight:700;font-size:17px;padding:16px 30px;border-radius:999px;background:oklch(0.87 0.2 124);color:#0E0E0C;transition:transform 0.15s")} className="design-hover-3">{"Open the invite ↗"}</a>
</div>
<div style={css("position:relative;height:240px;overflow:hidden;transform:rotate(-6deg) scale(1.04);-webkit-mask-image:linear-gradient(180deg,transparent 0%,#000 16%,#000 84%,transparent 100%);mask-image:linear-gradient(180deg,transparent 0%,#000 16%,#000 84%,transparent 100%)")}>
<div data-anim={"channels"} style={css("display:flex;flex-direction:column;gap:10px;padding:0 4px")}>
{channelLoop.map((c, index) => <React.Fragment key={index}>

<div style={css("display:flex;align-items:center;gap:12px;background:#1A1A16;border:1px solid #2E2E28;border-radius:14px;padding:13px 16px")}>
<span style={css("font-family:'Archivo',sans-serif;font-weight:700;font-size:15px;color:var(--muted)")}>{"#"}</span>
<span style={css("font-family:'Space Mono',monospace;font-size:13.5px;color:var(--on-panel);white-space:nowrap;flex:1")}>{c.name}</span>
<span style={css(`font-family:'Space Mono',monospace;font-size:11px;color:${c.tint};white-space:nowrap`)}>{c.meta}</span>
</div>

</React.Fragment>)}
</div>
</div>
</div>
</section>
</div>

</>}
{isAbout && <>

<div>
<section data-anim={"hero"} style={css("max-width:1340px;margin:0 auto;padding:44px 24px 36px")}>
<h1 style={css("font-family:'Archivo',sans-serif;font-weight:800;font-size:clamp(40px,7.4vw,104px);letter-spacing:-0.022em;line-height:0.88;margin:0 0 24px;max-width:none;text-transform:uppercase")}>{"Students built"}<br />{"all of this"}</h1>
<p style={css("font-size:19px;line-height:1.6;color:var(--body);margin:0")}>{"DUCA runs on members. Everything you see — the workshops, the CTF team, the industry nights — was set up by students who wanted it to exist, and it keeps going because new people take it on. We also know how much networking matters in this field, so we work hard to bring the best industry experts we can to our events to share what they have learned."}</p>
</section>
<section data-anim-group={""} style={css("max-width:1340px;margin:0 auto;padding:0 24px 76px;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,200px),1fr));gap:12px")}>
{aboutStrip.map((img, index) => <React.Fragment key={index}>

<div style={css("aspect-ratio:4/3;border-radius:18px;overflow:hidden;background:var(--surface)")}>
<img src={img.src} alt={img.alt} loading={"lazy"} style={css("width:100%;height:100%;object-fit:cover;display:block")} />
</div>

</React.Fragment>)}
</section>
<section style={css("max-width:1340px;margin:0 auto;padding:0 24px 76px")}>
<h2 style={css("font-family:'Archivo',sans-serif;font-weight:800;font-size:clamp(26px,3.6vw,44px);letter-spacing:-0.018em;margin:0 0 26px;text-transform:uppercase")}>{"What we actually run"}</h2>
<div data-anim-group={""} style={css("display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));gap:0 44px;border-top:2px solid var(--ink)")}>
{divisions.map((d, index) => <React.Fragment key={index}>

<div style={css("border-bottom:1px solid var(--hair);padding:26px 0")}>
<div style={css("display:flex;gap:14px;align-items:baseline;margin-bottom:10px")}>
<span style={css("font-family:'Silkscreen',monospace;font-size:12px;color:var(--accent)")}>{d.num}</span>
<h3 style={css("font-family:'Archivo',sans-serif;font-weight:700;font-size:23px;letter-spacing:-0.012em;margin:0")}>{d.title}</h3>
</div>
<p style={css("font-size:16px;line-height:1.6;color:var(--body);margin:0;text-wrap:pretty")}>{d.body}</p>
</div>

</React.Fragment>)}
</div>
</section>
<section style={css("border-top:2px solid var(--ink);background:var(--surface)")}>
<div style={css("max-width:1340px;margin:0 auto;padding:64px 24px 76px")}>
<h2 style={css("font-family:'Archivo',sans-serif;font-weight:800;font-size:clamp(26px,3.6vw,44px);letter-spacing:-0.018em;margin:0 0 14px;text-transform:uppercase")}>{"Out in the industry"}</h2>
<p style={css("font-size:19px;line-height:1.6;color:var(--body);margin:0 0 34px")}>{"Wherever Australian security people gather, there is usually a DUCA member in the room. BSides Melbourne, BSides Ballarat, BSides Adelaide, BSides Canberra, AISA CyberCon — our members are there speaking, running villages and volunteering on the day, not just collecting lanyards."}</p>
<div data-anim-group={""} style={css("display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:18px")}>
{aboutEvents.map((e, index) => <React.Fragment key={index}>

<figure style={css("margin:0;display:flex;flex-direction:column;gap:14px")}>
<div style={css("aspect-ratio:4/3;border-radius:22px;overflow:hidden;background:#E6E6E0")}>
<img src={e.src} alt={e.alt} loading={"lazy"} style={css("width:100%;height:100%;object-fit:cover;display:block")} />
</div>
<figcaption>
<div style={css("font-family:'Space Mono',monospace;font-size:11.5px;letter-spacing:0.12em;text-transform:uppercase;color:var(--accent);margin-bottom:6px")}>{e.tag}</div>
<div style={css("font-size:16px;line-height:1.5;color:var(--body)")}>{e.caption}</div>
</figcaption>
</figure>

</React.Fragment>)}
</div>
<h3 style={css("font-family:'Archivo',sans-serif;font-weight:700;font-size:clamp(20px,2.4vw,28px);letter-spacing:-0.012em;margin:56px 0 20px")}>{"On stage, not just in the audience"}</h3>
<div data-anim-group={""} style={css("display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,160px),1fr));gap:12px")}>
{aboutTalks.map((t, index) => <React.Fragment key={index}>

<figure style={css("margin:0")}>
<div style={css("aspect-ratio:3/4;border-radius:16px;overflow:hidden;background:#E6E6E0")}>
<img src={t.src} alt={t.alt} loading={"lazy"} style={css("width:100%;height:100%;object-fit:cover;display:block")} />
</div>
<figcaption style={css("font-family:'Space Mono',monospace;font-size:11.5px;letter-spacing:0.08em;color:var(--body);margin-top:10px")}>{t.tag}</figcaption>
</figure>

</React.Fragment>)}
<div style={css("aspect-ratio:3/4;border:2px dashed var(--hair-strong);border-radius:16px;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:8px;text-align:center;padding:18px")}>
<span style={css("font-family:'Archivo',sans-serif;font-weight:800;font-size:clamp(22px,2.6vw,30px);letter-spacing:-0.018em;line-height:1")}>{"+ many"}<br />{"more"}</span>
<span style={css("font-family:'Space Mono',monospace;font-size:11px;letter-spacing:0.08em;color:var(--muted)")}>{"every year"}</span>
</div>
</div>
</div>
</section>
<section style={css("max-width:1340px;margin:0 auto;padding:76px 24px")}>
<div data-values={""} style={css("position:relative;overflow:hidden;background:var(--panel);border-radius:30px;padding:clamp(32px,4.6vw,58px) clamp(32px,4.6vw,58px) clamp(48px,6vw,80px)")}>
<canvas data-values-bg={""} style={css("position:absolute;inset:0;width:100%;height:100%;pointer-events:none")}></canvas>
<h2 style={css("position:relative;z-index:1;font-family:'Archivo',sans-serif;font-weight:800;font-size:clamp(26px,3.6vw,44px);letter-spacing:-0.018em;color:var(--on-panel);margin:0 0 32px;text-transform:uppercase")}>{"Five words we keep coming back to"}</h2>
<div data-anim-group={""} style={css("position:relative;z-index:1;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,200px),1fr));gap:12px")}>
{values.map((v, index) => <React.Fragment key={index}>

<div style={css("position:relative;overflow:hidden;border:1px solid #2A2A26;border-radius:20px;padding:26px 22px 24px;min-height:200px;display:flex;flex-direction:column;justify-content:flex-end;gap:10px;color:var(--on-panel);background:rgba(14,14,12,0.55);backdrop-filter:blur(7px);-webkit-backdrop-filter:blur(7px);transition:background 0.2s,border-color 0.2s,transform 0.2s")} className="design-hover-8">
<span style={css("position:absolute;top:-14px;right:4px;font-family:'Archivo',sans-serif;font-weight:800;font-size:96px;line-height:1;color:currentColor;opacity:0.1;pointer-events:none")}>{v.num}</span>
<div style={css("font-family:'Archivo',sans-serif;font-weight:800;font-size:clamp(20px,2.2vw,25px);letter-spacing:-0.015em;position:relative;z-index:1")}>{v.title}</div>
<div style={css("font-size:14.5px;line-height:1.5;opacity:0.78;position:relative;z-index:1")}>{v.body}</div>
</div>

</React.Fragment>)}
</div>
</div>
</section>
<section style={css("max-width:1340px;margin:0 auto;padding:0 24px 90px")}>
<h2 style={css("font-family:'Archivo',sans-serif;font-weight:800;font-size:clamp(24px,3.2vw,40px);letter-spacing:-0.018em;margin:0;text-transform:uppercase")}>{"Who runs it? "}<a href="/team/" style={css("color:var(--accent);border-bottom:3px solid var(--accent)")} className="design-hover-9">{"Meet the team ↗"}</a></h2>
</section>
</div>

</>}
{isEvents && <>

<div>
<section data-anim={"hero"} style={css("max-width:1340px;margin:0 auto;padding:44px 24px 30px")}>
<h1 style={css("font-family:'Archivo',sans-serif;font-weight:800;font-size:clamp(44px,8.4vw,120px);letter-spacing:-0.022em;line-height:0.88;margin:0 0 22px;text-transform:uppercase")}>{"What's on"}</h1>
<p style={css("font-size:19px;line-height:1.6;color:var(--body);max-width:54ch;margin:0")}>{"Free, open to all Deakin students, and usually catered. Turn up to one and you'll know three people by the end of it."}</p>
</section>
<section style={css("max-width:1340px;margin:0 auto;padding:0 24px 46px")}>
<div data-countdown={""} data-glow={""} style={css("position:relative;overflow:hidden;background:var(--panel);border-radius:30px;padding:clamp(28px,3.6vw,46px);color:var(--on-panel);display:flex;flex-wrap:wrap;gap:34px;align-items:center;justify-content:space-between")}>
<canvas data-glow-bg={""} style={css("position:absolute;inset:0;width:100%;height:100%;pointer-events:none")}></canvas>
<div style={css("position:relative;z-index:1;flex:3 1 300px;min-width:0")}>
<span style={css("font-family:'Space Mono',monospace;font-size:11.5px;letter-spacing:0.16em;color:oklch(0.87 0.2 124);display:block;margin-bottom:16px")}>{nextLabel}</span>
<h2 style={css("font-family:'Archivo',sans-serif;font-weight:800;font-size:clamp(28px,4vw,50px);letter-spacing:-0.018em;line-height:0.95;margin:0 0 12px;text-transform:uppercase")}>{nextEvent.title}</h2>
<p style={css("font-family:'Space Mono',monospace;font-size:13px;color:#B4B4AA;margin:0")}>{nextEvent.when}{" · "}{nextEvent.place}</p>
</div>
<div style={css("position:relative;z-index:1;flex:2 1 300px;display:flex;justify-content:flex-end")}>
{liveNow && <>

<div style={css("border:2px solid oklch(0.87 0.2 124);border-radius:20px;padding:22px 26px;background:rgba(198,242,78,0.1);max-width:280px")}>
<div style={css("font-family:'Archivo',sans-serif;font-weight:800;font-size:clamp(20px,2.4vw,28px);letter-spacing:-0.015em;line-height:1.05;color:oklch(0.87 0.2 124);text-transform:uppercase")}>{"The event has already begun!"}</div>
<div style={css("font-family:'Space Mono',monospace;font-size:12.5px;color:#B4B4AA;margin-top:10px")}>{"Come anyway — just walk in."}</div>
</div>

</>}
{showCountdown && <>

<div style={css("display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;width:100%;max-width:400px")}>
{countdown.map((c, index) => <React.Fragment key={index}>

<div style={css("border:1px solid #2A2A26;border-radius:18px;padding:20px 8px;text-align:center;background:rgba(14,14,12,0.5);backdrop-filter:blur(6px)")}>
<div style={css("font-family:'Archivo',sans-serif;font-weight:800;font-size:clamp(26px,3.2vw,40px);line-height:1;letter-spacing:-0.02em;color:oklch(0.87 0.2 124)")}>{c.value}</div>
<div style={css("font-family:'Space Mono',monospace;font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:#8E8E84;margin-top:8px")}>{c.label}</div>
</div>

</React.Fragment>)}
</div>

</>}
</div>
</div>
</section>
<section style={css("max-width:1340px;margin:0 auto;padding:0 24px 90px")}>
<div style={css("display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:26px")}>
{eventFilters.map((fl, index) => <React.Fragment key={index}>

<button onClick={fl.onClick} style={css(`font-family:'Space Mono',monospace;font-size:12.5px;padding:9px 18px;cursor:pointer;border:2px solid var(--ink);border-radius:999px;background:${fl.bg};color:${fl.fg};transition:transform 0.15s`)} className="design-hover-10">{fl.label}</button>

</React.Fragment>)}
<span style={css("font-family:'Space Mono',monospace;font-size:12.5px;color:var(--muted);margin-left:auto")}>{eventCount}</span>
</div>
<div data-anim-group={""} style={css("border-top:2px solid var(--ink)")}>
{visibleEvents.map((e, index) => <React.Fragment key={index}>

<div style={css(`border-bottom:1px solid var(--hair);background:${e.rowBg};transition:background 0.18s`)}>
<button aria-expanded={e.open} onClick={e.onToggle} style={css("width:100%;text-align:left;background:transparent;border:0;cursor:pointer;padding:22px 16px 22px 0;display:grid;grid-template-columns:auto 1fr auto;gap:22px;align-items:center;font-family:inherit;color:inherit;transition:background 0.18s")}>
<span style={css("font-family:'Archivo',sans-serif;font-weight:700;font-size:16px;letter-spacing:0.01em;color:var(--accent);min-width:104px;padding-left:16px")}>{e.date}</span>
<span style={css("display:flex;flex-direction:column;gap:5px")}>
<span style={css("font-family:'Archivo',sans-serif;font-weight:700;font-size:clamp(20px,2.4vw,27px);letter-spacing:-0.015em;line-height:1.1")}>{e.title}</span>
<span style={css("display:flex;align-items:center;gap:10px;flex-wrap:wrap")}>
<span style={css("font-family:'Space Mono',monospace;font-size:11.5px;letter-spacing:0.12em;color:var(--muted)")}>{e.kind}</span>
{e.hasGuests && <>

<span style={css("font-family:'Space Mono',monospace;font-size:10.5px;letter-spacing:0.1em;background:oklch(0.87 0.2 124);color:#0E0E0C;padding:4px 10px;border-radius:999px")}>{"GUEST SPEAKER"}</span>

</>}
</span>
</span>
<span style={css(`font-family:'Space Mono',monospace;font-size:19px;color:var(--ink);transform:rotate(${e.iconRot});transition:transform 0.3s cubic-bezier(0.34,1.56,0.64,1);display:inline-block`)}>{"+"}</span>
</button>
{e.open && <>

<div style={css("padding:0 58px 28px 142px;max-width:none")}>
<p style={css("font-size:16.5px;line-height:1.6;color:var(--body);margin:0")}>{e.body}</p>
{e.hasGuests && <>

<div style={css("margin-top:22px")}>
<div style={css("font-family:'Space Mono',monospace;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:var(--muted);margin-bottom:12px")}>{e.guestTag}</div>
<div style={css("display:flex;flex-direction:column;gap:8px;max-width:420px")}>
{e.guests.map((g, index) => <React.Fragment key={index}>

<div style={css("display:flex;align-items:center;gap:14px;min-width:0")}>
<span style={css("width:34px;height:34px;border-radius:50%;background:oklch(0.87 0.2 124);display:flex;align-items:center;justify-content:center;font-family:'Archivo',sans-serif;font-weight:800;font-size:12px;letter-spacing:0.02em;flex:0 0 auto")}>{g.initials}</span>
<span style={css("display:flex;flex-direction:column;min-width:0")}>
<span style={css("font-family:'Archivo',sans-serif;font-weight:700;font-size:15.5px;line-height:1.25")}>{g.name}</span>
<span style={css("font-family:'Hanken Grotesk',sans-serif;font-size:14px;line-height:1.35;color:var(--body-2)")}>{g.role}</span>
</span>
</div>

</React.Fragment>)}
</div>
</div>

</>}
<p style={css(`font-family:'Space Mono',monospace;font-size:12.5px;color:var(--muted);margin:${e.metaMargin} 0 0`)}>{e.time}{" · "}{e.place}</p>
</div>

</>}
</div>

</React.Fragment>)}
</div>
</section>
<section style={css("border-top:2px solid var(--ink);background:var(--surface)")}>
<div style={css("max-width:1340px;margin:0 auto;padding:54px 24px 80px")}>
<h2 style={css("font-family:'Archivo',sans-serif;font-weight:800;font-size:clamp(20px,2.4vw,28px);letter-spacing:-0.018em;margin:0 0 22px;text-transform:uppercase")}>{"Past events"}</h2>
<div data-anim-group={""}>
{pastPage.map((p, index) => <React.Fragment key={index}>

<div style={css("display:grid;grid-template-columns:150px 1fr auto;gap:22px;align-items:baseline;padding:14px 0;border-bottom:1px solid var(--hair)")}>
<span style={css("font-family:'Archivo',sans-serif;font-weight:700;font-size:15px;color:var(--muted)")}>{p.date}</span>
<span style={css("font-family:'Archivo',sans-serif;font-weight:600;font-size:16.5px;color:var(--body)")}>{p.title}</span>
<span style={css("font-family:'Space Mono',monospace;font-size:11.5px;letter-spacing:0.1em;color:var(--faint)")}>{p.kind}</span>
</div>

</React.Fragment>)}
</div>
{pastHasPages && <>

<div style={css("display:flex;align-items:center;justify-content:center;gap:14px;margin-top:24px")}>
<button disabled={pastPrevColor === "var(--disabled)"} onClick={pastPrev} style={css(`font-family:'Space Mono',monospace;font-size:12.5px;padding:8px 16px;cursor:pointer;border:2px solid var(--ink);border-radius:999px;background:transparent;color:${pastPrevColor}`)}>{"‹ newer"}</button>
<span style={css("font-family:'Space Mono',monospace;font-size:12.5px;color:var(--muted)")}>{pastPageLabel}</span>
<button disabled={pastNextColor === "var(--disabled)"} onClick={pastNext} style={css(`font-family:'Space Mono',monospace;font-size:12.5px;padding:8px 16px;cursor:pointer;border:2px solid var(--ink);border-radius:999px;background:transparent;color:${pastNextColor}`)}>{"older ›"}</button>
</div>

</>}
</div>
</section>
</div>

</>}
{isBlog && <>

<div>
<section data-anim={"hero"} style={css("max-width:1340px;margin:0 auto;padding:44px 24px 30px")}>
<h1 style={css("font-family:'Archivo',sans-serif;font-weight:800;font-size:clamp(42px,8vw,114px);letter-spacing:-0.022em;line-height:0.88;margin:0 0 22px;text-transform:uppercase")}>{"Writeups & recaps"}</h1>
<p style={css("font-size:19px;line-height:1.6;color:var(--body);max-width:54ch;margin:0")}>{"What happened at the last event, what we learned, and the occasional field report from a conference."}</p>
</section>
<section style={css("max-width:1340px;margin:0 auto;padding:0 24px 46px")}>
{!this.state.blogQuery.trim() && this.state.blogFilter === "All" && <a data-featured-post="" href={featuredPost.url} data-anim={"up"} style={css("display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:0;border:2px solid var(--ink);border-radius:30px;overflow:hidden")}>
<div style={css("position:relative;min-height:260px;background:var(--surface);border-right:2px solid var(--ink)")}>
<img src={featuredPost.image} alt="" loading="lazy" style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}} />
</div>
<div style={css("padding:clamp(28px,3.6vw,44px);display:flex;flex-direction:column;justify-content:center;gap:14px")}>
<span style={css("font-family:'Space Mono',monospace;font-size:11.5px;letter-spacing:0.14em;color:var(--accent)")}>{"LATEST · "}{featuredPost.date}</span>
<h2 style={css("font-family:'Archivo',sans-serif;font-weight:800;font-size:clamp(24px,3.2vw,38px);letter-spacing:-0.018em;line-height:1.05;margin:0")}>{featuredPost.title}</h2>
<p style={css("font-size:16.5px;line-height:1.6;color:var(--body);margin:0;max-width:52ch")}>{featuredPost.blurb}</p>
<span style={css("font-family:'Space Mono',monospace;font-size:13px;color:var(--ink)")}>{"Read the post ↗"}</span>
</div>
</a>}
</section>
<section style={css("max-width:1340px;margin:0 auto;padding:0 24px 90px")}>
<div style={css("display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:26px")}>
{blogFilters.map((bf, index) => <React.Fragment key={index}>

<button onClick={bf.onClick} style={css(`font-family:'Space Mono',monospace;font-size:12.5px;padding:9px 18px;cursor:pointer;border:2px solid var(--ink);border-radius:999px;background:${bf.bg};color:${bf.fg};transition:transform 0.15s`)} className="design-hover-10">{bf.label}</button>

</React.Fragment>)}
<div style={css("display:flex;align-items:center;gap:12px;border:2px solid var(--ink);border-radius:999px;padding:4px 6px 4px 20px;margin-left:auto;width:min(100%,340px)")}>
<span style={css("font-family:'Space Mono',monospace;font-size:14px;color:var(--muted)")}>{"/"}</span>
<input type={"search"} aria-label="Search posts" value={blogQuery} onChange={onBlogSearch} placeholder={"Search posts"} style={css("flex:1;min-width:0;border:0;outline:none;background:transparent;font-family:'Hanken Grotesk',sans-serif;font-size:15.5px;color:var(--ink);padding:10px 0")} />
{hasBlogQuery && <>

<button onClick={clearBlogSearch} style={css("font-family:'Space Mono',monospace;font-size:12px;border:0;cursor:pointer;background:var(--panel);color:var(--on-panel);border-radius:999px;padding:8px 14px")}>{"clear"}</button>

</>}
</div>
</div>
<div data-anim-group={""} style={css("display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:18px;align-items:stretch")}>
{blogPosts.map((post, index) => <React.Fragment key={index}>

<a data-blog-card="" href={post.url} style={css("display:flex;flex-direction:column;border:2px solid var(--ink);border-radius:24px;overflow:hidden")} className="design-hover-7">
<div style={css("position:relative;width:100%;aspect-ratio:16/10;border-bottom:2px solid var(--ink);background:var(--surface)")}>
<img src={post.image} alt="" loading="lazy" style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}} />
</div>
<div style={css("display:flex;flex-direction:column;gap:11px;padding:24px 26px 26px;flex:1")}>
<span style={css("font-family:'Space Mono',monospace;font-size:11px;letter-spacing:0.12em;color:var(--accent)")}>{post.tag}{" · "}{post.date}</span>
<h3 style={css("font-family:'Archivo',sans-serif;font-weight:700;font-size:21px;line-height:1.15;letter-spacing:-0.012em;margin:0")}>{post.title}</h3>
<p style={css("font-size:15.5px;line-height:1.55;color:var(--body-2);margin:0")}>{post.blurb}</p>
</div>
</a>

</React.Fragment>)}
</div>
{blogPosts.length === 0 && <p role="status" style={css("font-family:'Space Mono',monospace;font-size:14px;color:var(--muted);padding:24px 0")}>No posts found.</p>}
{blogHasPages && <>

<div style={css("display:flex;align-items:center;justify-content:center;gap:14px;margin-top:28px")}>
<button disabled={blogPrevColor === "var(--disabled)"} onClick={blogPrev} style={css(`font-family:'Space Mono',monospace;font-size:12.5px;padding:8px 16px;cursor:pointer;border:2px solid var(--ink);border-radius:999px;background:transparent;color:${blogPrevColor}`)}>{"‹ newer"}</button>
<span style={css("font-family:'Space Mono',monospace;font-size:12.5px;color:var(--muted)")}>{blogPageLabel}</span>
<button disabled={blogNextColor === "var(--disabled)"} onClick={blogNext} style={css(`font-family:'Space Mono',monospace;font-size:12.5px;padding:8px 16px;cursor:pointer;border:2px solid var(--ink);border-radius:999px;background:transparent;color:${blogNextColor}`)}>{"older ›"}</button>
</div>

</>}
</section>
<section style={css("max-width:1340px;margin:0 auto;padding:0 24px 90px")}>
<div style={css("position:relative;background:var(--panel);border-radius:30px;overflow:hidden;color:var(--on-panel)")}>
<button aria-expanded={archiveOpen} onClick={toggleArchive} data-values={""} style={css("position:relative;width:100%;text-align:left;background:transparent;border:0;cursor:pointer;padding:clamp(26px,3.2vw,36px);display:flex;align-items:center;justify-content:space-between;gap:20px;font-family:inherit;color:inherit")}>
<canvas data-values-bg={""} style={css("position:absolute;inset:0;width:100%;height:100%;pointer-events:none;opacity:0.55")}></canvas>
<span style={css("position:relative;z-index:1;display:flex;flex-direction:column;gap:7px")}>
<span style={css("font-family:'Archivo',sans-serif;font-weight:800;font-size:clamp(22px,2.8vw,32px);letter-spacing:-0.018em;text-transform:uppercase")}>{"Archive"}</span>
<span style={css("font-family:'Space Mono',monospace;font-size:12.5px;color:#8E8E84")}>{archiveCount}</span>
</span>
<span style={css(`position:relative;z-index:1;font-family:'Space Mono',monospace;font-size:22px;color:oklch(0.87 0.2 124);transform:rotate(${archiveRot});transition:transform 0.3s cubic-bezier(0.34,1.56,0.64,1);display:inline-block`)}>{"+"}</span>
</button>
{archiveOpen && <>

<div style={css("position:relative;z-index:1;padding:0 clamp(26px,3.2vw,36px) clamp(26px,3.2vw,36px)")}>
{archivePosts.map((a, index) => <React.Fragment key={index}>

<a href={a.url} style={css("display:grid;grid-template-columns:150px 1fr auto;gap:22px;align-items:baseline;padding:14px 0;border-top:1px solid #2A2A26;color:var(--on-panel)")} className="design-hover-11">
<span style={css("font-family:'Archivo',sans-serif;font-weight:700;font-size:14.5px;color:#8E8E84")}>{a.date}</span>
<span style={css("font-family:'Archivo',sans-serif;font-weight:600;font-size:16px;line-height:1.3")}>{a.title}</span>
<span style={css("font-family:'Space Mono',monospace;font-size:11.5px;letter-spacing:0.1em;color:var(--muted)")}>{a.tag}</span>
</a>

</React.Fragment>)}
</div>

</>}
</div>
</section>
</div>

</>}
{isPost && this.props.article && <BlogArticle article={this.props.article}>{this.props.children}</BlogArticle>}
{isTeam && <>

<div>
<section data-anim={"hero"} style={css("max-width:1340px;margin:0 auto;padding:44px 24px 34px")}>
<div style={css("display:flex;align-items:flex-end;justify-content:space-between;gap:24px;flex-wrap:wrap;margin-bottom:22px")}>
<h1 style={css("font-family:'Archivo',sans-serif;font-weight:800;font-size:clamp(44px,8.4vw,120px);letter-spacing:-0.022em;line-height:0.88;margin:0;text-transform:uppercase")}>{"The team"}</h1>
<div data-year-switch={""} style={css("display:flex;align-items:center;gap:4px;border:2px solid var(--ink);border-radius:999px;padding:5px;margin-bottom:12px;background:var(--bg);box-shadow:4px 4px 0 var(--ink)")}>
<button disabled={yearPrevColor === "var(--disabled)"} onClick={yearPrev} aria-label={"Previous year"} style={css(`width:38px;height:38px;border-radius:50%;border:0;cursor:pointer;background:transparent;font-family:'Space Mono',monospace;font-size:15px;color:${yearPrevColor}`)} className="design-hover-7">{"‹"}</button>
<div data-year-window={""} style={css("position:relative;overflow:hidden;width:96px;height:38px")}>
<span data-year-sparks={""} style={css("position:absolute;inset:0;pointer-events:none;overflow:visible;z-index:2")}></span>
<span data-year-value={""} style={css("position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:'Silkscreen',monospace;font-size:17px;color:var(--ink)")}>{teamYearLabel}</span>
</div>
<button disabled={yearNextColor === "var(--disabled)"} onClick={yearNext} aria-label={"Next year"} style={css(`width:38px;height:38px;border-radius:50%;border:0;cursor:pointer;background:transparent;font-family:'Space Mono',monospace;font-size:15px;color:${yearNextColor}`)} className="design-hover-7">{"›"}</button>
</div>
</div>
<p style={css("font-size:19px;line-height:1.6;color:var(--body);max-width:54ch;margin:0")}>{teamYearNote}</p>
</section>
<section style={css("max-width:1340px;margin:0 auto;padding:0 24px 56px")}>
<h2 style={css("font-family:'Archivo',sans-serif;font-weight:800;font-size:clamp(22px,2.8vw,32px);letter-spacing:-0.018em;margin:0 0 20px;text-transform:uppercase")}>{"Executives"}</h2>
<div data-anim-group={""} style={css("display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:16px;align-items:start")}>
{execs.map((m, index) => <React.Fragment key={index}>

<a href={m.link === "#" ? "https://discord.com/invite/duca" : m.link} title={m.fact || undefined} aria-label={`${m.name}, ${m.role}${m.fact ? ". " + m.fact : ""}`} target={"_blank"} rel={"noopener"} style={css("border:2px solid var(--ink);border-radius:24px;overflow:hidden;display:flex;flex-direction:column;transition:border-color 0.18s,background 0.18s")} className="design-hover-12">
<div style={css("aspect-ratio:1;background:var(--surface);border-bottom:2px solid var(--ink);overflow:hidden")}>
<img src={m.img} alt={m.name} style={css("width:100%;height:100%;object-fit:cover;display:block")} />
</div>
<div style={css("padding:18px 20px 20px;display:flex;flex-direction:column;gap:7px")}>
<div style={css("font-family:'Space Mono',monospace;font-size:11.5px;letter-spacing:0.12em;text-transform:uppercase;color:var(--accent)")}>{m.role}</div>
<div style={css("font-family:'Archivo',sans-serif;font-weight:700;font-size:19px;letter-spacing:-0.012em;display:flex;align-items:baseline;gap:7px")}>{m.name}<span style={css("font-family:'Space Mono',monospace;font-size:13px;color:var(--muted)")}>{"↗"}</span></div>
</div>
</a>

</React.Fragment>)}
</div>
</section>
<section style={css("max-width:1340px;margin:0 auto;padding:0 24px 90px")}>
<h2 style={css("font-family:'Archivo',sans-serif;font-weight:800;font-size:clamp(22px,2.8vw,32px);letter-spacing:-0.018em;margin:0 0 8px;text-transform:uppercase")}>{"Committee"}</h2>
{divisionsTeam.map((d, index) => <React.Fragment key={index}>

<div style={css("padding-top:28px")}>
{d.name !== "Committee" && <h3 style={css("font-family:'Space Mono',monospace;font-size:12px;letter-spacing:0.16em;text-transform:uppercase;color:var(--muted);margin:0 0 16px;border-bottom:1px solid var(--hair);padding-bottom:10px")}>{d.name}</h3>}
{d.empty && <>

<p style={css("font-family:'Space Mono',monospace;font-size:13px;color:var(--muted);margin:0 0 6px")}>{"Positions open — ask in the Discord."}</p>

</>}
<div data-anim-group={""} style={css("display:grid;grid-template-columns:repeat(auto-fill,max(130px,calc((100% - 60px) / 6)));gap:12px;align-items:start;justify-content:start")}>
{d.members.map((m, index) => <React.Fragment key={index}>

<a href={m.link === "#" ? "https://discord.com/invite/duca" : m.link} title={m.fact || undefined} aria-label={`${m.name}, ${m.role}${m.fact ? ". " + m.fact : ""}`} target={"_blank"} rel={"noopener"} style={css("border:2px solid var(--ink);border-radius:18px;overflow:hidden;display:flex;flex-direction:column;transition:border-color 0.18s,background 0.18s")} className="design-hover-12">
<div style={css("aspect-ratio:1;background:var(--surface);border-bottom:2px solid var(--ink);overflow:hidden")}>
<img src={m.img} alt={m.name} style={css("width:100%;height:100%;object-fit:cover;display:block")} />
</div>
<div style={css("padding:13px 14px 15px;display:flex;flex-direction:column;gap:5px")}>
<div style={css("font-family:'Space Mono',monospace;font-size:10.5px;letter-spacing:0.1em;text-transform:uppercase;color:var(--accent)")}>{m.role}</div>
<div style={css("font-family:'Archivo',sans-serif;font-weight:700;font-size:15px;letter-spacing:-0.01em;line-height:1.2;display:flex;align-items:baseline;gap:5px")}>{m.name}<span style={css("font-family:'Space Mono',monospace;font-size:11px;color:var(--muted)")}>{"↗"}</span></div>
</div>
</a>

</React.Fragment>)}
</div>
</div>

</React.Fragment>)}
</section>
</div>

</>}
{isPartners && <>

<div>
<section data-anim={"hero"} style={css("max-width:1340px;margin:0 auto;padding:44px 24px 36px")}>
<h1 style={css("font-family:'Archivo',sans-serif;font-weight:800;font-size:clamp(40px,7.4vw,104px);letter-spacing:-0.022em;line-height:0.88;margin:0 0 24px;text-transform:uppercase")}>{"The people who"}<br />{"make it free"}</h1>
<p style={css("font-size:19px;line-height:1.6;color:var(--body);margin:0")}>{"Venues, prizes, speakers and pizza. Our partners send engineers to run sessions and open doors to internships."}</p>
</section>
<section style={css("max-width:1340px;margin:0 auto;padding:0 24px 56px")}>
<div data-anim={"up"} data-glow={""} style={css("position:relative;overflow:hidden;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:28px;align-items:center;background:var(--panel);border-radius:30px;padding:clamp(28px,3.4vw,44px);color:var(--on-panel)")}>
<canvas data-glow-bg={""} style={css("position:absolute;inset:0;width:100%;height:100%;pointer-events:none")}></canvas>
<div style={css("position:relative;z-index:1")}>
<span style={css("font-family:'Silkscreen',monospace;font-size:12px;color:oklch(0.87 0.2 124);display:block;margin-bottom:20px")}>{"PRINCIPAL PARTNER"}</span>
<h2 style={css("font-family:'Archivo',sans-serif;font-weight:800;font-size:clamp(28px,4vw,52px);letter-spacing:-0.018em;line-height:0.95;margin:0 0 18px;text-transform:uppercase")}>{"They make the big events happen"}</h2>
<p style={css("font-size:17.5px;line-height:1.6;color:#B4B4AA;margin:0 0 22px;max-width:52ch")}>{"Deakin Cyber has backed some of our largest events, put researchers in front of students, and connected members to work happening at the edge of the field."}</p>
<a href={"https://cybercentre.org.au/"} target={"_blank"} rel={"noopener"} style={css("font-family:'Space Mono',monospace;font-size:13px;color:oklch(0.87 0.2 124);border-bottom:1px solid oklch(0.87 0.2 124);padding-bottom:2px")} className="design-hover-13">{"cybercentre.org.au ↗"}</a>
</div>
<div data-dc-plate={""} style={css("position:relative;z-index:1;display:flex;align-items:center;justify-content:center;min-height:220px;overflow:hidden;border-radius:22px")}>
<canvas data-dc-plate-bg={""} style={css("position:absolute;inset:0;width:100%;height:100%;pointer-events:none;-webkit-mask-image:radial-gradient(ellipse 85% 80% at 50% 50%,#000 30%,transparent 100%);mask-image:radial-gradient(ellipse 85% 80% at 50% 50%,#000 30%,transparent 100%)")}></canvas>
<img src={"/partners/deakin-cyber.png"} alt={"Deakin Cyber Research and Innovation Hub"} style={css("position:relative;z-index:1;max-height:200px;width:100%;max-width:100%;object-fit:contain;filter:invert(1);mix-blend-mode:screen")} />
</div>
</div>
</section>
<section style={css("max-width:1340px;margin:0 auto;padding:0 24px 56px")}>
<h2 style={css("font-family:'Archivo',sans-serif;font-weight:800;font-size:clamp(22px,2.8vw,32px);letter-spacing:-0.018em;margin:0 0 22px;text-transform:uppercase")}>{"Sponsors"}</h2>
<div data-anim-group={""} style={css("display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr));gap:0 36px;border-top:2px solid var(--ink);margin-bottom:56px")}>
{sponsors.map((p, index) => <React.Fragment key={index}>

<a href={p.url} target={"_blank"} rel={"noopener"} style={css("display:flex;align-items:center;gap:20px;padding:20px 0;border-bottom:1px solid var(--hair)")} className="design-hover-14">
<img src={p.src} alt={""} style={css("height:30px;width:64px;object-fit:contain;object-position:left;flex:0 0 auto")} />
<span style={css("font-family:'Archivo',sans-serif;font-weight:600;font-size:16.5px;flex:1")}>{p.name}</span>
<span style={css("font-family:'Space Mono',monospace;font-size:12px;color:var(--muted)")}>{"↗"}</span>
</a>

</React.Fragment>)}
</div>
<h2 style={css("font-family:'Archivo',sans-serif;font-weight:800;font-size:clamp(22px,2.8vw,32px);letter-spacing:-0.018em;margin:0 0 22px;text-transform:uppercase")}>{"Partners"}</h2>
<div data-anim-group={""} style={css("display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr));gap:0 36px;border-top:2px solid var(--ink)")}>
{otherPartners.map((p, index) => <React.Fragment key={index}>

<a href={p.url} target={"_blank"} rel={"noopener"} style={css("display:flex;align-items:center;gap:20px;padding:20px 0;border-bottom:1px solid var(--hair)")} className="design-hover-14">
<img src={p.src} alt={""} style={css("height:30px;width:64px;object-fit:contain;object-position:left;flex:0 0 auto")} />
<span style={css("font-family:'Archivo',sans-serif;font-weight:600;font-size:16.5px;flex:1")}>{p.name}</span>
<span style={css("font-family:'Space Mono',monospace;font-size:12px;color:var(--muted)")}>{"↗"}</span>
</a>

</React.Fragment>)}
</div>
</section>
<section style={css("max-width:1340px;margin:0 auto;padding:20px 24px 90px")}>
<div data-glow={""} style={css("position:relative;overflow:hidden;background:var(--panel);border-radius:30px;padding:clamp(32px,4.6vw,52px);display:flex;gap:26px;flex-wrap:wrap;align-items:center;justify-content:space-between")}>
<canvas data-glow-bg={""} style={css("position:absolute;inset:0;width:100%;height:100%;pointer-events:none")}></canvas>
<div style={css("position:relative;z-index:1")}>
<h2 style={css("font-family:'Archivo',sans-serif;font-weight:800;font-size:clamp(24px,3.4vw,40px);letter-spacing:-0.018em;color:var(--on-panel);margin:0 0 10px;text-transform:uppercase")}>{"Sponsor a trimester"}</h2>
<p style={css("font-size:17px;line-height:1.6;color:#B4B4AA;margin:0;text-wrap:balance")}>{"Workshop series, CTF prize pools and networking nights all have partner slots."}</p>
</div>
<a href={"mailto:info@duca.au"} style={css("position:relative;z-index:1;font-family:'Archivo',sans-serif;font-weight:700;font-size:17px;padding:16px 30px;border-radius:999px;background:oklch(0.87 0.2 124);color:#0E0E0C;transition:transform 0.15s")} className="design-hover-3">{"info@duca.au"}</a>
</div>
</section>
</div>

</>}
{isCtf && <>

<div>
<section style={css("max-width:1340px;margin:0 auto;padding:30px 24px 0")}>
<div data-anim={"hero"} style={css("background:var(--accent);border-radius:30px;padding:clamp(34px,5.4vw,72px);color:var(--on-panel)")}>
<p style={css("font-family:'Silkscreen',monospace;font-size:13px;letter-spacing:0.08em;color:oklch(0.87 0.2 124);margin:0 0 22px")}>{"CTF.DUCA.AU"}</p>
<h1 style={css("font-family:'Archivo',sans-serif;font-weight:800;font-size:clamp(40px,7.6vw,108px);letter-spacing:-0.022em;line-height:0.86;margin:0 0 24px;max-width:13ch;text-transform:uppercase")}>{"We run our own CTF platform"}</h1>
<p style={css("font-size:19px;line-height:1.6;max-width:56ch;margin:0 0 32px")}>{"Challenges stay up year-round so you can practise whenever. Web, crypto, forensics, reversing and OSINT, written by DUCA members and graded from \"first week of uni\" to \"good luck\"."}</p>
<div style={css("display:flex;gap:12px;flex-wrap:wrap")}>
<a href={"https://ctf.duca.au/"} target={"_blank"} rel={"noopener"} style={css("font-family:'Archivo',sans-serif;font-weight:700;font-size:17px;padding:16px 30px;border-radius:999px;background:oklch(0.87 0.2 124);color:#0E0E0C;transition:transform 0.15s")} className="design-hover-3">{"Launch the platform ↗"}</a>
<a href="/events/" style={css("font-family:'Archivo',sans-serif;font-weight:700;font-size:17px;padding:16px 30px;border-radius:999px;border:2px solid var(--on-panel);color:var(--on-panel);transition:transform 0.15s")} className="design-hover-15">{"Training nights"}</a>
</div>
</div>
</section>
<section style={css("max-width:1340px;margin:0 auto;padding:60px 24px 90px")}>
<h2 style={css("font-family:'Archivo',sans-serif;font-weight:800;font-size:clamp(26px,3.6vw,44px);letter-spacing:-0.018em;margin:0 0 26px;text-transform:uppercase")}>{"Categories on the board"}</h2>
<div data-anim-group={""} style={css("display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,200px),1fr));gap:14px")}>
{ctfCats.map((c, index) => <React.Fragment key={index}>

<div style={css("border:2px solid var(--ink);border-radius:22px;padding:26px;transition:transform 0.2s")} className="design-hover-16">
<div style={css("font-family:'Silkscreen',monospace;font-size:11px;color:var(--accent);margin-bottom:18px")}>{c.pts}</div>
<h3 style={css("font-family:'Archivo',sans-serif;font-weight:700;font-size:23px;letter-spacing:-0.012em;margin:0 0 8px")}>{c.name}</h3>
<p style={css("font-size:15px;line-height:1.5;color:var(--body-2);margin:0")}>{c.body}</p>
</div>

</React.Fragment>)}
</div>
<p style={css("font-family:'Space Mono',monospace;font-size:12.5px;color:var(--muted);margin:28px 0 0")}>{"Sample point values shown — wire these to the live scoreboard."}</p>
</section>
</div>

</>}
{isJoin && <>

<div>
<section data-anim={"hero"} style={css("max-width:1340px;margin:0 auto;padding:44px 24px 34px")}>
<h1 style={css("font-family:'Archivo',sans-serif;font-weight:800;font-size:clamp(42px,8vw,114px);letter-spacing:-0.022em;line-height:0.88;margin:0 0 22px;text-transform:uppercase")}>{"Get on the roll"}</h1>
<p style={css("font-size:19px;line-height:1.6;color:var(--body);margin:0")}>{"Every DUCA event is free to attend and take part in, whether or not you are a registered member. Turn up to a workshop, sit a CTF, come to an industry night — nobody checks a list at the door. Registering through DUSA is the step that makes you eligible for prizes, counts you in the numbers that keep the club recognised, and helps cover the venues, catering and prize pools. It takes a few minutes and costs less than a coffee."}</p>
</section>
<section style={css("max-width:1340px;margin:0 auto;padding:0 24px 46px")}>
<div data-glow={""} style={css("position:relative;overflow:hidden;background:var(--panel);border-radius:30px;padding:clamp(28px,3.4vw,44px);color:var(--on-panel);display:flex;flex-wrap:wrap;gap:34px;align-items:center;justify-content:space-between")}>
<canvas data-glow-bg={""} style={css("position:absolute;inset:0;width:100%;height:100%;pointer-events:none")}></canvas>
<div style={css("position:relative;z-index:1;flex:3 1 320px;min-width:0")}>
<span style={css("font-family:'Space Mono',monospace;font-size:11.5px;letter-spacing:0.16em;color:oklch(0.87 0.2 124);display:block;margin-bottom:16px")}>{"IT COSTS LESS THAN A COFFEE"}</span>
<h2 style={css("font-family:'Archivo',sans-serif;font-weight:800;font-size:clamp(26px,3.6vw,44px);letter-spacing:-0.018em;line-height:0.98;margin:0 0 14px;text-transform:uppercase")}>{"Register in about four minutes"}</h2>
<p style={css("font-size:17px;line-height:1.6;color:#B4B4AA;margin:0;max-width:48ch")}>{"Official membership goes through DUSA. It costs less than a coffee, keeps the club recognised, and makes you eligible for everything we hand out."}</p>
</div>
<div style={css("position:relative;z-index:1;flex:2 1 260px;display:flex;flex-direction:column;gap:10px;align-items:stretch")}>
<a href={"https://www.dusa.org.au/clubs/deakin-university-cybersecurity-association-burwood-duca"} target={"_blank"} rel={"noopener"} style={css("font-family:'Archivo',sans-serif;font-weight:700;font-size:17px;padding:16px 28px;border-radius:999px;background:oklch(0.87 0.2 124);color:#0E0E0C;text-align:center")}>{"Register with DUSA ↗"}</a>
<a href={"https://discord.com/invite/duca"} target={"_blank"} rel={"noopener"} style={css("font-family:'Archivo',sans-serif;font-weight:700;font-size:17px;padding:16px 28px;border-radius:999px;border:2px solid #3A3A34;color:var(--on-panel);text-align:center")} className="design-hover-17">{"Join the Discord ↗"}</a>
</div>
</div>
</section>
<section style={css("max-width:1340px;margin:0 auto;padding:0 24px 56px;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));gap:clamp(34px,5vw,64px);align-items:start")}>
<div>
<h2 style={css("font-family:'Archivo',sans-serif;font-weight:800;font-size:clamp(22px,2.8vw,32px);letter-spacing:-0.018em;margin:0 0 20px;text-transform:uppercase")}>{"Anyone vs. member"}</h2>
<div data-anim-group={""} style={css("border-top:2px solid var(--ink)")}>
{compare.map((c, index) => <React.Fragment key={index}>

<div style={css("display:grid;grid-template-columns:1fr 54px 54px;gap:12px;align-items:center;padding:15px 0;border-bottom:1px solid var(--hair)")}>
<span style={css("font-size:16px;line-height:1.4")}>{c.text}</span>
<span style={css(`font-family:'Space Mono',monospace;font-size:15px;text-align:center;color:${c.openColor}`)}>{c.open}</span>
<span style={css(`font-family:'Space Mono',monospace;font-size:15px;text-align:center;color:${c.memberColor}`)}>{c.member}</span>
</div>

</React.Fragment>)}
<div style={css("display:grid;grid-template-columns:1fr 54px 54px;gap:12px;padding:14px 0 0")}>
<span></span>
<span style={css("font-family:'Space Mono',monospace;font-size:10.5px;letter-spacing:0.1em;text-transform:uppercase;text-align:center;color:var(--muted)")}>{"anyone"}</span>
<span style={css("font-family:'Space Mono',monospace;font-size:10.5px;letter-spacing:0.1em;text-transform:uppercase;text-align:center;color:var(--accent)")}>{"member"}</span>
</div>
</div>
</div>
<div>
<h2 style={css("font-family:'Archivo',sans-serif;font-weight:800;font-size:clamp(22px,2.8vw,32px);letter-spacing:-0.018em;margin:0 0 20px;text-transform:uppercase")}>{"How it works"}</h2>
<div data-anim-group={""} style={css("border-top:2px solid var(--ink)")}>
{steps.map((s, index) => <React.Fragment key={index}>

<a href={s.url} target={"_blank"} rel={"noopener"} style={css("display:grid;grid-template-columns:34px 1fr auto;gap:16px;align-items:baseline;padding:18px 0;border-bottom:1px solid var(--hair);color:var(--ink)")} className="design-hover-18">
<span style={css("font-family:'Archivo',sans-serif;font-weight:800;font-size:17px;color:var(--accent)")}>{s.num}</span>
<span style={css("display:flex;flex-direction:column;gap:4px")}>
<span style={css("font-family:'Archivo',sans-serif;font-weight:700;font-size:17.5px")}>{s.title}</span>
<span style={css("font-family:'Hanken Grotesk',sans-serif;font-size:15px;line-height:1.5;color:var(--body-2)")}>{s.body}</span>
</span>
<span style={css("font-family:'Space Mono',monospace;font-size:12px;color:var(--muted)")}>{"↗"}</span>
</a>

</React.Fragment>)}
</div>
</div>
</section>
<section style={css("border-top:2px solid var(--ink);background:var(--surface)")}>
<div style={css("max-width:1340px;margin:0 auto;padding:60px 24px 90px")}>
<h2 style={css("font-family:'Archivo',sans-serif;font-weight:800;font-size:clamp(24px,3.2vw,38px);letter-spacing:-0.018em;margin:0 0 26px;text-transform:uppercase")}>{"Common worries, answered"}</h2>
<div data-anim-group={""}>
{faqs.map((q, index) => <React.Fragment key={index}>

<div style={css("border-bottom:1px solid var(--hair)")}>
<button aria-expanded={q.open} onClick={q.onToggle} style={css("width:100%;text-align:left;background:transparent;border:0;cursor:pointer;padding:20px 0;display:flex;align-items:center;justify-content:space-between;gap:20px;font-family:inherit;color:inherit")}>
<span style={css("font-family:'Archivo',sans-serif;font-weight:700;font-size:clamp(17px,2vw,20px);line-height:1.3")}>{q.q}</span>
<span style={css(`font-family:'Space Mono',monospace;font-size:18px;color:var(--accent);transform:rotate(${q.rot});transition:transform 0.3s cubic-bezier(0.34,1.56,0.64,1);display:inline-block;flex:0 0 auto`)}>{"+"}</span>
</button>
{q.open && <>

<p style={css("font-size:16.5px;line-height:1.6;color:var(--body);margin:0;padding:0 44px 24px 0;max-width:72ch")}>{q.a}</p>

</>}
</div>

</React.Fragment>)}
</div>
</div>
</section>
</div>

</>}
{this.state.page === "notFound" && this.props.children}</main>
<footer style={css("background:var(--panel);color:#9E9E94")}>
<div style={css("max-width:1340px;margin:0 auto;padding:68px 24px 28px;display:flex;flex-wrap:wrap;gap:clamp(32px,5vw,80px)")}>
<div style={css("flex:1.4 1 260px;min-width:0")}>
<img src={"/global/duca-logo.webp"} alt={"DUCA"} style={css("height:42px;width:auto;margin-bottom:20px;display:block")} />
<p style={css("font-size:15.5px;line-height:1.6;margin:0 0 18px;max-width:38ch")}>{"A student-led community and a launchpad for the next generation of cybersecurity professionals."}</p>
<a href={"mailto:info@duca.au"} style={css("font-size:15.5px;color:oklch(0.87 0.2 124)")}>{"info@duca.au"}</a>
</div>
<div style={css("flex:1.2 1 240px;min-width:0")}>
<div style={css("font-family:'Space Mono',monospace;font-size:11.5px;letter-spacing:0.16em;text-transform:uppercase;color:var(--on-panel);margin-bottom:18px")}>{"Pages"}</div>
<div style={css("display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:11px clamp(20px,3vw,44px)")}>
{navItems.map((item, index) => <React.Fragment key={index}>

<a href={item.href} target={item.target} rel={"noopener"} onClick={item.onClick} style={css("font-size:15.5px;color:#9E9E94")} className="design-hover-11">{item.label}</a>

</React.Fragment>)}
</div>
</div>
<div style={css("flex:0.8 1 180px;min-width:0")}>
<div style={css("font-family:'Space Mono',monospace;font-size:11.5px;letter-spacing:0.16em;text-transform:uppercase;color:var(--on-panel);margin-bottom:18px")}>{"Elsewhere"}</div>
<div style={css("display:flex;flex-direction:column;gap:10px")}>
<a href={"https://discord.com/invite/duca"} target={"_blank"} rel={"noopener"} style={css("font-size:15.5px;color:#9E9E94")} className="design-hover-11">{"Discord"}</a>
<a href={"https://github.com/duca-club"} target={"_blank"} rel={"noopener"} style={css("font-size:15.5px;color:#9E9E94")} className="design-hover-11">{"GitHub"}</a>
<a href={"https://ctf.duca.au/"} target={"_blank"} rel={"noopener"} style={css("font-size:15.5px;color:#9E9E94")} className="design-hover-11">{"CTF platform"}</a>
<a href={"https://www.dusa.org.au/clubs/deakin-university-cybersecurity-association-burwood-duca"} target={"_blank"} rel={"noopener"} style={css("font-size:15.5px;color:#9E9E94")} className="design-hover-11">{"DUSA listing"}</a>
</div>
</div>
</div>
<div style={css("max-width:1340px;margin:0 auto;padding:0 24px 56px")}>
<p style={css("font-size:13.5px;line-height:1.7;color:var(--muted);margin:0 0 24px;border-top:1px solid #2A2A26;padding-top:24px")}>{"DUCA acknowledges the Traditional Owners of the lands on which we operate, and we pay our respects to Elders past and present. We celebrate diversity and are committed to creating an inclusive environment for all members, including those who identify as LGBTQIA+."}</p>
<span style={css("font-family:'Space Mono',monospace;font-size:12px;color:#5A5A52")}>{"Copyright DUCA © 2026"}</span>
</div>
</footer>
</div>
    );
  }
}
