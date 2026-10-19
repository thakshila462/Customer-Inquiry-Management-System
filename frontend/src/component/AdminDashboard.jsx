import { useEffect, useMemo, useState } from "react";
import api from "../services/api";

const STATUS_OPTIONS = ["NEW", "IN_PROGRESS", "RESOLVED"];

const statusStyles = {
    NEW: "bg-blue-50 text-blue-700 ring-blue-200",
    IN_PROGRESS: "bg-amber-50 text-amber-700 ring-amber-200",
    RESOLVED: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

function formatStatus(status = "") {
    return status.replaceAll("_", " ");
}

function formatDate(date) {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "—";

    return parsedDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

export default function AdminDashboard({ onLogout }) {
    const [inquiries, setInquiries] = useState([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activePage, setActivePage] = useState("Dashboard");
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [updatingId, setUpdatingId] = useState(null);

    const [form, setForm] = useState({
        customer_name: "",
        contact_info: "",
        subject: "",
        description: "",
    });

    async function loadInquiries() {
        setLoading(true);
        setError("");

        try {
            const response = await api.get("/inquiries");

            // Supports common Express response formats.
            const result = response.data;
            const list = Array.isArray(result)
                ? result
                : result.inquiries ?? result.data ?? [];

            if (!Array.isArray(list)) {
                throw new Error("The server returned an unexpected response.");
            }

            setInquiries(list);
        } catch (err) {
            if (err.response?.status === 401) {
                setError("Your session has expired. Please sign in again.");
            } else {
                setError(
                    err.response?.data?.message ||
                    "Could not load inquiries. Check whether the backend is running.",
                );
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadInquiries();
    }, []);

    const statistics = useMemo(
        () => [
            {
                title: "Total Inquiries",
                value: inquiries.length,
                icon: "▤",
                color: "bg-indigo-50 text-indigo-600",
            },
            {
                title: "New",
                value: inquiries.filter((item) => item.status === "NEW").length,
                icon: "✉",
                color: "bg-blue-50 text-blue-600",
            },
            {
                title: "In Progress",
                value: inquiries.filter((item) => item.status === "IN_PROGRESS")
                    .length,
                icon: "◷",
                color: "bg-amber-50 text-amber-600",
            },
            {
                title: "Resolved",
                value: inquiries.filter((item) => item.status === "RESOLVED").length,
                icon: "✓",
                color: "bg-emerald-50 text-emerald-600",
            },
        ],
        [inquiries],
    );

    const filteredInquiries = useMemo(() => {
        const term = search.trim().toLowerCase();

        return inquiries.filter((item) => {
            const matchesSearch =
                !term ||
                [item.customer_name, item.subject, item.contact_info]
                    .filter(Boolean)
                    .some((value) => String(value).toLowerCase().includes(term));

            const matchesStatus =
                statusFilter === "ALL" || item.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [inquiries, search, statusFilter]);

    function handleFormChange(event) {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    }

    async function handleCreateInquiry(event) {
        event.preventDefault();
        setSubmitting(true);
        setError("");

        try {
            await api.post("/inquiries", {
                customer_name: form.customer_name.trim(),
                contact_info: form.contact_info.trim(),
                subject: form.subject.trim(),
                description: form.description.trim(),
            });

            setForm({
                customer_name: "",
                contact_info: "",
                subject: "",
                description: "",
            });

            setShowForm(false);
            setActivePage("Dashboard");
            await loadInquiries();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Could not create the inquiry. Please check your details.",
            );
        } finally {
            setSubmitting(false);
        }
    }

    async function handleStatusChange(inquiry, nextStatus) {
        if (nextStatus === inquiry.status) return;

        const allowedNextStatus = {
            NEW: ["IN_PROGRESS"],
            IN_PROGRESS: ["RESOLVED"],
            RESOLVED: [],
        };

        if (!allowedNextStatus[inquiry.status]?.includes(nextStatus)) {
            setError("This status transition is not allowed.");
            return;
        }

        setUpdatingId(inquiry.id);
        setError("");

        try {
            await api.patch(`/inquiries/${inquiry.id}/status`, {
                status: nextStatus,
            });

            await loadInquiries();
        } catch (err) {
            setError(
                err.response?.data?.message || "Could not update the inquiry status.",
            );
        } finally {
            setUpdatingId(null);
        }
    }

    function handleLogout() {
        localStorage.removeItem("ACCESS_TOKEN");

        if (onLogout) {
            onLogout();
        }
    }

    const navigation = [
        { name: "Dashboard", icon: "▦" },
        { name: "All Inquiries", icon: "▤" },
        { name: "New Inquiry", icon: "+" },
    ];

    return (
        <div className="min-h-screen bg-slate-100 text-slate-800">
            <div className="flex min-h-screen">
                {/* Sidebar */}
                <aside className="hidden w-64 shrink-0 flex-col bg-slate-950 text-white md:flex">
                    <div className="border-b border-slate-800 px-6 py-7">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-2xl font-bold">
                                I
                            </div>

                            <div>
                                <h1 className="text-lg font-bold tracking-wide">
                                    InquiryFlow
                                </h1>
                                <p className="mt-1 text-xs text-slate-400">STAFF PORTAL</p>
                            </div>
                        </div>
                    </div>

                    <div className="px-4 py-6">
                        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
                            Workspace
                        </p>

                        <nav className="space-y-2">
                            {navigation.map((item) => (
                                <button
                                    key={item.name}
                                    onClick={() => {
                                        setActivePage(item.name);
                                        setShowForm(item.name === "New Inquiry");
                                        setError("");
                                    }}
                                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                                        activePage === item.name
                                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-950/30"
                                            : "text-slate-400 hover:bg-slate-900 hover:text-white"
                                    }`}
                                >
                                    <span className="w-5 text-lg">{item.icon}</span>
                                    {item.name}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="mt-auto border-t border-slate-800 p-4">
                        <div className="mb-4 flex items-center gap-3 rounded-xl bg-slate-900 p-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500 font-bold">
                                S
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-semibold">Staff Account</p>
                                <p className="text-xs text-slate-400">Inquiry Management</p>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="w-full rounded-xl px-4 py-3 text-left text-sm text-slate-300 transition hover:bg-red-500/10 hover:text-red-300"
                        >
                            ↪ &nbsp; Sign Out
                        </button>
                    </div>
                </aside>

                {/* Main content */}
                <main className="min-w-0 flex-1">
                    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 py-5 sm:px-8">
                        <div>
                            <p className="text-sm text-slate-500">
                                Workspace / {activePage}
                            </p>
                            <h2 className="mt-1 text-2xl font-bold text-slate-900">
                                {showForm ? "Create New Inquiry" : activePage}
                            </h2>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={loadInquiries}
                                disabled={loading}
                                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold transition hover:bg-slate-50 disabled:opacity-50"
                            >
                                ↻ Refresh
                            </button>

                            <button
                                onClick={() => {
                                    setActivePage("New Inquiry");
                                    setShowForm(true);
                                    setError("");
                                }}
                                className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                            >
                                + New Inquiry
                            </button>
                        </div>
                    </header>

                    <div className="p-5 sm:p-8">
                        {error && (
                            <div
                                role="alert"
                                className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                            >
                                <span>{error}</span>
                                {error.includes("session has expired") && (
                                    <button
                                        onClick={handleLogout}
                                        className="font-semibold underline"
                                    >
                                        Sign in again
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Create inquiry form */}
                        {showForm ? (
                            <section className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                                <div className="mb-6">
                                    <h3 className="text-xl font-bold text-slate-900">
                                        Customer Inquiry Details
                                    </h3>
                                    <p className="mt-1 text-sm text-slate-500">
                                        Enter the customer's details below.
                                    </p>
                                </div>

                                <form onSubmit={handleCreateInquiry} className="space-y-5">
                                    <div>
                                        <label
                                            htmlFor="customer_name"
                                            className="mb-2 block text-sm font-semibold"
                                        >
                                            Customer Name *
                                        </label>
                                        <input
                                            id="customer_name"
                                            name="customer_name"
                                            value={form.customer_name}
                                            onChange={handleFormChange}
                                            required
                                            maxLength={120}
                                            placeholder="Enter customer name"
                                            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="contact_info"
                                            className="mb-2 block text-sm font-semibold"
                                        >
                                            Contact Information *
                                        </label>
                                        <input
                                            id="contact_info"
                                            name="contact_info"
                                            value={form.contact_info}
                                            onChange={handleFormChange}
                                            required
                                            maxLength={150}
                                            placeholder="Phone number or email address"
                                            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="subject"
                                            className="mb-2 block text-sm font-semibold"
                                        >
                                            Subject *
                                        </label>
                                        <input
                                            id="subject"
                                            name="subject"
                                            value={form.subject}
                                            onChange={handleFormChange}
                                            required
                                            maxLength={200}
                                            placeholder="What is the inquiry about?"
                                            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="description"
                                            className="mb-2 block text-sm font-semibold"
                                        >
                                            Description *
                                        </label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            value={form.description}
                                            onChange={handleFormChange}
                                            required
                                            maxLength={5000}
                                            rows={5}
                                            placeholder="Enter details about the customer inquiry..."
                                            className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                                        />
                                    </div>

                                    <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-5">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowForm(false);
                                                setActivePage("Dashboard");
                                                setError("");
                                            }}
                                            className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold hover:bg-slate-50"
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {submitting ? "Saving..." : "Create Inquiry"}
                                        </button>
                                    </div>
                                </form>
                            </section>
                        ) : (
                            <>
                                {/* Statistics */}
                                <section className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                                    {statistics.map((stat) => (
                                        <article
                                            key={stat.title}
                                            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-slate-500">
                                                        {stat.title}
                                                    </p>
                                                    <p className="mt-3 text-3xl font-bold text-slate-900">
                                                        {loading ? "—" : stat.value}
                                                    </p>
                                                </div>

                                                <div
                                                    className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${stat.color}`}
                                                >
                                                    {stat.icon}
                                                </div>
                                            </div>
                                            <p className="mt-4 text-xs text-slate-400">
                                                Current inquiry records
                                            </p>
                                        </article>
                                    ))}
                                </section>

                                {/* Inquiry table */}
                                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                                    <div className="flex flex-col gap-4 border-b border-slate-200 p-5 lg:flex-row lg:items-center lg:justify-between">
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900">
                                                Customer Inquiries
                                            </h3>
                                            <p className="mt-1 text-sm text-slate-500">
                                                View and manage customer requests.
                                            </p>
                                        </div>

                                        <div className="flex flex-col gap-3 sm:flex-row">
                                            <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                          ⌕
                        </span>
                                                <input
                                                    type="search"
                                                    value={search}
                                                    onChange={(event) => setSearch(event.target.value)}
                                                    placeholder="Search inquiries..."
                                                    aria-label="Search inquiries"
                                                    className="w-full rounded-xl border border-slate-300 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 sm:w-60"
                                                />
                                            </div>

                                            <select
                                                value={statusFilter}
                                                onChange={(event) => setStatusFilter(event.target.value)}
                                                aria-label="Filter by status"
                                                className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                                            >
                                                <option value="ALL">All statuses</option>
                                                {STATUS_OPTIONS.map((status) => (
                                                    <option key={status} value={status}>
                                                        {formatStatus(status)}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {loading ? (
                                        <div className="p-12 text-center">
                                            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
                                            <p className="mt-4 text-sm text-slate-500">
                                                Loading inquiries...
                                            </p>
                                        </div>
                                    ) : filteredInquiries.length === 0 ? (
                                        <div className="px-6 py-16 text-center">
                                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl text-slate-500">
                                                ▤
                                            </div>
                                            <h4 className="mt-4 font-semibold text-slate-900">
                                                No inquiries found
                                            </h4>
                                            <p className="mt-2 text-sm text-slate-500">
                                                {inquiries.length === 0
                                                    ? "Create a new inquiry to get started."
                                                    : "Try changing your search or status filter."}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="w-full min-w-[850px] text-left text-sm">
                                                <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                                                <tr>
                                                    <th className="px-6 py-4 font-semibold">
                                                        Customer
                                                    </th>
                                                    <th className="px-6 py-4 font-semibold">Subject</th>
                                                    <th className="px-6 py-4 font-semibold">Contact</th>
                                                    <th className="px-6 py-4 font-semibold">Status</th>
                                                    <th className="px-6 py-4 font-semibold">Created</th>
                                                    <th className="px-6 py-4 font-semibold">
                                                        Update Status
                                                    </th>
                                                </tr>
                                                </thead>

                                                <tbody className="divide-y divide-slate-100">
                                                {filteredInquiries.map((inquiry) => {
                                                    const nextStatus =
                                                        inquiry.status === "NEW"
                                                            ? "IN_PROGRESS"
                                                            : inquiry.status === "IN_PROGRESS"
                                                                ? "RESOLVED"
                                                                : null;

                                                    return (
                                                        <tr
                                                            key={inquiry.id}
                                                            className="transition hover:bg-slate-50"
                                                        >
                                                            <td className="px-6 py-5">
                                                                <p className="font-semibold text-slate-900">
                                                                    {inquiry.customer_name}
                                                                </p>
                                                                <p className="mt-1 text-xs text-slate-400">
                                                                    ID: {inquiry.id}
                                                                </p>
                                                            </td>

                                                            <td className="max-w-56 px-6 py-5">
                                                                <p className="truncate font-medium text-slate-700">
                                                                    {inquiry.subject}
                                                                </p>
                                                                <p className="mt-1 max-w-56 truncate text-xs text-slate-400">
                                                                    {inquiry.description}
                                                                </p>
                                                            </td>

                                                            <td className="px-6 py-5 text-slate-600">
                                                                {inquiry.contact_info}
                                                            </td>

                                                            <td className="px-6 py-5">
                                  <span
                                      className={`inline-flex whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ${
                                          statusStyles[inquiry.status] ||
                                          "bg-slate-100 text-slate-600 ring-slate-200"
                                      }`}
                                  >
                                    {formatStatus(inquiry.status)}
                                  </span>
                                                            </td>

                                                            <td className="whitespace-nowrap px-6 py-5 text-slate-500">
                                                                {formatDate(
                                                                    inquiry.created_at ?? inquiry.createdAt,
                                                                )}
                                                            </td>

                                                            <td className="px-6 py-5">
                                                                {nextStatus ? (
                                                                    <button
                                                                        disabled={updatingId === inquiry.id}
                                                                        onClick={() =>
                                                                            handleStatusChange(inquiry, nextStatus)
                                                                        }
                                                                        className="whitespace-nowrap rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 disabled:opacity-50"
                                                                    >
                                                                        {updatingId === inquiry.id
                                                                            ? "Updating..."
                                                                            : `Mark ${formatStatus(nextStatus)}`}
                                                                    </button>
                                                                ) : (
                                                                    <span className="text-xs font-medium text-emerald-600">
                                      ✓ Completed
                                    </span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}

                                    <div className="border-t border-slate-200 px-5 py-4 text-xs text-slate-500">
                                        Showing {filteredInquiries.length} of {inquiries.length}{" "}
                                        inquiries
                                    </div>
                                </section>
                            </>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}