"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function Home() {

  const [data, setData] = useState([])

  useEffect(() => {
    api.get("/auth")
      .then(res => setData(res.data))
      .catch(error => console.error(error))
  }, [])

  return (
    <div>
      <h1>Home</h1>

      
      

        {data.map(user => (
          <p key={user.email}>{user.name} || {user.email} || {user.password}
          {user.medias}</p>
        ))}

          

      <Link href="/login">Ir para Login</Link>
    </div>
  );
}
