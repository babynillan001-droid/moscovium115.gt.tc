import React, { useState, useEffect } from 'react';
import { 
  Search, ChevronLeft, ChevronRight, ShoppingCart, Globe, Menu, X, Star, 
  Tag, TrendingUp, Wallet, PlusCircle, GitBranch, HelpCircle, Send, 
  ShieldCheck, Briefcase, Car, Paintbrush, Download, Shirt, Home, 
  Wrench, Building, Check, ExternalLink, MessageSquare, Plus, Minus, User, Sparkles, Grid
} from 'lucide-react';

import { Item, CartItem, Order, SellerStats } from './types';
import { CATEGORIES, INITIAL_ITEMS, INITIAL_SELLER_STATS } from './data';
import ItemCard from './components/ItemCard';
import ItemDetailsModal from './components/ItemDetailsModal';
import CartModal from './components/CartModal';
import Dashboard from './components/Dashboard';
import GitAssistant from './components/GitAssistant';

// Multi-language Translation Packs
const TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    tagline: "Discover Products, Services & Digital Downloads worldwide",
    searchPlaceholder: "Search products, services, shops...",
    listings: "Listings",
    shops: "Shops",
    sell: "Seller Console",
    cart: "Cart",
    login: "Sign In",
    register: "Create Account",
    protection: "Buyer/Seller Protected Escrow Escort",
    globalShipping: "Global Logistics & Local Despatches",
    curatedPicks: "Curated Trending Picks Daily",
    whoTitle: "Who is Moscovium115?",
    whoDesc: "Named after the super-heavy element, Moscovium115 is a high-atomic-energy global marketplace where creators list physical crafts, tech assets, and consulting services instantly.",
    statsBuyers: "50k+ Active Buyers",
    statsSellers: "10k+ Merchants",
    statsCountries: "80+ Sovereign Regions",
    contactUs: "Git Publish Assistant",
    popularHeader: "Hot right now - Popular Items",
    recommendedHeader: "Just for You - Personalized Picks",
    trendingServices: "Most In-Demand Services Today",
    featuredShops: "Featured Top-Rated Merchant Boutiques"
  },
  sw: {
    tagline: "Gundua Bidhaa, Huduma & Upakuaji wa Kidijitali mbali mbali",
    searchPlaceholder: "Tafuta bidhaa, huduma, maduka...",
    listings: "Orodha",
    shops: "Maduka",
    sell: "Ofisi ya Muuzaji",
    cart: "Kikapu",
    login: "Ingia",
    register: "Sajili Akaunti",
    protection: "Ulinzi wa Mnunuzi na Muuzaji na Dhamana",
    globalShipping: "Usafirishaji wa Kimataifa na Wauzaji wa Ndani",
    curatedPicks: "Chaguo Maalum Zinazovuma Kila Siku",
    whoTitle: "Moscovium115 ni Nini?",
    whoDesc: "Imepewa jina la elementi nzito ya kisayansi, Moscovium115 ni soko la kimataifa lenye nguvu ambapo wabunifu huorodhesha kazi za mikono, huduma za kiteknolojia na ushauri papo hapo.",
    statsBuyers: "Wanunuzi 50k+ Amilifu",
    statsSellers: "Wafanyabiashara 10k+",
    statsCountries: "Mikoa 80+ Kote Duniani",
    contactUs: "Msaidizi wa Git",
    popularHeader: "Zinazopendwa Sasa Hivi - Bidhaa Moto",
    recommendedHeader: "Kwa Ajili Yako Tu - Chaguo Zilizopendekezwa",
    trendingServices: "Huduma Zinazohitajika Zaidi Leo",
    featuredShops: "Maduka ya Juu ya Wafanyabiashara Waliomakinika"
  }
};

export default function App() {
  const [lang, setLang] = useState<string>('en');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Unified State Engine
  const [items, setItems] = useState<Item[]>(INITIAL_ITEMS);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [sellerStats, setSellerStats] = useState<SellerStats>(INITIAL_SELLER_STATS);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'marketplace' | 'dashboard' | 'git-assistant'>('marketplace');

  // Hero Carousel State
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const heroSlides = [
    {
      title: "Any Skill. Any Service. One Global Platform.",
      desc: "Legal consulting, software engineering, physical crafts, custom hardware – list your capability instantly, earn escrow rewards securely.",
      action: "List Your Service",
      bgGradient: "from-slate-900 via-red-950 to-rose-950",
      img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=500&q=80"
    },
    {
      title: "List Unique Handmade Treasures",
      desc: "Explore bespoke mahogany sculptures, traditional handwoven sisal totes, and rare collectible loose gemstones from verified global artisans.",
      action: "Shop Handmade",
      bgGradient: "from-rose-900 via-slate-900 to-emerald-950",
      img: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=500&q=80"
    },
    {
      title: "Next-Gen Tech Graphic Nodes",
      desc: "Instant orders on premium consumer electronics, high-processing GPU silicon nodes, and re-mappable mechanical media controllers.",
      action: "Explore Electronics",
      bgGradient: "from-neutral-900 via-indigo-950 to-slate-900",
      img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=500&q=80"
    }
  ];

  // Chat Support Panel States
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string; time: string }>>([
    {
      sender: 'bot',
      text: 'Welcome to Moscovium115 Secure Escrow Support. I am your customer escort. How can I help you manage your digital shop, upload on Git, or complete smart purchases today?',
      time: '10:00 AM'
    }
  ]);

  // Handle Carousel Autoplay
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const t = (key: string) => {
    return TRANSLATIONS[lang]?.[key] || TRANSLATIONS['en']?.[key] || key;
  };

  // Cart operations
  const handleAddToCart = (item: Item, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCartItems((prev) => {
      const existing = prev.find((i) => i.item.id === item.id);
      if (existing) {
        return prev.map((i) => i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (itemId: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    setCartItems((prev) => prev.map((i) => i.item.id === itemId ? { ...i, quantity: qty } : i));
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems((prev) => prev.filter((i) => i.item.id !== itemId));
  };

  const handleCheckoutSuccess = (customerName: string, customerEmail: string) => {
    const totalCost = cartItems.reduce((acc, item) => acc + (item.item.price * item.quantity), 0);
    const newOrder: Order = {
      id: `order-9${Math.floor(Math.random() * 900000 + 100000)}`,
      items: [...cartItems],
      total: totalCost,
      status: 'Completed',
      date: new Date().toISOString().split('T')[0],
      customerName,
      customerEmail
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCartItems([]);
    alert(`Escrow Checkout Confirmed!\nOrder Code: ${newOrder.id}\nThank you, ${customerName}. An item access pass has been dispatched to ${customerEmail}.`);
  };

  // Seller Dashboard Operations
  const handleAddListing = (newItem: Item) => {
    setItems((prev) => [newItem, ...prev]);
  };

  const handleRemoveListing = (itemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  // Support Chat simulator auto-answers
  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = { sender: 'user' as const, text: userText, time: timeStr };
    
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');

    // Simulated Smart Help Response Bank
    setTimeout(() => {
      let responseText = "Thank you for shopping on Moscovium115. Your inquiry is under priority evaluation. Let me know if you need instructions about product escrow payments!";
      
      const lower = userText.toLowerCase();
      if (lower.includes('git') || lower.includes('github') || lower.includes('upload') || lower.includes('repo')) {
        responseText = "To upload Moscovium115 onto your Git Repository, simply click 'Git Publish Wizard' in the top directory bar! We have generated interactive, pre-formatted terminal commands linked directly to your GitHub coordinates.";
      } else if (lower.includes('escrow') || lower.includes('pay') || lower.includes('payment') || lower.includes('withdraw')) {
        responseText = "Moscovium115 processes balances under escrow safety conditions. Earnings accumulate dynamically in your Seller Office under Wallet Balance. Once buyers confirm received listings, you can request direct cashouts to PayPal, Wise, or SWIFT wire transfers.";
      } else if (lower.includes('bestgem') || lower.includes('owner') || lower.includes('ruby')) {
        responseText = "Bestgemdiamond is one of our premium, top-rated merchants. They currently list natural African ruby specimens, mahogany giraffe statuettes, and provide custom Full-Stack React development contracts.";
      } else if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
        responseText = "Hello! I am your local Moscovium customer advocate. How can I help you list a new product, or copy the git commands to sync your repository right now?";
      }

      const botMsg = { sender: 'bot' as const, text: responseText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
      setChatMessages((prev) => [...prev, botMsg]);
    }, 1200);
  };

  // List categories inside horizontal rail
  const renderCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Car': return <Car className="h-4 w-4" />;
      case 'Paintbrush': return <Paintbrush className="h-4 w-4" />;
      case 'Download': return <Download className="h-4 w-4" />;
      case 'Shirt': return <Shirt className="h-4 w-4" />;
      case 'Home': return <Home className="h-4 w-4 text-emerald-600" />;
      case 'Wrench': return <Wrench className="h-4 w-4" />;
      case 'Building': return <Building className="h-4 w-4" />;
      default: return <Briefcase className="h-4 w-4" />;
    }
  };

  // Filter Catalog Listing Items
  const filteredItems = items.filter((item) => {
    const matchesCategory = !selectedCategory || item.category.toLowerCase().replace(/\s+/g, '-') === selectedCategory;
    const matchesSearch = !searchQuery.trim() || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 antialiased font-sans">
      
      {/* Dynamic Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-xs">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => { setCurrentView('marketplace'); setSelectedCategory(null); }}
              className="flex items-center gap-2 group cursor-pointer focus:outline-none"
            >
              <div className="h-10 w-10 rounded-xl bg-red-600 flex items-center justify-center text-white font-display font-black text-xl tracking-tight shadow-md group-hover:scale-105 transition-transform">
                M
              </div>
              <div className="text-left">
                <span className="text-lg font-black tracking-tight text-slate-900 block leading-none font-display">Moscovium115</span>
                <span className="text-[10px] text-slate-400 font-sans tracking-widest uppercase block mt-0.5 font-bold">Web Escrow Nodes</span>
              </div>
            </button>
          </div>

          {/* Large Screen Global search */}
          <div className="hidden flex-1 max-w-md lg:block">
            <div className="relative">
              <input 
                type="text" 
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs rounded-full border border-slate-300 bg-slate-50 py-2.5 pl-10 pr-4 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:bg-white transition-all"
              />
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            </div>
          </div>

          {/* Language and view selector */}
          <div className="flex items-center gap-3">
            
            {/* Language Selector dropdown option */}
            <div className="flex items-center gap-1">
              <Globe className="h-4 w-4 text-slate-400" />
              <select 
                value={lang} 
                onChange={(e) => setLang(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-2 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
              >
                <option value="en">English (US)</option>
                <option value="sw">Kiswahili (KE)</option>
              </select>
            </div>

            {/* Navigation Tabs (Router simulation) */}
            <nav className="hidden md:flex items-center gap-2 border-l border-slate-200 pl-3">
              <button 
                onClick={() => setCurrentView('marketplace')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold font-sans transition-all cursor-pointer ${
                  currentView === 'marketplace' ? 'bg-red-650 text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {t('listings')}
              </button>
              <button 
                onClick={() => setCurrentView('dashboard')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold font-sans transition-all cursor-pointer ${
                  currentView === 'dashboard' ? 'bg-red-650 text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {t('sell')}
              </button>
              <button 
                onClick={() => setCurrentView('git-assistant')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold font-sans transition-all cursor-pointer flex items-center gap-1 border ${
                  currentView === 'git-assistant' ? 'border-red-600 bg-red-50 text-red-600' : 'border-slate-300 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <GitBranch className="h-3.5 w-3.5" />
                <span>{t('contactUs')}</span>
              </button>
            </nav>

            {/* Cart Header button */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <ShoppingCart className="h-4 w-4" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-600 text-[10px] text-white font-bold flex items-center justify-center border border-white">
                  {cartItems.length}
                </span>
              )}
            </button>

            {/* Mobile hamburger menu */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-700 md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mobile menu panel */}
        {isMobileMenuOpen && (
          <div className="border-t border-slate-200 bg-white p-4 space-y-4 md:hidden">
            {/* Search */}
            <div className="relative">
              <input 
                type="text" 
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs rounded-full border border-slate-300 bg-slate-50 py-2 pl-9 pr-3 text-slate-700 placeholder:text-slate-450 focus:outline-none"
              />
              <Search className="absolute left-3.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            </div>

            {/* Mobile Nav Link List */}
            <nav className="flex flex-col gap-2 font-sans font-bold text-xs text-slate-700">
              <button 
                onClick={() => { setCurrentView('marketplace'); setIsMobileMenuOpen(false); }}
                className="text-left px-3 py-2 hover:bg-slate-50 rounded-xl"
              >
                {t('listings')} Marketplace
              </button>
              <button 
                onClick={() => { setCurrentView('dashboard'); setIsMobileMenuOpen(false); }}
                className="text-left px-3 py-2 hover:bg-slate-50 rounded-xl"
              >
                {t('sell')} Merchant Portal
              </button>
              <button 
                onClick={() => { setCurrentView('git-assistant'); setIsMobileMenuOpen(false); }}
                className="text-left px-3 py-2 hover:bg-slate-50 rounded-xl flex items-center gap-1.5"
              >
                <GitBranch className="h-4 w-4 text-red-600" />
                <span>Git upload wizard</span>
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Main Container Layout */}
      <main className="flex-1 pb-16">
        
        {/* Marketplace Homepage View */}
        {currentView === 'marketplace' && (
          <div className="space-y-6">
            
            {/* Hero sliding carousel and guarantees */}
            <section className="mx-auto w-full max-w-7xl px-4 pt-5 sm:px-6 lg:px-8">
              <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200">
                
                {/* Active Slide item */}
                <div className={`p-6 sm:p-10 lg:p-12 bg-gradient-to-br ${heroSlides[currentHeroSlide].bgGradient} text-white flex flex-col md:flex-row items-center justify-between gap-6 min-h-[360px]`}>
                  <div className="max-w-xl space-y-4 text-center md:text-left">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full border border-white/10 text-xs font-bold uppercase tracking-wider">
                      <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                      <span>Earn Global Balances Securely</span>
                    </div>
                    <h1 className="text-2xl sm:text-3.5xl font-black font-display tracking-tight leading-tight">
                      {heroSlides[currentHeroSlide].title}
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-200/90 leading-relaxed font-sans font-medium">
                      {heroSlides[currentHeroSlide].desc}
                    </p>
                    <div className="flex gap-2.5 justify-center md:justify-start pt-3">
                      <button 
                        onClick={() => setCurrentView('dashboard')}
                        className="bg-white hover:bg-slate-100 text-red-950 font-bold px-5 py-2.5 rounded-xl text-xs font-sans transition-all active:scale-[0.98] shadow-sm cursor-pointer"
                      >
                        {heroSlides[currentHeroSlide].action}
                      </button>
                      <button 
                        onClick={() => setCurrentView('git-assistant')}
                        className="bg-transparent hover:bg-white/10 text-white font-bold border border-white/30 px-5 py-2.5 rounded-xl text-xs font-sans transition-all active:scale-[0.98]"
                      >
                        Check Git Upload Wizard
                      </button>
                    </div>
                  </div>

                  <div className="w-full max-w-[280px] sm:max-w-xs shrink-0 self-center hidden md:block">
                    <img 
                      src={heroSlides[currentHeroSlide].img} 
                      alt="Banner visualization" 
                      className="rounded-2xl shadow-2xl object-cover h-48 w-full border border-white/10"
                    />
                  </div>
                </div>

                {/* Slider Nav dots at bottom */}
                <div className="absolute bottom-4 left-6 flex gap-1.5 items-center">
                  {heroSlides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentHeroSlide(i)}
                      className={`h-2 rounded-full transition-all ${currentHeroSlide === i ? 'w-6 bg-white' : 'w-2 bg-white/40'}`}
                      title={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>

                {/* Left and Right arrows */}
                <button 
                  onClick={() => setCurrentHeroSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-colors focus:outline-none hidden sm:flex"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-colors focus:outline-none hidden sm:flex"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </section>

            {/* Shield features row */}
            <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="bg-white border border-slate-200 rounded-2xl p-4 flex gap-3 shadow-xs">
                  <div className="h-10 w-10 rounded-xl bg-red-50 text-red-650 flex items-center justify-center shrink-0">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-sans">{t('protection')}</h3>
                    <p className="text-xs text-slate-400 mt-1 font-sans">Escrow security locks payouts until listing confirmation matches.</p>
                  </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-4 flex gap-3 shadow-xs">
                  <div className="h-10 w-10 rounded-xl bg-red-50 text-red-650 flex items-center justify-center shrink-0">
                    <Globe className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-sans">{t('globalShipping')}</h3>
                    <p className="text-xs text-slate-400 mt-1 font-sans">Sellers coordinate physical dropshipping or instant links securely.</p>
                  </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-4 flex gap-3 shadow-xs">
                  <div className="h-10 w-10 rounded-xl bg-red-50 text-red-650 flex items-center justify-center shrink-0">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-sans">{t('curatedPicks')}</h3>
                    <p className="text-xs text-slate-400 mt-1 font-sans">Review verified rating scores and purchase ledger counts.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Horizontal Categories Filter Rail */}
            <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-3">
              <h3 className="text-xs font-black tracking-wider uppercase text-slate-500">Shop by department category</h3>
              <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-bold transition-all cursor-pointer select-none leading-none ${
                    !selectedCategory 
                      ? 'border-red-600 bg-red-50 text-red-600 shadow-xs' 
                      : 'border-slate-250 bg-white text-slate-700 hover:border-slate-350'
                  }`}
                >
                  <Grid className="h-3.5 w-3.5" />
                  <span>All Categories</span>
                </button>
                {CATEGORIES.map((cat) => {
                  const pathPattern = cat.name.toLowerCase().replace(/\s+/g, '-');
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(pathPattern)}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-bold transition-all cursor-pointer select-none leading-none shrink-0 ${
                        selectedCategory === pathPattern
                          ? 'border-red-600 bg-red-50 text-red-600 shadow-xs' 
                          : 'border-slate-250 bg-white text-slate-700 hover:border-slate-350'
                      }`}
                    >
                      {renderCategoryIcon(cat.icon)}
                      <span>{cat.name}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Main Products Grid displaying active items array */}
            <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest bg-red-50 text-red-600 border border-red-100 rounded px-2 py-0.5 font-mono">LIVE CATALOGUE</span>
                  <h2 className="text-xl font-extrabold text-slate-900 tracking-tight leading-tight mt-1.5 font-sans">
                    {selectedCategory ? `${CATEGORIES.find(c => c.name.toLowerCase().replace(/\s+/g, '-') === selectedCategory)?.name}` : t('popularHeader')}
                  </h2>
                </div>
                <span className="text-xs text-slate-500 font-sans font-medium">{filteredItems.length} matching listing(s) found</span>
              </div>

              {filteredItems.length === 0 ? (
                <div className="py-20 text-center space-y-3 bg-white border border-slate-200 rounded-3xl p-6">
                  <span className="text-4xl text-slate-300 block">👀</span>
                  <p className="text-sm font-semibold text-slate-500">We couldn't find items that match your search filters.</p>
                  <button 
                    onClick={() => { setSelectedCategory(null); setSearchQuery(''); }}
                    className="text-red-600 text-xs font-bold tracking-wide hover:underline focus:outline-none"
                  >
                    Reset all filters and view full catalogue
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {filteredItems.map((item) => (
                    <ItemCard 
                      key={item.id} 
                      item={item} 
                      onViewDetails={(i) => setSelectedItem(i)}
                      onAddToCart={(i, e) => handleAddToCart(i, e)}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Who is Moscovium card section */}
            <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden border border-slate-800">
                <div className="absolute right-0 top-0 translate-y-[-10%] translate-x-[10%] h-80 w-80 bg-red-600/10 rounded-full blur-3xl" />
                
                <div className="mx-auto max-w-3xl text-center space-y-4">
                  <span className="text-[10px] font-black uppercase tracking-widest bg-red-600 text-white px-3 py-1 rounded-full">
                    Moscovium115 Ecosystem
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight text-white mt-1">
                    {t('whoTitle')}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans max-w-2xl mx-auto">
                    {t('whoDesc')}
                  </p>

                  <div className="flex flex-wrap justify-center gap-3 pt-4">
                    <span className="bg-white/5 border border-white/10 px-4 py-2 rounded-2xl text-xs font-sans font-bold inline-flex items-center gap-1.5 text-slate-100">
                      <User className="h-4 w-4 text-red-500" />
                      {t('statsBuyers')}
                    </span>
                    <span className="bg-white/5 border border-white/10 px-4 py-2 rounded-2xl text-xs font-sans font-bold inline-flex items-center gap-1.5 text-slate-100">
                      <Briefcase className="h-4 w-4 text-red-500" />
                      {t('statsSellers')}
                    </span>
                    <span className="bg-white/5 border border-white/10 px-4 py-2 rounded-2xl text-xs font-sans font-bold inline-flex items-center gap-1.5 text-slate-100">
                      <Globe className="h-4 w-4 text-red-500" />
                      {t('statsCountries')}
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Dashboard View */}
        {currentView === 'dashboard' && (
          <section className="mx-auto w-full max-w-7xl px-4 pt-5 sm:px-6 lg:px-8">
            <Dashboard 
              items={items}
              orders={orders}
              sellerStats={sellerStats}
              onAddListing={handleAddListing}
              onRemoveListing={handleRemoveListing}
              onUpdateStats={setSellerStats}
            />
          </section>
        )}

        {/* Git Assistant View */}
        {currentView === 'git-assistant' && (
          <section className="mx-auto w-full max-w-7xl px-4 pt-5 sm:px-6 lg:px-8">
            <GitAssistant />
          </section>
        )}
      </main>

      {/* Floating Chat Assistant Panel on Bottom Right */}
      <div className="fixed bottom-4 right-4 z-40">
        {!isChatOpen ? (
          <button
            onClick={() => setIsChatOpen(true)}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg transition-transform hover:scale-105"
            title="Open Live Chat Assistance"
          >
            <MessageSquare className="h-5 w-5" />
          </button>
        ) : (
          <div className="w-80 h-[430px] rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col justify-between">
            {/* Direct header */}
            <div className="p-4 bg-slate-900 border-b border-slate-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <div>
                  <h4 className="text-xs font-bold font-sans text-white leading-none">Moscovium Hub Support</h4>
                  <span className="text-[9px] text-slate-400 block mt-1 font-sans">Automated Escrow Advocate</span>
                </div>
              </div>
              <button 
                onClick={() => setIsChatOpen(false)}
                className="text-slate-400 hover:text-white transition-colors p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Chat list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 text-[11px]">
              {chatMessages.map((msg, i) => (
                <div 
                  key={i} 
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] rounded-2xl p-3 space-y-1.5 shadow-sm leading-normal ${
                    msg.sender === 'user' 
                      ? 'bg-red-600 text-white rounded-br-none' 
                      : 'bg-white text-slate-850 rounded-bl-none border border-slate-150'
                  }`}>
                    <p>{msg.text}</p>
                    <span className="block text-[8px] opacity-70 text-right">{msg.time}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Message input */}
            <form onSubmit={handleSendChatMessage} className="p-3 border-t border-slate-200 bg-white flex gap-2">
              <input
                type="text"
                placeholder="Ask about Escrow, Payouts, or Git uploads..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-350 p-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white rounded-xl py-2 px-3 font-bold font-sans text-xs shrink-0 active:scale-95"
              >
                Send
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Cart Modal rendering */}
      <CartModal 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckoutSuccess={handleCheckoutSuccess}
      />

      {/* Item inspection dialog */}
      <ItemDetailsModal 
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Dynamic footer matching extracted dump styling */}
      <footer className="bg-slate-950 text-slate-200 mt-auto border-t border-slate-850">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-white font-display">Moscovium115 Ecosystem</h4>
            <ul className="mt-4 space-y-2 text-xs text-slate-400">
              <li><button onClick={() => setCurrentView('marketplace')} className="hover:text-white text-left focus:outline-none">Department Listings</button></li>
              <li><button onClick={() => setCurrentView('dashboard')} className="hover:text-white text-left focus:outline-none">Fulfillment Office</button></li>
              <li><button onClick={() => setCurrentView('git-assistant')} className="hover:text-white text-left focus:outline-none">Git Source Integration</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-white font-display">Git Infrastructure</h4>
            <ul className="mt-4 space-y-2 text-xs text-slate-400">
              <li><button onClick={() => setCurrentView('git-assistant')} className="hover:text-white text-left focus:outline-none">Local Repo Setup Wizard</button></li>
              <li><button onClick={() => setCurrentView('git-assistant')} className="hover:text-white text-left focus:outline-none">Git Configuration Guide</button></li>
              <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">GitHub Console</a></li>
              <li><a href="https://gitlab.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">GitLab Workspace</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-white font-display">Assurance Guarantee</h4>
            <p className="mt-4 text-xs text-slate-400 leading-relaxed font-sans font-medium">
              We bind transactions seamlessly into independent cryptosecure wallets. Deposits lock until digital access keys confirm locally.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-white font-display">Merchant Registry</h4>
            <div className="mt-4 space-y-2.5 text-xs text-slate-400 font-medium">
              <p>Active Node Session ID:</p>
              <p className="font-mono text-[10px] text-red-400 bg-white/5 border border-white/5 px-2 py-1 rounded truncate">
                moscovium-node-es-4481691461
              </p>
              <div className="flex gap-1.5 items-center text-red-500 font-bold">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                <span>Node operational</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-900 bg-slate-950/80">
          <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 px-4 py-4 text-xs text-slate-400 sm:flex-row sm:px-6">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-red-600 text-white font-display font-black flex items-center justify-center text-xs">M</div>
              <p>&copy; 2026 Moscovium115 Web Escrow Inc. All rights reserved.</p>
            </div>
            <div className="text-slate-500 flex gap-2 text-base">
              <span>💳 Visa</span>
              <span>&bull;</span>
              <span>💳 MasterCard</span>
              <span>&bull;</span>
              <span>💳 PayPal</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
