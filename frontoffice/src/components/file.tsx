import * as React from "react";
import fetch, { Error } from "shared/fetch";
import { API_ENDPOINT } from "shared/endpoints";

const File: React.FC<{ onUpload: (url: string) => void }> = ({ onUpload }) => {
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const handleChange: React.ChangeEventHandler<HTMLInputElement> =
    React.useCallback(
      async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setLoading(true);
        setError(null);
        const file = (e.target.files || [])[0];
        try {
          const { id } = await fetch<{ id: string }>("images", {
            method: "PUT",
            body: file,
          });
          onUpload(`${API_ENDPOINT}images/${id}`);
        } catch (err) {
          setError((err as Error<any>).message || "Could not upload image");
        }
        setLoading(false);
      },
      [setLoading, setError]
    );
  return (
    <>
      <div className="file is-boxed is-fullwidth">
        <label className="file-label">
          <input
            disabled={loading}
            className="file-input"
            type="file"
            onChange={handleChange}
          />
          <span className="file-cta">
            <span className="file-icon">
              <i className="fa-solid fa-upload"></i>
            </span>
            <span className="file-label">
              {loading ? "Uploading..." : "Choose a picture..."}
            </span>
          </span>
        </label>
      </div>
      {error && <span className="is-danger">{error}</span>}
    </>
  );
};

export default File;
