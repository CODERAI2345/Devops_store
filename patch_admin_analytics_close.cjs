const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// Looking for where the tab content ends
// Basically before `</div>` and then `</div>` for the whole admin view...
// Wait, the Admin view layout is:
/*
<div flex>
  <Sidebar />
  <div flex-1>
    {adminTab === "analytics" ? ( ... ) : (
      <>
      <MobileTabs />
      <AddLinkBox />
      <ManageCollection />
      </>
    )}
  </div>
</div>
*/

// Let's replace the ending of the flex-1 container:
const oldEnd = `                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- End Admin Console ---`;

const newEnd = `                  </div>
                </div>
              ))}
            </div>
          </>
          )}
          </div>
        </div>
      </div>
    );
  }

  // --- End Admin Console ---`;
  
code = code.replace(oldEnd, newEnd);
fs.writeFileSync('src/App.tsx', code);
