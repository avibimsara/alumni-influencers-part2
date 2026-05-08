import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios.js";

const VerifyEmail = () => {
  const { token } = useParams();
  const [message, setMessage] = useState("Verifying your email...");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await api.get(`/auth/verify-email/${token}`);
        setMessage(res.data.message);
        setSuccess(true);
      } catch (err) {
        setMessage(err.response?.data?.message || "Verification failed");
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-indigo-600 mb-1">
            Alumni Portal
          </h1>
          <p className="text-sm text-gray-500">Email Verification</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          {loading ? (
            <>
              <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm text-gray-500">
                Verifying your email address...
              </p>
            </>
          ) : success ? (
            <>
              <div className="text-5xl mb-4">✅</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Email Verified!
              </h2>
              <p className="text-sm text-gray-500 mb-6">{message}</p>
              <Link
                to="/login"
                className="inline-block bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
              >
                Sign in now →
              </Link>
            </>
          ) : (
            <>
              <div className="text-5xl mb-4">❌</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Verification Failed
              </h2>
              <p className="text-sm text-gray-500 mb-6">{message}</p>
              <div className="flex flex-col gap-2">
                <Link
                  to="/register"
                  className="inline-block bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  Register again
                </Link>
                <Link
                  to="/login"
                  className="inline-block text-indigo-600 text-sm font-medium hover:text-indigo-800"
                >
                  Back to login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
