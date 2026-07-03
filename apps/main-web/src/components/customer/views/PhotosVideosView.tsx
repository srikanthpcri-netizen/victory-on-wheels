import API_BASE_URL from "../../../config/api";
type Attachment = {
  id: string;
  fileUrl: string;
  fileName: string;
  fileType: string;
  category: string;
  notes?: string | null;
};

type Props = {
  attachments: Attachment[];
};

export default function PhotosVideosView({ attachments }: Props) {
  return (
    <section className="customer-card">
      <h2 style={{ marginTop: 0 }}>Photos & Videos</h2>

      {attachments.length === 0 ? (
        <div
          style={{
            padding: 50,
            textAlign: "center",
            border: "2px dashed #ddd",
            borderRadius: 16,
            color: "#777",
          }}
        >
          <h3 style={{ marginTop: 0 }}>No Photos or Videos</h3>
          <p>
            The service center has not uploaded any photos or videos for this
            job yet.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))",
            gap: 20,
          }}
        >
          {attachments.map((file) => (
            <div
              key={file.id}
              style={{
                border: "1px solid #eee",
                borderRadius: 16,
                overflow: "hidden",
                background: "#fff",
              }}
            >
              {file.fileType.startsWith("image") ? (
                <img
                  src={`${API_BASE_URL}${file.fileUrl}`}
                  alt={file.fileName}
                  style={{
                    width: "100%",
                    height: 220,
                    objectFit: "cover",
                  }}
                />
              ) : (
                <video
                  controls
                  style={{
                    width: "100%",
                    height: 220,
                    objectFit: "cover",
                  }}
                >
                  <source
                    src={`https://victory-on-wheels-production.up.railway.app${file.fileUrl}`}
                    type={file.fileType}
                  />
                </video>
              )}

              <div style={{ padding: 16 }}>
                <h4 style={{ margin: 0 }}>{file.category}</h4>

                <p
                  style={{
                    margin: "10px 0 0",
                    color: "#666",
                    wordBreak: "break-word",
                  }}
                >
                  {file.fileName}
                </p>

                {file.notes && (
                  <p style={{ color: "#888", marginTop: 8 }}>{file.notes}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
