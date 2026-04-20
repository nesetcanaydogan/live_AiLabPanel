import React, { useState, useEffect } from "react";
import { CheckCircle, AlertCircle, Award } from "lucide-react";
import apiClient, { getAdminPendingTasks, assignTaskScore } from "../../services/api";
import Modal from "../Modal"; // Assuming a reusable Modal component exists

const TaskScoringModule = () => {
  const [pendingTasks, setPendingTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [scoreMultiplier, setScoreMultiplier] = useState(1.0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchPendingTasks();
  }, []);

  const fetchPendingTasks = async () => {
    try {
      setLoading(true);
      const response = await getAdminPendingTasks();
      setPendingTasks(response.data || []);
    } catch (error) {
      console.error("Bekleyen görevler alınamadı:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignScore = async () => {
    if (!selectedTask) return;
    setIsSubmitting(true);

    try {
      // API Spec: POST to /api/adminscore/tasks/{taskId}/assign-score (raw float/int)
      await assignTaskScore(selectedTask.id, scoreMultiplier);

      // Remove from list
      setPendingTasks((prev) => prev.filter((t) => t.id !== selectedTask.id));
      setSelectedTask(null);
      alert("Puanlama başarılı.");
    } catch (error) {
      console.error("Puanlama hatası:", error);
      alert("Puan verilirken hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-900 flex items-center">
          <Award className="mr-2 text-blue-900" size={24} />
          Bekleyen Görev Puanlamaları
        </h3>
        <button 
          onClick={fetchPendingTasks}
          className="text-sm text-blue-900 font-bold hover:underline"
        >
          Yenile
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-400">Yükleniyor...</div>
      ) : pendingTasks.length === 0 ? (
        <div className="py-12 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-500">
          Şu an puanlanacak bekleyen görev bulunmuyor.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 text-[10px] font-bold uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4">Görev</th>
                <th className="px-6 py-4">Üye</th>
                <th className="px-6 py-4">Tamamlanma</th>
                <th className="px-6 py-4 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 bg-white">
              {pendingTasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900">{task.title}</p>
                    <p className="text-[10px] text-gray-400">{task.projectName}</p>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-700">{task.assigneeName}</td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(task.completedAt).toLocaleDateString("tr-TR")}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelectedTask(task)}
                      className="px-4 py-2 bg-blue-900 text-white rounded-lg font-bold text-xs hover:bg-blue-800 transition-all shadow-sm"
                    >
                      Puanla
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Scoring Modal */}
      <Modal
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        title="Görev Puanını Onayla"
      >
        {selectedTask && (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <p className="text-xs text-blue-700 font-bold uppercase mb-1">Üye</p>
              <p className="text-lg font-bold text-blue-900">{selectedTask.assigneeName}</p>
              <p className="text-sm text-blue-800 mt-2">{selectedTask.title}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Puan Çarpanı (Örn: 1.0 tam puan, 0.5 yarım puan)
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={scoreMultiplier}
                  onChange={(e) => setScoreMultiplier(parseFloat(e.target.value))}
                  className="flex-grow h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-900"
                />
                <span className="text-xl font-black text-blue-900 min-w-[3rem] text-center">
                  {scoreMultiplier.toFixed(1)}x
                </span>
              </div>
              <p className="text-[10px] text-gray-400 mt-2 italic">
                * Görevin zorluk derecesi ve kalitesine göre çarpanı ayarlayabilirsiniz.
              </p>
            </div>

            <button
              onClick={handleAssignScore}
              disabled={isSubmitting}
              className="w-full py-4 bg-blue-900 text-white rounded-xl font-bold hover:bg-blue-800 shadow-lg shadow-blue-100 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "İşleniyor..." : "Puanı Onayla"}
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TaskScoringModule;
