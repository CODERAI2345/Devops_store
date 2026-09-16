const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const additionalRender = `          if (tabToRender === "web")
            return (
              <WebCard
                key={item.id}
                item={item}
                onStar={props.onStar}
                onCopy={props.onCopy}
                onClick={props.onClick}
                onDelete={props.onDelete}
              />
            );
          if (tabToRender === "lab")
            return (
              <LabCard
                key={item.id}
                item={item}
                onStar={props.onStar}
                onCopy={props.onCopy}
                onClick={props.onClick}
                onDelete={props.onDelete}
              />
            );
          return null;
        })}
      </div>
    );
  };`;

content = content.replace(/          return null;\n        \}\)}\n      <\/div>\n    \);\n  \};/, additionalRender);

fs.writeFileSync('src/App.tsx', content);
console.log('App.tsx renderFeed patched.');
