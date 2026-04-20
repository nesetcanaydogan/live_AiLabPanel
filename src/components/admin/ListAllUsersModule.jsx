import React, { useState, useEffect } from "react";
import { Users, AlertTriangle, Search, Briefcase, Shield } from "lucide-react";
import apiClient, { getAllUsers, getUserProjects } from "../../services/api";

// Sub-component for individual user row to handle its own data fetching (N+1 problem mitigation)
const UserRow = ({ user, index }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserSpecificData = async () => {
      if (!user.id) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        // Fetch projects for this user specifically
        const projRes = await getUserProjects(user.id);
        setProjects(projRes.data || []);
      } catch (err) {
        // console.error(`User ${user.id} data fetch failed`, err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserSpecificData();
  }, [user.id]);

  return (
    <tr className="bg-white hover:bg-gray-50 transition-colors border-b border-gray-50">
      {/* User Info */}
      <td className="px-4 py-4">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            {user.profileImageUrl ? (
              <img 
                className="h-10 w-10 rounded-full object-cover border border-gray-200 shadow-sm" 
                src={user.profileImageUrl} 
                alt={user.fullName} 
                onError={(e) => { e.target.onerror = null; e.target.src = "/Group-1.png"; }}
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-900 font-bold border border-blue-200">
                {user.fullName ? user.fullName.charAt(0).toUpperCase() : "?"}
              </div>
            )}
          </div>
          <div className="ml-4">
            <div className="text-sm font-bold text-gray-900">{user.fullName || "İsimsiz Üye"}</div>
            <div className="text-[11px] text-gray-500 font-medium">{user.email || "E-Posta Yok"}</div>
          </div>
        </div>
      </td>

      {/* Roles */}
      <td className="px-4 py-4">
        <div className="flex flex-wrap gap-1">
          {user.roles && user.roles.length > 0 ? (
            user.roles.map((role, idx) => (
              <span key={idx} className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-100 flex items-center">
                <Shield size={10} className="mr-1" />
                {role}
              </span>
            ))
          ) : (
            <span className="text-gray-400 text-xs italic">Rol Atanmadı</span>
          )}
        </div>
      </td>

      {/* Teams/Projects (Dynamic) */}
      <td className="px-4 py-4">
        {loading ? (
          <div className="flex items-center space-x-2 animate-pulse">
            <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
            <div className="h-2 w-16 bg-gray-100 rounded"></div>
          </div>
        ) : projects.length > 0 ? (
          <div className="flex flex-col gap-1.5">
            {projects.map((team, idx) => (
              <span key={idx} className="text-[11px] font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 inline-flex items-center w-fit">
                <Briefcase size={10} className="mr-1.5 text-blue-600" />
                {team.name}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-gray-400 font-medium text-xs bg-gray-50 px-2 py-0.5 rounded-md">Takım Yok</span>
        )}
      </td>
    </tr>
  );
};

const ListAllUsersModule = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const PAGE_SIZE = 20;

  useEffect(() => {
    fetchAllUsers();
  }, [page]);

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllUsers({
        PageNumber: page,
        PageSize: PAGE_SIZE
      });
      const data = response.data;
      if (data && Array.isArray(data.items)) {
        setUsers(data.items);
        setTotalPages(data.totalPages || 1);
        setTotalCount(data.totalCount || 0);
      } else if (Array.isArray(data)) {
        setUsers(data);
      } else {
        setUsers([]); 
      }
    } catch (err) {
      console.error("Kullanıcı listesi alınamadı:", err);
      setError("Veriler senkronize edilemedi.");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u => 
    (u.fullName && u.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Module Header */}
      <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-center bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <h3 className="text-lg font-black text-gray-900 flex items-center mb-4 sm:mb-0 uppercase tracking-tight">
          <Users className="mr-3 text-blue-900" size={24} />
          Üye Veritabanı
        </h3>
        
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="İsim veya E-Posta Ara..." 
            className="pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-900 focus:bg-white outline-none w-full transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading && page === 1 ? (
        <div className="py-20 text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-900/20 border-t-blue-900"></div>
          <p className="text-gray-500 font-bold text-sm mt-4">Sistem Verileri Alınıyor...</p>
        </div>
      ) : error ? (
        <div className="m-6 bg-red-50 p-4 rounded-xl text-red-700 flex items-center border border-red-100">
          <AlertTriangle size={20} className="mr-3" />
          <span className="font-medium">{error}</span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest pl-6">Üye Bilgisi</th>
                <th className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Yetki Seviyesi</th>
                <th className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Aktif Projeler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredUsers.map((user, index) => (
                <UserRow key={user.id || index} user={user} index={index} />
              ))}
            </tbody>
          </table>
          
          {/* Pagination */}
          <div className="bg-gray-50/30 px-6 py-4 flex items-center justify-between border-t border-gray-100">
            <p className="text-xs font-bold text-gray-400">
              TOPLAM <span className="text-blue-900">{totalCount}</span> KAYIT
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
                className="px-4 py-2 bg-white border border-gray-200 text-[11px] font-black rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-30 transition-all shadow-sm"
              >
                &larr; ÖNCEKİ
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || loading}
                className="px-4 py-2 bg-white border border-gray-200 text-[11px] font-black rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-30 transition-all shadow-sm"
              >
                SONRAKİ &rarr;
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListAllUsersModule;
