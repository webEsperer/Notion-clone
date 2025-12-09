"use client";

import { useTransition } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { createNewDocument } from "@/actions/actions";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

const NewDocumentButton = () => {
  const [isPending, startTransitions] = useTransition();
  const router = useRouter();

  const handleCreateNewDocument = () => {
    startTransitions(async () => {
      const result = await createNewDocument();
      if (result.success) {
        console.log("Stworzono:", result.docId);
        // router.push(`doc/${result.docId}`);
      }
    });
  };


  return (
    <div className='flex justify-center'>
      {/* To pokaże się TYLKO niezalogowanym - bez błędu hydracji */}
      <SignedOut>
        <SignInButton mode="modal">
          <Button>New Document</Button>
        </SignInButton>
      </SignedOut>

      {/* To pokaże się TYLKO zalogowanym */}
      <SignedIn>
        <Button onClick={handleCreateNewDocument} disabled={isPending}>
          {isPending ? "Creating..." : "New Document"}
        </Button>
      </SignedIn>
    </div>
  );
};
export default NewDocumentButton;
