import { PipelineAnimation } from "./components/PipelineAnimation";
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, Suspense, lazy } from "react";
import {
  Search,
  Check,
  X,
  Star,
  Loader2,
  Settings,
  Trash2,
  ExternalLink,
  ArrowLeft,
  Upload,
  LogOut,
  Download,
  Link as LinkIcon,
  Armchair,
  PlayCircle,
  Linkedin,
  FileText,
  Mail,
  User,
  LayoutGrid,
  Menu,
  Sparkles,
  Twitter,
  Database,
  Youtube,
  Github,
  Instagram,
  Plus,
} from "lucide-react";
import { YTCard, YPLCard, YSCard, LICard, LPCard, BlogCard, EmailCard, TWCard, GitCard, IGCard } from "./components/Cards";
import { Modal } from "./components/Modal";
import { useCentralHub } from "./hooks/useCentralHub";
import { ItemType, HubItem } from "./types";
// Removed gemini import
import { parseSlug, classifyUrl, ytId, ytPlaylistId, extractEmailDetails, guessCategoryFromUrl, extractTopicFromLinkedInUrl, extractLinkedInAuthor, extractTwitterUsername, extractInstagramShortcode } from "./utils";
import * as XLSX from "xlsx";

const JOB_ROLES = [
  "Cloud",
  "Backend",
  "Frontend",
  "Fullstack",
  "Mobile Dev",
  "DevOps",
  "Data Science",
  "Data Engineering",
  "UI/UX Design",
  "Product Management",
  "QA / Testing",
  "Security",
  "HR / Recruiting",
  "Sales / Marketing",
  "Other"
];

import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
const LandingPage = lazy(() => import('./components/LandingPage'));

function MainApp() {
  const navigate = useNavigate();
  const location = useLocation();
  const view = location.pathname.startsWith("/admin/dashboard") ? "admin" : location.pathname === "/feed" ? "feed" : "landing";
  const setView = (v: string) => navigate(v === "landing" ? "/" : v === "admin" ? "/admin/dashboard" : `/${v}`);

  const {
    db,
    currentTab,
    setCurrentTab,
    searchQuery,
    setSearchQuery,
    searchDate,
    setSearchDate,
    showStarredOnly,
    setShowStarredOnly,
    isInitialLoading,
    addItem,
    deleteItem,
    toggleStar,
    updateItem,
    toastMsg,
    showToast,
  } = useCentralHub();

  const [selectedItem, setSelectedItem] = useState<HubItem | null>(null);
  const [modalDefaultEditing, setModalDefaultEditing] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [selectedLPTag, setSelectedLPTag] = useState("");
  const [addInput, setAddInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [adminTab, setAdminTab] = useState<ItemType>("yt");
  const [manualProfile, setManualProfile] = useState({ image: "", url: "" });
  const [manualScreenshot, setManualScreenshot] = useState({
    image: "",
    imageUrl: "",
    url: "",
    company: "",
    profileName: "",
    description: "",
  });
  const [manualBlog, setManualBlog] = useState({
    title: "",
    url: "",
    platform: "",
    description: "",
    thumbnail: "",
  });
  const [manualEmail, setManualEmail] = useState({
    company: "",
    email: "",
    logo: "",
    notes: "",
    role: "",
  });
  const [isBulkEmail, setIsBulkEmail] = useState(false);
  const [bulkEmailText, setBulkEmailText] = useState("");
  const [bulkRole, setBulkRole] = useState("");

  // Auth State
  const [isAdminAuth, setIsAdminAuth] = useState(() => localStorage.getItem("adminAuth") === "true");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  };

  const handleLogin = () => {
    const validEmail = import.meta.env.VITE_ADMIN_EMAIL || "admin@gmail.com";
    const validPass = import.meta.env.VITE_ADMIN_PASSWORD || "26081998";

    if (loginEmail.trim() === validEmail.trim() && loginPass.trim() === validPass.trim()) {
      setIsAdminAuth(true);
      localStorage.setItem("adminAuth", "true");
      setLoginEmail("");
      setLoginPass("");
      showToast("Logged in successfully!");
    } else {
      showToast("Invalid credentials", true);
    }
  };

  const handleLogout = () => {
    setIsAdminAuth(false);
    localStorage.removeItem("adminAuth");
    setView("feed");
    showToast("Logged out");
  };

  const handleExport = () => {
    const allData = [
      ...db.yt.map((item) => ({ Category: "YouTube", ...item })),
      ...db.ys.map((item) => ({ Category: "Shorts", ...item })),
      ...db.li.map((item) => ({ Category: "LinkedIn Profile", ...item })),
      ...db.lp.map((item) => ({ Category: "LinkedIn Post", ...item })),
      ...db.blog.map((item) => ({ Category: "Blog", ...item })),
      ...db.email.map((item) => ({ Category: "Email", ...item })),
    ];

    if (allData.length === 0) {
      showToast("No data to export", true);
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(allData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, "CentralHub_Export.xlsx");
    showToast("Data exported successfully!");
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 400;
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          const resizedBase64 = canvas.toDataURL("image/jpeg", 0.6);
          setManualScreenshot((prev) => ({ ...prev, image: resizedBase64 }));
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScreenshotSubmit = async () => {
    if (!manualScreenshot.url) {
      showToast("LinkedIn URL is required", true);
      return;
    }
    if (adminTab === "li" && !manualScreenshot.imageUrl) {
      showToast("Image URL is required for profiles", true);
      return;
    }
    setLoading(true);
    try {
      const id = Date.now() + Math.random();
      const date = new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

      let item: any = {
        id,
        type: adminTab,
        date,
        ts: id,
        starred: false,
        url: String(manualScreenshot.url).substring(0, 1990),
        thumbnail: manualScreenshot.imageUrl || "",
        description: manualScreenshot.description || "",
        tags: [],
        company: manualScreenshot.company || "",
      };

      if (adminTab === "lp") {
        item.heading = manualScreenshot.profileName || guessCategoryFromUrl(manualScreenshot.url) || extractTopicFromLinkedInUrl(manualScreenshot.url) || "";
        item.title = "LinkedIn Post";
        item.author = extractLinkedInAuthor(manualScreenshot.url) || "LinkedIn Post";
      } else {
        item.title = manualScreenshot.profileName || manualScreenshot.url;
        item.author = "Professional";
      }

      await addItem(adminTab, item);
      showToast(
        `${adminTab === "lp" ? "Post" : "Profile"} added successfully!`,
      );
      setManualScreenshot({ image: "", imageUrl: "", url: "", company: "", profileName: "", description: "" });
    } catch (e) {
      console.error(e);
      showToast("Failed to save data", true);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchBlogDetails = async () => {
    if (!manualBlog.url) {
      showToast("Please enter a URL first", true);
      return;
    }
    setLoading(true);
    showToast("Fetching blog details...");
    try {
      const res = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(manualBlog.url)}`);
      const d = await res.json();
      setManualBlog(prev => ({
        ...prev,
        title: d.data?.title || prev.title,
        platform: d.data?.publisher || prev.platform,
        description: d.data?.description || prev.description,
        thumbnail: d.data?.image?.url || d.data?.logo?.url || `https://image.thum.io/get/width/1200/crop/675/${manualBlog.url}`
      }));
      showToast("Details fetched!");
    } catch (err) {
      setManualBlog(prev => ({
        ...prev,
        thumbnail: prev.thumbnail || `https://image.thum.io/get/width/1200/crop/675/${manualBlog.url}`
      }));
      showToast("Could not fetch details, used fallback image.", true);
    } finally {
      setLoading(false);
    }
  };

  const handleManualBlogSubmit = async () => {
    if (!manualBlog.title || !manualBlog.url) {
      showToast("Title and URL are required", true);
      return;
    }
    setLoading(true);
    try {
      const id = Date.now() + Math.random();
      const date = new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

      await addItem("blog", {
        id,
        type: "blog",
        date,
        ts: id,
        starred: false,
        title: manualBlog.title,
        url: manualBlog.url,
        platform: manualBlog.platform,
        description: manualBlog.description,
        thumbnail: manualBlog.thumbnail,
        author: "",
        tags: [],
      } as any);

      showToast("Blog added successfully!");
      setManualBlog({
        title: "",
        url: "",
        platform: "",
        description: "",
        thumbnail: "",
      });
    } catch (e) {
      console.error(e);
      showToast("Failed to save blog", true);
    } finally {
      setLoading(false);
    }
  };

  const handleManualEmailSubmit = async () => {
    if (!manualEmail.company || !manualEmail.email) {
      showToast("Company and Email are required", true);
      return;
    }
    setLoading(true);
    try {
      const id = Date.now() + Math.random();
      const date = new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

      await addItem(adminTab, {
        id,
        type: adminTab,
        date,
        ts: id,
        starred: false,
        title: manualEmail.company,
        url: `mailto:${manualEmail.email}`,
        email: manualEmail.email,
        company: manualEmail.company,
        description: manualEmail.notes,
        thumbnail: "",
        role: manualEmail.role,
        author: "",
        tags: [],
      } as any);

      showToast("Email added successfully!");
      setManualEmail({
        company: "",
        email: "",
        logo: "",
        notes: "",
        role: "",
      });
    } catch (e) {
      console.error(e);
      showToast("Failed to save email", true);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkEmailSubmit = async () => {
    if (!bulkEmailText.trim()) {
      showToast("Please enter some emails", true);
      return;
    }
    setLoading(true);
    try {
      const lines = bulkEmailText.split("\n").map(l => l.trim()).filter(Boolean);
      let count = 0;
      
      const date = new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

      for (const line of lines) {
        let company = "";
        let email = line;
        let thumbnail = "";
        
        if (line.includes(",")) {
          const parts = line.split(",");
          company = parts[0].trim();
          email = parts[parts.length - 1].trim();
          const details = extractEmailDetails(email);
          if (!company) company = details.company || (email.split("@")[0] || email);
        } else {
          email = line;
          const details = extractEmailDetails(email);
          company = details.company || (email.split("@")[0] || email);
        }

        const id = Date.now() + Math.random();
        await addItem(adminTab, {
          id,
          type: adminTab,
          date,
          ts: id,
          starred: false,
          title: company,
          url: `mailto:${email}`,
          email: email,
          company: company,
          role: bulkRole,
          description: "",
          thumbnail: thumbnail,
          author: "",
          tags: [],
        } as any);
        count++;
      }
      showToast(`Added ${count} emails successfully!`);
      setBulkEmailText("");
      setBulkRole("");
      setIsBulkEmail(false);
    } catch (e) {
      console.error(e);
      showToast("Failed to save bulk emails", true);
    } finally {
      setLoading(false);
    }
  };

  const handleAutoFillDetails = async () => {
    if (adminTab !== "email" ) return;
    const items = db[adminTab];
    let count = 0;
    
    setLoading(true);
    try {
      for (const item of items) {
        if (item.email) {
          const details = extractEmailDetails(item.email);
          let updates: any = {};
          if (!item.company && details.company) updates.company = details.company;
          if (!item.title && details.company) updates.title = details.company;
          
          if (Object.keys(updates).length > 0) {
            await updateItem(adminTab, item.id, updates);
            count++;
          }
        }
      }
      if (count > 0) {
        showToast(`Auto-filled details for ${count} contacts.`);
      } else {
        showToast(`All contacts already have details or couldn't be auto-filled.`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddLink = async () => {
    let url = addInput.trim();
    if (!url) {
      showToast("Please enter a link", true);
      return;
    }

    if (!/^https?:\/\//i.test(url) && !/^mailto:/i.test(url)) {
      url = "https://" + url;
    }

    setLoading(true);
    const t = classifyUrl(url) || (view === "admin" ? adminTab : currentTab);
    showToast("Fetching metadata...");

    try {
      let meta: any = {
        url,
        title:
          t === "yt" ? "YouTube Video" : t === "ys" ? "YouTube Short" : t === "ypl" ? "YouTube Playlist" : "Link",
        author: "",
      };

      if (t === "yt" || t === "ys") {
        const vid = ytId(url);
        if (vid) {
          const res = await fetch(
            `https://noembed.com/embed?url=${encodeURIComponent(url)}`,
          );
          const d = await res.json();
          meta = {
            ...meta,
            title: d.title || (t === "ys" ? "YouTube Short" : "YouTube Video"),
            author: d.author_name || "",
            thumbnail: `https://img.youtube.com/vi/${vid}/mqdefault.jpg`,
            vid,
          };
        } else {
          meta.title = url;
        }
      } else if (t === "ypl") {
        const pid = ytPlaylistId(url);
        if (pid) {
          const res = await fetch(
            `https://api.allorigins.win/get?url=${encodeURIComponent(`https://www.youtube.com/oembed?url=${url}&format=json`)}`,
          );
          const d = await res.json();
          let parsed = { title: "", author_name: "", thumbnail_url: "" };
          try {
            if (d.contents) {
              parsed = JSON.parse(d.contents);
            }
          } catch (e) {}
          meta = {
            ...meta,
            title: parsed.title || "YouTube Playlist",
            author: parsed.author_name || "",
            thumbnail: parsed.thumbnail_url || "",
            pid,
            count: 0,
          };
        } else {
          meta.title = url;
        }
      } else if (t === "blog") {
        try {
          const res = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(url)}`);
          const d = await res.json();
          meta = {
            ...meta,
            title: d.data?.title || url,
            platform: d.data?.publisher || "",
            description: d.data?.description || "",
            thumbnail: d.data?.image?.url || d.data?.logo?.url || `https://image.thum.io/get/width/1200/crop/675/${url}`,
            tags: [],
            author: d.data?.author || "",
          };
        } catch (err) {
          meta = {
            ...meta,
            title: url,
            platform: "",
            description: "",
            tags: [],
            author: "",
          };
        }
      } else if (t === "tw") {
        try {
          const res = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(url)}`);
          const d = await res.json();
          const textContent = d.data?.description || d.data?.title || "";
          const handle = extractTwitterUsername(url) || d.data?.author || "@TwitterUser";
          const heading = guessCategoryFromUrl(url) || guessCategoryFromUrl(textContent) || "";
          meta = {
            ...meta,
            title: d.data?.title || textContent || "Twitter/X Post",
            author: d.data?.author || handle,
            handle: handle,
            heading: heading,
            description: d.data?.description || "",
            thumbnail: d.data?.image?.url || "",
            tags: heading ? [heading.toLowerCase()] : [],
          };
        } catch (err) {
          const handle = extractTwitterUsername(url) || "@TwitterUser";
          const heading = guessCategoryFromUrl(url) || "";
          meta = {
            ...meta,
            title: "Twitter/X Post",
            author: handle,
            handle: handle,
            heading: heading,
            description: "",
            thumbnail: "",
            tags: heading ? [heading.toLowerCase()] : [],
          };
        }
      } else if (t === "ig") {
        const shortcode = extractInstagramShortcode(url) || "";
        try {
          const res = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(url)}`);
          const d = await res.json();
          meta = {
            ...meta,
            title: d.data?.title || "Instagram Post",
            author: d.data?.author || "Instagram",
            description: d.data?.description || "Embedded Instagram Content",
            thumbnail: d.data?.image?.url || "",
            shortcode,
            tags: [],
          };
        } catch (e) {
          meta = {
            ...meta,
            title: "Instagram Post",
            author: "Instagram",
            description: "Embedded Instagram Content",
            thumbnail: "",
            shortcode,
            tags: [],
          };
        }
      } else if (t === "lp" || t === "li") {
        try {
          const res = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(url)}`);
          const d = await res.json();
          const pageTitle = d.data?.title || "";
          const desc = d.data?.description || "";
          
          if (t === "li") {
            // LinkedIn Profile Scraper
            let name = d.data?.author || "";
            let role = "";
            let company = "";
            
            if (pageTitle) {
              const cleanTitle = pageTitle.replace(/\s*\|\s*LinkedIn/i, "").trim();
              const parts = cleanTitle.split(/\s*-\s*/);
              if (parts.length > 0 && !name) {
                name = parts[0];
              }
              if (parts.length > 1) {
                role = parts[1];
              }
              if (parts.length > 2) {
                company = parts[2];
              }
            }
            
            if (!name) {
              name = extractLinkedInAuthor(url) || "LinkedIn Member";
            }
            
            meta = {
              ...meta,
              title: name,
              author: name,
              description: desc || `LinkedIn Profile of ${name}`,
              thumbnail: d.data?.image?.url || d.data?.logo?.url || "",
              company: company || "",
              role: role || "",
              location: d.data?.location || "",
            };
          } else {
            // LinkedIn Post Scraper
            const textContent = desc || pageTitle || "";
            const author = d.data?.author || extractLinkedInAuthor(url) || "LinkedIn Creator";
            const heading = guessCategoryFromUrl(url) || guessCategoryFromUrl(textContent) || "";
            meta = {
              ...meta,
              title: pageTitle || textContent || "LinkedIn Post",
              author: author,
              description: desc || "",
              thumbnail: d.data?.image?.url || d.data?.logo?.url || "",
              heading: heading,
              company: d.data?.publisher || "",
              tags: heading ? [heading.toLowerCase()] : [],
            };
          }
        } catch (err) {
          if (t === "li") {
            const name = extractLinkedInAuthor(url) || "LinkedIn Member";
            meta = {
              ...meta,
              title: name,
              author: name,
              description: "LinkedIn Profile",
              thumbnail: "",
              company: "",
              role: "",
              location: "",
            };
          } else {
            const author = extractLinkedInAuthor(url) || "LinkedIn Creator";
            const heading = guessCategoryFromUrl(url) || "";
            meta = {
              ...meta,
              title: "LinkedIn Post",
              author: author,
              description: "",
              thumbnail: "",
              heading: heading,
              tags: heading ? [heading.toLowerCase()] : [],
            };
          }
        }
      } else if (t === "git") {
        try {
          const m = url.match(/github\.com\/([^/]+)\/([^/?#]+)/i);
          if (m) {
            const owner = m[1];
            const repo = m[2];
            const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
            if (!res.ok) throw new Error("Failed to fetch GitHub API");
            const d = await res.json();
            meta = {
              ...meta,
              title: d.full_name || `${owner}/${repo}`,
              author: owner,
              description: d.description || "",
              thumbnail: d.owner?.avatar_url || "",
              stars: d.stargazers_count || 0,
              forks: d.forks_count || 0,
              language: d.language || "",
              topics: d.topics || [],
            };
          } else {
             throw new Error("Not a GitHub repo");
          }
        } catch (err) {
          meta = {
            ...meta,
            title: url,
            author: "",
            description: "",
            thumbnail: "",
            stars: 0,
            forks: 0,
            language: "",
            topics: [],
          };
        }
      } else {
        meta = {
          ...meta,
          title: url.substring(0, 490),
          author: "",
          description: "",
          tags: [],
          company: "",
          location: "",
          role: "",
        };
      }

      const id = Date.now() + Math.random();
      const date = new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

      const item: any = {
        id,
        type: t,
        url: meta.url,
        date,
        ts: id,
        title: meta.title,
        author: meta.author,
        thumbnail: meta.thumbnail || "",
        description: meta.description || "",
        tags: meta.tags || [],
        starred: false,
        company: meta.company || "",
        location: meta.location || "",
        role: meta.role || "",
        platform: meta.platform || "",
        handle: meta.handle || "",
        heading: meta.heading || "",
      };
      if (t === "yt" || t === "ys") item.vid = meta.vid || ytId(url);
      if (t === "ypl") item.pid = meta.pid || ytPlaylistId(url);
      if (t === "git") {
        item.stars = meta.stars ?? 0;
        item.forks = meta.forks ?? 0;
        item.language = meta.language ?? "";
        item.topics = meta.topics ?? [];
      }

      if (t === "ig") item.shortcode = meta.shortcode || "";
      await addItem(t, item);
      showToast("Link added successfully!");
      setAddInput("");
      if (view !== "admin") {
        setCurrentTab(t);
      } else {
        setAdminTab(t);
      }
      if (t === "ig") {
        setModalDefaultEditing(true);
        setSelectedItem(item);
      }
    } catch (e) {
      console.error(e);
      const id = Date.now() + Math.random();
      const date = new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      await addItem(t, {
        id,
        type: t,
        url,
        date,
        ts: id,
        title: url,
        author: "",
        thumbnail: "",
        description: "",
        tags: [],
        starred: false,
        vid: t === "yt" || t === "ys" ? ytId(url) || null : null,
        pid: t === "ypl" ? ytPlaylistId(url) || null : null,
      } as any);
      showToast("Added link (metadata fetch failed)");
      setAddInput("");
      if (view !== "admin") {
        setCurrentTab(t);
      } else {
        setAdminTab(t);
      }
    }
    setLoading(false);
  };

  const handleEnrich = async (type: ItemType, id: number | string) => {
      showToast("Enrichment is disabled", true);
  };

  const renderFeed = (tabToRender: ItemType) => {
    if (isInitialLoading) {
      return (
        <div className="py-32 flex flex-col items-center justify-center text-white/50">
          <Loader2 className="w-8 h-8 animate-spin mb-4 text-orange-500" />
          <p className="font-medium tracking-wide">Syncing your hub...</p>
        </div>
      );
    }

    const q = searchQuery.toLowerCase();
    let items = db[tabToRender];

    if (showStarredOnly) {
      items = items.filter((x) => x.starred) as any;
    }

    if (tabToRender === "lp" && selectedLPTag) {
      items = items.filter((x: any) => x.heading?.toLowerCase().includes(selectedLPTag.toLowerCase()) || x.title?.toLowerCase().includes(selectedLPTag.toLowerCase())) as any;
    }

    if (searchDate) {
      items = items.filter((x) => {
        if (!x.ts) return false;
        const d = new Date(x.ts);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}` === searchDate;
      }) as any;
    }

    if (q) {
      items = items.filter((x) => {
        const searchableFields = [
          x.title,
          x.author,
          x.description,
          (x as any).company,
          (x as any).role,
          x.url,
          (x as any).heading,
          x.date,
          (x as any).platform,
          (x as any).handle,
          (x as any).location,
          (x as any).postType,
        ];
        
        if (Array.isArray((x as any).topics)) searchableFields.push(...(x as any).topics);
        if (Array.isArray((x as any).tags)) searchableFields.push(...(x as any).tags);
        if (Array.isArray((x as any).skills)) searchableFields.push(...(x as any).skills);

        return searchableFields.some(
          (s) => s && typeof s === 'string' && s.toLowerCase().includes(q)
        );
      }) as any;
    }

    if (!items.length) {
      return (
        <div className="text-center py-32 text-white/30 border border-white/5 border-dashed rounded-2xl bg-white/[0.02]">
          <LayoutGrid className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p className="font-medium tracking-wide">No content found</p>
          <p className="text-sm mt-1">Try adjusting your filters or search query.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
        {items.map((item: any) => {
          const props = {
            item,
            onStar: () => toggleStar(tabToRender, item.id),
            onDelete: () => deleteItem(tabToRender, item.id),
            onCopy: () => {
              if (tabToRender === "li" && item.title && item.title !== "LinkedIn Member" && !item.title.startsWith("http")) {
                let copyText = item.title;
                if (item.company) {
                  copyText += ` - ${item.company}`;
                }
                navigator.clipboard.writeText(copyText);
                showToast("Profile details copied!");
                return;
              }
              navigator.clipboard.writeText(item.url);
              showToast("Link copied!");
            },
            onClick: () => setSelectedItem(item),
            onEnrich:
              tabToRender === "lp" || tabToRender === "li"
                ? () => {
                    handleEnrich(tabToRender, item.id);
                  }
                : undefined,
          };
          if (tabToRender === "yt")
            return (
              <YTCard
                key={item.id}
                item={item}
                onStar={props.onStar}
                onCopy={props.onCopy}
                onClick={props.onClick}
                onDelete={props.onDelete}
                onEnrich={props.onEnrich}
              />
            );
          if (tabToRender === "ypl")
            return (
              <YPLCard
                key={item.id}
                item={item}
                onStar={props.onStar}
                onCopy={props.onCopy}
                onClick={props.onClick}
                onDelete={props.onDelete}
                onEnrich={props.onEnrich}
              />
            );
          if (tabToRender === "ys")
            return (
              <YSCard
                key={item.id}
                item={item}
                onStar={props.onStar}
                onCopy={props.onCopy}
                onClick={props.onClick}
                onDelete={props.onDelete}
                onEnrich={props.onEnrich}
              />
            );
          if (tabToRender === "lp")
            return (
              <LPCard
                key={item.id}
                item={item}
                onStar={props.onStar}
                onCopy={props.onCopy}
                onClick={props.onClick}
                onDelete={props.onDelete}
                onEnrich={props.onEnrich}
              />
            );
          if (tabToRender === "li")
            return (
              <LICard
                key={item.id}
                item={item}
                onStar={props.onStar}
                onCopy={props.onCopy}
                onClick={props.onClick}
                onDelete={props.onDelete}
                onEnrich={props.onEnrich}
              />
            );
          if (tabToRender === "blog")
            return (
              <BlogCard
                key={item.id}
                item={item}
                onStar={props.onStar}
                onCopy={props.onCopy}
                onClick={props.onClick}
                onDelete={props.onDelete}
              />
            );
          if (tabToRender === "email" )
            return (
              <EmailCard
                key={item.id}
                item={item}
                onStar={props.onStar}
                onCopy={props.onCopy}
                onClick={props.onClick}
                onDelete={props.onDelete}
              />
            );
          if (tabToRender === "tw")
            return (
              <TWCard
                key={item.id}
                item={item}
                onStar={props.onStar}
                onCopy={props.onCopy}
                onClick={props.onClick}
                onDelete={props.onDelete}
                onEnrich={props.onEnrich}
                showToast={showToast}
              />
            );
          if (tabToRender === "ig")
            return (
              <IGCard
                key={item.id}
                item={item}
                onStar={props.onStar}
                onCopy={props.onCopy}
                onClick={props.onClick}
                onDelete={props.onDelete}
              />
            );
          if (tabToRender === "git")
            return (
              <GitCard
                key={item.id}
                item={item}
                onStar={props.onStar}
                onCopy={props.onCopy}
                onClick={props.onClick}
                onDelete={props.onDelete}
              />
            );
          return (
            <LPCard
              key={item.id}
              item={item}
              onStar={props.onStar}
              onCopy={props.onCopy}
              onClick={props.onClick}
                onDelete={props.onDelete}
              onEnrich={props.onEnrich}
            />
          );
        })}
      </div>
    );
  };

  if (view === "admin") {
    if (!isAdminAuth) {
      return (
        <div className="fixed inset-0 bg-gradient-to-b from-[#0B0F19] to-[#050810] text-white flex items-center justify-center p-4">
          <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
             <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]" />
          </div>
          
          <div className="bg-[#111] border border-white/10 p-8 rounded-3xl w-full max-w-sm shadow-[0_20px_60px_rgba(0,0,0,0.8)] transform transition-all scale-100 animate-fade-in-up relative z-10">
            <div className="flex items-center justify-between mb-6">
                 <h2 className="text-2xl font-display font-bold text-white">Admin Login</h2>
                 <button onClick={() => setView("landing")} className="text-white/40 hover:text-white transition-colors bg-white/5 rounded-full p-2">
                     <X className="w-4 h-4" />
                 </button>
            </div>
              
            <p className="text-white/50 text-sm mb-6">Enter your credentials to access the management dashboard.</p>
              
            <div className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="Email Address"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder-white/30 focus:outline-none focus:border-orange-500/50 transition-all"
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
              <input
                type="password"
                placeholder="Secret Key"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder-white/30 focus:outline-none focus:border-orange-500/50 transition-all"
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
              <button
                onClick={handleLogin}
                className="w-full mt-2 py-4 bg-white text-black hover:bg-gray-200 font-semibold rounded-xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              >
                Authenticate
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0B0F19] to-[#050810] text-white font-sans relative z-0 flex">
        {/* Abstract Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]" />
        </div>

        {/* Sidebar */}
        <div className="w-64 border-r border-white/10 bg-black/40 backdrop-blur-md hidden md:flex flex-col relative z-10 sticky top-0 h-screen">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <div className="font-display font-bold text-xl flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-gradient-to-br from-orange-400 to-blue-500 flex items-center justify-center">
                       <LinkIcon className="w-3 h-3 text-white" />
                    </div>
                    Admin
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
                <div className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 mt-4 px-2">Content Types</div>
                {(["yt", "ypl", "ys", "lp", "tw", "ig", "blog", "email", "git"] as ItemType[]).map((t) => (
                    <button
                        key={t}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${adminTab === t ? "bg-orange-500/10 text-orange-400 border border-orange-500/20" : "text-white/60 hover:text-white hover:bg-white/5 border border-transparent"}`}
                        onClick={() => setAdminTab(t)}
                    >
                        {t === "yt" && <PlayCircle className="w-4 h-4" />}
                        {t === "ypl" && <PlayCircle className="w-4 h-4 text-red-400" />}
                        {t === "ys" && <PlayCircle className="w-4 h-4" />}
                        {t === "lp" && <Linkedin className="w-4 h-4" />}
                        {t === "tw" && <Twitter className="w-4 h-4 text-sky-400" />}
                        {t === "ig" && <Instagram className="w-4 h-4 text-pink-400" />}
                        {t === "blog" && <FileText className="w-4 h-4" />}
                        {t === "email" && <Mail className="w-4 h-4" />}
                        
                        {t === "git" && <Github className="w-4 h-4 text-slate-400" />}
                        
                        {t === "yt" ? "YouTube" : t === "ypl" ? "Playlists" : t === "ys" ? "Shorts" : t === "lp" ? "LinkedIn Posts" : t === "tw" ? "Twitter/X" : t === "ig" ? "Instagram" : t === "blog" ? "Blogs" : t === "email" ? "Emails" : t === "git" ? "GitHub" : ""}
                    </button>
                ))}
            </div>
            
            <div className="p-4 border-t border-white/10 space-y-2">
                 <button
                    onClick={() => navigate("/admin/export")}
                    className="w-full flex items-center gap-2 px-3 py-2 text-white/60 hover:text-orange-400 hover:bg-orange-500/10 rounded-lg text-sm font-medium transition-colors"
                >
                    <Download className="w-4 h-4" /> Export Data
                </button>
                {deferredPrompt && (
                  <button
                    onClick={handleInstall}
                    className="w-full flex items-center gap-2 px-3 py-2 text-white/60 hover:text-orange-400 hover:bg-orange-500/10 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Download className="w-4 h-4" /> Install App
                  </button>
                )}
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-white/60 hover:text-red-400 hover:bg-red-500/10 rounded-lg text-sm font-medium transition-colors"
                >
                    <LogOut className="w-4 h-4" /> Logout
                </button>
            </div>
        </div>

        <div className="flex-1 relative z-10 max-h-screen overflow-y-auto">
          {/* Mobile Admin Header */}
          <div className="md:hidden p-4 border-b border-white/10 flex items-center justify-between bg-black/40 backdrop-blur-md sticky top-0 z-20">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setView("feed")}
                className="text-white/60 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <span className="font-display font-semibold">Admin</span>
            </div>
             <div className="flex items-center gap-3">
               {deferredPrompt && (
                 <button
                    onClick={handleInstall}
                    className="text-white/60 hover:text-orange-400 transition-colors"
                 >
                    <Download className="w-5 h-5" />
                 </button>
               )}
               <button
                  onClick={handleLogout}
                  className="text-white/60 hover:text-red-400 transition-colors"
               >
                  <LogOut className="w-5 h-5" />
               </button>
             </div>
          </div>
          
          <div className="p-6 md:p-10 max-w-4xl mx-auto">
             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                 <div>
                     <h1 className="text-3xl font-display font-bold">Manage Content</h1>
                     <p className="text-white/50 mt-1">Add, update, or remove items from your hub.</p>
                 </div>
                 
                 <div className="flex items-center gap-3">
                   <button
                       onClick={() => {
                           setAdminTab(currentTab);
                           setShowAdminModal(true);
                       }}
                       className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 via-red-500 to-orange-400 hover:from-orange-400 hover:to-red-400 text-black font-semibold rounded-full text-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                   >
                       <Plus className="w-4 h-4 text-black stroke-[3]" />
                       <span>Save Link / Quick Add</span>
                   </button>
                   <button
                      onClick={() => setView("feed")}
                      className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm font-medium transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back to Hub
                    </button>
                 </div>
             </div>
             
             {/* Mobile Tabs */}
             <div className="md:hidden flex overflow-x-auto gap-2 pb-4 mb-6 no-scrollbar">
                {(["yt", "ypl", "ys", "lp", "tw", "ig", "blog", "email", "git"] as ItemType[]).map((t) => (
                  <button
                    key={t}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap border ${adminTab === t ? "bg-orange-500/10 text-orange-400 border-orange-500/20" : "bg-white/5 text-white/60 border-white/10"}`}
                    onClick={() => setAdminTab(t)}
                  >
                    {t === "yt" ? "YouTube" : t === "ypl" ? "Playlists" : t === "ys" ? "Shorts" : t === "lp" ? "LinkedIn Post" : t === "tw" ? "Twitter/X" : t === "ig" ? "Instagram" : t === "blog" ? "Blogs" : t === "email" ? "Emails" : t === "git" ? "GitHub" : ""}
                  </button>
                ))}
             </div>

            <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6 md:p-8 mb-8 backdrop-blur-sm shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                 <Sparkles className="w-5 h-5 text-orange-400" />
                 Add New {adminTab === "yt" ? "YouTube Video" : adminTab === "ypl" ? "YouTube Playlist" : adminTab === "ys" ? "Short" : adminTab === "blog" ? "Blog" : adminTab === "email" ? "Email" : adminTab === "lp" ? "LinkedIn Post" : adminTab === "li" ? "LinkedIn Profile" : adminTab === "tw" ? "Twitter/X Link" : adminTab === "git" ? "GitHub Repo" : adminTab === "ig" ? "Instagram" : "Link"}
              </h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  className="flex-1 bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-white placeholder-white/30 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all"
                  placeholder={`Paste ${adminTab === "yt" ? "YouTube" : adminTab === "ypl" ? "YouTube Playlist" : adminTab === "ys" ? "Shorts" : adminTab === "blog" ? "Blog" : adminTab === "lp" ? "LinkedIn Post" : adminTab === "li" ? "LinkedIn Profile" : adminTab === "tw" ? "Twitter/X" : adminTab === "git" ? "GitHub" : adminTab === "ig" ? "Instagram" : "Link"} URL...`}
                  value={addInput}
                  onChange={(e) => setAddInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddLink();
                  }}
                />
                <button
                  className="px-8 py-3 bg-white text-black hover:bg-gray-200 font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center min-w-[120px] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                  onClick={handleAddLink}
                  disabled={loading || !addInput.trim()}
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Add Link"
                  )}
                </button>
              </div>
            </div>

            {adminTab === "blog" && (
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6 md:p-8 mb-8 backdrop-blur-sm shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                <h2 className="text-lg font-semibold mb-6">
                  Add Blog Manually
                </h2>
                <div className="flex flex-col gap-4">
                  <input
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-white placeholder-white/30 focus:outline-none focus:border-orange-500/50 transition-all"
                    placeholder="Blog Title *"
                    value={manualBlog.title}
                    onChange={(e) =>
                      setManualBlog({ ...manualBlog, title: e.target.value })
                    }
                  />
                  <div className="flex gap-3">
                    <input
                       className="flex-1 bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-white placeholder-white/30 focus:outline-none focus:border-orange-500/50 transition-all"
                      placeholder="Blog URL *"
                      value={manualBlog.url}
                      onChange={(e) =>
                        setManualBlog({ ...manualBlog, url: e.target.value })
                      }
                    />
                    <button
                      onClick={handleFetchBlogDetails}
                      disabled={!manualBlog.url || loading}
                      className="px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/70 hover:text-white transition-colors whitespace-nowrap text-sm font-medium"
                    >
                      Fetch Auto
                    </button>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <input
                       className="flex-1 bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-white placeholder-white/30 focus:outline-none focus:border-orange-500/50 transition-all"
                      placeholder="Platform (e.g., Medium, Hashnode)"
                      value={manualBlog.platform}
                      onChange={(e) =>
                        setManualBlog({
                          ...manualBlog,
                          platform: e.target.value,
                        })
                      }
                    />
                    <input
                       className="flex-1 bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-white placeholder-white/30 focus:outline-none focus:border-orange-500/50 transition-all"
                      placeholder="Thumbnail URL (Optional)"
                      value={manualBlog.thumbnail}
                      onChange={(e) =>
                        setManualBlog({
                          ...manualBlog,
                          thumbnail: e.target.value,
                        })
                      }
                    />
                  </div>
                  <textarea
                     className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-white placeholder-white/30 focus:outline-none focus:border-orange-500/50 transition-all resize-none h-32"
                    placeholder="Short Description (Optional)"
                    value={manualBlog.description}
                    onChange={(e) =>
                      setManualBlog({
                        ...manualBlog,
                        description: e.target.value,
                      })
                    }
                  />
                  <button
                    className="w-full py-3 bg-orange-500 hover:bg-orange-400 text-black font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center mt-2 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                    onClick={handleManualBlogSubmit}
                    disabled={!manualBlog.title || !manualBlog.url || loading}
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "Save Blog"
                    )}
                  </button>
                </div>
              </div>
            )}

            {(adminTab === "email" ) && (
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6 md:p-8 mb-8 backdrop-blur-sm shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">
                    Add "Job Contact / Email"
                  </h2>
                  <button
                    onClick={() => setIsBulkEmail(!isBulkEmail)}
                    className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-colors"
                  >
                    {isBulkEmail ? "Switch to Single" : "Switch to Bulk"}
                  </button>
                </div>

                {isBulkEmail ? (
                  <div className="flex flex-col gap-4">
                    <select
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-orange-500/50 transition-all appearance-none"
                      value={bulkRole}
                      onChange={(e) => setBulkRole(e.target.value)}
                    >
                      <option value="">Select Category / Role (Optional)</option>
                      {JOB_ROLES.map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                    <textarea
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-white placeholder-white/30 focus:outline-none focus:border-orange-500/50 transition-all resize-none h-48"
                      placeholder="Paste multiple emails here...&#10;Format options:&#10;company@email.com&#10;Company Name, company@email.com"
                      value={bulkEmailText}
                      onChange={(e) => setBulkEmailText(e.target.value)}
                    />
                    <button
                      className="w-full py-3 bg-orange-500 hover:bg-orange-400 text-black font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center mt-2 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                      onClick={handleBulkEmailSubmit}
                      disabled={!bulkEmailText.trim() || loading}
                    >
                      {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        "Save Bulk Contacts"
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    <input
                       className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-white placeholder-white/30 focus:outline-none focus:border-orange-500/50 transition-all"
                      placeholder="Company Name *"
                      value={manualEmail.company}
                      onChange={(e) =>
                        setManualEmail({ ...manualEmail, company: e.target.value })
                      }
                    />
                    <input
                       className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-white placeholder-white/30 focus:outline-none focus:border-orange-500/50 transition-all"
                      placeholder="Email Address *"
                      value={manualEmail.email}
                      onChange={(e) =>
                        setManualEmail({ ...manualEmail, email: e.target.value })
                      }
                      onBlur={() => {
                        const details = extractEmailDetails(manualEmail.email);
                        setManualEmail(prev => ({
                          ...prev,
                          company: prev.company || details.company
                        }));
                      }}
                    />
                    <select
                       className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-orange-500/50 transition-all appearance-none"
                      value={manualEmail.role}
                      onChange={(e) =>
                        setManualEmail({ ...manualEmail, role: e.target.value })
                      }
                    >
                      <option value="">Select Category / Role (Optional)</option>
                      {JOB_ROLES.map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                    <textarea
                       className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-white placeholder-white/30 focus:outline-none focus:border-orange-500/50 transition-all resize-none h-32"
                      placeholder="Notes (e.g., 'For Job-related queries email us at...')"
                      value={manualEmail.notes}
                      onChange={(e) =>
                        setManualEmail({ ...manualEmail, notes: e.target.value })
                      }
                    />
                    <button
                      className="w-full py-3 bg-orange-500 hover:bg-orange-400 text-black font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center mt-2 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                      onClick={handleManualEmailSubmit}
                      disabled={!manualEmail.company || !manualEmail.email || loading}
                    >
                      {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        "Save Contact"
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <h2 className="text-lg font-semibold">
                    Manage Collection
                  </h2>
                  <div className="text-sm text-white/40">{db[adminTab].length} items</div>
                </div>
                {(adminTab === "email" ) && (
                   <button 
                     onClick={handleAutoFillDetails}
                     disabled={loading || db[adminTab].length === 0}
                     className="text-xs bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 px-3 py-1.5 rounded-full transition-colors flex items-center justify-center gap-1.5 w-fit disabled:opacity-50"
                   >
                     {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                     Auto-fill Missing Details
                   </button>
                )}
            </div>
            
            <div className="space-y-3">
              {db[adminTab].map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/10 rounded-xl cursor-pointer hover:bg-white/[0.05] hover:border-white/20 transition-all group"
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="truncate flex-1 mr-4">
                    <div className="font-medium text-white/90 truncate group-hover:text-white transition-colors">
                      {(item as any).heading
                        ? <span className="text-orange-400 mr-2">{(item as any).heading} -</span>
                        : ""}
                      {item.title}
                    </div>
                    <div className="text-xs text-white/40 truncate mt-1">
                      {item.url}
                    </div>
                    {(adminTab === "email" ) && (
                      <div className="flex flex-col gap-2 mt-3" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-2">
                          {(item as any).role && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-500/10 text-orange-400 border border-orange-500/20">
                              {(item as any).role}
                            </span>
                          )}
                          <select 
                            className="w-full max-w-[200px] bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:border-orange-500/50 focus:outline-none transition-all appearance-none"
                            value={(item as any).role || ""}
                            onChange={(e) =>
                              updateItem(adminTab, item.id, { role: e.target.value })
                            }
                          >
                            <option value="">Set Role / Category</option>
                            {JOB_ROLES.map(role => (
                              <option key={role} value={role}>{role}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}
                    {(adminTab === "li" || adminTab === "lp") && (
                      <div className="flex flex-col gap-2 mt-3" onClick={(e) => e.stopPropagation()}>
                        <input 
                          className="w-full max-w-[300px] bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder-white/30 focus:border-orange-500/50 focus:outline-none transition-all"
                          placeholder={adminTab === "lp" ? "Post Topic" : "Profile Name"}
                          value={item.title || ""}
                          onChange={(e) =>
                            updateItem(adminTab, item.id, { title: e.target.value })
                          }
                        />
                        <input 
                          className="w-full max-w-[300px] bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder-white/30 focus:border-orange-500/50 focus:outline-none transition-all"
                          placeholder="Company Name"
                          value={item.company || ""}
                          onChange={(e) =>
                            updateItem(adminTab, item.id, { company: e.target.value })
                          }
                        />
                      </div>
                    )}
                    {(adminTab === "lp" || adminTab === "li") && (
                      <div className="flex flex-col gap-2 mt-2 w-full" onClick={(e) => e.stopPropagation()}>
                        {adminTab === "lp" && (
                          <input
                            className="w-full max-w-[300px] bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder-white/30 focus:border-orange-500/50 focus:outline-none transition-all"
                            placeholder="Set category (AWS, Azure, AI, DevOps...)"
                            value={item.heading || ""}
                            onChange={(e) =>
                              updateItem("lp", item.id, { heading: e.target.value })
                            }
                          />
                        )}
                        <textarea
                          className="w-full max-w-[500px] bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder-white/30 focus:border-orange-500/50 focus:outline-none transition-all h-16 resize-none font-light"
                          placeholder="Description / Key takeaways..."
                          value={item.description || ""}
                          onChange={(e) =>
                            updateItem(adminTab, item.id, { description: e.target.value })
                          }
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {item.url && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(item.url, '_blank', 'noopener,noreferrer');
                        }}
                        className="p-2.5 text-orange-400 opacity-0 group-hover:opacity-100 hover:bg-orange-500/10 rounded-lg transition-all"
                        title="Preview link"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStar(adminTab, item.id);
                      }}
                      className={`p-2.5 rounded-lg transition-all ${item.starred ? "text-amber-400 bg-amber-400/10" : "text-white/40 opacity-0 group-hover:opacity-100 hover:bg-white/10 hover:text-white"}`}
                      title="Star item"
                    >
                      <Star className={`w-4 h-4 ${item.starred ? "fill-current" : ""}`} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteItem(adminTab, item.id);
                      }}
                      className="p-2.5 text-red-400 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 rounded-lg transition-all"
                      title="Delete item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {db[adminTab].length === 0 && (
                <div className="text-center py-12 text-white/30 bg-white/[0.02] border border-white/5 rounded-xl border-dashed">
                  No items in this collection yet.
                </div>
              )}
            </div>
          </div>
        </div>

        <Modal
          item={selectedItem}
          isAdmin={true}
          defaultEditing={modalDefaultEditing}
          onClose={() => { setSelectedItem(null); setModalDefaultEditing(false); }}
          onStar={() => {
            if (selectedItem) toggleStar(selectedItem.type, selectedItem.id);
            setSelectedItem((prev) =>
              prev ? { ...prev, starred: !prev.starred } : null,
            );
          }}
          onCopy={() => {
            if (selectedItem) {
              if (selectedItem.type === "li" && selectedItem.title && selectedItem.title !== "LinkedIn Member" && !selectedItem.title.startsWith("http")) {
                let copyText = selectedItem.title;
                if ((selectedItem as any).company) {
                  copyText += ` - ${(selectedItem as any).company}`;
                }
                navigator.clipboard.writeText(copyText);
                showToast("Profile details copied!");
                return;
              }
              navigator.clipboard.writeText(selectedItem.url);
              showToast("Link copied!");
            }
          }}
          onUpdate={async (id, updates) => {
            if (selectedItem) {
              await updateItem(selectedItem.type, id, updates);
              setSelectedItem({ ...selectedItem, ...updates } as any);
              showToast("Item updated!");
            }
          }}
        />

        {/* Toast */}

      {/* Admin Quick Add Modal Dialog */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-3xl bg-[#0d0d0d] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.9)] text-white max-h-[90vh] flex flex-col my-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-5 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
                  <Sparkles className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
                    Save Link / Quick Add
                  </h2>
                  <p className="text-xs text-white/50">Save links, videos, repos, or contacts directly to your Central Hub</p>
                </div>
              </div>
              <button
                onClick={() => setShowAdminModal(false)}
                className="text-white/40 hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-full p-2.5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto py-6 space-y-6 pr-1 custom-scrollbar">
              {/* Category Pills */}
              <div>
                <label className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2.5 block">Select Content Type</label>
                <div className="flex overflow-x-auto gap-2 pb-2 no-scrollbar">
                  {(["yt", "ypl", "ys", "lp", "tw", "ig", "blog", "email", "git"] as ItemType[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => setAdminTab(t)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap flex items-center gap-2 border ${adminTab === t ? "bg-orange-500/15 text-orange-400 border-orange-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]" : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border-white/5"}`}
                    >
                      {t === "yt" && <PlayCircle className="w-3.5 h-3.5" />}
                      {t === "ypl" && <PlayCircle className="w-3.5 h-3.5 text-red-400" />}
                      {t === "ys" && <PlayCircle className="w-3.5 h-3.5" />}
                      {t === "lp" && <Linkedin className="w-3.5 h-3.5" />}
                      {t === "tw" && <Twitter className="w-3.5 h-3.5 text-sky-400" />}
                      {t === "ig" && <Instagram className="w-3.5 h-3.5 text-pink-400" />}
                      {t === "blog" && <FileText className="w-3.5 h-3.5" />}
                      {t === "email" && <Mail className="w-3.5 h-3.5" />}
                      
                      {t === "git" && <Github className="w-3.5 h-3.5 text-slate-400" />}
                      {t === "yt" ? "YouTube" : t === "ypl" ? "Playlists" : t === "ys" ? "Shorts" : t === "lp" ? "LinkedIn Post" : t === "tw" ? "Twitter/X" : t === "ig" ? "Instagram" : t === "blog" ? "Blogs" : t === "email" ? "Job Contacts" : t === "git" ? "GitHub" : ""}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Paste Link Box */}
              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-white flex items-center gap-2">
                    <LinkIcon className="w-4 h-4 text-orange-400" />
                    Paste URL or Link
                  </span>
                  <span className="text-xs text-white/40">Auto-detects metadata</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    className="flex-1 bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-orange-500/50 transition-all"
                    placeholder={`Paste ${adminTab === "yt" ? "YouTube" : adminTab === "ypl" ? "Playlist" : adminTab === "ys" ? "Short" : adminTab === "blog" ? "Blog" : adminTab === "lp" ? "LinkedIn Post" : adminTab === "li" ? "LinkedIn Profile" : adminTab === "tw" ? "Twitter/X" : adminTab === "git" ? "GitHub Repo" : adminTab === "ig" ? "Instagram" : "Link"} URL...`}
                    value={addInput}
                    onChange={(e) => setAddInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddLink();
                    }}
                  />
                  <button
                    className="px-6 py-3 bg-orange-500 hover:bg-orange-400 text-black font-semibold rounded-xl text-sm transition-all duration-300 disabled:opacity-50 flex items-center justify-center min-w-[110px] shadow-[0_0_20px_rgba(16,185,129,0.25)]"
                    onClick={handleAddLink}
                    disabled={loading || !addInput.trim()}
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Link"}
                  </button>
                </div>
              </div>

              {/* Manual Blog Entry if Blog Selected */}
              {adminTab === "blog" && (
                <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 space-y-3">
                  <h3 className="text-sm font-semibold text-white">Manual Blog Details</h3>
                  <input
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-orange-500/50"
                    placeholder="Blog Title *"
                    value={manualBlog.title}
                    onChange={(e) => setManualBlog({ ...manualBlog, title: e.target.value })}
                  />
                  <div className="flex gap-2">
                    <input
                      className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-orange-500/50"
                      placeholder="Blog URL *"
                      value={manualBlog.url}
                      onChange={(e) => setManualBlog({ ...manualBlog, url: e.target.value })}
                    />
                    <button
                      onClick={handleFetchBlogDetails}
                      disabled={!manualBlog.url || loading}
                      className="px-3 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-medium text-white/70 hover:text-white transition-colors"
                    >
                      Fetch Auto
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      className="bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-orange-500/50"
                      placeholder="Platform (Medium, Dev.to...)"
                      value={manualBlog.platform}
                      onChange={(e) => setManualBlog({ ...manualBlog, platform: e.target.value })}
                    />
                    <input
                      className="bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-orange-500/50"
                      placeholder="Thumbnail URL (Optional)"
                      value={manualBlog.thumbnail}
                      onChange={(e) => setManualBlog({ ...manualBlog, thumbnail: e.target.value })}
                    />
                  </div>
                  <textarea
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-orange-500/50 h-20 resize-none"
                    placeholder="Short Description..."
                    value={manualBlog.description}
                    onChange={(e) => setManualBlog({ ...manualBlog, description: e.target.value })}
                  />
                  <button
                    onClick={handleManualBlogSubmit}
                    disabled={!manualBlog.title || !manualBlog.url || loading}
                    className="w-full py-2.5 bg-orange-500 hover:bg-orange-400 text-black font-semibold rounded-xl text-sm transition-all duration-300 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Save Blog"}
                  </button>
                </div>
              )}

              {/* Contact Entry if Email or HR Email Selected */}
              {(adminTab === "email" ) && (
                <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-white">Add "Job Contact"</h3>
                    <button
                      onClick={() => setIsBulkEmail(!isBulkEmail)}
                      className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full transition-colors"
                    >
                      {isBulkEmail ? "Single Mode" : "Bulk Mode"}
                    </button>
                  </div>

                  {isBulkEmail ? (
                    <div className="space-y-3">
                      <select
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500/50"
                        value={bulkRole}
                        onChange={(e) => setBulkRole(e.target.value)}
                      >
                        <option value="">Select Category / Role (Optional)</option>
                        {JOB_ROLES.map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                      <textarea
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-orange-500/50 h-28 resize-none font-mono text-xs"
                        placeholder={`Paste emails...\ncompany@email.com\nCompany Name, company@email.com`}
                        value={bulkEmailText}
                        onChange={(e) => setBulkEmailText(e.target.value)}
                      />
                      <button
                        onClick={handleBulkEmailSubmit}
                        disabled={!bulkEmailText.trim() || loading}
                        className="w-full py-2.5 bg-orange-500 hover:bg-orange-400 text-black font-semibold rounded-xl text-sm transition-all"
                      >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Save Bulk Contacts"}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          className="bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-orange-500/50"
                          placeholder="Company *"
                          value={manualEmail.company}
                          onChange={(e) => setManualEmail({ ...manualEmail, company: e.target.value })}
                        />
                        <input
                          className="bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-orange-500/50"
                          placeholder="Email Address *"
                          value={manualEmail.email}
                          onChange={(e) => setManualEmail({ ...manualEmail, email: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <select
                          className="bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500/50"
                          value={manualEmail.role}
                          onChange={(e) => setManualEmail({ ...manualEmail, role: e.target.value })}
                        >
                          <option value="">Role / Category</option>
                          {JOB_ROLES.map((r) => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                        <input
                          className="bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-orange-500/50"
                          placeholder="Notes (Optional)"
                          value={manualEmail.notes}
                          onChange={(e) => setManualEmail({ ...manualEmail, notes: e.target.value })}
                        />
                      </div>
                      <button
                        onClick={handleManualEmailSubmit}
                        disabled={!manualEmail.company || !manualEmail.email || loading}
                        className="w-full py-2.5 bg-orange-500 hover:bg-orange-400 text-black font-semibold rounded-xl text-sm transition-all"
                      >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Save Contact"}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/50 shrink-0">
              <button
                onClick={() => {
                  setShowAdminModal(false);
                  setView("admin");
                }}
                className="text-orange-400 hover:underline font-medium flex items-center gap-1.5"
              >
                <Settings className="w-3.5 h-3.5" />
                Open Full Admin Dashboard
              </button>
              <button
                onClick={() => setShowAdminModal(false)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors font-medium text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

        <div
          className={`fixed bottom-6 right-6 bg-white text-black rounded-xl px-5 py-3 text-sm font-semibold flex items-center gap-3 shadow-[0_10px_40px_rgba(0,0,0,0.5)] transition-all duration-300 z-[999] ${toastMsg ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95 pointer-events-none"}`}
        >
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center ${toastMsg?.err ? "bg-red-500" : "bg-orange-500"}`}
          >
            {toastMsg?.err ? (
              <X className="w-3 h-3 text-white" />
            ) : (
              <Check className="w-3 h-3 text-white" />
            )}
          </div>
          {toastMsg?.msg}
        </div>
      </div>
    );
  }

  if (view === "landing") {
    return (
      <Suspense fallback={<div className="min-h-screen bg-gradient-to-b from-[#0B0F19] to-[#050810] flex items-center justify-center text-white/50">Loading...</div>}>
        <LandingPage setView={setView} />
      </Suspense>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B0F19] to-[#050810] text-white font-sans relative z-0 flex">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
         <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]" />
      </div>

      {/* Sidebar */}
      <div className="w-64 border-r border-white/10 bg-gradient-to-b from-[#0B0F19] to-[#050810]/80 backdrop-blur-md hidden md:flex flex-col relative z-10 sticky top-0 h-screen">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <button onClick={() => setView("landing")} className="font-display font-bold text-xl flex items-center gap-2 hover:opacity-80 transition-opacity tracking-tight">
                  <LogoIcon size={32} />
                  DevOps <span className="text-orange-400">Store</span>
              </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
              <div className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 mt-4 px-2">Collections</div>
              {(["yt", "ypl", "ys", "lp", "tw", "ig", "blog", "email", "git"] as ItemType[]).map((t) => (
                  <button
                      key={t}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${currentTab === t ? "bg-orange-500/10 text-orange-400 border border-orange-500/20" : "text-white/60 hover:text-white hover:bg-white/5 border border-transparent"}`}
                      onClick={() => setCurrentTab(t)}
                  >
                      <div className="flex items-center gap-3">
                        {t === "yt" && <PlayCircle className="w-4 h-4" />}
                        {t === "ypl" && <PlayCircle className="w-4 h-4 text-red-400" />}
                        {t === "ys" && <PlayCircle className="w-4 h-4" />}
                        {t === "lp" && <Linkedin className="w-4 h-4" />}
                        {t === "tw" && <Twitter className="w-4 h-4 text-sky-400" />}
                        {t === "ig" && <Instagram className="w-4 h-4 text-pink-400" />}
                        {t === "blog" && <FileText className="w-4 h-4" />}
                        {t === "email" && <Mail className="w-4 h-4" />}
                        
                        {t === "git" && <Github className="w-4 h-4 text-slate-400" />}
                        
                        {t === "yt" ? "YouTube" : t === "ypl" ? "Playlists" : t === "ys" ? "Shorts" : t === "lp" ? "LinkedIn Posts" : t === "tw" ? "Twitter/X" : t === "ig" ? "Instagram" : t === "blog" ? "Blogs" : t === "email" ? "Emails" : t === "git" ? "GitHub" : ""}
                      </div>
                      
                      <div className={`px-2 py-0.5 rounded-full text-[10px] ${currentTab === t ? "bg-orange-500/20 text-orange-400" : "bg-white/5 text-white/40"}`}>
                          {db[t].length}
                      </div>
                  </button>
              ))}
          </div>
      </div>

      <div className="flex-1 relative z-10 max-h-screen overflow-y-auto">
        {/* Header */}
        <header className="sticky top-0 z-20 backdrop-blur-md bg-black/40 border-b border-white/10 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                <button
                  onClick={() => setView("landing")}
                  className="md:hidden text-white/60 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-xl font-display font-bold tracking-tight">Central Hub</h1>
            </div>

            {/* Mobile Tabs */}
             <div className="md:hidden flex overflow-x-auto gap-2 pb-1 no-scrollbar w-full border-b border-white/10">
                {(["yt", "ypl", "ys", "lp", "tw", "ig", "blog", "email", "git"] as ItemType[]).map((t) => (
                  <button
                    key={t}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap border ${currentTab === t ? "bg-orange-500/10 text-orange-400 border-orange-500/20" : "bg-white/5 text-white/60 border-white/10"}`}
                    onClick={() => setCurrentTab(t)}
                  >
                    {t === "yt" ? "YouTube" : t === "ypl" ? "Playlists" : t === "ys" ? "Shorts" : t === "lp" ? "LinkedIn Post" : t === "tw" ? "Twitter/X" : t === "ig" ? "Instagram" : t === "blog" ? "Blogs" : t === "email" ? "Emails" : t === "git" ? "GitHub" : ""}
                  </button>
                ))}
             </div>

            <div className="flex-1 w-full sm:max-w-xl flex items-center gap-3 mt-2 sm:mt-0">
                <div className="relative flex-1 group">
                    <Search className="w-4 h-4 text-white/40 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-orange-400 transition-colors" />
                    <input
                        className="w-full bg-white/[0.03] border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-orange-500/50 focus:bg-white/[0.05] transition-all"
                        placeholder="Search your collection..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                
                <div className="relative shrink-0 flex items-center">
                    <input
                        type="date"
                        className="bg-white/[0.03] border border-white/10 rounded-full px-3 py-2 pl-9 text-sm text-white/70 focus:text-white focus:outline-none focus:border-orange-500/50 focus:bg-white/[0.05] transition-all [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-50 hover:[&::-webkit-calendar-picker-indicator]:opacity-100 cursor-pointer"
                        value={searchDate}
                        onChange={(e) => setSearchDate(e.target.value)}
                        title="Filter by date added"
                    />
                    <div className="absolute left-3 pointer-events-none text-white/40">
                       <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                    </div>
                </div>

                <button
                    onClick={() => setShowStarredOnly(!showStarredOnly)}
                    className={`w-9 h-9 flex shrink-0 items-center justify-center rounded-full border transition-all ${showStarredOnly ? "bg-amber-400/10 border-amber-400/20 text-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.2)]" : "bg-white/[0.03] border-white/10 text-white/40 hover:text-white hover:bg-white/10"}`}
                    title="Show Starred Only"
                >
                    <Star className="w-4 h-4" fill={showStarredOnly ? "currentColor" : "none"} />
                </button>
            </div>


        </header>

        {/* Main Content */}
        <main className="p-6 md:p-8 lg:p-10 max-w-7xl mx-auto min-h-screen">
             <div className="mb-8 flex flex-col gap-6">
                 <div>
                     <h2 className="text-3xl font-display font-bold text-white mb-2">
                        {currentTab === "yt" ? "YouTube Videos" : currentTab === "ys" ? "YouTube Shorts" : currentTab === "lp" ? "LinkedIn Posts" : currentTab === "tw" ? "Twitter/X Posts" : currentTab === "blog" ? "Articles & Blogs" : currentTab === "email" ? "Job Contacts" : currentTab === "git" ? "GitHub Repositories" : currentTab === "ig" ? "Instagram Posts & Reels" : ""}
                     </h2>
                     <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-white/50">
                        <p>Your curated collection of {currentTab === "lp" || currentTab === "tw" ? "posts" : currentTab === "git" ? "repositories" : "items"}.</p>
                        
                        <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-white/20"></div>
                        
                        <div className="flex items-center gap-4 text-sm font-medium">
                            <span className="flex items-center gap-1.5"><LayoutGrid className="w-4 h-4 text-white/40" /> {db[currentTab]?.length || 0} Total</span>
                            <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-amber-400/70" /> {db[currentTab]?.filter((i: any) => i.starred)?.length || 0} Starred</span>
                        </div>
                     </div>
                 </div>

                 {(searchQuery || searchDate || showStarredOnly) && (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 animate-fade-in bg-white/[0.02] border border-white/5 rounded-2xl p-4">
                        <span className="text-xs font-semibold text-white/40 uppercase tracking-wider shrink-0">Active Filters:</span>
                        <div className="flex flex-wrap items-center gap-2">
                            {searchQuery && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-medium">
                                    Search: "{searchQuery}"
                                    <button onClick={() => setSearchQuery("")} className="hover:text-white ml-1 transition-colors"><X className="w-3 h-3" /></button>
                                </span>
                            )}
                            {searchDate && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
                                    Date: {searchDate}
                                    <button onClick={() => setSearchDate("")} className="hover:text-white ml-1 transition-colors"><X className="w-3 h-3" /></button>
                                </span>
                            )}
                            {showStarredOnly && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium">
                                    Starred Only
                                    <button onClick={() => setShowStarredOnly(false)} className="hover:text-white ml-1 transition-colors"><X className="w-3 h-3" /></button>
                                </span>
                            )}
                            
                            <button 
                                onClick={() => { setSearchQuery(""); setSearchDate(""); setShowStarredOnly(false); }}
                                className="text-xs text-white/40 hover:text-white transition-colors ml-2 font-medium"
                            >
                                Clear All
                            </button>
                        </div>
                    </div>
                 )}
                 
                 {currentTab === "lp" && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                      <div className="flex items-center gap-2 font-medium text-sm">
                        <span className="text-orange-400 shrink-0 mr-2 flex items-center gap-1.5"><Sparkles className="w-4 h-4" /> Trending</span>
                        {["AWS", "Azure", "DevOps", "Terraform", "Linux", "Interview", "Career", "AI", "Networking"].map(tag => (
                            <button
                                key={tag}
                                onClick={() => setSelectedLPTag(selectedLPTag === tag ? "" : tag)}
                                className={`px-4 py-1.5 rounded-full whitespace-nowrap transition-all border ${selectedLPTag === tag ? "bg-orange-500/20 text-orange-400 border-orange-500/30" : "bg-white/[0.03] text-white/60 hover:text-white hover:bg-white/10 border-white/5"}`}
                            >
                                {tag}
                            </button>
                        ))}
                      </div>
                    </div>
                 )}
             </div>
             
             <div className="block">
                 {renderFeed(currentTab)}
             </div>
        </main>
      </div>

      <Modal
        item={selectedItem}
        defaultEditing={modalDefaultEditing}
        onClose={() => { setSelectedItem(null); setModalDefaultEditing(false); }}
        onStar={() => {
          if (selectedItem) toggleStar(selectedItem.type, selectedItem.id);
          setSelectedItem((prev) =>
            prev ? { ...prev, starred: !prev.starred } : null,
          );
        }}
        onCopy={() => {
          if (selectedItem) {
            if (selectedItem.type === "li" && selectedItem.title && selectedItem.title !== "LinkedIn Member" && !selectedItem.title.startsWith("http")) {
              let copyText = selectedItem.title;
              if ((selectedItem as any).company) {
                copyText += ` - ${(selectedItem as any).company}`;
              }
              navigator.clipboard.writeText(copyText);
              showToast("Profile details copied!");
              return;
            }
            navigator.clipboard.writeText(selectedItem.url);
            showToast("Link copied!");
          }
        }}
        onUpdate={async (id, updates) => {
          if (selectedItem) {
            await updateItem(selectedItem.type, id, updates);
            setSelectedItem({ ...selectedItem, ...updates } as any);
            showToast("Item updated!");
          }
        }}
      />

      {/* Admin Quick Add Modal Dialog */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-3xl bg-[#0d0d0d] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.9)] text-white max-h-[90vh] flex flex-col my-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-5 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
                  <Sparkles className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
                    Save Link / Quick Add
                  </h2>
                  <p className="text-xs text-white/50">Save links, videos, repos, or contacts directly to your Central Hub</p>
                </div>
              </div>
              <button
                onClick={() => setShowAdminModal(false)}
                className="text-white/40 hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-full p-2.5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto py-6 space-y-6 pr-1 custom-scrollbar">
              {/* Category Pills */}
              <div>
                <label className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2.5 block">Select Content Type</label>
                <div className="flex overflow-x-auto gap-2 pb-2 no-scrollbar">
                  {(["yt", "ypl", "ys", "lp", "tw", "ig", "blog", "email", "git"] as ItemType[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => setAdminTab(t)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap flex items-center gap-2 border ${adminTab === t ? "bg-orange-500/15 text-orange-400 border-orange-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]" : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border-white/5"}`}
                    >
                      {t === "yt" && <PlayCircle className="w-3.5 h-3.5" />}
                      {t === "ypl" && <PlayCircle className="w-3.5 h-3.5 text-red-400" />}
                      {t === "ys" && <PlayCircle className="w-3.5 h-3.5" />}
                      {t === "lp" && <Linkedin className="w-3.5 h-3.5" />}
                      {t === "tw" && <Twitter className="w-3.5 h-3.5 text-sky-400" />}
                      {t === "ig" && <Instagram className="w-3.5 h-3.5 text-pink-400" />}
                      {t === "blog" && <FileText className="w-3.5 h-3.5" />}
                      {t === "email" && <Mail className="w-3.5 h-3.5" />}
                      
                      {t === "git" && <Github className="w-3.5 h-3.5 text-slate-400" />}
                      {t === "yt" ? "YouTube" : t === "ypl" ? "Playlists" : t === "ys" ? "Shorts" : t === "lp" ? "LinkedIn Post" : t === "tw" ? "Twitter/X" : t === "ig" ? "Instagram" : t === "blog" ? "Blogs" : t === "email" ? "Job Contacts" : t === "git" ? "GitHub" : ""}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Paste Link Box */}
              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-white flex items-center gap-2">
                    <LinkIcon className="w-4 h-4 text-orange-400" />
                    Paste URL or Link
                  </span>
                  <span className="text-xs text-white/40">Auto-detects metadata</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    className="flex-1 bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-orange-500/50 transition-all"
                    placeholder={`Paste ${adminTab === "yt" ? "YouTube" : adminTab === "ypl" ? "Playlist" : adminTab === "ys" ? "Short" : adminTab === "blog" ? "Blog" : adminTab === "lp" ? "LinkedIn Post" : adminTab === "li" ? "LinkedIn Profile" : adminTab === "tw" ? "Twitter/X" : adminTab === "git" ? "GitHub Repo" : adminTab === "ig" ? "Instagram" : "Link"} URL...`}
                    value={addInput}
                    onChange={(e) => setAddInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddLink();
                    }}
                  />
                  <button
                    className="px-6 py-3 bg-orange-500 hover:bg-orange-400 text-black font-semibold rounded-xl text-sm transition-all duration-300 disabled:opacity-50 flex items-center justify-center min-w-[110px] shadow-[0_0_20px_rgba(16,185,129,0.25)]"
                    onClick={handleAddLink}
                    disabled={loading || !addInput.trim()}
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Link"}
                  </button>
                </div>
              </div>

              {/* Manual Blog Entry if Blog Selected */}
              {adminTab === "blog" && (
                <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 space-y-3">
                  <h3 className="text-sm font-semibold text-white">Manual Blog Details</h3>
                  <input
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-orange-500/50"
                    placeholder="Blog Title *"
                    value={manualBlog.title}
                    onChange={(e) => setManualBlog({ ...manualBlog, title: e.target.value })}
                  />
                  <div className="flex gap-2">
                    <input
                      className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-orange-500/50"
                      placeholder="Blog URL *"
                      value={manualBlog.url}
                      onChange={(e) => setManualBlog({ ...manualBlog, url: e.target.value })}
                    />
                    <button
                      onClick={handleFetchBlogDetails}
                      disabled={!manualBlog.url || loading}
                      className="px-3 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-medium text-white/70 hover:text-white transition-colors"
                    >
                      Fetch Auto
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      className="bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-orange-500/50"
                      placeholder="Platform (Medium, Dev.to...)"
                      value={manualBlog.platform}
                      onChange={(e) => setManualBlog({ ...manualBlog, platform: e.target.value })}
                    />
                    <input
                      className="bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-orange-500/50"
                      placeholder="Thumbnail URL (Optional)"
                      value={manualBlog.thumbnail}
                      onChange={(e) => setManualBlog({ ...manualBlog, thumbnail: e.target.value })}
                    />
                  </div>
                  <textarea
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-orange-500/50 h-20 resize-none"
                    placeholder="Short Description..."
                    value={manualBlog.description}
                    onChange={(e) => setManualBlog({ ...manualBlog, description: e.target.value })}
                  />
                  <button
                    onClick={handleManualBlogSubmit}
                    disabled={!manualBlog.title || !manualBlog.url || loading}
                    className="w-full py-2.5 bg-orange-500 hover:bg-orange-400 text-black font-semibold rounded-xl text-sm transition-all duration-300 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Save Blog"}
                  </button>
                </div>
              )}

              {/* Contact Entry if Email or HR Email Selected */}
              {(adminTab === "email" ) && (
                <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-white">Add "Job Contact"</h3>
                    <button
                      onClick={() => setIsBulkEmail(!isBulkEmail)}
                      className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full transition-colors"
                    >
                      {isBulkEmail ? "Single Mode" : "Bulk Mode"}
                    </button>
                  </div>

                  {isBulkEmail ? (
                    <div className="space-y-3">
                      <select
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500/50"
                        value={bulkRole}
                        onChange={(e) => setBulkRole(e.target.value)}
                      >
                        <option value="">Select Category / Role (Optional)</option>
                        {JOB_ROLES.map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                      <textarea
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-orange-500/50 h-28 resize-none font-mono text-xs"
                        placeholder={`Paste emails...\ncompany@email.com\nCompany Name, company@email.com`}
                        value={bulkEmailText}
                        onChange={(e) => setBulkEmailText(e.target.value)}
                      />
                      <button
                        onClick={handleBulkEmailSubmit}
                        disabled={!bulkEmailText.trim() || loading}
                        className="w-full py-2.5 bg-orange-500 hover:bg-orange-400 text-black font-semibold rounded-xl text-sm transition-all"
                      >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Save Bulk Contacts"}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          className="bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-orange-500/50"
                          placeholder="Company *"
                          value={manualEmail.company}
                          onChange={(e) => setManualEmail({ ...manualEmail, company: e.target.value })}
                        />
                        <input
                          className="bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-orange-500/50"
                          placeholder="Email Address *"
                          value={manualEmail.email}
                          onChange={(e) => setManualEmail({ ...manualEmail, email: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <select
                          className="bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500/50"
                          value={manualEmail.role}
                          onChange={(e) => setManualEmail({ ...manualEmail, role: e.target.value })}
                        >
                          <option value="">Role / Category</option>
                          {JOB_ROLES.map((r) => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                        <input
                          className="bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-orange-500/50"
                          placeholder="Notes (Optional)"
                          value={manualEmail.notes}
                          onChange={(e) => setManualEmail({ ...manualEmail, notes: e.target.value })}
                        />
                      </div>
                      <button
                        onClick={handleManualEmailSubmit}
                        disabled={!manualEmail.company || !manualEmail.email || loading}
                        className="w-full py-2.5 bg-orange-500 hover:bg-orange-400 text-black font-semibold rounded-xl text-sm transition-all"
                      >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Save Contact"}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/50 shrink-0">
              <button
                onClick={() => {
                  setShowAdminModal(false);
                  setView("admin");
                }}
                className="text-orange-400 hover:underline font-medium flex items-center gap-1.5"
              >
                <Settings className="w-3.5 h-3.5" />
                Open Full Admin Dashboard
              </button>
              <button
                onClick={() => setShowAdminModal(false)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors font-medium text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      <div
        className={`fixed bottom-6 right-6 bg-white text-black rounded-xl px-5 py-3 text-sm font-semibold flex items-center gap-3 shadow-[0_10px_40px_rgba(0,0,0,0.5)] transition-all duration-300 z-[999] ${toastMsg ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95 pointer-events-none"}`}
      >
        <div
          className={`w-5 h-5 rounded-full flex items-center justify-center ${toastMsg?.err ? "bg-red-500" : "bg-orange-500"}`}
        >
          {toastMsg?.err ? (
            <X className="w-3 h-3 text-white" />
          ) : (
            <Check className="w-3 h-3 text-white" />
          )}
        </div>
        {toastMsg?.msg}
      </div>

      
      {/* Custom Keyframes for Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
      `}} />
    </div>
  );
}

import { LogoIcon } from "./components/LogoIcon";
import AdminExport from "./components/AdminExport";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/export" element={<AdminExport />} />
        <Route path="/*" element={<MainApp />} />
      </Routes>
    </BrowserRouter>
  );
}
