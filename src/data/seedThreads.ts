import { THItem } from "../types";

export const SEED_THREADS_ITEMS: THItem[] = [
  {
    id: 99001,
    type: "th",
    url: "https://www.threads.net/@cloudarchitect/post/C-multi-photo-eks",
    title: "AWS High Availability & Kubernetes Production Blueprint",
    author: "cloudarchitect",
    heading: "Cloud Architecture",
    description: "Breaking down our production AWS + Kubernetes architecture into 4 visual blueprints:\n\n1. Multi-AZ VPC setup with ALB & WAF layer\n2. EKS cluster ingress & node pool topology\n3. Terraform infrastructure-as-code deployment pipeline\n4. Observability metrics stack with Prometheus & Grafana\n\nSwipe horizontally to inspect each architectural layer! 🚀",
    thumbnail: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
    ],
    media: [
      {
        url: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=1200&q=80",
        type: "image",
        alt: "Multi-AZ AWS Architecture"
      },
      {
        url: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=1200&q=80",
        type: "image",
        alt: "Kubernetes Cluster Topology"
      },
      {
        url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
        type: "image",
        alt: "Data Pipeline & Terraform State"
      },
      {
        url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
        type: "image",
        alt: "Prometheus Monitoring Dashboard"
      }
    ],
    tags: ["aws", "kubernetes", "devops", "cloud"],
    date: "Sep 15, 2026",
    ts: Date.now() - 1000 * 60 * 60 * 2,
    starred: true,
  },
  {
    id: 99002,
    type: "th",
    url: "https://www.threads.net/@devops_daily/post/C-video-canary-demo",
    title: "Automated Zero-Downtime Blue/Green Canary Deployments",
    author: "devops_daily",
    heading: "DevOps & CI/CD",
    description: "Watch our automated Blue/Green Canary pipeline in action! Live traffic splitting with Argo Rollouts and automated rollback triggers if error rates spike above 0.5%. Tap to play and listen to the audio walkthrough!",
    thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    media: [
      {
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        type: "video",
        thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
        alt: "Canary Deployment Video Demo"
      }
    ],
    tags: ["cicd", "argocd", "kubernetes", "devops"],
    date: "Sep 14, 2026",
    ts: Date.now() - 1000 * 60 * 60 * 6,
    starred: false,
  },
  {
    id: 99003,
    type: "th",
    url: "https://www.threads.net/@sre_insights/post/C-mixed-carousel-postmortem",
    title: "SRE Incident Postmortem: Distributed Cache Failover",
    author: "sre_insights",
    heading: "SRE Engineering",
    description: "Full postmortem of yesterday's latency anomaly: Slide 1 shows the Grafana p99 latency spike, Slide 2 is a video clip of the automated failover execution, and Slide 3 displays the recovered cluster memory stats. Swipe through!",
    thumbnail: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=1200&q=80",
    media: [
      {
        url: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=1200&q=80",
        type: "image",
        alt: "Initial Latency Spike Grafana"
      },
      {
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
        type: "video",
        thumbnail: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=1200&q=80",
        alt: "Sentinel Failover Video Execution"
      },
      {
        url: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80",
        type: "image",
        alt: "Cluster Stabilization Metrics"
      }
    ],
    tags: ["sre", "reliability", "redis", "monitoring"],
    date: "Sep 13, 2026",
    ts: Date.now() - 1000 * 60 * 60 * 12,
    starred: true,
  }
];
