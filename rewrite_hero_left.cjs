const fs = require('fs');
let lp = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

const regex = /\{\/\* LEFT \*\/\}([\s\S]*?)\{\/\* RIGHT WORKSPACE \*\/\}/;
const match = lp.match(regex);
if (match) {
  const leftContent = `
          {/* LEFT */}
          <StaggerContainer>
            <StaggerItem className="mb-7 inline-flex items-center gap-2 rounded-full border border-purple-400/30 bg-purple-500/10 px-4 py-2 text-sm text-purple-200">
              <BookOpen size={16} />
              Your Hub for Learning, Building, and Sharing
            </StaggerItem>

            <StaggerItem className="max-w-3xl text-5xl font-bold leading-tight tracking-tight md:text-7xl">
              DevOps Store
              <br />
              <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-red-400 bg-clip-text text-transparent text-4xl md:text-6xl mt-2 block">
                Learn, Build, Share.
              </span>
            </StaggerItem>

            <StaggerItem>
              <p className="mt-7 max-w-xl text-lg leading-8 text-slate-300">
                Explore curated tutorials, GitHub repositories, tools, and cloud architecture guides. Learn DevOps the right way, build real-world skills, and grow with a community that shares knowledge openly.
              </p>
            </StaggerItem>

            <StaggerItem>
              <div className="mt-9 flex flex-wrap gap-4">
                <button
                  onClick={() => setView('feed')}
                  className="flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-4 font-semibold shadow-lg shadow-orange-500/25 transition-all duration-300 group hover:-translate-y-1 hover:bg-orange-400"
                >
                  Browse Resources <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="mt-10 flex flex-wrap gap-5 text-sm text-slate-300">
                <span className="flex items-center gap-2">
                  <Heart size={16} className="text-pink-400" />
                  Expert-Curated
                </span>
                <span className="flex items-center gap-2">
                  <Users size={16} className="text-teal-400" />
                  Community-Driven
                </span>
                <span className="flex items-center gap-2">
                  <Server size={16} className="text-purple-400" />
                  Always Updated
                </span>
                <span className="flex items-center gap-2">
                  <Shield size={16} className="text-green-400" />
                  Reliable
                </span>
              </div>
            </StaggerItem>
          </StaggerContainer>

          {/* RIGHT WORKSPACE */}`;

  lp = lp.replace(regex, leftContent);
  fs.writeFileSync('src/components/LandingPage.tsx', lp);
  console.log("Hero left section rewritten!");
} else {
  console.log("Could not match hero left section.");
}
