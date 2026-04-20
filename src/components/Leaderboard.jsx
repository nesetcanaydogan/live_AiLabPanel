import React, { useState, useEffect } from "react";
import { Trophy, Medal, Award } from "lucide-react";
import { getLeaderboard, getUserById } from "../services/api";
import { useAuth } from "../context/AuthContent";

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [userRank, setUserRank] = useState(null); // { rank: 10, data: userObj }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [currentUserProfile, setCurrentUserProfile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 1. Fetch Leaderboard and User Profile in parallel
        const [leaderboardRes, profileRes] = await Promise.all([
          getLeaderboard(),
          getUserById()
        ]);

        const data = leaderboardRes.data || [];
        const profile = profileRes.data;
        setCurrentUserProfile(profile);

        // 2. Sort by totalScore desc
        const sortedAll = [...data].sort((a, b) => b.totalScore - a.totalScore);
        
        // 3. Find user rank using backend fullName
        if (profile && profile.fullName) {
          const rankIndex = sortedAll.findIndex(
            (u) => u.fullName === profile.fullName
          );

          if (rankIndex !== -1) {
            setUserRank({ rank: rankIndex + 1, data: sortedAll[rankIndex] });
          }
        }

        // 4. Take top 3
        const top3 = sortedAll.slice(0, 3);
        setLeaders(top3);
      } catch (err) {
        console.error("Leaderboard data error:", err);
        setError("Liderlik tablosu yüklenemedi.");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="py-8 text-center flex flex-col items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
        <p className="text-gray-400 text-[10px] mt-2 font-bold">Yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return <div className="py-6 text-center text-red-500 text-[10px] font-bold">{error}</div>;
  }

  if (leaders.length === 0) {
    return (
      <div className="py-6 text-center text-gray-500 text-[10px] font-bold">
        Henüz veri bulunmuyor.
      </div>
    );
  }

  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return <Trophy className="text-yellow-500" size={18} />;
      case 1:
        return <Medal className="text-gray-400" size={18} />;
      case 2:
        return <Award className="text-amber-700" size={18} />;
      default:
        return (
          <span className="font-bold text-gray-500 text-xs">{index + 1}</span>
        );
    }
  };

  // Reusable Row Component
  const UserRow = ({ rankIndex, userData, isCurrentUser = false }) => (
    <tr
      className={`transition-all ${isCurrentUser ? "bg-blue-50 border-t-2 border-blue-200 shadow-inner" : "hover:bg-gray-50 border-b border-gray-50"}`}
    >
      {/* Rank Column */}
      <td className="px-1 py-3 text-center w-10">
        <div className="flex items-center justify-center">
          {getRankIcon(rankIndex)}
        </div>
      </td>

      {/* User Column */}
      <td className="px-1 py-3">
        <div className="flex items-center justify-start min-w-0">
          <div className="flex-shrink-0 h-8 w-8">
            {userData.profileImageUrl ? (
              <img
                className={`h-8 w-8 rounded-full object-cover border-2 ${isCurrentUser ? "border-blue-300" : "border-gray-100"}`}
                src={userData.profileImageUrl}
                alt={userData.fullName}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/Group-1.png";
                }}
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-900 text-[10px] font-bold border border-blue-200">
                {userData.fullName ? userData.fullName.charAt(0).toUpperCase() : "?"}
              </div>
            )}
          </div>
          <div className="ml-2 overflow-hidden">
            <div
              className={`text-[11px] font-bold truncate max-w-[100px] sm:max-w-[140px] ${isCurrentUser ? "text-blue-900" : "text-gray-800"}`}
              title={userData.fullName}
            >
              {userData.fullName}
            </div>
            {isCurrentUser && (
              <span className="text-[8px] bg-blue-100 text-blue-700 px-1 rounded-full font-black uppercase tracking-tighter">
                Sen
              </span>
            )}
          </div>
        </div>
      </td>

      {/* Score Column */}
      <td className="px-2 py-3 text-right w-16">
        <span className="text-[10px] font-black text-blue-900 bg-blue-50 px-1.5 py-0.5 rounded-md border border-blue-100">
          {userData.totalScore}
        </span>
      </td>
    </tr>
  );

  return (
    <div className="w-full">
      <div className="w-full overflow-hidden rounded-xl border border-gray-100 shadow-sm bg-white">
        <table className="min-w-full table-fixed">
          <thead className="bg-gray-50 border-b border-gray-100 text-center">
            <tr>
              <th
                scope="col"
                className="w-10 py-2 text-center text-[9px] font-bold text-gray-400 uppercase tracking-tighter"
              >
                #
              </th>
              <th
                scope="col"
                className="py-2 text-left text-[9px] font-bold text-gray-400 uppercase tracking-tighter pl-3"
              >
                Üye
              </th>
              <th
                scope="col"
                className="w-16 py-2 text-center text-[9px] font-bold text-gray-400 uppercase tracking-tighter"
              >
                Puan
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {leaders.map((leader, index) => (
              <UserRow
                key={index}
                rankIndex={index}
                userData={leader}
                isCurrentUser={
                  currentUserProfile && leader.fullName === currentUserProfile.fullName
                }
              />
            ))}

            {/* Separator if user is far down */}
            {userRank && userRank.rank > 4 && (
              <tr>
                <td
                  colSpan="3"
                  className="text-center py-1.5 bg-gray-50/30"
                >
                  <div className="flex items-center justify-center space-x-1 opacity-30">
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  </div>
                </td>
              </tr>
            )}

            {/* Show 4th line if current user is not in top 3 */}
            {userRank && userRank.rank > 3 && (
              <UserRow
                rankIndex={userRank.rank - 1}
                userData={userRank.data}
                isCurrentUser={true}
              />
            )}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-[9px] text-gray-400 font-medium italic text-center">
        * Sıralama anlık olarak güncellenmektedir.
      </p>
    </div>
  );
};

export default Leaderboard;
