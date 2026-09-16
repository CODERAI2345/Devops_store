const fs = require('fs');

let content = fs.readFileSync('src/components/PipelineAnimation.tsx', 'utf-8');

// Add import for new icons
content = content.replace(
  /import \{ (.*) \} from "lucide-react";/,
  'import { $1 } from "lucide-react";\nimport { Route53Icon, WafIcon, AlbIcon, Ec2Icon, RdsIcon, ElastiCacheIcon } from "./AwsIcons";'
);

// Replace Route 53
content = content.replace(
  /<AwsNode title="Amazon Route 53" icon=\{<Globe className="w-5 h-5"\/>\}/,
  '<AwsNode title="Amazon Route 53" icon={<Route53Icon className="w-6 h-6"/>}'
);

// Replace WAF
content = content.replace(
  /<AwsNode title="AWS WAF" icon=\{<ShieldCheck className="w-5 h-5"\/>\}/,
  '<AwsNode title="AWS WAF" icon={<WafIcon className="w-6 h-6"/>}'
);

// Replace ALB
content = content.replace(
  /<AwsNode title="Application Load Balancer" icon=\{<Network className="w-5 h-5"\/>\}/,
  '<AwsNode title="Application Load Balancer" icon={<AlbIcon className="w-6 h-6"/>}'
);

// Replace EC2
content = content.replace(
  /<AwsNode title="Amazon EC2 \(App\)" icon=\{<Server className="w-5 h-5"\/>\}/g,
  '<AwsNode title="Amazon EC2 (App)" icon={<Ec2Icon className="w-6 h-6"/>}'
);

// Replace RDS
content = content.replace(
  /<AwsNode title="Amazon RDS \(Primary\)" icon=\{<Database className="w-5 h-5"\/>\}/,
  '<AwsNode title="Amazon RDS (Primary)" icon={<RdsIcon className="w-6 h-6"/>}'
);

// Replace ElastiCache
content = content.replace(
  /<AwsNode title="Amazon ElastiCache" icon=\{<Zap className="w-5 h-5"\/>\}/,
  '<AwsNode title="Amazon ElastiCache" icon={<ElastiCacheIcon className="w-6 h-6"/>}'
);

fs.writeFileSync('src/components/PipelineAnimation.tsx', content);
console.log('PipelineAnimation.tsx updated');
