// Ported from Claude Design's “DUCA with Dark MODE” export.
// Original layout declarations and animation methods are kept to preserve the design.
import React from 'react';
import { ArrowRight, ArrowUpRight, Check, ChevronLeft, ChevronRight, Hash, Infinity as InfinityIcon, Minus, Moon, Plus, Search, Star, Sun } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { executives, divisions, teamYears, latestTeamYear } from '../data/team';
import { siteConfig, siteLinks, socialLinks, heroContent } from '../data/site';
import { partners, featuredPartner, partnerSpotlight } from '../data/partners';
import { navigationPages, discordChannels, tickerMessages, heroLabels, teamPageContent, siteStats, clubActivities, aboutStrip, aboutTalks, aboutEvents, clubValues, ctfCategories, membershipComparison, joinSteps, joinFaqs } from '../data/site-content';
import { blogPreviewOverrides } from '../data/blog-previews';
import BlogArticle from './BlogArticle';
import SiteHeader from './SiteHeader.jsx';
import PartnerLogo from './PartnerLogo';
import '../styles/event.css';
import '../styles/team.css';
import { getEventSchedule } from '../lib/event-state';
import { BLOG_POSTS_PER_PAGE, getBlogPageUrl } from '../lib/blog-pagination';

const styleCache = new Map();
const numberFormatter = new Intl.NumberFormat('en-US');
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
const toDesignMember = (member, images) => ({ ...member, img: images?.[member.image]?.src || member.image, imageData: images?.[member.image], link: member.linkedIn, fact: member.bio || '' });

export default class DesignSite extends React.Component {

  state = { page: this.props.initialPage || 'home', theme: 'dark', counts: [], filter: 'All', teamYear: latestTeamYear, openEvent: 0, now: this.props.initialNow || 0, pastPage: 0, blogFilter: 'All', blogPage: this.props.initialBlogPage || 0, archiveOpen: false, blogQuery: '', openFaq: 0 };

  TEAM_YEARS = teamYears;

  STATS = siteStats.map(stat => ({
    ...stat,
    target: stat.source === 'discordMembers' ? this.props.discordMemberCount : stat.target,
  }));

  POSTS = [];

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
    let mobile = false;
    const cssVar = (n, fb) => {
      const v = getComputedStyle(document.body).getPropertyValue(n).trim();
      return v || fb;
    };
    const mobileTextLayout = width => {
      const gutter = parseFloat(getComputedStyle(canvas).getPropertyValue('--home-gutter')) || 20;
      const textWidth = Math.max(1, width - gutter * 2);
      const lines = [heroContent.firstLine, heroContent.secondLine, heroContent.highlight];
      ctx.font = '800 100px Archivo, sans-serif';
      const widest = Math.max(...lines.map(line => ctx.measureText(line).width));
      const hs = Math.min(46, 100 * (textWidth * 0.94 / widest));
      const lh = hs * 0.96;
      const ls = Math.min(13, textWidth * 0.04);
      const subtitleY = hs * 0.98 + 2 * lh + hs * 0.68;
      return { lines, hs, lh, ls, subtitleY, bottom: subtitleY + ls * 0.5 };
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
      if (mobile) {
        const { lines, hs, lh, ls, subtitleY, bottom } = mobileTextLayout(W);
        ctx.font = `800 ${hs}px Archivo, sans-serif`;
        lines.forEach((line, index) => {
          const y = hs * 0.98 + index * lh;
          const width = ctx.measureText(line).width;
          if (index === 2) {
            ctx.fillStyle = '#C6F24E';
            ctx.fillRect(cx - width / 2 - hs * 0.06, y - hs * 0.78, width + hs * 0.12, hs * 0.96);
          }
          ctx.fillStyle = index === 2 ? '#0E0E0C' : INK;
          ctx.fillText(line, cx, y);
        });
        ctx.font = `600 ${ls}px Archivo, sans-serif`;
        ctx.fillStyle = BODY2;
        ctx.fillText(heroContent.subtitle, cx, subtitleY);
        textBottom = bottom;
        texture.needsUpdate = true;
        return;
      }
      const widest = Math.max(ctx.measureText(heroContent.firstLine).width, ctx.measureText(heroContent.secondLine + ' ' + heroContent.highlight).width);
      const hs = Math.min(104, 100 * (W * 0.78 / widest));
      const lh = hs * 0.92;
      const y1 = hs * 0.95;
      ctx.font = `800 ${hs}px Archivo, sans-serif`;
      ctx.fillStyle = INK;
      ctx.fillText(heroContent.firstLine, cx, y1);
      const pre = heroContent.secondLine + ' ';
      const hit = heroContent.highlight;
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
      ctx.fillText(heroContent.subtitle, cx, y2 + hs * 0.62);
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
          uMotion: { value: 1 },
          uOrb: { value: new T.Vector2(1.4, 0.5) },
          uEnter: { value: -0.3 },
          uAspect: { value: 1 }
        },
        vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
        fragmentShader: [
          'uniform sampler2D uTex; uniform float uTime; uniform float uMotion; uniform vec2 uOrb; uniform float uEnter; uniform float uAspect;',
          'varying vec2 vUv;',
          'void main(){',
          '  vec2 uv = vUv;',
          '  vec2 d = vec2((uv.x - uOrb.x) * uAspect, uv.y - uOrb.y);',
          '  float dist = length(d);',
          '  float wave = sin(dist * 11.0 - uTime * 0.8) * exp(-dist * 2.2) * 0.0045 * uMotion;',
          '  uv += normalize(d + 1e-6) * wave;',
          '  float reveal = smoothstep(uEnter, uEnter + 0.28, uv.y);',
          '  vec4 base = texture2D(uTex, uv);',
          '  vec3 col = mix(base.rgb, vec3(0.17, 0.21, 0.77), exp(-dist * 2.6) * 0.3 * uMotion);',
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
      mobile = window.matchMedia('(max-width: 767px)').matches;
      if (!mobile) canvas.parentElement.style.removeProperty('--home-hero-height');
      const r = canvas.getBoundingClientRect();
      if (!r.width || !r.height) return;
      W = r.width;
      H = mobile ? mobileTextLayout(W).bottom + 24 + W / 2 : r.height;
      if (mobile) canvas.parentElement.style.setProperty('--home-hero-height', `${H}px`);
      renderer.setSize(W, H, false);
      camera.left = -W / 2; camera.right = W / 2; camera.top = H / 2; camera.bottom = -H / 2;
      camera.updateProjectionMatrix();
      plane.geometry.dispose();
      plane.geometry = new T.PlaneGeometry(W, H, 1, 1);
      plane.material.uniforms.uAspect.value = W / H;
      plane.material.uniforms.uMotion.value = mobile ? 0 : 1;
      drawText(W, H);
      if (mobile) {
        plane.position.set(0, 0, 0);
        group.scale.setScalar(W / 2);
        group.position.set(0, -H / 2, -50);
      } else {
        const R = Math.min(H * 0.78, W * 0.36);
        group.scale.setScalar(R);
        const topY = H / 2 - (textBottom + 34);
        group.position.set(0, Math.min(-H * 0.5 + R * 0.16, topY - R), -50);
      }
    };
    resize();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => {
      if (mobile) resize(); else drawText(W, H);
    });

    const mouse = { x: 0, y: 0 };
    const onMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('resize', resize);

    const IDX = heroLabels.map((_, index) => index);
    const labelLayer = document.querySelector('[data-hero-labels]');
    if (labelLayer) labelLayer.removeAttribute('data-positioned');
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
      if (mobile) {
        plane.position.set(0, 0, 0);
      } else {
        plane.position.x += (mouse.x * -8 - plane.position.x) * 0.04;
        plane.position.y += (mouse.y * 5 - plane.position.y) * 0.04;
      }
      plane.material.uniforms.uOrb.value.set(
        (group.position.x - plane.position.x) / W + 0.5,
        (group.position.y - plane.position.y) / H + 0.5
      );
      const show = !mobile && W >= 760;
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
      if (labelLayer && !labelLayer.hasAttribute('data-positioned')) {
        labelLayer.setAttribute('data-positioned', '');
      }
    };
    g.ticker.add(tick);

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
    this._lastPage = this.state.page;
    this._lastFilter = this.state.filter;
    this.setupAnim();
    if (this.state.page === 'home') Promise.all([import('three'), document.fonts.ready]).then(([three]) => {
      if (this.unmounted) return;
      window.THREE = three;
      this.initThree();
    });
    if (['events', 'home'].includes(this.state.page)) this.clockTick = setInterval(() => this.setState({ now: Date.now() }), 1000);
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
      // Astro already renders the page at its final position. Replaying entrance
      // tweens here hides painted content and produces a flash during hydration.
      // Animate decorative elements only; text and cards stay visible throughout.
      const mark = document.querySelector('[data-anim="mark"]');
      if (mark) {
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
    const logo = panel.querySelector('[data-join-logo]');
    const rain = panel.querySelector('[data-join-rain]');
    const markBox = panel.querySelector('[data-join-mark]');

    if (logo) {
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

  go(page) {
    return (ev) => {
      if (ev) ev.preventDefault();
      this.setState({ page });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
  }

  paginateBlog(direction, pages) {
    this.setState(state => ({
      blogPage: Math.max(0, Math.min(pages - 1, state.blogPage + direction)),
    }), () => {
      const list = document.querySelector('[data-blog-grid]');
      if (!list) return;
      const header = document.querySelector('header')?.getBoundingClientRect();
      const headerOffset = Math.max(0, header?.bottom ?? 0);
      const top = list.getBoundingClientRect().top + window.scrollY - headerOffset - 16;
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: Math.max(0, top), behavior: reducedMotion ? 'auto' : 'smooth' });
    });
  }

  renderVals() {
    const { page, filter } = this.state;
    const discordMemberCount = numberFormatter.format(this.props.discordMemberCount);
    const schedule = getEventSchedule(this.props.events || [], this.state.now, filter);
    const { visibleEvents, next, liveNow } = schedule;
    const kinds = schedule.filters;

    return {
      discordMemberCount,
      isHome: page === 'home', isAbout: page === 'about', isEvents: page === 'events',
      isBlog: page === 'blog', isTeam: page === 'team', isPartners: page === 'partners',
      isCtf: page === 'ctf', isJoin: page === 'join', isPost: page === 'post',
      themeIcon: this.state.theme === 'dark'
        ? <Moon className="ui-icon theme-icon" aria-hidden="true" />
        : <Sun className="ui-icon theme-icon" aria-hidden="true" />,
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
      navItems: navigationPages.map(({ id, label, url }) => {
        const ext = Boolean(url);
        const active = page === id || (page === 'post' && id === 'blog');
        return {
          label,
          href: url || (id === 'home' ? '/' : '/' + id + '/'),
          target: ext ? '_blank' : '_self',
          onClick: undefined,
          color: active ? 'var(--on-ink)' : 'var(--ink)',
          bg: active ? 'var(--ink)' : 'transparent'
        };
      }),
      goHome: this.go('home'), goJoin: this.go('join'), goEvents: this.go('events'),
      goBlog: this.go('blog'), goTeam: this.go('team'), goCtf: this.go('ctf'), goPartners: this.go('partners'),

      stats: this.STATS.map((s, i) => ({
        ...s,
        shown: numberFormatter.format(this.state.counts[i]) + s.suffix,
        edge: i === 0 ? 'none' : '1px solid var(--hair)',
        pad: i === 0 ? '0' : '18px'
      })),
      channelLoop: [...discordChannels, ...discordChannels].map((c, i) => ({
        name: c.name, meta: c.metaIcon === 'infinity' ? <InfinityIcon className="ui-icon" aria-hidden="true" /> : c.meta, key: i,
        tint: c.live ? 'oklch(0.87 0.2 124)' : 'var(--muted)'
      })),
      tickerLoop: [...tickerMessages, ...tickerMessages, ...tickerMessages].map((t, i) => ({ text: t, key: i })),

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
        const per = BLOG_POSTS_PER_PAGE;
        const pages = Math.max(1, Math.ceil(shown.length / per));
        const page = Math.min(this.state.blogPage, pages - 1);
        const paged = shown.slice(page * per, page * per + per);
        return {
          blogHasPages: true,
          blogQuery: this.state.blogQuery,
          hasBlogQuery: !!q,
          onBlogSearch: (ev) => this.setState({ blogQuery: ev.target.value, blogPage: ev.target.value.trim() || bf !== 'All' ? 0 : (this.props.initialBlogPage || 0) }),
          clearBlogSearch: () => this.setState({ blogQuery: '', blogPage: bf === 'All' ? (this.props.initialBlogPage || 0) : 0 }),
          blogPageLabel: 'Page ' + (page + 1) + ' of ' + pages,
          blogPrevColor: page > 0 ? 'var(--ink)' : 'var(--disabled)',
          blogNextColor: page < pages - 1 ? 'var(--ink)' : 'var(--disabled)',
          blogPrev: () => this.paginateBlog(-1, pages),
          blogNext: () => this.paginateBlog(1, pages),
          blogPrevHref: bf === 'All' && !q && page > 0 ? getBlogPageUrl(page - 1) + '#blog-posts' : undefined,
          blogNextHref: bf === 'All' && !q && page < pages - 1 ? getBlogPageUrl(page + 1) + '#blog-posts' : undefined,
          blogFilters: tags.map(t => ({
            label: t.toLowerCase(),
            onClick: () => this.setState({ blogFilter: t, blogPage: t === 'All' && !q ? (this.props.initialBlogPage || 0) : 0 }),
            bg: bf === t ? 'var(--ink)' : 'transparent',
            fg: bf === t ? 'var(--on-ink)' : 'var(--ink)'
          })),
          blogCount: shown.length + ' of ' + rest.length + ' shown',
          blogPosts: paged.map((p, i) => ({
            ...p, slot: 'blog-' + p.date.replace(/\\s/g, ''), slotHint: 'Photo from ' + p.tag.toLowerCase()
          }))
        };
      })(),
      teamYearLabel: String(this.state.teamYear),
      yearPrev: () => this.stepYear(-1),
      yearNext: () => this.stepYear(1),
      yearPrevColor: this.TEAM_YEARS.indexOf(this.state.teamYear) > 0 ? 'var(--ink)' : 'var(--disabled)',
      yearNextColor: this.TEAM_YEARS.indexOf(this.state.teamYear) < this.TEAM_YEARS.length - 1 ? 'var(--ink)' : 'var(--disabled)',
      teamYearNote: teamPageContent.description,

      execs: (executives[String(this.state.teamYear)] || []).map(member => toDesignMember(member, this.props.teamImages)),
      divisionsTeam: (divisions[String(this.state.teamYear)] || []).filter(d => d.members.length).map(d => ({ ...d, members: d.members.map(member => toDesignMember(member, this.props.teamImages)), empty: d.members.length === 0 })),
      sponsors: partners.filter(partner => partner.group === 'sponsor'),
      otherPartners: partners.filter(partner => partner.group === 'partner'),
      partnerLoop: [...partners, ...partners].map((p, i) => ({ ...p, key: i })),
      partnerNameLoop: [...partners, ...partners].map((p, i) => ({ name: p.name, key: i })),
      divisions: clubActivities.map(activity => ({ ...activity, body: activity.body.replaceAll('{memberCount}', discordMemberCount) })),
      aboutStrip,
      aboutTalks,
      aboutEvents,
      values: clubValues,

      eventFilters: kinds.map(k => ({
        label: k.toLowerCase(),
        onClick: () => this.setState({ filter: k, openEvent: 0, pastPage: 0 }),
        bg: filter === k ? 'var(--ink)' : 'transparent',
        fg: filter === k ? 'var(--on-ink)' : 'var(--ink)'
      })),
      eventCount: visibleEvents.length + ' upcoming · ' + schedule.visiblePast.length + ' past',
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
        ? { ...next, when: next.fullDate + ' · ' + next.time }
        : { title: 'Nothing scheduled', when: 'Check the Discord', place: '', homeDate: '', kind: '', tags: [], url: '/events/', body: 'Check the Discord for upcoming events.', time: '' },
      ...(() => {
        const per = 25;
        const all = schedule.visiblePast;
        const pages = Math.max(1, Math.ceil(all.length / per));
        const page = Math.min(this.state.pastPage, pages - 1);
        return {
          pastPage: all.slice(page * per, page * per + per).map(event => ({ ...event, date: event.fullDate })),
          pastCount: all.length,
          pastHasPages: true,
          pastPageLabel: 'Page ' + (page + 1) + ' of ' + pages,
          pastPrevColor: page > 0 ? 'var(--ink)' : 'var(--disabled)',
          pastNextColor: page < pages - 1 ? 'var(--ink)' : 'var(--disabled)',
          pastPrev: () => this.setState(st => ({ pastPage: Math.max(0, st.pastPage - 1) })),
          pastNext: () => this.setState(st => ({ pastPage: Math.min(pages - 1, st.pastPage + 1) }))
        };
      })(),

      liveNow,
      showCountdown: !!next && !next.dateOnly && !schedule.started,
      nextLabel: liveNow ? 'HAPPENING NOW' : schedule.started ? 'TODAY' : 'NEXT UP',
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

      ctfCats: ctfCategories,
      compare: membershipComparison.map(benefit => ({
        ...benefit,
        openColor: benefit.open ? 'var(--ink)' : 'var(--muted)',
        memberColor: benefit.member ? 'var(--accent)' : 'var(--muted)',
      })),
      steps: joinSteps,
      faqs: joinFaqs.map((q, i) => ({
        ...q,
        open: this.state.openFaq === i,
        rot: this.state.openFaq === i ? '135deg' : '0deg',
        onToggle: () => this.setState(st => ({ openFaq: st.openFaq === i ? -1 : i }))
      })),

    };
  }

  constructor(props) {
    super(props);
    this.state.counts = this.STATS.map(stat => stat.target);
    this.POSTS = (props.posts || []).map(post => ({ ...post, ...blogPreviewOverrides[post.slug] }));
  }

  render() {
    const { aboutEvents, aboutStrip, aboutTalks, archiveCount, archiveOpen, archivePosts, archiveRot, blogFilters, blogHasPages, blogNext, blogNextHref, blogNextColor, blogPageLabel, blogPosts, blogPrev, blogPrevHref, blogPrevColor, blogQuery, channelLoop, clearBlogSearch, compare, countdown, ctfCats, discordMemberCount, divisions, divisionsTeam, eventCount, eventFilters, execs, faqs, featuredPost, hasBlogQuery, homePosts, isAbout, isBlog, isCtf, isEvents, isHome, isJoin, isPartners, isPost, isTeam, liveNow, navItems, nextEvent, nextLabel, onBlogSearch, otherPartners, partnerLoop, partnerNameLoop, pastHasPages, pastNext, pastNextColor, pastPage, pastPageLabel, pastPrev, pastPrevColor, showCountdown, sponsors, stats, steps, teamYearLabel, teamYearNote, themeIcon, tickerLoop, toggleArchive, toggleTheme, values, visibleEvents, yearNext, yearNextColor, yearPrev, yearPrevColor } = this.renderVals();
    return (
<div style={css("background:var(--bg);color:var(--ink);font-family:'Hanken Grotesk',system-ui,sans-serif;min-height:100vh;overflow-x:clip;position:relative")}>
<SiteHeader items={navItems} themeIcon={themeIcon} onToggleTheme={toggleTheme} />
<main>
{isHome && <>

<div className="home-page">
<section style={css("max-width:1340px;margin:0 auto;padding:var(--home-hero-padding,30px) var(--home-gutter,24px) 0")}>
<div className="home-hero-scene" style={css("position:relative;width:var(--home-hero-width,100%);height:var(--home-hero-height,clamp(470px,52vw,700px));margin:var(--home-hero-margin,52px) var(--home-hero-inline-margin,0) 0")}>
<canvas data-three={"hero"} style={css("position:absolute;inset:0;width:100%;height:100%;display:block")}></canvas>
<h1 style={css("position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);margin:0")}>{heroContent.accessibleTitle}</h1>
<div data-hero-labels={""} style={css("position:absolute;inset:0;z-index:2;pointer-events:none")}>
<svg data-label-lines={""} style={css("position:absolute;inset:0;width:100%;height:100%;overflow:visible")}>
{heroLabels.map((_, index) => <line key={index} data-label-line={String(index)} x1={"0"} y1={"0"} x2={"0"} y2={"0"} stroke={"var(--ink)"} strokeWidth={"1"}></line>)}
</svg>
{heroLabels.map((_, index) => <span key={index} data-label-dot={String(index)} style={css("position:absolute;width:7px;height:7px;background:var(--panel);transform:translate(-50%,-50%)")}></span>)}
{heroLabels.map((label, index) => <span key={index} data-label-node={String(index)} style={css("position:absolute;font-family:'Space Mono',monospace;font-size:var(--home-hero-label-size,13px);letter-spacing:0.04em;white-space:var(--home-hero-label-wrap,nowrap);transform:translate(-50%,-50%)")}>{label}</span>)}
</div>
</div>
<div style={css("display:flex;flex-direction:column;align-items:center;gap:30px;padding:0 0 var(--home-stats-bottom,60px);margin-top:var(--home-stats-top,50px);position:relative;z-index:3")}>
<div className="home-stats" data-anim-group={""} style={css("width:var(--home-stats-width,min(100%,84vw));max-width:940px;display:grid;grid-template-columns:repeat(var(--home-stats-columns,4),minmax(0,1fr));gap:var(--home-stats-gap,18px);align-items:start;order:-1")}>
{stats.map((s, index) => <React.Fragment key={index}>

<div style={css("text-align:center")}>
<div style={css("font-family:'Archivo',sans-serif;font-weight:800;font-size:var(--home-stat-size,clamp(34px,3.8vw,50px));line-height:1;letter-spacing:-0.02em;color:var(--accent)")}>{s.shown}</div>
<div style={css("font-family:'Space Mono',monospace;font-size:var(--home-stat-label,13px);letter-spacing:var(--home-stat-tracking,0.14em);text-transform:uppercase;margin-top:12px;color:var(--ink)")}>{s.label}</div>
<div style={css("font-family:'Space Mono',monospace;font-size:var(--home-stat-note,12.5px);color:var(--muted);margin-top:4px")}>{s.note}</div>
</div>

</React.Fragment>)}
</div>
</div>
</section>
<div style={css("overflow:hidden;background:oklch(0.87 0.2 124);color:#0E0E0C;border-top:2px solid var(--ink);border-bottom:2px solid var(--ink);transform:rotate(-1.4deg);width:108%;margin:var(--home-ticker-top,52px) -4% var(--home-ticker-bottom,96px);padding:13px 0")}>
<div data-anim={"ticker"} style={css("display:flex;width:max-content;font-family:'Silkscreen',monospace;font-size:14px;letter-spacing:0.06em")}>
{tickerLoop.map((t, index) => <React.Fragment key={index}>

<span style={css("padding:0 22px;white-space:nowrap;display:inline-flex;align-items:center;gap:10px")}><Star className="ui-icon" fill="currentColor" aria-hidden="true" />{t.text}</span>

</React.Fragment>)}
</div>
</div>
<section style={css("max-width:1340px;margin:0 auto;padding:0 var(--home-gutter,24px) var(--home-section-space,76px)")}>
<div data-join={""} style={css("position:relative;overflow:hidden;background:var(--panel);border-radius:var(--home-card-radius,30px);padding:var(--home-card-padding,clamp(34px,4.8vw,62px));color:var(--on-panel)")}>
<canvas data-join-grid={""} style={css("position:absolute;inset:0;width:100%;height:100%;opacity:0.5")}></canvas>
<div style={css("position:relative;z-index:2;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,290px),1fr));gap:var(--home-card-gap,40px);align-items:center")}>
<div>
<h2 style={css("font-family:'Archivo',sans-serif;font-weight:800;font-size:var(--home-join-title,clamp(34px,5.4vw,68px));letter-spacing:-0.018em;margin:0 0 16px;text-transform:uppercase;line-height:0.9")}>
<span data-join-line={""} style={css("display:block;overflow:hidden;padding-bottom:0.03em")}><span style={css("display:block")}>{"Join us"}</span></span>
</h2>
<p style={css("font-size:var(--home-copy-size,18px);line-height:1.6;color:#B4B4AA;margin:0 0 16px;max-width:46ch")}>{"Every event is free to attend and take part in. Join the Discord or check the events page to see what is happening soon."}</p>
<p style={css("font-size:var(--home-copy-size,18px);line-height:1.6;color:#B4B4AA;margin:0 0 28px;max-width:46ch")}>{"Signing up through DUSA makes you an official member, and helps cover the cost of running the club."}</p>
<div className="home-join-actions" style={css("display:flex;gap:var(--home-button-gap,12px);flex-wrap:wrap")}>
<a href="/join/" style={css("font-family:'Archivo',sans-serif;font-weight:700;background:oklch(0.87 0.2 124);color:#0E0E0C;border-radius:999px;transition:transform 0.15s")} className="home-card-button design-hover-3">{"How to join"}</a>
<a href={siteLinks.discord} target={"_blank"} rel={"noopener"} style={css("font-family:'Archivo',sans-serif;font-weight:700;border:2px solid #3A3A34;color:var(--on-panel);border-radius:999px;transition:transform 0.15s")} className="home-card-button design-hover-4">{"Discord "}<ArrowUpRight className="ui-icon" aria-hidden="true" /></a>
</div>
</div>
<div data-join-mark={""} style={css("position:relative;display:flex;align-items:center;justify-content:center;min-height:var(--home-mark-height,clamp(260px,30vw,360px))")}>
<canvas data-join-rain={""} style={css("position:absolute;inset:0;width:100%;height:100%")}></canvas>
<img src={siteConfig.logos.mark} alt={"DUCA"} data-join-logo={""} style={css("position:relative;z-index:2;width:var(--home-mark-width,min(58%,260px));height:auto;display:block")} />
</div>
</div>
</div>
</section>
<section style={css("max-width:1340px;margin:0 auto;padding:0 var(--home-gutter,24px) var(--home-section-space,76px)")}>
<div style={css("display:flex;justify-content:space-between;align-items:baseline;gap:20px;flex-wrap:wrap;margin-bottom:26px")}>
<h2 style={css("font-family:'Archivo',sans-serif;font-weight:800;font-size:var(--home-section-title,clamp(30px,4.4vw,56px));letter-spacing:-0.018em;margin:0;text-transform:uppercase;line-height:0.95")}>{"Next up"}</h2>
<a href="/events/" style={css("font-family:'Space Mono',monospace;font-size:13px;border:2px solid var(--ink);border-radius:999px;padding:8px 16px")} className="design-hover-5">{"all events "}<ArrowRight className="ui-icon" aria-hidden="true" /></a>
</div>
<a href={nextEvent.url} data-anim={"up"} style={css("display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr));border-radius:26px;overflow:hidden;background:var(--panel);color:var(--on-panel);transition:transform 0.2s")} className="design-hover-6">
<div style={css("padding:var(--home-event-padding,42px 34px);display:flex;flex-direction:column;justify-content:space-between;gap:var(--home-event-gap,30px)")}>
<span style={css("font-family:'Silkscreen',monospace;font-size:13px;color:oklch(0.87 0.2 124)")}>{nextEvent.homeDate}</span>
<div>
<div style={css("font-family:'Archivo',sans-serif;font-weight:800;font-size:var(--home-event-title,clamp(34px,4.4vw,52px));letter-spacing:-0.018em;line-height:0.95;text-transform:uppercase")}>{nextEvent.title}</div>
<div style={css("font-family:'Space Mono',monospace;font-size:12px;letter-spacing:0.12em;color:#8E8E84;margin-top:10px")}>{nextEvent.tags.join(" / ").toUpperCase()}</div>
</div>
</div>
<div style={css("padding:var(--home-event-padding,42px 34px);display:flex;flex-direction:column;justify-content:space-between;gap:22px;background:var(--accent-deep);color:#FFFFFF")}>
<p style={css("font-size:var(--home-copy-size,18px);line-height:1.5;margin:0")}>{nextEvent.body}</p>
<div style={css("font-family:'Space Mono',monospace;font-size:13px;line-height:1.9")}>{nextEvent.time}<br />{nextEvent.place}</div>
</div>
</a>
</section>
<section className="home-partners" aria-label="Club partners" style={css("width:100vw;margin-left:calc(50% - 50vw);background:var(--band);padding:30px 0 34px;overflow:hidden")}>
<p style={css("font-family:'Space Mono',monospace;font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:var(--muted);text-align:center;margin:0 0 24px")}>{"We partner with"}</p>
<div data-anim={"marquee"} style={css("display:flex;width:max-content;align-items:center")}>
{partnerLoop.map((p, index) => <React.Fragment key={index}>

<div style={css("flex:0 0 auto;padding:0 40px")}><PartnerLogo partner={p} className="home-partner-logo" /></div>

</React.Fragment>)}
</div>
<div data-anim={"marquee2"} style={css("display:flex;width:max-content;align-items:center;margin-top:22px;font-family:'Archivo',sans-serif;font-weight:800;font-size:clamp(28px,4vw,52px);letter-spacing:-0.018em;text-transform:uppercase;color:transparent;-webkit-text-stroke:1px var(--hair-strong)")}>
{partnerNameLoop.map((p, index) => <React.Fragment key={index}>

<span style={css("padding:0 26px;white-space:nowrap")}>{p.name}</span>

</React.Fragment>)}
</div>
</section>
<section style={css("max-width:1340px;margin:0 auto;padding:var(--home-section-space,76px) var(--home-gutter,24px)")}>
<div style={css("display:flex;justify-content:space-between;align-items:baseline;gap:20px;flex-wrap:wrap;margin-bottom:26px")}>
<h2 style={css("font-family:'Archivo',sans-serif;font-weight:800;font-size:var(--home-section-title,clamp(30px,4.4vw,56px));letter-spacing:-0.018em;margin:0;text-transform:uppercase;line-height:0.95")}>{"From the blog"}</h2>
<a href="/blog/" style={css("font-family:'Space Mono',monospace;font-size:13px;border:2px solid var(--ink);border-radius:999px;padding:8px 16px")} className="design-hover-5">{"all posts "}<ArrowRight className="ui-icon" aria-hidden="true" /></a>
</div>
<div data-anim-group={""} className="blog-grid" style={css("grid-template-columns:repeat(auto-fit,minmax(min(100%,290px),1fr));gap:16px")}>
{homePosts.map((post, index) => <React.Fragment key={index}>

<a data-blog-card="" href={post.url} style={css("display:flex;flex-direction:column;border:2px solid var(--ink);border-radius:24px;overflow:hidden")} className="design-hover-7">
<div className="blog-card-media">
<img src={post.image} srcSet={post.imageSrcSet} sizes="(min-width: 1024px) 33vw, (min-width: 680px) 50vw, calc(100vw - 48px)" width={post.imageWidth} height={post.imageHeight} alt="" loading="lazy" decoding="async" />
</div>
<div style={css("display:flex;flex-direction:column;gap:12px;padding:var(--home-blog-padding,26px 28px 28px)")}>
<span style={css("font-family:'Space Mono',monospace;font-size:11.5px;letter-spacing:0.1em;color:var(--muted)")}>{post.date}</span>
<h3 style={css("font-family:'Archivo',sans-serif;font-weight:700;font-size:var(--home-blog-title,22px);line-height:1.15;letter-spacing:-0.012em;margin:0")}>{post.title}</h3>
<p style={css("font-size:var(--home-blog-copy,15.5px);line-height:1.55;color:var(--body-2);margin:0")}>{post.blurb}</p>
</div>
</a>

</React.Fragment>)}
</div>
</section>
<section style={css("max-width:1340px;margin:0 auto;padding:0 var(--home-gutter,24px) var(--home-bottom-space,90px)")}>
<div style={css("background:var(--panel);border-radius:var(--home-card-radius,30px);padding:var(--home-card-padding,clamp(34px,5vw,64px));display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr));gap:var(--home-card-gap,44px);align-items:center")}>
<div>
<h2 style={css("font-family:'Archivo',sans-serif;font-weight:800;font-size:var(--home-discord-title,clamp(30px,4.4vw,54px));letter-spacing:-0.018em;line-height:0.95;color:var(--on-panel);margin:0 0 18px;text-transform:uppercase")}>{"The Discord"}<br />{"never sleeps"}</h2>
<p style={css("font-size:var(--home-copy-size,18px);line-height:1.6;color:#9E9E94;margin:0 0 28px;max-width:46ch")}>{`${discordMemberCount}+ students and industry folks. Event pings, assignment panic, CTF writeups, and a steady stream of cat photos.`}</p>
<div className="home-discord-actions">
<a href={siteLinks.discord} target={"_blank"} rel={"noopener"} style={css("font-family:'Archivo',sans-serif;font-weight:700;border-radius:999px;background:oklch(0.87 0.2 124);color:#0E0E0C;transition:transform 0.15s")} className="home-card-button design-hover-3">{"Open the invite "}<ArrowUpRight className="ui-icon" aria-hidden="true" /></a>
</div>
</div>
<div style={css("position:relative;height:var(--home-channels-height,240px);overflow:hidden;transform:rotate(-6deg) scale(1.04);-webkit-mask-image:linear-gradient(180deg,transparent 0%,#000 16%,#000 84%,transparent 100%);mask-image:linear-gradient(180deg,transparent 0%,#000 16%,#000 84%,transparent 100%)")}>
<div data-anim={"channels"} style={css("display:flex;flex-direction:column;gap:10px;padding:0 4px")}>
{channelLoop.map((c, index) => <React.Fragment key={index}>

<div style={css("display:flex;align-items:center;gap:12px;background:#1A1A16;border:1px solid #2E2E28;border-radius:14px;padding:13px 16px")}>
<span style={css("font-family:'Archivo',sans-serif;font-weight:700;font-size:15px;color:var(--muted)")}><Hash className="ui-icon" aria-hidden="true" /></span>
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
<span style={css("font-family:'Archivo',sans-serif;font-weight:800;font-size:clamp(22px,2.6vw,30px);letter-spacing:-0.018em;line-height:1")}><Plus className="ui-icon" aria-hidden="true" />{" many"}<br />{"more"}</span>
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
<h2 style={css("font-family:'Archivo',sans-serif;font-weight:800;font-size:clamp(24px,3.2vw,40px);letter-spacing:-0.018em;margin:0;text-transform:uppercase")}>{"Who runs it? "}<a href="/team/" style={css("color:var(--accent);border-bottom:3px solid var(--accent)")} className="design-hover-9">{"Meet the team "}<ArrowUpRight className="ui-icon" aria-hidden="true" /></a></h2>
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
<p className="event-next-meta" style={css("font-family:'Space Mono',monospace;font-size:13px;color:#B4B4AA;margin:0")}><span className="event-next-when">{nextEvent.when}</span>{nextEvent.place && <><span className="event-next-location-separator">{" · "}</span><span className="event-next-location">{nextEvent.place}</span></>}</p>
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
{visibleEvents.length === 0 && <p role="status" className="event-empty">No upcoming events.</p>}
{visibleEvents.map((e, index) => <React.Fragment key={index}>

<div id={`event-${e.slug}`} style={css(`border-bottom:1px solid var(--hair);background:${e.rowBg};transition:background 0.18s`)}>
<button data-event-row="" aria-controls={`event-details-${e.slug}`} aria-expanded={e.open} onClick={e.onToggle} style={css("width:100%;text-align:left;background:transparent;border:0;cursor:pointer;padding:22px 16px 22px 0;display:grid;grid-template-columns:auto 1fr auto;gap:22px;align-items:center;font-family:inherit;color:inherit;transition:background 0.18s")}>
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
<span style={css(`font-family:'Space Mono',monospace;font-size:19px;color:var(--ink);transform:rotate(${e.iconRot});transition:transform 0.3s cubic-bezier(0.34,1.56,0.64,1);display:inline-block`)}><Plus className="ui-icon" aria-hidden="true" /></span>
</button>
<div hidden={!e.open} id={`event-details-${e.slug}`} data-event-body="" style={css("padding:0 58px 28px 142px;max-width:none")}>
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
{e.image && <img className="event-expanded-image" src={e.image} alt={e.title} loading="lazy" />}
{e.html && <div className="article-body event-rich-content" dangerouslySetInnerHTML={{ __html: e.html }} />}
{(e.locationUrl || e.registrationUrl) && <div className="event-meta-links">
{e.locationUrl && <a href={e.locationUrl} target="_blank" rel="noopener noreferrer">View location <ArrowUpRight className="ui-icon" aria-hidden="true" /></a>}
{e.registrationUrl && <a href={e.registrationUrl} target="_blank" rel="noopener noreferrer">Register <ArrowUpRight className="ui-icon" aria-hidden="true" /></a>}
</div>}
</div>
</div>

</React.Fragment>)}
</div>
</section>
<section style={css("border-top:2px solid var(--ink);background:var(--surface)")}>
<div style={css("max-width:1340px;margin:0 auto;padding:54px 24px 80px")}>
<h2 style={css("font-family:'Archivo',sans-serif;font-weight:800;font-size:clamp(20px,2.4vw,28px);letter-spacing:-0.018em;margin:0 0 22px;text-transform:uppercase")}>{"Past events"}</h2>
<div data-anim-group={""}>
{pastPage.map((p, index) => <React.Fragment key={index}>

<div id={`event-${p.slug}`} data-event-history="" style={css("display:grid;grid-template-columns:150px 1fr auto;gap:22px;align-items:baseline;padding:14px 0;border-bottom:1px solid var(--hair)")}>
<span style={css("font-family:'Archivo',sans-serif;font-weight:700;font-size:15px;color:var(--muted)")}>{p.date}</span>
<span style={css("font-family:'Archivo',sans-serif;font-weight:600;font-size:16.5px;color:var(--body)")}>{p.title}</span>
<span style={css("font-family:'Space Mono',monospace;font-size:11.5px;letter-spacing:0.1em;color:var(--faint)")}>{p.kind}</span>
</div>

</React.Fragment>)}
</div>
{pastHasPages && <>

<div style={css("display:flex;align-items:center;justify-content:center;gap:14px;margin-top:24px")}>
<button disabled={pastPrevColor === "var(--disabled)"} onClick={pastPrev} style={css(`font-family:'Space Mono',monospace;font-size:12.5px;padding:8px 16px;cursor:pointer;border:2px solid var(--ink);border-radius:999px;background:transparent;color:${pastPrevColor}`)}><ChevronLeft className="ui-icon" aria-hidden="true" />{" newer"}</button>
<span style={css("font-family:'Space Mono',monospace;font-size:12.5px;color:var(--muted)")}>{pastPageLabel}</span>
<button disabled={pastNextColor === "var(--disabled)"} onClick={pastNext} style={css(`font-family:'Space Mono',monospace;font-size:12.5px;padding:8px 16px;cursor:pointer;border:2px solid var(--ink);border-radius:999px;background:transparent;color:${pastNextColor}`)}>{"older "}<ChevronRight className="ui-icon" aria-hidden="true" /></button>
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
<img src={featuredPost.image} srcSet={featuredPost.imageSrcSet} sizes="(min-width: 1340px) 646px, (min-width: 700px) 50vw, calc(100vw - 48px)" width={featuredPost.imageWidth} height={featuredPost.imageHeight} alt="" loading="eager" fetchPriority="high" decoding="async" style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}} />
</div>
<div style={css("padding:clamp(28px,3.6vw,44px);display:flex;flex-direction:column;justify-content:center;gap:14px")}>
<span style={css("font-family:'Space Mono',monospace;font-size:11.5px;letter-spacing:0.14em;color:var(--accent)")}>{"LATEST · "}{featuredPost.date}</span>
<h2 style={css("font-family:'Archivo',sans-serif;font-weight:800;font-size:clamp(24px,3.2vw,38px);letter-spacing:-0.018em;line-height:1.05;margin:0")}>{featuredPost.title}</h2>
<p style={css("font-size:16.5px;line-height:1.6;color:var(--body);margin:0;max-width:52ch")}>{featuredPost.blurb}</p>
<span style={css("font-family:'Space Mono',monospace;font-size:13px;color:var(--ink)")}>{"Read the post "}<ArrowUpRight className="ui-icon" aria-hidden="true" /></span>
</div>
</a>}
</section>
<section style={css("max-width:1340px;margin:0 auto;padding:0 24px 90px")}>
<div style={css("display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:26px")}>
{blogFilters.map((bf, index) => <React.Fragment key={index}>

<button onClick={bf.onClick} style={css(`font-family:'Space Mono',monospace;font-size:12.5px;padding:9px 18px;cursor:pointer;border:2px solid var(--ink);border-radius:999px;background:${bf.bg};color:${bf.fg};transition:transform 0.15s`)} className="design-hover-10">{bf.label}</button>

</React.Fragment>)}
<div style={css("display:flex;align-items:center;gap:12px;border:2px solid var(--ink);border-radius:999px;padding:4px 6px 4px 20px;margin-left:auto;width:min(100%,340px)")}>
<span style={css("font-family:'Space Mono',monospace;font-size:14px;color:var(--muted)")}><Search className="ui-icon" aria-hidden="true" /></span>
<input type={"search"} aria-label="Search posts" value={blogQuery} onChange={onBlogSearch} placeholder={"Search posts"} style={css("flex:1;min-width:0;border:0;outline:none;background:transparent;font-family:'Hanken Grotesk',sans-serif;font-size:15.5px;color:var(--ink);padding:10px 0")} />
{hasBlogQuery && <>

<button onClick={clearBlogSearch} style={css("font-family:'Space Mono',monospace;font-size:12px;border:0;cursor:pointer;background:var(--panel);color:var(--on-panel);border-radius:999px;padding:8px 14px")}>{"clear"}</button>

</>}
</div>
</div>
<div id="blog-posts" data-blog-grid="" data-anim-group="" className="blog-grid">
{blogPosts.map((post, index) => <React.Fragment key={index}>

<a data-blog-card="" href={post.url} style={css("display:flex;flex-direction:column;border:2px solid var(--ink);border-radius:24px;overflow:hidden")} className="design-hover-7">
<div className="blog-card-media">
<img src={post.image} srcSet={post.imageSrcSet} sizes="(min-width: 1024px) 33vw, (min-width: 680px) 50vw, calc(100vw - 48px)" width={post.imageWidth} height={post.imageHeight} alt="" loading="lazy" decoding="async" />
</div>
<div style={css("display:flex;flex-direction:column;gap:11px;padding:24px 26px 26px;flex:1")}>
<span style={css("font-family:'Space Mono',monospace;font-size:11px;letter-spacing:0.12em;color:var(--accent)")}>{post.tag}{" · "}{post.date}</span>
<h2 style={css("font-family:'Archivo',sans-serif;font-weight:700;font-size:21px;line-height:1.15;letter-spacing:-0.012em;margin:0")}>{post.title}</h2>
<p style={css("font-size:15.5px;line-height:1.55;color:var(--body-2);margin:0")}>{post.blurb}</p>
</div>
</a>

</React.Fragment>)}
</div>
{blogPosts.length === 0 && <p role="status" style={css("font-family:'Space Mono',monospace;font-size:14px;color:var(--muted);padding:24px 0")}>No posts found.</p>}
{blogHasPages && <>

<nav aria-label="Blog pagination" style={css("display:flex;align-items:center;justify-content:center;gap:14px;margin-top:28px")}>
{blogPrevHref
  ? <a href={blogPrevHref} rel="prev" style={css(`font-family:'Space Mono',monospace;font-size:12.5px;padding:8px 16px;border:2px solid var(--ink);border-radius:999px;color:${blogPrevColor}`)}><ChevronLeft className="ui-icon" aria-hidden="true" />{" newer"}</a>
  : <button disabled={blogPrevColor === "var(--disabled)"} onClick={blogPrev} style={css(`font-family:'Space Mono',monospace;font-size:12.5px;padding:8px 16px;cursor:pointer;border:2px solid var(--ink);border-radius:999px;background:transparent;color:${blogPrevColor}`)}><ChevronLeft className="ui-icon" aria-hidden="true" />{" newer"}</button>}
<span style={css("font-family:'Space Mono',monospace;font-size:12.5px;color:var(--muted)")}>{blogPageLabel}</span>
{blogNextHref
  ? <a href={blogNextHref} rel="next" style={css(`font-family:'Space Mono',monospace;font-size:12.5px;padding:8px 16px;border:2px solid var(--ink);border-radius:999px;color:${blogNextColor}`)}>{"older "}<ChevronRight className="ui-icon" aria-hidden="true" /></a>
  : <button disabled={blogNextColor === "var(--disabled)"} onClick={blogNext} style={css(`font-family:'Space Mono',monospace;font-size:12.5px;padding:8px 16px;cursor:pointer;border:2px solid var(--ink);border-radius:999px;background:transparent;color:${blogNextColor}`)}>{"older "}<ChevronRight className="ui-icon" aria-hidden="true" /></button>}
</nav>

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
<span style={css(`position:relative;z-index:1;font-family:'Space Mono',monospace;font-size:22px;color:oklch(0.87 0.2 124);transform:rotate(${archiveRot});transition:transform 0.3s cubic-bezier(0.34,1.56,0.64,1);display:inline-block`)}><Plus className="ui-icon" aria-hidden="true" /></span>
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

<div className="team-page">
<section data-anim={"hero"} style={css("max-width:1340px;margin:0 auto;padding:44px var(--team-gutter,24px) 34px")}>
<div className="team-heading">
<h1 style={css("font-family:'Archivo',sans-serif;font-weight:800;font-size:clamp(44px,8.4vw,120px);letter-spacing:-0.022em;line-height:0.88;margin:0;text-transform:uppercase")}>{"The team"}</h1>
<div className="team-year-switch" data-year-switch={""} role="group" aria-label="Committee year">
<button type="button" disabled={yearPrevColor === "var(--disabled)"} onClick={yearPrev} aria-label={"Previous year"} style={{ color: yearPrevColor }} className="team-year-arrow design-hover-7"><ChevronLeft className="ui-icon" aria-hidden="true" /></button>
<div className="team-year-window" data-year-window={""}>
<span data-year-sparks={""} style={css("position:absolute;inset:0;pointer-events:none;overflow:visible;z-index:2")}></span>
<span className="team-year-value" data-year-value={""} aria-live="polite" aria-atomic="true">{teamYearLabel}</span>
</div>
<button type="button" disabled={yearNextColor === "var(--disabled)"} onClick={yearNext} aria-label={"Next year"} style={{ color: yearNextColor }} className="team-year-arrow design-hover-7"><ChevronRight className="ui-icon" aria-hidden="true" /></button>
</div>
</div>
<p className="team-description">{teamYearNote}</p>
</section>
<section style={css("max-width:1340px;margin:0 auto;padding:0 var(--team-gutter,24px) 56px")}>
<h2 style={css("font-family:'Archivo',sans-serif;font-weight:800;font-size:clamp(22px,2.8vw,32px);letter-spacing:-0.018em;margin:0 0 20px;text-transform:uppercase")}>{"Executives"}</h2>
<div className="team-exec-grid" data-anim-group={""}>
{execs.map((m, index) => <React.Fragment key={index}>

<a href={m.link && m.link !== "#" ? m.link : siteLinks.discord} title={m.fact || undefined} aria-label={`${m.name}, ${m.role}${m.fact ? ". " + m.fact : ""}`} target={"_blank"} rel={"noopener"} style={css("border:2px solid var(--ink);border-radius:24px;overflow:hidden;display:flex;flex-direction:column;transition:border-color 0.18s,background 0.18s")} className="team-card team-exec-card design-hover-12">
<div className="team-card-image">
<img src={m.img} srcSet={m.imageData?.srcSet} sizes={m.imageData?.sizes} width={m.imageData?.width} height={m.imageData?.height} alt={m.name} loading={index < 2 ? 'eager' : 'lazy'} decoding="async" />
</div>
<div className="team-card-body">
<div className="team-card-role">{m.role}</div>
<div className="team-card-name"><span className="team-card-name-text">{m.name}</span><span className="team-card-link-icon"><ArrowUpRight className="ui-icon" aria-hidden="true" /></span></div>
</div>
</a>

</React.Fragment>)}
</div>
</section>
<section style={css("max-width:1340px;margin:0 auto;padding:0 var(--team-gutter,24px) 90px")}>
<h2 style={css("font-family:'Archivo',sans-serif;font-weight:800;font-size:clamp(22px,2.8vw,32px);letter-spacing:-0.018em;margin:0 0 8px;text-transform:uppercase")}>{"Committee"}</h2>
{divisionsTeam.map((d, index) => <React.Fragment key={index}>

<div style={css("padding-top:28px")}>
{d.name !== "Committee" && <h3 style={css("font-family:'Space Mono',monospace;font-size:12px;letter-spacing:0.16em;text-transform:uppercase;color:var(--muted);margin:0 0 16px;border-bottom:1px solid var(--hair);padding-bottom:10px")}>{d.name}</h3>}
{d.empty && <>

<p style={css("font-family:'Space Mono',monospace;font-size:13px;color:var(--muted);margin:0 0 6px")}>{"Positions open — ask in the Discord."}</p>

</>}
<div className="team-committee-grid" data-anim-group={""}>
{d.members.map((m, index) => <React.Fragment key={index}>

<a href={m.link && m.link !== "#" ? m.link : siteLinks.discord} title={m.fact || undefined} aria-label={`${m.name}, ${m.role}${m.fact ? ". " + m.fact : ""}`} target={"_blank"} rel={"noopener"} style={css("border:2px solid var(--ink);border-radius:18px;overflow:hidden;display:flex;flex-direction:column;transition:border-color 0.18s,background 0.18s")} className="team-card team-committee-card design-hover-12">
<div className="team-card-image">
<img src={m.img} srcSet={m.imageData?.srcSet} sizes="(max-width: 767px) 33vw, 220px" width={m.imageData?.width} height={m.imageData?.height} alt={m.name} loading="lazy" decoding="async" />
</div>
<div className="team-card-body">
<div className="team-card-role">{m.role}</div>
<div className="team-card-name"><span className="team-card-name-text">{m.name}</span><span className="team-card-link-icon"><ArrowUpRight className="ui-icon" aria-hidden="true" /></span></div>
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
<span style={css("font-family:'Silkscreen',monospace;font-size:12px;color:oklch(0.87 0.2 124);display:block;margin-bottom:20px")}>{partnerSpotlight.label}</span>
<h2 style={css("font-family:'Archivo',sans-serif;font-weight:800;font-size:clamp(28px,4vw,52px);letter-spacing:-0.018em;line-height:0.95;margin:0 0 18px;text-transform:uppercase")}>{partnerSpotlight.title}</h2>
<p style={css("font-size:17.5px;line-height:1.6;color:#B4B4AA;margin:0 0 22px;max-width:52ch")}>{partnerSpotlight.body}</p>
<a href={featuredPartner.url} target={"_blank"} rel={"noopener"} style={css("font-family:'Space Mono',monospace;font-size:13px;color:oklch(0.87 0.2 124);border-bottom:1px solid oklch(0.87 0.2 124);padding-bottom:2px")} className="design-hover-13">{partnerSpotlight.linkLabel + " "}<ArrowUpRight className="ui-icon" aria-hidden="true" /></a>
</div>
<div data-dc-plate={""} style={css("position:relative;z-index:1;display:flex;align-items:center;justify-content:center;min-height:220px;overflow:hidden;border-radius:22px")}>
<canvas data-dc-plate-bg={""} style={css("position:absolute;inset:0;width:100%;height:100%;pointer-events:none;-webkit-mask-image:radial-gradient(ellipse 85% 80% at 50% 50%,#000 30%,transparent 100%);mask-image:radial-gradient(ellipse 85% 80% at 50% 50%,#000 30%,transparent 100%)")}></canvas>
<PartnerLogo partner={featuredPartner} surface="dark" className="partner-spotlight-logo" />
</div>
</div>
</section>
<section style={css("max-width:1340px;margin:0 auto;padding:0 24px 56px")}>
<h2 style={css("font-family:'Archivo',sans-serif;font-weight:800;font-size:clamp(22px,2.8vw,32px);letter-spacing:-0.018em;margin:0 0 22px;text-transform:uppercase")}>{"Sponsors"}</h2>
<div data-anim-group={""} style={css("display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr));gap:0 36px;border-top:2px solid var(--ink);margin-bottom:56px")}>
{sponsors.map((p, index) => <React.Fragment key={index}>

<a href={p.url} target={"_blank"} rel={"noopener"} style={css("display:flex;align-items:center;gap:20px;padding:20px 0;border-bottom:1px solid var(--hair)")} className="design-hover-14">
<PartnerLogo partner={p} decorative className="partner-list-logo" />
<span style={css("font-family:'Archivo',sans-serif;font-weight:600;font-size:16.5px;flex:1")}>{p.name}</span>
<span style={css("font-family:'Space Mono',monospace;font-size:12px;color:var(--muted)")}><ArrowUpRight className="ui-icon" aria-hidden="true" /></span>
</a>

</React.Fragment>)}
</div>
<h2 style={css("font-family:'Archivo',sans-serif;font-weight:800;font-size:clamp(22px,2.8vw,32px);letter-spacing:-0.018em;margin:0 0 22px;text-transform:uppercase")}>{"Partners"}</h2>
<div data-anim-group={""} style={css("display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr));gap:0 36px;border-top:2px solid var(--ink)")}>
{otherPartners.map((p, index) => <React.Fragment key={index}>

<a href={p.url} target={"_blank"} rel={"noopener"} style={css("display:flex;align-items:center;gap:20px;padding:20px 0;border-bottom:1px solid var(--hair)")} className="design-hover-14">
<PartnerLogo partner={p} decorative className="partner-list-logo" />
<span style={css("font-family:'Archivo',sans-serif;font-weight:600;font-size:16.5px;flex:1")}>{p.name}</span>
<span style={css("font-family:'Space Mono',monospace;font-size:12px;color:var(--muted)")}><ArrowUpRight className="ui-icon" aria-hidden="true" /></span>
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
<a href={siteLinks.email} style={css("position:relative;z-index:1;font-family:'Archivo',sans-serif;font-weight:700;font-size:17px;padding:16px 30px;border-radius:999px;background:oklch(0.87 0.2 124);color:#0E0E0C;transition:transform 0.15s")} className="design-hover-3">{siteConfig.email}</a>
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
<a href={siteLinks.ctf} target={"_blank"} rel={"noopener"} style={css("font-family:'Archivo',sans-serif;font-weight:700;font-size:17px;padding:16px 30px;border-radius:999px;background:oklch(0.87 0.2 124);color:#0E0E0C;transition:transform 0.15s")} className="design-hover-3">{"Launch the platform "}<ArrowUpRight className="ui-icon" aria-hidden="true" /></a>
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
<a href={siteLinks.membership} target={"_blank"} rel={"noopener"} style={css("font-family:'Archivo',sans-serif;font-weight:700;font-size:17px;padding:16px 28px;border-radius:999px;background:oklch(0.87 0.2 124);color:#0E0E0C;text-align:center")}>{"Register with DUSA "}<ArrowUpRight className="ui-icon" aria-hidden="true" /></a>
<a href={siteLinks.discord} target={"_blank"} rel={"noopener"} style={css("font-family:'Archivo',sans-serif;font-weight:700;font-size:17px;padding:16px 28px;border-radius:999px;border:2px solid #3A3A34;color:var(--on-panel);text-align:center")} className="design-hover-17">{"Join the Discord "}<ArrowUpRight className="ui-icon" aria-hidden="true" /></a>
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
<span role="img" aria-label={c.open ? 'Included' : 'Not included'} style={css(`font-family:'Space Mono',monospace;font-size:15px;text-align:center;color:${c.openColor}`)}>{c.open ? <Check className="ui-icon" aria-hidden="true" /> : <Minus className="ui-icon" aria-hidden="true" />}</span>
<span role="img" aria-label={c.member ? 'Included' : 'Not included'} style={css(`font-family:'Space Mono',monospace;font-size:15px;text-align:center;color:${c.memberColor}`)}>{c.member ? <Check className="ui-icon" aria-hidden="true" /> : <Minus className="ui-icon" aria-hidden="true" />}</span>
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
<span style={css("font-family:'Space Mono',monospace;font-size:12px;color:var(--muted)")}><ArrowUpRight className="ui-icon" aria-hidden="true" /></span>
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
<button aria-expanded={q.open} aria-controls={`join-faq-${index}`} onClick={q.onToggle} style={css("width:100%;text-align:left;background:transparent;border:0;cursor:pointer;padding:20px 0;display:flex;align-items:center;justify-content:space-between;gap:20px;font-family:inherit;color:inherit")}>
<span style={css("font-family:'Archivo',sans-serif;font-weight:700;font-size:clamp(17px,2vw,20px);line-height:1.3")}>{q.q}</span>
<span style={css(`font-family:'Space Mono',monospace;font-size:18px;color:var(--accent);transform:rotate(${q.rot});transition:transform 0.3s cubic-bezier(0.34,1.56,0.64,1);display:inline-block;flex:0 0 auto`)}><Plus className="ui-icon" aria-hidden="true" /></span>
</button>
<p id={`join-faq-${index}`} hidden={!q.open} style={css("font-size:16.5px;line-height:1.6;color:var(--body);margin:0;padding:0 44px 24px 0;max-width:72ch")}>{q.a}</p>
</div>

</React.Fragment>)}
</div>
</div>
</section>
</div>

</>}
{this.state.page === "notFound" && this.props.children}</main>
<footer id="contact" style={css("background:var(--panel);color:#9E9E94")}>
<div style={css("max-width:1340px;margin:0 auto;padding:68px 24px 28px;display:flex;flex-wrap:wrap;gap:clamp(32px,5vw,80px)")}>
<div style={css("flex:1.4 1 260px;min-width:0")}>
<img src={siteConfig.logos.wordmark} alt={"DUCA"} style={css("height:42px;width:auto;margin-bottom:20px;display:block")} />
<p style={css("font-size:15.5px;line-height:1.6;margin:0 0 18px;max-width:38ch")}>{"A student-led community and a launchpad for the next generation of cybersecurity professionals."}</p>
<a href={siteLinks.email} style={css("font-size:15.5px;color:oklch(0.87 0.2 124)")}>{siteConfig.email}</a>
</div>
<div style={css("flex:1.2 1 240px;min-width:0")}>
<div style={css("font-family:'Space Mono',monospace;font-size:11.5px;letter-spacing:0.16em;text-transform:uppercase;color:var(--on-panel);margin-bottom:18px")}>{"Pages"}</div>
<div style={css("display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:11px clamp(20px,3vw,44px)")}>
{navItems.map((item, index) => <React.Fragment key={index}>

<a href={item.href} target={item.target} rel={"noopener"} onClick={item.onClick} style={css("font-size:15.5px;color:#9E9E94")} className="design-hover-11">{item.label}{item.target === '_blank' && <> <ArrowUpRight className="ui-icon" aria-hidden="true" /></>}</a>

</React.Fragment>)}
</div>
</div>
<div style={css("flex:0.8 1 180px;min-width:0")}>
<div style={css("font-family:'Space Mono',monospace;font-size:11.5px;letter-spacing:0.16em;text-transform:uppercase;color:var(--on-panel);margin-bottom:18px")}>{"Elsewhere"}</div>
<div style={css("display:flex;flex-direction:column;gap:10px")}>
{socialLinks.map(link => <a key={link.url} href={link.url} target={"_blank"} rel={"noopener"} style={css("font-size:15.5px;color:#9E9E94")} className="design-hover-11">{link.label}</a>)}
</div>
</div>
</div>
<div style={css("max-width:1340px;margin:0 auto;padding:0 24px 56px")}>
<p style={css("font-size:13.5px;line-height:1.7;color:var(--muted);margin:0 0 24px;border-top:1px solid #2A2A26;padding-top:24px")}>{"DUCA acknowledges the Traditional Owners of the lands on which we operate, and we pay our respects to Elders past and present. We celebrate diversity and are committed to creating an inclusive environment for all members, including those who identify as LGBTQIA+."}</p>
<span style={css("font-family:'Space Mono',monospace;font-size:12px;color:#5A5A52")}>{`Copyright ${siteConfig.name} © ${new Date(this.props.initialNow || Date.now()).getUTCFullYear()}`}</span>
</div>
</footer>
</div>
    );
  }
}
