import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, X, MapPin, Phone, Instagram, Facebook, Twitter, 
  ArrowRight, Utensils, Sparkles, Send, Loader2, 
  User, Calendar, ChefHat, LayoutDashboard, Settings, 
  LogOut, PlusCircle, Trash2, CheckCircle, Bell, Clock, Users, LogIn, Crown, Megaphone, Tag, Image as ImageIcon, Edit3, Lock, ShieldCheck, Globe, MessageSquare
} from 'lucide-react';

// --- CONFIGURATION ---
const CONFIG = {
  // SET THIS TO FALSE TO TEST "LITE" VERSION
  ENABLE_RESERVATIONS: true, 
  
  MAX_TABLES_PER_SLOT: 5, 
  MEMBER_DISCOUNT: 0.10, 
  CURRENCY: '€', 
  
  // SECURITY CONFIG
  ADMIN_PHONE: '8888',
  ADMIN_NAME: 'Manager'
};

// --- TRANSLATIONS DICTIONARY ---
const T = {
  zh: {
    brand: "长安驿",
    subtitle: "丝路味道",
    nav_home: "首页",
    nav_menu: "膳单",
    nav_events: "雅集",
    nav_bookings: "我的预订",
    nav_ai: "AI 管家",
    nav_info: "概况",
    sign_in: "登入",
    sign_out: "退出",
    staff_access: "员工通道",
    book_via_ai: "AI 智能订座",
    view_menu: "查看菜单",
    hero_title_1: "长",
    hero_title_2: "安",
    hero_title_3: "驿",
    hero_desc: "穿越丝绸之路的现代味觉之旅。\nAI 甄选 · 匠心手作",
    happening: "最新动态",
    events_title: "雅集 & 通告",
    details: "详情",
    menu_title: "匠心出品",
    member_price_active: "金卡会员尊享 9 折",
    upcoming_res: "即将来临的预订",
    no_bookings: "暂无预订记录",
    guest: "位",
    pending: "待确认",
    confirmed: "已确认",
    rejected: "已取消",
    welcome: "欢迎光临长安驿",
    welcome_member: "欢迎回来，尊贵的",
    welcome_admin: "系统就绪。管理员已登录。",
    ai_placeholder: "请问有什么可以帮您？",
    ai_admin_placeholder: "输入 '/admin' 进入后台...",
    login_title: "身份识别",
    login_guest_tab: "访客通道",
    login_member_tab: "会员登录",
    login_desc_guest: "请输入信息以便安排座位",
    login_desc_member: "登录以享受专属礼遇",
    name_placeholder: "您的尊姓大名",
    phone_placeholder: "联系电话",
    pass_placeholder: "会员密码",
    btn_guest: "继续 (访客)",
    btn_member: "安全登录",
    hint_admin: "提示: 使用 8888 登录为经理",
    footer_copy: "© 2026 长安驿. 保留所有权利."
  },
  es: {
    brand: "CHANG'AN YI",
    subtitle: "La Posta de la Ruta de Seda",
    nav_home: "Inicio",
    nav_menu: "Menú",
    nav_events: "Eventos",
    nav_bookings: "Reservas",
    nav_ai: "IA",
    nav_info: "Info",
    sign_in: "Acceder",
    sign_out: "Salir",
    staff_access: "Acceso Personal",
    book_via_ai: "Reservar con IA",
    view_menu: "Ver Menú",
    hero_title_1: "CHANG",
    hero_title_2: "'AN",
    hero_title_3: "YI",
    hero_desc: "Cocina moderna del Noroeste de China.\nCurada por IA · Artesanal",
    happening: "Novedades",
    events_title: "Eventos y Avisos",
    details: "Detalles",
    menu_title: "Nuestras Creaciones",
    member_price_active: "Precio Socio Gold (-10%)",
    upcoming_res: "Próximas Reservas",
    no_bookings: "Sin reservas activas",
    guest: "pax",
    pending: "Pendiente",
    confirmed: "Confirmado",
    rejected: "Cancelado",
    welcome: "Bienvenido a La Posta de Chang'an",
    welcome_member: "Bienvenido de nuevo, estimado",
    welcome_admin: "Sistema Listo. Acceso Admin.",
    ai_placeholder: "¿En qué puedo ayudarle?",
    ai_admin_placeholder: "Escriba '/admin' para el panel...",
    login_title: "Identificación",
    login_guest_tab: "Invitado",
    login_member_tab: "Socio",
    login_desc_guest: "Datos para su reserva",
    login_desc_member: "Acceda a beneficios exclusivos",
    name_placeholder: "Su Nombre",
    phone_placeholder: "Teléfono",
    pass_placeholder: "Contraseña",
    btn_guest: "Continuar",
    btn_member: "Entrar",
    hint_admin: "Pista: Use 8888 para modo Gerente",
    footer_copy: "© 2026 Chang'an Yi. Todos los derechos reservados."
  }
};

// --- DATA ---
const INITIAL_MENU = {
  noodles: [
    { 
      id: 1, 
      name: { zh: 'Biang Biang 面', es: 'Fideos Biang Biang' },
      price: 24, 
      status: 'active', 
      desc: { zh: '手工扯面，油泼辣子，秦川牛肉。', es: 'Fideos anchos estirados a mano, aceite de chile, ternera braseada.' },
      img: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=800&auto=format&fit=crop' 
    },
    { 
      id: 2, 
      name: { zh: '岐山臊子面', es: 'Fideos Qishan Saozi' },
      price: 22, 
      status: 'active', 
      desc: { zh: '酸辣浓汤，五花肉丁，木耳黄花。', es: 'Caldo agrio y picante, cerdo picado, setas y lirio de día.' },
      img: 'https://images.unsplash.com/photo-1617622141675-d227d6d04a05?q=80&w=800&auto=format&fit=crop' 
    },
    { 
      id: 3, 
      name: { zh: '油泼面', es: 'Fideos Youpo (Oil-Spill)' },
      price: 18, 
      status: 'active', 
      desc: { zh: '秘制宽面，滚油泼辣子，葱花蒜末。', es: 'Fideos anchos, chile en polvo bañado en aceite hirviendo, cebolleta.' },
      img: 'https://images.unsplash.com/photo-1552611052-33e04de081de?q=80&w=800&auto=format&fit=crop' 
    },
  ],
  dimsum: [
    { 
      id: 4, 
      name: { zh: '腊汁肉夹馍', es: 'Rougamou (Hamburguesa China)' },
      price: 12, 
      status: 'active', 
      desc: { zh: '白吉馍，慢炖五花肉，青椒碎。', es: 'Pan plano crujiente, panceta estofada a fuego lento.' },
      img: 'https://images.unsplash.com/photo-1601356616077-695728ae17ec?q=80&w=800&auto=format&fit=crop' 
    },
    { 
      id: 5, 
      name: { zh: '秦镇米皮', es: 'Liangpi (Piel Fría)' },
      price: 14, 
      status: 'sold_out', 
      desc: { zh: '蒸米浆皮，芝麻酱，黄瓜丝，辣油。', es: 'Piel de arroz al vapor, salsa de sésamo, pepino, aceite de chile.' },
      img: 'https://images.unsplash.com/photo-1511914678378-2906b1f69dcf?q=80&w=800&auto=format&fit=crop' 
    },
  ],
  sharing: [
    { 
      id: 6, 
      name: { zh: '羊肉泡馍', es: 'Sopa de Cordero con Pan (Paomo)' },
      price: 28, 
      status: 'active', 
      desc: { zh: '羊骨浓汤，手掰馍粒，糖蒜，粉丝。', es: 'Caldo rico de cordero, trozos de pan plano, fideos de cristal, ajo encurtido.' },
      img: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=800&auto=format&fit=crop' 
    },
    { 
      id: 7, 
      name: { zh: '大漠孜然羊排', es: 'Costillas de Cordero al Comino' },
      price: 32, 
      status: 'active', 
      desc: { zh: '炸羊排，孜然，干辣椒，香菜。', es: 'Costillas fritas, corteza de comino, chile seco, cilantro.' },
      img: 'https://images.unsplash.com/photo-1544025162-d76690b67f61?q=80&w=800&auto=format&fit=crop' 
    },
  ]
};

const INITIAL_NOTICES = [
  { id: 1, title: { zh: '春节特别晚宴', es: 'Banquete del Año Nuevo Lunar' }, type: 'event', content: { zh: '2月10日晚8点，传统舞狮表演及八道式盛宴。', es: '10 de Feb, 20:00. Danza del León y banquete de 8 platos.' }, active: true },
  { id: 2, title: { zh: '会员专属礼遇', es: 'Exclusivo Socios' }, type: 'promo', content: { zh: '金卡会员预订4人以上赠送精选红酒一支。', es: 'Socios Gold reciben una botella de vino en reservas de 4+ personas.' }, active: true },
  { id: 3, title: { zh: '时令上新：春笋', es: 'Temporada: Brotes de Bambú' }, type: 'news', content: { zh: '浙江空运鲜春笋，限时供应。', es: 'Brotes frescos de Zhejiang. Disponibilidad limitada.' }, active: true },
];

const INITIAL_RESERVATIONS = [
  { id: 101, name: 'Sr. Wayne', phone: '000-001', date: 'Today', time: '19:00', guests: 2, status: 'confirmed', note: 'Mesa ventana' },
];

export default function App() {
  // --- State ---
  const [lang, setLang] = useState('zh'); 
  const [viewMode, setViewMode] = useState('client'); 
  const [activeTab, setActiveTab] = useState('home'); 
  
  // Auth State
  const [currentUser, setCurrentUser] = useState(null); 
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Data State
  const [menuData, setMenuData] = useState(INITIAL_MENU);
  const [reservations, setReservations] = useState(INITIAL_RESERVATIONS);
  const [notices, setNotices] = useState(INITIAL_NOTICES);
  
  // Persistent Identity
  useEffect(() => {
    const savedUser = localStorage.getItem('changan_user_v2');
    if (savedUser) setCurrentUser(JSON.parse(savedUser));
  }, []);

  const handleLogin = (userData) => {
    const role = userData.isMember ? 'member' : 'guest';
    const isAdmin = userData.phone === CONFIG.ADMIN_PHONE;
    
    const userWithRole = { 
      ...userData, 
      role: isAdmin ? 'admin' : role, 
      level: isAdmin ? 'Manager' : (role === 'member' ? 'Gold' : 'Visitor') 
    };
    setCurrentUser(userWithRole);
    localStorage.setItem('changan_user_v2', JSON.stringify(userWithRole));
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('changan_user_v2');
    setActiveTab('home');
  };

  // --- AI State ---
  const [isOracleOpen, setIsOracleOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (isOracleOpen && chatHistory.length === 0) {
      let greeting = T[lang].welcome;
      if (currentUser?.role === 'admin') greeting = T[lang].welcome_admin;
      else if (currentUser?.role === 'member') greeting = `${T[lang].welcome_member} ${currentUser.level} ${currentUser.name}.`;
      
      setChatHistory([{ role: 'system', text: greeting }]);
    }
  }, [isOracleOpen, currentUser, lang]); 

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatHistory, isOracleOpen]);

  // --- MOCK INTELLIGENCE ENGINE ---
  const simulateAiResponse = async (input, lang, user) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const lowerInput = input.toLowerCase();
        let responseText = "";
        let jsonAction = "";

        if (lowerInput === '/admin') {
           resolve({ text: "...", action: "ADMIN_TRIGGER" });
           return;
        }

        if (lowerInput.includes('book') || lowerInput.includes('reserv') || lowerInput.includes('订') || lowerInput.includes('mesa')) {
           const guestMatch = input.match(/(\d+)/); 
           const guests = guestMatch ? guestMatch[0] : "2";
           
           if (!user) {
             responseText = lang === 'zh' 
               ? "我非常乐意为您安排。请先登录您的账户，以便我确认预订信息。"
               : "Me encantaría ayudarle con eso. Por favor, inicie sesión para confirmar los detalles.";
           } else {
             responseText = lang === 'zh'
               ? `好的，${user.name}。我为您查询了空位。为您预留今晚的桌位。`
               : `Entendido, ${user.name}. He verificado la disponibilidad. Reservando una mesa para esta noche.`;
             
             jsonAction = `$$JSON_ACTION$$ { "type": "create_reservation", "name": "${user.name}", "phone": "${user.phone}", "date": "Today", "time": "19:00", "guests": "${guests}" } $$END_JSON$$`;
           }
        }
        else if (lowerInput.includes('recommend') || lowerInput.includes('menu') || lowerInput.includes('推荐') || lowerInput.includes('吃') || lowerInput.includes('qué') || lowerInput.includes('que')) {
           if (lowerInput.includes('spicy') || lowerInput.includes('辣') || lowerInput.includes('picante')) {
             responseText = lang === 'zh'
               ? "如果您喜欢吃辣，我们的【油泼面】是必点之选。滚烫的热油激发出辣椒面的浓郁香气，口感劲道。另外【大漠孜然羊排】也是绝佳的佐酒菜。"
               : "Si le gusta lo picante, nuestros 【Fideos Youpo】 son imprescindibles. El aceite hirviendo despierta el aroma del chile. También recomiendo las 【Costillas de Cordero al Comino】.";
           } else {
             responseText = lang === 'zh'
               ? "对于初次光临的客人，我强烈推荐我们的招牌【Biang Biang 面】搭配【腊汁肉夹馍】。这是最地道的长安风味。"
               : "Para su primera visita, le recomiendo encarecidamente nuestros 【Fideos Biang Biang】 acompañados de un 【Rougamou】. Es el sabor más auténtico de Chang'an.";
           }
        }
        else {
           responseText = lang === 'zh'
             ? "我是您的智能管家。您可以问我“有什么推荐菜？”或者告诉我“帮我订个位”。"
             : "Soy su Concierge IA. Puede preguntarme '¿Qué recomienda?' o decirme 'Quiero reservar una mesa'.";
        }

        resolve({ text: responseText + (jsonAction ? "\n" + jsonAction : "") });
      }, 1200); 
    });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const cleanInput = inputMessage.trim().toLowerCase();
    
    if (cleanInput === '/admin') {
      if (currentUser && currentUser.phone === CONFIG.ADMIN_PHONE) {
        setChatHistory(prev => [...prev, { role: 'user', text: inputMessage }]);
        setTimeout(() => {
          setViewMode('admin');
          setInputMessage('');
          setIsOracleOpen(false);
        }, 500);
        return;
      } else {
        setChatHistory(prev => [...prev, { role: 'user', text: inputMessage }]);
        setTimeout(() => {
            setChatHistory(prev => [...prev, { role: 'ai', text: lang === 'zh' ? "抱歉，我无法识别该指令。" : "Lo siento, comando no reconocido." }]);
        }, 600);
        setInputMessage('');
        return;
      }
    }

    const userMsg = inputMessage;
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setInputMessage('');
    setIsAiLoading(true);

    try {
      const data = await simulateAiResponse(userMsg, lang, currentUser);
      let aiText = data.text;

      if (aiText.includes('$$JSON_ACTION$$')) {
        const [displayText, jsonPart] = aiText.split('$$JSON_ACTION$$');
        const jsonString = jsonPart.split('$$END_JSON$$')[0];
        try {
          const bookingData = JSON.parse(jsonString);
          if (bookingData.type === 'create_reservation') {
            const newRes = { id: Date.now(), ...bookingData, status: 'pending', note: 'AI Booking' };
            setReservations(prev => [...prev, newRes]);
            aiText = displayText + (lang === 'zh' ? "\n\n[系统]: 预订请求已发送" : "\n\n[Sistema]: Solicitud enviada");
          }
        } catch (e) {}
      }
      setChatHistory(prev => [...prev, { role: 'ai', text: aiText }]);
    } catch (e) { 
      setChatHistory(prev => [...prev, { role: 'ai', text: "Error." }]); 
    } finally { 
      setIsAiLoading(false); 
    }
  };

  if (viewMode === 'admin') {
    return (
      <AdminDashboard 
        reservations={reservations} 
        setReservations={setReservations}
        menuData={menuData} 
        setMenuData={setMenuData}
        notices={notices}
        setNotices={setNotices}
        onExit={() => setViewMode('client')} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-200 font-sans pb-24 md:pb-0 flex flex-col">
      
      {/* Mobile Header */}
      <div className="md:hidden flex justify-between items-center p-4 bg-stone-950/90 backdrop-blur sticky top-0 z-40 border-b border-stone-800">
        <span className="text-xl font-serif font-bold text-white tracking-widest">{T[lang].brand}</span>
        <div className="flex items-center gap-4">
          <button onClick={() => setLang(lang === 'zh' ? 'es' : 'zh')} className="text-xs uppercase font-bold text-stone-400 border border-stone-700 px-2 py-1 rounded hover:text-white">
            {lang === 'zh' ? 'ES' : '中文'}
          </button>
          {CONFIG.ENABLE_RESERVATIONS && (
            <button onClick={() => setIsOracleOpen(true)} className="text-amber-500 animate-pulse"><Sparkles size={24} /></button>
          )}
        </div>
      </div>

      {/* Desktop Nav - Centered Layout */}
      <nav className="hidden md:flex fixed w-full z-50 py-6 px-10 justify-between items-center bg-stone-950/90 backdrop-blur border-b border-stone-800/50">
        <div className="flex flex-col w-1/4">
          <div className="text-2xl font-serif tracking-widest font-bold text-white border-l-4 border-amber-600 pl-3 leading-none">
            {T[lang].brand}
          </div>
          <span className="text-[10px] text-amber-600/80 uppercase tracking-[0.2em] pl-4 mt-1">{T[lang].subtitle}</span>
        </div>

        <div className="flex justify-center w-2/4 space-x-12 text-sm tracking-widest uppercase font-medium">
          <NavTextBtn label={T[lang].nav_home} active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
          <NavTextBtn label={T[lang].nav_menu} active={activeTab === 'menu'} onClick={() => setActiveTab('menu')} />
          <NavTextBtn label={T[lang].nav_events} active={activeTab === 'events'} onClick={() => setActiveTab('events')} />
          {CONFIG.ENABLE_RESERVATIONS && <NavTextBtn label={T[lang].nav_bookings} active={activeTab === 'profile'} onClick={() => currentUser ? setActiveTab('profile') : setShowLoginModal(true)} />}
        </div>

        <div className="flex items-center justify-end gap-6 w-1/4">
          <button onClick={() => setLang(lang === 'zh' ? 'es' : 'zh')} className="flex items-center gap-1 text-xs font-bold text-stone-400 hover:text-white transition-colors">
            <Globe size={14} /> {lang === 'zh' ? 'ES' : '中文'}
          </button>
          
          {CONFIG.ENABLE_RESERVATIONS && (
            <button onClick={() => { if(!currentUser) setShowLoginModal(true); setIsOracleOpen(true); }} className="flex items-center gap-2 text-amber-500 hover:text-amber-400 transition-all">
              <Sparkles size={16} />
            </button>
          )}

          <div className="text-xs uppercase tracking-wider">
            {currentUser ? (
              <span className="flex items-center gap-2 text-amber-600 border border-amber-900/50 px-3 py-1.5 rounded-full bg-stone-900/50">
                {currentUser.role === 'admin' ? <ShieldCheck size={14} /> : currentUser.role === 'member' ? <Crown size={14} fill="currentColor" /> : <User size={14} />} 
                {currentUser.role === 'admin' ? 'ADMIN' : currentUser.name}
              </span>
            ) : (
              <button onClick={() => setShowLoginModal(true)} className="hover:text-white flex items-center gap-2 border border-stone-600 px-3 py-1.5 rounded-full transition-colors hover:border-white"><LogIn size={14} /> {T[lang].sign_in}</button>
            )}
          </div>
        </div>
      </nav>

      {/* Login Modal */}
      {showLoginModal && <AuthModal lang={lang} t={T[lang]} onClose={() => setShowLoginModal(false)} onLogin={handleLogin} />}

      {/* Main Content - Improved Centering */}
      <main className="flex-grow flex flex-col items-center w-full">
        {activeTab === 'home' && (
          <HeroSection 
            lang={lang}
            t={T[lang]}
            notices={notices} 
            reservationsEnabled={CONFIG.ENABLE_RESERVATIONS}
            onCta={() => { 
              if (CONFIG.ENABLE_RESERVATIONS) {
                if(!currentUser) setShowLoginModal(true); 
                setIsOracleOpen(true); 
              } else {
                setActiveTab('menu');
              }
            }} 
          />
        )}
        <div className="w-full max-w-7xl mx-auto">
          {activeTab === 'menu' && <MenuSection lang={lang} t={T[lang]} menuData={menuData} isMember={currentUser?.role === 'member'} />}
          {activeTab === 'events' && <EventsSection lang={lang} t={T[lang]} notices={notices} />}
          {activeTab === 'profile' && <ProfileSection lang={lang} t={T[lang]} user={currentUser} myBookings={reservations.filter(r => r.phone === currentUser?.phone)} onLogout={handleLogout} />}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-stone-950 border-t border-stone-800 py-8 px-6 text-center w-full mt-auto">
        <p className="text-stone-600 text-xs uppercase tracking-widest mb-4">
          {T[lang].footer_copy}
        </p>
        <button 
          onClick={() => {
            if (!CONFIG.ENABLE_RESERVATIONS) {
               if(window.confirm(`${T[lang].staff_access}?`)) setViewMode('admin');
            } else {
               if (currentUser?.phone === CONFIG.ADMIN_PHONE) {
                 setViewMode('admin');
               } else {
                 alert(lang === 'zh' ? "权限受限。请以经理身份登录。" : "Acceso restringido. Inicie sesión como Gerente.");
                 setShowLoginModal(true);
               }
            }
          }}
          className="inline-flex items-center gap-1 text-stone-800 hover:text-stone-600 transition-colors text-[10px] uppercase tracking-wider"
        >
          <Lock size={10} /> {T[lang].staff_access}
        </button>
      </footer>

      {/* Mobile Bottom Nav - 2-1-2 Symmetry */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-stone-900 border-t border-stone-800 flex justify-between items-end px-4 py-2 z-50 safe-area-bottom h-[80px]">
        {/* Left Side (2 items) */}
        <div className="flex gap-1 w-[35%] justify-around pb-2">
          <NavIconBtn icon={<Utensils size={20} />} label={T[lang].nav_menu} active={activeTab === 'menu'} onClick={() => setActiveTab('menu')} />
          <NavIconBtn icon={<Megaphone size={20} />} label={T[lang].nav_events} active={activeTab === 'events'} onClick={() => setActiveTab('events')} />
        </div>

        {/* Center Floating Button (1 item) */}
        <div className="relative -top-6 w-[20%] flex justify-center" onClick={() => setActiveTab('home')}>
           <div className="bg-amber-600 p-4 rounded-full shadow-[0_0_15px_rgba(217,119,6,0.4)] border-4 border-stone-950 transform hover:scale-105 transition-transform">
             <ChefHat className="text-white" size={28} />
           </div>
        </div>

        {/* Right Side (2 items) */}
        <div className="flex gap-1 w-[35%] justify-around pb-2">
          {/* Item 4: AI Concierge (Adding this creates symmetry) */}
          {CONFIG.ENABLE_RESERVATIONS ? (
             <NavIconBtn 
               icon={<Sparkles size={20} />} 
               label={T[lang].nav_ai} 
               active={isOracleOpen} 
               onClick={() => { if(!currentUser) setShowLoginModal(true); setIsOracleOpen(true); }} 
             />
          ) : (
             <NavIconBtn icon={<Phone size={20} />} label="Tel" onClick={() => alert("Call: +34 91 123 4567")} />
          )}

          {/* Item 5: Profile/Login */}
          {CONFIG.ENABLE_RESERVATIONS ? (
            <NavIconBtn 
              icon={<User size={20} />} 
              label={currentUser ? (lang ==='zh'?'我':'Yo') : T[lang].sign_in} 
              active={activeTab === 'profile'} 
              onClick={() => currentUser ? setActiveTab('profile') : setShowLoginModal(true)} 
            />
          ) : (
            <NavIconBtn icon={<MapPin size={20} />} label={T[lang].nav_info} onClick={() => alert("10 Gordon Street, London")} />
          )}
        </div>
      </div>

      {/* AI Chat Drawer */}
      {CONFIG.ENABLE_RESERVATIONS && isOracleOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-black/80 backdrop-blur-sm md:items-center md:justify-center p-0 md:p-4 animate-in fade-in zoom-in duration-200">
          <div className="flex flex-col h-full w-full md:max-w-md md:h-[600px] bg-stone-900 md:rounded-lg shadow-2xl overflow-hidden border border-stone-800">
            <div className="bg-stone-950 p-4 flex justify-between items-center border-b border-stone-800">
              <div className="flex items-center gap-2">
                <Sparkles className="text-amber-500" size={18} />
                <h3 className="font-serif text-lg text-white">
                  {currentUser?.role === 'admin' ? 'SYSTEM ADMIN' : T[lang].nav_ai}
                </h3>
              </div>
              <button onClick={() => setIsOracleOpen(false)} className="p-2 hover:bg-stone-800 rounded-full"><X size={20} className="text-stone-400" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl p-4 text-sm ${msg.role === 'user' ? 'bg-amber-700 text-white' : 'bg-stone-800 text-stone-300'}`}>
                    {msg.text.split('\n').map((l, i) => <React.Fragment key={i}>{l}<br/></React.Fragment>)}
                  </div>
                </div>
              ))}
              {isAiLoading && <div className="text-stone-500 text-xs ml-4 flex gap-2"><Loader2 className="animate-spin" size={12} /> Thinking...</div>}
              <div ref={chatEndRef} />
            </div>
            <div className="p-4 bg-stone-950 border-t border-stone-800">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={inputMessage} 
                  onChange={e => setInputMessage(e.target.value)} 
                  onKeyDown={e => e.key === 'Enter' && handleSendMessage()} 
                  className="flex-1 bg-stone-900 border border-stone-700 rounded-full px-4 py-2 text-sm text-white focus:border-amber-600 outline-none" 
                  placeholder={currentUser?.role === 'admin' ? T[lang].ai_admin_placeholder : T[lang].ai_placeholder} 
                />
                <button onClick={handleSendMessage} disabled={!inputMessage.trim()} className="bg-amber-600 text-white p-2 rounded-full"><Send size={18} /></button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- SUB-COMPONENTS ---

function AuthModal({ lang, t, onClose, onLogin }) {
  const [mode, setMode] = useState('guest'); 
  const [formData, setFormData] = useState({ name: '', phone: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({ 
      name: formData.name, 
      phone: formData.phone, 
      isMember: mode === 'member' 
    });
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-stone-900 border border-stone-800 w-full max-w-sm relative shadow-2xl overflow-hidden">
        <button onClick={onClose} className="absolute top-4 right-4 text-stone-500 hover:text-white"><X size={24} /></button>
        <div className="flex border-b border-stone-800">
          <button onClick={() => setMode('guest')} className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest ${mode === 'guest' ? 'bg-amber-700 text-white' : 'text-stone-500 hover:text-stone-300'}`}>{t.login_guest_tab}</button>
          <button onClick={() => setMode('member')} className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest ${mode === 'member' ? 'bg-amber-900/50 text-amber-500' : 'text-stone-500 hover:text-stone-300'}`}>{t.login_member_tab}</button>
        </div>
        <div className="p-8">
          <div className="text-center mb-6">
            {mode === 'member' ? <Crown size={40} className="mx-auto text-amber-500 mb-4" /> : <User size={40} className="mx-auto text-stone-500 mb-4" />}
            <h2 className="text-2xl font-serif text-white mb-1">{t.login_title}</h2>
            <p className="text-stone-500 text-xs">{mode === 'member' ? t.login_desc_member : t.login_desc_guest}</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" placeholder={t.name_placeholder} required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-stone-950 border border-stone-800 p-3 text-white outline-none focus:border-amber-600" />
            <input type="tel" placeholder={t.phone_placeholder} required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-stone-950 border border-stone-800 p-3 text-white outline-none focus:border-amber-600" />
            <p className="text-[10px] text-stone-600 text-center">({t.hint_admin})</p>
            {mode === 'member' && (
              <div className="animate-in fade-in slide-in-from-top-2">
                 <input type="password" placeholder={t.pass_placeholder} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-stone-950 border border-stone-800 p-3 text-white outline-none focus:border-amber-600" />
              </div>
            )}
            <button type="submit" className={`w-full py-3 font-bold uppercase tracking-widest text-xs transition-colors ${mode === 'member' ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-stone-700 hover:bg-stone-600 text-white'}`}>
              {mode === 'member' ? t.btn_member : t.btn_guest}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function HeroSection({ lang, t, notices, onCta, reservationsEnabled }) {
  const latestNotice = notices.find(n => n.active);
  return (
    <div className="relative h-screen md:h-[90vh] flex items-center justify-center overflow-hidden w-full">
       {latestNotice && (
         <div className="absolute top-20 md:top-24 left-0 right-0 z-20 flex justify-center">
           <div className="bg-amber-900/80 backdrop-blur border border-amber-700/50 px-6 py-2 rounded-full flex items-center gap-3 animate-fade-in-down shadow-lg cursor-pointer max-w-[90%]">
             <Megaphone size={14} className="text-amber-200 animate-pulse" />
             <span className="text-xs font-bold text-amber-100 uppercase tracking-wider truncate">{latestNotice.title[lang]}: {latestNotice.content[lang]}</span>
           </div>
         </div>
       )}
       <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1552611052-33e04de081de?q=80&w=2600&auto=format&fit=crop" className="w-full h-full object-cover opacity-50" alt="bg" />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/60 via-stone-950/20 to-stone-950"></div>
       </div>
       <div className="relative z-10 text-center px-6 max-w-lg mx-auto">
         <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-none">
            {t.hero_title_1}<br/>
            {t.hero_title_2}<span className="text-amber-600">'</span>{t.hero_title_3}
         </h1>
         <p className="text-stone-300 text-lg font-light mb-8 whitespace-pre-line">{t.hero_desc}</p>
         <button onClick={onCta} className={`w-full md:w-auto text-white px-8 py-4 uppercase tracking-widest text-xs font-bold transition-all shadow-[0_0_20px_rgba(180,83,9,0.3)] ${reservationsEnabled ? 'bg-amber-700 hover:bg-amber-600' : 'border border-stone-400 hover:bg-white hover:text-stone-950'}`}>
           {reservationsEnabled ? t.book_via_ai : t.view_menu}
         </button>
       </div>
    </div>
  );
}

function MenuSection({ lang, t, menuData, isMember }) {
  return (
    <div className="py-24 px-6 max-w-6xl mx-auto w-full">
      {isMember && (
        <div className="mb-12 bg-amber-900/20 border border-amber-700/30 p-4 flex items-center gap-3 rounded-lg justify-center animate-fade-in">
          <Crown size={20} className="text-amber-500" />
          <p className="text-amber-200 text-sm font-medium">{t.member_price_active}</p>
        </div>
      )}
      <div className="space-y-16">
        {Object.entries(menuData).map(([category, items]) => (
          <div key={category}>
            <h3 className="text-amber-600 uppercase tracking-widest text-xs font-bold mb-8 border-b border-stone-800 pb-2">{category}</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {items.map(item => {
                const finalPrice = isMember ? (item.price * (1 - CONFIG.MEMBER_DISCOUNT)).toFixed(1) : item.price;
                return (
                  <div key={item.id} className="group bg-stone-900/50 rounded-lg overflow-hidden border border-stone-800 hover:border-amber-800 transition-all hover:shadow-xl">
                    <div className="h-48 overflow-hidden relative">
                      <img src={item.img} alt={item.name[lang]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-transparent opacity-80"></div>
                      <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur px-3 py-1 rounded text-white font-bold border border-white/10">
                        {CONFIG.CURRENCY}{finalPrice}
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-baseline mb-2">
                        <h4 className="text-xl text-white font-serif group-hover:text-amber-500 transition-colors">{item.name[lang]}</h4>
                        {isMember && <span className="text-[10px] text-stone-500 line-through">{CONFIG.CURRENCY}{item.price}</span>}
                      </div>
                      <p className="text-stone-400 text-sm leading-relaxed">{item.desc[lang]}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EventsSection({ lang, t, notices }) {
  return (
    <div className="py-24 px-6 max-w-5xl mx-auto min-h-screen w-full">
      <div className="text-center mb-16">
        <span className="text-amber-600 uppercase tracking-widest text-xs font-bold mb-2 block">{t.happening}</span>
        <h2 className="text-4xl font-serif text-white">{t.events_title}</h2>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {notices.map(notice => (
          <div key={notice.id} className="bg-stone-900 border border-stone-800 group hover:border-amber-700 transition-all overflow-hidden relative">
            <div className={`h-1 w-full ${notice.type === 'event' ? 'bg-red-600' : notice.type === 'promo' ? 'bg-amber-500' : 'bg-blue-500'}`}></div>
            <div className="p-8">
              <span className={`text-[10px] uppercase tracking-widest px-2 py-1 rounded mb-4 inline-block ${notice.type === 'event' ? 'bg-red-900/30 text-red-500' : notice.type === 'promo' ? 'bg-amber-900/30 text-amber-500' : 'bg-blue-900/30 text-blue-500'}`}>{notice.type}</span>
              <h3 className="text-xl font-serif text-white mb-4 group-hover:text-amber-500 transition-colors">{notice.title[lang]}</h3>
              <p className="text-stone-400 text-sm leading-relaxed mb-6">{notice.content[lang]}</p>
              <button className="text-xs uppercase tracking-widest text-stone-500 hover:text-white flex items-center gap-2">{t.details} <ArrowRight size={12} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfileSection({ lang, t, user, myBookings, onLogout }) {
  if (!user) return null;
  return (
    <div className="py-24 px-6 max-w-lg mx-auto min-h-screen w-full">
      <div className="text-center mb-12">
        <div className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center border-4 mb-4 ${user.role === 'admin' ? 'bg-stone-200 border-stone-500' : user.role === 'member' ? 'bg-amber-900/20 border-amber-500' : 'bg-stone-800 border-stone-600'}`}>
          {user.role === 'admin' ? <ShieldCheck size={40} className="text-stone-800" /> : user.role === 'member' ? <Crown size={40} className="text-amber-500" /> : <User size={40} className="text-stone-400" />}
        </div>
        <h2 className="text-3xl font-serif text-white mb-1">{user.name}</h2>
        <div className="flex justify-center items-center gap-2 mb-2"><span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded ${user.role === 'member' ? 'bg-amber-600 text-white' : 'bg-stone-700 text-stone-300'}`}>{user.level}</span></div>
        <p className="text-stone-500 text-sm">{user.phone}</p>
        <button onClick={onLogout} className="mt-6 text-xs text-red-500 hover:text-red-400 border border-red-900/30 px-4 py-2 rounded-full flex items-center gap-2 mx-auto transition-colors hover:bg-red-900/10"><LogOut size={14} /> {t.sign_out}</button>
      </div>
      <div className="space-y-6">
        <h3 className="text-stone-400 uppercase tracking-widest text-xs font-bold border-b border-stone-800 pb-2">{t.upcoming_res}</h3>
        {myBookings.length === 0 ? (
          <div className="text-center py-8 bg-stone-900/50 rounded-lg border border-stone-800 border-dashed"><p className="text-stone-600 text-sm">{t.no_bookings}</p></div>
        ) : (
          myBookings.map(b => (
            <div key={b.id} className="bg-stone-900 border border-stone-800 p-5 rounded-lg flex justify-between items-center">
              <div><p className="text-white font-medium mb-1">{b.date} @ {b.time}</p><p className="text-stone-500 text-xs">{b.guests} {t.guest} • {b.note}</p></div>
              <span className="text-xs bg-green-900/30 text-green-500 px-2 py-1 rounded uppercase font-bold">{t[b.status] || b.status}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// --- RESTORED ADMIN DASHBOARD ---
function AdminDashboard({ reservations, setReservations, menuData, setMenuData, notices, setNotices, onExit }) {
  const [adminTab, setAdminTab] = useState('dashboard');

  const handleStatusChange = (id, newStatus) => {
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
  };

  const deleteNotice = (id) => {
    setNotices(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-800 font-sans flex">
      <aside className="w-64 bg-stone-900 text-white flex flex-col hidden md:flex">
        <div className="p-6 border-b border-stone-800"><h2 className="text-xl font-bold tracking-widest">CHANG'AN</h2><p className="text-xs text-stone-500 mt-1">Admin Panel</p></div>
        <nav className="flex-1 p-4 space-y-2">
          <AdminLink icon={<LayoutDashboard size={18} />} label="Dashboard" active={adminTab === 'dashboard'} onClick={() => setAdminTab('dashboard')} />
          <AdminLink icon={<Calendar size={18} />} label="Reservations" active={adminTab === 'reservations'} onClick={() => setAdminTab('reservations')} count={reservations.filter(r => r.status === 'pending').length} />
          <AdminLink icon={<Utensils size={18} />} label="Menu" active={adminTab === 'menu'} onClick={() => setAdminTab('menu')} />
          <AdminLink icon={<Megaphone size={18} />} label="Notices" active={adminTab === 'notices'} onClick={() => setAdminTab('notices')} />
        </nav>
        <div className="p-4 border-t border-stone-800"><button onClick={onExit} className="flex items-center gap-3 text-stone-400 hover:text-white w-full px-4 py-2"><LogOut size={18} /> Exit Admin</button></div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className="bg-white p-6 shadow-sm flex justify-between items-center sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-stone-800 capitalize">{adminTab}</h1>
          <button onClick={onExit} className="md:hidden text-stone-500"><LogOut size={20} /></button>
        </header>

        <div className="p-8">
          {adminTab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard label="Live Revenue" value="€4,280" color="bg-green-500" />
              <StatCard label="Pending Bookings" value={reservations.filter(r => r.status === 'pending').length} color="bg-amber-500" />
              <StatCard label="Active Notices" value={notices.length} color="bg-blue-500" />
            </div>
          )}

          {adminTab === 'reservations' && (
            <div className="bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-stone-50 text-stone-500 text-xs uppercase tracking-wider"><tr><th className="p-4">Guest</th><th className="p-4">Slot</th><th className="p-4">Status</th><th className="p-4">Actions</th></tr></thead>
                <tbody className="divide-y divide-stone-100 text-sm">
                  {reservations.sort((a,b) => b.id - a.id).map(res => (
                    <tr key={res.id} className="hover:bg-stone-50">
                      <td className="p-4"><p className="font-bold">{res.name}</p><p className="text-xs text-stone-500">{res.phone} • {res.guests} ppl</p></td>
                      <td className="p-4">{res.time} ({res.date})</td>
                      <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs font-bold ${res.status === 'confirmed' ? 'bg-green-100 text-green-700' : res.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>{res.status}</span></td>
                      <td className="p-4 flex gap-2">{res.status === 'pending' && (<><button onClick={() => handleStatusChange(res.id, 'confirmed')} className="p-2 bg-green-50 text-green-600 rounded"><CheckCircle size={16} /></button><button onClick={() => handleStatusChange(res.id, 'rejected')} className="p-2 bg-red-50 text-red-600 rounded"><X size={16} /></button></>)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {adminTab === 'menu' && (
            <div className="grid gap-4">
               {Object.entries(menuData).flatMap(([cat, items]) => items).map(item => (
                 <div key={item.id} className="flex items-center justify-between p-4 bg-white border border-stone-200 rounded">
                   <div className="flex items-center gap-4">
                     <img src={item.img} className="w-12 h-12 rounded object-cover" alt="" />
                     <div><p className="font-bold">{item.name.zh} / {item.name.es}</p><p className="text-xs text-stone-500">€{item.price}</p></div>
                   </div>
                   <button className="text-stone-400 hover:text-amber-600"><Edit3 size={18} /></button>
                 </div>
               ))}
            </div>
          )}

          {adminTab === 'notices' && (
            <div className="space-y-4">
              <button onClick={() => setNotices([...notices, { id: Date.now(), title: { zh: '新公告', es: 'Nuevo Aviso' }, type: 'news', content: { zh: '...', es: '...' }, active: true }])} className="bg-stone-900 text-white px-4 py-2 rounded text-sm mb-4">Add Notice</button>
              {notices.map(notice => (
                <div key={notice.id} className="bg-white p-4 border border-stone-200 rounded flex justify-between items-start">
                  <div><h4 className="font-bold">{notice.title.zh}</h4><p className="text-sm text-stone-600">{notice.content.zh}</p><span className="text-xs bg-stone-100 px-2 py-0.5 rounded mt-2 inline-block uppercase">{notice.type}</span></div>
                  <button onClick={() => deleteNotice(notice.id)} className="text-red-400 hover:text-red-600"><Trash2 size={18} /></button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

const AdminLink = ({ icon, label, active, onClick, count }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-colors ${active ? 'bg-amber-600 text-white' : 'text-stone-400 hover:bg-stone-800 hover:text-white'}`}>{icon}<span className="flex-1 text-left">{label}</span>{count > 0 && <span className="text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full">{count}</span>}</button>
);
const StatCard = ({ label, value, color }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-200 relative overflow-hidden"><div className={`absolute top-0 right-0 w-16 h-16 transform translate-x-4 -translate-y-4 rounded-full opacity-10 ${color}`}></div><p className="text-stone-500 text-sm font-medium uppercase tracking-wider">{label}</p><p className="text-3xl font-bold text-stone-800 mt-2">{value}</p></div>
);
const NavTextBtn = ({ label, active, onClick }) => (
  <button onClick={onClick} className={`hover:text-amber-500 transition-colors ${active ? 'text-amber-500' : 'text-stone-400'}`}>{label}</button>
);
// Updated Button Component for Mobile Sizing
const NavIconBtn = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`flex flex-col items-center justify-center gap-1 w-full h-full ${active ? 'text-amber-500' : 'text-stone-600'}`}>
    {icon}
    <span className="text-[10px] font-medium leading-none">{label}</span>
  </button>
);
