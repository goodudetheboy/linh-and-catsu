import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import "./PhotoPanel.css";
import { useExperienceStore } from "../../store/useExperienceStore";
import { getPhotos, getPhotoUrl, uploadPhoto } from "../../lib/photos";

const CAT_INFO = {
  ri: {
    name: "Ri",
    meta: "1.5 years old · Vietnam · grey British Shorthair",
    avatar: "/textures/ri-papercraft.png",
    accent: "#FF85A1",
  },
  rua: {
    name: "Rua",
    meta: "5 years old · Vietnam · grey British Shorthair",
    avatar: "/textures/rua-papercraft.png",
    accent: "#FFB347",
  },
  bigga: {
    name: "Bigga",
    meta: "2.5 years old · New York · grey tabby",
    avatar: "/textures/bigga-papercraft.png",
    accent: "#64B5F6",
  },
};

const PhotoPanel = () => {
  const panelRef = useRef(null);
  const fileInputRef = useRef(null);
  const isPhotoPanelOpen = useExperienceStore((s) => s.isPhotoPanelOpen);
  const activeCat = useExperienceStore((s) => s.activeCat);
  const closeCatPanel = useExperienceStore((s) => s.closeCatPanel);

  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");

  const loadPhotos = useCallback(async (catName) => {
    if (!catName) return;
    setLoading(true);
    try {
      const files = await getPhotos(catName);
      setPhotos(files.filter((f) => f.name !== ".emptyFolderPlaceholder"));
    } catch {
      setPhotos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isPhotoPanelOpen && activeCat) {
      loadPhotos(activeCat);
    }
  }, [isPhotoPanelOpen, activeCat, loadPhotos]);

  useGSAP(() => {
    if (!panelRef.current) return;
    if (isPhotoPanelOpen) {
      gsap.to(panelRef.current, { x: 0, duration: 0.6, ease: "power3.out" });
    } else {
      gsap.to(panelRef.current, { x: "100%", duration: 0.5, ease: "power3.in" });
    }
  }, [isPhotoPanelOpen]);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !activeCat) return;

    const maxMB = 8;
    if (file.size > maxMB * 1024 * 1024) {
      setUploadStatus(`File too large (max ${maxMB}MB) 😿`);
      return;
    }

    setUploading(true);
    setUploadStatus("Uploading...");
    try {
      await uploadPhoto(activeCat, file);
      setUploadStatus("Uploaded! ♡");
      await loadPhotos(activeCat);
    } catch {
      setUploadStatus("Upload failed. Try again? 😿");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const info = activeCat ? CAT_INFO[activeCat] : null;

  return (
    <div className="photo-panel-overlay">
      <div ref={panelRef} className="photo-panel">
        {info && (
          <>
            <div className="photo-panel__header">
              <img
                className="photo-panel__cat-avatar"
                src={info.avatar}
                alt={info.name}
                style={{ borderColor: info.accent }}
              />
              <div className="photo-panel__header-text">
                <h2
                  className="photo-panel__cat-name"
                  style={{ color: info.accent }}
                >
                  {info.name}'s Gallery ♡
                </h2>
                <p className="photo-panel__cat-meta">{info.meta}</p>
              </div>
              <button className="photo-panel__close" onClick={closeCatPanel}>
                ✕
              </button>
            </div>

            <div className="photo-panel__body">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleUpload}
              />
              <button
                className="photo-panel__upload-btn"
                style={{ background: `linear-gradient(135deg, ${info.accent}, #C86DD8)` }}
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                📸 {uploading ? "Uploading..." : "Add a photo"}
              </button>
              {uploadStatus && (
                <p className="photo-panel__upload-status">{uploadStatus}</p>
              )}

              {loading ? (
                <p className="photo-panel__loading">Loading photos... 🐾</p>
              ) : photos.length === 0 ? (
                <div className="photo-panel__empty">
                  <span className="photo-panel__empty-icon">📷</span>
                  <p className="photo-panel__empty-text">
                    No photos yet!<br />
                    Add the first one above ♡
                  </p>
                </div>
              ) : (
                <div className="photo-panel__grid">
                  {photos.map((photo) => (
                    <div key={photo.name} className="photo-panel__photo-item">
                      <img
                        src={getPhotoUrl(activeCat, photo.name)}
                        alt={photo.name}
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PhotoPanel;
