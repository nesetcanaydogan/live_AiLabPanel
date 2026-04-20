import React, { useState, useEffect } from "react";
import { Users, AlertTriangle, LogOut, Loader2 } from "lucide-react";
import {
  forceCheckout,
  getAllUsers,
  getGlobalRoomStats,
} from "../../services/api";

const ListInsideUsersModule = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const [activeRoomId, setActiveRoomId] = useState(
    import.meta.env.VITE_ROOM_ID,
  );

  useEffect(() => {
    fetchInsideUsers();
  }, []);

  const fetchInsideUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Removed broken getRooms() call. Relying on Stats response for Room Context.
      const results = await Promise.allSettled([
        getGlobalRoomStats(),
        getAllUsers({ PageSize: 1000 }),
      ]);

      const statsRes =
        results[0].status === "fulfilled" ? results[0].value : null;
      const allUsersRes =
        results[1].status === "fulfilled" ? results[1].value : null;

      if (!statsRes) {
        throw new Error("Oda istatistikleri alınamadı.");
      }

      const statsData = statsRes.data;

      // Dynamically capture the Room ID from the occupancy stats
      if (statsData?.roomId) {
        setActiveRoomId(statsData.roomId);
      }

      const allUsersList = allUsersRes?.data?.items || allUsersRes?.data || [];
      const people = statsData?.peopleInside || [];

      const normalizedUsers = people.map((fullName) => {
        const foundUser = allUsersList.find(
          (u) =>
            u.fullName?.trim().toLowerCase() === fullName.trim().toLowerCase(),
        );

        return {
          fullName: fullName,
          userId: foundUser?.id || null,
          // Use statsData roomId directly if available, fallback to state
          roomId: statsData?.roomId || activeRoomId,
        };
      });

      setUsers(normalizedUsers);
    } catch (err) {
      console.error("Inside users fetch error:", err);
      setError("Laboratuvardaki kullanıcılar listelenemedi.");
    } finally {
      setLoading(false);
    }
  };

  const handleForceCheckout = async (targetUser) => {
    if (!targetUser.userId) {
      alert(
        `Hata: ${targetUser.fullName} adlı kullanıcının sistem ID'si eşleştirilemedi.`,
      );
      return;
    }

    // Determine which room ID to use (stats provided ID > local state)
    const targetRoomId = targetUser.roomId || activeRoomId;

    if (!targetRoomId) {
      alert("Hata: Oda bilgisi alınamadığı için işlem gerçekleştirilemedi.");
      return;
    }

    if (
      !window.confirm(
        `${targetUser.fullName} adlı kullanıcıyı dışarı çıkarmak istediğinize emin misiniz?`,
      )
    ) {
      return;
    }

    setProcessingId(targetUser.userId);
    try {
      await forceCheckout({
        userId: targetUser.userId,
        roomId: targetRoomId,
      });

      alert("İşlem başarılı.");
      // Small delay to allow backend to process before re-fetching
      setTimeout(() => fetchInsideUsers(), 500);
    } catch (err) {
      console.error("Force checkout error:", err);
      alert(
        `Hata: ${err.response?.data?.message || "Kullanıcı sistemden çıkarılamadı."}`,
      );
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex justify-between items-center mb-6 border-b border-gray-50 pb-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center">
          <Users className="mr-2 text-blue-900" size={24} />
          Laboratuvarda Olanlar
        </h3>
        <button
          onClick={fetchInsideUsers}
          className="text-xs font-bold text-blue-900 hover:underline"
        >
          Listeyi Yenile
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
          <p className="text-gray-400 text-sm mt-2 font-bold tracking-tight uppercase">
            Güncel Liste Alınıyor...
          </p>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-lg text-red-700 flex items-center border border-red-100">
          <AlertTriangle size={20} className="mr-2" />
          {error}
        </div>
      ) : users.length === 0 ? (
        <div className="py-16 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
          <p className="text-gray-400 text-sm italic">
            Şu an laboratuvarda kimse bulunmuyor.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-100 shadow-sm">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50/50">
              <tr>
                <th className="px-6 py-4">Üye Adı</th>
                <th className="px-6 py-4">Durum</th>
                <th className="px-6 py-4 text-right">Yönetim</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 bg-white font-medium">
              {users.map((u, index) => (
                <tr
                  key={index}
                  className="hover:bg-blue-50/30 transition-colors"
                >
                  <td className="px-6 py-4 text-gray-900 flex items-center">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 font-black mr-3 text-[10px] border border-blue-200">
                      {u.fullName ? u.fullName.charAt(0).toUpperCase() : "?"}
                    </div>
                    {u.fullName}
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-green-50 text-green-700 text-[10px] font-black uppercase px-2.5 py-1 rounded border border-green-100 flex items-center w-fit gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      Aktif
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleForceCheckout(u)}
                      disabled={processingId === u.userId}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black tracking-widest transition-all shadow-sm
                        ${
                          processingId === u.userId
                            ? "bg-gray-50 text-gray-300 cursor-not-allowed"
                            : "bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-100"
                        }`}
                    >
                      {processingId === u.userId ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <LogOut size={12} />
                      )}
                      DIŞARI ÇIKAR
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ListInsideUsersModule;
