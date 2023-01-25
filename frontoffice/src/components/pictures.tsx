import * as React from "react";

import File from "./file";

interface PicturesProps {
  pictures: string[];
  picturesAlt: string[];
}

export interface PicturesListProps {
  editable: boolean;
  select: (i: number) => void;
  remove: (i: number) => void;
  add: (url: string) => void;
}

export const PicturesList: React.FC<PicturesProps & PicturesListProps> = ({
  pictures,
  editable,
  picturesAlt,
  select,
  remove,
  add,
}) => (
  <div className="is-flex is-flex-direction-row is-align-items-center is-justify-content-center p-4">
    {pictures.map((picture, i) => (
      <div key={i} className="card mx-4">
        <div
          className="card-image"
          onClick={(_) => select(i)}
          style={{ cursor: "pointer" }}
        >
          <img
            style={{ objectFit: "cover", width: "6rem", height: "6rem" }}
            src={picture}
            alt={picturesAlt[i]}
          />
        </div>
        {editable && (
          <footer className="card-footer">
            <a onClick={(_) => remove(i)} className="card-footer-item">
              Remove
            </a>
          </footer>
        )}
      </div>
    ))}
    {editable && <File onUpload={add} />}
  </div>
);

const Pictures: React.FC<PicturesProps> = ({ pictures, picturesAlt }) => {
  const [selected, setSelected] = React.useState(0);
  return (
    <div className="is-flex is-flex-direction-column container is-max-desktop">
      <div className="card">
        <div className="card-image">
          <figure className="image is-square">
            <img
              style={{ objectFit: "cover" }}
              src={pictures[selected]}
              alt={picturesAlt[selected]}
            />
          </figure>
        </div>
      </div>
      <PicturesList
        pictures={pictures}
        select={setSelected}
        picturesAlt={picturesAlt}
        editable={false}
        remove={(_) => {}}
        add={(_) => {}}
      />
    </div>
  );
};

export default Pictures;
