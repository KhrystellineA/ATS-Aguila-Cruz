import { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function AuditLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/audit-logs').then(r => setLogs(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-gray-500">Loading...</div>;

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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Audit Log</h1>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="p-3">Date</th>
              <th className="p-3">Action</th>
              <th className="p-3">Target</th>
              <th className="p-3">Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id} className="border-b hover:bg-gray-50">
                <td className="p-3 text-gray-500">{new Date(log.created_at).toLocaleString()}</td>
                <td className="p-3 font-medium">{actionLabels[log.action] || log.action}</td>
                <td className="p-3">
                  {log.target_type} #{log.target_id}
                </td>
                <td className="p-3 text-gray-500 font-mono text-xs">
                  {log.payload ? JSON.stringify(log.payload) : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {logs.length === 0 && <p className="text-gray-400 text-sm p-4 text-center">No audit logs found.</p>}
      </div>
    </div>
  );
}
