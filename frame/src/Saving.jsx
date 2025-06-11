import React, { useEffect } from "react";
import useFetch from "./useFetchFromDataBase.jsx";

function Saving({ posX, posY, scene, setIsSaving, playerId }) {
  const { data, loading, error } = useFetch({
    url: "/game/save",
    method: "POST",
    body: {
      playerId,
      playerData: {
        position: { X: posX, Y: posY },
        scene,
      },
    },
  });

  useEffect(() => {
    if (data) {
      setTimeout(() => setIsSaving(false), 1000); // Hide after save
    }
  }, [data, setIsSaving]);

  return (
    <div>
      {loading && <p>Saving...</p>}
      {error && <p>Error: {error}</p>}
      {data && <p>Game saved successfully!</p>}
    </div>
  );
}

export default Saving;
