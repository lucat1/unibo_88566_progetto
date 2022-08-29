import { h, useState } from "../h";
import fetch from "shared/fetch";
import { API_ENDPOINT } from "shared/endpoints";

const File = ({ onUpload }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const upload = async (e) => {
    setLoading(true);
    const files = e.target.files;
    const ids = [];
    for await (const file of files) {
      try {
        const { id } = await fetch("images", {
          method: "PUT",
          body: file,
        });
        ids.push(id);
      } catch (err) {
        setError(err.message || "Could not upload image");
      }
    }
    onUpload(ids.map((id) => `${API_ENDPOINT}images/${id}`));
    setLoading(false);
  };
  return h(
    "div",
    {},
    h(
      "div",
      { className: "file is-boxed" },
      h(
        "label",
        { className: "file-label" },
        h("input", {
          className: "file-input",
          type: "file",
          onChange: upload,
          multiple: true,
          disabled: loading || error != null,
        }),
        h(
          "span",
          { className: "file-cta" },
          h(
            "span",
            { className: "file-icon" },
            h("i", { className: "fas fa-upload" })
          ),
          h("span", { className: "file-label" }, "Choose a picture...")
        )
      )
    ),
    error && h("p", { class: "help is-danger" }, error)
  );
};

export default File;
