import React, { useState } from 'react';
import { 
  Wallet, DollarSign, PlusCircle, Grid, FileText, CheckCircle, 
  Calendar, TrendingUp, Send, AlertCircle, Trash2, ArrowUpRight
} from 'lucide-react';
import { Item, SellerStats, WithdrawalRequest, Order } from '../types';
import { CATEGORIES } from '../data';

interface DashboardProps {
  items: Item[];
  orders: Order[];
  sellerStats: SellerStats;
  onAddListing: (newItem: Item) => void;
  onRemoveListing: (itemId: string) => void;
  onUpdateStats: (newStats: SellerStats) => void;
}

export default function Dashboard({
  items,
  orders,
  sellerStats,
  onAddListing,
  onRemoveListing,
  onUpdateStats
}: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'seller' | 'buyer' | 'list-item'>('seller');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState<'SWIFT' | 'Wise' | 'PayPal' | 'Bank Transfer'>('PayPal');
  const [withdrawAccount, setWithdrawAccount] = useState('');
  const [withdrawError, setWithdrawError] = useState('');
  const [withdrawSuccess, setWithdrawSuccess] = useState('');

  // Listing Form States
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newOrigPrice, setNewOrigPrice] = useState('');
  const [newCategory, setNewCategory] = useState('Art & Collectibles');
  const [newType, setNewType] = useState<'product' | 'service' | 'digital'>('product');
  const [newImg, setNewImg] = useState('https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80');
  const [newDesc, setNewDesc] = useState('');
  const [listSuccess, setListSuccess] = useState(false);

  // Pre-configured royalty-free stock imagery presets for easy user creation
  const imagePresets = [
    { name: 'Craft & Art', url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80' },
    { name: 'Premium Tech', url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80' },
    { name: 'Minimal Decor', url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80' },
    { name: 'Fashion Wear', url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80' }
  ];

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawError('');
    setWithdrawSuccess('');

    const amt = parseFloat(withdrawAmount);
    if (isNaN(amt) || amt <= 0) {
      setWithdrawError('Please enter a valid transfer amount.');
      return;
    }

    if (amt > sellerStats.wallet) {
      setWithdrawError('Insufficient balance in Moscovium wallet.');
      return;
    }

    if (!withdrawAccount.trim()) {
      setWithdrawError('Please enter withdrawal destination account coordinates.');
      return;
    }

    // Process valid withdrawal
    const request: WithdrawalRequest = {
      id: `w-${Date.now()}`,
      amount: amt,
      method: withdrawMethod,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
      accountDetails: withdrawAccount
    };

    onUpdateStats({
      ...sellerStats,
      wallet: sellerStats.wallet - amt,
      withdrawals: [request, ...sellerStats.withdrawals]
    });

    setWithdrawAmount('');
    setWithdrawAccount('');
    setWithdrawSuccess(`Transfer request of $${amt.toFixed(2)} submitted successfully!`);
  };

  const handleListSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setListSuccess(false);

    const priceNum = parseFloat(newPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      alert('Please specify a valid item price.');
      return;
    }

    const origPriceNum = newOrigPrice ? parseFloat(newOrigPrice) : undefined;

    const newItem: Item = {
      id: `item-${Date.now()}`,
      title: newTitle,
      price: priceNum,
      originalPrice: origPriceNum && !isNaN(origPriceNum) ? origPriceNum : undefined,
      category: newCategory,
      type: newType,
      image: newImg,
      description: newDesc,
      rating: 5.0,
      reviewsCount: 0,
      sellerName: 'Bestgemdiamond (Your Shop)',
      sellerId: 'bestgemdiamond',
      createdAt: new Date().toISOString()
    };

    onAddListing(newItem);
    setListSuccess(true);
    
    // Reset Form
    setNewTitle('');
    setNewPrice('');
    setNewOrigPrice('');
    setNewDesc('');

    // Switch tab back to list preview after brief pause
    setTimeout(() => {
      setListSuccess(false);
      setActiveTab('seller');
    }, 2000);
  };

  // Filter items specifically created by this main mock user
  const userItems = items.filter(item => item.sellerId === 'bestgemdiamond');

  return (
    <div className="space-y-6">
      {/* Dashboard Subheader Controls */}
      <div className="flex border-b border-slate-200 gap-1.5 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab('seller')}
          className={`flex items-center gap-2 px-5 py-3 font-sans text-sm font-bold transition-all border-b-2 truncate shrink-0 ${
            activeTab === 'seller' ? 'border-red-600 text-red-600' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Wallet className="h-4 w-4" />
          <span>Seller Office ({userItems.length} listed)</span>
        </button>
        <button
          onClick={() => setActiveTab('list-item')}
          className={`flex items-center gap-2 px-5 py-3 font-sans text-sm font-bold transition-all border-b-2 truncate shrink-0 ${
            activeTab === 'list-item' ? 'border-red-600 text-red-600' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <PlusCircle className="h-4 w-4" />
          <span>List a New Offer</span>
        </button>
        <button
          onClick={() => setActiveTab('buyer')}
          className={`flex items-center gap-2 px-5 py-3 font-sans text-sm font-bold transition-all border-b-2 truncate shrink-0 ${
            activeTab === 'buyer' ? 'border-red-600 text-red-600' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>My Purchase Orders ({orders.length})</span>
        </button>
      </div>

      {activeTab === 'seller' && (
        <div className="space-y-6">
          {/* Financial stats panel */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-850 relative overflow-hidden">
              <div className="absolute right-0 bottom-0 translate-y-4 translate-x-4 opacity-5">
                <DollarSign className="h-40 w-40" />
              </div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest font-sans">Lifetime Earnings</p>
              <h3 className="text-2xl font-black mt-2 font-mono leading-none">
                ${sellerStats.earnings.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </h3>
              <div className="flex items-center gap-1.5 mt-3 text-emerald-400 text-xs font-sans">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>+14.8% up this fiscal quarter</span>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-200 relative overflow-hidden">
              <p className="text-slate-450 text-xs font-bold uppercase tracking-widest font-sans">Available Wallet Balance</p>
              <h3 className="text-2xl font-black mt-2 text-slate-900 font-mono leading-none">
                ${sellerStats.wallet.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </h3>
              <p className="text-slate-400 text-[11px] mt-3 font-sans">Unlocked through Escrow contract releases</p>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-200 relative overflow-hidden">
              <p className="text-slate-450 text-xs font-bold uppercase tracking-widest font-sans">Completed Orders</p>
              <h3 className="text-2xl font-black mt-2 text-slate-900 font-mono leading-none">
                {sellerStats.completedOrders}
              </h3>
              <p className="text-slate-400 text-[11px] mt-3 font-sans">99.8% customer satisfaction rating</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-5 gap-6">
            {/* Wallet Cashout Module */}
            <div className="lg:col-span-2 bg-slate-50 border border-slate-200 rounded-3xl p-5 space-y-4">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider font-sans">Withdraw Cash Earnings</h3>
                <p className="text-xs text-slate-400 mt-1 font-sans">Transfer available funds securely to global payout channels</p>
              </div>

              <form onSubmit={handleWithdraw} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Withdrawal Payout Method</label>
                  <select
                    value={withdrawMethod}
                    onChange={(e) => setWithdrawMethod(e.target.value as any)}
                    className="w-full text-xs rounded-xl border border-slate-300 bg-white p-2.5 text-slate-750 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  >
                    <option value="PayPal">PayPal Balance Wallet</option>
                    <option value="Wise">Wise Cross-border Account</option>
                    <option value="SWIFT">SWIFT International Wire</option>
                    <option value="Bank Transfer">Local Bank Transfer</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Withdraw Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="e.g. 150.00"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full text-xs font-mono rounded-xl border border-slate-300 bg-white p-2.5 text-slate-850 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Recipient Account Coordinate Details</label>
                  <input
                    type="text"
                    placeholder="e.g. paypal-acc@mail.com or IBAN number"
                    value={withdrawAccount}
                    onChange={(e) => setWithdrawAccount(e.target.value)}
                    className="w-full text-xs font-mono rounded-xl border border-slate-300 bg-white p-2.5 text-slate-850 focus:outline-none"
                  />
                </div>

                {withdrawError && (
                  <div className="p-3 bg-red-50 rounded-xl border border-red-100 flex items-center gap-2 text-xs text-red-600">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{withdrawError}</span>
                  </div>
                )}

                {withdrawSuccess && (
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-2 text-xs text-emerald-800">
                    <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600" />
                    <span>{withdrawSuccess}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-4 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-xs font-sans"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Execute Payout Request</span>
                </button>
              </form>
            </div>

            {/* Payout Logs Table */}
            <div className="lg:col-span-3 bg-white border border-slate-200 rounded-3xl p-5 space-y-4">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider font-sans">Withdrawal Requests History</h3>
                <p className="text-xs text-slate-400 mt-1 font-sans">Recent payout requests and execution statuses</p>
              </div>

              <div className="overflow-x-auto min-h-60 max-h-[300px]">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                      <th className="py-2.5">Date</th>
                      <th className="py-2.5">Payout Method</th>
                      <th className="py-2.5">Recipients</th>
                      <th className="py-2.5 text-right">Amount</th>
                      <th className="py-2.5 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 font-sans text-slate-650">
                    {sellerStats.withdrawals.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-slate-400">
                          No processed cashout history found.
                        </td>
                      </tr>
                    ) : (
                      sellerStats.withdrawals.map((w) => (
                        <tr key={w.id} className="hover:bg-slate-50/50">
                          <td className="py-3 font-mono">{w.date}</td>
                          <td className="py-3">
                            <span className="font-semibold block">{w.method}</span>
                          </td>
                          <td className="py-3 font-mono text-[10px] truncate max-w-40">{w.accountDetails}</td>
                          <td className="py-3 text-right font-bold text-slate-900 font-mono">${w.amount.toFixed(2)}</td>
                          <td className="py-3 text-right">
                            <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              w.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                            }`}>
                              {w.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Active catalog list view */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider font-sans">Your Listed Offers Catalog</h3>
              <p className="text-xs text-slate-400 mt-1 font-sans">Manage items currently listed under your shop portfolio on Moscovium115</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {userItems.length === 0 ? (
                <div className="py-12 text-center text-slate-400 col-span-2 font-sans">
                  No listed items found in your catalog. Generate your first offer list now!
                </div>
              ) : (
                userItems.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 border border-slate-250 hover:border-slate-350 bg-slate-50/50 rounded-2xl relative transition-all group">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="h-14 w-14 object-cover rounded-xl border border-slate-200 shrink-0"
                    />
                    <div className="space-y-1 min-w-0 pr-6">
                      <div className="flex gap-1.5 items-center">
                        <span className="text-[9px] font-extrabold text-red-600 uppercase tracking-wider bg-red-50 border border-red-100 px-1.5 py-0.5 rounded">
                          {item.type}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold">{item.category}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-850 line-clamp-1 font-sans group-hover:text-red-600 transition-colors">{item.title}</h4>
                      <p className="text-sm font-bold font-mono text-slate-900">${item.price.toFixed(2)}</p>
                    </div>

                    <button 
                      onClick={() => onRemoveListing(item.id)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-red-600 transition-colors"
                      title="De-list Product"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'list-item' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900 font-sans">Produce a New Shop Offer</h3>
            <p className="text-xs text-slate-400 font-sans mt-0.5">Submit item credentials to instantaneously make your offer active onto our global marketplace search catalog</p>
          </div>

          <form onSubmit={handleListSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Offer Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Handmade Ceremonial Teacup sculpture"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-300 bg-white p-2.5 text-slate-850 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Primary Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-300 bg-white p-2.5 text-slate-750 focus:outline-none"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Selling Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="e.g. 45.00"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="w-full text-xs font-mono rounded-xl border border-slate-300 bg-white p-2.5 text-slate-850 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Original Price ($) - Optional comparison</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="e.g. 60.00"
                  value={newOrigPrice}
                  onChange={(e) => setNewOrigPrice(e.target.value)}
                  className="w-full text-xs font-mono rounded-xl border border-slate-300 bg-white p-2.5 text-slate-850 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Type of Offer</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'product', label: 'Physical Product' },
                    { id: 'service', label: 'In-person Service' },
                    { id: 'digital', label: 'Digital Download' }
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setNewType(t.id as any)}
                      className={`text-xs py-2 px-3 border rounded-xl font-bold transition-all text-center leading-none ${
                        newType === t.id 
                          ? 'border-red-600 bg-red-50 text-red-600 shadow-xs' 
                          : 'border-slate-300 text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Cover Image URL</label>
                <input
                  type="text"
                  required
                  value={newImg}
                  onChange={(e) => setNewImg(e.target.value)}
                  className="w-full text-xs font-mono rounded-xl border border-slate-300 bg-white p-2.5 text-slate-850 focus:outline-none"
                />
              </div>
            </div>

            {/* Quick stock preset list */}
            <div className="space-y-2">
              <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Or Select Standard Visual Preset Template:</span>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {imagePresets.map((preset) => (
                  <div 
                    key={preset.name}
                    onClick={() => setNewImg(preset.url)}
                    className={`cursor-pointer rounded-xl border p-2 relative overflow-hidden transition-all ${
                      newImg === preset.url ? 'border-red-500 ring-2 ring-red-500/20' : 'border-slate-200 text-slate-500'
                    }`}
                  >
                    <img src={preset.url} alt={preset.name} className="h-10 w-full object-cover rounded-lg" />
                    <span className="block text-[10px] text-slate-700 font-bold mt-1 text-center font-sans">{preset.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Offer Summary / Details</label>
              <textarea
                required
                rows={4}
                placeholder="Describe your item details, measurements, shipping policies, support options..."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full text-xs font-sans rounded-xl border border-slate-300 bg-white p-2.5 text-slate-850 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            {listSuccess && (
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-3 text-emerald-800 text-xs">
                <CheckCircle className="h-5 w-5 shrink-0 text-emerald-600" />
                <div className="space-y-0.5">
                  <p className="font-bold">Item Listed Live Successfully!</p>
                  <p>Check the search grid where your offer is currently listed.</p>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="px-6 py-2.5 bg-red-650 hover:bg-red-700 text-white font-bold text-xs rounded-xl active:scale-[0.98] transition-all"
            >
              List Item Live on Moscovium115
            </button>
          </form>
        </div>
      )}

      {activeTab === 'buyer' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4">
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider font-sans">Completed Purchase Invoices</h3>
            <p className="text-xs text-slate-400 mt-1 font-sans">Full list of receipts acquired during your active session shopping</p>
          </div>

          {orders.length === 0 ? (
            <div className="py-12 text-center text-slate-400 font-sans">
              No completed invoices found. Fill your shopping cart to complete your first purchase order!
            </div>
          ) : (
            <div className="space-y-4 max-h-[450px] overflow-y-auto pr-1">
              {orders.map((order) => (
                <div key={order.id} className="border border-slate-250 bg-slate-50/50 rounded-2xl overflow-hidden shadow-sm">
                  {/* Order summary header */}
                  <div className="p-4 bg-slate-100/80 border-b border-slate-200 flex flex-wrap gap-3 items-center justify-between font-sans text-xs">
                    <div>
                      <span className="text-slate-400 font-semibold block">Order Identifier</span>
                      <span className="font-mono font-bold text-slate-800">{order.id}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block">Fulfillment Date</span>
                      <span className="font-bold text-slate-700">{order.date}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block">Secure Payment Status</span>
                      <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-bold text-[10px] uppercase tracking-wider inline-flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" /> Paid Escrow
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block">Total Receipt Price</span>
                      <span className="font-black text-slate-900 font-mono">${order.total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Order Item List */}
                  <div className="p-4 divide-y divide-slate-100">
                    {order.items.map((cartItem) => (
                      <div key={cartItem.item.id} className="py-2.5 flex items-center justify-between text-xs gap-3">
                        <div className="flex items-center gap-3">
                          <img src={cartItem.item.image} className="h-8 w-8 object-cover rounded" alt={cartItem.item.title} />
                          <div>
                            <p className="font-bold text-slate-800 leading-snug line-clamp-1">{cartItem.item.title}</p>
                            <p className="text-[10px] text-slate-400">Sold by {cartItem.item.sellerName} &bull; Qty {cartItem.quantity}</p>
                          </div>
                        </div>
                        <span className="font-bold text-slate-750 font-mono">${(cartItem.item.price * cartItem.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 bg-red-50 text-slate-700 text-[10px] border-t border-slate-150 leading-relaxed font-sans px-4">
                    🛒 Digital access receipt and shipment codes were routed to your mailbox <strong>{order.customerEmail}</strong>.
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
