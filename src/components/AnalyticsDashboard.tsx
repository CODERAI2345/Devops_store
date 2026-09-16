import React, { useEffect, useState } from "react";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Eye, Heart, MousePointer2, TrendingUp, Loader2 } from "lucide-react";

export function AnalyticsDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalViews: 0,
    totalLikes: 0,
    uniqueVisitors: 0,
    topCategories: [] as { name: string; count: number }[],
    recentActivity: [] as any[],
  });

  useEffect(() => {
    async function fetchAnalytics() {
      if (!db) return;
      try {
        const q = query(collection(db, "analytics"), orderBy("timestamp", "desc"), limit(200));
        const snapshot = await getDocs(q);
        const events = snapshot.docs.map(doc => doc.data());

        let views = 0;
        let likes = 0;
        const visitors = new Set();
        const categories: Record<string, number> = {};
        
        events.forEach(ev => {
          if (ev.sessionId) visitors.add(ev.sessionId);
          if (ev.eventType === 'view' || ev.eventType === 'copy') views++;
          if (ev.eventType === 'like') likes++;
          if (ev.category) {
            categories[ev.category] = (categories[ev.category] || 0) + 1;
          }
        });

        const sortedCats = Object.entries(categories)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        setStats({
          totalViews: views,
          totalLikes: likes,
          uniqueVisitors: visitors.size,
          topCategories: sortedCats,
          recentActivity: events.slice(0, 10)
        });
      } catch (err) {
        console.error("Error fetching analytics", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-[#A1A1AA]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-4 border-b border-[#27272A] pb-4">
        <h2 className="text-sm font-medium text-[#EDEDED]">Analytics & Insights</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#09090B] border border-[#27272A] rounded-md p-5 flex flex-col justify-between">
          <div className="text-[#A1A1AA] text-xs font-medium uppercase tracking-wider mb-2 flex items-center gap-2">
            <Eye className="w-4 h-4" /> Total Views
          </div>
          <div className="text-3xl font-bold text-[#EDEDED]">{stats.totalViews}</div>
        </div>
        
        <div className="bg-[#09090B] border border-[#27272A] rounded-md p-5 flex flex-col justify-between">
          <div className="text-[#A1A1AA] text-xs font-medium uppercase tracking-wider mb-2 flex items-center gap-2">
            <Heart className="w-4 h-4" /> Total Stars
          </div>
          <div className="text-3xl font-bold text-[#EDEDED]">{stats.totalLikes}</div>
        </div>

        <div className="bg-[#09090B] border border-[#27272A] rounded-md p-5 flex flex-col justify-between">
          <div className="text-[#A1A1AA] text-xs font-medium uppercase tracking-wider mb-2 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" /> Unique Visitors
          </div>
          <div className="text-3xl font-bold text-[#EDEDED]">{stats.uniqueVisitors}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-[#09090B] border border-[#27272A] rounded-md p-5">
          <h3 className="text-sm font-medium text-[#EDEDED] mb-4">Top Categories</h3>
          {stats.topCategories.length === 0 ? (
            <div className="text-sm text-[#71717A]">No category data yet.</div>
          ) : (
            <div className="space-y-4">
              {stats.topCategories.map((cat, i) => (
                <div key={i} className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#EDEDED] capitalize">{cat.name}</span>
                    <span className="text-[#A1A1AA]">{cat.count}</span>
                  </div>
                  <div className="w-full bg-[#27272A] rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-[#EDEDED] h-full rounded-full" 
                      style={{ width: `${Math.max(10, (cat.count / stats.topCategories[0].count) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-[#09090B] border border-[#27272A] rounded-md p-5">
          <h3 className="text-sm font-medium text-[#EDEDED] mb-4">Recent Activity</h3>
          {stats.recentActivity.length === 0 ? (
            <div className="text-sm text-[#71717A]">No recent activity.</div>
          ) : (
            <div className="space-y-3">
              {stats.recentActivity.map((ev, i) => (
                <div key={i} className="flex items-start gap-3 text-sm border-b border-[#27272A]/50 pb-3 last:border-0 last:pb-0">
                  <div className="mt-0.5 text-[#71717A]">
                    {ev.eventType === 'like' ? <Heart className="w-4 h-4" /> : <MousePointer2 className="w-4 h-4" />}
                  </div>
                  <div className="flex-1">
                    <div className="text-[#EDEDED]">
                      Someone {ev.eventType === 'like' ? 'starred' : 'viewed'} <span className="font-medium text-white">{ev.itemTitle || ev.category || 'an item'}</span>
                    </div>
                    {ev.timestamp && (
                      <div className="text-xs text-[#71717A] mt-0.5">
                        {new Date(ev.timestamp.seconds * 1000).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
