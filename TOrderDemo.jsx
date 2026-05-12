import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  BarChart3,
  Bell,
  CheckCircle,
  Clock,
  CreditCard,
  LayoutDashboard,
  Minus,
  Plus,
  ReceiptText,
  Sparkles,
  Store,
  Trash2,
  Users,
  Utensils,
  Wallet,
  X,
} from 'lucide-react';

const currency = new Intl.NumberFormat('ko-KR');

const TABLES = [
  { id: 1, name: 'T-01', seats: 2, zone: 'Window' },
  { id: 2, name: 'T-02', seats: 4, zone: 'Hall' },
  { id: 3, name: 'T-03', seats: 4, zone: 'Hall' },
  { id: 4, name: 'T-04', seats: 6, zone: 'Room' },
  { id: 5, name: 'T-05', seats: 4, zone: 'Terrace' },
  { id: 6, name: 'T-06', seats: 8, zone: 'Room' },
];

const SERVICE_REQUESTS = [
  { id: 'water', label: '물 요청', icon: '💧' },
  { id: 'napkin', label: '냅킨 요청', icon: '🧻' },
  { id: 'plate', label: '앞접시 요청', icon: '🍽️' },
  { id: 'staff', label: '직원 호출', icon: '🙋' },
];

const MENU_DATA = [
  {
    id: 1,
    category: 'main',
    name: '시그니처 채끝 스테이크',
    desc: '수비드 후 그릴에 구운 프리미엄 채끝과 레드와인 소스',
    price: 42000,
    emoji: '🥩',
    tags: ['BEST', '와인 페어링'],
    prep: 18,
    available: true,
  },
  {
    id: 2,
    category: 'main',
    name: '수비드 토마호크',
    desc: '2~3인 추천, 뼈등심 특유의 풍미와 허브 버터',
    price: 98000,
    emoji: '🍖',
    tags: ['쉐어', '프리미엄'],
    prep: 28,
    available: true,
  },
  {
    id: 3,
    category: 'main',
    name: '트러플 콰트로 피자',
    desc: '네 가지 치즈와 블랙 트러플 오일의 깊은 풍미',
    price: 26000,
    emoji: '🍕',
    tags: ['인기', '채식 가능'],
    prep: 12,
    available: true,
  },
  {
    id: 101,
    category: 'side',
    name: '부라타 치즈 샐러드',
    desc: '부라타, 토마토 콩피, 바질 페스토, 발사믹 글레이즈',
    price: 16000,
    emoji: '🥗',
    tags: ['상큼함'],
    prep: 8,
    available: true,
  },
  {
    id: 102,
    category: 'side',
    name: '트러플 감자튀김',
    desc: '트러플 솔트와 파르미지아노 레지아노를 올린 시그니처 사이드',
    price: 9000,
    emoji: '🍟',
    tags: ['추천'],
    prep: 7,
    available: true,
  },
  {
    id: 201,
    category: 'drink',
    name: '카베르네 소비뇽',
    desc: '스테이크와 잘 어울리는 묵직한 바디감의 레드 와인',
    price: 15000,
    emoji: '🍷',
    tags: ['글라스', '페어링'],
    prep: 3,
    available: true,
  },
  {
    id: 202,
    category: 'drink',
    name: '생맥주 500ml',
    desc: '깔끔한 목넘김의 프리미엄 라거',
    price: 8000,
    emoji: '🍺',
    tags: ['ICE'],
    prep: 2,
    available: true,
  },
];

const INITIAL_ORDERS = [
  {
    id: 2026051201,
    tableId: 2,
    status: 'cooking',
    payment: 'later',
    createdAt: '12:18',
    items: [
      { menuId: 1, name: '시그니처 채끝 스테이크', qty: 1, price: 42000 },
      { menuId: 201, name: '카베르네 소비뇽', qty: 2, price: 15000 },
    ],
  },
  {
    id: 2026051202,
    tableId: 4,
    status: 'pending',
    payment: 'card',
    createdAt: '12:24',
    items: [
      { menuId: 3, name: '트러플 콰트로 피자', qty: 1, price: 26000 },
      { menuId: 102, name: '트러플 감자튀김', qty: 1, price: 9000 },
    ],
  },
];

const CATEGORIES = [
  { id: 'main', label: '메인', icon: Utensils },
  { id: 'side', label: '사이드', icon: ReceiptText },
  { id: 'drink', label: '음료', icon: Wallet },
];

const STATUS_META = {
  pending: { label: '신규 접수', color: 'bg-amber-100 text-amber-700 border-amber-200', next: 'cooking' },
  cooking: { label: '조리 중', color: 'bg-indigo-100 text-indigo-700 border-indigo-200', next: 'served' },
  served: { label: '서빙 완료', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', next: 'paid' },
  paid: { label: '결제 완료', color: 'bg-slate-100 text-slate-600 border-slate-200', next: null },
};

function money(value) {
  return `${currency.format(value)}원`;
}

function getTime() {
  return new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
}

function sumItems(items) {
  return items.reduce((total, item) => total + item.price * item.qty, 0);
}

export default function App() {
  const [view, setView] = useState('table');
  const [activeCategory, setActiveCategory] = useState('main');
  const [selectedTable, setSelectedTable] = useState(5);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [calls, setCalls] = useState([
    { id: 1, tableId: 3, label: '물 요청', createdAt: '12:22', done: false },
  ]);
  const [toast, setToast] = useState('');
  const [menu, setMenu] = useState(MENU_DATA);
  const [paymentType, setPaymentType] = useState('later');
  const [showCallModal, setShowCallModal] = useState(false);

  const selectedTableInfo = TABLES.find((table) => table.id === selectedTable);
  const cartTotal = sumItems(cart);

  const tableOrderTotals = useMemo(() => {
    return orders.reduce((acc, order) => {
      if (order.status !== 'paid') {
        acc[order.tableId] = (acc[order.tableId] || 0) + sumItems(order.items);
      }
      return acc;
    }, {});
  }, [orders]);

  const metrics = useMemo(() => {
    const paidSales = orders.filter((order) => order.status === 'paid').reduce((sum, order) => sum + sumItems(order.items), 0);
    const openSales = orders.filter((order) => order.status !== 'paid').reduce((sum, order) => sum + sumItems(order.items), 0);
    const activeTables = new Set(orders.filter((order) => order.status !== 'paid').map((order) => order.tableId)).size;
    const pendingOrders = orders.filter((order) => order.status === 'pending').length;
    const menuCount = orders.flatMap((order) => order.items).reduce((acc, item) => {
      acc[item.name] = (acc[item.name] || 0) + item.qty;
      return acc;
    }, {});
    const topMenus = Object.entries(menuCount).sort((a, b) => b[1] - a[1]).slice(0, 3);

    return { paidSales, openSales, activeTables, pendingOrders, topMenus };
  }, [orders]);

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2400);
  };

  const addToCart = (item) => {
    if (!item.available) return;
    setCart((current) => {
      const existing = current.find((cartItem) => cartItem.menuId === item.id);
      if (existing) {
        return current.map((cartItem) =>
          cartItem.menuId === item.id ? { ...cartItem, qty: cartItem.qty + 1 } : cartItem,
        );
      }
      return [...current, { menuId: item.id, name: item.name, qty: 1, price: item.price, prep: item.prep }];
    });
  };

  const changeQty = (menuId, diff) => {
    setCart((current) => current
      .map((item) => (item.menuId === menuId ? { ...item, qty: item.qty + diff } : item))
      .filter((item) => item.qty > 0));
  };

  const placeOrder = () => {
    if (cart.length === 0) {
      showToast('메뉴를 먼저 담아주세요.');
      return;
    }

    const newOrder = {
      id: Date.now(),
      tableId: selectedTable,
      status: 'pending',
      payment: paymentType,
      createdAt: getTime(),
      items: cart,
    };

    setOrders((current) => [newOrder, ...current]);
    setCart([]);
    showToast(`${selectedTableInfo.name} 주문이 관리자 화면에 접수되었습니다.`);
  };

  const requestService = (request) => {
    setCalls((current) => [
      { id: Date.now(), tableId: selectedTable, label: request.label, createdAt: getTime(), done: false },
      ...current,
    ]);
    setShowCallModal(false);
    showToast(`${request.label}이 점주/직원 화면에 전달되었습니다.`);
  };

  const advanceStatus = (orderId) => {
    setOrders((current) => current.map((order) => {
      if (order.id !== orderId) return order;
      const next = STATUS_META[order.status].next;
      return next ? { ...order, status: next } : order;
    }));
  };

  const toggleAvailability = (menuId) => {
    setMenu((current) => current.map((item) => (
      item.id === menuId ? { ...item, available: !item.available } : item
    )));
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-indigo-600 p-3 text-white shadow-lg shadow-indigo-200">
              <Store size={24} />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.35em] text-indigo-500">Demo Ready</p>
              <h1 className="text-xl font-black">스마트 테이블 주문 시스템</h1>
            </div>
          </div>
          <div className="flex rounded-2xl border border-slate-200 bg-slate-100 p-1">
            <button
              onClick={() => setView('table')}
              className={`flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-black transition ${view === 'table' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
            >
              <Users size={16} /> 테이블 주문
            </button>
            <button
              onClick={() => setView('admin')}
              className={`flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-black transition ${view === 'admin' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
            >
              <LayoutDashboard size={16} /> 점주 관리자
            </button>
          </div>
        </div>
      </header>

      {view === 'table' ? (
        <main className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[280px_1fr_360px]">
          <aside className="space-y-5">
            <section className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-xl">
              <p className="text-sm font-bold text-indigo-200">현재 테이블</p>
              <h2 className="mt-2 text-4xl font-black">{selectedTableInfo.name}</h2>
              <p className="mt-2 text-sm text-slate-300">{selectedTableInfo.zone} · {selectedTableInfo.seats}인석</p>
              <button
                onClick={() => setShowCallModal(true)}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-4 font-black text-slate-950"
              >
                <Bell size={18} /> 직원 호출
              </button>
            </section>

            <section className="rounded-[2rem] bg-white p-5 shadow-sm">
              <h3 className="mb-4 font-black">테이블 선택 데모</h3>
              <div className="grid grid-cols-2 gap-3">
                {TABLES.map((table) => (
                  <button
                    key={table.id}
                    onClick={() => setSelectedTable(table.id)}
                    className={`rounded-2xl border-2 p-4 text-left transition ${selectedTable === table.id ? 'border-indigo-500 bg-indigo-50' : 'border-slate-100 bg-white hover:border-slate-300'}`}
                  >
                    <p className="font-black">{table.name}</p>
                    <p className="text-xs text-slate-500">{table.zone}</p>
                    {tableOrderTotals[table.id] ? <p className="mt-2 text-xs font-bold text-indigo-600">진행 {money(tableOrderTotals[table.id])}</p> : <p className="mt-2 text-xs text-slate-400">빈 테이블</p>}
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-[2rem] border border-indigo-100 bg-indigo-50 p-5">
              <div className="flex items-center gap-3">
                <Sparkles className="text-indigo-600" />
                <h3 className="font-black text-indigo-950">AI 페어링</h3>
              </div>
              <p className="mt-3 text-sm leading-6 text-indigo-900/80">스테이크를 담으면 카베르네 소비뇽, 피자를 담으면 생맥주를 추천하도록 데모 데이터를 구성했습니다.</p>
            </section>
          </aside>

          <section className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-slate-500">고객 화면</p>
                <h2 className="text-3xl font-black">메뉴를 선택하고 바로 주문하세요</h2>
              </div>
              <div className="flex rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
                {CATEGORIES.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveCategory(id)}
                    className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-black ${activeCategory === id ? 'bg-slate-950 text-white' : 'text-slate-500'}`}
                  >
                    <Icon size={16} /> {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {menu.filter((item) => item.category === activeCategory).map((item) => (
                <article key={item.id} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                  <div className="flex items-start justify-between gap-4">
                    <div className="text-5xl">{item.emoji}</div>
                    <div className={`rounded-full px-3 py-1 text-xs font-black ${item.available ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {item.available ? `${item.prep}분` : '품절'}
                    </div>
                  </div>
                  <h3 className="mt-5 text-xl font-black">{item.name}</h3>
                  <p className="mt-2 min-h-[48px] text-sm leading-6 text-slate-500">{item.desc}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.tags.map((tag) => <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">{tag}</span>)}
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <strong className="text-xl font-black">{money(item.price)}</strong>
                    <button
                      disabled={!item.available}
                      onClick={() => addToCart(item)}
                      className="rounded-2xl bg-indigo-600 px-5 py-3 font-black text-white disabled:bg-slate-300"
                    >
                      담기
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <aside className="sticky top-24 h-fit rounded-[2rem] bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black">주문서</h2>
              <button onClick={() => setCart([])} className="text-sm font-bold text-slate-400">비우기</button>
            </div>
            <div className="mt-5 space-y-3">
              {cart.length === 0 ? (
                <div className="rounded-3xl border-2 border-dashed border-slate-200 py-12 text-center text-sm font-bold text-slate-400">담긴 메뉴가 없습니다.</div>
              ) : cart.map((item) => (
                <div key={item.menuId} className="rounded-3xl bg-slate-50 p-4">
                  <div className="flex justify-between gap-3">
                    <p className="font-black">{item.name}</p>
                    <button onClick={() => changeQty(item.menuId, -item.qty)} className="text-slate-400"><Trash2 size={16} /></button>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="font-bold text-indigo-600">{money(item.price * item.qty)}</p>
                    <div className="flex items-center gap-2">
                      <button onClick={() => changeQty(item.menuId, -1)} className="rounded-full bg-white p-2"><Minus size={14} /></button>
                      <span className="w-6 text-center font-black">{item.qty}</span>
                      <button onClick={() => changeQty(item.menuId, 1)} className="rounded-full bg-white p-2"><Plus size={14} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-3xl bg-slate-950 p-5 text-white">
              <p className="text-sm text-slate-400">결제 방식</p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {[
                  ['later', '후불'],
                  ['card', '카드'],
                  ['cash', '현금'],
                ].map(([id, label]) => (
                  <button key={id} onClick={() => setPaymentType(id)} className={`rounded-xl py-2 text-xs font-black ${paymentType === id ? 'bg-white text-slate-950' : 'bg-white/10 text-white/70'}`}>{label}</button>
                ))}
              </div>
              <div className="mt-5 flex items-end justify-between">
                <span className="text-sm text-slate-400">총 합계</span>
                <strong className="text-2xl font-black">{money(cartTotal)}</strong>
              </div>
              <button onClick={placeOrder} className="mt-5 w-full rounded-2xl bg-indigo-500 py-4 font-black text-white">주문 전송</button>
            </div>
          </aside>
        </main>
      ) : (
        <main className="mx-auto max-w-7xl space-y-7 px-6 py-8">
          <section className="rounded-[2rem] bg-slate-950 p-8 text-white shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.3em] text-indigo-300">Owner Dashboard</p>
                <h2 className="mt-2 text-3xl font-black">점주 관리자 데모</h2>
                <p className="mt-3 max-w-2xl text-slate-300">주문 접수, 조리 상태 변경, 직원 호출 처리, 테이블 점유 및 메뉴 품절 관리까지 한 화면에서 확인할 수 있습니다.</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-5">
                <p className="text-sm text-slate-300">운영 인사이트</p>
                <p className="mt-2 font-bold">점심 피크 기준 신규 주문 {metrics.pendingOrders}건, 호출 {calls.filter((call) => !call.done).length}건을 우선 처리하세요.</p>
              </div>
            </div>
          </section>

          <section className="grid gap-5 md:grid-cols-4">
            <Metric icon={CreditCard} label="완료 매출" value={money(metrics.paidSales)} tone="emerald" />
            <Metric icon={BarChart3} label="진행 매출" value={money(metrics.openSales)} tone="indigo" />
            <Metric icon={Users} label="이용 테이블" value={`${metrics.activeTables} / ${TABLES.length}`} tone="amber" />
            <Metric icon={AlertCircle} label="미처리 주문" value={`${metrics.pendingOrders}건`} tone="rose" />
          </section>

          <section className="grid gap-7 lg:grid-cols-[1fr_360px]">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black">실시간 주문 현황</h3>
                <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-500 shadow-sm">총 {orders.length}건</span>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                {orders.map((order) => {
                  const table = TABLES.find((item) => item.id === order.tableId);
                  const meta = STATUS_META[order.status];
                  return (
                    <article key={order.id} className="rounded-[2rem] bg-white p-6 shadow-sm">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-bold text-slate-400">#{order.id}</p>
                          <h4 className="mt-1 text-2xl font-black">{table.name}</h4>
                        </div>
                        <span className={`rounded-full border px-3 py-1 text-xs font-black ${meta.color}`}>{meta.label}</span>
                      </div>
                      <div className="mt-5 space-y-3">
                        {order.items.map((item) => (
                          <div key={`${order.id}-${item.menuId}`} className="flex justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm">
                            <span className="font-bold">{item.name} × {item.qty}</span>
                            <span className="font-black">{money(item.price * item.qty)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-5 flex items-center justify-between border-t pt-5">
                        <div className="text-sm text-slate-500"><Clock size={14} className="mr-1 inline" />{order.createdAt} · {order.payment}</div>
                        <strong className="text-xl font-black">{money(sumItems(order.items))}</strong>
                      </div>
                      {meta.next && (
                        <button onClick={() => advanceStatus(order.id)} className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 py-4 font-black text-white">
                          <CheckCircle size={18} /> 다음 단계로 변경
                        </button>
                      )}
                    </article>
                  );
                })}
              </div>
            </div>

            <aside className="space-y-5">
              <section className="rounded-[2rem] bg-white p-6 shadow-sm">
                <h3 className="text-xl font-black">직원 호출</h3>
                <div className="mt-4 space-y-3">
                  {calls.map((call) => (
                    <div key={call.id} className={`rounded-3xl border p-4 ${call.done ? 'border-slate-100 bg-slate-50 opacity-60' : 'border-rose-100 bg-rose-50'}`}>
                      <div className="flex justify-between">
                        <p className="font-black">T-{String(call.tableId).padStart(2, '0')} · {call.label}</p>
                        <span className="text-xs font-bold text-slate-400">{call.createdAt}</span>
                      </div>
                      {!call.done && <button onClick={() => setCalls((current) => current.map((item) => item.id === call.id ? { ...item, done: true } : item))} className="mt-3 rounded-xl bg-rose-600 px-4 py-2 text-sm font-black text-white">처리 완료</button>}
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-[2rem] bg-white p-6 shadow-sm">
                <h3 className="text-xl font-black">테이블 맵</h3>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {TABLES.map((table) => {
                    const occupied = Boolean(tableOrderTotals[table.id]);
                    return <div key={table.id} className={`rounded-2xl border p-4 ${occupied ? 'border-indigo-200 bg-indigo-50' : 'border-slate-100 bg-slate-50'}`}>
                      <p className="font-black">{table.name}</p>
                      <p className="text-xs text-slate-500">{occupied ? money(tableOrderTotals[table.id]) : '대기 가능'}</p>
                    </div>;
                  })}
                </div>
              </section>

              <section className="rounded-[2rem] bg-white p-6 shadow-sm">
                <h3 className="text-xl font-black">메뉴 운영</h3>
                <div className="mt-4 space-y-3">
                  {menu.slice(0, 5).map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 p-3">
                      <span className="text-sm font-bold">{item.name}</span>
                      <button onClick={() => toggleAvailability(item.id)} className={`rounded-full px-3 py-1 text-xs font-black ${item.available ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                        {item.available ? '판매중' : '품절'}
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-[2rem] border border-indigo-100 bg-indigo-50 p-6">
                <h3 className="text-xl font-black text-indigo-950">인기 메뉴 TOP 3</h3>
                <ol className="mt-4 space-y-2">
                  {metrics.topMenus.map(([name, qty], index) => <li key={name} className="flex justify-between text-sm font-bold text-indigo-900"><span>{index + 1}. {name}</span><span>{qty}개</span></li>)}
                </ol>
              </section>
            </aside>
          </section>
        </main>
      )}

      {showCallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-6 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[2rem] bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black">무엇을 도와드릴까요?</h3>
              <button onClick={() => setShowCallModal(false)} className="rounded-full bg-slate-100 p-2"><X size={18} /></button>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {SERVICE_REQUESTS.map((request) => (
                <button key={request.id} onClick={() => requestService(request)} className="rounded-3xl border-2 border-slate-100 p-6 text-left transition hover:border-indigo-500">
                  <span className="text-3xl">{request.icon}</span>
                  <p className="mt-3 font-black">{request.label}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {toast && <div className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2 rounded-full bg-slate-950 px-6 py-4 font-black text-white shadow-2xl">{toast}</div>}
    </div>
  );
}

function Metric({ icon: Icon, label, value, tone }) {
  const toneClass = {
    emerald: 'bg-emerald-100 text-emerald-700',
    indigo: 'bg-indigo-100 text-indigo-700',
    amber: 'bg-amber-100 text-amber-700',
    rose: 'bg-rose-100 text-rose-700',
  }[tone];

  return (
    <div className="rounded-[2rem] bg-white p-6 shadow-sm">
      <div className={`mb-5 inline-flex rounded-2xl p-3 ${toneClass}`}><Icon size={22} /></div>
      <p className="text-sm font-bold text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-black">{value}</p>
    </div>
  );
}
