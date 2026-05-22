import Header from "@/components/Header";
import ChatPreview from "@/components/ChatPreview";

const STACK_APPS = [
  {
    id: "entityos",
    name: "EntityOS",
    description: "System management and 1-click stack control.",
    status: "active",
    url: "http://localhost:8080",
  },
  {
    id: "accord",
    name: "Accord",
    description: "Decentralized chat and communication protocol.",
    status: "active",
    url: "http://localhost:5280",
  },
  {
    id: "arena",
    name: "Arena",
    description: "ML Performance evaluation and simulation environment.",
    status: "active",
    url: "http://localhost:8090",
  },
  {
    id: "gateway",
    name: "Gateway",
    description: "AIMengine vector database and proxy orchestration.",
    status: "active",
    url: "http://localhost:8001",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 pt-32 px-8 max-w-7xl mx-auto w-full">
        <section className="mb-24 text-center md:text-left">
          <h2 className="operator-text text-[#666] text-sm mb-4">Operator Gateway</h2>
          <h1 className="text-6xl md:text-8xl font-medium tracking-tight mb-8">
            TENSOR <br />
            PORTAL
          </h1>
          <p className="text-[#888] text-lg max-w-2xl mb-12">
            Secure entry point to the AiM software stack. Authenticate via Dynamic 
            to access internal systems, deployment controls, and neural monitoring.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <button className="px-8 py-4 bg-white text-black font-medium operator-text text-sm hover:bg-[#ededed] transition-colors">
              Access Stack
            </button>
            <button className="px-8 py-4 border border-[#333] text-[#888] font-medium operator-text text-sm hover:bg-[#111] transition-colors">
              Documentation
            </button>
          </div>
        </section>

        <section id="stack" className="mb-24">
          <div className="flex items-center justify-between mb-8 border-b border-[#1f1f1f] pb-4">
            <h3 className="operator-text text-xs text-[#666]">System Modules</h3>
            <span className="text-[10px] text-[#444] font-mono">BUILD 04.21.f8a3c</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {STACK_APPS.map((app) => (
              <a 
                key={app.id} 
                href={app.url}
                target="_blank"
                rel="noopener noreferrer"
                className="operator-card p-6 flex flex-col justify-between group hover:border-[#666] transition-all cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="operator-text text-[10px] text-[#666]">{app.id}</span>
                    <div className={`w-1.5 h-1.5 rounded-full ${app.status === 'active' ? 'bg-[#50e3c2]' : 'bg-orange-500'}`}></div>
                  </div>
                  <h4 className="text-xl font-medium mb-2 group-hover:text-[#50e3c2] transition-colors">{app.name}</h4>
                  <p className="text-[#666] text-sm leading-relaxed">{app.description}</p>
                </div>
                
                <div className="mt-8 flex items-center gap-2 text-[10px] text-[#444] operator-text group-hover:text-white transition-colors">
                  Launch Module <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section className="mb-32">
          <div className="flex flex-col items-center">
            <h3 className="operator-text text-xs text-[#666] mb-8">Secure Terminal</h3>
            <ChatPreview />
            <p className="text-[#444] text-[10px] mt-6 font-mono">
              BRIDGE STATUS: TUNNELING TO LOCALHOST:4400
            </p>
          </div>
        </section>
      </main>

      <footer className="px-8 py-12 border-t border-[#1f1f1f] flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="text-[10px] text-[#444] operator-text">
          SYS / GATEWAY · © 2026 TENSOR CORP
        </div>
        <div className="flex gap-8 text-[10px] text-[#444] operator-text">
          <a href="#" className="hover:text-white transition-colors">Terms</a>
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Contact</a>
        </div>
      </footer>
    </div>
  );
}
