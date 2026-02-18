import React, { useState, useEffect } from 'react';
import { 
  Utensils, 
  Bell, 
  ShoppingCart, 
  CheckCircle, 
  Clock, 
  Trash2, 
  Store, 
  Sparkles,
  BrainCircuit,
  Pizza,
  Droplets,
  StickyNote,
  HandMetal,
  UserPlus,
  X,
  Beer,
  LayoutDashboard,
  Users,
  ChefHat,
  BarChart3,
  AlertCircle,
  ArrowUpRight,
  CreditCard,
  Wallet,
  Smartphone,
  TrendingUp
} from 'lucide-react';

// --- API 설정 ---
const apiKey = ""; 

// --- 다국어 번역 데이터 ---
const TRANSLATIONS = {
  ko: {
    main: '메인', side: '사이드', drink: '드링크',
    orderList: '주문서', total: '총 합계', orderBtn: '주문하기',
    callStaff: '직원호출', aiRec: 'AI 추천', pairing: 'AI 소믈리에에게 페어링 묻기',
    empty: '비어있음', success: '주문이 성공적으로 전달되었습니다!',
    table: '테이블', dining: '다이닝 요리', sideDish: '곁들임 메뉴', drinkRec: '추천 음료',
    aiTitle: 'AI Sommelier', aiSubtitle: '당신만을 위한 완벽한 페어링을 제안합니다.',
    aiOk: '취향 저격! 고마워요', analyze: '분석 중...',
    adminTitle: 'AI 경영 대시보드', adminSub: '매장 데이터를 실시간으로 분석하여 최적의 운영 가이드를 제공합니다.',
    adminBtn: '분석 리프레시', startCook: '조리 수락', wait: '대기 중',
    lang: '한국어',
    callTitle: '무엇을 도와드릴까요?',
    callWater: '물', callNapkin: '냅킨', callWetTissue: '물티슈', callStaffOnly: '직원 호출',
    callRequested: '호출이 전달되었습니다.',
    confirm: '처리 완료',
    statsTitle: '오늘의 요약',
    sales: '오늘 매출',
    activeTables: '이용 중인 테이블',
    pendingOrders: '미처리 주문',
    calls: '직원 호출',
    paymentTitle: '결제 수단별 매출',
    bestMenu: '인기 메뉴 TOP 3'
  },
  en: {
    main: 'Main', side: 'Side', drink: 'Drink',
    orderList: 'Cart', total: 'Total', orderBtn: 'Place Order',
    callStaff: 'Call Staff', aiRec: 'AI Rec', pairing: 'Ask AI Sommelier',
    empty: 'Empty', success: 'Order placed!',
    table: 'Table', dining: 'Dining', sideDish: 'Sides', drinkRec: 'Drinks',
    aiTitle: 'AI Sommelier', aiSubtitle: 'Perfect pairing.',
    aiOk: 'Love it!', analyze: 'Analyzing...',
    adminTitle: 'AI Dashboard', adminSub: 'Real-time store management data.',
    adminBtn: 'Refresh AI', startCook: 'Accept', wait: 'Waiting',
    lang: 'English',
    callTitle: 'How can we help?',
    callWater: 'Water', callNapkin: 'Napkin', callWetTissue: 'Wet Tissue', callStaffOnly: 'Call Staff',
    callRequested: 'Request sent.',
    confirm: 'Done',
    statsTitle: 'Daily Summary',
    sales: 'Sales',
    activeTables: 'Active Tables',
    pendingOrders: 'Pending',
    calls: 'Calls',
    paymentTitle: 'Payments by Type',
    bestMenu: 'Top 3 Menus'
  },
  ja: {
    main: 'メイン', side: 'サイド', drink: 'ドリンク',
    orderList: '注文リスト', total: '合計', orderBtn: '注文',
    callStaff: '店員呼出', aiRec: 'AI 提案', pairing: 'AIソムリエ',
    empty: '空です', success: '注文完了!',
    table: 'テーブル', dining: 'メイン料理', sideDish: 'サイド', drinkRec: 'ドリンク',
    aiTitle: 'AIソムリエ', aiSubtitle: '最高のペアリング。',
    aiOk: 'ありがとう', analyze: '分析中...',
    adminTitle: 'AI経営ダッシュボード', adminSub: 'リアルタイム分析。',
    adminBtn: 'AI更新', startCook: '調理開始', wait: '待機',
    lang: '日本語',
    callTitle: '御用でしょうか？',
    callWater: '水', callNapkin: 'ナプキン', callWetTissue: 'ウェットティッシュ', callStaffOnly: '呼出',
    confirm: '確認',
    sales: '本日の売上',
    bestMenu: '人気メニュー'
  },
  zh: {
    main: '主菜', side: '配菜', drink: '饮料',
    orderList: '订单列表', total: '总计', orderBtn: '下单',
    callStaff: '呼叫', aiRec: 'AI 推荐', pairing: '询问 AI',
    empty: '空', success: '订单已提交!',
    table: '桌', dining: '精选主菜', sideDish: '精选配菜', drinkRec: '推荐饮品',
    aiTitle: 'AI 侍酒师', aiSubtitle: '为您推荐完美搭配。',
    aiOk: '谢谢', analyze: '分析中...',
    adminTitle: 'AI 经营仪表板', adminSub: '实时分析门店数据。',
    adminBtn: '更新分析', startCook: '接受', wait: '等待',
    lang: '中文',
    callTitle: '需要什么帮助？',
    confirm: '完成',
    sales: '今日销售额',
    bestMenu: '热门菜品'
  }
};

const MENU_DATA = [
  { id: 1, category: 'Main', name: { ko: '시그니처 채끝 스테이크', en: 'Signature Sirloin Steak', ja: '特製サーロイン', zh: '招牌牛排' }, price: 42000, img: '🥩' },
  { id: 2, category: 'Main', name: { ko: '수비드 토마호크', en: 'Sous-vide Tomahawk', ja: 'トマホーク', zh: '战斧牛排' }, price: 98000, img: '🍖' },
  { id: 3, category: 'Main', name: { ko: '트러플 콰트로 피자', en: 'Truffle Quattro Pizza', ja: 'トリュフピザ', zh: '松露披萨' }, price: 26000, img: '🍕' },
  { id: 101, category: 'Side', name: { ko: '부라타 치즈 샐러드', en: 'Burrata Cheese Salad', ja: 'ブッラータ', zh: '布拉塔' }, price: 16000, img: '🥗' },
  { id: 102, category: 'Side', name: { ko: '트러플 감자튀김', en: 'Truffle Fries', ja: 'トリュフポテト', zh: '松露薯条' }, price: 9000, img: '🍟' },
  { id: 201, category: 'Drink', name: { ko: '카베르네 소비뇽 (Red)', en: 'Cabernet Sauvignon', ja: '赤ワイン', zh: '红酒' }, price: 15000, img: '🍷' },
  { id: 205, category: 'Drink', name: { ko: '생맥주 (500ml)', en: 'Draft Beer', ja: '生ビール', zh: '扎啤' }, price: 8000, img: '🍺' },
];

const App = () => {
  const [lang, setLang] = useState('ko');
  const [activeView, setActiveView] = useState('admin');
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([
    { id: 1001, tableNo: 3, items: [{ name: { ko: '호출: 물', en: 'Call: Water', ja: '水', zh: '水' }, price: 0 }], status: 'call', time: '14:20' },
    { id: 1002, tableNo: 7, items: [{ name: { ko: '시그니처 채끝 스테이크', en: 'Steak', ja: 'ステーキ', zh: '牛排' }, price: 42000 }], status: 'pending', time: '14:18' },
    { id: 1003, tableNo: 1, items: [{ name: { ko: '트러플 감자튀김', en: 'Fries', ja: 'ポテト', zh: '薯条' }, price: 9000 }], status: 'pending', time: '14:15' },
  ]);
  const [activeCategory, setActiveCategory] = useState('Main');
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [adminAiInsight, setAdminAiInsight] = useState("현재 피크 타임입니다. 주방 인력을 메인 스테이션에 집중 배치하고, 스테이크 주문이 밀리지 않도록 관리하세요.");

  const t = TRANSLATIONS[lang] || TRANSLATIONS.ko;

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;
    const newOrder = {
      id: Date.now(),
      tableNo: 5,
      items: [...cart],
      totalPrice: cart.reduce((s, i) => s + i.price, 0),
      status: 'pending',
      time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    };
    setOrders([newOrder, ...orders]);
    setCart([]);
    setShowOrderSuccess(true);
    setTimeout(() => setShowOrderSuccess(false), 3000);
  };

  const handleStatusChange = (id) => {
    setOrders(orders.filter(o => o.id !== id));
  };

  const handleAiRecommend = async () => {
    setShowAiModal(true);
    setAiLoading(true);
    setTimeout(() => {
      setAiResponse(lang === 'ko' ? "채끝 스테이크와 레드 와인 페어링을 추천드려요!" : "We recommend pairing the Sirloin Steak with Red Wine!");
      setAiLoading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen bg-[#F8FAFC] font-sans text-slate-900 overflow-hidden">
      <header className="bg-white border-b px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex flex-col lg:flex-row justify-between gap-3 lg:gap-0 lg:items-center z-50 shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-100">
            <Store className="text-white w-6 h-6" />
          </div>
          <span className="font-black text-xl tracking-tight text-slate-800 uppercase">T-Order <span className="text-indigo-500">Premium</span></span>
        </div>
        
        <div className="flex items-center gap-3 sm:gap-4 lg:gap-6 w-full lg:w-auto justify-between lg:justify-end">
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 overflow-x-auto">
                {['ko', 'en', 'ja', 'zh'].map(l => (
                    <button key={l} onClick={() => setLang(l)} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${lang === l ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}>{TRANSLATIONS[l].lang}</button>
                ))}
            </div>
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
                <button onClick={() => setActiveView('customer')} className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all ${activeView === 'customer' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}><Users size={16}/> User</button>
                <button onClick={() => setActiveView('admin')} className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all ${activeView === 'admin' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}><LayoutDashboard size={16}/> Admin</button>
            </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden relative">
        {activeView === 'customer' ? (
          <div className="flex h-full flex-col lg:flex-row animate-in fade-in duration-500 overflow-hidden">
            <aside className="w-full lg:w-24 bg-slate-900 text-white flex lg:flex-col py-3 lg:py-8 px-4 lg:px-0 items-center justify-between lg:justify-start gap-4 lg:gap-10 shrink-0">
              <div className="flex items-center gap-6 lg:flex-col lg:gap-10">
              <button onClick={() => setActiveCategory('Main')} className={`flex flex-col items-center gap-2 ${activeCategory === 'Main' ? 'text-indigo-400' : 'text-slate-500'}`}><Utensils size={24} /><span className="text-[10px] font-bold">{t.main}</span></button>
              <button onClick={() => setActiveCategory('Side')} className={`flex flex-col items-center gap-2 ${activeCategory === 'Side' ? 'text-indigo-400' : 'text-slate-500'}`}><Pizza size={24} /><span className="text-[10px] font-bold">{t.side}</span></button>
              <button onClick={() => setActiveCategory('Drink')} className={`flex flex-col items-center gap-2 ${activeCategory === 'Drink' ? 'text-indigo-400' : 'text-slate-500'}`}><Beer size={24} /><span className="text-[10px] font-bold">{t.drink}</span></button>
              </div>
              <div className="flex items-center gap-6 lg:flex-col lg:mt-auto lg:space-y-8 lg:gap-0 lg:pb-4">
                <button onClick={handleAiRecommend} className="flex flex-col items-center text-indigo-400 animate-pulse"><Sparkles size={24} /><span className="text-[10px] font-bold mt-1">AI</span></button>
                <button onClick={() => setShowCallModal(true)} className="flex flex-col items-center text-slate-500"><Bell size={24} /><span className="text-[10px] font-bold mt-1">CALL</span></button>
              </div>
            </aside>

            <section className="flex-1 bg-white p-4 sm:p-6 lg:p-10 overflow-y-auto">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-6 sm:mb-8 lg:mb-10 flex justify-between items-center gap-3">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900">{activeCategory === 'Main' ? t.dining : activeCategory === 'Side' ? t.sideDish : t.drinkRec}</h2>
                        <div className="px-4 sm:px-6 py-2 bg-indigo-50 text-indigo-600 rounded-full font-bold border border-indigo-100 text-sm sm:text-base">{t.table} 05</div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                        {MENU_DATA.filter(m => m.category === activeCategory).map(item => (
                            <div key={item.id} onClick={() => setCart([...cart, item])} className="p-4 sm:p-5 lg:p-6 bg-slate-50 rounded-[1.8rem] sm:rounded-[2.5rem] border-2 border-transparent hover:border-indigo-500 hover:bg-white transition-all cursor-pointer flex items-center gap-4 sm:gap-5 lg:gap-6 group">
                                <div className="text-4xl sm:text-5xl group-hover:scale-110 transition-transform">{item.img}</div>
                                <div>
                                    <div className="font-black text-base sm:text-lg lg:text-xl">{item.name[lang]}</div>
                                    <div className="text-indigo-600 font-black mt-1 text-base sm:text-lg">{item.price.toLocaleString()}원</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <aside className="w-full lg:w-96 bg-slate-50 border-t lg:border-t-0 lg:border-l flex flex-col p-4 sm:p-6 lg:p-8 max-h-[42vh] lg:max-h-none">
                <h3 className="text-xl sm:text-2xl font-black mb-4 sm:mb-6 lg:mb-8">{t.orderList}</h3>
                <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                    {cart.map((item, idx) => (
                        <div key={idx} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex justify-between items-center animate-in slide-in-from-right-4">
                            <span className="font-bold">{item.name[lang]}</span>
                            <button onClick={() => {const n=[...cart]; n.splice(idx,1); setCart(n);}} className="text-red-400 p-2 hover:bg-red-50 rounded-lg"><Trash2 size={18}/></button>
                        </div>
                    ))}
                    {cart.length === 0 && <div className="h-full flex items-center justify-center text-slate-300 font-bold">{t.empty}</div>}
                </div>
                <div className="mt-5 sm:mt-6 lg:mt-8 pt-4 sm:pt-5 lg:pt-6 border-t border-slate-200">
                    <div className="flex justify-between items-end mb-4 sm:mb-5 lg:mb-6">
                        <span className="text-slate-400 font-bold uppercase text-xs tracking-widest">{t.total}</span>
                        <span className="text-2xl sm:text-3xl font-black text-indigo-600">{cart.reduce((s,i)=>s+i.price,0).toLocaleString()}원</span>
                    </div>
                    <button onClick={handlePlaceOrder} className="w-full py-4 sm:py-5 lg:py-6 bg-slate-900 text-white rounded-[1.4rem] sm:rounded-[2rem] font-black text-lg sm:text-xl shadow-xl shadow-slate-200 active:scale-95 transition-all">ORDER</button>
                </div>
            </aside>
          </div>
        ) : (
          <div className="h-full bg-[#F8FAFC] p-4 sm:p-6 lg:p-8 overflow-y-auto">
            <div className="max-w-[1400px] mx-auto space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden flex flex-col">
                  <div className="p-8 flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-emerald-100 text-emerald-600 text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">LIVE SALES</span>
                        <h4 className="text-slate-400 text-xs font-bold uppercase tracking-widest">{t.sales}</h4>
                      </div>
                      <div className="text-4xl font-black text-slate-900">₩2,450,000</div>
                    </div>
                    <div className="bg-emerald-50 px-4 py-2 rounded-2xl text-emerald-600 font-bold text-sm flex items-center gap-1">
                      <ArrowUpRight size={16}/> 12.5%
                    </div>
                  </div>

                  <div className="px-8 flex items-end gap-2 h-20 mb-6">
                    {[30, 45, 25, 60, 80, 55, 90, 100, 75, 85, 95, 110].map((h, i) => (
                      <div key={i} className="flex-1 bg-indigo-50 rounded-t-lg relative group transition-all hover:bg-indigo-500">
                        <div style={{height: `${h}%`}} className="w-full bg-indigo-200 rounded-t-lg group-hover:bg-indigo-500 transition-colors"></div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 border-t border-slate-50">
                    <div className="p-6 border-r border-slate-50 flex flex-col items-center gap-2">
                        <CreditCard size={20} className="text-slate-400" />
                        <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Card</div>
                        <div className="font-black text-slate-800">182만</div>
                    </div>
                    <div className="p-6 border-r border-slate-50 flex flex-col items-center gap-2">
                        <Smartphone size={20} className="text-slate-400" />
                        <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Pay</div>
                        <div className="font-black text-slate-800">54만</div>
                    </div>
                    <div className="p-6 flex flex-col items-center gap-2">
                        <Wallet size={20} className="text-slate-400" />
                        <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Cash</div>
                        <div className="font-black text-slate-800">9만</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                   <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                      <h5 className="text-slate-900 font-black mb-6 flex items-center gap-2"><TrendingUp size={18} className="text-indigo-600"/> {t.bestMenu}</h5>
                      <div className="space-y-5">
                         {[
                           { name: '채끝 스테이크', count: 42, icon: '🥩' },
                           { name: '트러플 감자튀김', count: 38, icon: '🍟' },
                           { name: '로제 파스타', count: 25, icon: '🍝' }
                         ].map((item, idx) => (
                           <div key={idx} className="flex justify-between items-center">
                              <div className="flex items-center gap-3 text-sm font-bold">
                                <span>{item.icon}</span> {item.name}
                              </div>
                              <span className="font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-xl text-xs">{item.count} 건</span>
                           </div>
                         ))}
                      </div>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm text-center">
                        <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">{t.activeTables}</div>
                        <div className="text-2xl font-black">8 / 12</div>
                      </div>
                      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm text-center">
                        <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">{t.pendingOrders}</div>
                        <div className="text-2xl font-black">{orders.filter(o=>o.status==='pending').length}</div>
                      </div>
                   </div>
                </div>
              </div>

              <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-6 relative z-10">
                    <div className="bg-white/10 p-5 rounded-3xl backdrop-blur-md border border-white/20">
                        <BrainCircuit size={40} className="text-indigo-400"/>
                    </div>
                    <div>
                        <h3 className="text-xl font-black">{t.adminTitle}</h3>
                        <p className="text-indigo-100/70 text-sm mt-2 max-w-xl leading-relaxed">{adminAiInsight}</p>
                    </div>
                </div>
                <button className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black text-sm relative z-10 hover:bg-indigo-50">분석 데이터 갱신</button>
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500 rounded-full blur-[100px] opacity-20 -mr-40 -mt-40"></div>
              </div>

              <div className="space-y-6 pb-20">
                <h4 className="text-2xl font-black px-2">실시간 주문 현황</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {orders.map(order => (
                    <div key={order.id} className={`bg-white rounded-[3rem] border-2 overflow-hidden transition-all ${order.status === 'call' ? 'border-rose-100 ring-4 ring-rose-50/50' : 'border-slate-50'}`}>
                      <div className={`px-8 py-6 flex justify-between items-center ${order.status === 'call' ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-800'}`}>
                        <span className="text-xl font-black">T-{order.tableNo}</span>
                        <span className="text-xs font-bold opacity-60 flex items-center gap-1"><Clock size={12}/> {order.time}</span>
                      </div>
                      <div className="p-8 space-y-4 min-h-[140px]">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center font-bold">
                            <span className={order.status === 'call' ? 'text-rose-700' : 'text-slate-700'}>{item.name[lang]}</span>
                            <span className="text-slate-400 text-xs">x1</span>
                          </div>
                        ))}
                      </div>
                      <div className="px-8 pb-8 flex gap-4">
                         <button onClick={() => handleStatusChange(order.id)} className={`flex-1 py-5 rounded-[1.5rem] font-black text-sm text-white shadow-lg ${order.status === 'call' ? 'bg-rose-600' : 'bg-indigo-600'}`}>
                           <CheckCircle size={18} className="inline mr-2"/> {order.status === 'call' ? t.confirm : t.startCook}
                         </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {showAiModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
            <div className="bg-white rounded-[4rem] w-full max-w-md overflow-hidden animate-in zoom-in-95">
              <div className="bg-indigo-600 p-12 text-white text-center">
                <Sparkles size={64} className="mx-auto mb-6 text-indigo-200" />
                <h3 className="text-3xl font-black">{t.aiTitle}</h3>
              </div>
              <div className="p-12 text-center">
                {aiLoading ? <div className="animate-spin w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto"></div> : <p className="text-xl font-bold leading-relaxed">{aiResponse}</p>}
                <button onClick={() => setShowAiModal(false)} className="w-full mt-10 py-6 bg-slate-900 text-white rounded-[2rem] font-black">{t.aiOk}</button>
              </div>
            </div>
          </div>
        )}

        {showCallModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
            <div className="bg-white rounded-[3rem] w-full max-w-lg overflow-hidden shadow-2xl">
                <div className="p-8 border-b flex justify-between items-center bg-slate-50">
                    <h3 className="text-xl font-black text-slate-800">{t.callTitle}</h3>
                    <button onClick={() => setShowCallModal(false)}><X size={24} /></button>
                </div>
                <div className="p-8 grid grid-cols-2 gap-4">
                    {[t.callWater, t.callNapkin, t.callWetTissue, t.callStaffOnly].map((opt, i) => (
                      <button key={i} onClick={() => {
                        setOrders([{ id: Date.now(), tableNo: 5, items: [{ name: { ko: `호출: ${opt}`, en: `Call: ${opt}`, ja: opt, zh: opt }, price: 0 }], status: 'call', time: '지금' }, ...orders]);
                        setShowCallModal(false);
                      }} className="p-8 bg-white border-2 border-slate-100 rounded-[2.5rem] font-black hover:border-indigo-600 transition-all">
                        {opt}
                      </button>
                    ))}
                </div>
            </div>
          </div>
        )}

        {showOrderSuccess && (
          <div className="absolute top-10 left-1/2 -translate-x-1/2 z-[300] bg-slate-900 text-white px-10 py-5 rounded-full font-black animate-in slide-in-from-top-20">
            {t.success}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
