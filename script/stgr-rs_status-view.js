(function() {
  'use strict';
  const stA = ["HP", "SP", "MP", "物理攻撃力", "魔法攻撃力", "物理防御力", "魔法防御力", "命中力", "回避力", "知力", "抵抗力", "素早さ", "会心力", "会心威力", "回復力", "被回復力", "HP超過ダメージ軽減"];
  const stB = {
    "STR": [4,4,1,9,0,6,1,2,3,1,3,3,2],
    "MAG": [1,1,4,0,9,1,7,3,4,2,1,5,1],
    "AGI": [1,4,0,4,1,2,1,3,6,3,4,7,3],
    "VIT": [8,3,2,1,1,7,5,1,2,2,6,1,0],
    "DEX": [1,3,3,3,3,1,1,7,2,4,3,0,8],
    "MNT": [3,3,8,1,4,1,3,2,1,6,1,2,4]
  };
  const typeA = {
    "平穏": [0,0.04,0.04,0,0,0,0,0,0,0,0,0,0,0,0,0,0.02],
    "頑丈":	[0,0,0,0,0,0.035,0.035,0,0,0,0,0,0,0,0,0,0.03],
    "闘志":	[0,0,0,0.05,0.05,0,0,0,0,0,0,0,0,0,0,0,0],
    "華麗":	[0,0,0,0,0,0,0,0.05,0.05,0,0,0,0,0,0,0,0],
    "慈愛":	[0.025,0,0.025,0,0,0,0,0,0,0,0,0,0,0,0.05,0,0],
    "逆境":	[0,0,0,0,0,0,0,0,0,0,0,0,0.05,0.025,0,0.025,0],
    "支援":	[0,0,0,0,0,0,0,0.05,0,0.05,0,0,0,0,0,0,0],
    "妨害":	[0,0,0,0,0,0,0,0,0,0.05,0.05,0,0,0,0,0,0],
    "刹那":	[0,0,0,0,0,0,0,0,0.05,0,0,0.05,0,0,0,0,0],
    "守護":	[0.05,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.05,0],
    "余裕":	[0,0,0,0,0,0,0,0,0.035,0,0.035,0,0,0,0,0,0.03],
    "増幅":	[0,0.05,0.05,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    "根性":	[0,0,0,0,0,0,0,0,0,0,0.05,0,0,0,0,0.05,0],
    "精密":	[0,0,0,0,0,0,0,0.05,0,0,0,0,0,0.05,0,0,0],
    "拡散":	[0,0,0,0,0,0,0,0.05,0,0,0,0,0,0,0.05,0,0],
    "庭師":	[0.025,0,0,0.025,0.025,0,0,0,0,0,0,0,0,0,0.025,0,0],
  };
  const st_new = (str = 0, mag = 0, agi = 0, vit = 0, dex = 0, mnt = 0) => {
    return {"STR": str, "MAG": mag, "AGI": agi, "VIT": vit, "DEX": dex, "MNT": mnt};
  };
  const zukanLv = [0, 0.05, 0.15, 0.2, 0.25, 0.35, 0.4, 0.5];//350
  const Niwa = {};
  Niwa.getId = function(text) {
    const r = text.split(/(\d+)\s/);
    return [parseInt(r[1], 10), r[2]];
  };
  Niwa.getStatus = function(text) {
    const st = text.split(/(STR|MAG|AGI|VIT|DEX|MNT)(\d+)/);
    const o = st_new();
    for(let i = 0; i < 6; i++) {
      const a = i * 3 + 1;
      o[st[a]] = parseInt(st[a+1], 10);
    }
    return o;
  };
  Niwa.getType = function(c) {
    const o = [];
    for(let i = 0; i < c.length;) {
      if(c[i++].className === "marks marki0") {
        const t = c[i++].innerText.split(/【✿(.*)】/);
        if(t.length > 1) o.push(t[1]);
      }
    }
    return o;
  };
  Niwa.getZukanLv = function(id) {
    return fetch(`http://st.x0.to/?mode=zukan&zeno=${id}`).then(r => r.text()).then(t => parseInt(t.split(/開放済みの花図鑑の項目数（花図鑑Lv）\:\s(\d+)/)[1], 10));
  };
  Niwa.Math = {};
  Niwa.Math.Floor = function(r) {
    for(let i = 0; i < r.length; i++) r[i] = Math.floor(r[i]);
    return r;
  };
  Niwa.mathState = function(st, type, zukan) {
    const zlv = Math.floor(zukan / 50);
    const zhosei = zlv >= zukanLv.length ? 0 : zukanLv[zlv];
    const nozhosei = ["SP", "MP", "素早さ", "会心威力", "HP超過ダメージ軽減"];
    const r = Object.keys(stB).map(v => {
      const n = st[v];
      const a = stB[v];
      return a.map(v => (n + 5) * v);
    }).reduce((acc, cur) => {
      for(let i = 0; i < cur.length; i++) acc[i] += cur[i];
      return acc;
    }, [0,0,0,0,0,0,0,0,0,0,0,0,0,100,100,100,100]);
    const j = {"ステータス": st, "タイプ": type, "花図鑑Lv": [zukan, zhosei]};
    const o = {};
    r[0] = r[0] * 9 + 500;
    r[1] = r[1] * 0.7 + 50;
    r[2] = r[2] * 0.7 + 50;
    for(let i = 3; i < r.length - 4; i++) r[i] = r[i] * 0.2;
    this.Math.Floor(r);
    for(let i = 0; i < type.length; i++) {
      const ty = typeA[type[i]];
      for(let i = 0; i < r.length; i++) r[i] = Math.ceil(r[i] * (ty[i] + 1));
    }
    for(let i = 0; i < r.length; i++) {
      if(nozhosei.findIndex(function(v) {return this === v;}, stA[i]) === -1) r[i] = Math.ceil(r[i] * (zhosei + 1));
    }
    for(let i = 0; i < r.length; i++) o[stA[i]] = r[i];
    return [j, o];
  };
  Niwa.documentGet = function() {
    const id = this.getId(document.getElementsByClassName("profile")[0].innerText);
    const zukan = this.getZukanLv(id[0]);
    const a = document.getElementsByClassName("cdatal")[1];
    const achild = a.children;
    const st = this.getStatus(achild[0].innerText);
    const type = this.getType(achild);
    Promise.all([st, type, zukan]).then(r => this.mathState(...r)).then(([j, o]) => {
      const a = Object.keys(o).map(k => `<span style="font-size:100%;">${k}：${o[k]}</span>`).join("<br>");
      const d = document.createElement("div");
      const json = JSON.stringify(j, null, 1);
      d.classList.add("cdatal");
      d.style.float = "left";
      d.style.marginTop = "20px";
      d.innerHTML = `<span class="markp marki2">詳細ステータス</span><br><hr class="dashline"><div style="padding: 5px;">${a}<br>※果実は含まれません。<br>※花図鑑Lv350まで対応。<br><hr class="dashline"><details><summary style="color:#aa4433;cursor:pointer;">取得データ</summary><span style="font-size:80%">${json}</span></details></div>`;
      document.getElementsByClassName("cdatal")[1].after(d);
    });
  };
  Niwa.checkURL = function() {
    return !!window.location.href.match(/http:\/\/st\.x0\.to\/\?mode=profile&eno=\d+&detail=\d+/) ? true : false;
  };
  Niwa.main = function() {
    if(this.checkURL()) this.documentGet();
  };
  ////
  Niwa.main();
})();
