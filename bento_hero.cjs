const fs = require('fs');

let content = fs.readFileSync('src/components/LandingPage.tsx', 'utf-8');

// 1. Add Hero Badges
const cloudTrafficRegex = /<CloudTraffic \/>/g;
const badgesHtml = `<CloudTraffic />
              
              {/* Floating Hero Metric Badges */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="absolute -top-10 -left-10 z-20 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur-xl shadow-[0_0_30px_rgba(217,70,239,0.15)] hidden md:flex"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-500/20 text-fuchsia-400">
                  <BookOpen size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">100+</p>
                  <p className="text-xs text-slate-400">Curated Guides</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="absolute -bottom-10 -right-5 z-20 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur-xl shadow-[0_0_30px_rgba(217,70,239,0.15)] hidden md:flex"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
                  <Server size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Real-world</p>
                  <p className="text-xs text-slate-400">Architectures</p>
                </div>
              </motion.div>
`;
content = content.replace(cloudTrafficRegex, badgesHtml);


// 2. Replace Why DevOps Store grid with Bento Box Grid
const whyGridRegex = /<div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">[\s\S]*?<\/FadeIn>/;
const bentoHtml = `<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[250px]">
          
          {/* Box 1 (Large - 2x2) */}
          <div className="group md:col-span-2 md:row-span-2 rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-white/20 relative overflow-hidden flex flex-col justify-end">
            <div className="absolute top-0 right-0 p-8 text-fuchsia-500/20 group-hover:text-fuchsia-500/40 transition-colors duration-500">
              <Container size={120} strokeWidth={1} />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="relative z-10">
              <div className="mb-4 inline-flex rounded-xl bg-fuchsia-500/20 p-3">
                <BookOpen className="text-fuchsia-400" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Build Your Toolkit</h3>
              <p className="text-slate-400 max-w-sm leading-relaxed">
                Save tutorials, blogs, GitHub repositories, commands, and useful links in one organized place. Stop losing track of that one perfect guide you found.
              </p>
            </div>
          </div>

          {/* Box 2 (1x1) */}
          <div className="group md:col-span-1 rounded-3xl border border-white/10 bg-gradient-to-br from-violet-500/10 to-transparent p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-fuchsia-500/30 flex flex-col justify-between">
            <div className="inline-flex rounded-xl bg-violet-500/20 p-3 w-fit">
              <GraduationCap className="text-violet-400" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Curated by Experts</h3>
              <p className="text-sm text-slate-400">
                Carefully selected tutorials and resources to accelerate your growth.
              </p>
            </div>
          </div>

          {/* Box 3 (1x1) */}
          <div className="group lg:col-span-1 md:col-span-2 rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-white/20 flex flex-col justify-between">
            <div className="inline-flex rounded-xl bg-blue-500/20 p-3 w-fit">
              <Code2 className="text-blue-400" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Tools & Templates</h3>
              <p className="text-sm text-slate-400">
                Collect snippets, and architectures for real-world production use.
              </p>
            </div>
          </div>

          {/* Box 4 (Wide - 2x1) */}
          <div className="group md:col-span-2 rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-white/20 relative overflow-hidden flex flex-col justify-center">
             <div className="absolute -right-10 top-1/2 -translate-y-1/2 text-emerald-500/10 group-hover:text-emerald-500/20 transition-colors duration-500">
              <Network size={160} strokeWidth={1} />
            </div>
            <div className="relative z-10 max-w-sm">
              <div className="mb-4 inline-flex rounded-xl bg-emerald-500/20 p-3">
                <Users className="text-emerald-400" size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Grow Together</h3>
              <p className="text-slate-400">
                Share useful knowledge, help others, and grow together as a DevOps community.
              </p>
            </div>
          </div>

        </div>
        </FadeIn>`;

content = content.replace(whyGridRegex, bentoHtml);

fs.writeFileSync('src/components/LandingPage.tsx', content);

console.log('Added Hero Badges and Bento Grid.');
