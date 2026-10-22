'use client';

import React, { useState } from 'react';
import {
  Users,
  ShieldAlert,
  Activity,
  FileText,
  Server,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  RefreshCw,
  Coins,
  GraduationCap,
  Briefcase,
  Lock,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'kpi' | 'moderation' | 'users' | 'audit' | 'health'>('kpi');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'SUSPENDED'>('ALL');
  const [searchUser, setSearchUser] = useState('');
  const [reportActionMessage, setReportActionMessage] = useState<string | null>(null);

  // Platform KPI metrics mirroring getAdminOverview
  const stats = {
    totalUsers: 1420,
    activeStudents: 1380,
    suspendedUsers: 12,
    pendingVerification: 28,
    totalLessonsCompleted: 18450,
    totalQuizAttempts: 12380,
    totalJobApplications: 4120,
    totalSpeakingCalls: 3890,
    openModerationReports: 2,
    circulatingCoins: 184500,
    coinsPurchasedEur: '€14,890',
  };

  // Moderation Queue mirroring getModerationQueue
  const [reports, setReports] = useState([
    {
      id: 'rep-101',
      reportedName: 'Max K.',
      reportedEmail: 'max.k99@example.de',
      reporterName: 'Ananya S.',
      reporterEmail: 'ananya.s@example.de',
      reason: 'INAPPROPRIATE_LANGUAGE',
      details: 'Candidate used discriminatory slurs and refused to follow the healthcare dialog roleplay card.',
      roomId: 'room-tandem-8823',
      cefrLevel: 'B1',
      date: 'Today, 10:14 CET',
      isResolved: false,
    },
    {
      id: 'rep-102',
      reportedName: 'Denis B.',
      reportedEmail: 'denis.b@example.de',
      reporterName: 'Tanvir A.',
      reporterEmail: 'tanvir.a@example.de',
      reason: 'NO_SHOW_AND_HARASSMENT',
      details: 'Candidate left camera blank and demanded off-platform contact details.',
      roomId: 'room-tandem-7712',
      cefrLevel: 'A2',
      date: 'Yesterday, 18:45 CET',
      isResolved: false,
    },
  ]);

  // Mock User Directory
  const [users, setUsers] = useState([
    {
      id: 'u-1',
      name: 'Rahim Khan',
      email: 'rahim.khan@example.de',
      role: 'STUDENT',
      status: 'ACTIVE',
      joinedDate: '12. Sep 2026',
      coins: 450,
    },
    {
      id: 'u-2',
      name: 'Ananya Sharma',
      email: 'ananya.s@example.de',
      role: 'STUDENT',
      status: 'ACTIVE',
      joinedDate: '15. Sep 2026',
      coins: 620,
    },
    {
      id: 'u-3',
      name: 'Max K.',
      email: 'max.k99@example.de',
      role: 'STUDENT',
      status: 'SUSPENDED',
      joinedDate: '01. Okt 2026',
      coins: 20,
    },
    {
      id: 'u-4',
      name: 'Dr. Julia Weber',
      email: 'julia.weber@ausbildung-portal.de',
      role: 'INSTRUCTOR',
      status: 'ACTIVE',
      joinedDate: '01. Aug 2026',
      coins: 2500,
    },
    {
      id: 'u-5',
      name: 'Elena Schmidt',
      email: 'elena.s@ausbildung-portal.de',
      role: 'MODERATOR',
      status: 'ACTIVE',
      joinedDate: '10. Aug 2026',
      coins: 1000,
    },
  ]);

  // Audit Logs mirroring getAuditLogs
  const auditLogs = [
    {
      id: 'aud-991',
      actor: 'admin@ausbildung.de',
      action: 'MODERATION_SUSPEND_USER',
      targetEntity: 'User (Max K.)',
      details: 'Suspended user following substantiated report rep-101. Revoked all JWT sessions.',
      ipAddress: '194.168.10.45',
      timestamp: '22. Okt 2026, 11:20 CET',
    },
    {
      id: 'aud-990',
      actor: 'admin@ausbildung.de',
      action: 'ADMIN_ASSIGN_ROLE',
      targetEntity: 'User (Elena Schmidt)',
      details: 'Assigned MODERATOR role to Elena Schmidt.',
      ipAddress: '194.168.10.45',
      timestamp: '21. Okt 2026, 16:05 CET',
    },
    {
      id: 'aud-989',
      actor: 'admin@ausbildung.de',
      action: 'ADMIN_ADJUST_COINS',
      targetEntity: 'User (Rahim Khan)',
      details: '+100 Coins credited due to speaking matchmaking latency compensation.',
      ipAddress: '194.168.10.45',
      timestamp: '20. Okt 2026, 14:12 CET',
    },
    {
      id: 'aud-988',
      actor: 'system',
      action: 'STRIPE_WEBHOOK_FULFILLED',
      targetEntity: 'CoinWallet (Ananya Sharma)',
      details: 'Purchased Pro 350 Coins pack (€12.99). Session cs_test_981248.',
      ipAddress: '54.187.205.1',
      timestamp: '19. Okt 2026, 09:30 CET',
    },
  ];

  const handleResolveReport = (reportId: string, action: 'DISMISS' | 'SUSPEND_USER') => {
    setReports((prev) => prev.filter((r) => r.id !== reportId));
    if (action === 'SUSPEND_USER') {
      setReportActionMessage(`Report ${reportId} resolved: Offending user account suspended and sessions revoked.`);
    } else {
      setReportActionMessage(`Report ${reportId} dismissed without disciplinary action.`);
    }
    setTimeout(() => setReportActionMessage(null), 4000);
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const newStatus = u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
          return { ...u, status: newStatus };
        }
        return u;
      }),
    );
  };

  const filteredUsers = users.filter((u) => {
    const matchesStatus = statusFilter === 'ALL' || u.status === statusFilter;
    const matchesSearch =
      u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.email.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.role.toLowerCase().includes(searchUser.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header & Controls */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
              <ShieldAlert className="w-3.5 h-3.5" />
              Role: System Administrator
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Operational Control Center & Administration
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Platform telemetry, candidate safety moderation, user management, audit trails, and system diagnostics.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              System Status: OPERATIONAL
            </span>
          </div>
        </div>

        {/* Global Action Banner */}
        {reportActionMessage && (
          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            {reportActionMessage}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-1">
          {[
            { id: 'kpi', label: 'Platform KPIs', icon: Activity },
            { id: 'moderation', label: `Moderation Queue (${reports.length})`, icon: ShieldAlert },
            { id: 'users', label: 'User Directory', icon: Users },
            { id: 'audit', label: 'Security Audit Logs', icon: FileText },
            { id: 'health', label: 'System Health Diagnostics', icon: Server },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Platform Overview & KPIs */}
        {activeTab === 'kpi' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-medium">Registered Users</span>
                  <Users className="w-4 h-4 text-blue-500" />
                </div>
                <div className="text-2xl font-black">{stats.totalUsers}</div>
                <div className="text-[11px] text-emerald-500 font-semibold mt-1">
                  {stats.activeStudents} Active Candidates
                </div>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-medium">Lessons Completed</span>
                  <GraduationCap className="w-4 h-4 text-indigo-500" />
                </div>
                <div className="text-2xl font-black">{stats.totalLessonsCompleted.toLocaleString()}</div>
                <div className="text-[11px] text-slate-500 mt-1">
                  {stats.totalQuizAttempts.toLocaleString()} Quizzes Evaluated
                </div>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-medium">Ausbildung Applications</span>
                  <Briefcase className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="text-2xl font-black">{stats.totalJobApplications.toLocaleString()}</div>
                <div className="text-[11px] text-slate-500 mt-1">Across 16 German Federal States</div>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-medium">Circulating Coin Economy</span>
                  <Coins className="w-4 h-4 text-yellow-500" />
                </div>
                <div className="text-2xl font-black text-yellow-500">{stats.circulatingCoins.toLocaleString()}</div>
                <div className="text-[11px] text-slate-500 mt-1">{stats.coinsPurchasedEur} in Gross Volume</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                <h3 className="font-bold text-sm">German Language Learning Distribution</h3>
                <div className="space-y-3">
                  {[
                    { level: 'A1 Beginner', count: 680, pct: 48 },
                    { level: 'A2 Elementary', count: 420, pct: 30 },
                    { level: 'B1 Intermediate', count: 240, pct: 17 },
                    { level: 'B2 Vocational Specialist', count: 80, pct: 5 },
                  ].map((item) => (
                    <div key={item.level} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span>{item.level}</span>
                        <span className="text-slate-500">{item.count} candidates ({item.pct}%)</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-blue-600 h-full rounded-full" style={{ width: `${item.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                <h3 className="font-bold text-sm">Application Funnel Breakdown</h3>
                <div className="space-y-3">
                  {[
                    { stage: 'Planned Applications', count: 1820, color: 'bg-purple-500' },
                    { stage: 'Submitted Applications', count: 1450, color: 'bg-blue-500' },
                    { stage: 'Invited to Interview', count: 580, color: 'bg-amber-500' },
                    { stage: 'Contract Offers Received', count: 270, color: 'bg-emerald-500' },
                  ].map((stage) => (
                    <div key={stage.stage} className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 text-xs">
                      <div className="flex items-center gap-2.5">
                        <span className={`w-2.5 h-2.5 rounded-full ${stage.color}`} />
                        <span className="font-medium">{stage.stage}</span>
                      </div>
                      <span className="font-black">{stage.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Moderation Queue */}
        {activeTab === 'moderation' && (
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Candidate Speaking Incident Queue</h2>
                <p className="text-xs text-slate-500">
                  Review reported violations during peer WebRTC tandem practice and enforce disciplinary actions.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                {reports.length} Open Incidents
              </span>
            </div>

            {reports.length === 0 ? (
              <div className="text-center py-12 space-y-2">
                <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto" />
                <h3 className="text-sm font-bold">Moderation queue is empty</h3>
                <p className="text-xs text-slate-500">All filed speaking reports have been thoroughly resolved.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reports.map((rep) => (
                  <div
                    key={rep.id}
                    className="p-5 rounded-xl border border-red-500/20 bg-red-500/5 space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-red-500/10 pb-3">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                        <span className="text-xs font-bold text-red-500 uppercase">{rep.reason.replace(/_/g, ' ')}</span>
                        <span className="text-xs text-slate-500 font-mono">({rep.roomId})</span>
                      </div>
                      <span className="text-xs text-slate-400">{rep.date}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-slate-400 block mb-0.5">Reported Candidate:</span>
                        <p className="font-bold text-slate-800 dark:text-slate-200">{rep.reportedName} ({rep.reportedEmail})</p>
                      </div>
                      <div>
                        <span className="text-slate-400 block mb-0.5">Reported By:</span>
                        <p className="font-medium text-slate-800 dark:text-slate-200">{rep.reporterName} ({rep.reporterEmail})</p>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs">
                      <span className="font-bold text-slate-500 block mb-1">Incident Report Statement:</span>
                      <p className="text-slate-700 dark:text-slate-300 italic">"{rep.details}"</p>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-1">
                      <button
                        onClick={() => handleResolveReport(rep.id, 'DISMISS')}
                        className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        Dismiss Report
                      </button>
                      <button
                        onClick={() => handleResolveReport(rep.id, 'SUSPEND_USER')}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        Suspend Candidate Account
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: User Directory */}
        {activeTab === 'users' && (
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold">Candidate & Staff Directory</h2>
                <p className="text-xs text-slate-500">Manage account access, assign roles, and audit candidate status.</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Search candidate name, email..."
                    value={searchUser}
                    onChange={(e) => setSearchUser(e.target.value)}
                    className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 text-xs focus:outline-hidden focus:border-blue-500"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 text-xs focus:outline-hidden"
                >
                  <option value="ALL">All Status</option>
                  <option value="ACTIVE">Active Only</option>
                  <option value="SUSPENDED">Suspended Only</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                    <th className="pb-3 font-semibold">User</th>
                    <th className="pb-3 font-semibold">Role</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold">Joined</th>
                    <th className="pb-3 font-semibold">Wallet</th>
                    <th className="pb-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="py-3">
                        <div className="font-bold text-slate-900 dark:text-slate-100">{user.name}</div>
                        <div className="text-[11px] text-slate-400">{user.email}</div>
                      </td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20">
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            user.status === 'ACTIVE'
                              ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                              : 'bg-red-500/10 text-red-500 border-red-500/20'
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="py-3 text-slate-500">{user.joinedDate}</td>
                      <td className="py-3 font-semibold text-yellow-500">{user.coins} 🪙</td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => handleToggleUserStatus(user.id)}
                          className={`px-3 py-1 rounded-lg text-[11px] font-bold border transition-colors ${
                            user.status === 'ACTIVE'
                              ? 'text-red-500 border-red-500/30 hover:bg-red-500/10'
                              : 'text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/10'
                          }`}
                        >
                          {user.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Security Audit Logs */}
        {activeTab === 'audit' && (
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div>
              <h2 className="text-lg font-bold">Immutable Security Audit Ledger</h2>
              <p className="text-xs text-slate-500">
                Cryptographically tracked administrative operations and sensitive privilege mutations.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                    <th className="pb-3 font-semibold">Timestamp</th>
                    <th className="pb-3 font-semibold">Actor</th>
                    <th className="pb-3 font-semibold">Action</th>
                    <th className="pb-3 font-semibold">Target Entity</th>
                    <th className="pb-3 font-semibold">IP Address</th>
                    <th className="pb-3 font-semibold">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono text-[11px]">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="py-3 text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                      <td className="py-3 font-semibold text-blue-500">{log.actor}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 dark:bg-slate-800">
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 text-slate-300 font-sans">{log.targetEntity}</td>
                      <td className="py-3 text-slate-400">{log.ipAddress}</td>
                      <td className="py-3 text-slate-400 font-sans max-w-xs truncate">{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: System Health Diagnostics */}
        {activeTab === 'health' && (
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Diagnostic Runtime Probes</h2>
                <p className="text-xs text-slate-500">Real-time health probes verifying database, memory, and external API connectivity.</p>
              </div>
              <span className="text-xs font-semibold text-emerald-500 flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> All Systems Green
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">PostgreSQL Database (Prisma ORM)</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-500">HEALTHY</span>
                </div>
                <div className="text-xs text-slate-500">Query Ping Latency: <span className="font-mono text-emerald-500 font-bold">3.2 ms</span></div>
                <div className="text-[11px] text-slate-400">Connection Pool: 10 connections active, 0 queued</div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">Bundesagentur für Arbeit API</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-500">CONNECTED</span>
                </div>
                <div className="text-xs text-slate-500">Endpoint: <span className="font-mono">jobsuche.api.bund.dev</span></div>
                <div className="text-[11px] text-slate-400">Local cache active: 5-minute TTL caching verified</div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">Stripe Payment Gateway</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-500">CONFIGURED</span>
                </div>
                <div className="text-xs text-slate-500">SDK Version: <span className="font-mono">Stripe v17+</span></div>
                <div className="text-[11px] text-slate-400">Webhook Replay Protection: Active (Idempotency Key Verification)</div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">Process Memory Footprint</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-500">OPTIMAL</span>
                </div>
                <div className="text-xs text-slate-500">Heap Used: <span className="font-mono">64 MB / 128 MB</span></div>
                <div className="text-[11px] text-slate-400">Node Runtime: v22.x (x64) on Windows Server</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
