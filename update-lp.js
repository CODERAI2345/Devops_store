import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /if \(currentTab === "ys"\)[\s\S]*?(?=if \(currentTab === "li"\))/;
const replacement = `if (currentTab === "ys")
            return (
              <YSCard
                key={item.id}
                item={item}
                onStar={props.onStar}
                onCopy={props.onCopy}
                onClick={props.onClick}
                onEnrich={props.onEnrich}
              />
            );
          if (currentTab === "lp")
            return (
              <LPCard
                key={item.id}
                item={item}
                onStar={props.onStar}
                onCopy={props.onCopy}
                onClick={props.onClick}
                onEnrich={props.onEnrich}
              />
            );
          `;
code = code.replace(regex, replacement);

fs.writeFileSync('src/App.tsx', code);
