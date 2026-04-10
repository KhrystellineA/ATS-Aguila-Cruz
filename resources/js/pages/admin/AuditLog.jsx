import { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function AuditLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/audit-logs').then(r => setLogs(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-purple-400">LOADING...</div>;

  const actionLabels = {
    client_created: 'Created client',
    client_updated: 'Updated client',
    client_deleted: 'Deleted client',
    points_adjustment: 'Adjusted points',
    code_change_approved: 'Approved code change',
    code_change_rejected: 'Rejected code change',
    redemption_approveded: 'Approved redemption',
    redemption_rejected: 'Rejected redemption',
    referral_created: 'Created referral',
    reward_created: 'Created reward',
    reward_updated: 'Updated reward',
    reward_deleted: 'Deleted reward',
  };

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-gradient mb-6 tracking-wider">AUDIT LOG</h1>

      <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg border border-purple-800 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-purple-400 border-b-2 border-purple-800">
              <th className="p-3 tracking-wider text-xs">DATE</th>
              <th className="p-3 tracking-wider text-xs">ACTION</th>
              <th className="p-3 tracking-wider text-xs">TARGET</th>
              <th className="p-3 tracking-wider text-xs">DETAILS</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id} className="border-b border-gray-800 hover:bg-gray-800/40 transition-colors">
                <td className="p-3 text-gray-400">{new Date(log.created_at).toLocaleString()}</td>
                <td className="p-3 font-medium text-purple-300">{actionLabels[log.action] || log.action}</td>
                <td className="p-3 text-gray-300">
                  {log.target_type} #{log.target_id}
                </td>
                <td className="p-3 text-gray-400 font-mono text-xs">
                  {log.payload ? JSON.stringify(log.payload) : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {logs.length === 0 && <p className="text-gray-500 text-sm p-4 text-center tracking-wider">NO AUDIT LOGS FOUND</p>}
      </div>
    </div>
  );
}
