"use client";

import { MenuIcon } from "lucide-react";
import NewDocumentButton from "./NewDocumentButton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useUser } from "@clerk/nextjs";
import {
  collectionGroup,
  DocumentData,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/firebase";
import { useEffect, useState } from "react";
import SidebarOption from "./SidebarOption";

interface RoomDocument extends DocumentData {
  userId: string;
  roomId: string;
  role: "owner" | "editor";
  createdAt: string;
}

const Sidebar = () => {
  const { user } = useUser();
  const [data, setData] = useState<RoomDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) return;

    // 1. Definicja zapytania
    const roomsQuery = query(
      collectionGroup(db, "rooms"),
      where("userId", "==", user.emailAddresses[0].toString())
    );

    // 2. Nasłuchiwanie (onSnapshot)
    const unsubscribe = onSnapshot(
      roomsQuery,
      (snapshot) => {
        // Transformacja danych: wyciągamy dane + ID dokumentu
        const rooms = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setData(rooms);
        setLoading(false);
      },
      (err) => {
        console.error("Firestore error:", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const menuOptions = (
    <>
      <NewDocumentButton />
      <div className="flex py-4 flex-col space-y-4 md:max-w-36 items-center">
        {data.length === 0 ? (
          <h2 className="text-gray-500 font-semibold text-sm">
            No documents found
          </h2>
        ) : (
          <>
            <h2 className="text-gray-500 font-semibold text-sm flex justify-center">
              My Documents
            </h2>
            {data.map((room) => (
              <SidebarOption
                key={room.roomId}
                id={room.id}
                href={`/doc/${room.id}`}
              />
            ))}
          </>
        )}
      </div>
      
      {data.length > 0 && (
        <>
          <h2 className="text-gray-500 font-semibold text-sm flex justify-center">
            Shared with Me
          </h2>
          {data.map((room) => (
            <SidebarOption
              key={room.roomId}
              id={room.id}
              href={`/doc/${room.id}`}
            />
          ))}
        </>
      )}
    </>
  );

  return (
    <div className="p-2 relative md:p-5 bg-gray-200">
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger>
            <MenuIcon className="p-2 hover:opacity-30" size={40} />
          </SheetTrigger>
          <SheetContent side={"left"} className="flex justify-center">
            <SheetHeader>
              <SheetTitle className="mx-auto">Menu</SheetTitle>
              <div>{menuOptions}</div>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>

      <div className="hidden md:inline">{menuOptions}</div>
    </div>
  );
};
export default Sidebar;
