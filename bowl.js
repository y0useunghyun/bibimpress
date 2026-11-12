// 위에서 본 비빔밥 그릇을 <svg class="bowl" viewBox="0 0 1000 1000">에 그린다
// 나무 그릇 + 흰 쌀밥 + 칸마다 채 썬 나물 수백 가닥 + 가운데 육회·계란 프라이
(() => {
  const svg = document.querySelector('svg.bowl');
  if (!svg) return;
  const NS = 'http://www.w3.org/2000/svg';
  const CX = 500, CY = 500;
  let seed = 7; // 고정 난수 — 새로고침해도 같은 그릇
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const pick = (arr) => arr[Math.floor(rnd() * arr.length)];
  const range = ([a, b]) => a + rnd() * (b - a);

  svg.innerHTML = `
    <defs><clipPath id="bowl-inside"><circle cx="500" cy="500" r="456"/></clipPath></defs>
    <circle cx="500" cy="500" r="500" fill="#5A2E14"/>
    <g fill="none">
      <circle cx="500" cy="500" r="492" stroke="#7A4220" stroke-width="5"/>
      <circle cx="500" cy="500" r="483" stroke="#45220E" stroke-width="3"/>
      <circle cx="500" cy="500" r="476" stroke="#6E3A1B" stroke-width="4"/>
      <circle cx="500" cy="500" r="467" stroke="#3A1C0B" stroke-width="2"/>
    </g>
    <circle cx="500" cy="500" r="456" fill="#FBF4E2"/>
    <g id="bowl-toppings" clip-path="url(#bowl-inside)" stroke-linecap="round" fill="none"></g>
    <circle cx="500" cy="500" r="450" fill="none" stroke="#2B1406" stroke-opacity=".35" stroke-width="12"/>`;
  const g = svg.querySelector('#bowl-toppings');

  // 각도 0 = 오른쪽(3시), 시계방향
  const SECTORS = [
    { from: 135, to: 180, n: 70,  colors: ['#7A4A2A', '#5B3418', '#9A6A44'], w: [9, 13], len: [20, 40],  curve: 1.4 }, // 표고
    { from: 180, to: 225, n: 120, colors: ['#E9D394', '#DDC37A', '#F0DEA6'], w: [5, 7],  len: [70, 130], curve: .6, head: '#E8B83A' }, // 콩나물
    { from: 225, to: 270, n: 110, colors: ['#2F6B2A', '#3F8236', '#5C9A3E', '#244F22'], w: [8, 13], len: [60, 120], curve: .25 }, // 미나리·시금치
    { from: 270, to: 315, n: 140, colors: ['#FFC81E', '#F6B41A', '#FFDA4D'], w: [6, 9],  len: [70, 130], curve: .08 }, // 지단
    { from: 315, to: 360, n: 110, colors: ['#6B3B1E', '#7E4A26', '#4E2A14'], w: [7, 11], len: [90, 160], curve: .2 },  // 고사리
    { from: 0,   to: 45,  n: 110, colors: ['#E4DAC0', '#D6CAAA', '#EDE4CC'], w: [6, 9],  len: [60, 120], curve: .15 }, // 무생채
    { from: 45,  to: 75,  n: 27,  colors: ['#EEE23A', '#E2D42C'], w: [26, 34], len: [40, 70], curve: 0 },             // 단무지
    { from: 75,  to: 105, n: 95,  colors: ['#F28A1E', '#E8761A', '#F79A3A'], w: [6, 9],  len: [70, 130], curve: .08 }, // 당근
    { from: 105, to: 135, n: 75,  colors: ['#2A5524', '#3B6E2E', '#1E4019'], w: [7, 11], len: [40, 90], curve: .9 },  // 나물
  ];

  function strand(x, y, dir, len, curve, w, color) {
    const ex = x + Math.cos(dir) * len, ey = y + Math.sin(dir) * len;
    const bend = (rnd() - .5) * curve * len;
    const qx = (x + ex) / 2 - Math.sin(dir) * bend, qy = (y + ey) / 2 + Math.cos(dir) * bend;
    const p = document.createElementNS(NS, 'path');
    p.setAttribute('d', `M${x.toFixed(1)} ${y.toFixed(1)}Q${qx.toFixed(1)} ${qy.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`);
    p.setAttribute('stroke', color);
    p.setAttribute('stroke-width', w.toFixed(1));
    g.appendChild(p);
    return [ex, ey];
  }

  function dot(x, y, r, color) {
    const c = document.createElementNS(NS, 'circle');
    c.setAttribute('cx', x.toFixed(1)); c.setAttribute('cy', y.toFixed(1));
    c.setAttribute('r', r); c.setAttribute('fill', color);
    g.appendChild(c);
  }

  // 흰자 — 가장자리가 울퉁불퉁한 계란 프라이
  function eggWhite(r, dx, dy, color) {
    const pts = [];
    for (let i = 0; i < 14; i++) {
      const a = i / 14 * Math.PI * 2, rr = r + (rnd() - .5) * 36;
      pts.push([CX + dx + Math.cos(a) * rr, CY + dy + Math.sin(a) * rr]);
    }
    const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
    let d = `M${mid(pts[13], pts[0]).join(' ')}`;
    pts.forEach((p, i) => { d += `Q${p.join(' ')} ${mid(p, pts[(i + 1) % 14]).join(' ')}`; });
    const path = document.createElementNS(NS, 'path');
    path.setAttribute('d', d + 'Z'); path.setAttribute('fill', color);
    g.appendChild(path);
  }

  // 밥알
  for (let i = 0; i < 900; i++) {
    const a = rnd() * Math.PI * 2, r = Math.sqrt(rnd()) * 456;
    strand(CX + Math.cos(a) * r, CY + Math.sin(a) * r, rnd() * Math.PI * 2,
      range([6, 10]), 0, range([9, 12]), pick(['#FFFDF6', '#EFE6CF', '#F7F0DC']));
  }
  // 나물 — 가운데부터 그릇 끝까지 옹골차게, 대체로 바깥쪽 결
  for (const s of SECTORS) {
    for (let i = 0; i < s.n * 3.5; i++) {
      const a = (s.from - 2 + rnd() * (s.to - s.from + 4)) * Math.PI / 180;
      const r = 110 + Math.sqrt(rnd()) * 360;
      const dir = a + (rnd() - .5) * .9;
      const end = strand(CX + Math.cos(a) * r, CY + Math.sin(a) * r, dir, range(s.len), s.curve, range(s.w), pick(s.colors));
      if (s.head && rnd() < .6) dot(end[0], end[1], 6, s.head);
    }
  }
  // 가운데 육회
  for (let i = 0; i < 420; i++) {
    const a = rnd() * Math.PI * 2, r = Math.sqrt(rnd()) * 155;
    strand(CX + Math.cos(a) * r, CY + Math.sin(a) * r, rnd() * Math.PI * 2,
      range([35, 85]), 1, range([12, 18]), pick(['#8E1B1F', '#6E1218', '#A8292B', '#5A0F14']));
  }
  // 계란 프라이
  eggWhite(128, 6, 8, '#E6DCC4');
  eggWhite(128, 0, 0, '#FFFDF8');
  dot(CX + 4, CY - 6, 66, '#F4A80F');
  dot(CX, CY - 10, 60, '#FFC21A');
  dot(CX - 18, CY - 30, 14, '#FFE58A');
})();
