import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function Settings() {
  const [settings, setSettings] = useState({});
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const fetchData = () => {
    Promise.all([api.get('/settings'), api.get('/rewards')])
      .then(([sRes, rRes]) => {
        const s = {};
        (sRes.data || []).forEach(item => { s[item.key] = item.value; });
        setSettings(s);
        setRules(rRes.data || []);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleSaveSetting = async (key, value) => {
    setSaving(true);
    setMsg('');
    try {
      await api.put('/settings', { key, value: String(value) });
      setMsg('Setting saved!');
      fetchData();
    } catch (err) {
      setMsg('Failed to save setting.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveRule = async (rule) => {
    setSaving(true);
    setMsg('');
    try {
      await api.put(`/rewards/${rule.id}`, rule);
      setMsg('Point rule saved!');
      fetchData();
    } catch (err) {
      setMsg('Failed to save rule.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-gray-500">Loading...</div>;

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

      {msg && <div className={`p-3 rounded-lg mb-4 ${msg.includes('Failed') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>{msg}</div>}

      {/* General Settings */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">General Settings</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Input
              label="Expiration Days"
              type="number"
              value={settings.expiration_days || 365}
              onChange={e => setSettings({ ...settings, expiration_days: e.target.value })}
            />
            <Button
              onClick={() => handleSaveSetting('expiration_days', settings.expiration_days)}
              disabled={saving}
              className="mt-2"
            >
              Save
            </Button>
          </div>
          <div>
            <label className="flex items-center gap-2 mt-6">
              <input
                type="checkbox"
                checked={settings.notifications_enabled === 'true'}
                onChange={e => setSettings({ ...settings, notifications_enabled: e.target.checked ? 'true' : 'false' })}
              />
              <span className="text-sm font-medium text-gray-700">Notifications Enabled</span>
            </label>
            <Button
              onClick={() => handleSaveSetting('notifications_enabled', settings.notifications_enabled)}
              disabled={saving}
              className="mt-2"
            >
              Save
            </Button>
          </div>
        </div>
      </div>

      {/* Point Rules */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Point Rules (per tattoo size)</h2>
        <p className="text-sm text-gray-500 mb-4">Configure how many points are awarded per tattoo size. Both the referrer and referred client earn this amount.</p>
        <div className="grid md:grid-cols-3 gap-4">
          {['minimalist', 'medium', 'big'].map(size => {
            const rule = rules.find(r => r.tattoo_size === size);
            if (!rule) return null;
            return (
              <div key={size} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-bold capitalize mb-2">{size}</h3>
                <Input
                  type="number"
                  value={rule.points_awarded}
                  onChange={e => {
                    const updated = { ...rule, points_awarded: parseInt(e.target.value) };
                    setRules(rules.map(r => r.id === rule.id ? updated : r));
                  }}
                />
                <Button
                  onClick={() => handleSaveRule(rule)}
                  disabled={saving}
                  className="mt-2 w-full"
                >
                  Save
                </Button>
              </div>
            );
          })}
        </div>
        <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
          <strong>Default values:</strong> Minimalist = 50, Medium = 100, Big = 250
        </div>
      </div>
    </div>
  );
}
