import MainLayout from "../components/Main-Layout.component";
import { useState, useEffect, useRef } from "react";

function AnimatedNumber({ target, suffix = "", delay = 0 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        obs.disconnect();
        let start = 0;
        const step = Math.max(1, Math.floor(target / 60));
        const tick = setTimeout(() => {
          const id = setInterval(() => {
            start = Math.min(start + step, target);
            setVal(start);
            if (start >= target) clearInterval(id);
          }, 16);
        }, delay);
        return () => clearTimeout(tick);
      },
      { threshold: 0.3 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target, delay]);

  return (
    <span ref={ref}>
      {val.toLocaleString("pt-BR")}
      {suffix}
    </span>
  );
}

function GraphCard({ href, icon, title, description, badge, status }) {
  return (
    <a
      href={href}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-red-900/30 bg-black/30 backdrop-blur-sm hover:border-red-600/60 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-red-950/40"
    >
      <span className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-600/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="flex-1 p-7">
        <div className="flex items-start justify-between mb-5">
          <span className="text-5xl leading-none">{icon}</span>
          <span
            className={`text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${
              status === "ao vivo"
                ? "bg-green-950/60 text-green-400 border-green-800/40"
                : "bg-yellow-950/60 text-yellow-500 border-yellow-800/40"
            }`}
          >
            {badge}
          </span>
        </div>
        <h3 className="text-xl font-black text-red-100 mb-2 group-hover:text-red-400 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
      </div>

      <div className="px-7 pb-6">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-red-500 group-hover:text-red-400 transition-colors">
          Explorar grafo
          <svg
            className="w-3.5 h-3.5 translate-x-0 group-hover:translate-x-1 transition-transform duration-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </span>
      </div>
    </a>
  );
}

function TechBadge({ icon, name, description }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl border border-red-950/30 bg-black/20 hover:border-red-800/40 transition-colors duration-300">
      <span className="text-2xl leading-none mt-0.5">{icon}</span>
      <div>
        <div className="text-sm font-bold text-red-100">{name}</div>
        <div className="text-xs text-gray-500 mt-0.5">{description}</div>
      </div>
    </div>
  );
}

function CreatorCard({ nick, role, description }) {
  return (
    <div className="flex items-start gap-4 p-5 rounded-xl border border-red-950/30 bg-black/20 hover:border-red-800/40 transition-colors duration-300">
      <div className="w-10 h-10 rounded-lg bg-red-950/60 border border-red-900/40 flex items-center justify-center flex-shrink-0">
        <i className="pi pi-user text-red-400" style={{ fontSize: "1rem" }} />
      </div>
      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-black text-red-300">{nick}</span>
          <span className="text-xs text-gray-600 uppercase tracking-widest border border-red-950/40 rounded-full px-2 py-0.5">
            {role}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <MainLayout>
      <section className="relative isolate overflow-hidden bg-gray-950 min-h-screen flex items-center">
        <img
          alt="Iron Hotel background"
          src="/home_bg.png"
          className="absolute inset-0 -z-20 size-full object-cover object-center"
        />

        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-gray-950/80 via-transparent to-gray-950" />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 -right-32 -z-10 h-[600px] w-[600px] rounded-full bg-red-900/20 blur-[120px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-48 -left-16 -z-10 h-[500px] w-[500px] rounded-full bg-red-950/30 blur-[100px]"
        />

        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-28 sm:py-36 w-full">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-center gap-3 mb-8">
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-red-500 border border-red-900/50 rounded-full px-3 py-1">
                Online há 12+ anos · Luso-Brasileiro
              </span>
            </div>

            <h1 className="text-6xl sm:text-8xl font-black tracking-tight text-white leading-[0.9] mb-6">
              <span className="text-red-600">Iron</span>
              <br />
              <span className="text-red-600">Hotel</span>
            </h1>
            <p className="text-2xl sm:text-3xl font-light text-red-200/80 mb-4">
              Quem são as pessoas que fazem esse hotel viver?
            </p>
            <p className="text-base text-gray-400 max-w-xl leading-relaxed mb-10">
              Nascido de uma comunidade que transbordou, o Iron existe desde
              <span className="text-red-400"> 2018</span> e sobreviveu a tudo:
              fim do Flash, hotéis concorrentes e mudanças do mercado. O que
              mantém o Iron de pé, nas palavras do próprio CEO, é a sua
              comunidade. Este projeto mapeia exatamente isso.
            </p>

            <div className="flex items-center gap-3 mb-8 px-4 py-3 rounded-xl border border-yellow-900/40 bg-yellow-950/20 text-yellow-500/80">
              <i
                className="pi pi-info-circle text-yellow-500"
                style={{ fontSize: "1rem" }}
              />
              <p className="text-sm">
                Os dados exibidos nos grafos
                <span className="font-bold"> não são em tempo real</span>,
                refletem um snapshot da comunidade coletado no dia 06/03/2026.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <a
                href="#grafos"
                className="inline-flex items-center gap-2 bg-red-700 hover:bg-red-600 text-white font-bold px-7 py-3.5 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-red-900/40 hover:-translate-y-0.5"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <circle cx="5" cy="12" r="2" strokeWidth={2} />
                  <circle cx="19" cy="5" r="2" strokeWidth={2} />
                  <circle cx="19" cy="19" r="2" strokeWidth={2} />
                  <path
                    strokeLinecap="round"
                    strokeWidth={2}
                    d="M7 11l10-5M7 13l10 5"
                  />
                </svg>
                Ver Grafos
              </a>
              <a
                href="#sobre"
                className="inline-flex items-center gap-2 border border-red-800/60 text-red-300 hover:text-white hover:border-red-600 font-semibold px-7 py-3.5 rounded-xl transition-all duration-300"
              >
                Saber mais
              </a>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-40">
          <span className="text-xs text-gray-500 uppercase tracking-widest">
            Role para ler mais
          </span>
          <div className="w-px h-10 bg-gradient-to-b from-gray-500 to-transparent animate-pulse" />
        </div>
      </section>

      <section className="bg-gray-950 border-y border-red-950/40 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { target: 12, suffix: "+ anos", label: "De história" },
              { target: 3800, suffix: "+", label: "Jogadores únicos" },
              { target: 40000, suffix: "+", label: "Grupos ativos" },
              { target: 90000, suffix: "+", label: "Laços de amizade" },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="text-center border border-red-950/30 bg-black/20 rounded-xl p-6 hover:border-red-800/50 transition-colors duration-300"
              >
                <div className="text-4xl sm:text-5xl font-black text-red-500 font-mono tabular-nums">
                  <AnimatedNumber
                    target={stat.target}
                    suffix={stat.suffix}
                    delay={i * 150}
                  />
                </div>
                <div className="text-xs text-red-300/50 mt-2 uppercase tracking-widest">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="sobre" className="bg-gray-950 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-red-600 mb-4 block">
                O projeto
              </span>
              <h2 className="text-4xl sm:text-5xl font-black text-white mb-6 leading-tight">
                A comunidade
                <br />
                <span className="text-red-600">mapeada</span> em pontos
              </h2>
              <div className="space-y-4 text-gray-400 leading-relaxed">
                <p>
                  O Iron Hotel não é só um jogo, é uma comunidade que
                  sobreviveu ao fim do Flash, às mudanças do mercado e ao tempo.
                  Mais de 12 anos de histórias, amizades e grupos que moldaram a
                  cultura de um dos Habbos piratas mais longevos da língua
                  portuguesa.
                </p>
                <p>
                  Este projeto usa visualização de grafos para revelar a
                  estrutura invisível dessa comunidade: como os grupos se
                  conectam entre si, quais jogadores são pontes entre diferentes
                  círculos, e onde estão os hubs de influência dentro do hotel.
                </p>
              </div>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="relative w-72 h-72">
                <svg
                  viewBox="0 0 300 300"
                  className="w-full h-full opacity-70"
                  aria-hidden="true"
                >
                  {[
                    [150, 150, 80, 80],
                    [150, 150, 220, 80],
                    [150, 150, 240, 170],
                    [150, 150, 200, 250],
                    [150, 150, 90, 240],
                    [150, 150, 50, 160],
                    [80, 80, 220, 80],
                    [220, 80, 240, 170],
                    [240, 170, 200, 250],
                    [200, 250, 90, 240],
                    [90, 240, 50, 160],
                    [50, 160, 80, 80],
                  ].map(([x1, y1, x2, y2], i) => (
                    <line
                      key={i}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="#7f1d1d"
                      strokeWidth="1.5"
                      strokeOpacity="0.6"
                    />
                  ))}
                  {[
                    [80, 80, "#b91c1c"],
                    [220, 80, "#dc2626"],
                    [240, 170, "#ef4444"],
                    [200, 250, "#b91c1c"],
                    [90, 240, "#991b1b"],
                    [50, 160, "#7f1d1d"],
                  ].map(([cx, cy, fill], i) => (
                    <circle key={i} cx={cx} cy={cy} r="10" fill={fill} />
                  ))}
                  <circle
                    cx="150"
                    cy="150"
                    r="22"
                    fill="#450a0a"
                    stroke="#b91c1c"
                    strokeWidth="2"
                  />
                  <circle cx="150" cy="150" r="10" fill="#dc2626" />
                </svg>
                <div className="absolute inset-0 rounded-full bg-red-900/10 blur-3xl -z-10" />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="grafos" className="bg-gray-950 pb-24 sm:pb-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-red-600 mb-4 block">
              Visualizações
            </span>
            <h2 className="text-4xl font-black text-white">
              Explore os grafos
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <GraphCard
              href="/grafo-grupos"
              icon={
                <i
                  className="pi pi-sitemap text-white"
                  style={{ fontSize: "3rem" }}
                ></i>
              }
              title="Grafo de Grupos"
              description="Visualize como os grupos do Iron Hotel se relacionam. Descubra quais grupos têm mais membros em comum, onde estão os clusters mais densos e quem são as pessoas que transitam entre diferentes comunidades."
              badge="Disponível"
              status="ao vivo"
            />
            <GraphCard
              //   href="/grafo-amigos"
              icon={
                <i
                  className="pi pi-users text-white"
                  style={{ fontSize: "3rem" }}
                ></i>
              }
              title="Grafo de Amizades"
              description="Uma rede de todas as amizades do hotel. Cada aresta representa um laço real entre dois jogadores. Revela os jogadores mais conectados, os pontes entre grupos e os núcleos mais coesos da comunidade."
              badge="Em breve"
              status="em breve"
            />
          </div>
        </div>
      </section>

      <section className="bg-gray-950 border-t border-red-950/30 pb-24 sm:pb-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-24 sm:pt-32">
          <div className="max-w-2xl mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-red-600 mb-4 block">
              Sobre nós
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight">
              Feito por jogadores,
              <br />
              <span className="text-red-600">para a comunidade</span>
            </h2>
            <p className="text-gray-400 leading-relaxed">
              Este projeto nasceu da curiosidade de dois amigos que cresceram
              dentro do Iron e quiseram entender, de forma visual, o que torna
              essa comunidade tão duradoura.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-red-700 mb-5">
                Criadores
              </h3>
              <div className="space-y-3">
                <CreatorCard
                  nick="NuoriM"
                  role="Dev · Idealizador"
                  description="Jogador do Iron, responsável por toda a parte técnica do projeto — coleta de dados, construção dos grafos e desenvolvimento da interface."
                />
                <CreatorCard
                  nick="Apparatus"
                  role="Co-criador"
                  description="Também jogador do Iron. Parceiro de ideia desde o começo, ajudou a dar forma ao conceito."
                />
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-red-700 mb-5">
                Tecnologias
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <TechBadge
                  icon={<i className="pi pi-bolt text-white text-2xl"></i>}
                  name="React + Vite"
                  description="Base da aplicação — interface rápida e reativa"
                />
                <TechBadge
                  icon={<i className="pi pi-chart-pie text-white text-2xl"></i>}
                  name="Cosmograph"
                  description="Renderização GPU dos grafos com milhares de nós"
                />
                <TechBadge
                  icon={<i className="pi pi-send text-white text-2xl"></i>}
                  name="WebSocket"
                  description="Comunicação"
                />
                <TechBadge
                  icon={<i className="pi pi-book text-white text-2xl"></i>}
                  name="Tailwind CSS"
                  description="Estilização utilitária de toda a interface"
                />
                <TechBadge
                  icon={<i className="pi pi-prime text-white text-2xl"></i>}
                  name="PrimeReact"
                  description="Componentes de UI prontos e acessíveis"
                />
                <TechBadge
                  icon={<i className="pi pi-trophy text-white text-2xl"></i>}
                  name="PrimeIcons"
                  description="Biblioteca de ícones usada no projeto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-950 border-t border-red-950/30 py-20 text-center">
        <div className="mx-auto max-w-xl px-6">
          <h2 className="mt-6 text-3xl font-black text-white">
            Você faz parte deste grafo.
          </h2>
          <p className="mt-3 text-gray-400 text-sm">
            Todo jogador que passou pelo Iron deixou sua marca na rede. Explore
            os grafos e encontre onde você está.
          </p>
          <a
            href="https://ironhotel.org"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 bg-red-800 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-red-900/40"
          >
            Jogar Iron Hotel
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
      </section>
    </MainLayout>
  );
}
