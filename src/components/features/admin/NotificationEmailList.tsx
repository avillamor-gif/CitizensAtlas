import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Edit2, Plus, Check, X } from 'lucide-react';

interface NotificationEmail {
  id: number;
  email: string;
  label: string | null;
  is_active: boolean;
  created_at: string;
}

export default function NotificationEmailList() {
  const [emails, setEmails] = useState<NotificationEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ email: '', label: '' });

  // Fetch notification emails
  const fetchEmails = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/notification-emails');
      if (!response.ok) throw new Error('Failed to fetch emails');
      const data = await response.json();
      setEmails(data.emails || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  // Add new email
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) return;

    try {
      const response = await fetch('/api/notification-emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          label: formData.label || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to add email');
      }

      setSuccess('Email added successfully!');
      setFormData({ email: '', label: '' });
      setShowForm(false);
      await fetchEmails();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add email');
    }
  };

  // Update email
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId || !formData.email) return;

    try {
      const response = await fetch(`/api/notification-emails/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          label: formData.label || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update email');
      }

      setSuccess('Email updated successfully!');
      setFormData({ email: '', label: '' });
      setEditingId(null);
      await fetchEmails();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update email');
    }
  };

  // Delete email
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this email?')) return;

    try {
      const response = await fetch(`/api/notification-emails/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete email');

      setSuccess('Email deleted successfully!');
      await fetchEmails();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete email');
    }
  };

  // Toggle active status
  const handleToggleActive = async (id: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/notification-emails/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !currentStatus }),
      });

      if (!response.ok) throw new Error('Failed to update status');

      await fetchEmails();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    }
  };

  // Edit email
  const handleEdit = (email: NotificationEmail) => {
    setEditingId(email.id);
    setFormData({ email: email.email, label: email.label || '' });
    setShowForm(true);
  };

  // Clear success message after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-gray-500">Loading notification emails...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Notification Email Configuration
        </h2>
        <p className="text-gray-600">
          Manage email addresses that receive notifications about pending approvals
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
          {success}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <form
          onSubmit={editingId ? handleUpdate : handleAdd}
          className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200"
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-900">
            {editingId ? 'Edit Email' : 'Add New Email'}
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Label (Optional)
              </label>
              <input
                type="text"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Primary Admin, Secondary Admin"
              />
            </div>

            <div className="flex gap-2">
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                {editingId ? 'Update' : 'Add'} Email
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({ email: '', label: '' });
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg"
              >
                Cancel
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* Add button */}
      {!showForm && (
        <div className="mb-6">
          <Button
            onClick={() => setShowForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus size={18} />
            Add Notification Email
          </Button>
        </div>
      )}

      {/* Email list */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-900">
          Configured Emails ({emails.length})
        </h3>

        {emails.length === 0 ? (
          <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-500">
              No notification emails configured yet. Add one to receive approval notifications.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-700">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-700">Label</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-700">Active</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-700">Added</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {emails.map((email) => (
                  <tr key={email.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900">{email.email}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {email.label || <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleToggleActive(email.id, email.is_active)}
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${
                          email.is_active
                            ? 'bg-green-100 text-green-600'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        {email.is_active ? <Check size={16} /> : <X size={16} />}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(email.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleEdit(email)}
                          className="text-blue-600 hover:text-blue-800 p-1"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(email.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
