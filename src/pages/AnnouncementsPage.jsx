import React, { useState, useEffect } from "react";
import { Bell, CheckCircle, Clock } from "lucide-react";
import { getMyAnnouncements, getAnnouncementById, markAsRead } from "../services/announcementService";
import NotificationItem from "../components/NotificationItem";
import Modal from "../components/Modal";

const AnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
  }, [page]);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const response = await getMyAnnouncements(page, 10); // Page size 10
      const { items, hasNext } = response;
      
      // If it's page 1, replace. If > 1, append.
      setAnnouncements(prev => page === 1 ? items : [...prev, ...items]);
      setHasMore(hasNext);
    } catch (error) {
      console.error("Bildirimler alınamadı", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnnouncementClick = async (summaryItem) => {
    setSelectedAnnouncement(null); // Clear previous
    setDetailLoading(true);
    
    // Open modal immediately with summary data or a loading state
    // We reuse the summary item initially to show something
    setSelectedAnnouncement({ ...summaryItem, isLoading: true });

    try {
      // 1. Mark as read (Fire and forget, or await if crucial)
      if (!summaryItem.isRead) {
        await markAsRead(summaryItem.id);
        // Update local list state to reflect read status
        setAnnouncements(prev => prev.map(item => 
          item.id === summaryItem.id ? { ...item, isRead: true } : item
        ));
      }

      // 2. Get full details
      const fullDetails = await getAnnouncementById(summaryItem.id);
      setSelectedAnnouncement(fullDetails);
    } catch (error) {
      console.error("Detaylar alınamadı", error);
    } finally {
      setDetailLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <Bell className="mr-3 text-blue-900" size={24} />
          Bildirimlerim ve Duyurular
        </h2>

        {/* List */}
        <div className="space-y-4">
          {announcements.length > 0 ? (
            announcements.map((item) => (
              <div key={item.id} className="relative">
                 {/* Unread Indicator */}
                {!item.isRead && (
                  <span className="absolute -left-2 top-4 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
                <NotificationItem 
                  title={item.title}
                  date={formatDate(item.createdAt)}
                  onClick={() => handleAnnouncementClick(item)}
                />
              </div>
            ))
          ) : (
            !loading && (
              <div className="text-center py-10 text-gray-500">
                Henüz bir bildiriminiz yok.
              </div>
            )
          )}
          
          {loading && (
            <p className="text-center text-gray-400 py-4">Yükleniyor...</p>
          )}

          {/* Load More Button */}
          {!loading && hasMore && (
            <button 
              onClick={() => setPage(prev => prev + 1)}
              className="w-full py-3 mt-4 text-blue-900 font-medium hover:bg-blue-50 rounded-lg transition-colors"
            >
              Daha Fazla Yükle
            </button>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      <Modal 
        isOpen={!!selectedAnnouncement} 
        onClose={() => setSelectedAnnouncement(null)}
        title={selectedAnnouncement?.title || "Yükleniyor..."}
      >
        {selectedAnnouncement?.isLoading ? (
          <div className="flex justify-center py-10">
            <span className="text-gray-400">İçerik yükleniyor...</span>
          </div>
        ) : (
          selectedAnnouncement && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-gray-500 border-b border-gray-100 pb-2">
                <span>{formatDate(selectedAnnouncement.createdAt)}</span>
                <span className="flex items-center">
                  {selectedAnnouncement.scope === 0 ? "Genel Duyuru" : 
                   selectedAnnouncement.scope === 1 ? "Proje Duyurusu" : "Kişisel Bildirim"}
                </span>
              </div>
              
              {/* Content - safely render HTML if trusted, or just text */}
              <div 
                className="text-gray-700 text-sm leading-relaxed prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: selectedAnnouncement.content }}
              />
              
              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button 
                  onClick={() => setSelectedAnnouncement(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
                >
                  Kapat
                </button>
              </div>
            </div>
          )
        )}
      </Modal>
    </>
  );
};

export default AnnouncementsPage;
