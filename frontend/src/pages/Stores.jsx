import { useEffect, useState } from "react";
import API from "../services/api";

export default function Stores() {
  const [stores, setStores] = useState([]);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await API.get("/stores");
        setStores(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStores();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl mb-4">Stores</h2>
      <ul>
        {stores.map((store) => (
          <li key={store._id} className="border p-2 mb-2">
            <h3 className="text-lg">{store.name}</h3>
            <p>{store.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
