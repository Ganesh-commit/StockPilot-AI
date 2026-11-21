import React, { useState, useEffect } from 'react';
import { fetchInventory, createInventoryItem, deleteInventoryItem } from '../../services/api';
import {
  Package,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit2,
  Check,
  X,
  Bed,
  Plane,
  Home,
  Tag
} from 'lucide-react';

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    type: 'Hotel Rooms',
    cost: '',
    price: '',
    cancel: 0.12,
    cap: 10000,
    description: ''
  });

  const loadItems = async () => {
    try {
      const d = await fetchInventory();
      setItems(d || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadItems();
    window.addEventListener('stockpilot-reseeded', loadItems);
    return () => window.removeEventListener('stockpilot-reseeded', loadItems);
  }, []);

  const handleCreate = async e => {
    e.preventDefault();
    try {
      await createInventoryItem(newItem);
      setIsModalOpen(false);
      setNewItem({ name: '', type: 'Hotel Rooms', cost: '', price: '', cancel: 0.12, cap: 10000, description: '' });
      loadItems();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Are you sure you want to remove this inventory opportunity?')) return;
    try {
      await deleteInventoryItem(id);
      loadItems();
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = items.filter(it => {
    const matchesCategory = selectedCategory === 'ALL' || it.type.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch = it.name.toLowerCase().includes(searchTerm.toLowerCase()) || it.type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Header */}
      <div className="travel-card" style={{ padding: '24px', backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="font-serif" style={{ fontSize: '24px', fontWeight: 800, color: '#18251C' }}>
            Travel Inventory Catalog
          </h1>
          <p style={{ fontSize: '13px', color: '#687369', marginTop: '4px' }}>
            Manage hotel rooms, flight seat blocks, villas, and travel packages
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary-forest"
          style={{ padding: '9px 18px', fontSize: '13px' }}
        >
          <Plus size={16} />
          <span>Add Inventory Asset</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="travel-card" style={{ padding: '16px 20px', backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['ALL', 'Hotel', 'Flight', 'Resort', 'Villa'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: '1px solid #E8E2D7',
                backgroundColor: selectedCategory === cat ? '#145C38' : '#FAF7F0',
                color: selectedCategory === cat ? '#ffffff' : '#18251C',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {cat === 'ALL' ? 'All Inventory' : cat + 's'}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', width: '240px' }}>
          <Search size={15} color="#8E998F" style={{ position: 'absolute', left: '10px', top: '10px' }} />
          <input
            type="text"
            placeholder="Search destination..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 32px',
              borderRadius: '8px',
              border: '1px solid #E8E2D7',
              backgroundColor: '#FAF7F0',
              fontSize: '13px',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Inventory Table */}
      <div className="travel-card" style={{ padding: '24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="travel-table">
            <thead>
              <tr>
                <th>Asset Name</th>
                <th>Category</th>
                <th>Procurement Cost</th>
                <th>Selling Price</th>
                <th>Unit Margin</th>
                <th>Supplier Cap</th>
                <th>Cancellation</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(it => {
                const margin = it.price - it.cost;
                const marginPct = Math.round((margin / it.cost) * 100);

                return (
                  <tr key={it.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: '#18251C' }}>{it.name}</div>
                      <div style={{ fontSize: '11px', color: '#687369' }}>{it.description || 'Verified wholesale supplier'}</div>
                    </td>
                    <td>
                      <span style={{ fontSize: '12px', fontWeight: 600, padding: '3px 8px', borderRadius: '6px', backgroundColor: '#FAF7F0', border: '1px solid #E8E2D7' }}>
                        {it.type}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>₹{it.cost.toLocaleString('en-IN')}</td>
                    <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>₹{it.price.toLocaleString('en-IN')}</td>
                    <td>
                      <span style={{ color: '#145C38', fontWeight: 700, fontFamily: 'monospace' }}>
                        +₹{margin.toLocaleString('en-IN')} ({marginPct}%)
                      </span>
                    </td>
                    <td style={{ fontFamily: 'monospace' }}>{it.cap.toLocaleString('en-IN')} units</td>
                    <td style={{ color: '#C07119', fontWeight: 600 }}>
                      {Math.round((it.cancel || 0.1) * 100)}%
                    </td>
                    <td>
                      <button
                        onClick={() => handleDelete(it.id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#B93826',
                          cursor: 'pointer',
                          padding: '4px'
                        }}
                        title="Delete asset"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(24, 37, 28, 0.6)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              maxWidth: '480px',
              width: '100%',
              padding: '28px',
              border: '1px solid #E8E2D7',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <h3 className="font-serif" style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>
              Add New Inventory Asset
            </h3>

            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
                  Destination / Asset Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Phuket Luxury Suites"
                  value={newItem.name}
                  onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #E8E2D7' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
                  Category
                </label>
                <select
                  value={newItem.type}
                  onChange={e => setNewItem({ ...newItem, type: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #E8E2D7' }}
                >
                  <option value="Hotel Rooms">Hotel Rooms</option>
                  <option value="Flight Seats">Flight Seats</option>
                  <option value="Resorts">Resorts</option>
                  <option value="Villas">Villas</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
                    Cost (₹)
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="3500"
                    value={newItem.cost}
                    onChange={e => setNewItem({ ...newItem, cost: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #E8E2D7' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="5200"
                    value={newItem.price}
                    onChange={e => setNewItem({ ...newItem, price: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #E8E2D7' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
                  Supplier Capacity Cap
                </label>
                <input
                  type="number"
                  value={newItem.cap}
                  onChange={e => setNewItem({ ...newItem, cap: +e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #E8E2D7' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary-neutral"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary-forest"
                >
                  Save Opportunity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
