import { useState, useEffect } from "react";
import api from "../api/axios.js";

// Modal to show newly created key
const NewKeyModal = ({ keyData, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(keyData.key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-lg w-full mx-4">
        <h3 className="text-xl font-bold mb-4">API Key Created</h3>
        <p className="text-red-600 font-semibold mb-4">
          ⚠️ Copy this key now — it will never be shown again.
        </p>
        <div className="flex items-center gap-2 bg-gray-100 p-3 rounded mb-4">
          <code className="flex-1 text-sm break-all">{keyData.key}</code>
          <button
            onClick={handleCopy}
            className="bg-indigo-600 text-white px-3 py-1 rounded text-sm whitespace-nowrap hover:bg-indigo-700"
          >
            {copied ? "✅ Copied!" : "Copy"}
          </button>
        </div>
        <p className="mb-1">
          <span className="font-semibold">Client:</span> {keyData.clientName}
        </p>
        <p className="mb-4">
          <span className="font-semibold">Permissions:</span>{" "}
          {keyData.permissions.join(", ")}
        </p>
        <button
          onClick={onClose}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 w-full"
        >
          I have saved the key — Close
        </button>
      </div>
    </div>
  );
};

// Usage stats panel
const UsagePanel = ({ keyId, onClose }) => {
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/admin/api-keys/${keyId}/usage`)
      .then((res) => setUsage(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [keyId]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-3xl w-full mx-4 max-h-screen overflow-y-auto">
        <h3 className="text-xl font-bold mb-4">Usage Stats</h3>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <>
            <p className="mb-4">
              <span className="font-semibold">Total requests:</span>{" "}
              {usage.total}
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-2 px-3">Endpoint</th>
                    <th className="text-left py-2 px-3">Method</th>
                    <th className="text-left py-2 px-3">IP</th>
                    <th className="text-left py-2 px-3">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {usage.logs.map((log, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="py-2 px-3 font-mono text-xs">
                        {log.endpoint}
                      </td>
                      <td className="py-2 px-3">
                        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">
                          {log.method}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-gray-500">
                        {log.ip_address}
                      </td>
                      <td className="py-2 px-3 text-gray-500">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        <button
          onClick={onClose}
          className="mt-6 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

// Main admin page for API key management
const AVAILABLE_PERMISSIONS = [
  "read:alumni",
  "read:analytics",
  "read:alumni_of_day",
];

const AdminApiKeys = () => {
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clientName, setClientName] = useState("");
  const [permissions, setPermissions] = useState([]);
  const [creating, setCreating] = useState(false);
  const [newKeyData, setNewKeyData] = useState(null);
  const [selectedKeyId, setSelectedKeyId] = useState(null);
  const [error, setError] = useState("");

  const fetchKeys = async () => {
    try {
      const res = await api.get("/admin/api-keys");
      setKeys(res.data);
    } catch (err) {
      setError("Failed to load keys");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  const togglePermission = (perm) => {
    setPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm],
    );
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    if (!clientName.trim()) return setError("Client name is required");
    if (permissions.length === 0)
      return setError("Select at least one permission");
    setCreating(true);
    try {
      const res = await api.post("/admin/api-keys", {
        clientName,
        permissions,
      });
      setNewKeyData(res.data);
      setClientName("");
      setPermissions([]);
      fetchKeys();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create key");
    } finally {
      setCreating(false);
    }
  };

  const handleDeactivate = async (id) => {
    if (!window.confirm("Deactivate this key? It cannot be reactivated."))
      return;
    try {
      await api.delete(`/admin/api-keys/${id}`);
      fetchKeys();
    } catch (err) {
      setError("Failed to deactivate key");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">API Key Management</h2>

      {/* ── Create form ── */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Create New API Key</h3>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <form onSubmit={handleCreate}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client Name
            </label>
            <input
              type="text"
              placeholder="e.g. analytics_dashboard"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Permissions
            </label>
            <div className="space-y-2">
              {AVAILABLE_PERMISSIONS.map((perm) => (
                <label
                  key={perm}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={permissions.includes(perm)}
                    onChange={() => togglePermission(perm)}
                    className="rounded"
                  />
                  <span className="text-sm">{perm}</span>
                </label>
              ))}
            </div>
          </div>
          <button
            type="submit"
            disabled={creating}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50 text-sm"
          >
            {creating ? "Creating..." : "Create Key"}
          </button>
        </form>
      </div>

      {/* ── Keys table ── */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">All API Keys</h3>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : keys.length === 0 ? (
          <p className="text-gray-500">No API keys yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-3">Client</th>
                  <th className="text-left py-3 px-3">Permissions</th>
                  <th className="text-left py-3 px-3">Created</th>
                  <th className="text-left py-3 px-3">Last Used</th>
                  <th className="text-left py-3 px-3">Status</th>
                  <th className="text-left py-3 px-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {keys.map((key) => (
                  <tr
                    key={key.id}
                    onClick={() => setSelectedKeyId(key.id)}
                    className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="py-3 px-3 font-medium">{key.client_name}</td>
                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1">
                        {key.permissions.map((p) => (
                          <span
                            key={p}
                            className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-gray-500">
                      {new Date(key.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-3 text-gray-500">
                      {key.last_used
                        ? new Date(key.last_used).toLocaleString()
                        : "Never"}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          key.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {key.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      {key.is_active && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeactivate(key.id);
                          }}
                          className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                        >
                          Deactivate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      {newKeyData && (
        <NewKeyModal keyData={newKeyData} onClose={() => setNewKeyData(null)} />
      )}
      {selectedKeyId && (
        <UsagePanel
          keyId={selectedKeyId}
          onClose={() => setSelectedKeyId(null)}
        />
      )}
    </div>
  );
};

export default AdminApiKeys;
