import { GsapScene } from "../../../kit";
import { C, a } from "../palette";

// A build console: the Linux 7.x tree is compiled straight into one wasm
// module, with the kernel subsystems lighting up along the way and the real
// Sv39 page-table path called out. Animated with GSAP only.
const CSS = `
.compile {
  background-color: ${C.bg};
  background-image:
    linear-gradient(rgba(29,59,47,0.22) 1px, transparent 1px),
    linear-gradient(90deg, rgba(29,59,47,0.22) 1px, transparent 1px);
  background-size: 72px 72px;
  overflow: hidden;
}
.compile .stage {
  position: absolute; left: 103px; top: 250px; width: 777px; height: 1190px;
  font-family: "Be Vietnam Pro", sans-serif; color: ${C.text};
}
.compile .title {
  position: absolute; left: 0; top: 0; width: 777px; margin: 0;
  font-family: "Bricolage Grotesque", sans-serif; font-weight: 800;
  font-size: 78px; line-height: 0.98; letter-spacing: -0.035em; color: ${C.text};
}
.compile .health {
  position: absolute; left: 0; top: 194px; width: 777px; height: 48px;
  display: flex; align-items: center; gap: 12px;
  border-bottom: 1px solid ${C.line}; padding-bottom: 12px; box-sizing: border-box;
  font-family: "JetBrains Mono", monospace; font-size: 34px; color: ${C.dim};
}
.compile .avatar { width: 40px; height: 40px; border-radius: 20px; background: #fff; }
.compile .svc { font-family: "Be Vietnam Pro", sans-serif; font-weight: 700; font-size: 38px; color: ${C.text}; }
.compile .lamp {
  width: 12px; height: 12px; border-radius: 6px; background: ${C.mint};
  box-shadow: 0 0 12px ${C.mint}99; display: inline-block;
}
.compile .status { color: ${C.mint}; }
.compile .spacer { flex: 1; }
.compile .meta { color: ${C.faint}; }
.compile .src {
  position: absolute; left: 0; top: 264px; width: 777px; height: 190px;
  background: ${C.panel}; border: 1px solid ${C.line}; border-radius: 8px;
  box-sizing: border-box; padding: 16px 22px; overflow: hidden;
}
.compile .tag {
  font-family: "JetBrains Mono", monospace; font-size: 34px; line-height: 1;
  color: ${C.faint}; letter-spacing: 0.02em;
}
.compile .src-name {
  margin-top: 8px; font-family: "JetBrains Mono", monospace; font-size: 56px;
  font-weight: 700; line-height: 1; color: ${C.text};
}
.compile .src-sub { margin-top: 10px; font-size: 34px; line-height: 1.15; color: ${C.dim}; }
.compile .scan {
  position: absolute; left: 0; top: 0; width: 100%; height: 2px;
  background: ${C.mint}; box-shadow: 0 0 18px ${C.mint}; opacity: 0;
}
.compile .route { position: absolute; left: 0; top: 466px; width: 777px; height: 170px; }
.compile .route svg { position: absolute; left: 0; top: 0; overflow: visible; }
.compile .route-line { stroke: ${C.mint}; stroke-width: 2; fill: none; }
.compile .node { fill: ${C.mint}; transform-box: fill-box; transform-origin: center; opacity: 0; }
.compile .chip {
  position: absolute; left: 82px; font-family: "JetBrains Mono", monospace;
  font-size: 34px; line-height: 1; color: ${C.text}; opacity: 0;
}
.compile .out {
  position: absolute; left: 0; top: 650px; width: 777px; height: 190px;
  background: ${C.raised}; border: 1px solid ${C.lineLit}; border-left: 3px solid ${C.mint};
  border-radius: 8px; box-sizing: border-box; padding: 16px 22px;
}
.compile .out .row { display: flex; justify-content: space-between; align-items: baseline; }
.compile .out-name {
  margin-top: 10px; font-family: "JetBrains Mono", monospace; font-size: 50px;
  font-weight: 700; line-height: 1; color: ${C.text};
}
.compile .out-sub { margin-top: 12px; font-size: 34px; line-height: 1.15; color: ${C.dim}; }
.compile .wasm { font-family: "JetBrains Mono", monospace; font-size: 44px; font-weight: 700; color: ${C.mint}; }
.compile .mmu {
  position: absolute; left: 0; top: 849px; width: 777px; height: 210px;
  background: ${C.panel}; border: 1px solid ${C.line}; border-radius: 8px;
  box-sizing: border-box; padding: 16px 22px;
}
.compile .mmu-head { display: flex; align-items: baseline; gap: 18px; }
.compile .mmu-big {
  font-family: "JetBrains Mono", monospace; font-size: 72px; font-weight: 700;
  line-height: 0.9; color: ${C.text}; letter-spacing: -0.03em;
}
.compile .pt-row { display: flex; align-items: center; gap: 10px; margin-top: 14px; }
.compile .pt {
  height: 46px; padding: 0 12px; box-sizing: border-box;
  border: 1px solid ${C.lineLit}; border-radius: 4px; background: ${C.raised};
  display: flex; align-items: center; font-family: "JetBrains Mono", monospace;
  font-size: 34px; color: ${C.text}; opacity: 0;
}
.compile .pt-link { width: 18px; height: 1px; background: ${C.lineLit}; flex: none; }
.compile .mmu-sub { margin-top: 14px; font-size: 34px; line-height: 1.15; color: ${C.dim}; }
.compile .manifest {
  position: absolute; left: 0; top: 1072px; width: 777px; height: 90px;
  display: grid; grid-template-columns: 1fr 1fr; column-gap: 22px; row-gap: 8px;
  border-top: 1px solid ${C.line}; padding-top: 12px; box-sizing: border-box;
}
.compile .logline {
  display: flex; align-items: center; gap: 12px; opacity: 0;
  font-family: "JetBrains Mono", monospace; font-size: 34px; color: ${C.dim};
}
.compile .ok { width: 10px; height: 10px; background: ${C.mint}; flex: none; }
`;

const HTML = `
<div class="stage">
  <h1 class="title">Biên dịch thẳng<br/>sang WASM</h1>
  <div class="health">
    <img class="avatar" src="${a("repos/pithings.png")}" alt="" />
    <span class="svc">unkernel</span>
    <span class="lamp"></span>
    <span class="status">compiled</span>
    <span class="spacer"></span>
    <span class="meta">linux 7.x</span>
  </div>

  <div class="src">
    <div class="tag">source</div>
    <div class="src-name">Linux 7.x</div>
    <div class="src-sub">một nhân Linux đầy đủ</div>
    <div class="scan"></div>
  </div>

  <div class="route">
    <svg width="777" height="170" viewBox="0 0 777 170">
      <line class="route-line" x1="42" y1="4" x2="42" y2="166" stroke-dasharray="162" stroke-dashoffset="162" />
      <circle class="node" cx="42" cy="18" r="6" />
      <circle class="node" cx="42" cy="60" r="6" />
      <circle class="node" cx="42" cy="102" r="6" />
      <circle class="node" cx="42" cy="144" r="6" />
    </svg>
    <div class="chip" style="top: 1px">syscall</div>
    <div class="chip" style="top: 43px">scheduler</div>
    <div class="chip" style="top: 85px">ext4</div>
    <div class="chip" style="top: 127px">TCP/IP</div>
  </div>

  <div class="out">
    <div class="row">
      <span class="tag">output</span>
      <span class="wasm">wasm</span>
    </div>
    <div class="out-name">một module wasm</div>
    <div class="out-sub">nhân chạy trực tiếp, không giả lập</div>
  </div>

  <div class="mmu">
    <div class="mmu-head">
      <span class="tag">MMU</span>
      <span class="mmu-big">Sv39</span>
    </div>
    <div class="pt-row">
      <div class="pt">cấp 1</div>
      <div class="pt-link"></div>
      <div class="pt">cấp 2</div>
      <div class="pt-link"></div>
      <div class="pt">cấp 3</div>
    </div>
    <div class="mmu-sub">MMU thật, không giả lập</div>
  </div>

  <div class="manifest">
    <div class="logline"><span class="ok"></span>arch/wasm</div>
    <div class="logline"><span class="ok"></span>MMU Sv39</div>
    <div class="logline"><span class="ok"></span>ext4</div>
    <div class="logline"><span class="ok"></span>TCP/IP</div>
  </div>
</div>
`;

export const Compile: React.FC<{ len: number }> = () => (
  <GsapScene
    className="compile"
    css={CSS}
    html={HTML}
    timeline={(tl, q) => {
      tl.fromTo(q(".title"), { y: 56, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, ease: "power3.out" }, 0.05);
      tl.fromTo(q(".health"), { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" }, 0.35);
      tl.fromTo(q(".src"), { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }, 0.6);

      tl.fromTo(q(".scan"), { y: 0, opacity: 0 }, { y: 0, opacity: 1, duration: 0.12, ease: "power1.out" }, 1.15);
      tl.fromTo(q(".scan"), { y: 0 }, { y: 186, duration: 1.25, ease: "none", immediateRender: false }, 1.2);
      tl.fromTo(q(".scan"), { opacity: 1 }, { opacity: 0, duration: 0.25 }, 2.4);

      tl.fromTo(q(".route-line"), { strokeDashoffset: 162 }, { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut" }, 2.2);
      tl.fromTo(q(".node"), { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.28, ease: "power3.out", stagger: 0.17 }, 2.55);
      tl.fromTo(q(".chip"), { x: -18, opacity: 0 }, { x: 0, opacity: 1, duration: 0.34, ease: "power3.out", stagger: 0.17 }, 2.55);

      tl.fromTo(q(".out"), { y: 28, opacity: 0, scale: 0.97 }, { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "power3.out" }, 3.25);

      tl.fromTo(q(".mmu"), { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }, 4.0);
      tl.fromTo(q(".pt"), { x: -16, opacity: 0 }, { x: 0, opacity: 1, duration: 0.34, ease: "power3.out", stagger: 0.15 }, 4.35);

      tl.fromTo(q(".logline"), { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: "power3.out", stagger: 0.12 }, 5.05);
    }}
  />
);
