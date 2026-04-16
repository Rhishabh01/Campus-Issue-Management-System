import React, { useEffect, useState } from 'react';
import { getIssues, verifyIssue } from '../services/api';
import MapView from '../components/MapView';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import NotificationBell from '../components/NotificationBell';

const MOCK_ISSUES = [
  { id: 'mock-1', category: 'Electrical', description: 'Streetlight not working near the main gate entrance. Causes safety concerns at night.', status: 'Open', location: { lat: 17.3950, lng: 78.4867, text: 'Main Gate' }, createdAt: '2026-04-10T08:00:00Z', updatedAt: '2026-04-10T08:00:00Z' },
  { id: 'mock-2', category: 'Plumbing', description: 'Water leakage in the second floor washroom. Flooding the corridor.', status: 'In Progress', location: { lat: 17.3855, lng: 78.4880, text: 'Science Block - 2nd Floor' }, createdAt: '2026-04-09T10:30:00Z', updatedAt: '2026-04-12T14:00:00Z' },
  { id: 'mock-3', category: 'Furniture', description: 'Broken chairs in Room 301. Three chairs have missing backrests.', status: 'Resolved', location: { lat: 17.3840, lng: 78.4850, text: 'Arts Building - Room 301' }, createdAt: '2026-04-05T09:00:00Z', updatedAt: '2026-04-11T16:45:00Z' },
  { id: 'mock-4', category: 'Cleaning', description: 'Restroom in library basement is not maintained properly.', status: 'Closed', location: { lat: 17.3860, lng: 78.4900, text: 'Central Library - Basement' }, createdAt: '2026-04-01T07:00:00Z', updatedAt: '2026-04-08T12:00:00Z' },
  { id: 'mock-5', category: 'Electrical', description: 'Fan not working in Lecture Hall 2. Students complaining about heat.', status: 'Open', location: { lat: 17.3845, lng: 78.4870, text: 'Lecture Hall 2' }, createdAt: '2026-04-14T11:00:00Z', updatedAt: '2026-04-14T11:00:00Z' },
  { id: 'mock-6', category: 'Network', description: 'Wi-Fi connectivity issues in the hostel common room.', status: 'In Progress', location: { lat: 17.3835, lng: 78.4840, text: 'Hostel Block A - Common Room' }, createdAt: '2026-04-13T15:30:00Z', updatedAt: '2026-04-15T09:00:00Z' },
];

const DashboardAdmin = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadIssues = async () => {
      try {
        const res = await getIssues({ role: "admin" });
        const data = res.data;
        setIssues(Array.isArray(data) && data.length > 0 ? data : MOCK_ISSUES);
      } catch {
        setIssues(MOCK_ISSUES);
      } finally {
        setLoading(false);
      }
    };
    loadIssues();
  }, []);

  const handleVerify = async (id) => {
    try {
      await verifyIssue(id, { verified: true });
      alert("Issue marked as verified successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to verify issue.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-12 h-12 border-b-2 border-blue-500 rounded-full animate-spin mb-4" />
        <p className="text-gray-400">Loading dashboard data…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-500">Analytics overview and system-wide issue management</p>
          </div>
          <NotificationBell userId="admin-user-id" />
        </div>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12"><MapView issues={issues} /></div>
          <div className="col-span-12"><AnalyticsDashboard issues={issues} /></div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
