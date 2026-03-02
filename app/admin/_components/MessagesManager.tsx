'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Trash2,
  Calendar,
  User,
  Phone,
  Mail,
  MessageSquare,
  Clock,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle
} from 'lucide-react';
import Button from '@/components/ui/Button';

interface Booking {
  id: number;
  name: string;
  phone: string;
  email: string;
  date: string | null;
  message: string;
  createdAt: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function MessagesManager() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/bookings?page=${page}&limit=${limit}`);
      if (res.ok) {
        const data = await res.json();
        setBookings(data.bookings);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchBookings();
      }
    } catch (error) {
      console.error('Failed to delete booking:', error);
    }
  };

  const handleClearAll = async () => {
    if (!confirm('Are you sure you want to clear ALL messages? This action cannot be undone.')) return;

    try {
      const res = await fetch('/api/admin/bookings', {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchBookings();
      }
    } catch (error) {
      console.error('Failed to clear bookings:', error);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <section id="messages" className="p-4 md:p-8 bg-neutral-900 rounded-2xl border border-neutral-800 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Messages</h2>
        {bookings.length > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors border border-red-400/20 w-full sm:w-auto"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      {loading && bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-secondary" />
          <p className="text-neutral-400">Loading messages...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-4 bg-neutral-800/30 rounded-xl border border-dashed border-neutral-700">
          <AlertCircle className="w-12 h-12 text-neutral-600" />
          <p className="text-neutral-400">No messages found.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="p-4 md:p-6 bg-neutral-800/50 border border-neutral-700/50 rounded-xl hover:border-neutral-600 transition-all group relative"
              >
                <button
                  onClick={() => handleDelete(booking.id)}
                  className="absolute top-4 right-4 p-2 text-neutral-500 hover:text-red-500 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity bg-neutral-900 rounded-lg border border-neutral-700 z-10"
                  title="Delete message"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8 mb-6 pr-0 md:pr-12">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-secondary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Name</p>
                      <p className="text-neutral-200 font-medium truncate">{booking.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4 text-secondary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Phone</p>
                      <p className="text-neutral-200 font-medium truncate">{booking.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4 text-secondary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Email</p>
                      <p className="text-neutral-200 font-medium [overflow-wrap:anywhere]">{booking.email}</p>
                    </div>
                  </div>

                  {booking.date && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                        <Calendar className="w-4 h-4 text-secondary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Requested Date</p>
                        <p className="text-neutral-200 font-medium truncate">{booking.date}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-neutral-700/30 flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4 text-neutral-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Received At</p>
                      <p className="text-neutral-400 text-sm truncate">{new Date(booking.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-neutral-900/80 p-4 md:p-5 rounded-xl border border-neutral-700/50 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-secondary/50"></div>
                  <div className="flex items-start gap-4">
                    <MessageSquare className="w-5 h-5 text-secondary mt-1 shrink-0" />
                    <div className="space-y-1 min-w-0">
                      <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Message</p>
                      <p className="text-neutral-300 whitespace-pre-wrap leading-relaxed break-words">{booking.message}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-neutral-800">
              <p className="text-sm text-neutral-500">
                Showing <span className="text-neutral-300 font-medium">{bookings.length}</span> of <span className="text-neutral-300 font-medium">{pagination.total}</span> messages
              </p>
              <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto justify-center">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="p-2 rounded-lg border border-neutral-700 text-neutral-400 hover:text-white hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shrink-0"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-1 sm:gap-2">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => handlePageChange(p)}
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg border transition-all shrink-0 ${page === p
                        ? 'bg-secondary border-secondary text-white shadow-lg shadow-secondary/20'
                        : 'border-neutral-700 text-neutral-400 hover:border-neutral-500 hover:text-white'
                        }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === pagination.totalPages}
                  className="p-2 rounded-lg border border-neutral-700 text-neutral-400 hover:text-white hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shrink-0"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
