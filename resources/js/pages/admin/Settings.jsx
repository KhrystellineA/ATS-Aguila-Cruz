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

  if (loading) return <div className="p-8 text-purple-400">LOADING...</div>;

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-gradient mb-6 tracking-wider">SETTINGS</h1>

      {msg && <div className={`p-3 rounded-lg mb-4 border tracking-wider ${msg.includes('Failed') ? 'bg-red-900/30 text-red-400 border-red-800' : 'bg-green-900/30 text-green-400 border-green-800'}`}>{msg}</div>}

      {/* General Settings */}
      <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg border border-purple-800 p-6 mb-6">
        <h2 className="text-lg font-bold text-gradient mb-4 tracking-wider">GENERAL SETTINGS</h2>
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
              SAVE
            </Button>
          </div>
          <div>
            <label className="flex items-center gap-2 mt-6">
              <input
                type="checkbox"
                checked={settings.notifications_enabled === 'true'}
                onChange={e => setSettings({ ...settings, notifications_enabled: e.target.checked ? 'true' : 'false' })}
                className="w-4 h-4 rounded border-purple-700 bg-gray-800 focus:ring-purple-600"
              />
              <span className="text-xs font-medium text-purple-400 tracking-wider">NOTIFICATIONS ENABLED</span>
            </label>
            <Button
              onClick={() => handleSaveSetting('notifications_enabled', settings.notifications_enabled)}
              disabled={saving}
              className="mt-2"
            >
              SAVE
            </Button>
          </div>
        </div>
      </div>

      {/* Point Rules */}
      <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg border border-purple-800 p-6">
        <h2 className="text-lg font-bold text-gradient mb-4 tracking-wider">POINT RULES (PER TATTOO SIZE)</h2>
        <p className="text-xs text-gray-400 mb-4 tracking-wider">Configure how many points are awarded per tattoo size. Both the referrer and referred client earn this amount.</p>
        <div className="grid md:grid-cols-3 gap-4">
          {['minimalist', 'medium', 'big'].map(size => {
            const rule = rules.find(r => r.tattoo_size === size);
            if (!rule) return null;
            return (
              <div key={size} className="border border-purple-800 rounded-lg p-4 bg-gray-800/30">
                <h3 className="font-bold capitalize mb-2 text-purple-300 tracking-wider">{size}</h3>
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
                  SAVE
                </Button>
              </div>
            );
          })}
        </div>
        <div className="mt-4 p-3 bg-gray-800/50 rounded-lg text-xs text-gray-400 border border-gray-700 tracking-wider">
          <strong>DEFAULT VALUES:</strong> MINIMALIST = 50, MEDIUM = 100, BIG = 250
        </div>
      </div>
    </div>
  );
}
