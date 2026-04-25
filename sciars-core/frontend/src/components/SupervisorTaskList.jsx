import { useState } from "react";
import IssueCard from "./IssueCard";
import CameraCapture from "./CameraCapture";
import { updateStatus } from "../services/api";
import toast from "react-hot-toast";

const SupervisorTaskList = ({ tasks = [], loading = false, onStatusChange }) => {
  const [resolveModalTaskId, setResolveModalTaskId] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [proofImage, setProofImage] = useState(null);
  const [proofPreview, setProofPreview] = useState(null);
  const [resolveNote, setResolveNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [imageError, setImageError] = useState("");
  const [showCamera, setShowCamera] = useState(false);

  const handleStartWork = async (taskId) => {
    try {
      await updateStatus(taskId, { status: "In Progress" });
      if (onStatusChange) onStatusChange();
    } catch (err) {
      console.error(err);
    }
  };

  const openResolveModal = (taskId) => {
    setResolveModalTaskId(taskId);
    setProofImage(null);
    setProofPreview(null);
    setResolveNote("");
    setImageError("");
  };

  const closeResolveModal = () => {
    setResolveModalTaskId(null);
    setProofImage(null);
    setProofPreview(null);
    setResolveNote("");
    setImageError("");
  };

  const handleProofImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setImageError("Please upload a valid image file.");
        return;
      }
      setImageError("");
      
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        const image = new Image();
        image.onload = () => {
          const canvas = document.createElement("canvas");
          let width = image.width;
          let height = image.height;
          const MAX_SIZE = 800;

          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(image, 0, 0, width, height);

          // Compress to JPEG with 0.5 quality to ensure small base64 footprint (< 1MiB)
          const dataUrl = canvas.toDataURL("image/jpeg", 0.5);
          setProofPreview(dataUrl);
          setProofImage(dataUrl);
        };
        image.src = readerEvent.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResolveSubmit = async () => {
    if (!proofPreview) {
      setImageError("Proof image is required to mark as resolved.");
      return;
    }

    setSubmitting(true);
    try {
      await updateStatus(resolveModalTaskId, {
        status: "Resolved",
        proofImageUrl: proofPreview,
        supervisorDescription: resolveNote || undefined
      });
      closeResolveModal();
      if (onStatusChange) onStatusChange();
      toast.success("Issue resolved successfully");
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.detail?.message || err?.response?.data?.detail || err.message || "Failed to mark as resolved.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="space-y-4">
        {loading ? (
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/6 ml-auto"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
                <div className="mt-4 flex gap-2">
                  <div className="w-4 h-4 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No tasks assigned.</div>
        ) : tasks.map((task) => (
          <div key={task.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <IssueCard issue={task} onClick={() => setSelectedIssue(task)} />
            <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
              {task.status === "Open" && (
                <button
                  onClick={() => handleStartWork(task.id)}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Start Work
                </button>
              )}
              {task.status === "In Progress" && (
                <button
                  onClick={() => openResolveModal(task.id)}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Mark Resolved
                </button>
              )}
              {(task.status === "Resolved" || task.status === "Closed") && (
                <span className="flex-1 text-center text-sm text-green-600 font-medium py-2">
                  Completed
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Resolve Proof Modal */}
      {resolveModalTaskId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={closeResolveModal}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Mark as Resolved</h3>
                  <p className="text-xs text-gray-500">Upload proof of resolution</p>
                </div>
              </div>
              <button
                onClick={closeResolveModal}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-5">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Proof Image <span className="text-red-500">*</span>
                </label>
                <div className={`relative border-2 border-dashed rounded-lg p-5 text-center transition-colors ${
                  proofPreview
                    ? "border-green-300 bg-green-50"
                    : imageError
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}>
                  {proofPreview ? (
                    <div className="relative inline-block">
                      <img src={proofPreview} alt="Proof" className="max-h-40 rounded-lg mx-auto" />
                      <button
                        type="button"
                        onClick={() => { setProofImage(null); setProofPreview(null); }}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-sm"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="pointer-events-none">
                      <svg className="mx-auto h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="mt-2 text-sm text-gray-500">Click to upload proof image</p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                    </div>
                  )}
                  {!proofPreview && (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProofImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  )}
                </div>
                {!proofPreview && (
                  <button
                    type="button"
                    onClick={() => setShowCamera(true)}
                    className="mt-3 w-full px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Take Photo
                  </button>
                )}
                {imageError && (
                  <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {imageError}
                  </p>
                )}
              </div>
              <CameraCapture
                isOpen={showCamera}
                onClose={() => setShowCamera(false)}
                onCapture={(imageData) => {
                  setProofPreview(imageData);
                  setProofImage(imageData);
                  setImageError("");
                }}
              />

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resolution Note <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe how the issue was resolved..."
                  value={resolveNote}
                  onChange={(e) => setResolveNote(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none text-sm"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
              <button
                onClick={closeResolveModal}
                disabled={submitting}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleResolveSubmit}
                disabled={submitting}
                className="flex-1 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Submit & Resolve
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Issue Detail Popup Modal */}
      {selectedIssue && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
          onClick={() => setSelectedIssue(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto custom-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-gray-900">Issue Details</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                  selectedIssue.status === "Open" ? "bg-red-100 text-red-800 border-red-200" :
                  selectedIssue.status === "In Progress" ? "bg-yellow-100 text-yellow-800 border-yellow-200" :
                  selectedIssue.status === "Resolved" ? "bg-green-100 text-green-800 border-green-200" :
                  "bg-gray-100 text-gray-600 border-gray-200"
                }`}>{selectedIssue.status}</span>
              </div>
              <button
                onClick={() => setSelectedIssue(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-5">
              {/* Image */}
              <div>
                {selectedIssue.imageUrl || selectedIssue.proofImageUrl ? (
                  <img 
                    src={selectedIssue.proofImageUrl || selectedIssue.imageUrl} 
                    alt="Issue Proof" 
                    className="w-full max-h-64 object-contain sm:object-cover rounded-xl border border-gray-200 shadow-sm"
                  />
                ) : (
                  <div className="w-full h-40 bg-gray-50 flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 text-gray-400">
                    <svg className="w-8 h-8 mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm">No image provided</span>
                  </div>
                )}
              </div>

              {/* Category */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Category</p>
                <p className="text-sm font-medium text-gray-800">{selectedIssue.category || "—"}</p>
              </div>

              {/* Description */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Description</p>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedIssue.description || "—"}</p>
              </div>

              {/* Location text */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Location</p>
                <p className="text-sm text-gray-700">{selectedIssue.location?.text || "Not specified"}</p>
              </div>
              
              {/* Supervisor Notes */}
              {selectedIssue.supervisorDescription && (
                <div className="p-4 bg-green-50 border border-green-100 rounded-xl">
                  <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1">Resolution Note</p>
                  <p className="text-sm text-green-800 whitespace-pre-wrap">{selectedIssue.supervisorDescription}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SupervisorTaskList;
