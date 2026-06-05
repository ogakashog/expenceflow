/**
 * useExpenses Hook
 * 
 * Manages the full expense lifecycle: fetching, search, filter, sort, and pagination.
 * All filtering/sorting is done client-side after fetching all user expenses.
 */
import { useState, useEffect, useMemo, useCallback } from 'react';
import { getExpenses } from '../services/expenseService';
import { PAGE_SIZE } from '../utils/constants';

/**
 * @param {string|null} userId - The authenticated user's UID.
 * @returns {Object} Expense data + filter/sort/pagination state and setters.
 */
export function useExpenses(userId) {
  const [allExpenses, setAllExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & search state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' | 'desc'
  const [currentPage, setCurrentPage] = useState(1);

  const handleSetSearchQuery = useCallback((query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  const handleSetStatusFilter = useCallback((status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  }, []);

  const handleSetSortOrder = useCallback((order) => {
    setSortOrder(order);
    setCurrentPage(1);
  }, []);

  /**
   * Fetches all expenses for the user from Firestore.
   */
  const fetchExpenses = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getExpenses(userId);
      setAllExpenses(data);
    } catch (err) {
      console.error('Error fetching expenses:', err);
      setError('Failed to load expenses. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Fetch on mount and when userId changes
  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const data = await getExpenses(userId);
        if (active) {
          setAllExpenses(data);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error in useExpenses effect:', err);
        if (active) {
          setError('Failed to load expenses. Please try again.');
          setLoading(false);
        }
      }
    };

    if (userId) {
      // Defer state updates to microtask queue to avoid synchronous state transitions inside effect
      Promise.resolve().then(() => {
        if (active) {
          setLoading(true);
          setError(null);
        }
      });
      load();
    } else {
      // Defer state updates to microtask queue
      Promise.resolve().then(() => {
        if (active) {
          setAllExpenses([]);
          setLoading(false);
        }
      });
    }

    return () => {
      active = false;
    };
  }, [userId]);

  /**
   * Applies search, filter, and sort to the raw expense list.
   */
  const filteredExpenses = useMemo(() => {
    let result = [...allExpenses];

    // Search by category or description
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (exp) =>
          exp.category?.toLowerCase().includes(q) ||
          exp.description?.toLowerCase().includes(q)
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      result = result.filter((exp) => exp.status === statusFilter);
    }

    // Sort by date
    result.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    return result;
  }, [allExpenses, searchQuery, statusFilter, sortOrder]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredExpenses.length / PAGE_SIZE));

  const paginatedExpenses = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredExpenses.slice(start, start + PAGE_SIZE);
  }, [filteredExpenses, currentPage]);

  // Filter reset logic is handled directly in handleSetSearchQuery/handleSetStatusFilter/handleSetSortOrder

  /**
   * Dashboard statistics computed from the full (unfiltered) expense list.
   */
  const stats = useMemo(() => {
    const total = allExpenses.length;
    const totalAmount = allExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    const approved = allExpenses.filter((e) => e.status === 'approved').length;
    const rejected = allExpenses.filter((e) => e.status === 'rejected').length;
    const submitted = allExpenses.filter((e) => e.status === 'submitted').length;
    const draft = allExpenses.filter((e) => e.status === 'draft').length;
    const approvedAmount = allExpenses
      .filter((e) => e.status === 'approved')
      .reduce((sum, e) => sum + (e.amount || 0), 0);

    return { total, totalAmount, approved, rejected, submitted, draft, approvedAmount };
  }, [allExpenses]);

  return {
    expenses: paginatedExpenses,
    allExpenses,
    filteredExpenses,
    loading,
    error,
    stats,
    // Search / Filter / Sort
    searchQuery,
    setSearchQuery: handleSetSearchQuery,
    statusFilter,
    setStatusFilter: handleSetStatusFilter,
    sortOrder,
    setSortOrder: handleSetSortOrder,
    // Pagination
    currentPage,
    setCurrentPage,
    totalPages,
    // Refresh
    refetch: fetchExpenses,
  };
}
