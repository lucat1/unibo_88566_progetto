import * as React from "react";

interface PicturesProps {
  pictures: string[];
}

const Pictures: React.FC<PicturesProps> = ({ pictures }) => {
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
      <div className="is-flex is-flex-direction-row is-align-items-center is-justify-content-center p-4">
        {pictures.map((picture, i) => (
          <a key={i} onClick={(_) => setSelected(i)}>
            <div
              key="0"
              className="card mx-4"
              style={{ width: "6rem", height: "6rem" }}
            >
              <div className="card-image">
                <img
                  style={{ objectFit: "cover", width: "6rem", height: "6rem" }}
                  src={picture}
                />
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Pictures;
