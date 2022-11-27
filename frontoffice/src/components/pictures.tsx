import * as React from "react";

import File from "./file";

interface PicturesProps {
  pictures: string[];
  editable: boolean;
}

export interface PicturesListProps {
  select: (i: number) => void;
  remove: (i: number) => void;
  add: (url: string) => void;
}

export const PicturesList: React.FC<PicturesProps & PicturesListProps> = ({
  pictures,
  editable,
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

const Pictures: React.FC<PicturesProps> = ({ pictures, editable }) => {
  const [selected, setSelected] = React.useState(0);
  return (
    <div className="is-flex is-flex-direction-column container is-max-desktop">
      <div className="card">
        <div className="card-image">
          <figure className="image is-square">
            <img style={{ objectFit: "cover" }} src={pictures[selected]} />
          </figure>
        </div>
      </div>
      <PicturesList
        pictures={pictures}
        editable={editable}
        select={setSelected}
        remove={(_) => {}}
      />
    </div>
  );
};

export default Pictures;
