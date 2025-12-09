"use client";

import { Input } from "@/components/ui/input";
import { useEffect, useState, useTransition } from "react";
import { Button } from "./ui/button";
import { doc, DocumentData, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";

const Document = ({ id }: { id: string }) => {
  const [input, setInput] = useState("");
  const [isUpdating, startTransition] = useTransition();

  const [data, setData] = useState<DocumentData | null>(null);

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

  useEffect(() => {
    if (data) {
      setInput(data.title);
    }
  }, [data]);

  if (!data) {
    return null
  }

  const updateTitle = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      startTransition(async () => {
        await updateDoc(doc(db, "documents", id), {
          title: input.trim(),
        });
      });
    }
  };

  return (
    <div>
      <div className="flex max-w-6xl justify-between items-center pb-5 mx-auto">
        <form onSubmit={updateTitle} className="flex flex-1 space-x-2">
          <Input value={input} onChange={(e) => setInput(e.target.value)} />
          <Button disabled={isUpdating} type="submit">
            {isUpdating ? "Updating..." : "Update"}
          </Button>
        </form>
      </div>
      <div>
        {/* MNgeUsers */}
        {/* avatars */}
      </div>
      {/* Colaborative */}
    </div>
  );
};
export default Document;
