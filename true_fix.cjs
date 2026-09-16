const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const oldStart = `<div className="p-6 md:p-10 max-w-4xl mx-auto">
             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">`;
const newStart = `<div className="p-6 md:p-10 max-w-4xl mx-auto">
            {adminTab === "analytics" ? (
                <AnalyticsDashboard />
            ) : (
                <>
             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">`;

code = code.replace(oldStart, newStart);

const oldEnd = `              {db[adminTab].length === 0 && (
                <div className="text-center py-12 text-white/30 bg-white/[0.02] border border-white/5 rounded-xl border-dashed">
                  No items in this collection yet.
                </div>
              )}
            </div>
          </div>
        </div>`;

const newEnd = `              {db[adminTab].length === 0 && (
                <div className="text-center py-12 text-white/30 bg-white/[0.02] border border-white/5 rounded-xl border-dashed">
                  No items in this collection yet.
                </div>
              )}
            </div>
          </>
          )}
          </div>
        </div>`;

code = code.replace(oldEnd, newEnd);

fs.writeFileSync('src/App.tsx', code);
