'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { doc, onSnapshot } from "firebase/firestore"; // Importujemy doc i onSnapshot
import { db } from "@/firebase";
import { useEffect, useState } from "react";
import { DocumentData } from "firebase/firestore";

const SidebarOption = ({ href, id }: { href: string; id: string }) => {
  const [data, setData] = useState<DocumentData | null>(null);
  const pathname = usePathname();
  
  const isActive = href.includes(pathname) && pathname !== "/";

  useEffect(() => {
    if (!id) return;

    const docRef = doc(db, "documents", id);

    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        setData(snapshot.data());
      } else {
        setData(null);
      }
    });

    return () => unsubscribe();
  }, [id]);

  if (!data) return null

  return (
    <Link 
      href={href} 
      className={`border p-2 rounded-md ${
        isActive ? "bg-gray-300 font-bold border-black" : " bg-slate-400 border-gray-400"
      }`}
    >
      <p className="truncate">
        {data.title}
      </p>
    </Link>
  );
};

export default SidebarOption;
