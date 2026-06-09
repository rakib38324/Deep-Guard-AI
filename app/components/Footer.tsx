import { ShieldCheck, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-12 px-4 border-t border-indigo-500/10">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
                <ShieldCheck className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-display font-700 text-base">
                Deep<span className="text-indigo-400">Guard</span>
                <span className="text-xs font-mono text-cyan-400 ml-1 align-middle">AI</span>
              </span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              Deepfake detection powered by peer-reviewed research and a hybrid deep learning architecture.
            </p>
          </div>

          {/* Research */}
          <div>
            <h4 className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-3">Research</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li>
                <a
                  href="https://data.mendeley.com/datasets/pdcp9mjy3z/2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-indigo-400 transition-colors flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3 h-3" />
                  Mendeley Dataset
                </a>
              </li>
              <li>
                <a
                  href="https://doi.org/10.1109/RAAICON69033.2025.11502474"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-indigo-400 transition-colors flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3 h-3" />
                  IEEE Publication
                </a>
              </li>
            </ul>
          </div>

          {/* Tech stack */}
          <div>
            <h4 className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-3">Tech Stack</h4>
            <div className="flex flex-wrap gap-2">
              {["Next.js 14", "TypeScript", "TailwindCSS", "Flask", "TensorFlow", "MTCNN", "OpenCV"].map(
                (t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded bg-slate-800/60 border border-slate-700/40 text-xs text-slate-400 font-mono"
                  >
                    {t}
                  </span>
                )
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-indigo-500/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 font-mono">
          <span>© 2025 DeepGuard AI · Built for research & digital forensics</span>
          <span>
            Dataset: Daffodil International University × UNIMAS
          </span>
        </div>
      </div>
    </footer>
  );
}
